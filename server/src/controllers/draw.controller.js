import supabase from '../config/supabase.js';
import {
  generateRandomNumbers,
  generateAlgorithmicNumbers,
  checkMatch,
  getMatchType
} from '../services/drawEngine.js';
import {
  calculatePrizePool,
  splitPool,
  calculatePrizePerWinner
} from '../services/prizePool.js';

// GET /api/draws
export const getAllDraws = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('draws')
      .select('*')
      .order('draw_month', { ascending: false });

    if (error) return res.status(400).json({ message: error.message });

    res.json({ draws: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/draws/:id
export const getSingleDraw = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('draws')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Draw not found' });
    }

    res.json({ draw: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/draws/:id/result  — check if logged in user won
export const getUserDrawResult = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('winners')
      .select('*, draws(*)')
      .eq('draw_id', id)
      .eq('user_id', req.userId)
      .single();

    if (error || !data) {
      return res.json({ won: false });
    }

    res.json({
      won:          true,
      match_type:   data.match_type,
      prize_amount: data.prize_amount,
      payout_status: data.payout_status
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
// POST /api/draws  (admin) — create a new draw
export const createDraw = async (req, res) => {
  const { draw_month, logic_type } = req.body;

  if (!draw_month || !logic_type) {
    return res.status(400).json({ message: 'draw_month and logic_type are required' });
  }

  try {
    const { data, error } = await supabase
      .from('draws')
      .insert({ 
        draw_month, 
        logic_type, 
        status: 'pending',
        jackpot_pool: 0
        // numbers is intentionally left out — set during simulate
      })
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });

    res.status(201).json({ message: 'Draw created', draw: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
// POST /api/draws/:id/simulate  (admin)
export const simulateDraw = async (req, res) => {
  const { id } = req.params;

  try {
    // Get draw
    const { data: draw } = await supabase
      .from('draws')
      .select('*')
      .eq('id', id)
      .single();

    if (!draw) return res.status(404).json({ message: 'Draw not found' });

    // Get all scores for algorithmic draw
    const { data: allScores } = await supabase
      .from('scores')
      .select('score');

    // Generate numbers based on logic type
    let numbers;
    if (draw.logic_type === 'algorithmic') {
      numbers = generateAlgorithmicNumbers(allScores || []);
    } else {
      numbers = generateRandomNumbers();
    }

    // Update draw with simulated numbers
    await supabase
      .from('draws')
      .update({ numbers, status: 'simulated' })
      .eq('id', id);

    res.json({ message: 'Draw simulated', numbers });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/draws/:id/publish  (admin)
export const publishDraw = async (req, res) => {
  const { id } = req.params;

  try {
    // Get draw
    const { data: draw } = await supabase
      .from('draws')
      .select('*')
      .eq('id', id)
      .single();

    if (!draw) return res.status(404).json({ message: 'Draw not found' });
    if (!draw.numbers) return res.status(400).json({ message: 'Run simulate first' });

    // Get all active subscribers with their scores
    const { data: subscribers } = await supabase
      .from('subscriptions')
      .select('user_id, plan')
      .eq('status', 'active');

    // Calculate prize pool
    const totalPool = calculatePrizePool(subscribers || []);

    // Get previous jackpot rollover if any
    const { data: lastDraw } = await supabase
      .from('draws')
      .select('jackpot_pool')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(1)
      .single();

    const jackpotRollover = lastDraw?.jackpot_pool || 0;
    const pools = splitPool(totalPool, jackpotRollover);

    // Get all user scores and check matches
    const { data: allUserScores } = await supabase
      .from('scores')
      .select('user_id, score');

    // Group scores by user
    const scoresByUser = {};
    allUserScores?.forEach(s => {
      if (!scoresByUser[s.user_id]) scoresByUser[s.user_id] = [];
      scoresByUser[s.user_id].push(s);
    });

    // Find winners
    const winnersByType = { '5-match': [], '4-match': [], '3-match': [] };

    subscribers?.forEach(sub => {
      const userScores = scoresByUser[sub.user_id] || [];
      const matchCount = checkMatch(userScores, draw.numbers);
      const matchType  = getMatchType(matchCount);

      if (matchType) {
        winnersByType[matchType].push(sub.user_id);
      }
    });

    // Insert winners into db
    const winnersToInsert = [];

    for (const [matchType, userIds] of Object.entries(winnersByType)) {
      const prizePerWinner = calculatePrizePerWinner(pools[matchType], userIds);

      userIds.forEach(userId => {
        winnersToInsert.push({
          draw_id:      id,
          user_id:      userId,
          match_type:   matchType,
          prize_amount: prizePerWinner
        });
      });
    }

    if (winnersToInsert.length > 0) {
      await supabase.from('winners').insert(winnersToInsert);
    }

    // Handle jackpot rollover — if no 5-match winner carry forward
    const newJackpot = winnersByType['5-match'].length === 0 ? pools['5-match'] : 0;

    // Publish draw
    await supabase
      .from('draws')
      .update({
        status:       'published',
        jackpot_pool: newJackpot,
        published_at: new Date()
      })
      .eq('id', id);

    res.json({
      message:  'Draw published',
      numbers:  draw.numbers,
      winners:  winnersByType,
      pools,
      jackpot_rolled_over: newJackpot > 0
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
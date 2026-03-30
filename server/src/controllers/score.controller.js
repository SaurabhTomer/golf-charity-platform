import supabase from '../config/supabase.js';

const MAX_SCORES = 5;

// POST /api/scores
export const addScore = async (req, res) => {
  const { score, played_date } = req.body;

  if (!score || !played_date) {
    return res.status(400).json({ message: 'Score and date are required' });
  }

  if (score < 1 || score > 45) {
    return res.status(400).json({ message: 'Score must be between 1 and 45' });
  }

  try {
    // Get current scores count
    const { data: existing } = await supabase
      .from('scores')
      .select('id, created_at')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: true });

    // If already 5 scores, delete the oldest one
    if (existing && existing.length >= MAX_SCORES) {
      await supabase
        .from('scores')
        .delete()
        .eq('id', existing[0].id);
    }

    // Add new score
    const { data, error } = await supabase
      .from('scores')
      .insert({
        user_id:     req.userId,
        score,
        played_date
      })
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });

    res.status(201).json({ message: 'Score added', score: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/scores
export const getScores = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false }); // most recent first

    if (error) return res.status(400).json({ message: error.message });

    res.json({ scores: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/scores/:id
export const updateScore = async (req, res) => {
  const { score, played_date } = req.body;
  const { id } = req.params;

  if (score && (score < 1 || score > 45)) {
    return res.status(400).json({ message: 'Score must be between 1 and 45' });
  }

  try {
    // Make sure score belongs to this user
    const { data: existing } = await supabase
      .from('scores')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.userId)
      .single();

    if (!existing) {
      return res.status(404).json({ message: 'Score not found' });
    }

    const { data, error } = await supabase
      .from('scores')
      .update({ score, played_date })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: 'Score updated', score: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/scores/:id
export const deleteScore = async (req, res) => {
  const { id } = req.params;

  try {
    // Make sure score belongs to this user
    const { data: existing } = await supabase
      .from('scores')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.userId)
      .single();

    if (!existing) {
      return res.status(404).json({ message: 'Score not found' });
    }

    const { error } = await supabase
      .from('scores')
      .delete()
      .eq('id', id);

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: 'Score deleted' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
import supabase from '../config/supabase.js';

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*, subscriptions(plan, status, renewal_date)')
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ message: error.message });

    res.json({ users: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/users/:id
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*, subscriptions(*), scores(*)')
      .eq('id', id)
      .single();

    if (error || !data) return res.status(404).json({ message: 'User not found' });

    res.json({ user: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/admin/users/:id
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { full_name, role } = req.body;

  try {
    const { data, error } = await supabase
      .from('users')
      .update({ full_name, role })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: 'User updated', user: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: 'User deleted' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/winners
export const getAllWinners = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('winners')
      .select('*, users(full_name, email), draws(draw_month)')
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ message: error.message });

    res.json({ winners: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/admin/winners/:id/verify
export const verifyWinner = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Status must be approved or rejected' });
  }

  try {
    const { data, error } = await supabase
      .from('winners')
      .update({ payout_status: status })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: `Winner ${status}`, winner: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/admin/winners/:id/payout
export const updatePayoutStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('winners')
      .update({ payout_status: 'paid' })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: 'Payout marked as paid', winner: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/analytics
export const getAnalytics = async (req, res) => {
  try {
    const [users, subscriptions, winners, charities] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact' }),
      supabase.from('subscriptions').select('plan, status').eq('status', 'active'),
      supabase.from('winners').select('prize_amount, payout_status'),
      supabase.from('charities').select('id', { count: 'exact' }).eq('is_active', true)
    ]);

    const totalPrizePool = winners.data?.reduce((sum, w) => sum + (w.prize_amount || 0), 0) || 0;
    const totalPaid      = winners.data
      ?.filter(w => w.payout_status === 'paid')
      .reduce((sum, w) => sum + (w.prize_amount || 0), 0) || 0;

    res.json({
      total_users:        users.count || 0,
      active_subscribers: subscriptions.data?.length || 0,
      total_charities:    charities.count || 0,
      total_prize_pool:   totalPrizePool,
      total_paid_out:     totalPaid
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/my-winnings
export const getMyWinnings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('winners')
      .select('*, draws(draw_month)')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ message: error.message });

    res.json({ winnings: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/users/:id/scores
export const getAdminUserScores = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ message: error.message });

    res.json({ scores: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/admin/users/:id/scores
export const addAdminUserScore = async (req, res) => {
  const { id } = req.params;
  const { score, played_date } = req.body;

  if (!score || !played_date) {
    return res.status(400).json({ message: 'Score and date required' });
  }

  if (score < 1 || score > 45) {
    return res.status(400).json({ message: 'Score must be between 1 and 45' });
  }

  try {
    const { data: existing } = await supabase
      .from('scores')
      .select('id, created_at')
      .eq('user_id', id)
      .order('created_at', { ascending: true });

    if (existing && existing.length >= 5) {
      await supabase.from('scores').delete().eq('id', existing[0].id);
    }

    const { data, error } = await supabase
      .from('scores')
      .insert({ user_id: id, score, played_date })
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });

    res.status(201).json({ message: 'Score added', score: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/admin/scores/:id
export const deleteAdminScore = async (req, res) => {
  const { id } = req.params;

  try {
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

// GET /api/admin/users/:id/subscription
export const getUserSubscription = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error || !data) return res.json({ subscribed: false });

    res.json({ subscription: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/admin/users/:id/subscription/cancel
export const cancelUserSubscription = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('user_id', id);

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: 'Subscription cancelled' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
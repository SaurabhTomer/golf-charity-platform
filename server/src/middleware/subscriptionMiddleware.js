import supabase from '../config/supabase.js';

const requireSubscription = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', req.userId)
      .single();

    if (error || !data || data.status !== 'active') {
      return res.status(403).json({ message: 'Active subscription required' });
    }

    next();

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export default requireSubscription;
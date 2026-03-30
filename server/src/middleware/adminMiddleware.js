import supabase from '../config/supabase.js';

const adminOnly = async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.userId)
      .single();

    if (error || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export default adminOnly;
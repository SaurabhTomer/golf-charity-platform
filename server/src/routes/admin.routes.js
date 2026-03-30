import express from 'express';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// User's own winnings
router.get('/my-winnings', protect, async (req, res) => {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = (await import('../config/supabase.js')).default;

  const { data, error } = await supabase
    .from('winners')
    .select('*, draws(draw_month)')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ message: error.message });
  res.json({ winnings: data });
});

export default router;
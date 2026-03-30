import express from 'express';
import protect from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminMiddleware.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllWinners,
  verifyWinner,
  updatePayoutStatus,
  getAnalytics
} from '../controllers/admin.controller.js';

const router = express.Router();

// All admin routes protected
router.use(protect, adminOnly);

// User management
router.get('/users',          getAllUsers);
router.get('/users/:id',      getUserById);
router.put('/users/:id',      updateUser);
router.delete('/users/:id',   deleteUser);

// Winners management
router.get('/winners',              getAllWinners);
router.put('/winners/:id/verify',   verifyWinner);
router.put('/winners/:id/payout',   updatePayoutStatus);

// Analytics
router.get('/analytics',      getAnalytics);

// My winnings (user route — no adminOnly)
router.get('/my-winnings', protect, async (req, res) => {
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
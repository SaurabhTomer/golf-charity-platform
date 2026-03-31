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
  getAnalytics,
  getMyWinnings,
  getAdminUserScores,
  addAdminUserScore,
  deleteAdminScore,
  getUserSubscription,
  cancelUserSubscription
} from '../controllers/admin.controller.js';

const router = express.Router();

// My winnings — user route only
router.get('/my-winnings', protect, getMyWinnings);

// All routes below are admin only
router.use(protect, adminOnly);

// Users
router.get('/users',        getAllUsers);
router.get('/users/:id',    getUserById);
router.put('/users/:id',    updateUser);
router.delete('/users/:id', deleteUser);

// User scores (admin)
router.get('/users/:id/scores',  getAdminUserScores);
router.post('/users/:id/scores', addAdminUserScore);
router.delete('/scores/:id',     deleteAdminScore);

// User subscription (admin)
router.get('/users/:id/subscription',        getUserSubscription);
router.put('/users/:id/subscription/cancel', cancelUserSubscription);

// Winners
router.get('/winners',             getAllWinners);
router.put('/winners/:id/verify',  verifyWinner);
router.put('/winners/:id/payout',  updatePayoutStatus);

// Analytics
router.get('/analytics', getAnalytics);

export default router;
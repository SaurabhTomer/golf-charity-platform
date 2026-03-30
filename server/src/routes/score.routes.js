import express from 'express';
import protect from '../middleware/authMiddleware.js';
import requireSubscription from '../middleware/subscriptionMiddleware.js';
import {
  addScore,
  getScores,
  updateScore,
  deleteScore
} from '../controllers/score.controller.js';

const router = express.Router();

router.post('/',    protect, requireSubscription, addScore);
router.get('/',     protect, requireSubscription, getScores);
router.put('/:id',  protect, requireSubscription, updateScore);
router.delete('/:id', protect, requireSubscription, deleteScore);

export default router;
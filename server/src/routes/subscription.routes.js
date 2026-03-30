import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
  cancelSubscription
} from '../controllers/subscription.controller.js';

const router = express.Router();

router.post('/create-order',   protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/status',          protect, getSubscriptionStatus);
router.post('/cancel',         protect, cancelSubscription);

export default router;
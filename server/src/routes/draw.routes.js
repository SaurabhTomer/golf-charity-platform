import express from 'express';
import protect from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminMiddleware.js';
import {
  getAllDraws,
  getSingleDraw,
  getUserDrawResult,
  simulateDraw,
  publishDraw,
  createDraw
} from '../controllers/draw.controller.js';

const router = express.Router();

// User routes
router.get('/',           protect, getAllDraws);
router.get('/:id',        protect, getSingleDraw);
router.get('/:id/result', protect, getUserDrawResult);

// Admin only routes
router.post('/',              protect, adminOnly, createDraw);
router.post('/:id/simulate',  protect, adminOnly, simulateDraw);
router.post('/:id/publish',   protect, adminOnly, publishDraw);

export default router;
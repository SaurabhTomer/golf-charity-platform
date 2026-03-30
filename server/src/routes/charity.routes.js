import express from 'express';
import protect from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminMiddleware.js';
import {
  getAllCharities,
  getSingleCharity,
  selectCharity,
  updateCharityPercent,
  createCharity,
  updateCharity,
  deleteCharity
} from '../controllers/charity.controller.js';

const router = express.Router();

// Public routes
router.get('/',     getAllCharities);
router.get('/:id',  getSingleCharity);

// User routes
router.post('/select',          protect, selectCharity);
router.put('/contribution',     protect, updateCharityPercent);

// Admin only routes
router.post('/',        protect, adminOnly, createCharity);
router.put('/:id',      protect, adminOnly, updateCharity);
router.delete('/:id',   protect, adminOnly, deleteCharity);

export default router;
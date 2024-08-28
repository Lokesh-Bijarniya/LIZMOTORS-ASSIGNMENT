// routes/userProgress.js
import express from 'express';
import { getUserProgress, initializeUserProgress, updateUserProgress } from '../controllers/userProgressController.js';
import { protect } from '../middleware/verifyToken.js';
import { getNextVideo } from '../controllers/videoController.js';

const router = express.Router();

// Get user progress
router.get('/:userId',protect, getUserProgress);

router.post('/initialize/:userId',protect, initializeUserProgress);

router.get('/next/:userId', protect, getNextVideo);

// Update user progress
router.post('/update', protect, updateUserProgress);

export default router;

import Router from 'express';
import { getVideos, addVideo, getVideoById} from '../controllers/videoController.js';
import { protect } from '../middleware/verifyToken.js';

const router = Router();

router.get('/', getVideos);
router.get('/:id',protect, getVideoById); 
router.post('/add-video', addVideo);
// router.get('/progress/:userId', getUserProgress);
// router.post('/progress', updateUserProgress);

export default router;

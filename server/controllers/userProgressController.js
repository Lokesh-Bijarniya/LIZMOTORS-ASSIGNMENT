import UserProgress from '../models/UserProgress.js';
import Video from '../models/Video.js';

// Get user progress for a specific user
export const getUserProgress = async (req, res) => {
  const { userId } = req.params;
  try {
    const progress = await UserProgress.find({ userId }).populate('videoId');
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update user progress (set progress and mark as completed if applicable)
export const updateUserProgress = async (req, res) => {
  const { userId, videoId, progress } = req.body;

  try {
    let userProgress = await UserProgress.findOne({ userId, videoId });

    if (!userProgress) {
      userProgress = new UserProgress({ userId, videoId, progress });
      if (progress === 100) {
        userProgress.completed = true;
      }
    } else {
      userProgress.progress = progress;
      userProgress.completed = progress >= 100;
    }

    await userProgress.save();
    res.status(200).json(userProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Initialize user progress for all videos
export const initializeUserProgress = async (req, res) => {
  const { userId } = req.params;
  try {
    const allVideos = await Video.find().sort({ order: 1 });

    if (!allVideos || allVideos.length === 0) {
      return res.status(404).json({ message: 'No videos available to initialize progress.' });
    }

    // Check if user progress already exists
    const existingProgress = await UserProgress.findOne({ userId });

    if (!existingProgress) {
      // Initialize progress for all videos
      const initialProgress = allVideos.map(video => ({
        userId,
        videoId: video._id,
        progress: 0,
        completed: false
      }));

      await UserProgress.insertMany(initialProgress);

      // Return the first video as the starting point
      res.status(201).json({
        message: 'User progress initialized successfully',
        nextVideo: allVideos[0]
      });
    } else {
      // Determine the next video to watch
      const userProgress = await UserProgress.find({ userId }).populate('videoId').exec();
      const incompleteProgress = userProgress.filter(progress => !progress.completed);

      if (incompleteProgress.length === 0) {
        // All videos are completed, handle accordingly
        return res.status(200).json({
          message: 'All videos completed',
          nextVideo: null
        });
      }

      // Find the next video to watch
      const nextVideo = await Video.findOne({
        _id: { $in: incompleteProgress.map(p => p.videoId._id) }
      }).sort({ order: 1 }).exec();

      res.status(200).json({
        message: 'User progress already exists',
        nextVideo: nextVideo || allVideos[0]  // Fallback to the first video if no next video is found
      });
    }
  } catch (error) {
    console.error('Error initializing user progress:', error);
    res.status(500).json({ message: 'Failed to initialize user progress.', error });
  }
};

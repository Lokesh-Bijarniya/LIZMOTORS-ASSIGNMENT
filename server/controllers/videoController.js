import Video from '../models/Video.js';
import UserProgress from '../models/UserProgress.js';

// Fetch all videos in the correct order
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort('order');
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
export const getNextVideo = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user progress
    const userProgress = await UserProgress.find({ userId }).populate('videoId').exec();

    // Fetch all videos
    const allVideos = await Video.find().sort({ order: 1 }).exec();

    if (!userProgress || userProgress.length === 0) {
      // Initialize progress for all videos if no progress data exists
      const initialProgress = allVideos.map(video => ({
        userId,
        videoId: video._id,
        progress: 0,
        completed: false,
      }));

      await UserProgress.insertMany(initialProgress);

      // Return the first video
      return res.status(200).json(allVideos[0]);
    }

    // Determine the next video
    const incompleteProgress = userProgress.filter(progress => !progress.completed);

    // If there are no incomplete videos, all videos are completed
    if (incompleteProgress.length === 0) {
      return res.status(200).json({ message: 'All videos completed', nextVideo: null });
    }

    // Determine the next video
    const nextVideo = await Video.findOne({ _id: { $in: incompleteProgress.map(p => p.videoId._id) } })
      .sort({ order: 1 })
      .exec();

    // If no incomplete video is found, return the first video
    if (!nextVideo) {
      return res.status(200).json({ message: 'No next video found', nextVideo: allVideos[0] });
    }

    res.status(200).json(nextVideo);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};





// Fetch a specific video by ID, ensuring the previous video is completed
export const getVideoById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Ensure the previous video is completed
    const previousVideo = await Video.findOne({ order: video.order - 1 });
    if (previousVideo) {
      const previousProgress = await UserProgress.findOne({
        userId,
        videoId: previousVideo._id,
      });

      if (!previousProgress || !previousProgress.completed) {
        return res.status(403).json({
          message: 'You must complete the previous video before watching this one.',
        });
      }
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add a new video
export const addVideo = async (req, res) => {
  try {
    const { title, url } = req.body;
    const lastVideo = await Video.findOne().sort('-order');
    const order = lastVideo ? lastVideo.order + 1 : 1;

    const newVideo = new Video({ title, url, order });
    await newVideo.save();

    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// models/UserProgress.js
import mongoose from 'mongoose';

const UserProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  // lastWatched: { type: Number, default: 0 },
  progress: { type: Number, default: 0 }, 
  completed: { type: Boolean, default: false },
});

const UserProgress = mongoose.model('UserProgress', UserProgressSchema);
export default UserProgress;

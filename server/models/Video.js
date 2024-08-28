import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: String,
  url: String,
  order: { type: Number, required: true },
});

export default mongoose.model('Video', videoSchema);

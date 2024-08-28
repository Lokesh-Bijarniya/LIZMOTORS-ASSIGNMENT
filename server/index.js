import express from 'express';
import mongoose from 'mongoose';
import videoRoutes from './routes/videoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import UserProgress from './routes/userProgress.js';

dotenv.config();
const app = express();
app.use(cors());

mongoose.connect(process.env.MONGODB_URL).then(()=> console.log("Connected to MongoDB")).catch((err) => console.log(err));

app.use(express.json());
app.use('/api/videos', videoRoutes); 
app.use('/api/user', authRoutes);
app.use('/api/user-progress',UserProgress);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utility/axiosConfig';
import { useAuth } from '../context/AuthContext';
import LockIcon from '@mui/icons-material/Lock';

function VideoLibrary() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [nextVideo, setNextVideo] = useState(null);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchVideos() {
      try {
        // Fetch videos
        const { data: videosData } = await axiosInstance.get('/videos');
        setVideos(videosData);

        // Fetch user progress
        const { data: progressData } = await axiosInstance.get(`/user-progress/${user._id}`);
        setUserProgress(progressData);

        // Determine the next video based on progress
        const { data: nextVideoData } = await axiosInstance.get(`/user-progress/next/${user._id}`);
        setNextVideo(nextVideoData);
      } catch (error) {
        console.error('Error fetching videos or progress:', error);
        setError('Failed to load videos.');
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading videos...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Note about locked videos */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
        <p className="font-bold">Note:</p>
        <p>To view locked videos, you need to watch all videos in sequence.</p>
      </div>

      <h1 className="text-3xl font-bold mb-6">Video Library</h1>
      <ul className="space-y-4">
        {videos.map((video) => {
          // Check if the video is unlocked
          const isUnlocked = userProgress.some(progress => progress.videoId._id === video._id && progress.completed);
          return (
            <li key={video._id} className="flex items-center">
              <Link
                to={`/videos/${video._id}`}
                className={`flex-1 p-4 rounded-md transition-all ${
                  isUnlocked || video._id === nextVideo?._id
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
                onClick={(e) => {
                  if (!isUnlocked && video._id !== nextVideo?._id) {
                    e.preventDefault();
                    alert('You need to complete the previous videos first.');
                  }
                }}
              >
                {video.title}
              </Link>
              {!isUnlocked && (
                <span className="ml-4 text-sm text-gray-500"><LockIcon/></span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default VideoLibrary;

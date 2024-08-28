import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utility/axiosConfig';
import { useAuth } from '../context/AuthContext';

const VideoPlayer = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data } = await axiosInstance.get(`/videos/${id}`);
        setVideoUrl(data.url);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching video:', error);
        setError('Failed to load the video.');
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await axiosInstance.get(`/user-progress/${user._id}`);
        const videoProgress = data.find((progress) => progress.videoId._id === id);
        if (videoProgress) {
          setCurrentTime((videoProgress.progress / 100) * duration);
        }
      } catch (error) {
        console.error('Error fetching user progress:', error);
      }
    };
    fetchProgress();
  }, [id, user._id, duration]);

  useEffect(() => {
    const videoElement = document.querySelector('video');
    if (!videoElement) return;

    const updateProgress = () => {
      setCurrentTime(videoElement.currentTime);
      setDuration(videoElement.duration);
    };

    const intervalId = setInterval(() => {
      updateProgress();
    }, 1000);

    videoElement.addEventListener('timeupdate', updateProgress);

    return () => {
      clearInterval(intervalId);
      videoElement.removeEventListener('timeupdate', updateProgress);
    };
  }, [videoUrl]);

  useEffect(() => {
    const saveProgress = async () => {
      try {
        const progressPercentage = (currentTime / duration) * 100;
        await axiosInstance.post('/user-progress/update', {
          userId: user._id,
          videoId: id,
          progress: progressPercentage,
          completed: progressPercentage === 100,
        });
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    };

    if (duration > 0) {
      saveProgress();
    }
  }, [currentTime, duration, id, user._id]);

  const handleEnded = async () => {
    try {
      await axiosInstance.post('/user-progress/update', {
        userId: user._id,
        videoId: id,
        progress: 100,
        completed: true,
      });

      const { data } = await axiosInstance.get(`/user-progress/next/${user._id}`);
      if (data && data._id) {
        navigate(`/videos/${data._id}`);
      } else {
        console.log('No next video found');
      }
    } catch (error) {
      console.error('Error saving progress or fetching next video:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading video...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Back button */}
      <div className="mb-4">
        <button
          className="flex items-center text-blue-500 hover:text-blue-700"
          onClick={() => navigate(-1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      </div>

      {/* Video player */}
      <div className="flex justify-center">
        <video
          controls
          width="800"
          onEnded={handleEnded}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onLoadedData={(e) => e.currentTarget.currentTime = currentTime}
          className="rounded shadow-lg mb-6"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Descriptive paragraph */}
      <div className=" mx-auto text-center bg-gray-200 rounded-lg border-x-4 border-gray-600">
        <h2 className="text-xl font-bold py-2">About This Video</h2>
        <p className="text-gray-700 py-2">
          This video is part of your interactive training module. Watch the entire video to unlock the next in sequence.
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust import path if needed
import axiosInstance from '../utility/axiosConfig';
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';

const Dashboard = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user || !user._id) {
        console.error('User not logged in or userId is missing');
        return;
      }
      try {
        const { data } = await axiosInstance.get(`/user-progress/${user._id}`);
        setProgressData(data);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      }
    };
    fetchProgress();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <Typography variant="h4" className="text-gray-800 font-bold mb-6">
        Your Progress
      </Typography>
      {progressData.length > 0 ? (
        progressData.map((progress) => {
          const progressPercentage = progress.completed
            ? 100
            : progress.progress; // Use the progress field directly from the backend

          return (
            <Card key={progress.videoId._id} className="mb-4 shadow-lg p-4">
              <CardContent className="flex items-center">
                {/* Circular Progress Indicator */}
                <Box position="relative" display="inline-flex">
                  <CircularProgress
                    variant="determinate"
                    value={progressPercentage}
                    size={60}
                    thickness={5}
                    className="text-blue-500 border rounded-full"
                  />
                  <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography
                      variant="caption"
                      component="div"
                      color="textSecondary"
                      className="font-bold"
                    >
                      {`${Math.round(progressPercentage)}%`}
                    </Typography>
                  </Box>
                </Box>

                {/* Video Title and Progress Text */}
                <div className="ml-4">
                  <Typography variant="h6" className="font-bold mb-2">
                    {progress.videoId.title}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {progress.completed ? 'Completed' : `Progress: ${progressPercentage.toFixed(2)}%`}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Typography variant="body1" className="text-gray-500">
          No progress data available.
        </Typography>
      )}
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth(); // Adjust based on how you handle authentication state
  
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }
  
  return element; // Render the protected route component
};

export default ProtectedRoute;

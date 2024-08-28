import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../utility/axiosConfig';

// Create the AuthContext
const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to login the user
  const login = async (credentials) => {
    try {
      const { data } = await axiosInstance.post('/user/login', credentials);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Function to register the user
  const register = async (userData) => {
    try {
      const { data } = await axios.post('/api/auth/register', userData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  // Function to logout the user
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // Check if user is logged in when component mounts
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('userInfo'));
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

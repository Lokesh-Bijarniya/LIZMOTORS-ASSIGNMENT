import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', 
  timeout: 10000,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optionally, add a response interceptor for handling errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors
    if (error.response && error.response.status === 401) {
      // Unauthorized, handle token expiration or redirection
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// client/src/services/api.js

import axios from 'axios';

// Create an Axios instance with default configurations
const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Handle request errors globally (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle specific error statuses here
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('srs_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized error handling: normalize the message and force logout on 401.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    if (status === 401) {
      localStorage.removeItem('srs_token');
      localStorage.removeItem('srs_user');
      const onAuthPage = window.location.pathname === '/login' || window.location.pathname === '/signup';
      if (!onAuthPage) {
        window.location.href = '/login?sessionExpired=1';
      }
    }

    return Promise.reject({ status, message, raw: error });
  }
);

export default api;

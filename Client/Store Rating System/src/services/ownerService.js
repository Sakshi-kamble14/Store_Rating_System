import api from './api';

// GET /api/owner/dashboard
export const getDashboard = async () => {
  const { data } = await api.get('/owner/dashboard');

  return data.data.stores;
};
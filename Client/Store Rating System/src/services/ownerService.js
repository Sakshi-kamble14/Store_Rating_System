import api from './api';

// GET /api/owner/dashboard — average rating + raters, per store owned by this user
export const getDashboard = async () => {
  const { data } = await api.get('/owner/dashboard');
  return data.data.stores; // [{ storeId, storeName, address, averageRating, raters: [...] }]
};

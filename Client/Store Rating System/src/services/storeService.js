import api from './api';

// GET /api/stores?name=&address=&sortBy=&sortOrder=&page=&limit=
// Requires authentication (any logged-in role). Includes overallRating and myRating.
export const getStores = async (params = {}) => {
  const { data } = await api.get('/stores', { params });
  return data; // { results, total, page, totalPages, data: { stores } }
};

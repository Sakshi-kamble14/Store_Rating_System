import api from './api';

// GET /api/ratings/my
export const getMyRatings = async () => {
  const { data } = await api.get('/ratings/my');
  return data.data.ratings;
};

// POST /api/ratings — creates, or updates if the user already rated this store
export const submitRating = async ({ store_id, rating }) => {
  const { data } = await api.post('/ratings', { store_id, rating });
  return data.data.rating;
};

// PATCH /api/ratings/:id
export const updateRating = async (id, rating) => {
  const { data } = await api.patch(`/ratings/${id}`, { rating });
  return data.data.rating;
};

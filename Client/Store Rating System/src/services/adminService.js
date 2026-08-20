import api from './api';

// GET /api/admin/dashboard
export const getDashboard = async () => {
  const { data } = await api.get('/admin/dashboard');
  return data.data; // { totalUsers, totalStores, totalRatings }
};

// GET /api/admin/users?name=&email=&address=&role=&sortBy=&sortOrder=&page=&limit=
export const getUsers = async (params = {}) => {
  const { data } = await api.get('/admin/users', { params });
  return data; // { results, total, page, totalPages, data: { users } }
};

// POST /api/admin/users
export const createUser = async ({ name, email, password, address, role }) => {
  const { data } = await api.post('/admin/users', { name, email, password, address, role });
  return data.data.user;
};

// GET /api/admin/users/:id
export const getUserById = async (id) => {
  const { data } = await api.get(`/admin/users/${id}`);
  return data.data; // { user: { ...user, stores }, rating }
};

// GET /api/admin/stores?name=&email=&address=&sortBy=&sortOrder=&page=&limit=
export const getStores = async (params = {}) => {
  const { data } = await api.get('/admin/stores', { params });
  return data; // { results, total, page, totalPages, data: { stores } }
};

// POST /api/admin/stores
export const createStore = async ({ name, email, address, owner_id }) => {
  const { data } = await api.post('/admin/stores', { name, email, address, owner_id });
  return data.data.store;
};

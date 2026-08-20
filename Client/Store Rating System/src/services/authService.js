import api from './api';

// POST /api/auth/signup — public users are always created as USER
export const signup = async ({ name, email, password, address }) => {
  const { data } = await api.post('/auth/signup', { name, email, password, address });
  return data;
};

// POST /api/auth/login
export const login = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

// GET /api/auth/me
export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.data.user;
};

// POST /api/auth/logout
export const logout = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

// PATCH /api/auth/update-password
export const updatePassword = async ({ currentPassword, newPassword }) => {
  const { data } = await api.patch('/auth/update-password', { currentPassword, newPassword });
  return data;
};

// Mirrors Server/validators/common.validator.js and auth/rating/store validators
// so the client gives the same feedback the backend will ultimately enforce.

const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;']/;

export const validateName = (value) => {
  const v = (value || '').trim();
  if (!v) return 'Name is required';
  if (v.length < 20 || v.length > 60) return 'Name must be between 20 and 60 characters';
  return '';
};

export const validateEmail = (value) => {
  const v = (value || '').trim();
  if (!v) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(v)) return 'Must be a valid email address';
  return '';
};

export const validateAddress = (value) => {
  const v = (value || '').trim();
  if (!v) return 'Address is required';
  if (v.length > 400) return 'Address must not exceed 400 characters';
  return '';
};

export const validatePassword = (value) => {
  const v = value || '';
  if (!v) return 'Password is required';
  if (v.length < 8 || v.length > 16) return 'Password must be between 8 and 16 characters';
  if (!/[A-Z]/.test(v)) return 'Password must contain at least one uppercase letter';
  if (!SPECIAL_CHAR_REGEX.test(v)) return 'Password must contain at least one special character';
  return '';
};

export const validateRequired = (value, label = 'This field') => {
  if (value === undefined || value === null || String(value).trim() === '') {
    return `${label} is required`;
  }
  return '';
};

export const validateRating = (value) => {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 5) return 'Rating must be between 1 and 5';
  return '';
};

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

const TOKEN_KEY = 'srs_token';
const USER_KEY = 'srs_user';

const roleHome = (role) => {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'OWNER':
      return '/owner/dashboard';
    default:
      return '/user/dashboard';
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [initializing, setInitializing] = useState(true);

  const persistSession = (token, nextUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  // Re-validate the stored token against GET /api/auth/me on first load.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setInitializing(false);
      return;
    }
    authService
      .getMe()
      .then((freshUser) => {
        localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
        setUser(freshUser);
      })
      .catch(() => {
        clearSession();
      })
      .finally(() => setInitializing(false));
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    persistSession(res.token, res.data.user);
    return res.data.user;
  };

  const signup = async (payload) => {
    const res = await authService.signup(payload);
    persistSession(res.token, res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore network errors on logout — clear the session locally regardless
    }
    clearSession();
  };

  const updatePassword = async (payload) => {
    const res = await authService.updatePassword(payload);
    persistSession(res.token, res.data.user);
    return res.data.user;
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      initializing,
      login,
      signup,
      logout,
      updatePassword,
      roleHome
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

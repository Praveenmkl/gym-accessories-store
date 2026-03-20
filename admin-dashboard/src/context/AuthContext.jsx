import { createContext, useContext, useMemo, useState } from 'react';
import api from '../api/client.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('admin_user');
    return raw ? JSON.parse(raw) : null;
  });

  const clearSession = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken('');
    setUser(null);
  };

  // If a stale non-admin session exists from earlier builds, remove it.
  if (token && user && user.role !== 'admin') {
    clearSession();
  }

  const login = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    let data;

    try {
      const response = await api.post('/auth/admin-login', {
        email: normalizedEmail,
        password: normalizedPassword,
      });
      data = response.data;
    } catch (error) {
      if (error?.response?.status !== 404) {
        throw error;
      }

      // Fallback for older backend instances that do not yet expose /admin-login.
      const fallback = await api.post('/auth/login', {
        email: normalizedEmail,
        password: normalizedPassword,
      });
      if (fallback?.data?.user?.role !== 'admin') {
        throw new Error('Admin access required');
      }
      data = fallback.data;
    }

    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    clearSession();
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token) && user?.role === 'admin',
      login,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};

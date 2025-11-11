import React, { createContext, useState, useEffect } from 'react';
import API from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const res = await API.get('/auth/profile');
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    setUser(res.data);
    return res.data;
  };

  const register = async (email, password) => {
    const res = await API.post('/auth/register', { email, password });
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    await API.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, reloadProfile: loadProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

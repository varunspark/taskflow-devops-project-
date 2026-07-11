import React, { createContext, useContext, useState } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('taskflow_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    persistSession(res.data);
    return res.data;
  };

  const register = async (username, email, password, fullName) => {
    const res = await api.post('/auth/register', { username, email, password, fullName });
    persistSession(res.data);
    return res.data;
  };

  const persistSession = (data) => {
    localStorage.setItem('taskflow_token', data.token);
    const userInfo = { id: data.userId, username: data.username, fullName: data.fullName };
    localStorage.setItem('taskflow_user', JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { post } from '../utils/api';
import { Spin } from 'antd';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Example endpoint to validate and fetch user info
          const { data } = await post('/auth/validate', { token }, false);
          setUser(data.user); // Set user data
        } catch (err) {
          console.error('Token validation failed:', err);
          localStorage.removeItem('token'); // Remove invalid token
        }
      }
      setLoading(false); // Set loading to false after initialization
    };

    initializeUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await post('/auth/login', { email, password }, false);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await post('/auth/register', { name, email, password }, false);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

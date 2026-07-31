"use client";

import { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { setAuthToken, removeAuthToken, getAuthToken } from '../utils/storage';
import { toast } from 'sonner';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await authService.getMe();
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      removeAuthToken();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { token, ...userData } = response.data;
      setAuthToken(token);
      setUser(userData);
      toast.success('Logged in successfully!');
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { token, ...newUserData } = response.data;
      setAuthToken(token);
      setUser(newUserData);
      toast.success('Registered successfully!');
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    router.push('/login');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
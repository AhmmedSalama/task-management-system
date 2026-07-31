import axiosInstance from '../lib/axios';

export const authService = {
  // تسجيل الدخول
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  // تسجيل حساب جديد
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  // جلب بيانات المستخدم الحالي
  getMe: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },
};
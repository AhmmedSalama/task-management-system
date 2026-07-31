import axios from 'axios';
import { getAuthToken } from '../utils/storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor لإضافة التوكن في أي ريكويست رايح للباك إند
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken(); // هنجيب التوكن من الـ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor للتعامل مع الـ Responses (مثلاً لو التوكن انتهى)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // لو غير مصرح ليه، ممكن نمسح التوكن ونوجهه لتسجيل الدخول
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
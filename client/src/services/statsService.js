import axiosInstance from '../lib/axios';

export const statsService = {
  getStats: async () => {
    const response = await axiosInstance.get('/stats');
    return response.data;
  },
};
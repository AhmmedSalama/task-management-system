import axiosInstance from '../lib/axios';

export const taskService = {
  // جلب كل المهام الشاملة (من كل المشاريع) مع الفلاتر
  getAllTasks: async (params = {}) => {
    const response = await axiosInstance.get('/tasks', { params });
    return response.data;
  },

  // جلب كل المهام الخاصة بمشروع معين مع الفلاتر
  getTasksByProject: async (projectId, params = {}) => {
    const response = await axiosInstance.get(`/tasks/${projectId}`, { params });
    return response.data;
  },
  
  // إنشاء مهمة جديدة
  createTask: async (taskData) => {
    const response = await axiosInstance.post('/tasks', taskData);
    return response.data;
  },
  
  // تحديث بيانات مهمة
  updateTask: async (taskId, taskData) => {
    const response = await axiosInstance.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  // تحديث حالة المهمة فقط
  updateTaskStatus: async (taskId, status) => {
    const response = await axiosInstance.put(`/tasks/${taskId}/status`, { status });
    return response.data;
  },
  
  // حذف مهمة
  deleteTask: async (taskId) => {
    const response = await axiosInstance.delete(`/tasks/${taskId}`);
    return response.data;
  }
};
import axiosInstance from '../lib/axios';

export const taskService = {
  getAllTasks: async (params = {}) => {
    const response = await axiosInstance.get('/tasks', { params });
    return response.data;
  },

  getTasksByProject: async (projectId, params = {}) => {
    const response = await axiosInstance.get(`/tasks/${projectId}`, { params });
    return response.data;
  },
  
  createTask: async (taskData) => {
    const response = await axiosInstance.post('/tasks', taskData);
    return response.data;
  },
  
  updateTask: async (taskId, taskData) => {
    const response = await axiosInstance.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  updateTaskStatus: async (taskId, status) => {
    const response = await axiosInstance.put(`/tasks/${taskId}/status`, { status });
    return response.data;
  },
  
  deleteTask: async (taskId) => {
    const response = await axiosInstance.delete(`/tasks/${taskId}`);
    return response.data;
  }
};
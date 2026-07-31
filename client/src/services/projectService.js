import axiosInstance from '../lib/axios';

export const projectService = {
  getProjects: async (params = {}) => {
    const response = await axiosInstance.get('/projects', { params });
    return response.data;
  },
  
  getProjectById: async (id) => {
    const response = await axiosInstance.get(`/projects/${id}`);
    return response.data;
  },
  
  createProject: async (projectData) => {
    const response = await axiosInstance.post('/projects', projectData);
    return response.data;
  },
  
  updateProject: async (id, projectData) => {
    const response = await axiosInstance.put(`/projects/${id}`, projectData);
    return response.data;
  },
  
  deleteProject: async (id) => {
    const response = await axiosInstance.delete(`/projects/${id}`);
    return response.data;
  },

  addMember: async (projectId, memberData) => {
    const response = await axiosInstance.post(`/projects/${projectId}/members`, memberData);
    return response.data;
  },

  removeMember: async (projectId, userId) => {
    const response = await axiosInstance.delete(`/projects/${projectId}/members/${userId}`);
    return response.data;
  }
};
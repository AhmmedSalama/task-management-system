"use client";

import { createContext, useState, useCallback } from 'react';
import { projectService } from '../services/projectService';
import { toast } from 'sonner';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // دالة جلب المشاريع (بتدعم البحث والترتيب)
  const fetchProjects = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await projectService.getProjects(params);
      setProjects(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  // دالة الحذف
  const deleteProject = async (id) => {
    try {
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success('Project deleted successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete project');
      return false;
    }
  };

  return (
    <ProjectContext.Provider value={{ projects, loading, fetchProjects, deleteProject }}>
      {children}
    </ProjectContext.Provider>
  );
};
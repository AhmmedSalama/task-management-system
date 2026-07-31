"use client";

import { createContext, useState, useContext, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { toast } from 'sonner';

export const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, tasksState] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // جلب مهام مشروع محدد
  const fetchTasks = useCallback(async (projectId, params = {}) => {
    setLoadingTasks(true);
    try {
      const response = await taskService.getTasksByProject(projectId, params);
      tasksState(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch tasks');
      tasksState([]);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  // جلب كل المهام (للجدول العام)
  const fetchAllTasks = useCallback(async (params = {}) => {
    setLoadingTasks(true);
    try {
      const response = await taskService.getAllTasks(params);
      setAllTasks(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch tasks');
      setAllTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  // إضافة مهمة
  const addTask = async (taskData) => {
    try {
      const response = await taskService.createTask(taskData);
      tasksState((prev) => [response, ...prev]);
      toast.success('Task created successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
      return false;
    }
  };

  // تعديل مهمة
  const editTask = async (taskId, taskData) => {
    try {
      const response = await taskService.updateTask(taskId, taskData);
      tasksState((prev) => prev.map((t) => (t._id === taskId ? response : t)));
      setAllTasks((prev) => prev.map((t) => (t._id === taskId ? response : t)));
      toast.success('Task updated successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
      return false;
    }
  };

  // تغيير حالة المهمة
  const changeTaskStatus = async (taskId, newStatus) => {
    const previousTasks = [...tasks];
    const previousAllTasks = [...allTasks];
    
    tasksState((prev) => prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
    setAllTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
    
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
    } catch (error) {
      tasksState(previousTasks);
      setAllTasks(previousAllTasks);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  // حذف مهمة
  const removeTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      tasksState((prev) => prev.filter((t) => t._id !== taskId));
      setAllTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  return (
    <TaskContext.Provider 
      value={{ 
        tasks, 
        allTasks, 
        loadingTasks, 
        fetchTasks, 
        fetchAllTasks, 
        addTask, 
        editTask, 
        changeTaskStatus, 
        removeTask 
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
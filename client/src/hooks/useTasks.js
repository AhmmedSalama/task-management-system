"use client";

import { useTasks as useTaskContext } from '../contexts/TaskContext';

export const useTasks = () => {
  return useTaskContext();
};
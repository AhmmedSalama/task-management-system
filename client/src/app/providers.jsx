"use client";

import { AuthProvider } from '../contexts/AuthContext';
import { ProjectProvider } from '../contexts/ProjectContext';
import { TaskProvider } from '../contexts/TaskContext';
import { Toaster } from 'sonner';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ProjectProvider>
        <TaskProvider>
          <Toaster position="top-right" richColors />
          {children}
        </TaskProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}
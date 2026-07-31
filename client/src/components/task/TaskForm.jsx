"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { taskSchema } from '../../validations/taskSchema';
import { useTasks } from '../../hooks/useTasks';
import { projectService } from '../../services/projectService';
import Link from 'next/link';

export default function TaskForm({ projectId }) {
  const router = useRouter();
  const { addTask } = useTasks();
  const [projectMembers, setProjectMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'To Do',
      priority: 'Medium',
      assignee: '',
      dueDate: '',
    },
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await projectService.getProjectById(projectId);
        const membersList = [res.data.owner, ...(res.data.members || [])];
        setProjectMembers(membersList);
      } catch (error) {
        toast.error('Failed to load project members');
      } finally {
        setLoadingMembers(false);
      }
    };
    if (projectId) fetchMembers();
  }, [projectId]);

  const onSubmit = async (data) => {
    const taskData = {
      ...data,
      projectId,
      assignee: data.assignee && data.assignee !== '' ? data.assignee : null,
      dueDate: data.dueDate && data.dueDate !== '' ? data.dueDate : null,
    };
    
    const success = await addTask(taskData);
    if (success) {
      router.push(`/dashboard/projects/${projectId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            {...register('title')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
            placeholder="e.g., Fix Navigation Bug"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            {...register('description')}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 resize-none"
            placeholder="Details about the task..."
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select {...register('status')} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white">
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select {...register('priority')} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
          <select 
            {...register('assignee')} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white"
            disabled={loadingMembers}
          >
            <option value="">Unassigned</option>
            {projectMembers.map(member => (
              <option key={member._id} value={member._id}>{member.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            {...register('dueDate')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
        <Link
          href={`/dashboard/projects/${projectId}`}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center min-w-[120px]"
        >
          {isSubmitting ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
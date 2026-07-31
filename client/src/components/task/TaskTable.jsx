"use client";

import { useEffect, useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { format } from 'date-fns';
import { Filter, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function TaskTable() {
  const { allTasks, loadingTasks, fetchAllTasks } = useTasks();
  
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (priorityFilter) params.priority = priorityFilter;
    
    if (typeof fetchAllTasks === 'function') {
      fetchAllTasks(params);
    }
  }, [fetchAllTasks, statusFilter, priorityFilter]);

  const getStatusColor = (status) => {
    if (status === 'Done') return 'bg-green-100 text-green-700';
    if (status === 'In Progress') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'text-red-700 bg-red-50 border-red-200';
    if (priority === 'Medium') return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-green-700 bg-green-50 border-green-200';
  };

  const tasksList = Array.isArray(allTasks) ? allTasks : [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
          <Filter size={16} />
          <span>Filters:</span>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 flex-1 sm:flex-none bg-white"
          >
            <option value="">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-sm border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 flex-1 sm:flex-none bg-white"
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white border-b border-gray-200 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-semibold">Task Title</th>
              <th className="px-6 py-4 font-semibold">Project</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Priority</th>
              <th className="px-6 py-4 font-semibold">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loadingTasks ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center">
                  <span className="animate-spin inline-block h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></span>
                </td>
              </tr>
            ) : tasksList.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No tasks found matching your filters.
                </td>
              </tr>
            ) : (
              tasksList.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 max-w-[250px] truncate" title={task.title}>
                      {task.title}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/projects/${task.project?._id}`} className="text-blue-600 hover:underline">
                      {task.project?.name || 'Unknown Project'}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded border text-xs font-bold ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Calendar size={14} />
                      {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No Date'}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
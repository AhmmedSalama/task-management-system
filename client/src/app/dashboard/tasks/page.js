"use client";

import { useEffect, useState } from 'react';
import { taskService } from '../../../services/taskService';
import { toast } from 'sonner';
import { CheckSquare, ChevronLeft, ChevronRight, Trash2, AlertTriangle, X } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Custom modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const res = await taskService.getAllTasks(params);
      setTasks(res.data || []);
      setPages(res.pages || 1);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, statusFilter, priorityFilter]);

  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      setIsDeleting(true);
      await taskService.deleteTask(taskToDelete);
      toast.success('Task deleted successfully');
      setDeleteModalOpen(false);
      setTaskToDelete(null);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
          <p className="text-gray-500 text-sm">Overview of all tasks across your accessible projects.</p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <CheckSquare size={48} className="mx-auto mb-2 opacity-40" />
            <p>No tasks found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500">
                  <th className="p-4 font-semibold">Task Title</th>
                  <th className="p-4 font-semibold">Project</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Priority</th>
                  <th className="p-4 font-semibold">Due Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tasks.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{t.title}</td>
                    <td className="p-4">
                      {t.project?._id ? (
                        <Link 
                          href={`/dashboard/projects/${t.project._id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {t.project.name}
                        </Link>
                      ) : (
                        <span className="text-gray-600">N/A</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                        t.status === 'Done' ? 'bg-green-100 text-green-700' :
                        t.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                        t.priority === 'High' ? 'bg-red-100 text-red-700' :
                        t.priority === 'Medium' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      {t.dueDate ? format(new Date(t.dueDate), 'MMM d, yyyy') : 'No date'}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteClick(t._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || loading}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <span className="text-sm text-gray-600 font-medium">
          Page {page} of {pages || 1}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
          disabled={page >= pages || loading}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>

      {/* Custom Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
                  <AlertTriangle size={22} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Delete Task</h3>
              </div>
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 text-sm">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTask}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Delete Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTasks } from '../../hooks/useTasks';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, Calendar, AlertCircle, AlertTriangle, X } from 'lucide-react';
import EditTaskModal from './EditTaskModal';

export default function TaskBoard({ projectId }) {
  const { tasks, loadingTasks, fetchTasks, changeTaskStatus, removeTask } = useTasks();
  const [editingTask, setEditingTask] = useState(null);

  // Custom modal states for task deletion
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  const columns = ['To Do', 'In Progress', 'Done'];

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'text-red-700 bg-red-100 border-red-200';
    if (priority === 'Medium') return 'text-amber-700 bg-amber-100 border-amber-200';
    return 'text-green-700 bg-green-100 border-green-200';
  };

  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      setIsDeleting(true);
      await removeTask(taskToDelete);
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Failed to delete task", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loadingTasks) {
    return (
      <div className="flex justify-center py-20">
        <span className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Project Tasks</h2>
        <Link
          href={`/dashboard/tasks/create?projectId=${projectId}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm transition-colors"
        >
          <Plus size={16} />
          <span>New Task</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((columnStatus) => {
          const columnTasks = (tasks || []).filter((t) => t.status === columnStatus);
          
          return (
            <div key={columnStatus} className="bg-gray-50 rounded-xl p-4 border border-gray-200 min-h-[400px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">{columnStatus}</h3>
                <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-4">
                {columnTasks.length === 0 ? (
                  <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-sm">
                    No tasks here
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <div key={task._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 truncate pr-2" title={task.title}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => setEditingTask(task)}
                            className="text-gray-400 hover:text-blue-600 p-1 transition-colors"
                            title="Edit Task"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(task._id)}
                            className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                            title="Delete Task"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {task.description && (
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="text-[10px] flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                            <Calendar size={10} />
                            {format(new Date(task.dueDate), 'MMM d')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <AlertCircle size={12} />
                          <span className="truncate max-w-[80px]" title={task.assignee?.name || 'Unassigned'}>
                            {task.assignee?.name || 'Unassigned'}
                          </span>
                        </div>
                        
                        <select
                          value={task.status}
                          onChange={(e) => changeTaskStatus(task._id, e.target.value)}
                          className="text-xs border-gray-300 rounded px-1 py-0.5 bg-gray-50 text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
                        >
                          {columns.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {editingTask && (
        <EditTaskModal 
          task={editingTask} 
          projectId={projectId} 
          isOpen={!!editingTask} 
          onClose={() => setEditingTask(null)} 
        />
      )}

      {/* Custom Confirmation Modal for Task Deletion */}
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
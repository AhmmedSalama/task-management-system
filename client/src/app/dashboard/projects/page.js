"use client";

import { useEffect, useState } from 'react';
import { projectService } from '../../../services/projectService';
import Link from 'next/link';
import { Plus, Folder, Trash2, ChevronLeft, ChevronRight, Search, AlertTriangle, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '../../../hooks/useAuth';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Custom modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectService.getProjects({ page, search, limit: 6 });
      setProjects(res.data || []);
      setPages(res.pages || 1);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, search]);

  const handleDeleteClick = (e, id) => {
    e.preventDefault();
    setProjectToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      setIsDeleting(true);
      await projectService.deleteProject(projectToDelete);
      toast.success('Project deleted successfully');
      setDeleteModalOpen(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 text-sm">Manage your team projects and workspaces.</p>
        </div>
        <Link
          href="/dashboard/projects/create"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors text-sm shadow-sm"
        >
          <Plus size={18} />
          New Project
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></span>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          <Folder size={48} className="mx-auto mb-2 opacity-40" />
          <p>No projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => {
            const isAdminOrOwner = user?.role === 'Admin' || p.owner?._id === user?._id || p.owner === user?._id;
            return (
              <Link
                key={p._id}
                href={`/dashboard/projects/${p._id}`}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate max-w-[200px]">
                      {p.name}
                    </h2>
                    {isAdminOrOwner && (
                      <button
                        onClick={(e) => handleDeleteClick(e, p._id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {p.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-4">
                  <span>Members: {p.members?.length || 0}</span>
                  <span>{format(new Date(p.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1 || loading}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="text-sm text-gray-600 font-medium">
            Page {page} of {pages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
            disabled={page === pages || loading}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
                  <AlertTriangle size={22} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Delete Project</h3>
              </div>
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 text-sm">
              Are you sure you want to delete this project? All associated tasks and data will be permanently removed.
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
                onClick={confirmDeleteProject}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
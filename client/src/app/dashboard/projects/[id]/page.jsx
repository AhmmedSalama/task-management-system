"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { projectService } from '../../../../services/projectService';
import { useAuth } from '../../../../hooks/useAuth';
import ProjectMembers from '../../../../components/project/ProjectMembers';
import TaskBoard from '../../../../components/task/TaskBoard';
import { ChevronRight, Edit, ArrowLeft, Trash2, AlertTriangle, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Custom modal states for deleting project
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await projectService.getProjectById(id);
        setProject(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProjectDetails();
  }, [id]);

  const confirmDeleteProject = async () => {
    try {
      setIsDeleting(true);
      await projectService.deleteProject(project._id);
      toast.success('Project deleted successfully');
      router.push('/dashboard/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error || 'Project not found'}</p>
        <button onClick={() => router.push('/dashboard/projects')} className="text-blue-600 hover:underline">
          Go back to projects
        </button>
      </div>
    );
  }

  const isAdminOrOwner = user?.role === 'Admin' || project.owner?._id === user?._id;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/dashboard/projects" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <ArrowLeft size={16} />
            Projects
          </Link>
          <ChevronRight size={16} />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{project.name}</span>
        </div>
        
        {isAdminOrOwner && (
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/projects/${project._id}/edit`}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <Edit size={16} />
              Edit Project
            </Link>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <Trash2 size={16} />
              Delete Project
            </button>
          </div>
        )}
      </div>

      {/* Project Details Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h1>
        <p className="text-gray-600 whitespace-pre-wrap mb-6">
          {project.description || 'No description provided.'}
        </p>
        
        <div className="flex items-center gap-6 text-sm border-t border-gray-100 pt-4">
          <div>
            <span className="text-gray-500 block mb-1">Created By</span>
            <span className="font-medium text-gray-900">{project.owner?.name}</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-1">Created At</span>
            <span className="font-medium text-gray-900">
              {format(new Date(project.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      </div>

      {/* Two Columns Layout: Members & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Members Column */}
        <div className="lg:col-span-1">
          <ProjectMembers 
            project={project} 
            setProject={setProject} 
            isAdminOrOwner={isAdminOrOwner} 
          />
        </div>

        {/* Tasks Column (Task Board) */}
        <div className="lg:col-span-2">
          <TaskBoard projectId={project._id} />
        </div>
      </div>

      {/* Custom Confirmation Modal for Project Deletion */}
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
              Are you sure you want to delete <span className="font-semibold text-gray-900">{project.name}</span>? All tasks and member associations will be permanently removed.
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
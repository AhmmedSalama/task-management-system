"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { projectService } from '../../../../../services/projectService';
import ProjectForm from '../../../../../components/project/ProjectForm';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectService.getProjectById(id);
        setProject(response.data);
      } catch (error) {
        router.push('/dashboard/projects');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard/projects" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
          <ArrowLeft size={16} />
          Projects
        </Link>
        <ChevronRight size={16} />
        <Link href={`/dashboard/projects/${id}`} className="hover:text-blue-600 transition-colors">
          Project Details
        </Link>
        <ChevronRight size={16} />
        <span className="text-gray-900 font-medium">Edit Project</span>
      </div>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
        <p className="text-gray-500 text-sm mt-1">Update your project details below.</p>
      </div>

      <ProjectForm initialData={project} isEditing={true} />
    </div>
  );
}
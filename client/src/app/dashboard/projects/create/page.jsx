import ProjectForm from '../../../../components/project/ProjectForm';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Create Project - Task Management',
};

export default function CreateProjectPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard/projects" className="hover:text-blue-600 transition-colors">
          Projects
        </Link>
        <ChevronRight size={16} />
        <span className="text-gray-900 font-medium">Create New</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details below to set up a new workspace.</p>
      </div>

      <ProjectForm />
    </div>
  );
}
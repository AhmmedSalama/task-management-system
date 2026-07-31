"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import TaskForm from '../../../../components/task/TaskForm';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateTaskPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get('projectId');

  // لو مفيش projectId في الرابط، نرجعه لصفحة المشاريع
  if (!projectId) {
    if (typeof window !== 'undefined') router.push('/dashboard/projects');
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href={`/dashboard/projects/${projectId}`} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
          <ArrowLeft size={16} />
          Project Details
        </Link>
        <ChevronRight size={16} />
        <span className="text-gray-900 font-medium">New Task</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
        <p className="text-gray-500 text-sm mt-1">Add a new task to your project board.</p>
      </div>

      <TaskForm projectId={projectId} />
    </div>
  );
}
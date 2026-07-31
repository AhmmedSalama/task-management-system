"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { projectService } from '../../services/projectService';
import { projectSchema } from '../../validations/projectSchema';
import Link from 'next/link';

export default function ProjectForm({ initialData = null, isEditing = false }) {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await projectService.updateProject(initialData._id, data);
        toast.success('Project updated successfully');
      } else {
        await projectService.createProject(data);
        toast.success('Project created successfully');
      }
      // نرجع لصفحة المشاريع بعد النجاح
      router.push('/dashboard/projects');
      router.refresh(); // عشان نجبر الصفحة تعمل إعادة تحميل للبيانات الجديدة
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      {/* Project Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('name')}
          className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors ${
            errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
          }`}
          placeholder="e.g., E-commerce Redesign"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Project Description Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows="4"
          className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors resize-none ${
            errors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
          }`}
          placeholder="Brief details about the project goals and scope..."
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <Link
          href="/dashboard/projects"
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
        >
          {isSubmitting ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            isEditing ? 'Save Changes' : 'Create Project'
          )}
        </button>
      </div>
    </form>
  );
}
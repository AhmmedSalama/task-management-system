"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // أثناء تحميل بيانات المستخدم من الـ API
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></span>
      </div>
    );
  }

  // لو مفيش مستخدم، مش هنعرض حاجة لحد ما الـ useEffect تحوله
  if (!user) {
    return null;
  }

  // لو المستخدم مسجل، اعرض المحتوى
  return children;
}
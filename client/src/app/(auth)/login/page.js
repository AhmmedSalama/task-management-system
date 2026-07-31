"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '../../../components/forms/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm">
            Please sign in to manage your tasks and projects.
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}
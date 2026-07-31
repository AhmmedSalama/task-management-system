"use client";

import { useAuth } from '../../../hooks/useAuth';
import { User, Mail, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">View your account information and role.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8 flex flex-col sm:flex-row items-center gap-6 border-b border-gray-100 bg-gray-50">
          <div className="h-24 w-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-1 mt-1">
              <Mail size={16} />
              {user.email}
            </p>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
            <div className="flex items-center gap-2 text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <User size={18} className="text-gray-400" />
              <span className="font-medium">{user.name}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
            <div className="flex items-center gap-2 text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <Mail size={18} className="text-gray-400" />
              <span className="font-medium">{user.email}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Account Role</label>
            <div className="flex items-center gap-2 text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <Shield size={18} className={user.role === 'Admin' ? 'text-blue-600' : 'text-gray-400'} />
              <span className="font-medium">{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
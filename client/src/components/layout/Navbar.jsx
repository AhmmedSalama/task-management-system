"use client";

import { useAuth } from '../../hooks/useAuth';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <h2 className="text-xl font-semibold text-gray-800">Task Management</h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border">
          <User size={16} />
          <span className="font-medium">{user?.name}</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-1">
            {user?.role}
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
}
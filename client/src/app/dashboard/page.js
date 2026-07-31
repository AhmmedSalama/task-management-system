"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { statsService } from '../../services/statsService';
import { toast } from 'sonner';
import { FolderKanban, CheckSquare, Clock, CheckCircle2, Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await statsService.getStats();
        setStats(res.data);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></span>
      </div>
    );
  }

  const completionRate = stats?.totalTasks > 0 
    ? Math.round((stats.doneTasks / stats.totalTasks) * 100) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'User'}! 👋</h1>
          <p className="text-blue-100 text-sm mt-1">Here is what is happening across your projects today.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/projects"
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors backdrop-blur-sm border border-white/20"
          >
            Manage Projects
          </Link>
          <Link
            href="/dashboard/tasks"
            className="bg-white text-blue-600 hover:bg-blue-50 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            View All Tasks
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Projects[cite: 10] */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Projects</p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-2">{stats?.totalProjects || 0}</h3>
          </div>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <FolderKanban size={24} />
          </div>
        </div>

        {/* Total Tasks[cite: 10] */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Tasks</p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-2">{stats?.totalTasks || 0}</h3>
          </div>
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
            <CheckSquare size={24} />
          </div>
        </div>

        {/* In Progress Tasks[cite: 10] */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">In Progress</p>
            <h3 className="text-3xl font-extrabold text-amber-600 mt-2">{stats?.inProgressTasks || 0}</h3>
          </div>
          <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
            <Clock size={24} />
          </div>
        </div>

        {/* Completed Tasks[cite: 10] */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completed</p>
            <h3 className="text-3xl font-extrabold text-green-600 mt-2">{stats?.doneTasks || 0}</h3>
          </div>
          <div className="p-4 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
        </div>

        {/* Total Users (Admin Only)[cite: 10] */}
        {user?.role === 'Admin' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">System Users</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{stats?.totalUsers || 0} Registered Users</h3>
              </div>
            </div>
            <Link
              href="/dashboard/admin/users"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              Manage Users &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* Analytics & Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Completion Progress */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Task Completion Overview</h2>
            <p className="text-xs text-gray-500 mb-6">Track your team overall productivity and finished milestones.</p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-gray-700">Completion Rate</span>
                  <span className="text-blue-600 font-bold">{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-center">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500">To Do</p>
                  <p className="text-lg font-bold text-gray-800 mt-0.5">{stats?.todoTasks || 0}</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl">
                  <p className="text-xs text-amber-600">In Progress</p>
                  <p className="text-lg font-bold text-amber-700 mt-0.5">{stats?.inProgressTasks || 0}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-xl">
                  <p className="text-xs text-green-600">Done</p>
                  <p className="text-lg font-bold text-green-700 mt-0.5">{stats?.doneTasks || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Summary Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-2">Workspace Summary</h2>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              You are currently viewing data across all accessible projects. Keep tasks updated to maintain optimal team velocity.
            </p>
          </div>
          <div className="p-4 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm flex items-center gap-3">
            <AlertCircle size={20} className="text-blue-400 shrink-0" />
            <p className="text-xs text-gray-300">Role: <span className="text-white font-semibold">{user?.role}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
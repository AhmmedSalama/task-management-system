"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { userService } from '../../../../services/userService';
import { toast } from 'sonner';
import { Users, Folder, CheckSquare, Shield, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await userService.getAllUsers({ page: currentPage, limit: 8 });
        setUsersList(res.data || []);
        setTotalPages(res.pages || 1);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load users');
      } finally {
        setLoadingUsers(false);
      }
    };

    if (user?.role === 'Admin') {
      fetchUsers();
    }
  }, [user, currentPage]);

  const handleSelectUser = async (userId) => {
    setSelectedUserId(userId);
    setLoadingDetails(true);
    try {
      const res = await userService.getUserDetails(userId);
      setUserDetails(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load user details');
    } finally {
      setLoadingDetails(false);
    }
  };

  if (user?.role !== 'Admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Shield size={48} className="text-red-500 mb-2" />
        <h1 className="text-xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-500 text-sm mt-1">You do not have permission to view this page. Admins only.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
          <Shield size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin - Users Dashboard</h1>
          <p className="text-gray-500 text-sm">Manage system users and inspect their projects and assigned tasks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="p-4 bg-gray-50 border-b border-gray-100 font-semibold text-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>System Users</span>
              </div>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <div className="divide-y divide-gray-100 min-h-[400px]">
              {loadingUsers ? (
                <div className="flex justify-center py-20">
                  <span className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></span>
                </div>
              ) : usersList.length === 0 ? (
                <p className="p-6 text-center text-sm text-gray-400">No users found.</p>
              ) : (
                usersList.map((u) => (
                  <div
                    key={u._id}
                    onClick={() => handleSelectUser(u._id)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedUserId === u._id ? 'bg-blue-50/60 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-gray-900">{u.name}</p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          u.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                      <Mail size={12} />
                      {u.email}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loadingUsers}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span className="text-xs text-gray-500 font-medium">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || loadingUsers}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:col-span-2 min-h-[600px]">
          {loadingDetails ? (
            <div className="flex justify-center items-center h-[400px]">
              <span className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></span>
            </div>
          ) : userDetails ? (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{userDetails.user.name}</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <Mail size={14} />
                    {userDetails.user.email}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    userDetails.user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {userDetails.user.role}
                </span>
              </div>

              <div>
                <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2 mb-3">
                  <Folder size={18} className="text-blue-600" />
                  <span>Associated Projects ({userDetails.projects.length})</span>
                </h3>
                {userDetails.projects.length === 0 ? (
                  <p className="text-xs text-gray-400 bg-gray-50 p-4 rounded-lg">No projects found for this user.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto">
                    {userDetails.projects.map((p) => (
                      <Link
                        key={p._id}
                        href={`/dashboard/projects/${p._id}`}
                        className="p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all text-sm space-y-1 block group"
                      >
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {p.name}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">{p.description || 'No description'}</p>
                        <div className="text-[10px] text-gray-400 pt-1 flex justify-between">
                          <span>Owner: {p.owner?.name || 'Unknown'}</span>
                          <span>{format(new Date(p.createdAt), 'MMM d, yyyy')}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2 mb-3">
                  <CheckSquare size={18} className="text-green-600" />
                  <span>Assigned Tasks ({userDetails.tasks.length})</span>
                </h3>
                {userDetails.tasks.length === 0 ? (
                  <p className="text-xs text-gray-400 bg-gray-50 p-4 rounded-lg">No tasks assigned to this user.</p>
                ) : (
                  <div className="space-y-2 max-h-[250px] overflow-y-auto">
                    {userDetails.tasks.map((t) => (
                      <div key={t._id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm flex justify-between items-center">
                        <div className="space-y-0.5">
                          <p className="font-medium text-gray-900">{t.title}</p>
                          <p className="text-xs text-gray-500">Project: <span className="font-medium text-gray-700">{t.project?.name || 'N/A'}</span></p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          t.status === 'Done' ? 'bg-green-100 text-green-700' :
                          t.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
              <Users size={48} className="mb-2 opacity-30" />
              <p className="text-sm">Select a user from the left list to view their projects and tasks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
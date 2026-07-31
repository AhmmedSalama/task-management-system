"use client";

import { useState } from 'react';
import { projectService } from '../../services/projectService';
import { toast } from 'sonner';
import { UserPlus, UserMinus, ShieldAlert } from 'lucide-react';

export default function ProjectMembers({ project, setProject, isAdminOrOwner }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const response = await projectService.addMember(project._id, { email });
      setProject(response.data);
      setEmail('');
      toast.success('Member added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;

    try {
      const response = await projectService.removeMember(project._id, userId);
      setProject(response.data);
      toast.success('Member removed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove member');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
        <p className="text-xs text-gray-500 mt-1">({project.members?.length || 0} Members)</p>
      </div>

      {isAdminOrOwner && (
        <form onSubmit={handleAddMember} className="p-4 border-b border-gray-100">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Add via Email
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md outline-none focus:border-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors disabled:opacity-70"
            >
              {loading ? (
                <span className="animate-spin block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <UserPlus size={16} />
              )}
            </button>
          </div>
        </form>
      )}

      <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
        {/* Owner */}
        <div className="p-4 flex items-center justify-between bg-blue-50/30">
          <div>
            <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
              {project.owner?.name}
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">
                Owner
              </span>
            </p>
            <p className="text-xs text-gray-500">{project.owner?.email}</p>
          </div>
        </div>

        {/* Members */}
        {project.members?.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">
            No additional members yet.
          </div>
        ) : (
          project.members?.map((member) => (
            <div key={member._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500">{member.email}</p>
              </div>
              {isAdminOrOwner && (
                <button
                  onClick={() => handleRemoveMember(member._id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  title="Remove Member"
                >
                  <UserMinus size={16} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
      
      {!isAdminOrOwner && (
        <div className="p-3 bg-gray-50 text-xs text-gray-500 flex items-center gap-2 border-t border-gray-100">
          <ShieldAlert size={14} className="text-amber-500" />
          Only Admins or the Project Owner can manage members.
        </div>
      )}
    </div>
  );
}
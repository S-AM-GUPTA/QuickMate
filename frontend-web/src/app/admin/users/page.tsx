"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { User, Shield, ShieldAlert, CheckCircle, Search, Trash2, FileText, ExternalLink } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to load users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleVerifyToggle = async (userId: string) => {
    try {
      await api.patch(`/admin/users/${userId}/verify`);
      setUsers(users.map(u => u.id === userId ? { ...u, isVerified: !u.isVerified } : u));
    } catch (error) {
      console.error("Failed to toggle verification", error);
      alert("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this user and all their tasks/bids?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error("Failed to delete user", error);
      alert("Failed to delete user");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Registered Users</h2>
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-64"
          />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-slate-200 px-6 gap-6 bg-slate-50/50">
        <button
          onClick={() => setRoleFilter("all")}
          className={`py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${roleFilter === "all" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          All Users
        </button>
        <button
          onClick={() => setRoleFilter("customer")}
          className={`py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${roleFilter === "customer" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Customers
        </button>
        <button
          onClick={() => setRoleFilter("helper")}
          className={`py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${roleFilter === "helper" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Mates (Helpers)
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200 font-bold">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Helper Stats</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading users...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No users found</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'helper' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'helper' ? (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                           <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">⭐ {typeof user.rating === 'number' ? user.rating.toFixed(1) : "5.0"}</span>
                           <span className="text-[10px] text-slate-500 font-semibold">{user.completedTasksCount || 0} tasks done</span>
                        </div>
                        {user.skills && user.skills.length > 0 ? (
                           <div className="flex flex-wrap gap-1 mt-1">
                              {user.skills.slice(0, 2).map((s: string) => (
                                 <span key={s} className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium">{s}</span>
                              ))}
                              {user.skills.length > 2 && <span className="text-[9px] text-slate-400">+{user.skills.length - 2}</span>}
                           </div>
                        ) : (
                           <span className="text-[10px] text-slate-400 italic">No skills listed</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.isVerified ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold"><CheckCircle className="h-4 w-4" /> Verified</span>
                    ) : user.verificationStatus === 'PENDING_REVIEW' ? (
                      <span className="flex flex-col gap-1">
                        <span className="flex items-center gap-1 text-amber-600 font-semibold"><FileText className="h-4 w-4" /> Review Pending</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400 font-semibold"><ShieldAlert className="h-4 w-4" /> Unverified</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.verificationDocUrl && (
                        <a 
                          href={user.verificationDocUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1"
                          title="View Document"
                        >
                          <ExternalLink className="h-3 w-3" /> Doc
                        </a>
                      )}
                      <button 
                        onClick={() => handleVerifyToggle(user.id)}
                        className={`font-bold text-xs px-3 py-1.5 rounded-full transition-colors ${
                          user.isVerified 
                            ? "bg-amber-50 text-amber-600 hover:bg-amber-100" 
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        {user.isVerified ? "Unverify" : "Verify"}
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800 bg-red-50 p-1.5 rounded-full hover:bg-red-100 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

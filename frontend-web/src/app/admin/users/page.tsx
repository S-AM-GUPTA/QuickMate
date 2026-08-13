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
      const response = await api.patch(`/admin/users/${userId}/verify`);
      setUsers(users.map(u => u.id === userId ? response.data : u));
    } catch (error) {
      console.error("Failed to toggle verification", error);
      alert("Failed to update user");
    }
  };

  const handleReject = async (userId: string) => {
    if (!window.confirm("Are you sure you want to reject this document? The user will have to upload again.")) return;
    try {
      const response = await api.patch(`/admin/users/${userId}/reject`);
      setUsers(users.map(u => u.id === userId ? response.data : u));
    } catch (error) {
      console.error("Failed to reject verification", error);
      alert("Failed to reject user");
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
    const matchesRole = roleFilter === "all" || 
                        u.role === roleFilter || 
                        (roleFilter === "helper" && u.verificationStatus === "PENDING_REVIEW");
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-paper rounded-2xl shadow-sm border border-smoke/30 overflow-hidden animate-fade-in-up">
      <div className="p-6 border-b border-smoke/30 flex items-center justify-between bg-sand">
        <h2 className="text-xl text-ink tracking-tight">Registered Users</h2>
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-smoke" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-paper border border-smoke/30 rounded-full text-[13px] text-ink focus:outline-none focus:border-moss transition-colors w-64"
          />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-smoke/30 px-6 gap-6 bg-sand/50">
        <button
          onClick={() => setRoleFilter("all")}
          className={`py-3 text-[13px] font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${roleFilter === "all" ? "border-moss text-moss" : "border-transparent text-smoke hover:text-ink"}`}
        >
          All Users
        </button>
        <button
          onClick={() => setRoleFilter("customer")}
          className={`py-3 text-[13px] font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${roleFilter === "customer" ? "border-moss text-moss" : "border-transparent text-smoke hover:text-ink"}`}
        >
          Customers
        </button>
        <button
          onClick={() => setRoleFilter("helper")}
          className={`py-3 text-[13px] font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${roleFilter === "helper" ? "border-moss text-moss" : "border-transparent text-smoke hover:text-ink"}`}
        >
          Mates (Helpers)
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px] text-ink">
          <thead className="bg-sand text-[11px] uppercase tracking-widest text-smoke border-b border-smoke/30 font-bold">
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
                <td colSpan={6} className="px-6 py-8 text-center text-smoke text-[14px] font-medium">Loading users...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-smoke text-[14px] font-medium">No users found</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-smoke/20 hover:bg-mist transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-charcoal text-paper flex items-center justify-center font-bold text-[16px]">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-ink">{user.name}</p>
                        <p className="text-[12px] text-smoke">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      user.role === 'admin' ? 'bg-charcoal text-paper' :
                      user.role === 'helper' ? 'bg-mist text-ink border border-smoke/30' : 'bg-sand text-smoke'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'helper' ? (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                           <span className="text-[12px] font-bold text-ink bg-mist px-2 py-0.5 rounded-full border border-smoke/20 flex items-center gap-1">
                             {(!user.completedTasksCount || user.completedTasksCount === 0) 
                               ? "No ratings yet" 
                               : `⭐ ${typeof user.rating === 'number' ? user.rating.toFixed(1) : "5.0"}`}
                           </span>
                           <span className="text-[11px] text-smoke font-semibold">{user.completedTasksCount || 0} tasks done</span>
                        </div>
                        {user.skills && user.skills.length > 0 ? (
                           <div className="flex flex-wrap gap-1 mt-1">
                              {user.skills.slice(0, 2).map((s: string) => (
                                 <span key={s} className="text-[10px] bg-sand border border-smoke/30 text-ink px-2 py-0.5 rounded font-bold uppercase tracking-wide">{s}</span>
                              ))}
                              {user.skills.length > 2 && <span className="text-[10px] text-smoke font-bold">+{user.skills.length - 2}</span>}
                           </div>
                        ) : (
                           <span className="text-[11px] text-smoke italic">No skills listed</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[12px] text-smoke italic">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.verificationStatus === 'VERIFIED' || user.role === 'helper' ? (
                      <span className="flex items-center gap-1.5 text-moss font-bold text-[13px]"><CheckCircle className="h-4 w-4" /> Verified</span>
                    ) : user.verificationStatus === 'PENDING_REVIEW' ? (
                      <span className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-coral font-bold text-[13px]"><FileText className="h-4 w-4" /> Review Pending</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-smoke font-bold text-[13px]"><ShieldAlert className="h-4 w-4" /> Unverified</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-smoke text-[13px]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.verificationDocUrl && user.verificationStatus !== 'UNVERIFIED' && (
                        <a 
                          href={user.verificationDocUrl.includes("dummy-document") ? "https://placehold.co/600x400/png?text=KYC+Document" : user.verificationDocUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full bg-mist border border-smoke/30 text-ink hover:bg-sand transition-colors flex items-center gap-1.5"
                          title="View Document"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> Doc
                        </a>
                      )}
                      {(user.verificationStatus === 'PENDING_REVIEW') && (
                        <button 
                          onClick={() => handleReject(user.id)}
                          className="font-bold text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors border border-coral/30 text-coral hover:bg-coral/10"
                        >
                          Reject
                        </button>
                      )}
                      {(user.verificationStatus !== 'UNVERIFIED' || user.role === 'helper') && (
                        <button 
                          onClick={() => handleVerifyToggle(user.id)}
                          className={`font-bold text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors border ${
                            user.verificationStatus === 'VERIFIED' || user.role === 'helper'
                              ? "border-smoke/40 text-smoke hover:bg-smoke/10 hover:text-ink" 
                              : "border-moss/40 text-moss hover:bg-moss/10"
                          }`}
                        >
                          {user.verificationStatus === 'VERIFIED' || user.role === 'helper' ? "Revoke" : "Approve"}
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 hover:text-red-600 bg-red-50 p-1.5 rounded-full border border-red-100 hover:bg-red-100 transition-colors ml-1"
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

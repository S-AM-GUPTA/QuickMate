"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { FileText, CheckCircle, XCircle, ExternalLink, ShieldCheck } from "lucide-react";

export default function AdminKycPage() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        // Filter users who are helpers and pending review
        const pending = res.data.filter((u: any) => u.verificationStatus === "PENDING_REVIEW");
        setPendingUsers(pending);
      } catch (error) {
        console.error("Failed to load KYC users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      await api.patch(`/admin/users/${userId}/verify`);
      setPendingUsers(pendingUsers.filter(u => u.id !== userId));
    } catch (error) {
      console.error("Failed to approve", error);
      alert("Failed to approve KYC");
    }
  };

  const handleReject = async (userId: string) => {
    if (!window.confirm("Are you sure you want to reject this Aadhar upload?")) return;
    try {
      await api.patch(`/admin/users/${userId}/reject`);
      setPendingUsers(pendingUsers.filter(u => u.id !== userId));
    } catch (error) {
      console.error("Failed to reject", error);
      alert("Failed to reject KYC");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="bg-paper rounded-2xl shadow-sm border border-smoke/30 p-6 flex items-center gap-4 bg-sand">
        <div className="w-12 h-12 rounded-full bg-paper flex items-center justify-center border border-smoke/30 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-charcoal" />
        </div>
        <div>
          <h2 className="text-xl text-ink tracking-tight">KYC Verification Center</h2>
          <p className="text-[13px] text-smoke mt-1">Review Aadhar uploads from Mates to ensure marketplace safety.</p>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse p-8 text-center text-smoke">Loading pending verifications...</div>
      ) : pendingUsers.length === 0 ? (
        <div className="bg-paper rounded-2xl border border-smoke/30 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-mist mx-auto flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-moss" />
          </div>
          <h3 className="text-lg text-ink mb-2">All Caught Up!</h3>
          <p className="text-[14px] text-smoke max-w-md mx-auto">There are no pending KYC reviews at the moment. When new Mates upload their Aadhar cards, they will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingUsers.map(user => (
            <div key={user.id} className="bg-paper rounded-2xl shadow-sm border border-smoke/30 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="aspect-video bg-mist relative border-b border-smoke/30 overflow-hidden">
                {user.verificationDocUrl ? (
                  user.verificationDocUrl.includes("application/pdf") || user.verificationDocUrl.endsWith(".pdf") ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-sand text-smoke">
                      <FileText className="w-12 h-12 mb-2 text-ink" />
                      <span className="text-[13px] font-bold uppercase tracking-wider text-ink">PDF Document</span>
                    </div>
                  ) : (
                    <img 
                      src={user.verificationDocUrl.includes("dummy-document") || user.verificationDocUrl.includes("pub-quickmate") || user.verificationDocUrl.includes("mock") ? "https://placehold.co/600x400/png?text=Aadhar+Card" : user.verificationDocUrl} 
                      alt="Aadhar Document" 
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-smoke">
                    <FileText className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-[12px] font-bold uppercase tracking-wider">No Document Found</span>
                  </div>
                )}
                
                {user.verificationDocUrl && (
                  <a 
                    href={user.verificationDocUrl.includes("dummy-document") || user.verificationDocUrl.includes("pub-quickmate") || user.verificationDocUrl.includes("mock") ? "https://placehold.co/600x400/png?text=Aadhar+Card" : user.verificationDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-paper font-bold text-[13px] gap-2 backdrop-blur-sm"
                  >
                    <ExternalLink className="w-4 h-4" /> View Full Document
                  </a>
                )}
              </div>
              
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-ink text-[16px]">{user.name}</h3>
                    <p className="text-[12px] text-smoke mt-0.5">{user.email}</p>
                    <p className="text-[12px] text-smoke mt-0.5">{user.phone || 'No phone provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t border-smoke/20">
                  <button 
                    onClick={() => handleReject(user.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[13px] font-bold text-coral bg-coral/10 hover:bg-coral/20 transition-colors border border-coral/20"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(user.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[13px] font-bold text-paper bg-moss hover:bg-moss/90 transition-colors shadow-md"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

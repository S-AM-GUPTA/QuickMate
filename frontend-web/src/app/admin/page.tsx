"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Users, Briefcase, IndianRupee, AlertCircle, Activity, Database, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    totalRevenue: 0,
    pendingBids: 0,
    pendingKyc: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (error) {
        console.error("Failed to load admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-smoke/20 rounded w-3/4"></div></div></div>;
  }

  const statCards = [
    { name: "Total Users", value: stats.totalUsers, icon: Users, color: "text-ink" },
    { name: "Total Tasks", value: stats.totalTasks, icon: Briefcase, color: "text-ink" },
    { name: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-moss" },
    { name: "Pending Bids", value: stats.pendingBids, icon: AlertCircle, color: "text-coral" },
  ];

  return (
    <div className="space-y-8 relative animate-fade-in-up">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="rounded-2xl p-6 bg-paper shadow-sm border border-smoke/30 relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-2">
                <p className="text-smoke text-[12px] font-bold uppercase tracking-wider">{stat.name}</p>
                <h3 className={`text-4xl tracking-tight ${stat.color}`}>{stat.value}</h3>
              </div>
              <div className="bg-sand p-3 rounded-xl text-ink transform group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="h-6 w-6" strokeWidth={2} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-paper rounded-2xl p-8 shadow-sm border border-smoke/30 h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl text-ink flex items-center gap-2">
                <Activity className="w-5 h-5 text-moss" />
                System Status
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-sand rounded-xl border border-smoke/20">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-moss animate-pulse"></div>
                  <span className="font-semibold text-ink text-[14px]">API Servers</span>
                </div>
                <span className="text-moss font-bold text-[12px] bg-moss/10 px-3 py-1 rounded-full border border-moss/20">Operational</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-sand rounded-xl border border-smoke/20">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-moss animate-pulse"></div>
                  <span className="font-semibold text-ink text-[14px]">Database Cluster</span>
                </div>
                <span className="text-moss font-bold text-[12px] bg-moss/10 px-3 py-1 rounded-full border border-moss/20">Operational</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-sand rounded-xl border border-smoke/20">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-moss animate-pulse"></div>
                  <span className="font-semibold text-ink text-[14px]">Escrow Service</span>
                </div>
                <span className="text-moss font-bold text-[12px] bg-moss/10 px-3 py-1 rounded-full border border-moss/20">Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Only show Action Required if there are actually pending reviews */}
        {stats.pendingKyc > 0 && (
          <div className="bg-paper rounded-2xl p-8 shadow-sm border border-smoke/30 h-[400px] flex flex-col">
            <h3 className="text-xl text-ink mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-moss" />
              Action Required
            </h3>
            <div className="flex-1 rounded-xl bg-mist border border-smoke/30 flex flex-col items-center justify-center text-center p-6 gap-4">
              <div className="w-16 h-16 bg-paper rounded-full flex items-center justify-center border border-smoke/20 shadow-sm">
                <ShieldCheck className="w-8 h-8 text-smoke" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-ink">Pending KYC Reviews</p>
                <p className="text-[13px] text-smoke mt-1">There are {stats.pendingKyc} Mates waiting for their Aadhar verification.</p>
              </div>
              <Link href="/admin/kyc" className="mt-2 bg-charcoal text-paper px-6 py-2.5 rounded-full text-[13px] font-bold shadow-md hover:opacity-90 flex items-center gap-2">
                Review Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

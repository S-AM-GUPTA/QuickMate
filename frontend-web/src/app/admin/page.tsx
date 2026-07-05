"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Users, Briefcase, IndianRupee, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    totalRevenue: 0,
    pendingBids: 0,
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
    return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-slate-200 rounded w-3/4"></div></div></div>;
  }

  const statCards = [
    { name: "Total Users", value: stats.totalUsers, icon: Users, color: "from-emerald-500 to-teal-600" },
    { name: "Total Tasks", value: stats.totalTasks, icon: Briefcase, color: "from-teal-400 to-emerald-500" },
    { name: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "from-emerald-600 to-teal-800" },
    { name: "Pending Bids", value: stats.pendingBids, icon: AlertCircle, color: "from-teal-500 to-emerald-700" },
  ];

  return (
    <div className="space-y-8 relative">
      {/* Animated Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 -right-20 w-[600px] h-[600px] rounded-full bg-emerald-100/40 blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-40 -left-20 w-[500px] h-[500px] rounded-full bg-teal-50/40 blur-[80px] animate-pulse" style={{ animationDuration: '6s' }} />
      </div>
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat) => (
          <div key={stat.name} className={`rounded-3xl p-6 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-50/80 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1`}>
            <div className={`absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full opacity-10 blur-3xl group-hover:opacity-20 transition-all duration-700`}></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-1">
                <p className="text-slate-400 text-xs font-extrabold uppercase tracking-widest">{stat.name}</p>
                <h3 className="text-4xl font-black tracking-tight text-slate-800">{stat.value}</h3>
              </div>
              <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-2xl shadow-lg shadow-emerald-500/20 text-white transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                <stat.icon className="h-7 w-7" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-50/80 h-[400px]">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
              System Status
            </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="font-semibold text-slate-700">API Servers</span>
              </div>
              <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2.5 py-1 rounded-full">Operational</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="font-semibold text-slate-700">Database</span>
              </div>
              <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2.5 py-1 rounded-full">Operational</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="font-semibold text-slate-700">Escrow Service</span>
              </div>
              <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2.5 py-1 rounded-full">Operational</span>
            </div>
          </div>
        </div>
        </div>

          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-50/80 h-[400px]">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-teal-500 rounded-full"></div>
              Quick Insights
            </h3>
            <div className="h-64 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-teal-50/50 border border-emerald-100/50 flex items-center justify-center text-slate-400 p-8 text-center text-sm font-medium">
            <p className="text-slate-400 font-medium text-sm text-center px-8">
              Activity graphs will be populated as more platform data is accumulated. Wait for more tasks to be completed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

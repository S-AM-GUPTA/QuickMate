"use client";

import React from "react";
import { useProfile } from "@/context/ProfileContext";
import { TrendingUp, TrendingDown, Users, CheckCircle, CreditCard, Activity, Target, Eye } from "lucide-react";

export default function AnalyticsPage() {
  const { profile } = useProfile();
  
  const isCustomer = profile.role === "customer";
  
  // Mock Data for Customer
  const customerStats = {
    totalSpent: "₹45,200",
    spentTrend: "+12.5%",
    tasksPosted: 24,
    tasksTrend: "+4",
    activeMates: 8,
    activeTrend: "+2"
  };
  
  // Mock Data for Helper
  const helperStats = {
    totalEarned: "₹1,24,500",
    earnedTrend: "+22.4%",
    tasksCompleted: 86,
    tasksTrend: "+12",
    profileViews: 1240,
    viewsTrend: "+340"
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      <div>
        <h1 className="text-4xl md:text-5xl tracking-tight text-ink leading-tight">Analytics</h1>
        <p className="text-smoke font-medium text-[16px] mt-1">
          {isCustomer ? "Track your spending and task performance." : "Track your earnings and profile growth."}
        </p>
      </div>

      {isCustomer ? (
        // Customer Analytics Dashboard
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Cards */}
            <div className="bg-paper p-6 rounded-2xl border border-smoke/30 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-smoke">Total Spent</span>
                <div className="p-2 bg-sand rounded-full text-ink"><CreditCard className="w-4 h-4" /></div>
              </div>
              <div>
                <div className="text-[32px] tracking-tight text-ink mb-1">{customerStats.totalSpent}</div>
                <div className="flex items-center gap-1 text-[13px] font-medium text-moss">
                  <TrendingUp className="w-3.5 h-3.5" /> {customerStats.spentTrend} this month
                </div>
              </div>
            </div>

            <div className="bg-paper p-6 rounded-2xl border border-smoke/30 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-smoke">Tasks Posted</span>
                <div className="p-2 bg-sand rounded-full text-ink"><CheckCircle className="w-4 h-4" /></div>
              </div>
              <div>
                <div className="text-[32px] tracking-tight text-ink mb-1">{customerStats.tasksPosted}</div>
                <div className="flex items-center gap-1 text-[13px] font-medium text-moss">
                  <TrendingUp className="w-3.5 h-3.5" /> {customerStats.tasksTrend} this month
                </div>
              </div>
            </div>

            <div className="bg-paper p-6 rounded-2xl border border-smoke/30 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-smoke">Active Mates Hired</span>
                <div className="p-2 bg-sand rounded-full text-ink"><Users className="w-4 h-4" /></div>
              </div>
              <div>
                <div className="text-[32px] tracking-tight text-ink mb-1">{customerStats.activeMates}</div>
                <div className="flex items-center gap-1 text-[13px] font-medium text-moss">
                  <TrendingUp className="w-3.5 h-3.5" /> {customerStats.activeTrend} this month
                </div>
              </div>
            </div>
          </div>
          
          {/* Mock Spending Chart Area */}
          <div className="bg-paper rounded-2xl border border-smoke/30 p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl text-ink">Spending Overview</h3>
               <select className="bg-sand border border-smoke/30 rounded-full px-4 py-1.5 text-[13px] font-medium text-ink outline-none">
                 <option>Last 6 Months</option>
                 <option>This Year</option>
               </select>
             </div>
             <div className="h-64 flex items-end justify-between gap-2 border-b border-smoke/20 pb-4">
               {/* Mock CSS Bars */}
               {[40, 70, 45, 90, 60, 100].map((h, i) => (
                 <div key={i} className="w-full flex flex-col justify-end items-center group">
                   <div className="w-full bg-sand rounded-t-lg group-hover:bg-smoke/30 transition-colors relative" style={{ height: `${h}%` }}>
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-ink text-paper text-[11px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap transition-opacity">
                        ₹{(h * 150).toLocaleString()}
                      </div>
                   </div>
                   <span className="text-[12px] font-medium text-smoke mt-3 block">
                     {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                   </span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      ) : (
        // Helper Analytics Dashboard
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Cards */}
            <div className="bg-charcoal text-paper p-6 rounded-2xl border border-charcoal shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-paper/10 rounded-full blur-[30px] mix-blend-overlay -translate-y-1/2 translate-x-1/4" />
              <div className="relative z-10 flex items-center justify-between mb-4">
                <span className="text-[12px] font-bold uppercase tracking-wider text-paper/70">Total Earned</span>
                <div className="p-2 bg-paper/10 rounded-full text-paper"><Activity className="w-4 h-4" /></div>
              </div>
              <div className="relative z-10">
                <div className="text-[32px] tracking-tight text-paper mb-1">{helperStats.totalEarned}</div>
                <div className="flex items-center gap-1 text-[13px] font-bold text-[#FACC15]">
                  <TrendingUp className="w-3.5 h-3.5" /> {helperStats.earnedTrend} this month
                </div>
              </div>
            </div>

            <div className="bg-paper p-6 rounded-2xl border border-smoke/30 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-smoke">Tasks Completed</span>
                <div className="p-2 bg-sand rounded-full text-ink"><Target className="w-4 h-4" /></div>
              </div>
              <div>
                <div className="text-[32px] tracking-tight text-ink mb-1">{helperStats.tasksCompleted}</div>
                <div className="flex items-center gap-1 text-[13px] font-medium text-moss">
                  <TrendingUp className="w-3.5 h-3.5" /> {helperStats.tasksTrend} this month
                </div>
              </div>
            </div>

            <div className="bg-paper p-6 rounded-2xl border border-smoke/30 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-smoke">Profile Views</span>
                <div className="p-2 bg-sand rounded-full text-ink"><Eye className="w-4 h-4" /></div>
              </div>
              <div>
                <div className="text-[32px] tracking-tight text-ink mb-1">{helperStats.profileViews}</div>
                <div className="flex items-center gap-1 text-[13px] font-medium text-moss">
                  <TrendingUp className="w-3.5 h-3.5" /> {helperStats.viewsTrend} this month
                </div>
              </div>
            </div>
          </div>
          
          {/* Mock Earnings Chart Area */}
          <div className="bg-paper rounded-2xl border border-smoke/30 p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl text-ink">Earnings Overview</h3>
               <select className="bg-sand border border-smoke/30 rounded-full px-4 py-1.5 text-[13px] font-medium text-ink outline-none">
                 <option>Last 6 Months</option>
                 <option>This Year</option>
               </select>
             </div>
             <div className="h-64 flex items-end justify-between gap-2 border-b border-smoke/20 pb-4">
               {/* Mock CSS Bars */}
               {[30, 50, 40, 85, 75, 100].map((h, i) => (
                 <div key={i} className="w-full flex flex-col justify-end items-center group">
                   <div className="w-full bg-ink rounded-t-lg group-hover:bg-charcoal transition-colors relative" style={{ height: `${h}%` }}>
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-charcoal text-paper text-[11px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap transition-opacity">
                        ₹{(h * 450).toLocaleString()}
                      </div>
                   </div>
                   <span className="text-[12px] font-medium text-smoke mt-3 block">
                     {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                   </span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, TrendingUp, CheckCircle, Wallet, ArrowUpRight, 
  ShieldCheck, Activity, Star, Clock, AlertCircle, FileText, LayoutDashboard
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";

export default function DashboardOverview() {
  const [greeting, setGreeting] = useState("Good morning");
  const { profile } = useProfile();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <div className={`relative rounded-2xl p-8 sm:p-12 text-paper overflow-hidden shadow-xl animate-fade-in-up transition-all duration-500 ${profile.role === 'customer' ? 'bg-charcoal' : 'bg-moss'}`}>
        {/* Dynamic Gradient Mesh */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{
          background: 'radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.8) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(255, 255, 255, 0.4) 0%, transparent 50%)'
        }} />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-xl">
            <span className="inline-flex items-center rounded-full bg-paper/10 px-3 py-1 text-[12px] font-medium text-paper mb-6 border border-paper/20 backdrop-blur-sm shadow-sm">
              <LayoutDashboard className="w-3.5 h-3.5 mr-2" />
              {profile.role === 'customer' ? 'OPERATIONS HQ' : 'MATE COMMAND'}
            </span>
            <h1 className="text-[44px] md:text-5xl font-serif tracking-tight leading-tight mb-4">
              {greeting}. <br/>
              <span className="text-paper/80">
                {profile.role === 'customer' ? 'Ready to scale?' : 'Ready to earn?'}
              </span>
            </h1>
            <p className="text-[16px] text-paper/80 leading-relaxed max-w-md mb-8">
              {profile.role === 'customer' 
                ? 'Delegate QA testing, pitch deck design, and data entry to verified mates instantly.'
                : 'Browse nearby tasks, submit bids, and get paid directly to your wallet.'}
            </p>
            <div className="flex flex-wrap gap-4">
              {profile.role === 'customer' ? (
                <Link 
                  href="/dashboard/tasks?post=true"
                  className="rounded-full bg-moss text-paper px-7 py-3.5 text-[15px] font-medium hover:bg-moss/90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(80,146,9,0.3)] hover:shadow-[0_0_25px_rgba(80,146,9,0.5)] hover:-translate-y-0.5"
                >
                  Post a Task <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link 
                  href="/dashboard/tasks"
                  className="rounded-full bg-charcoal text-paper px-7 py-3.5 text-[15px] font-medium hover:bg-ink transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                >
                  Find Work <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Stat inside Hero */}
          <div className="hidden md:flex flex-col gap-2 bg-paper/10 backdrop-blur-md p-6 rounded-2xl border border-paper/20 shrink-0 min-w-[200px] shadow-lg hover:-translate-y-1 transition-transform duration-300">
            <span className="text-[13px] font-medium text-paper/80 uppercase tracking-wider">
              {profile.role === 'customer' ? 'Hours Saved' : 'Total Earnings'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[44px] font-serif tracking-tight">
                {profile.role === 'customer' ? '142' : '₹12k'}
              </span>
              <span className="text-lime text-[13px] font-medium flex items-center"><TrendingUp className="w-3.5 h-3.5 mr-1" />+24%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        
        {profile.role === 'customer' ? (
          <>
            <div className="bg-sand p-6 rounded-2xl border border-smoke/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Wallet className="w-24 h-24" /></div>
              <div className="flex justify-between items-center text-ink mb-4 relative z-10">
                <span className="text-[14px] font-medium uppercase tracking-wider">Active Escrow</span>
                <Wallet className="w-5 h-5 text-ink/70" />
              </div>
              <span className="text-[36px] font-serif tracking-tight text-ink mb-1 relative z-10">₹4,500</span>
              <span className="text-[13px] text-ink/60 font-medium relative z-10">Locked safely in escrow</span>
            </div>

            <div className="bg-sand p-6 rounded-2xl border border-smoke/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><CheckCircle className="w-24 h-24" /></div>
              <div className="flex justify-between items-center text-ink mb-4 relative z-10">
                <span className="text-[14px] font-medium uppercase tracking-wider">Tasks Completed</span>
                <CheckCircle className="w-5 h-5 text-ink/70" />
              </div>
              <span className="text-[36px] font-serif tracking-tight text-ink mb-1 relative z-10">12</span>
              <span className="text-[13px] text-ink/60 font-medium relative z-10">This month</span>
            </div>

            <div className="bg-sand p-6 rounded-2xl border border-smoke/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck className="w-24 h-24" /></div>
              <div className="flex justify-between items-center text-ink mb-4 relative z-10">
                <span className="text-[14px] font-medium uppercase tracking-wider">Verified Mates</span>
                <ShieldCheck className="w-5 h-5 text-ink/70" />
              </div>
              <span className="text-[36px] font-serif tracking-tight text-ink mb-1 relative z-10">4</span>
              <span className="text-[13px] text-ink/60 font-medium relative z-10">Ready to hire instantly</span>
            </div>
          </>
        ) : (
          <>
            <div className="bg-sand p-6 rounded-2xl border border-smoke/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Wallet className="w-24 h-24" /></div>
              <div className="flex justify-between items-center text-ink mb-4 relative z-10">
                <span className="text-[14px] font-medium uppercase tracking-wider">Wallet Balance</span>
                <Wallet className="w-5 h-5 text-ink/70" />
              </div>
              <span className="text-[36px] font-serif tracking-tight text-ink mb-1 relative z-10">₹1,250</span>
              <span className="text-[13px] text-ink/60 font-medium relative z-10">Available to withdraw</span>
            </div>

            <div className="bg-sand p-6 rounded-2xl border border-smoke/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><CheckCircle className="w-24 h-24" /></div>
              <div className="flex justify-between items-center text-ink mb-4 relative z-10">
                <span className="text-[14px] font-medium uppercase tracking-wider">Jobs Completed</span>
                <CheckCircle className="w-5 h-5 text-ink/70" />
              </div>
              <span className="text-[36px] font-serif tracking-tight text-ink mb-1 relative z-10">34</span>
              <span className="text-[13px] text-ink/60 font-medium relative z-10">All time</span>
            </div>

            <div className="bg-sand p-6 rounded-2xl border border-smoke/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Star className="w-24 h-24" /></div>
              <div className="flex justify-between items-center text-ink mb-4 relative z-10">
                <span className="text-[14px] font-medium uppercase tracking-wider">Current Rating</span>
                <Star className="w-5 h-5 text-ink/70" />
              </div>
              <span className="text-[36px] font-serif tracking-tight text-ink mb-1 relative z-10">4.9</span>
              <span className="text-[13px] text-ink/60 font-medium relative z-10">Top Rated Mate</span>
            </div>
          </>
        )}

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Tasks Section (2/3 width) */}
        <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-serif text-ink flex items-center gap-2">
              <FileText className="w-5 h-5" /> Active Operations
            </h3>
            <button className="text-[14px] font-medium text-ink/60 hover:text-moss transition-colors">View All →</button>
          </div>
          
          <div className="space-y-4">
            {/* Task Card 1 */}
            <div className="bg-paper rounded-2xl border border-smoke/60 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-sand px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase text-ink">Design</span>
                    <span className="text-[12px] text-ink/60 font-medium flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Due in 2 days</span>
                  </div>
                  <h4 className="text-lg font-bold text-ink">Pitch Deck Polish - Seed Round</h4>
                </div>
                <div className="text-right">
                  <span className="block text-[18px] font-serif text-ink">₹1,500</span>
                  <span className="text-[12px] font-medium text-moss bg-moss/10 px-2 py-0.5 rounded-full inline-block mt-1">In Progress</span>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-[13px] font-medium text-ink">
                  <span>Progress</span>
                  <span>75%</span>
                </div>
                <div className="h-2 w-full bg-sand rounded-full overflow-hidden">
                  <div className="h-full bg-ink rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-[13px] text-ink/60 pt-2 border-t border-smoke/30 mt-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-ink" /> {profile.role === 'customer' ? 'Mate Alex M. is finalizing the slides.' : 'You are finalizing the slides.'}
                </p>
              </div>
            </div>

            {/* Task Card 2 */}
            <div className="bg-paper rounded-2xl border border-smoke/60 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-sand px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase text-ink">QA Testing</span>
                    <span className="text-[12px] text-ink/60 font-medium flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-coral" /> Action Required</span>
                  </div>
                  <h4 className="text-lg font-bold text-ink">Beta testing for new iOS app</h4>
                </div>
                <div className="text-right">
                  <span className="block text-[18px] font-serif text-ink">₹800</span>
                  <span className="text-[12px] font-medium text-coral bg-coral/10 px-2 py-0.5 rounded-full inline-block mt-1">Review Pending</span>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-[13px] font-medium text-ink">
                  <span>Progress</span>
                  <span>90%</span>
                </div>
                <div className="h-2 w-full bg-sand rounded-full overflow-hidden">
                  <div className="h-full bg-coral rounded-full" style={{ width: '90%' }}></div>
                </div>
                <p className="text-[13px] text-ink/60 pt-2 border-t border-smoke/30 mt-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-ink" /> {profile.role === 'customer' ? 'Review submitted bugs and approve payment.' : 'Waiting for customer approval.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed Section (1/3 width) */}
        <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h3 className="text-2xl font-serif text-ink mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5" /> Activity Log
          </h3>
          <div className="bg-paper rounded-2xl border border-smoke/60 overflow-hidden shadow-sm">
            
            <div className="flex items-start gap-4 p-5 border-b border-smoke/60 hover:bg-sand/50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-sand border border-smoke/60 flex items-center justify-center text-ink shrink-0 group-hover:scale-110 group-hover:bg-moss group-hover:text-paper transition-all">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 pt-1">
                <p className="text-[14px] font-bold text-ink leading-tight mb-1">Onboarding Flow UX Audit</p>
                <p className="text-[13px] text-ink/60 leading-snug">
                  {profile.role === 'customer' 
                    ? 'Payment of ₹2,000 released from escrow to Sarah J.' 
                    : 'Payment of ₹2,000 released from escrow to your wallet.'}
                </p>
                <span className="text-[11px] font-medium text-ink/40 mt-2 block">2h ago</span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 border-b border-smoke/60 hover:bg-sand/50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-sand border border-smoke/60 flex items-center justify-center text-ink shrink-0 group-hover:scale-110 group-hover:bg-moss group-hover:text-paper transition-all">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="flex-1 pt-1">
                <p className="text-[14px] font-bold text-ink leading-tight mb-1">Funds Processed</p>
                <p className="text-[13px] text-ink/60 leading-snug">
                  {profile.role === 'customer'
                    ? '₹10,000 successfully added to your secure escrow wallet via UPI.'
                    : '₹1,250 withdrawal successfully transferred to your bank account.'}
                </p>
                <span className="text-[11px] font-medium text-ink/40 mt-2 block">5h ago</span>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-5 hover:bg-sand/50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-sand border border-smoke/60 flex items-center justify-center text-ink shrink-0 group-hover:scale-110 group-hover:bg-moss group-hover:text-paper transition-all">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div className="flex-1 pt-1">
                <p className="text-[14px] font-bold text-ink leading-tight mb-1">
                  {profile.role === 'customer' ? 'Task Live' : 'Bid Submitted'}
                </p>
                <p className="text-[13px] text-ink/60 leading-snug">
                  {profile.role === 'customer'
                    ? 'Your request "Beta testing for new iOS app" is live and receiving bids.'
                    : 'You successfully placed a bid of ₹800 on "Beta testing".'}
                </p>
                <span className="text-[11px] font-medium text-ink/40 mt-2 block">1d ago</span>
              </div>
            </div>

            <div className="bg-sand/30 p-3 text-center border-t border-smoke/60">
              <button className="text-[13px] font-medium text-ink hover:text-moss transition-colors">View All History</button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, TrendingUp, CheckCircle, Wallet, ArrowUpRight, 
  ShieldCheck, Activity, Star, Clock, AlertCircle, FileText, LayoutDashboard, MapPin
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";

export default function DashboardOverview() {
  const [greeting, setGreeting] = useState("Good morning");
  const { profile } = useProfile();

  const [openGigs, setOpenGigs] = useState([
    {
      id: 1,
      tag: 'Plumbing',
      tagColor: 'text-moss bg-moss/10',
      dist: '2.4 km away',
      price: '₹1,200',
      title: 'Fix Leaking Kitchen Sink Faucet',
      desc: 'Looking for a professional plumber to fix a persistent leak under the kitchen sink. Parts will be provided.',
      isNew: false
    },
    {
      id: 2,
      tag: 'Tech Help',
      tagColor: 'text-charcoal bg-[#FACC15]/20',
      dist: '5.1 km away',
      price: '₹2,500',
      title: 'Setup Home Wi-Fi Mesh Network',
      desc: 'Need help setting up a 3-node TP-Link mesh network in a 3BHK apartment. Dead zones in master bedroom.',
      isNew: false
    }
  ]);

  const [activityLog, setActivityLog] = useState([
    {
      id: 1,
      icon: <CheckCircle className="w-5 h-5" />,
      title: 'Task Completed',
      desc: 'Payment of ₹2,000 released from escrow to Sarah J.',
      time: '2h ago',
      isNew: false
    },
    {
      id: 2,
      icon: <Wallet className="w-5 h-5" />,
      title: 'Funds Processed',
      desc: '₹10,000 successfully added to your secure escrow wallet via UPI.',
      time: '5h ago',
      isNew: false
    },
    {
      id: 3,
      icon: <ArrowUpRight className="w-5 h-5" />,
      title: 'Task Live',
      desc: 'Your request "Deep Cleaning 2BHK" is live and receiving bids.',
      time: '1d ago',
      isNew: false
    }
  ]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Simulate real-time gigs coming in for Mates
    const gigInterval = setInterval(() => {
      setOpenGigs(prev => {
        if (prev.length > 4) return prev; // Limit mock items
        
        const newGig = {
          id: Date.now(),
          tag: 'Delivery',
          tagColor: 'text-blue-600 bg-blue-100',
          dist: '1.2 km away',
          price: '₹400',
          title: 'Deliver Documents to Cyber City',
          desc: 'Urgent document delivery from Sector 44 to Cyber City. Need it done within next 2 hours.',
          isNew: true
        };
        return [newGig, ...prev.slice(0, 3)];
      });
    }, 12000);

    // Simulate real-time activity for Customers
    const activityInterval = setInterval(() => {
      setActivityLog(prev => {
        if (prev.length > 5) return prev; // Limit mock items
        const newLog = {
          id: Date.now(),
          icon: <Activity className="w-5 h-5" />,
          title: 'New Bid Received',
          desc: 'Alex M. applied to "IKEA Furniture Assembly".',
          time: 'Just now',
          isNew: true
        };
        return [newLog, ...prev.slice(0, 4)];
      });
    }, 18000);

    return () => {
      clearInterval(gigInterval);
      clearInterval(activityInterval);
    };
  }, []);
  if (profile.role !== 'customer') {
    return (
      <div className="space-y-6 w-full max-w-7xl mx-auto animate-fade-in-up">
        {/* Simple Header */}
        <div className="flex justify-between items-center bg-paper p-6 rounded-2xl border border-smoke/60 shadow-sm">
          <div>
            <h1 className="text-2xl text-ink tracking-tight mb-1">
              Online & Ready to Earn.
            </h1>
            <p className="text-[14px] text-ink/60">Finding gigs near your location.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-moss opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-moss"></span>
            </span>
            <span className="text-[14px] font-bold text-ink uppercase tracking-wider">Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats & Wallet */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-moss/5 border border-moss/20 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Wallet className="w-24 h-24" /></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-[13px] font-bold uppercase tracking-wider text-moss">Your Wallet</span>
                <Wallet className="w-5 h-5 text-moss" />
              </div>
              <h2 className="text-4xl text-ink mb-2 tracking-tight relative z-10">₹1,250</h2>
              <p className="text-[13px] text-ink/60 mb-6 relative z-10">Available to withdraw instantly.</p>
              <button className="w-full bg-moss text-paper py-3 rounded-xl text-[14px] font-bold hover:bg-moss/90 transition-colors shadow-[0_0_15px_rgba(80,146,9,0.3)] relative z-10">
                Withdraw Funds
              </button>
            </div>

            <div className="bg-paper border border-smoke/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-[15px] font-bold text-ink mb-4">Mate Score</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-smoke/40 pb-3">
                  <span className="text-[13px] text-ink/70">Rating</span>
                  <span className="text-[14px] font-bold flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400"/> 4.9</span>
                </div>
                <div className="flex justify-between items-center border-b border-smoke/40 pb-3">
                  <span className="text-[13px] text-ink/70">Jobs Completed</span>
                  <span className="text-[14px] font-bold">34</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-ink/70">On-Time Rate</span>
                  <span className="text-[14px] font-bold text-moss">98%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-paper border border-smoke/60 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl text-ink flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5" /> Open Gigs Near You
                </h3>
                <button className="text-[13px] font-medium text-ink/60 hover:text-moss transition-colors">Filters</button>
              </div>
              
              <div className="space-y-4">
                {openGigs.map(gig => (
                  <div 
                    key={gig.id} 
                    className={`group border rounded-xl p-5 hover:border-moss/50 hover:shadow-md transition-all cursor-pointer bg-white relative overflow-hidden ${gig.isNew ? 'animate-fade-in border-moss/40 shadow-sm' : 'border-smoke/40'}`}
                  >
                    {gig.isNew && (
                      <div className="absolute top-0 right-0 bg-moss text-paper text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider animate-pulse">
                        New Match
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2 items-center mt-1">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${gig.tagColor}`}>
                          {gig.tag}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-medium text-ink/50">
                          <MapPin className="w-3 h-3"/> {gig.dist}
                        </span>
                      </div>
                      <span className="text-[18px] font-bold text-ink">{gig.price}</span>
                    </div>
                    <h4 className="text-[16px] font-bold text-ink mb-1 group-hover:text-moss transition-colors">{gig.title}</h4>
                    <p className="text-[13px] text-ink/70 mb-4 line-clamp-2">{gig.desc}</p>
                    <div className="flex gap-3">
                      <button onClick={() => window.location.href = '/dashboard/tasks'} className="flex-1 bg-ink text-paper py-2 rounded-lg text-[13px] font-bold hover:bg-ink/80 transition-colors">Accept Job</button>
                      <button onClick={() => window.location.href = '/dashboard/tasks'} className="px-4 border border-smoke/60 text-ink rounded-lg text-[13px] font-bold hover:bg-sand transition-colors">Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Bids */}
            <div className="bg-paper border border-smoke/60 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl text-ink mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" /> Pending Bids
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-sand/30 rounded-lg border border-smoke/40 hover:bg-sand transition-colors cursor-pointer">
                  <div>
                    <h4 className="text-[14px] font-bold text-ink">Deep Cleaning 2BHK</h4>
                    <p className="text-[12px] text-ink/60">Your bid: ₹1,500</p>
                  </div>
                  <span className="text-[11px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded">Awaiting Approval</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className={`relative rounded-2xl p-8 sm:p-12 text-ink overflow-hidden border border-smoke/30 animate-fade-in-up transition-all duration-500 bg-[#f0f9ff]`}>
        {/* Dynamic Gradient Mesh */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{
          background: 'radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.8) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(255, 255, 255, 0.4) 0%, transparent 50%)'
        }} />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-xl">
            <span className="inline-flex items-center rounded-full bg-ink/5 px-3 py-1 text-[12px] font-medium text-ink mb-6 border border-ink/10 backdrop-blur-sm shadow-sm">
              <LayoutDashboard className="w-3.5 h-3.5 mr-2" />
              DASHBOARD
            </span>
            <h1 className="text-[44px] md:text-5xl tracking-tight leading-tight mb-4">
              {greeting}. <br/>
              <span className="text-ink/60">Need a hand?</span>
            </h1>
            <p className="text-[16px] text-ink/70 leading-relaxed max-w-md mb-8">
              Delegate chores, running errands, and home repairs to verified mates instantly.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/dashboard/tasks?post=true"
                className="rounded-full bg-moss text-paper px-7 py-3.5 text-[15px] font-medium hover:bg-moss/90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(80,146,9,0.3)] hover:shadow-[0_0_25px_rgba(80,146,9,0.5)] hover:-translate-y-0.5"
              >
                Post a Task <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Stat inside Hero */}
          <div className="hidden md:flex flex-col gap-2 bg-paper/60 backdrop-blur-md p-6 rounded-2xl border border-ink/5 shrink-0 min-w-[200px] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <span className="text-[13px] font-medium text-ink/60 uppercase tracking-wider">
              Hours Saved
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[44px] tracking-tight text-ink">
                142
              </span>
              <span className="text-moss text-[13px] font-medium flex items-center"><TrendingUp className="w-3.5 h-3.5 mr-1" />+24%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="bg-sand p-6 rounded-2xl border border-smoke/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Wallet className="w-24 h-24" /></div>
          <div className="flex justify-between items-center text-ink mb-4 relative z-10">
            <span className="text-[14px] font-medium uppercase tracking-wider">Active Escrow</span>
            <Wallet className="w-5 h-5 text-ink/70" />
          </div>
          <span className="text-[36px] tracking-tight text-ink mb-1 relative z-10">₹4,500</span>
          <span className="text-[13px] text-ink/60 font-medium relative z-10">Locked safely in escrow</span>
        </div>

        <div className="bg-sand p-6 rounded-2xl border border-smoke/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><CheckCircle className="w-24 h-24" /></div>
          <div className="flex justify-between items-center text-ink mb-4 relative z-10">
            <span className="text-[14px] font-medium uppercase tracking-wider">Tasks Completed</span>
            <CheckCircle className="w-5 h-5 text-ink/70" />
          </div>
          <span className="text-[36px] tracking-tight text-ink mb-1 relative z-10">12</span>
          <span className="text-[13px] text-ink/60 font-medium relative z-10">This month</span>
        </div>

        <div className="bg-sand p-6 rounded-2xl border border-smoke/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck className="w-24 h-24" /></div>
          <div className="flex justify-between items-center text-ink mb-4 relative z-10">
            <span className="text-[14px] font-medium uppercase tracking-wider">Verified Mates</span>
            <ShieldCheck className="w-5 h-5 text-ink/70" />
          </div>
          <span className="text-[36px] tracking-tight text-ink mb-1 relative z-10">4</span>
          <span className="text-[13px] text-ink/60 font-medium relative z-10">Ready to hire instantly</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Tasks Section (2/3 width) */}
        <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl text-ink flex items-center gap-2">
              <span className="relative flex h-3 w-3 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-coral"></span>
              </span>
              Active Operations
            </h3>
            <button className="text-[14px] font-medium text-ink/60 hover:text-moss transition-colors">View All →</button>
          </div>
          
          <div className="space-y-4">
            {/* Task Card 1 */}
            <div className="bg-paper rounded-2xl border border-smoke/60 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-sand px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase text-ink">Handyman</span>
                    <span className="text-[12px] text-ink/60 font-medium flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Due in 2 days</span>
                  </div>
                  <h4 className="text-lg font-bold text-ink">IKEA Furniture Assembly</h4>
                </div>
                <div className="text-right">
                  <span className="block text-[18px] text-ink">₹1,500</span>
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
                  <Star className="w-4 h-4 text-ink" /> Mate Alex M. is on the way.
                </p>
              </div>
            </div>

            {/* Task Card 2 */}
            <div className="bg-paper rounded-2xl border border-smoke/60 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-sand px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase text-ink">Cleaning</span>
                    <span className="text-[12px] text-ink/60 font-medium flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-coral" /> Action Required</span>
                  </div>
                  <h4 className="text-lg font-bold text-ink">Deep Cleaning 2BHK</h4>
                </div>
                <div className="text-right">
                  <span className="block text-[18px] text-ink">₹800</span>
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
                  <CheckCircle className="w-4 h-4 text-ink" /> Review completed work and approve payment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed Section (1/3 width) */}
        <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h3 className="text-2xl text-ink mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5" /> Activity Log
          </h3>
          <div className="bg-paper rounded-2xl border border-smoke/60 overflow-hidden shadow-sm">
            
            {activityLog.map((log, index) => (
              <div key={log.id} className={`flex items-start gap-4 p-5 hover:bg-sand/50 transition-colors cursor-pointer group ${index !== activityLog.length -1 ? 'border-b border-smoke/60' : ''} ${log.isNew ? 'bg-moss/5 animate-fade-in' : ''}`}>
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-moss group-hover:text-paper transition-all ${log.isNew ? 'bg-moss text-paper border-moss shadow-[0_0_10px_rgba(80,146,9,0.3)]' : 'bg-sand border-smoke/60 text-ink'}`}>
                  {log.icon}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex justify-between items-start">
                    <p className="text-[14px] font-bold text-ink leading-tight mb-1">{log.title}</p>
                    {log.isNew && <span className="text-[10px] font-bold text-moss bg-moss/10 px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">New</span>}
                  </div>
                  <p className="text-[13px] text-ink/60 leading-snug">
                    {log.desc}
                  </p>
                  <span className="text-[11px] font-medium text-ink/40 mt-2 block">{log.time}</span>
                </div>
              </div>
            ))}

            <div className="bg-sand/30 p-3 text-center border-t border-smoke/60">
              <button className="text-[13px] font-medium text-ink hover:text-moss transition-colors">View All History</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

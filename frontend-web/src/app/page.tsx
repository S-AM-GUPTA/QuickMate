"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Wrench,
  Package,
  Truck,
  Paintbrush,
  Home,
  CheckCircle,
  Star,
  MapPin,
  Clock,
  ThumbsUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-paper font-sans text-ink selection:bg-iris/20 overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-paper border-b border-hairline transition-all">
        <div className="flex items-center gap-3">
          <Link href="/">
            <img src="/logo.png" alt="QuickMate" className="h-10 sm:h-12 w-auto object-contain cursor-pointer" />
          </Link>
        </div>
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-[24px] bg-charcoal px-5 py-2 text-[14px] font-medium text-paper shadow-md hover:opacity-90 transition-opacity cursor-pointer"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className="text-[14px] font-medium text-ink hover:underline transition-all cursor-pointer"
              >
                Become a Helper
              </button>
              <button
                onClick={() => router.push("/login")}
                className="text-[14px] font-medium text-ink hover:underline transition-colors cursor-pointer mr-2"
              >
                Log in
              </button>
              <button
                onClick={() => router.push("/login?mode=signup")}
                className="rounded-[24px] bg-charcoal px-5 py-2 text-[14px] font-medium text-paper shadow-md hover:opacity-90 transition-opacity cursor-pointer"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative px-6 pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden max-w-[1200px] mx-auto">
        {/* Contra Hero Gradient Wash */}
        <div 
          className="absolute inset-0 w-full h-[600px] pointer-events-none -z-10 opacity-30" 
          style={{ background: 'linear-gradient(90deg, rgb(205, 243, 253), rgb(157, 222, 249) 42.88%, rgb(151, 157, 241) 94.62%)' }} 
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Text Content */}
          <div className="text-left max-w-2xl z-10 lg:-translate-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[16px] bg-mist text-ink text-[12px] font-medium mb-6 border border-hairline">
              <Star className="h-3.5 w-3.5" />
              Over 500 tasks completed for startups
            </div>
            
            <h1 className="text-[50px] md:text-[58px] lg:text-[64px] font-medium tracking-[-0.02em] text-ink mb-6 leading-[1.05]">
              Get help. <br/>
              Gain happiness.
            </h1>
            
            <p className="text-[16px] text-slate mb-10 leading-[1.6] max-w-[580px] tracking-[-0.01em]">
              Book trusted help for data entry, beta testing, pitch deck polish, and everyday startup operations, handled instantly.
            </p>
            {/* Search Bar */}
            <div className="flex items-center w-full max-w-[580px] mb-10 bg-mist border border-hairline rounded-[16px] p-2 focus-within:border-ink transition-all">
              <div className="pl-4 pr-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate" />
              </div>
              <input 
                type="text" 
                placeholder="What do you need help with?" 
                className="flex-1 bg-transparent text-[15px] placeholder:text-fog text-ink focus:outline-none min-w-0 py-2 font-sans"
              />
              <div className="flex items-center gap-2 pl-2">
                <button 
                  onClick={() => router.push("/login")}
                  className="rounded-[24px] bg-charcoal px-6 py-2.5 text-[14px] font-medium text-paper hover:opacity-90 transition-opacity shadow-md flex items-center whitespace-nowrap"
                >
                  Post a Task
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[12px] font-sans font-medium text-slate mr-2">Popular Categories:</span>
              <button onClick={() => router.push("/login")} className="flex items-center gap-1.5 rounded-[16px] bg-mist px-3 py-1.5 text-[14px] font-medium text-ink hover:bg-hairline transition-all">
                 Pitch Deck Design
              </button>
              <button onClick={() => router.push("/login")} className="flex items-center gap-1.5 rounded-[16px] bg-mist px-3 py-1.5 text-[14px] font-medium text-ink hover:bg-hairline transition-all">
                 Beta Testing
              </button>
              <button onClick={() => router.push("/login")} className="flex items-center gap-1.5 rounded-[16px] bg-mist px-3 py-1.5 text-[14px] font-medium text-ink hover:bg-hairline transition-all">
                 Data Entry
              </button>
            </div>
          </div>

          {/* Right Graphics - Image Collage */}
          <div className="relative hidden lg:block h-[500px] w-full">
            {/* Top Right Image */}
            <div className="absolute top-[0%] right-[0%] w-[60%] h-[60%] rounded-[4px] overflow-hidden border border-hairline z-20 transition-all duration-500">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop" alt="Startup Team" className="w-full h-full object-cover" />
            </div>
            
            {/* Bottom Left Image */}
            <div className="absolute bottom-[5%] left-[5%] w-[55%] h-[55%] rounded-[4px] overflow-hidden border border-hairline z-30 transition-all duration-500">
              <img src="https://images.unsplash.com/photo-1556761175-5972d9314bf1?q=80&w=600&auto=format&fit=crop" alt="Coworking Space" className="w-full h-full object-cover" />
            </div>

            {/* Middle decorative graphic */}
            <div className="absolute bottom-[20%] right-[10%] bg-paper p-4 rounded-[4px] border border-hairline z-40 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-[4px] bg-mist border border-hairline flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-ink" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-ink">Verified Mates</p>
                  <p className="text-[12px] text-slate">Identity checked</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Activity Stats */}
        <div className="max-w-[1200px] mx-auto mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-paper border border-hairline rounded-[4px] p-5 flex flex-col items-center justify-center text-center">
              <p className="text-[32px] font-medium text-ink mb-1 leading-none">18</p>
              <p className="text-[14px] font-medium text-slate">Mates Online</p>
            </div>
            
            <div className="bg-paper border border-hairline rounded-[4px] p-5 flex flex-col items-center justify-center text-center">
              <p className="text-[32px] font-medium text-ink mb-1 leading-none">6m</p>
              <p className="text-[14px] font-medium text-slate">Avg. Response Time</p>
            </div>

            <div className="bg-paper border border-hairline rounded-[4px] p-5 flex flex-col items-center justify-center text-center">
              <p className="text-[32px] font-medium text-ink mb-1 leading-none">12</p>
              <p className="text-[14px] font-medium text-slate">Tasks Posted Today</p>
            </div>

            <div className="bg-paper border border-hairline rounded-[4px] p-5 flex flex-col items-center justify-center text-center">
              <p className="text-[32px] font-medium text-ink mb-1 leading-none">99%</p>
              <p className="text-[14px] font-medium text-slate">Happy Founders</p>
            </div>
          </div>
        </div>
      </main>

      {/* Popular Projects Section */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto">
        <h2 className="text-[32px] md:text-[40px] font-medium text-ink mb-10 text-center tracking-[-0.01em]">
          Popular Projects for Startups
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Pitch Deck Design",
              price: "Avg. ₹500-1500",
              img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=600&auto=format&fit=crop",
            },
            {
              title: "Beta Testing",
              price: "Avg. ₹300-800",
              img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
            },
            {
              title: "Data Entry",
              price: "Avg. ₹200-500",
              img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600&auto=format&fit=crop",
            },
            {
              title: "Virtual Assistance",
              price: "Avg. ₹400-1000",
              img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600&auto=format&fit=crop",
            },
          ].map((project, idx) => (
            <div
              key={idx}
              className="group cursor-pointer rounded-[4px] border border-hairline bg-paper hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="h-40 overflow-hidden bg-mist">
                <img
                  src={project.img}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-[16px] font-medium text-ink">
                  {project.title}
                </h3>
                <p className="text-[14px] text-slate mt-1 mb-4">
                  {project.price}
                </p>
                <button className="mt-auto text-left text-[14px] font-medium text-graphite group-hover:underline">
                  View task →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-transparent py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[32px] md:text-[40px] font-medium text-ink mb-16 text-center tracking-[-0.01em]">
            How QuickMate Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Search,
                title: "1. Describe your task",
                desc: "Choose from a variety of startup services and select the day and time you'd like a qualified mate to show up.",
              },
              {
                icon: Star,
                title: "2. Choose a Mate",
                desc: "Browse a list of background-checked freelancers, view their prices, and read verified reviews from founders.",
              },
              {
                icon: CheckCircle,
                title: "3. Get it done",
                desc: "Chat securely, manage your booking, pay directly through escrow, and leave a review all within the platform.",
              },
            ].map((step, idx) => (
              <div key={idx} className="text-center group">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[16px] bg-mist text-ink mb-6 border border-hairline group-hover:border-ink transition-all duration-300">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="text-[20px] font-medium text-ink mb-3">
                  {step.title}
                </h3>
                <p className="text-[15px] text-slate leading-[1.6]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-24 px-6 max-w-[900px] mx-auto text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-[16px] bg-mist mb-8 border border-hairline">
          <ShieldCheck className="h-8 w-8 text-ink" />
        </div>
        <h2 className="text-[32px] md:text-[40px] font-medium text-ink mb-6 tracking-[-0.01em]">
          The QuickMate Pledge
        </h2>
        <p className="text-[16px] text-slate leading-[1.6] mb-12 max-w-2xl mx-auto">
          Your safety and satisfaction are our top priorities. Every mate
          undergoes strict identity verification and background checks. With our
          secure escrow payments, your money is held safely until the job is
          completed to your satisfaction.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-[4px] bg-paper border border-hairline hover:border-ink transition-colors flex flex-col items-center text-center">
            <CheckCircle className="h-6 w-6 text-ink mb-3" />
            <h4 className="font-medium text-ink mb-1">Vetted Mates</h4>
            <p className="text-[14px] text-slate">
              Rigorous background and identity checks.
            </p>
          </div>
          <div className="p-6 rounded-[4px] bg-paper border border-hairline hover:border-ink transition-colors flex flex-col items-center text-center">
            <ShieldCheck className="h-6 w-6 text-ink mb-3" />
            <h4 className="font-medium text-ink mb-1">Secure Escrow</h4>
            <p className="text-[14px] text-slate">
              Payments are protected until job completion.
            </p>
          </div>
          <div className="p-6 rounded-[4px] bg-paper border border-hairline hover:border-ink transition-colors flex flex-col items-center text-center">
            <ThumbsUp className="h-6 w-6 text-ink mb-3" />
            <h4 className="font-medium text-ink mb-1">
              Happiness Guarantee
            </h4>
            <p className="text-[14px] text-slate">
              We'll make it right if things go wrong.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 text-center">
        <h3 className="mb-4 text-[40px] md:text-[48px] font-medium text-ink tracking-[-0.02em]">
          Ready to tackle your to-do list?
        </h3>
        <p className="mx-auto mb-8 max-w-2xl text-[16px] text-slate leading-[1.6]">
          Don&apos;t let chores and errands pile up. Find a trusted Mate today and
          enjoy your free time again.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="rounded-[24px] bg-charcoal px-8 py-3 text-[15px] font-medium text-paper shadow-md hover:opacity-90 transition-opacity"
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline bg-paper py-12 text-center text-slate">
        <div className="flex items-center justify-center mb-6">
          <Link href="/" className="flex items-center justify-center">
            <img src="/logo.png" alt="QuickMate" className="h-10 w-auto object-contain" />
          </Link>
        </div>
        <p className="text-[14px]">
          © 2026 QuickMate. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

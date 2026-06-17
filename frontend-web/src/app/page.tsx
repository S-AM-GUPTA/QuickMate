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

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Link href="/" className="ml-4 flex items-center">
            <img
              src="/logo-v3.png"
              alt="QuickMate"
              className="h-14 sm:h-16 w-auto object-contain mix-blend-multiply scale-[2.5] origin-left cursor-pointer"
            />
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push("/login")}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors hidden sm:block"
          >
            Become a Helper
          </button>
          <button
            onClick={() => router.push("/login")}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Log in
          </button>
          <button
            onClick={() => router.push("/login")}
            className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative bg-gradient-to-b from-emerald-50/80 to-white px-6 py-16 md:py-28 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-emerald-100/50 blur-[100px]" />
          <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-teal-50/50 blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Text Content */}
          <div className="text-left max-w-2xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 text-emerald-700 text-sm font-semibold mb-6 border border-emerald-200/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              Over 10,000 tasks completed in your area
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
              Get help. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Gain happiness.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              Book trusted, background-checked help for home repairs, cleaning, moving, and more. Everyday tasks, handled instantly.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mb-10 group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-emerald-600 group-focus-within:text-emerald-700 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="What do you need help with?" 
                className="block w-full pl-14 pr-36 py-5 rounded-full border-2 border-slate-200 bg-white text-lg placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-xl shadow-emerald-900/5"
              />
              <button 
                onClick={() => router.push("/login")}
                className="absolute inset-y-2 right-2 rounded-full bg-emerald-600 px-6 sm:px-8 py-2 font-bold text-white hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 whitespace-nowrap"
              >
                Get Help
              </button>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-slate-500 mr-2">Popular:</span>
              <button onClick={() => router.push("/login")} className="flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-600 hover:shadow-md transition-all">
                <Wrench className="h-4 w-4" /> Assembly
              </button>
              <button onClick={() => router.push("/login")} className="flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-600 hover:shadow-md transition-all">
                <Truck className="h-4 w-4" /> Moving
              </button>
              <button onClick={() => router.push("/login")} className="flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-600 hover:shadow-md transition-all">
                <Paintbrush className="h-4 w-4" /> Cleaning
              </button>
            </div>
          </div>

          {/* Right Graphics - Image Collage */}
          <div className="relative hidden lg:block h-[600px] w-full">
            {/* Top Right Image */}
            <div className="absolute top-[5%] right-[5%] w-[60%] h-[55%] rounded-3xl overflow-hidden shadow-2xl border-8 border-white z-20 rotate-3 transform hover:rotate-0 hover:scale-105 transition-all duration-500">
              <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop" alt="Cleaning Services" className="w-full h-full object-cover" />
            </div>
            
            {/* Bottom Left Image */}
            <div className="absolute bottom-[10%] left-[5%] w-[55%] h-[50%] rounded-3xl overflow-hidden shadow-2xl border-8 border-white z-30 -rotate-6 transform hover:rotate-0 hover:scale-105 transition-all duration-500">
              <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop" alt="Furniture Assembly" className="w-full h-full object-cover" />
            </div>

            {/* Middle decorative graphic */}
            <div className="absolute top-[40%] right-[60%] bg-white p-4 rounded-2xl shadow-xl z-40 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Trusted Pros</p>
                  <p className="text-xs text-slate-500">Verified & Background Checked</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Popular Projects Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
          Popular Projects in Your Area
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Furniture Assembly",
              price: "Avg. ₹400-800",
              img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
            },
            {
              title: "TV Mounting",
              price: "Avg. ₹500-900",
              img: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=600&auto=format&fit=crop",
            },
            {
              title: "Help Moving",
              price: "Avg. ₹1000-2500",
              img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
            },
            {
              title: "Deep Cleaning",
              price: "Avg. ₹800-1500",
              img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
            },
          ].map((project, idx) => (
            <div
              key={idx}
              className="group cursor-pointer rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all overflow-hidden flex flex-col"
            >
              <div className="h-40 overflow-hidden bg-slate-100">
                <img
                  src={project.img}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply opacity-80"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-500 mt-1 mb-4">
                  {project.price}
                </p>
                <button className="mt-auto text-left text-sm font-bold text-emerald-600 group-hover:underline">
                  Book now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-50 py-24 px-6 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-16 text-center">
            How QuickMate Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Search,
                title: "1. Describe your task",
                desc: "Choose from a variety of home services and select the day and time you'd like a qualified helper to show up.",
              },
              {
                icon: Star,
                title: "2. Choose a Helper",
                desc: "Browse a list of background-checked professionals, view their prices, and read verified reviews from local users.",
              },
              {
                icon: CheckCircle,
                title: "3. Get it done",
                desc: "Chat securely, manage your booking, pay directly through escrow, and leave a review all within the platform.",
              },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
                  <step.icon className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 mb-6 border border-emerald-100">
          <ShieldCheck className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-6">
          The QuickMate Pledge
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-10">
          Your safety and satisfaction are our top priorities. Every helper
          undergoes strict identity verification and background checks. With our
          secure escrow payments, your money is held safely until the job is
          completed to your satisfaction.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <CheckCircle className="h-6 w-6 text-emerald-500 mb-3" />
            <h4 className="font-bold text-slate-900 mb-1">Vetted Pros</h4>
            <p className="text-sm text-slate-500">
              Rigorous background and identity checks.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <ShieldCheck className="h-6 w-6 text-emerald-500 mb-3" />
            <h4 className="font-bold text-slate-900 mb-1">Secure Escrow</h4>
            <p className="text-sm text-slate-500">
              Payments are protected until job completion.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <ThumbsUp className="h-6 w-6 text-emerald-500 mb-3" />
            <h4 className="font-bold text-slate-900 mb-1">
              Happiness Guarantee
            </h4>
            <p className="text-sm text-slate-500">
              We'll make it right if things go wrong.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-center text-slate-500">
        <div className="flex items-center justify-center mb-6">
          <Link href="/" className="flex items-center justify-center">
            <img
              src="/logo-v3.png"
              alt="QuickMate"
              className="h-14 sm:h-16 w-auto object-contain mix-blend-multiply opacity-90 scale-[2.5] origin-center"
            />
          </Link>
        </div>
        <p className="text-sm font-medium">
          © 2026 QuickMate. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

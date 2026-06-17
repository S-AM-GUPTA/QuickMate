"use client";

import React, { useEffect, useState } from "react";
import {
  Shield,
  ArrowRight,
  Star,
  Clock,
  CheckCircle,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-50 selection:bg-blue-500/30 overflow-x-hidden">
      {/* Dynamic Background Blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] h-[70%] w-[50%] rounded-full bg-blue-900/20 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] -right-[10%] h-[60%] w-[40%] rounded-full bg-indigo-900/20 blur-[120px] mix-blend-screen" />
        <div className="absolute -bottom-[20%] left-[20%] h-[60%] w-[60%] rounded-full bg-emerald-900/10 blur-[120px] mix-blend-screen" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/30">
            <Shield className="h-5 w-5 text-white fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Quick<span className="text-blue-400">Mate</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/login")}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg shadow-white/10 hover:bg-slate-100 hover:scale-105 transition-all cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-20 pb-32 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300 mb-8 backdrop-blur-md">
          <Zap className="h-4 w-4 text-blue-400 fill-current" />
          <span>The fastest way to get local help in India</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-400 mb-8 leading-tight">
          Your Local Errands, <br className="hidden md:block" />
          Sorted in <span className="text-blue-500">Minutes</span>.
        </h1>

        <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
          From grocery pickups to urgent home repairs, QuickMate connects you
          instantly with verified, highly-rated helpers nearby. Secure payments,
          zero stress.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all hover:scale-105 cursor-pointer"
          >
            Post a Task Now
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => router.push("/login")}
            className="w-full sm:w-auto rounded-full border border-slate-700 bg-slate-900/50 px-8 py-4 text-base font-bold text-slate-300 backdrop-blur-sm hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
          >
            Become a Helper
          </button>
        </div>

        {/* Social Proof */}
        <div className="mt-16 flex items-center justify-center gap-4 text-sm text-slate-500">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-8 w-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center overflow-hidden`}
              >
                <img
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  alt="User"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col items-start">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-3 w-3 fill-current" />
              ))}
            </div>
            <span className="font-medium mt-0.5 text-xs">
              Trusted by 10,000+ users
            </span>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 bg-slate-900/50 border-y border-slate-800/60 backdrop-blur-xl py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why choose QuickMate?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We've built the safest, fastest platform for local tasks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-8 shadow-2xl hover:border-blue-500/30 transition-colors group">
              <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Verified Helpers
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Every helper undergoes strict KYC and background checks. Only
                the top 10% make it to the platform.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-8 shadow-2xl hover:border-emerald-500/30 transition-colors group">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle className="h-7 w-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Secure Escrow
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Your money is held safely in escrow. Payments are only released
                when you are 100% satisfied with the job.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-8 shadow-2xl hover:border-indigo-500/30 transition-colors group">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="h-7 w-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Lightning Fast
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Our AI-driven matching algorithm finds the closest available
                helper to your location in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-12 text-center text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-6 w-6 text-slate-700 fill-current" />
          <span className="text-lg font-bold text-slate-600">QuickMate</span>
        </div>
        <p className="text-sm">© 2026 QuickMate MVP. Built with passion.</p>
      </footer>
    </div>
  );
}

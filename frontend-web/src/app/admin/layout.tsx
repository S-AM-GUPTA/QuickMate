"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Briefcase, ArrowLeft, LogOut } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic frontend check for admin role
    const checkRole = async () => {
      try {
        const userProfile = localStorage.getItem("userProfile");
        if (!userProfile) {
          router.push("/login");
          return;
        }
        
        const user = JSON.parse(userProfile);
        if (user.role !== "admin") {
          // Verify with backend just in case
          const res = await api.get("/users/me");
          if (res.data.role !== "admin") {
            router.push("/dashboard"); // Redirect non-admins back to dashboard
            return;
          }
        }
        setIsAdmin(true);
      } catch (error) {
        console.error(error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    checkRole();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const navigation = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Tasks", href: "/admin/tasks", icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-2xl border-r border-emerald-100/50 text-slate-800 flex flex-col hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-20">
        <div className="h-20 flex items-center px-8 border-b border-emerald-50/50">
          <img src="/logo-v7.png" alt="Logo" className="h-9 drop-shadow-sm mix-blend-multiply" />
        </div>
        <nav className="flex-1 px-4 py-8 space-y-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 font-bold translate-x-1" : "text-slate-500 hover:bg-emerald-50/80 hover:text-emerald-700 hover:translate-x-1"}`}>
                <item.icon className={`h-5 w-5 mr-3 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'}`} />
                <span className="font-semibold tracking-wide text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-emerald-50/50">
          <Link href="/dashboard" className="flex items-center px-4 py-3 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50/80 rounded-2xl transition-all duration-300 group">
            <ArrowLeft className="h-5 w-5 mr-3 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            <span className="font-semibold text-sm">Back to App</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col relative">
        <header className="h-20 bg-white/60 border-b border-white/40 flex items-center justify-between px-10 sticky top-0 z-30 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-800 to-teal-600 bg-clip-text text-transparent tracking-tight">
            {pathname.split("/").pop() === "admin" ? "Overview" : pathname.split("/").pop()}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-emerald-50">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-emerald-700 tracking-wide uppercase">Live Mode</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
              A
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

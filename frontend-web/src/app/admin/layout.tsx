"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Briefcase, ArrowLeft, LogOut, PlusCircle, ShieldCheck, CreditCard } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="w-8 h-8 border-4 border-moss border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const navigation = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Tasks", href: "/admin/tasks", icon: Briefcase },
    { name: "KYC Review", href: "/admin/kyc", icon: ShieldCheck },
    { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
    { name: "Post Task", href: "/admin/post-task", icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen bg-parchment flex font-sans text-ink">
      {/* Sidebar */}
      <aside className="w-64 bg-paper border-r border-smoke/30 flex flex-col hidden md:flex relative z-20">
        <div className="h-20 flex items-center px-8 border-b border-smoke/30">
          <img src="/logo.png" alt="Logo" className="h-10 drop-shadow-sm" />
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? "bg-charcoal text-paper shadow-md" : "text-smoke hover:bg-sand hover:text-ink"}`}>
                <item.icon className={`h-5 w-5 mr-3 transition-colors ${isActive ? 'text-paper' : 'text-smoke group-hover:text-moss'}`} />
                <span className="font-semibold tracking-wide text-[14px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-smoke/30">
          <Link href="/dashboard" className="flex items-center px-4 py-3 text-smoke hover:text-ink hover:bg-sand rounded-xl transition-all duration-300 group">
            <ArrowLeft className="h-5 w-5 mr-3 text-smoke group-hover:text-ink transition-colors" />
            <span className="font-semibold text-[14px]">Back to App</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col relative">
        <header className="h-20 bg-paper/80 border-b border-smoke/30 flex items-center justify-between px-10 sticky top-0 z-30 backdrop-blur-xl">
          <h1 className="text-[28px] tracking-tight text-ink">
            {pathname.split("/").pop() === "admin" ? "Overview" : pathname.split("/").pop()?.replace("-", " ")}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-charcoal text-paper flex items-center justify-center font-bold shadow-sm">
              A
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

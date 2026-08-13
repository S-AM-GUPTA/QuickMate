"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Bell, MapPin, Menu, X, Activity } from "lucide-react";
import { useNotification } from "@/context/NotificationContext";
import { ProfileProvider, useProfile } from "@/context/ProfileContext";

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { notifications, unreadCount, markAllAsRead } = useNotification();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationSearchInput, setLocationSearchInput] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  
  const { profile, toggleRole, isLoading } = useProfile();

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (!token) {
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      router.push("/login");
    } else {
      setIsLoggedIn(true);
      setIsCheckingAuth(false);
    }
  }, [router]);

  // Restore Location Fetch
  const fetchCurrentLocation = () => {
    setIsFetchingLocation(true);
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();
            
            // Extract a concise location name (city or neighborhood)
            const locationName = data.address?.city || data.address?.town || data.address?.neighbourhood || "Location found";
            setAddress(locationName);
            setShowLocationDropdown(false);
          } catch (err) {
            setAddress("Coordinates found");
          } finally {
            setIsFetchingLocation(false);
          }
        },
        (error) => {
          console.warn("Geolocation failed or blocked, using fallback", error);
          setAddress("City Center");
          setIsFetchingLocation(false);
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const handleManualLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationSearchInput.trim()) return;
    
    setIsFetchingLocation(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearchInput)}&limit=1`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        // Just use the first part of the display name (usually the city/area)
        const locationName = data[0].display_name.split(",")[0];
        setAddress(locationName);
        setShowLocationDropdown(false);
        setLocationSearchInput("");
      } else {
        alert("Location not found. Please try a different search.");
      }
    } catch (err) {
      console.error("Failed to search location", err);
    } finally {
      setIsFetchingLocation(false);
    }
  };

  if (isCheckingAuth || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment text-ink">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-ink border-t-transparent rounded-full animate-spin"></div>
          <p className="text-ink font-sans font-medium tracking-widest uppercase text-sm">Loading</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen text-ink font-sans pb-20 md:pb-0 overflow-x-hidden">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-parchment/90 backdrop-blur-xl border-b border-smoke transition-all">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
              <img src="/logo.png" alt="QuickMate" className="h-10 sm:h-12 w-auto object-contain cursor-pointer" />
            </Link>
            
            {/* Location display & dropdown */}
            <div className="hidden md:block relative">
              <button 
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center gap-1.5 text-smoke text-[13px] font-medium bg-sand hover:bg-mist px-3 py-1.5 rounded-full border border-smoke/30 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{address || "Fetching location..."}</span>
              </button>
              
              {showLocationDropdown && (
                <div className="absolute top-full mt-2 left-0 w-72 bg-paper rounded-xl border border-smoke/40 shadow-xl z-50 p-4">
                  <h4 className="text-[13px] font-semibold text-ink mb-3">Change Location</h4>
                  
                  <button 
                    onClick={fetchCurrentLocation}
                    disabled={isFetchingLocation}
                    className="w-full mb-4 flex items-center justify-center gap-2 bg-charcoal text-paper py-2 rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <MapPin className="w-4 h-4" />
                    {isFetchingLocation ? "Detecting..." : "Use Current Location"}
                  </button>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-px bg-smoke/20 flex-1"></div>
                    <span className="text-[11px] font-medium text-smoke uppercase tracking-wider">or</span>
                    <div className="h-px bg-smoke/20 flex-1"></div>
                  </div>
                  
                  <form onSubmit={handleManualLocationSearch}>
                    <input 
                      type="text" 
                      placeholder="e.g. New York, Mumbai" 
                      value={locationSearchInput}
                      onChange={(e) => setLocationSearchInput(e.target.value)}
                      className="w-full border border-smoke/40 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-charcoal mb-2"
                    />
                    <button 
                      type="submit"
                      disabled={!locationSearchInput.trim() || isFetchingLocation}
                      className="w-full bg-sand text-ink py-2 rounded-lg text-[13px] font-medium hover:bg-smoke/10 transition-colors disabled:opacity-50"
                    >
                      Search
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard/tasks"
              className={`text-[14px] font-medium transition-all cursor-pointer ${isActive('/dashboard/tasks') ? 'text-ink font-semibold' : 'text-smoke hover:text-moss hover:underline'}`}
            >
              Tasks
            </Link>
            
            <Link
              href="/dashboard/mates"
              className={`text-[14px] font-medium transition-all cursor-pointer ${isActive('/dashboard/mates') ? 'text-ink font-semibold' : 'text-smoke hover:text-moss hover:underline'}`}
            >
              Mates
            </Link>

            <Link
              href="/dashboard/analytics"
              className={`text-[14px] font-medium transition-all cursor-pointer ${isActive('/dashboard/analytics') ? 'text-ink font-semibold' : 'text-smoke hover:text-moss hover:underline'}`}
            >
              Analytics
            </Link>

            <Link
              href="/dashboard/wallet"
              className={`text-[14px] font-medium transition-all cursor-pointer ${isActive('/dashboard/wallet') ? 'text-ink font-semibold' : 'text-smoke hover:text-moss hover:underline'}`}
            >
              Wallet
            </Link>

            <Link
              href="/dashboard/profile"
              className={`text-[14px] font-medium transition-all cursor-pointer ${isActive('/dashboard/profile') ? 'text-ink font-semibold' : 'text-smoke hover:text-moss hover:underline'}`}
            >
              Account
            </Link>

            {profile.role === 'admin' && (
              <Link
                href="/admin"
                className="text-[14px] font-bold text-coral hover:text-coral/80 transition-colors cursor-pointer ml-2 bg-coral/10 px-3 py-1 rounded-full border border-coral/20"
              >
                Admin Panel
              </Link>
            )}

            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  if (unreadCount > 0) markAllAsRead();
                }}
                className="relative p-2 text-ink hover:bg-sand transition-colors cursor-pointer rounded-full"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-moss border-2 border-paper"></span>
                )}
              </button>
              
              {showNotifDropdown && (
                <div className="absolute right-0 mt-3 w-80 bg-paper rounded-2xl border border-smoke z-50 overflow-hidden text-ink">
                  <div className="p-4 border-b border-smoke flex justify-between items-center bg-sand/50">
                    <h3 className="font-medium text-[14px]">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-smoke text-sm font-medium">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-4 border-b border-smoke hover:bg-sand transition-colors">
                          <p className="text-[13px] text-ink font-medium leading-tight">{n.message}</p>
                          <span className="text-[11px] text-smoke mt-1.5 block">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-[1px] bg-smoke/50 mx-2 hidden lg:block"></div>

            <button 
              onClick={toggleRole}
              className="text-[13px] font-medium text-smoke hover:text-moss transition-colors hidden lg:block"
            >
              Switch to {profile.role === "customer" ? "Mate" : "Customer"}
            </button>

            {profile.role === "customer" ? (
              <Link 
                href="/dashboard/tasks?post=true"
                className="rounded-full bg-moss px-5 py-2 text-[14px] font-medium text-paper hover:bg-moss/90 transition-opacity cursor-pointer flex items-center gap-2"
              >
                Post a Task
              </Link>
            ) : (
              <Link 
                href="/dashboard/tasks"
                className="rounded-full bg-moss px-5 py-2 text-[14px] font-medium text-paper hover:bg-moss/90 transition-opacity cursor-pointer flex items-center gap-2"
              >
                Find Work
              </Link>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  if (unreadCount > 0) markAllAsRead();
                }}
                className="relative p-2 text-ink hover:bg-sand transition-colors cursor-pointer rounded-full"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-moss border-2 border-paper"></span>
                )}
              </button>
              
              {showNotifDropdown && (
                <div className="absolute right-0 mt-3 w-[80vw] max-w-sm bg-paper rounded-2xl border border-smoke z-50 overflow-hidden text-ink">
                  <div className="p-4 border-b border-smoke flex justify-between items-center bg-sand/50">
                    <h3 className="font-medium text-[14px]">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-smoke text-sm font-medium">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-4 border-b border-smoke hover:bg-sand transition-colors">
                          <p className="text-[13px] text-ink font-medium leading-tight">{n.message}</p>
                          <span className="text-[11px] text-smoke mt-1.5 block">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ink hover:bg-sand rounded-full transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-parchment pt-20 px-6 pb-6 overflow-y-auto border-t border-smoke">
          <div className="flex flex-col gap-6 pt-4">
            <Link
              href="/dashboard/tasks"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-2xl transition-all ${isActive('/dashboard/tasks') ? 'text-ink' : 'text-smoke'}`}
            >
              Tasks
            </Link>
            <Link
              href="/dashboard/mates"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-2xl transition-all ${isActive('/dashboard/mates') ? 'text-ink' : 'text-smoke'}`}
            >
              Mates
            </Link>
            <Link
              href="/dashboard/analytics"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-2xl transition-all ${isActive('/dashboard/analytics') ? 'text-ink' : 'text-smoke'}`}
            >
              Analytics
            </Link>
            <Link
              href="/dashboard/wallet"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-2xl transition-all ${isActive('/dashboard/wallet') ? 'text-ink' : 'text-smoke'}`}
            >
              Wallet
            </Link>
            <Link
              href="/dashboard/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-2xl transition-all ${isActive('/dashboard/profile') ? 'text-ink' : 'text-smoke'}`}
            >
              Account
            </Link>

            {profile.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl transition-all text-coral"
              >
                Admin Panel
              </Link>
            )}
            
            <div className="h-px w-full bg-smoke/50 my-2"></div>
            
            <button 
              onClick={() => {
                toggleRole();
                setMobileMenuOpen(false);
              }}
              className="text-left text-[16px] font-medium text-ink py-2"
            >
              Switch to {profile.role === "customer" ? "Mate" : "Customer"}
            </button>
            
            {profile.role === "customer" ? (
              <Link 
                href="/dashboard/tasks?post=true"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 rounded-full bg-moss px-6 py-4 text-[16px] text-center font-medium text-paper hover:bg-moss/90"
              >
                Post a Task
              </Link>
            ) : (
              <Link 
                href="/dashboard/tasks"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 rounded-full bg-moss px-6 py-4 text-[16px] text-center font-medium text-paper hover:bg-moss/90"
              >
                Find Work
              </Link>
            )}
            
            <div className="mt-auto pt-8 flex items-center gap-2 text-smoke text-[13px] font-medium bg-sand px-4 py-3 rounded-2xl border border-smoke/30">
              <MapPin className="w-4 h-4" />
              <span>{address || "Fetching location..."}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Rendered Here */}
      <main className="mx-auto max-w-[1200px] px-6 pt-8 pb-20 md:pb-32">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </ProfileProvider>
  );
}

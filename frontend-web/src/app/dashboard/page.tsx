"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  Plus,
  Search,
  Sliders,
  Shield,
  Star,
  CheckCircle,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  Wallet,
  Map,
  PlusCircle,
  User,
  Award,
  ArrowRight,
  X,
  Play,
  Upload,
  FileText,
  Loader2,
  Save,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import TaskCard, { Task } from "../../components/TaskCard";
import HelperCard, { Helper } from "../../components/HelperCard";
import ChatSim from "../../components/ChatSim";
import PaymentEscrow from "../../components/PaymentEscrow";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const LocationPickerMap = dynamic(
  () => import("../../components/LocationPickerMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[200px] w-full animate-pulse bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-slate-400 text-sm">
        Loading map...
      </div>
    ),
  },
);

// Initial helpers near Delhi Connaught Place (matching coordinates in schema & test-db)
const initialHelpers: Helper[] = [
  {
    id: "helper_delhi_1",
    name: "Rahul Sharma",
    email: "rahul@quickmate.com",
    role: "helper",
    phone: "+91 98765 43210",
    skills: ["Tech Help", "Roommate Help", "Lab Files"],
    latitude: 28.632,
    longitude: 77.219,
    rating: 4.9,
    completedTasksCount: 34,
    isVerified: true,
    distanceMeters: 220,
  },
  {
    id: "helper_delhi_2",
    name: "Amit Patel",
    email: "amit@quickmate.com",
    role: "helper",
    phone: "+91 87654 32109",
    skills: ["Food Pickup", "Notes & Printouts", "Errands"],
    latitude: 28.635,
    longitude: 77.221,
    rating: 4.7,
    completedTasksCount: 18,
    isVerified: true,
    distanceMeters: 620,
  },
  {
    id: "helper_delhi_3",
    name: "Pooja Sen",
    email: "pooja@quickmate.com",
    role: "helper",
    phone: "+91 76543 21098",
    skills: ["Lab Files", "Notes & Printouts", "Food Pickup"],
    latitude: 28.628,
    longitude: 77.212,
    rating: 4.8,
    completedTasksCount: 27,
    isVerified: false,
    distanceMeters: 780,
  },
];

// Initial tasks matching database structure
const initialTasks: Task[] = [
  {
    id: "task_delhi_101",
    title: "Food Pickup from Canteen",
    description:
      "Pick up my lunch order from the main canteen and deliver it to Hostel C.",
    budget: 50,
    category: "Food Pickup",
    urgency: "medium",
    status: "OPEN",
    latitude: 28.635,
    longitude: 77.221,
    scheduledTime: new Date(Date.now() + 3600000).toISOString(),
    customerId: "user_customer_123",
    distanceMeters: 604,
  },
];

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Moved to below profileData

  const [activeRole, setActiveRole] = useState<"customer" | "helper">(
    "customer",
  );
  const [currentTab, setCurrentTab] = useState<
    "dashboard" | "profile" | "settings"
  >("dashboard");
  const [accountTab, setAccountTab] = useState("Profile");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [helpers, setHelpers] = useState<Helper[]>(initialHelpers);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [activeRole]);

  // Modals & Flows
  const [showPostModal, setShowPostModal] = useState(false);
  const [showBidsModal, setShowBidsModal] = useState(false);
  const [activeTaskForBids, setActiveTaskForBids] = useState<Task | null>(null);
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [activeTaskForEscrow, setActiveTaskForEscrow] = useState<Task | null>(
    null,
  );
  const [showChatModal, setShowChatModal] = useState(false);
  const [activeChatTask, setActiveChatTask] = useState<Task | null>(null);

  // Feedback
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeReviewTask, setActiveReviewTask] = useState<Task | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: 50,
    category: "Food Pickup",
    urgency: "medium" as "low" | "medium" | "urgent",
    latitude: 28.6304,
    longitude: 77.2177,
    scheduledTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    estimatedDuration: "1-2 hours",
    address: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Profile Modal State
  const [selectedProfile, setSelectedProfile] = useState<Helper | null>(null);
  
  // Profile Image Upload State
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Simulation notification
  const [notification, setNotification] = useState<string | null>(null);
  
  // Password Change state
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setIsChangingPassword(true);
    try {
      await api.patch('/users/password', {
        currentPassword,
        newPassword
      });
      setIsChangePasswordOpen(false);
      setNotification("Password successfully updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      const errorText = Array.isArray(msg) ? msg[0] : (msg || "Failed to update password. Make sure backend is running.");
      setPasswordError(errorText);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Profile & Verification states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "QuickMate User",
    email: "user@quickmate.local",
    phone: "+91 9876543210",
    bio: "I am a reliable local helper ready to assist with daily tasks.",
    address: "New Delhi, India",
    skills: ["Delivery", "Errands"],
    postalCode: "110001",
    role: "customer",
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsLoggedIn(true);
      const userProfileRaw = localStorage.getItem("userProfile");
      if (userProfileRaw) {
        try {
          const up = JSON.parse(userProfileRaw);
          setProfileData(prev => ({
            ...prev,
            name: up.name || prev.name,
            email: up.email || prev.email,
            phone: up.phone || prev.phone,
            postalCode: up.postalCode || "110001",
            role: up.role || "customer",
          }));
        } catch(e) {}
      }
    }
  }, [router]);

  const [verificationState, setVerificationState] = useState({
    status: "Pending Upload", // 'Pending Upload' | 'Uploading' | 'Pending Review' | 'Verified'
    docType: "Aadhar Card",
  });

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadKyc = () => {
    setVerificationState((prev) => ({ ...prev, status: "Uploading" }));
    setTimeout(() => {
      setVerificationState((prev) => ({ ...prev, status: "Pending Review" }));
      setNotification(
        "✅ Document uploaded successfully! Pending admin review.",
      );
      setTimeout(() => setNotification(null), 4000);
    }, 2000);
  };

  const categories = [
    "All",
    "Notes & Printouts",
    "Food Pickup",
    "Lab Files",
    "Roommate Help",
    "Tech Help",
    "Errands",
  ];

  // Simulation effect: When a customer posts a task, a helper automatically bids after 4 seconds
  useEffect(() => {
    const checkBids = setTimeout(() => {
      const openCustomTasks = tasks.filter(
        (t) =>
          t.status === "OPEN" &&
          t.id !== "task_delhi_101",
      );
      if (openCustomTasks.length > 0) {
        const lastTask = openCustomTasks[openCustomTasks.length - 1];
        setNotification(
          `🔔 Rahul Sharma placed a bid of Rs. ${lastTask.budget - 10} on "${lastTask.title}"!`,
        );
        setTimeout(() => setNotification(null), 6000);
      }
    }, 4000);
    return () => clearTimeout(checkBids);
  }, [tasks]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "budget" || name === "latitude" || name === "longitude"
          ? Number(value)
          : value,
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (formData.title.length < 5)
      errors.title = "Title must be at least 5 characters long.";
    if (formData.description.length < 10)
      errors.description = "Description must be at least 10 characters long.";
    if (formData.budget < 10) errors.budget = "Budget must be at least Rs. 10.";
    if (formData.latitude < -90 || formData.latitude > 90)
      errors.latitude = "Latitude must be between -90 and 90.";
    if (formData.longitude < -180 || formData.longitude > 180)
      errors.longitude = "Longitude must be between -180 and 180.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePostTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await api.post('/tasks', {
        title: formData.title,
        description: formData.description,
        budget: formData.budget,
        category: formData.category,
        urgency: formData.urgency,
        latitude: formData.latitude,
        longitude: formData.longitude,
        address: formData.address,
        scheduledTime: new Date(formData.scheduledTime).toISOString(),
      });

      await fetchTasks();
      setShowPostModal(false);
      // Reset Form
      setFormData({
        title: "",
        description: "",
        budget: 50,
        category: "Food Pickup",
        urgency: "medium",
        latitude: 28.6304,
        longitude: 77.2177,
        scheduledTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        estimatedDuration: "1-2 hours",
        address: "",
      });
    } catch (err: any) {
      console.error("Failed to post task", err);
      alert(err.response?.data?.message || "Failed to post task");
    }
  };

  const handlePlaceBid = (task: Task) => {
    setNotification(
      `✔ Bid of Rs. ${task.budget} successfully submitted for "${task.title}"!`,
    );
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAcceptBid = (task: Task, helper: Helper) => {
    setActiveTaskForEscrow(task);
    setShowBidsModal(false);
    setShowEscrowModal(true);
  };

  const handlePaymentSuccess = () => {
    if (!activeTaskForEscrow) return;

    // Update task status to IN_PROGRESS and assign helper
    setTasks((prev) =>
      prev.map((t) =>
        t.id === activeTaskForEscrow.id
          ? { ...t, status: "IN_PROGRESS", assignedHelperId: "helper_delhi_1" }
          : t,
      ),
    );

    const matchedHelper =
      helpers.find((h) => h.id === "helper_delhi_1") || helpers[0];

    setTimeout(() => {
      setShowEscrowModal(false);
      setNotification(
        `🎉 Escrow locked! ${matchedHelper.name} has been assigned to your task.`,
      );
      setTimeout(() => setNotification(null), 5000);
    }, 2000);
  };

  const handleReleasePayment = (task: Task) => {
    setActiveReviewTask(task);
    setShowReviewModal(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReviewTask) return;

    // Set task to COMPLETED
    setTasks((prev) =>
      prev.map((t) =>
        t.id === activeReviewTask.id ? { ...t, status: "COMPLETED" } : t,
      ),
    );

    // Update helper task count dynamically in local state
    setHelpers((prev) =>
      prev.map((h) =>
        h.id === "helper_delhi_1"
          ? {
              ...h,
              completedTasksCount: h.completedTasksCount + 1,
              rating:
                (h.rating * h.completedTasksCount + reviewRating) /
                (h.completedTasksCount + 1),
            }
          : h,
      ),
    );

    setShowReviewModal(false);
    setActiveReviewTask(null);
    setReviewText("");
    setReviewRating(5);

    setNotification(
      `⭐ Thank you! Review submitted. Payment released to Rahul Sharma.`,
    );
    setTimeout(() => setNotification(null), 5000);
  };

  const filteredTasks =
    selectedCategory === "All"
      ? tasks
      : tasks.filter(
          (t) => t.category.toLowerCase() === selectedCategory.toLowerCase(),
        );

  return (
    <div className="min-h-screen bg-[#f6f6f6] font-sans text-[#212529]">
      {/* Simulation Alert banner */}
      {notification && (
        <div className="fixed top-4 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl dark:bg-white dark:text-slate-900 border border-slate-800 dark:border-zinc-200 animate-bounce">
            <span>{notification}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-3 rounded p-0.5 hover:bg-slate-800 dark:hover:bg-zinc-100 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm transition-all">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-2">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentTab('dashboard')} className="flex items-center gap-2 cursor-pointer ml-4">
              <img src="/logo-v7.png" alt="QuickMate Logo" className="h-10 sm:h-12 w-auto object-contain" />
            </button>
          </div>

          <div className="flex items-center gap-8">
            <button
              onClick={() => {
                setActiveRole("customer");
                setCurrentTab("dashboard");
                setShowPostModal(true);
              }}
              className="text-[15px] font-bold text-[#212529] hover:text-[#0D7F64] transition-colors cursor-pointer"
            >
              Book a Task
            </button>
            <button
              onClick={() => {
                setActiveRole("customer");
                setCurrentTab("dashboard");
              }}
              className="text-[15px] font-bold text-[#212529] hover:text-[#0D7F64] transition-colors cursor-pointer"
            >
              My Tasks
            </button>
            <button
              onClick={() => {
                setActiveRole("helper");
                setCurrentTab("dashboard");
              }}
              className="text-[15px] font-bold text-[#212529] hover:text-[#0D7F64] transition-colors cursor-pointer"
            >
              Become a Mate
            </button>
            {profileData.role === 'admin' && (
              <button
                onClick={() => router.push("/admin")}
                className="text-[15px] font-bold text-white bg-emerald-600 px-4 py-2 rounded-xl shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all cursor-pointer"
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={() => setCurrentTab("profile")}
              className="text-[15px] font-extrabold text-[#212529] hover:text-[#0D7F64] transition-colors cursor-pointer"
            >
              Account
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="mx-auto max-w-7xl px-4 pt-4 pb-8 sm:px-6 lg:px-8 relative">
        {/* Animated Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-10 -right-20 w-[600px] h-[600px] rounded-full bg-emerald-100/40 blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-40 -left-20 w-[500px] h-[500px] rounded-full bg-teal-50/40 blur-[80px] animate-pulse" style={{ animationDuration: '6s' }} />
        </div>

        {/* Category Filters */}
        {currentTab === "dashboard" && (
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4 mt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* ==================== CUSTOMER MODE VIEW ==================== */}
        {activeRole === "customer" && currentTab === "dashboard" && (
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left side: Hero & Post Task */}
            <div className="lg:col-span-2 space-y-8">
              {/* Engaging Hero Banner */}
              <div className="rounded-[2rem] bg-gradient-to-br from-emerald-600 to-teal-800 p-8 sm:p-12 min-h-[460px] text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between group">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('/furniture-assembly.png')] bg-cover bg-center opacity-[0.15] mix-blend-overlay pointer-events-none" />
                
                {/* Glow effects */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[60px]" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-400/20 rounded-full blur-[50px]" />
                
                <div className="flex-1 relative z-10 pr-0 md:pr-8">
                  <span className="inline-block py-1.5 px-4 rounded-full bg-white/20 backdrop-blur-md text-emerald-50 text-[11px] font-bold tracking-wider mb-5 border border-white/20 shadow-sm uppercase">
                    ✨ Your Personal Helpers
                  </span>
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md leading-tight">
                    {greeting}! <br/><span className="text-emerald-200">What do you need help with?</span>
                  </h1>
                  <p className="mt-4 text-emerald-50/90 text-lg max-w-md font-medium leading-relaxed">
                    Book trusted help for home repairs, cleaning, moving, and more.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button 
                      onClick={() => setShowPostModal(true)} 
                      className="px-6 py-3 rounded-full bg-white text-emerald-700 font-extrabold hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-white/20 flex items-center gap-2 cursor-pointer"
                    >
                      Post a Task Now <ArrowRight className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-2 text-xs text-emerald-50 font-medium bg-white/10 backdrop-blur-sm rounded-full px-4 py-3 border border-white/20 shadow-inner">
                      <Shield className="h-4 w-4 text-emerald-200" />
                      Secure Escrow
                    </div>
                  </div>
                </div>

                {/* Right side beautifully constrained graphic */}
                <div className="hidden md:block w-[40%] relative z-10 h-64 mt-8 md:mt-0">
                  <div className="absolute inset-0 right-4 transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <img src="/deep-cleaning.png" className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-white/20" alt="Cleaning" />
                  </div>
                  <div className="absolute -bottom-6 -left-8 w-32 h-32 transform -rotate-6 group-hover:-rotate-12 transition-transform duration-500 shadow-xl rounded-2xl border-4 border-white/20 overflow-hidden">
                    <img src="/tv-mounting.png" className="w-full h-full object-cover opacity-90" alt="Mounting" />
                  </div>
                </div>
              </div>

              {/* Tasks Feed */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                  My Posted Tasks
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {filteredTasks
                    .map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        viewMode="customer"
                        onViewBids={(t) => {
                          setActiveTaskForBids(t);
                          setShowBidsModal(true);
                        }}
                        onReleasePayment={handleReleasePayment}
                      />
                    ))}
                  {filteredTasks.length === 0 && (
                    <div className="col-span-2 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-900/10">
                      <AlertTriangle className="h-8 w-8 text-slate-300" />
                      <p className="mt-2 text-sm text-slate-400">
                        No tasks posted in this category yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right side: Nearby Helpers */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 drop-shadow-sm">
                  Available Mates {selectedCategory !== "All" && `for ${selectedCategory}`}
                </h3>
                <span className="rounded-full bg-emerald-100/50 backdrop-blur-sm border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 shadow-sm">
                  Online
                </span>
              </div>
              <div className="space-y-4">
                {helpers
                  .filter(h => selectedCategory === "All" || h.skills.some(skill => skill.toLowerCase().includes(selectedCategory.toLowerCase())))
                  .map((helper) => (
                  <HelperCard
                    key={helper.id}
                    helper={helper}
                    onViewProfile={setSelectedProfile}
                    onHire={(h) => {
                      const matchedTask =
                        tasks.find(
                          (t) => t.status === "OPEN",
                        ) || tasks[0];
                      setActiveChatTask(matchedTask);
                      setShowChatModal(true);
                    }}
                  />
                ))}
                
                {helpers.filter(h => selectedCategory === "All" || h.skills.some(skill => skill.toLowerCase().includes(selectedCategory.toLowerCase()))).length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10">
                    <p className="text-sm text-slate-500 font-medium">No mates available for this category right now.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== HELPER MODE VIEW ==================== */}
        {activeRole === "helper" && currentTab === "dashboard" && (
          <div className="mt-8 space-y-8">
            {verificationState.status !== "Verified" ? (
              <div className="rounded-2xl border border-[#ced4da] bg-white p-8 shadow-sm text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-6">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-extrabold text-[#212529] mb-2">
                  Verify Your Identity to Become a Mate
                </h2>
                <p className="text-[#6c757d] mb-8 max-w-lg mx-auto">
                  To ensure the safety of our community, all Mates must undergo a quick KYC verification before they can start accepting tasks.
                </p>
                <div className="max-w-md mx-auto space-y-4">
                  <div className="text-left">
                    <label className="block text-sm font-bold text-[#212529] mb-2">Select Document Type</label>
                    <select
                      value={verificationState.docType}
                      onChange={(e) => setVerificationState(prev => ({ ...prev, docType: e.target.value }))}
                      disabled={verificationState.status !== "Pending Upload"}
                      className="w-full rounded-md border border-[#ced4da] bg-white px-4 py-3 outline-none focus:border-[#0D7F64] disabled:opacity-50"
                    >
                      <option>Aadhar Card</option>
                      <option>PAN Card</option>
                      <option>Driving License</option>
                    </select>
                  </div>
                  
                  {verificationState.status === "Pending Upload" && (
                    <label className="w-full rounded-md border-2 border-dashed border-[#ced4da] bg-slate-50 py-10 font-bold text-[#0D7F64] hover:bg-[#e9ecef] transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setVerificationState(prev => ({ ...prev, status: "Uploading" }));
                            setTimeout(() => {
                              setVerificationState(prev => ({ ...prev, status: "Pending Review" }));
                            }, 2000);
                          }
                        }}
                      />
                      <Upload className="h-6 w-6" />
                      Click to browse and upload {verificationState.docType}
                    </label>
                  )}

                  {verificationState.status === "Uploading" && (
                    <div className="w-full rounded-md border border-[#ced4da] bg-slate-50 py-10 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-6 w-6 text-[#0D7F64] animate-spin" />
                      <p className="font-bold text-[#212529]">Uploading securely...</p>
                    </div>
                  )}

                  {verificationState.status === "Pending Review" && (
                    <div className="w-full rounded-md border border-amber-200 bg-amber-50 py-6 px-4 flex items-center justify-center gap-3 text-left">
                      <FileText className="h-6 w-6 text-amber-600 shrink-0" />
                      <div>
                        <p className="font-bold text-amber-800">Document under review</p>
                        <p className="text-sm text-amber-700 mt-1">We will notify you once verified. You can simulate approval by refreshing the page later. (Demo mode)</p>
                        <button 
                          onClick={() => setVerificationState(prev => ({ ...prev, status: "Verified" }))}
                          className="mt-3 text-xs font-bold bg-amber-200 text-amber-800 px-3 py-1 rounded hover:bg-amber-300 transition-colors cursor-pointer"
                        >
                          Dev: Force Approve
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Total Earnings
                  </span>
                  <Wallet className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold">Rs. 12,450</span>
                  <span className="text-xs font-semibold text-emerald-500 flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" />
                    +12%
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Average Rating
                  </span>
                  <Star className="h-5 w-5 text-amber-500 fill-current" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold">4.9</span>
                  <span className="text-xs text-slate-400 ml-1.5">
                    (34 reviews)
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Active Bids
                  </span>
                  <Sliders className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold">3</span>
                  <span className="text-xs text-slate-400 ml-1.5">
                    Pending accept
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Jobs Done
                  </span>
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold">
                    {helpers.find((h) => h.id === "helper_delhi_1")
                      ?.completedTasksCount || 34}
                  </span>
                  <span className="text-xs text-slate-400 ml-1.5">
                    Lifetime
                  </span>
                </div>
              </div>
            </div>

            {/* Proximity Feed / Job Discovery */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Tasks Map / List Feed */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    Available Jobs Nearby
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1.5 rounded-full">
                    <Map className="h-4 w-4 text-emerald-600" />
                    Sorted by distance
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      viewMode="helper"
                      onPlaceBid={handlePlaceBid}
                    />
                  ))}
                  {filteredTasks.length === 0 && (
                    <div className="col-span-2 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-900/10">
                      <AlertTriangle className="h-8 w-8 text-slate-300" />
                      <p className="mt-2 text-sm text-slate-400">
                        No open tasks nearby matching selection.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Helper Verification Status Panel */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Verification & Profile
                </h4>
                <div className="flex items-center gap-3 rounded-xl bg-blue-50/50 p-4">
                  <Award className="h-8 w-8 text-blue-600" />
                  <div>
                    <h5 className="font-semibold text-zinc-900">
                      Profile Rating Score
                    </h5>
                    <p className="text-xs text-zinc-500">
                      You are in the top 5% of local helpers.
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/20 p-4 text-xs">
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 fill-current" />
                    Verified Partner
                  </span>
                  <p className="mt-1 text-slate-500">
                    Your KYC document verification and address proofs are
                    completed successfully.
                  </p>
                </div>
              </div>
            </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== UNIFIED ACCOUNT VIEW ==================== */}
        {currentTab === "profile" && (
          <div className="mt-8 max-w-[1000px] mx-auto space-y-6">
            <h1 className="text-[32px] font-extrabold text-[#212529] mb-6">Your Account</h1>
            
            <div className="flex flex-col md:flex-row border border-[#ced4da] rounded-sm bg-white overflow-hidden">
              {/* Left Sidebar */}
              <div className="w-full md:w-[280px] bg-[#f8f9fa] border-r border-[#ced4da] flex flex-col shrink-0">
                {[
                  "Profile",
                  "Password",
                  "Account Security",
                  "Notifications",
                  "Billing Info",
                  "Cancel a Task",
                  "Business Information",
                  "Account Balance",
                  "Transactions",
                  "Delete Account"
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setAccountTab(tab)}
                    className={`px-6 py-4 text-left text-[15px] font-bold transition-colors cursor-pointer ${
                      accountTab === tab
                        ? "text-[#212529] border-l-4 border-[#0D7F64] bg-white"
                        : "text-[#0D7F64] border-l-4 border-transparent hover:bg-white hover:text-[#0a6650]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              {/* Main Content Box */}
              <div className="flex-1 p-8">
                {accountTab === "Profile" && (
                  <>
                    <div className="flex justify-between items-center border-b border-[#ced4da] pb-3 mb-6">
                      <h2 className="text-[22px] font-extrabold text-[#212529]">Account</h2>
                      <button className="rounded-md border border-[#ced4da] bg-white px-5 py-1.5 text-[14px] font-semibold text-[#212529] hover:bg-[#f8f9fa] transition-colors cursor-pointer">
                        Edit
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-8 items-start">
                      <div className="relative h-[160px] w-[160px] shrink-0 group">
                        <div className="h-full w-full rounded-full bg-[#e9ecef] flex items-center justify-center overflow-hidden border border-[#ced4da]">
                          {profileImage ? (
                            <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-[100px] w-[100px] text-[#ced4da]" />
                          )}
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <span className="text-sm font-semibold">Change Photo</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const url = URL.createObjectURL(e.target.files[0]);
                                setProfileImage(url);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-3 text-[#212529]">
                          <User className="h-[18px] w-[18px] text-[#495057]" />
                          <span className="text-[17px] font-bold">{profileData.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#212529]">
                          <Mail className="h-[18px] w-[18px] text-[#495057]" />
                          <span className="text-[17px] font-bold">{profileData.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#212529]">
                          <Phone className="h-[18px] w-[18px] text-[#495057]" />
                          <span className="text-[17px] font-bold">{profileData.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#212529]">
                          <MapPin className="h-[18px] w-[18px] text-[#495057]" />
                          <span className="text-[17px] font-bold">{profileData.postalCode || '110001'}</span>
                        </div>
                        <div className="pt-4">
                          <button 
                            onClick={() => {
                              localStorage.removeItem("accessToken");
                              localStorage.removeItem("token");
                              router.push("/login");
                            }}
                            className="rounded-md border border-[#ced4da] bg-white px-5 py-2 text-[14px] font-semibold text-[#212529] hover:bg-[#f8f9fa] transition-colors cursor-pointer"
                          >
                            Log Out
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {accountTab === "Password" && (
                  <div className="space-y-6">
                    <h2 className="text-[22px] font-extrabold text-[#212529] border-b border-[#ced4da] pb-3 mb-6">Password</h2>
                    <div className="space-y-4 max-w-sm">
                      <button 
                        onClick={() => setIsChangePasswordOpen(true)}
                        className="rounded-full bg-[#0D7F64] text-white px-6 py-2.5 font-bold hover:bg-[#0a6650] transition-colors"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                )}

                {accountTab === "Account Security" && (
                  <div className="space-y-6">
                    <h2 className="text-[22px] font-extrabold text-[#212529] border-b border-[#ced4da] pb-3 mb-6">Account Security</h2>
                    <div className="p-6 border border-[#ced4da] rounded-md flex justify-between items-center bg-[#f8f9fa]">
                      <div>
                        <p className="font-bold text-[#212529]">Two-Factor Authentication (2FA)</p>
                        <p className="text-sm text-[#6c757d]">Add an extra layer of security to your account.</p>
                      </div>
                      <button className="rounded-full bg-white border border-[#ced4da] text-[#212529] px-6 py-2 font-semibold hover:bg-gray-50 transition-colors">Enable 2FA</button>
                    </div>
                  </div>
                )}

                {accountTab === "Notifications" && (
                  <div className="space-y-6">
                    <h2 className="text-[22px] font-extrabold text-[#212529] border-b border-[#ced4da] pb-3 mb-6">Notifications</h2>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#0D7F64]" />
                        <span className="font-semibold text-[#212529]">Email Notifications (Task Updates, Promotions)</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#0D7F64]" />
                        <span className="font-semibold text-[#212529]">SMS Notifications (Urgent Alerts)</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-5 h-5 accent-[#0D7F64]" />
                        <span className="font-semibold text-[#212529]">Push Notifications</span>
                      </label>
                      <div className="pt-4">
                        <button className="rounded-full bg-[#0D7F64] text-white px-6 py-2.5 font-bold hover:bg-[#0a6650] transition-colors">Save Preferences</button>
                      </div>
                    </div>
                  </div>
                )}

                {accountTab === "Billing Info" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-[#ced4da] pb-3 mb-6">
                      <h2 className="text-[22px] font-extrabold text-[#212529]">Billing Info</h2>
                      <button className="rounded-md border border-[#ced4da] bg-white px-5 py-1.5 text-[14px] font-semibold text-[#212529] hover:bg-[#f8f9fa] transition-colors">
                        Add New Card
                      </button>
                    </div>
                    <div className="p-4 border border-[#ced4da] rounded-md flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-[#e9ecef] w-12 h-8 rounded flex items-center justify-center text-xs font-bold text-[#495057]">VISA</div>
                        <div>
                          <p className="font-bold text-[#212529]">Visa ending in 4242</p>
                          <p className="text-sm text-[#6c757d]">Expires 12/2028 (Default)</p>
                        </div>
                      </div>
                      <button className="text-red-600 text-sm font-bold hover:underline">Remove</button>
                    </div>
                  </div>
                )}

                {accountTab === "Cancel a Task" && (
                  <div className="space-y-6">
                    <h2 className="text-[22px] font-extrabold text-[#212529] border-b border-[#ced4da] pb-3 mb-6">Cancel a Task</h2>
                    {tasks.filter(t => t.status === "OPEN").length === 0 ? (
                      <p className="text-[#6c757d]">You have no open tasks to cancel.</p>
                    ) : (
                      <div className="space-y-4">
                        {tasks.filter(t => t.status === "OPEN").map(task => (
                          <div key={task.id} className="p-4 border border-[#ced4da] rounded-md flex justify-between items-center">
                            <div>
                              <p className="font-bold text-[#212529]">{task.title}</p>
                              <p className="text-sm text-[#6c757d]">Scheduled: {new Date(task.scheduledTime).toLocaleDateString()}</p>
                            </div>
                            <button className="rounded-full bg-white border border-red-200 text-red-600 px-4 py-1.5 text-sm font-bold hover:bg-red-50 transition-colors">Cancel Task</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {accountTab === "Business Information" && (
                  <div className="space-y-6">
                    <h2 className="text-[22px] font-extrabold text-[#212529] border-b border-[#ced4da] pb-3 mb-6">Business Information</h2>
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-6 text-sm text-yellow-800">
                      If you provide services as a registered business, please fill in your details below for tax and invoicing purposes.
                    </div>
                    <div className="space-y-4 max-w-sm">
                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1.5">Business Name</label>
                        <input type="text" placeholder="e.g. Acme Services" className="w-full rounded-md border border-[#ced4da] px-4 py-2 outline-none focus:border-[#0D7F64]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1.5">GST/Tax ID</label>
                        <input type="text" placeholder="Tax Number" className="w-full rounded-md border border-[#ced4da] px-4 py-2 outline-none focus:border-[#0D7F64]" />
                      </div>
                      <button className="rounded-full bg-[#0D7F64] text-white px-6 py-2.5 font-bold hover:bg-[#0a6650] transition-colors">Save Details</button>
                    </div>
                  </div>
                )}

                {accountTab === "Account Balance" && (
                  <div className="space-y-6">
                    <h2 className="text-[22px] font-extrabold text-[#212529] border-b border-[#ced4da] pb-3 mb-6">Account Balance</h2>
                    <div className="p-8 border border-[#ced4da] rounded-md text-center bg-[#f8f9fa]">
                      <p className="text-sm font-bold text-[#6c757d] uppercase tracking-wider mb-2">Available Wallet Balance</p>
                      <p className="text-4xl font-extrabold text-[#212529] mb-6">₹ 4,500.00</p>
                      <div className="flex gap-4 justify-center">
                        <button className="rounded-full bg-[#0D7F64] text-white px-6 py-2.5 font-bold hover:bg-[#0a6650] transition-colors">Add Funds</button>
                        <button className="rounded-full bg-white border border-[#ced4da] text-[#212529] px-6 py-2.5 font-bold hover:bg-gray-50 transition-colors">Withdraw</button>
                      </div>
                    </div>
                  </div>
                )}

                {accountTab === "Transactions" && (
                  <div className="space-y-6">
                    <h2 className="text-[22px] font-extrabold text-[#212529] border-b border-[#ced4da] pb-3 mb-6">Transactions</h2>
                    <div className="border border-[#ced4da] rounded-md overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-[#f8f9fa] border-b border-[#ced4da]">
                          <tr>
                            <th className="p-3 font-bold text-[#495057]">Date</th>
                            <th className="p-3 font-bold text-[#495057]">Description</th>
                            <th className="p-3 font-bold text-[#495057]">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e9ecef]">
                          <tr>
                            <td className="p-3 text-[#212529]">Oct 12, 2026</td>
                            <td className="p-3 text-[#212529]">Payment for Delivery Task</td>
                            <td className="p-3 font-bold text-red-600">- ₹ 150.00</td>
                          </tr>
                          <tr>
                            <td className="p-3 text-[#212529]">Oct 10, 2026</td>
                            <td className="p-3 text-[#212529]">Wallet Top-up</td>
                            <td className="p-3 font-bold text-green-600">+ ₹ 1,000.00</td>
                          </tr>
                          <tr>
                            <td className="p-3 text-[#212529]">Oct 01, 2026</td>
                            <td className="p-3 text-[#212529]">Refund (Cancelled Task)</td>
                            <td className="p-3 font-bold text-green-600">+ ₹ 500.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {accountTab === "Delete Account" && (
                  <div className="space-y-6">
                    <h2 className="text-[22px] font-extrabold text-[#212529] border-b border-[#ced4da] pb-3 mb-6">Delete Account</h2>
                    <div className="p-6 border border-red-200 bg-red-50 rounded-md">
                      <h3 className="font-bold text-red-700 text-lg mb-2">Warning: Permanent Action</h3>
                      <p className="text-red-700 text-sm mb-6">
                        Deleting your account will permanently erase your profile, wallet balance, active tasks, and transaction history. This action cannot be undone.
                      </p>
                      <button className="rounded-full bg-red-600 text-white px-6 py-2.5 font-bold hover:bg-red-700 transition-colors">
                        Permanently Delete My Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* ==================== SETTINGS VIEW ==================== */}
        {currentTab === "settings" && (
          <div className="mt-8 max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">
              Account Settings
            </h2>

            <div className="space-y-6">
              {/* Notification Preferences */}
              <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30">
                <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50 mb-4">
                  Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-zinc-200">
                        Email Notifications
                      </p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Receive updates on tasks and bids.
                      </p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 cursor-pointer">
                      <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-zinc-200">
                        SMS Alerts
                      </p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        For urgent task updates and OTPs.
                      </p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 cursor-pointer">
                      <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30">
                <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50 mb-4">
                  Security
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-zinc-200">
                        Two-Factor Authentication
                      </p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Add an extra layer of security.
                      </p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-zinc-700 cursor-pointer">
                      <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                    <button 
                      onClick={() => setIsChangePasswordOpen(true)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition cursor-pointer"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="rounded-3xl border border-rose-100 bg-rose-50/30 p-6 sm:p-8 dark:border-rose-900/30 dark:bg-rose-950/10">
                <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 mb-4">
                  Danger Zone
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
                <button className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 transition cursor-pointer">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==================== DIALOG MODALS & OVERLAYS ==================== */}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] bg-white p-6 sm:p-8 shadow-2xl dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
            <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-zinc-50">Change Password</h3>
            
            {passwordError && (
              <div className="mb-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-zinc-300">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-zinc-300">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-zinc-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition"
                  disabled={isChangingPassword}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition disabled:opacity-50"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. Post Task Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-xl font-extrabold text-slate-800">
                  Post a New Task
                </h3>
                <p className="text-sm text-slate-500 mt-1">Fill in the details to find the best helper.</p>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePostTask} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Fix leaking kitchen faucet"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
                />
                {formErrors.title && (
                  <p className="mt-1.5 text-xs text-rose-500 font-medium">
                    {formErrors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Detailed Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe what needs to be done. Minimum 10 characters."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
                ></textarea>
                {formErrors.description && (
                  <p className="mt-1.5 text-xs text-rose-500 font-medium">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Budget (Rs.)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  />
                  {formErrors.budget && (
                    <p className="mt-1.5 text-xs text-rose-500 font-medium">
                      {formErrors.budget}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  >
                    <option>Delivery</option>
                    <option>Repair</option>
                    <option>Cleaning</option>
                    <option>Moving</option>
                    <option>Tech Help</option>
                    <option>Errands</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Estimated Duration
                  </label>
                  <select
                    name="estimatedDuration"
                    value={(formData as any).estimatedDuration || "1-2 hours"}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  >
                    <option>Under 1 hour</option>
                    <option>1-2 hours</option>
                    <option>2-4 hours</option>
                    <option>Half day (4+ hours)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Scheduled Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Address / Landmark
                </label>
                <input
                  type="text"
                  name="address"
                  value={(formData as any).address || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. House No. 42, Near Metro Station"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Pin Location on Map
                </label>
                <div className="rounded-xl overflow-hidden border-2 border-slate-200">
                  <LocationPickerMap
                    initialLocation={{
                      lat: formData.latitude,
                      lng: formData.longitude,
                    }}
                    onLocationSelect={(loc) => {
                      setFormData((prev) => ({
                        ...prev,
                        latitude: loc.lat,
                        longitude: loc.lng,
                      }));
                      setFormErrors((prev) => ({
                        ...prev,
                        latitude: "",
                        longitude: "",
                      }));
                    }}
                    height="200px"
                  />
                </div>
                {(formErrors.latitude || formErrors.longitude) && (
                  <p className="mt-1.5 text-xs text-rose-500 font-medium">
                    Please select a valid location.
                  </p>
                )}
              </div>

              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  Post Task Now
                </button>
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative bg-white px-4 text-xs font-semibold text-slate-400 uppercase">
                    OR
                  </div>
                </div>
                <a 
                  href="https://wa.me/918604994330?text=Hi,%20I%20want%20to%20post%20a%20task%20on%20QuickMate%20Campus."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-bold text-white hover:bg-[#128C7E] hover:shadow-lg hover:shadow-[#25D366]/20 transition-all cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Post via WhatsApp instead
                </a>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Review Bids placed on Task Modal */}
      {showBidsModal && activeTaskForBids && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Review Bids
                </h3>
                <p className="text-xs text-slate-500">
                  Offers placed by nearby helpers for "{activeTaskForBids.title}"
                </p>
              </div>
              <button
                onClick={() => setShowBidsModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Bid 1 */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                      R
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">
                        Rahul Sharma
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-amber-500">
                        <Star className="h-3 w-3 fill-current" />
                        <span>4.9 (34 completed tasks)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-base font-bold text-emerald-600">
                      Rs. {activeTaskForBids.budget - 10}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Slightly below budget
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                    "Hi! I am available right now and can bring my own tools. Let's get this done!"
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      // Navigate to Chat
                      setShowBidsModal(false);
                      setActiveChatTask(activeTaskForBids);
                      setShowChatModal(true);
                    }}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 transition cursor-pointer"
                  >
                    Chat First
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Razorpay Escrow payment popup */}
      {showEscrowModal && activeTaskForEscrow && (
        <PaymentEscrow
          taskTitle={activeTaskForEscrow.title}
          amount={activeTaskForEscrow.budget - 10}
          helperName="Rahul Sharma"
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setShowEscrowModal(false)}
        />
      )}

      {/* 4. Chat modal overlay */}
      {showChatModal && activeChatTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Task Chat Hub
                </h3>
                <p className="text-xs text-slate-500">
                  Related Task: "{activeChatTask.title}"
                </p>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4">
              <ChatSim
                taskId={activeChatTask.id}
                currentUser={{
                  id: "user_customer_123",
                  name: "Delhi Customer",
                }}
                otherUser={{ id: "helper_delhi_1", name: "Rahul Sharma" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. Review & Rating Modal */}
      {showReviewModal && activeReviewTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                Complete Task & Review
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500">
                  Please rate your helper, Rahul Sharma
                </p>
                <div className="mt-3 flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-9 w-9 ${star <= reviewRating ? "text-amber-500 fill-current" : "text-slate-200"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Feedback comments
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={3}
                  placeholder="Share details about their punctuality, speed, and helpfulness..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
                  required
                ></textarea>
              </div>

              <div className="rounded-xl bg-amber-50/80 p-4 border border-amber-100 text-xs text-amber-700 font-medium">
                ⭐ Submitting this form releases the escrowed funds directly to
                the helper's wallet.
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 transition-all cursor-pointer"
              >
                Submit & Release Funds
              </button>
            </form>
          </div>
        </div>
      )}
      {/* 6. Helper Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-lg font-bold text-slate-800">
                Mate Profile
              </h3>
              <button
                onClick={() => setSelectedProfile(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-4xl font-extrabold text-emerald-600 mb-4 shadow-sm border border-emerald-100">
                {selectedProfile.name.charAt(0)}
                {selectedProfile.isVerified && (
                  <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white border-4 border-white" title="Verified Background Check">
                    <Shield className="h-4 w-4" />
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{selectedProfile.name}</h2>
              <div className="mt-2 flex items-center justify-center gap-4 text-sm font-medium text-slate-600">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-bold text-slate-700">{selectedProfile.rating.toFixed(1)}</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>{selectedProfile.completedTasksCount} jobs done</span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">About</h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  "Hi! I am {selectedProfile.name}, an experienced professional ready to help you with your tasks. I take pride in my work and guarantee 100% satisfaction."
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setSelectedProfile(null);
                  // Just open chat directly for demo purposes
                  const matchedTask = tasks.find((t) => t.status === "OPEN") || tasks[0];
                  setActiveChatTask(matchedTask);
                  setShowChatModal(true);
                }}
                className="w-full flex items-center justify-center rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Send Message
              </button>
              <button
                onClick={() => {
                  setSelectedProfile(null);
                  const matchedTask = tasks.find((t) => t.status === "OPEN") || tasks[0];
                  setActiveChatTask(matchedTask);
                  setShowChatModal(true);
                }}
                className="w-full flex items-center justify-center rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                Hire Mate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

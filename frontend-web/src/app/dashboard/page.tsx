"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
    skills: ["Repair", "Plumbing", "Electrical"],
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
    skills: ["Delivery", "Grocery help", "Errands"],
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
    skills: ["Cleaning", "Organizer", "Tech Help"],
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
    title: "Errand in Delhi",
    description:
      "Pick up groceries from Connaught Place and deliver to Block H.",
    budget: 150,
    category: "Delivery",
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

  // Moved to below profileData

  const [activeRole, setActiveRole] = useState<"customer" | "helper">(
    "customer",
  );
  const [currentTab, setCurrentTab] = useState<
    "dashboard" | "profile" | "settings"
  >("dashboard");
  const [accountTab, setAccountTab] = useState("Profile");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [helpers, setHelpers] = useState<Helper[]>(initialHelpers);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

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
    budget: 100,
    category: "Delivery",
    urgency: "medium" as "low" | "medium" | "urgent",
    latitude: 28.6304,
    longitude: 77.2177,
    scheduledTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Simulation notification
  const [notification, setNotification] = useState<string | null>(null);

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
    "Delivery",
    "Repair",
    "Cleaning",
    "Moving",
    "Tech Help",
    "Errands",
  ];

  // Simulation effect: When a customer posts a task, a helper automatically bids after 4 seconds
  useEffect(() => {
    const checkBids = setTimeout(() => {
      const openCustomTasks = tasks.filter(
        (t) =>
          t.customerId === "user_customer_123" &&
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

  const handlePostTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newTask: Task = {
      id: "task_" + Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      budget: formData.budget,
      category: formData.category,
      urgency: formData.urgency,
      status: "OPEN",
      latitude: formData.latitude,
      longitude: formData.longitude,
      scheduledTime: new Date(formData.scheduledTime).toISOString(),
      customerId: "user_customer_123",
    };

    setTasks((prev) => [newTask, ...prev]);
    setShowPostModal(false);
    // Reset Form
    setFormData({
      title: "",
      description: "",
      budget: 100,
      category: "Delivery",
      urgency: "medium",
      latitude: 28.6304,
      longitude: 77.2177,
      scheduledTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    });
    setFormErrors({});
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
      <header className="sticky top-0 z-40 border-b border-[#e9ecef] bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentTab('dashboard')} className="flex items-center gap-2 cursor-pointer ml-4">
              <img src="/logo-v3.png" alt="QuickMate Logo" className="h-14 sm:h-16 w-auto object-contain mix-blend-multiply scale-[2.5] origin-left" />
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Category Filters */}
        {currentTab === "dashboard" && (
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-8 mt-2">
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
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left side: Hero & Post Task */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Banner */}
              <div className="rounded-3xl bg-white border border-slate-200 p-8 text-slate-900 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50" />
                <div className="max-w-xl relative z-10">
                  <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Good morning! <br/><span className="text-emerald-600">What do you need help with?</span>
                  </h1>
                  <p className="mt-4 text-base text-slate-600">
                    Book trusted help for home repairs, cleaning, moving, and more.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <button
                      onClick={() => setShowPostModal(true)}
                      className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition cursor-pointer"
                    >
                      <PlusCircle className="h-5 w-5" />
                      Book a Task
                    </button>
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
                      <Shield className="h-4 w-4 text-emerald-500" />
                      Secure Escrow Protection
                    </div>
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
                    .filter((t) => t.customerId === "user_customer_123")
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
                  {filteredTasks.filter(
                    (t) => t.customerId === "user_customer_123",
                  ).length === 0 && (
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
                <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-50">
                  Verified Helpers Nearby
                </h3>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                  Online
                </span>
              </div>
              <div className="space-y-4">
                {helpers.map((helper) => (
                  <HelperCard
                    key={helper.id}
                    helper={helper}
                    onHire={(h) => {
                      const matchedTask =
                        tasks.find(
                          (t) => t.customerId === "user_customer_123",
                        ) || tasks[0];
                      setActiveChatTask(matchedTask);
                      setShowChatModal(true);
                    }}
                  />
                ))}
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
                    <button
                      onClick={() => {
                        setVerificationState(prev => ({ ...prev, status: "Uploading" }));
                        setTimeout(() => {
                          setVerificationState(prev => ({ ...prev, status: "Pending Review" }));
                        }, 2000);
                      }}
                      className="w-full rounded-md border-2 border-dashed border-[#ced4da] bg-slate-50 py-10 font-bold text-[#0D7F64] hover:bg-[#e9ecef] transition-colors cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      <Upload className="h-6 w-6" />
                      Click to upload {verificationState.docType}
                    </button>
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
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
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
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30 space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Verification & Profile
                </h4>
                <div className="flex items-center gap-3 rounded-xl bg-blue-50/50 p-4 dark:bg-blue-950/20">
                  <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h5 className="font-semibold text-zinc-900 dark:text-zinc-50">
                      Profile Rating Score
                    </h5>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      You are in the top 5% of local helpers.
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/20 p-4 dark:border-emerald-800/30 dark:bg-emerald-950/10 text-xs">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 fill-current" />
                    Verified Partner
                  </span>
                  <p className="mt-1 text-slate-500 dark:text-slate-400">
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
                      <div className="h-[160px] w-[160px] rounded-full bg-[#e9ecef] flex items-center justify-center overflow-hidden shrink-0 border border-[#ced4da]">
                        <User className="h-[100px] w-[100px] text-[#ced4da]" />
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
                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1.5">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full rounded-md border border-[#ced4da] px-4 py-2 outline-none focus:border-[#0D7F64]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1.5">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full rounded-md border border-[#ced4da] px-4 py-2 outline-none focus:border-[#0D7F64]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1.5">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full rounded-md border border-[#ced4da] px-4 py-2 outline-none focus:border-[#0D7F64]" />
                      </div>
                      <button className="rounded-full bg-[#0D7F64] text-white px-6 py-2.5 font-bold hover:bg-[#0a6650] transition-colors">Save Password</button>
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
                    <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition cursor-pointer">
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

      {/* 1. Post Task Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-50 pb-4 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Post a New Task
              </h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePostTask} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Task Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Fix leaking kitchen faucet"
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950"
                />
                {formErrors.title && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">
                    {formErrors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Detailed Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe what needs to be done. Minimum 10 characters."
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950"
                ></textarea>
                {formErrors.description && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Budget (Rs.)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950"
                  />
                  {formErrors.budget && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">
                      {formErrors.budget}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950"
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

              <div className="mt-4">
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                  Select Task Location
                </label>
                <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
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
                    height="250px"
                  />
                </div>
                {(formErrors.latitude || formErrors.longitude) && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">
                    Please select a valid location.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Scheduled Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleInputChange}
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950"
                />
              </div>

              <div className="flex gap-2">
                <span className="inline-block rounded-md bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/40">
                  PostGIS coordinate indexing coordinates will be generated.
                </span>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition cursor-pointer"
              >
                Post Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Review Bids placed on Task Modal */}
      {showBidsModal && activeTaskForBids && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-50 pb-4 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Review Bids
                </h3>
                <p className="text-xs text-zinc-500">
                  Offers placed by nearby helpers for "{activeTaskForBids.title}
                  "
                </p>
              </div>
              <button
                onClick={() => setShowBidsModal(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Bid 1 */}
              <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                      R
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">
                        Rahul Sharma
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-amber-500">
                        <Star className="h-3 w-3 fill-current" />
                        <span>4.9 (34 completed tasks)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-base font-bold text-blue-600">
                      Rs. {activeTaskForBids.budget - 10}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ETA: 20 mins
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
                  "I have repair tools ready and I am just 200 meters away at
                  the market. I can finish this errand immediately."
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() =>
                      handleAcceptBid(activeTaskForBids, helpers[0])
                    }
                    className="flex-1 flex items-center justify-center rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition cursor-pointer"
                  >
                    Hire & Pay Securely
                  </button>
                  <button
                    onClick={() => {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-2xl dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-50 pb-3 dark:border-zinc-800">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  Task Chat Hub
                </h3>
                <p className="text-xs text-zinc-500">
                  Related Task: "{activeChatTask.title}"
                </p>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-50 pb-4 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Complete Task & Review
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
              <div className="text-center">
                <p className="text-xs text-zinc-500">
                  Please rate your helper, Rahul Sharma
                </p>
                <div className="mt-3 flex justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`h-8 w-8 ${star <= reviewRating ? "text-amber-500 fill-current" : "text-zinc-200"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Feedback comments
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={3}
                  placeholder="Share details about their punctuality, speed, and helpfulness..."
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950"
                  required
                ></textarea>
              </div>

              <div className="rounded-xl bg-blue-50/50 p-4 dark:bg-blue-950/20 text-xs text-slate-500 dark:text-zinc-400">
                ⭐ Submitting this form releases the escrowed funds directly to
                the helper's wallet.
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition cursor-pointer"
              >
                Submit & Release Funds
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

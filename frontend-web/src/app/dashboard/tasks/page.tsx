"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AlertTriangle, Plus, X, MapPin } from "lucide-react";
import TaskCard, { Task } from "@/components/TaskCard";
import { useNotification } from "@/context/NotificationContext";
import { useProfile } from "@/context/ProfileContext";
import { TASK_CATEGORIES } from "@/lib/constants";
import dynamic from 'next/dynamic';

// Dynamically import map to avoid SSR issues
const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });

export default function TasksPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addNotification } = useNotification();
  const { profile } = useProfile();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showPostModal, setShowPostModal] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  
  // Bidding State
  const [selectedTaskForBid, setSelectedTaskForBid] = useState<Task | null>(null);
  const [isBidding, setIsBidding] = useState(false);
  const [bidForm, setBidForm] = useState({
    proposedAmount: 0,
    estimatedCompletionTime: "",
    note: "",
  });

  const categories = ["All", ...TASK_CATEGORIES];

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err: any) {
      if (err.response?.status !== 401) {
        console.warn('Failed to fetch tasks', err.message);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (searchParams.get("post") === "true") {
      setShowPostModal(true);
    }
  }, [searchParams]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "" as unknown as number,
    category: "Handyman",
    urgency: "medium" as "low" | "medium" | "urgent",
    latitude: 28.6304,
    longitude: 77.2177,
    scheduledTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    address: "",
  });

  const fetchCurrentLocation = () => {
    setIsFetchingLocation(true);
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const data = await res.json();
            const locationName = data.address?.city || data.address?.town || data.address?.neighbourhood || data.display_name.split(",")[0] || "Location found";
            
            setFormData(prev => ({
              ...prev,
              latitude: lat,
              longitude: lng,
              address: locationName
            }));
          } catch (err) {
            console.error(err);
            setFormData(prev => ({ ...prev, latitude: lat, longitude: lng, address: "Current Location" }));
          } finally {
            setIsFetchingLocation(false);
          }
        },
        (error) => {
          console.warn("Geolocation failed", error);
          alert("Could not fetch location. Please ensure location services are enabled for your browser.");
          setIsFetchingLocation(false);
        }
      );
    } else {
      setIsFetchingLocation(false);
    }
  };

  const handlePostTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Content moderation check
    if (formData.description.trim().length < 20) {
      alert("Please provide a more detailed description (at least 20 characters).");
      return;
    }
    if (/(.)\1{5,}/.test(formData.description)) {
      alert("Description contains repetitive characters. Please provide a valid description.");
      return;
    }
    
    try {
      const payload = { ...formData };
      payload.scheduledTime = new Date(formData.scheduledTime).toISOString();
      await api.post("/tasks", payload);
      addNotification(`Task "${formData.title}" posted successfully!`);
      
      setShowPostModal(false);
      router.push("/dashboard/tasks"); // remove query param
      fetchTasks();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to post task.");
    }
  };

  const handlePlaceBidClick = (task: Task) => {
    setSelectedTaskForBid(task);
    setBidForm({
      proposedAmount: task.budget, // Default to task's budget
      estimatedCompletionTime: task.scheduledTime.slice(0, 16), // Default to task's deadline
      note: "",
    });
  };

  const handlePlaceBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForBid) return;

    setIsBidding(true);
    try {
      const payload = {
        taskId: selectedTaskForBid.id,
        proposedAmount: Number(bidForm.proposedAmount),
        estimatedCompletionTime: new Date(bidForm.estimatedCompletionTime).toISOString(),
        note: bidForm.note,
      };
      
      await api.post("/bids", payload);
      addNotification(`Successfully placed bid on "${selectedTaskForBid.title}"`);
      
      setSelectedTaskForBid(null);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to place bid. Ensure your KYC is verified.");
    } finally {
      setIsBidding(false);
    }
  };

  const handleUpdateTaskStatus = async (task: Task, newStatus: string) => {
    try {
      await api.patch(`/tasks/${task.id}/status`, { status: newStatus });
      addNotification(`Task marked as ${newStatus}`);
      fetchTasks();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update task status");
    }
  };

  // Filter by category selected in UI
  let filteredTasks = selectedCategory === "All" 
    ? tasks 
    : tasks.filter(t => t.category.toLowerCase() === selectedCategory.toLowerCase());
    
  // Filter for Pro Mates (Specialists) to only see relevant tasks
  const isSpecialist = profile.role === "helper" && profile.mateTier === "specialist" && profile.profession;
  if (isSpecialist && !showAllTasks) {
    const profString = profile.profession!.toLowerCase();
    filteredTasks = filteredTasks.filter(t => {
      const catString = t.category.toLowerCase();
      return profString.includes(catString) || catString.includes(profString);
    });
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl tracking-tight text-ink">Tasks Market</h1>
          <p className="text-smoke font-medium text-[16px] mt-1">
            {profile.role === "customer" 
              ? "Browse active operations or post your own."
              : "Find tasks matching your skills and place bids."}
          </p>
        </div>
        {profile.role === "customer" && (
          <button 
            onClick={() => setShowPostModal(true)}
            className="bg-charcoal text-paper px-6 py-2.5 rounded-full font-medium text-[14px] hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Task
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-smoke/30 pb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-4 py-2 text-[14px] font-medium transition-all border ${
              selectedCategory === cat
                ? "bg-charcoal text-paper border-charcoal"
                : "bg-sand border-smoke/30 text-smoke hover:border-ink hover:text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
        {isSpecialist && (
          <div className="ml-auto flex items-center gap-3 px-2 border-l border-smoke/30 pl-4">
            <span className="text-[13px] font-medium text-ink">Show All Categories</span>
            <button
              onClick={() => setShowAllTasks(!showAllTasks)}
              className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${showAllTasks ? 'bg-moss' : 'bg-smoke/30'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-paper transition-transform ${showAllTasks ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-smoke/40 bg-sand py-16">
            <AlertTriangle className="h-8 w-8 text-smoke/50 mb-2" />
            <p className="text-[14px] font-medium text-smoke">No Tasks Found</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              viewMode={profile.role}
              onPlaceBid={() => handlePlaceBidClick(task)}
              onUpdateStatus={handleUpdateTaskStatus}
            />
          ))
        )}
      </div>

      {/* Post Task Modal with Map */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-paper rounded-2xl border border-smoke/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-fade-in-up shadow-2xl">
            <button 
              onClick={() => {
                setShowPostModal(false);
                router.push("/dashboard/tasks");
              }}
              className="absolute top-6 right-6 p-2 bg-sand rounded-full hover:bg-smoke/20 transition-colors z-10"
            >
              <X className="w-5 h-5 text-ink" />
            </button>

            <form className="p-6 md:p-8" onSubmit={handlePostTask}>
              <h2 className="text-2xl font-bold text-ink mb-6 tracking-tight">Post a New Task</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-semibold text-ink uppercase tracking-wider mb-2">Title</label>
                  <input 
                    type="text" required minLength={5}
                    className="w-full bg-sand border border-smoke/30 rounded-xl px-4 py-3 text-[14px] font-medium text-ink outline-none focus:border-ink transition-all"
                    placeholder="e.g. Help me move my sofa"
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Left Column: Form Fields */}
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-semibold text-ink uppercase tracking-wider mb-2">Category</label>
                        <select 
                          className="w-full bg-sand border border-smoke/30 rounded-xl px-4 py-3 text-[14px] font-medium text-ink outline-none focus:border-ink transition-all appearance-none"
                          value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                          {categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-ink uppercase tracking-wider mb-2">Budget (₹)</label>
                        <input 
                          type="number" required min="10"
                          className="w-full bg-sand border border-smoke/30 rounded-xl px-4 py-3 text-[14px] font-medium text-ink outline-none focus:border-ink transition-all"
                          placeholder="500"
                          value={formData.budget} onChange={e => setFormData({...formData, budget: Number(e.target.value)})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-semibold text-ink uppercase tracking-wider mb-2">Urgency</label>
                        <select 
                          className="w-full bg-sand border border-smoke/30 rounded-xl px-4 py-3 text-[14px] font-medium text-ink outline-none focus:border-ink transition-all appearance-none"
                          value={formData.urgency} onChange={e => setFormData({...formData, urgency: e.target.value as any})}
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Standard</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-ink uppercase tracking-wider mb-2">Deadline</label>
                        <input 
                          type="datetime-local" required
                          className="w-full bg-sand border border-smoke/30 rounded-xl px-4 py-3 text-[14px] font-medium text-ink outline-none focus:border-ink transition-all"
                          value={formData.scheduledTime} onChange={e => setFormData({...formData, scheduledTime: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-semibold text-ink uppercase tracking-wider mb-2">Description</label>
                      <textarea 
                        required rows={5}
                        className="w-full bg-sand border border-smoke/30 rounded-xl px-4 py-3 text-[14px] font-medium text-ink outline-none focus:border-ink transition-all resize-none"
                        placeholder="Detail the specific requirements..."
                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Right Column: Location Map */}
                  <div className="flex flex-col h-[400px] md:h-auto">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-[13px] font-semibold text-ink uppercase tracking-wider">Task Location</label>
                      <button 
                        type="button" 
                        onClick={fetchCurrentLocation}
                        disabled={isFetchingLocation}
                        className="text-[12px] font-bold text-ink bg-sand hover:bg-smoke/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 disabled:opacity-50 transition-colors border border-smoke/30"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        {isFetchingLocation ? "Fetching location..." : "Use My Current Location"}
                      </button>
                    </div>
                    <p className="text-[12px] text-smoke mb-3">Click on the map to set the exact coordinates for this task.</p>
                    
                    <div className="flex-1 bg-sand border border-smoke/30 rounded-xl overflow-hidden relative min-h-[300px]">
                      <MapPicker 
                        defaultLat={formData.latitude} 
                        defaultLng={formData.longitude}
                        onLocationSelect={(lat, lng, address) => setFormData({ ...formData, latitude: lat, longitude: lng, address })} 
                      />
                    </div>

                    {formData.address && (
                      <div className="mt-4 flex items-start gap-2 bg-mist p-3 rounded-xl border border-smoke/10">
                        <MapPin className="w-4 h-4 text-ink mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[12px] font-semibold text-ink uppercase tracking-wider">Selected Address</p>
                          <p className="text-[13px] text-smoke mt-0.5 leading-snug">{formData.address}</p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                <div className="flex gap-3 pt-4 border-t border-smoke/20">
                  <button 
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="flex-1 bg-sand text-ink py-3.5 rounded-xl font-medium text-[15px] hover:bg-smoke/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-charcoal text-paper py-3.5 rounded-xl font-medium text-[15px] hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Post Task Now
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bid Modal */}
      {selectedTaskForBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-paper rounded-2xl border border-smoke/30 w-full max-w-lg relative animate-fade-in-up shadow-2xl">
            <button 
              onClick={() => setSelectedTaskForBid(null)}
              className="absolute top-4 right-4 p-2 bg-sand rounded-full hover:bg-smoke/20 transition-colors z-10"
            >
              <X className="w-5 h-5 text-ink" />
            </button>
            <div className="p-8">
              <h2 className="text-2xl tracking-tight text-ink mb-2">Place Your Bid</h2>
              <p className="text-[14px] text-smoke mb-6">You are bidding on: <span className="font-bold">{selectedTaskForBid.title}</span></p>
              
              <form onSubmit={handlePlaceBidSubmit}>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[13px] font-semibold text-ink uppercase tracking-wider mb-2">Your Proposed Amount (₹)</label>
                    <input 
                      type="number" required min="10"
                      className="w-full bg-sand border border-smoke/30 rounded-xl px-4 py-3 text-[14px] font-medium text-ink outline-none focus:border-ink transition-all"
                      value={bidForm.proposedAmount} onChange={e => setBidForm({...bidForm, proposedAmount: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-ink uppercase tracking-wider mb-2">Estimated Completion Time</label>
                    <input 
                      type="datetime-local" required
                      className="w-full bg-sand border border-smoke/30 rounded-xl px-4 py-3 text-[14px] font-medium text-ink outline-none focus:border-ink transition-all"
                      value={bidForm.estimatedCompletionTime} onChange={e => setBidForm({...bidForm, estimatedCompletionTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-ink uppercase tracking-wider mb-2">Why should they pick you? (Optional)</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-sand border border-smoke/30 rounded-xl px-4 py-3 text-[14px] font-medium text-ink outline-none focus:border-ink transition-all resize-none"
                      placeholder="I have 5 years of experience..."
                      value={bidForm.note} onChange={e => setBidForm({...bidForm, note: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-smoke/20 flex justify-end gap-3">
                  <button type="button" onClick={() => setSelectedTaskForBid(null)} className="px-6 py-2.5 rounded-full font-medium text-[14px] text-ink bg-sand hover:bg-smoke/20 transition-colors">Cancel</button>
                  <button type="submit" disabled={isBidding} className="px-8 py-2.5 rounded-full font-medium text-[14px] text-paper bg-charcoal hover:opacity-90 transition-opacity disabled:opacity-50">
                    {isBidding ? "Submitting..." : "Submit Bid"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { TASK_CATEGORIES } from "@/lib/constants";

export default function AdminPostTaskPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Default QuickMate Hub coordinates (Delhi)
  const defaultLat = 28.6315;
  const defaultLng = 77.2167;

  const [consentGiven, setConsentGiven] = useState(false);

  const [formData, setFormData] = useState({
    customerId: "",
    title: "",
    description: "",
    budget: "",
    category: TASK_CATEGORIES[0],
    urgency: "medium",
    scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
  });

  const categories = TASK_CATEGORIES;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, customerId: res.data[0].id }));
        }
      } catch (error) {
        console.error("Failed to load users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) {
      alert("You must have explicit consent from the user to post on their behalf.");
      return;
    }
    setSubmitting(true);
    setSuccess(false);

    try {
      const payload = {
        customerId: formData.customerId,
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        category: formData.category,
        urgency: formData.urgency,
        scheduledTime: new Date(formData.scheduledTime).toISOString(),
        latitude: defaultLat,
        longitude: defaultLng,
      };

      await api.post("/admin/tasks", payload);
      setSuccess(true);
      
      // Reset form but keep selected user and category
      setFormData(prev => ({
        ...prev,
        title: "",
        description: "",
        budget: "",
      }));
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to create task", error);
      alert("Error creating task. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse flex p-8 text-smoke text-[14px]">Loading users...</div>;
  }

  return (
    <div className="max-w-2xl bg-paper rounded-2xl shadow-sm border border-smoke/30 overflow-hidden animate-fade-in-up">
      <div className="p-6 border-b border-smoke/30 bg-sand">
        <h2 className="text-xl text-ink tracking-tight">Post Task on Behalf of User</h2>
        <p className="text-[13px] text-smoke mt-1">Create a task manually for a user who contacted you directly.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {success && (
          <div className="p-4 bg-moss/10 border border-moss/30 text-moss rounded-xl font-bold text-[13px]">
            Task successfully created!
          </div>
        )}

        <div>
          <label className="block text-[12px] font-bold text-ink uppercase tracking-wider mb-2">Select User (Requested By)</label>
          <select 
            name="customerId" 
            value={formData.customerId} 
            onChange={handleChange}
            className="w-full border border-smoke/30 rounded-xl px-4 py-2.5 bg-mist text-[14px] text-ink focus:bg-paper focus:ring-1 focus:ring-moss focus:border-moss outline-none transition-colors"
            required
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.phone || u.email})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[12px] font-bold text-ink uppercase tracking-wider mb-2">Task Title</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange}
            placeholder="e.g. Need Pitch Deck formatting"
            className="w-full border border-smoke/30 rounded-xl px-4 py-2.5 bg-mist text-[14px] text-ink focus:bg-paper focus:ring-1 focus:ring-moss focus:border-moss outline-none transition-colors placeholder:text-smoke/50"
            required
          />
        </div>

        <div>
          <label className="block text-[12px] font-bold text-ink uppercase tracking-wider mb-2">Description</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            rows={3}
            placeholder="Details about the task..."
            className="w-full border border-smoke/30 rounded-xl px-4 py-2.5 bg-mist text-[14px] text-ink focus:bg-paper focus:ring-1 focus:ring-moss focus:border-moss outline-none transition-colors placeholder:text-smoke/50 resize-none"
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-bold text-ink uppercase tracking-wider mb-2">Budget (₹)</label>
            <input 
              type="number" 
              name="budget" 
              value={formData.budget} 
              onChange={handleChange}
              placeholder="e.g. 50"
              min="10"
              className="w-full border border-smoke/30 rounded-xl px-4 py-2.5 bg-mist text-[14px] text-ink focus:bg-paper focus:ring-1 focus:ring-moss focus:border-moss outline-none transition-colors placeholder:text-smoke/50"
              required
            />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-ink uppercase tracking-wider mb-2">Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              className="w-full border border-smoke/30 rounded-xl px-4 py-2.5 bg-mist text-[14px] text-ink focus:bg-paper focus:ring-1 focus:ring-moss focus:border-moss outline-none transition-colors"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-bold text-ink uppercase tracking-wider mb-2">Urgency</label>
            <select 
              name="urgency" 
              value={formData.urgency} 
              onChange={handleChange}
              className="w-full border border-smoke/30 rounded-xl px-4 py-2.5 bg-mist text-[14px] text-ink focus:bg-paper focus:ring-1 focus:ring-moss focus:border-moss outline-none transition-colors"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-ink uppercase tracking-wider mb-2">Scheduled Time</label>
            <input 
              type="datetime-local" 
              name="scheduledTime" 
              value={formData.scheduledTime} 
              onChange={handleChange}
              className="w-full border border-smoke/30 rounded-xl px-4 py-2.5 bg-mist text-[14px] text-ink focus:bg-paper focus:ring-1 focus:ring-moss focus:border-moss outline-none transition-colors"
              required
            />
          </div>
        </div>

        <div className="flex items-start gap-3 bg-sand p-4 rounded-xl border border-smoke/30">
          <input 
            type="checkbox" 
            id="consent" 
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            className="mt-1 shrink-0 cursor-pointer w-4 h-4 text-moss focus:ring-moss border-smoke/50 rounded"
          />
          <label htmlFor="consent" className="text-[13px] text-smoke cursor-pointer">
            <span className="font-bold text-ink block mb-0.5">Authorization Confirmed</span>
            I confirm that I have received explicit authorization from this user to post this task on their behalf.
          </label>
        </div>

        <div className="pt-6 border-t border-smoke/30 flex justify-end">
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-moss hover:bg-moss/90 text-paper font-bold py-2.5 px-6 rounded-xl transition-colors shadow-md disabled:opacity-50 text-[14px]"
          >
            {submitting ? "Posting Task..." : "Post Task for User"}
          </button>
        </div>
      </form>
    </div>
  );
}

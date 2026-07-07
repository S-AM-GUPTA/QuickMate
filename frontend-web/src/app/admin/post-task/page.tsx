"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AdminPostTaskPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Default QuickMate Campus coordinates (Delhi)
  const defaultLat = 28.6315;
  const defaultLng = 77.2167;

  const [formData, setFormData] = useState({
    customerId: "",
    title: "",
    description: "",
    budget: "",
    category: "Notes & Printing",
    urgency: "medium",
    scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
  });

  const categories = [
    "Notes & Printing",
    "Food & Snacks",
    "Lab Files & Assign",
    "Stationery Run",
    "Tech Help",
    "Roommate Help",
    "Campus Errands"
  ];

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
    return <div className="animate-pulse flex p-8">Loading users...</div>;
  }

  return (
    <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Post Task on Behalf of User</h2>
        <p className="text-sm text-slate-500 mt-1">Create a task manually for a user who contacted you on WhatsApp.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-medium">
            Task successfully created!
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Select User (Requested By)</label>
          <select 
            name="customerId" 
            value={formData.customerId} 
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-2 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            required
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.phone || u.email})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Task Title</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange}
            placeholder="e.g. Need Notes Printed ASAP"
            className="w-full border border-slate-300 rounded-xl px-4 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            rows={3}
            placeholder="Details about the task..."
            className="w-full border border-slate-300 rounded-xl px-4 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Budget (₹)</label>
            <input 
              type="number" 
              name="budget" 
              value={formData.budget} 
              onChange={handleChange}
              placeholder="e.g. 50"
              min="10"
              className="w-full border border-slate-300 rounded-xl px-4 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-2 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Urgency</label>
            <select 
              name="urgency" 
              value={formData.urgency} 
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-2 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Scheduled Time</label>
            <input 
              type="datetime-local" 
              name="scheduledTime" 
              value={formData.scheduledTime} 
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors disabled:opacity-50"
          >
            {submitting ? "Posting Task..." : "Post Task for User"}
          </button>
        </div>
      </form>
    </div>
  );
}

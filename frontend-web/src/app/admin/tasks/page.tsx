"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Briefcase, IndianRupee, Clock, CheckCircle, MapPin, Trash2, Edit2, Save, X } from "lucide-react";

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/admin/tasks");
        setTasks(res.data);
      } catch (error) {
        console.error("Failed to load tasks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await api.patch(`/admin/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update task status");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to permanently delete this task?")) return;
    try {
      await api.delete(`/admin/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task", error);
      alert("Failed to delete task");
    }
  };

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    budget: 0,
    category: "",
    urgency: "medium",
    status: "OPEN",
    address: ""
  });
  const [saving, setSaving] = useState(false);

  const openEditModal = (task: any) => {
    setEditingTaskId(task.id);
    setEditForm({
      title: task.title || "",
      description: task.description || "",
      budget: task.budget || 0,
      category: task.category || "",
      urgency: task.urgency || "medium",
      status: task.status || "OPEN",
      address: task.address || ""
    });
    setShowEditModal(true);
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTaskId) return;
    
    setSaving(true);
    try {
      await api.patch(`/admin/tasks/${editingTaskId}`, {
        title: editForm.title,
        description: editForm.description,
        budget: Number(editForm.budget),
        category: editForm.category,
        urgency: editForm.urgency,
        status: editForm.status,
        address: editForm.address
      });
      
      setTasks(tasks.map(t => t.id === editingTaskId ? { ...t, ...editForm, budget: Number(editForm.budget) } : t));
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update task", error);
      alert("Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-paper rounded-2xl shadow-sm border border-smoke/30 overflow-hidden relative animate-fade-in-up">
      <div className="p-6 border-b border-smoke/30 bg-sand">
        <h2 className="text-xl text-ink tracking-tight">Task Lifecycle Monitor</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px] text-ink">
          <thead className="bg-sand text-[11px] uppercase tracking-widest text-smoke border-b border-smoke/30 font-bold">
            <tr>
              <th className="px-6 py-4">Task Details</th>
              <th className="px-6 py-4">Category / Budget</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-smoke font-medium">Loading tasks...</td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-smoke font-medium">No tasks found on the platform</td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="border-b border-smoke/20 hover:bg-mist transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-ink">{task.title}</p>
                      <p className="text-[12px] text-smoke line-clamp-1 max-w-[200px] mt-1" title={task.description}>{task.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-mist border border-smoke/30 rounded-full text-[10px] font-bold uppercase tracking-widest mb-1 text-ink">
                      {task.category}
                    </span>
                    <div className="flex items-center gap-1 text-moss font-bold text-[13px] mt-1">
                      <IndianRupee className="h-3.5 w-3.5" /> {task.budget}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      task.status === 'COMPLETED' ? 'bg-moss/10 text-moss border-moss/30' :
                      task.status === 'IN_PROGRESS' ? 'bg-mist text-ink border-smoke/30' : 
                      task.status === 'OPEN' ? 'bg-sand text-ink border-smoke/30' : 'bg-charcoal text-paper border-charcoal'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[12px] text-smoke line-clamp-2 max-w-[150px]" title={task.address || "Not specified"}>
                      {task.address || <span className="italic text-smoke/70">Not specified</span>}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-ink">{task.customer?.name || "Unknown"}</p>
                    {task.assignedHelper && (
                      <p className="text-[11px] text-smoke mt-1 font-semibold flex items-center gap-1">
                        Assigned: {task.assignedHelper.name}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(task)}
                        className="flex items-center gap-1 text-[12px] font-bold text-ink bg-mist border border-smoke/30 px-3 py-1.5 rounded-full hover:bg-sand transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-coral hover:text-coral/80 bg-coral/10 p-1.5 rounded-full hover:bg-coral/20 transition-colors cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Task Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-ink/60 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="w-full max-w-xl rounded-2xl bg-paper p-6 shadow-2xl border border-smoke/30 text-left">
              <div className="flex items-center justify-between border-b border-smoke/30 pb-4 mb-5">
                <div>
                  <h3 className="text-2xl text-ink tracking-tight">Edit Task</h3>
                  <p className="text-[13px] text-smoke mt-1">Modify task details, budget, and location.</p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="rounded-full p-2 text-smoke hover:bg-sand hover:text-ink transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateTask} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[12px] font-bold text-ink uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full rounded-xl border border-smoke/30 bg-mist px-4 py-2.5 text-[14px] text-ink focus:border-moss focus:bg-paper focus:outline-none focus:ring-1 focus:ring-moss transition-colors"
                  />
                </div>
                
                <div>
                  <label className="mb-1.5 block text-[12px] font-bold text-ink uppercase tracking-wider">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full rounded-xl border border-smoke/30 bg-mist px-4 py-2.5 text-[14px] text-ink focus:border-moss focus:bg-paper focus:outline-none focus:ring-1 focus:ring-moss transition-colors"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-bold text-ink uppercase tracking-wider">Budget (₹)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editForm.budget}
                      onChange={(e) => setEditForm({ ...editForm, budget: Number(e.target.value) })}
                      className="w-full rounded-xl border border-smoke/30 bg-mist px-4 py-2.5 text-[14px] text-ink focus:border-moss focus:bg-paper focus:outline-none focus:ring-1 focus:ring-moss transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-bold text-ink uppercase tracking-wider">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full rounded-xl border border-smoke/30 bg-mist px-4 py-2.5 text-[14px] text-ink focus:border-moss focus:bg-paper focus:outline-none focus:ring-1 focus:ring-moss transition-colors"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="ASSIGNED">ASSIGNED</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-bold text-ink uppercase tracking-wider">Category</label>
                    <input
                      type="text"
                      required
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full rounded-xl border border-smoke/30 bg-mist px-4 py-2.5 text-[14px] text-ink focus:border-moss focus:bg-paper focus:outline-none focus:ring-1 focus:ring-moss transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-bold text-ink uppercase tracking-wider">Urgency</label>
                    <select
                      value={editForm.urgency}
                      onChange={(e) => setEditForm({ ...editForm, urgency: e.target.value })}
                      className="w-full rounded-xl border border-smoke/30 bg-mist px-4 py-2.5 text-[14px] text-ink focus:border-moss focus:bg-paper focus:outline-none focus:ring-1 focus:ring-moss transition-colors"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-bold text-ink uppercase tracking-wider">Address</label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full rounded-xl border border-smoke/30 bg-mist px-4 py-2.5 text-[14px] text-ink focus:border-moss focus:bg-paper focus:outline-none focus:ring-1 focus:ring-moss transition-colors"
                    placeholder="Enter complete address"
                  />
                </div>

                <div className="pt-6 border-t border-smoke/30 flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-2.5 text-[14px] font-bold text-ink bg-mist border border-smoke/30 hover:bg-sand rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-bold text-paper bg-moss hover:bg-moss/90 rounded-xl transition-colors shadow-md disabled:opacity-70 cursor-pointer"
                  >
                    {saving ? "Saving..." : <><Save className="w-4 h-4"/> Save Changes</>}
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

"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Briefcase, IndianRupee, Clock, CheckCircle, MapPin, Trash2, Edit2 } from "lucide-react";

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

  const handleEditLocation = async (taskId: string, currentAddress: string) => {
    const newAddress = prompt("Enter new location for this task:", currentAddress || "");
    if (newAddress !== null && newAddress !== currentAddress) {
      try {
        await api.patch(`/admin/tasks/${taskId}/location`, { address: newAddress });
        setTasks(tasks.map(t => t.id === taskId ? { ...t, address: newAddress } : t));
      } catch (error) {
        console.error("Failed to update location", error);
        alert("Failed to update task location");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Task Lifecycle Monitor</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200 font-bold">
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
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading tasks...</td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No tasks found on the platform</td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{task.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xs mt-1">{task.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-1 bg-slate-100 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
                      {task.category}
                    </span>
                    <div className="flex items-center gap-1 text-emerald-600 font-bold">
                      <IndianRupee className="h-3 w-3" /> {task.budget}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      task.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                      task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 
                      task.status === 'OPEN' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start justify-between group/loc">
                      <p className="text-xs text-slate-600 line-clamp-2 max-w-[150px]" title={task.address || "Not specified"}>
                        {task.address || <span className="italic text-slate-400">Not specified</span>}
                      </p>
                      <button 
                        onClick={() => handleEditLocation(task.id, task.address)}
                        className="text-slate-400 hover:text-emerald-600 opacity-0 group-hover/loc:opacity-100 transition-opacity p-1 ml-1 shrink-0 bg-slate-50 hover:bg-emerald-50 rounded"
                        title="Edit Location"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-700">{task.customer?.name || "Unknown"}</p>
                    {task.assignedHelper && (
                      <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                        Assigned: {task.assignedHelper.name}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select 
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-600 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="ASSIGNED">ASSIGNED</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-800 bg-red-50 p-1.5 rounded-full hover:bg-red-100 transition-colors"
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
    </div>
  );
}

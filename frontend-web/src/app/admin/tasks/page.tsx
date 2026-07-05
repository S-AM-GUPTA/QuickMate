"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Briefcase, IndianRupee, Clock, CheckCircle, MapPin } from "lucide-react";

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
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading tasks...</td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No tasks found on the platform</td>
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
                    <p className="font-semibold text-slate-700">{task.customer?.name || "Unknown"}</p>
                    {task.assignedHelper && (
                      <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                        Assigned: {task.assignedHelper.name}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-600 hover:text-slate-900 font-bold text-xs bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors">
                      Details
                    </button>
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

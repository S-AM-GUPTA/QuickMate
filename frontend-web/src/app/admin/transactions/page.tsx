"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CreditCard, IndianRupee, ArrowUpRight, ArrowDownRight, Clock, Download, CheckCircle } from "lucide-react";

export default function AdminTransactionsPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/admin/tasks");
        setTasks(res.data);
      } catch (error) {
        console.error("Failed to load tasks for transactions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Compute dummy transaction data from tasks
  const completedTasks = tasks.filter(t => t.status === "COMPLETED");
  const totalVolume = completedTasks.reduce((sum, task) => sum + (task.budget || 0), 0);
  const platformFee = totalVolume * 0.15; // Assuming 15% platform fee
  
  const inEscrowTasks = tasks.filter(t => t.status === "ASSIGNED" || t.status === "IN_PROGRESS");
  const totalEscrow = inEscrowTasks.reduce((sum, task) => sum + (task.budget || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center bg-sand p-6 rounded-2xl border border-smoke/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-paper flex items-center justify-center border border-smoke/30 shadow-sm">
            <CreditCard className="w-6 h-6 text-charcoal" />
          </div>
          <div>
            <h2 className="text-xl text-ink tracking-tight">Transactions & Revenue</h2>
            <p className="text-[13px] text-smoke mt-1">Overview of platform financial flows and escrow balances.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-paper border border-smoke/30 px-4 py-2 rounded-full text-[13px] font-bold text-ink hover:bg-mist transition-colors shadow-sm">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-paper rounded-2xl p-6 shadow-sm border border-smoke/30 relative overflow-hidden">
          <p className="text-[12px] font-bold text-smoke uppercase tracking-wider mb-2">Total Processed Volume</p>
          <h3 className="text-3xl text-ink flex items-center gap-1">
            <IndianRupee className="w-6 h-6" /> {totalVolume.toLocaleString()}
          </h3>
          {totalVolume > 0 && (
            <div className="mt-4 flex items-center gap-2 text-[12px] font-bold text-moss">
              <span className="bg-moss/10 px-2 py-0.5 rounded-full flex items-center"><ArrowUpRight className="w-3 h-3 mr-1"/> 12.5%</span>
              <span className="text-smoke">vs last month</span>
            </div>
          )}
        </div>

        <div className="bg-paper rounded-2xl p-6 shadow-sm border border-smoke/30 relative overflow-hidden">
          <p className="text-[12px] font-bold text-smoke uppercase tracking-wider mb-2">Platform Revenue (15%)</p>
          <h3 className="text-3xl text-moss flex items-center gap-1">
            <IndianRupee className="w-6 h-6" /> {platformFee.toLocaleString()}
          </h3>
          {platformFee > 0 && (
            <div className="mt-4 flex items-center gap-2 text-[12px] font-bold text-moss">
              <span className="bg-moss/10 px-2 py-0.5 rounded-full flex items-center"><ArrowUpRight className="w-3 h-3 mr-1"/> 15.2%</span>
              <span className="text-smoke">vs last month</span>
            </div>
          )}
        </div>

        <div className="bg-paper rounded-2xl p-6 shadow-sm border border-smoke/30 relative overflow-hidden">
          <p className="text-[12px] font-bold text-smoke uppercase tracking-wider mb-2">Funds in Escrow</p>
          <h3 className="text-3xl text-ink flex items-center gap-1">
            <IndianRupee className="w-6 h-6" /> {totalEscrow.toLocaleString()}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-[12px] font-bold text-smoke">
            {totalEscrow > 0 ? (
              <>
                <span className="bg-mist border border-smoke/30 px-2 py-0.5 rounded-full flex items-center"><Clock className="w-3 h-3 mr-1"/> Active</span>
                <span>Awaiting task completion</span>
              </>
            ) : (
              <span className="bg-mist border border-smoke/30 px-2 py-0.5 rounded-full flex items-center text-smoke/70">None</span>
            )}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-paper rounded-2xl shadow-sm border border-smoke/30 overflow-hidden">
        <div className="p-6 border-b border-smoke/30 bg-sand">
          <h3 className="text-[16px] font-bold text-ink">Recent Escrow Releases</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] text-ink">
            <thead className="bg-sand text-[11px] uppercase tracking-widest text-smoke border-b border-smoke/30 font-bold">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Task</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-smoke font-medium">Loading transactions...</td>
                </tr>
              ) : completedTasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-smoke font-medium">No completed transactions yet</td>
                </tr>
              ) : (
                completedTasks.slice(0, 10).map((task) => (
                  <tr key={task.id} className="border-b border-smoke/20 hover:bg-mist transition-colors">
                    <td className="px-6 py-4 font-mono text-[12px] text-smoke">
                      TXN-{task.id.substring(0,8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-ink truncate max-w-[200px]">{task.title}</p>
                      <p className="text-[11px] text-smoke mt-0.5">To: {task.assignedHelper?.name || 'Mate'}</p>
                    </td>
                    <td className="px-6 py-4 text-smoke text-[13px]">
                      {new Date(task.updatedAt || task.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-ink">
                      ₹{task.budget}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-moss/10 text-moss border border-moss/30">
                        <CheckCircle className="w-3 h-3" /> Released
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

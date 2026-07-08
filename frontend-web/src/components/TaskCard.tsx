"use client";

import React from "react";
import {
  Clock,
  MapPin,
  IndianRupee,
  AlertCircle,
  Image as ImageIcon,
  Edit2,
  Trash2,
} from "lucide-react";

export interface Task {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  urgency: "low" | "medium" | "urgent";
  status:
    | "OPEN"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "DISPUTED";
  latitude: number;
  longitude: number;
  address?: string;
  scheduledTime: string;
  attachmentUrls?: string[];
  customerId: string;
  assignedHelperId?: string | null;
  distanceMeters?: number;
  customer?: {
    id: string;
    name: string;
    rating?: number;
    isVerified?: boolean;
  };
  assignedHelper?: {
    id: string;
    name: string;
    phone?: string;
    rating?: number;
    isVerified?: boolean;
  };
}

interface TaskCardProps {
  task: Task;
  viewMode: "customer" | "helper";
  onPlaceBid?: (task: Task) => void;
  onViewBids?: (task: Task) => void;
  onReleasePayment?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
}

export default function TaskCard({
  task,
  viewMode,
  onPlaceBid,
  onViewBids,
  onReleasePayment,
  onEditTask,
  onDeleteTask,
}: TaskCardProps) {
  const urgencyColors = {
    low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    urgent: "bg-rose-50 text-rose-700 border-rose-200 animate-pulse",
  };

  const statusColors = {
    OPEN: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ASSIGNED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    IN_PROGRESS: "bg-yellow-50 text-yellow-700 border-yellow-200",
    COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-300",
    CANCELLED: "bg-slate-50 text-slate-600 border-slate-200",
    DISPUTED: "bg-red-50 text-red-700 border-red-200",
  };

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const formattedDate = isClient 
    ? new Date(task.scheduledTime).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Loading date...";

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_15px_30px_-10px_rgba(13,127,100,0.2)]">
      <div className="flex items-start justify-between gap-4">
        {/* Category & Title */}
        <div>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
            {task.category}
          </span>
          <h3 className="mt-2 text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
            {task.title}
          </h3>
        </div>

        {/* Urgency and Status badges */}
        <div className="flex flex-col gap-2 items-end">
          <div className="flex gap-2">
            {viewMode === "customer" && task.status === "OPEN" && onEditTask && (
              <button onClick={() => onEditTask(task)} className="p-1 text-slate-400 hover:text-emerald-600 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {viewMode === "customer" && task.status === "OPEN" && onDeleteTask && (
              <button onClick={() => onDeleteTask(task)} className="p-1 text-slate-400 hover:text-rose-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${urgencyColors[task.urgency]}`}
            >
              {task.urgency}
            </span>
          </div>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColors[task.status]}`}
          >
            {task.status}
          </span>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-500 line-clamp-2">
        {task.description}
      </p>

      {/* Attachments preview */}
      {task.attachmentUrls && task.attachmentUrls.length > 0 && (
        <div className="mt-4 flex gap-2">
          {task.attachmentUrls.map((url, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-500"
            >
              <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
              <span className="truncate max-w-[120px]">
                Attachment {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Meta Stats: Location, Distance, Time, Budget */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {task.address ? task.address : (task.distanceMeters !== undefined
              ? `${task.distanceMeters}m away`
              : `Delhi NCR`)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-lg font-extrabold text-slate-900">
          <IndianRupee className="h-4.5 w-4.5 text-slate-500" />
          <span>{task.budget}</span>
        </div>
      </div>

      {/* Interactive CTA buttons based on role */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        {viewMode === "helper" && task.status === "OPEN" && onPlaceBid && (
          <button
            onClick={() => onPlaceBid(task)}
            className="w-full flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition duration-200 cursor-pointer"
          >
            Place a Bid
          </button>
        )}

        {viewMode === "customer" && task.status === "OPEN" && onViewBids && (
          <button
            onClick={() => onViewBids(task)}
            className="w-full flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition duration-200 cursor-pointer"
          >
            Review Offers
          </button>
        )}

        {viewMode === "customer" &&
          task.status === "IN_PROGRESS" &&
          onReleasePayment && (
            <button
              onClick={() => onReleasePayment(task)}
              className="w-full flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 hover:shadow transition duration-200 cursor-pointer"
            >
              Complete & Release Payment
            </button>
          )}
      </div>
    </div>
  );
}

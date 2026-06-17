"use client";

import React from "react";
import {
  Clock,
  MapPin,
  IndianRupee,
  AlertCircle,
  Image as ImageIcon,
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
  scheduledTime: string;
  attachmentUrls?: string[];
  customerId: string;
  assignedHelperId?: string | null;
  distanceMeters?: number;
}

interface TaskCardProps {
  task: Task;
  viewMode: "customer" | "helper";
  onPlaceBid?: (task: Task) => void;
  onViewBids?: (task: Task) => void;
  onReleasePayment?: (task: Task) => void;
}

export default function TaskCard({
  task,
  viewMode,
  onPlaceBid,
  onViewBids,
  onReleasePayment,
}: TaskCardProps) {
  const urgencyColors = {
    low: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800/30",
    medium:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/30",
    urgent:
      "bg-rose-50 text-rose-700 border-rose-200 animate-pulse dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800/30",
  };

  const statusColors = {
    OPEN: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/30",
    ASSIGNED:
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-800/30",
    IN_PROGRESS:
      "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-800/30",
    COMPLETED:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30",
    CANCELLED:
      "bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800",
    DISPUTED:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/30",
  };

  const [formattedDate, setFormattedDate] = React.useState<string>("");

  React.useEffect(() => {
    setFormattedDate(
      new Date(task.scheduledTime).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  }, [task.scheduledTime]);

  return (
    <div className="group overflow-hidden rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-zinc-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="flex items-start justify-between gap-4">
        {/* Category & Title */}
        <div>
          <span className="inline-flex items-center rounded-md bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-600 uppercase tracking-wider dark:bg-zinc-800 dark:text-zinc-300">
            {task.category}
          </span>
          <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {task.title}
          </h3>
        </div>

        {/* Urgency and Status badges */}
        <div className="flex flex-col gap-2 items-end">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${urgencyColors[task.urgency]}`}
          >
            {task.urgency}
          </span>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColors[task.status]}`}
          >
            {task.status}
          </span>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2">
        {task.description}
      </p>

      {/* Attachments preview */}
      {task.attachmentUrls && task.attachmentUrls.length > 0 && (
        <div className="mt-4 flex gap-2">
          {task.attachmentUrls.map((url, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-100 bg-zinc-50/50 p-2 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/20"
            >
              <ImageIcon className="h-3.5 w-3.5 text-zinc-400" />
              <span className="truncate max-w-[120px]">
                Attachment {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Meta Stats: Location, Distance, Time, Budget */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-50 pt-4 dark:border-zinc-800/50">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {task.distanceMeters !== undefined
              ? `${task.distanceMeters}m away`
              : `Delhi NCR`}
          </span>
        </div>

        <div className="flex items-center gap-1 text-base font-bold text-zinc-950 dark:text-zinc-50">
          <IndianRupee className="h-4.5 w-4.5 text-zinc-500 dark:text-zinc-400" />
          <span>{task.budget}</span>
        </div>
      </div>

      {/* Interactive CTA buttons based on role */}
      <div className="mt-5 border-t border-zinc-50 pt-4 dark:border-zinc-800/50">
        {viewMode === "helper" && task.status === "OPEN" && onPlaceBid && (
          <button
            onClick={() => onPlaceBid(task)}
            className="w-full flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 hover:shadow transition duration-200 cursor-pointer"
          >
            Place a Bid
          </button>
        )}

        {viewMode === "customer" && task.status === "OPEN" && onViewBids && (
          <button
            onClick={() => onViewBids(task)}
            className="w-full flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition duration-200 cursor-pointer"
          >
            Review Bids
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

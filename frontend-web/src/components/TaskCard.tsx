import React from "react";
import { Clock, MapPin, AlertCircle, CheckCircle } from "lucide-react";

export interface Task {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  urgency: "low" | "medium" | "urgent";
  status: "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "DISPUTED";
  scheduledTime: string;
  address?: string;
  distance?: number;
  latitude?: number;
  longitude?: number;
  assignedHelperId?: string;
  bidDetails?: any;
  isFixedPrice?: boolean;
}

interface TaskCardProps {
  task: Task;
  viewMode: "admin" | "helper" | "customer";
  onPlaceBid?: (task: Task) => void;
  onViewBids?: (task: Task) => void;
  onReleasePayment?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  onUpdateStatus?: (task: Task, newStatus: string) => void;
}

export default function TaskCard({
  task,
  viewMode,
  onPlaceBid,
  onViewBids,
  onReleasePayment,
  onEditTask,
  onDeleteTask,
  onUpdateStatus,
}: TaskCardProps) {
  const urgencyColors = {
    low: "bg-sand text-smoke border-smoke",
    medium: "bg-sand text-ink border-smoke",
    urgent: "bg-charcoal text-paper border-charcoal animate-pulse",
  };

  const statusColors = {
    OPEN: "bg-paper text-ink border-ink border-2 font-medium",
    ASSIGNED: "bg-sand text-smoke border-smoke",
    IN_PROGRESS: "bg-charcoal text-paper border-charcoal",
    COMPLETED: "bg-sand text-smoke border-smoke",
    CANCELLED: "bg-sand text-smoke/50 border-smoke line-through",
    DISPUTED: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const formattedDate = isClient
    ? new Date(task.scheduledTime).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Loading date...";

  // Mask address for non-customers if the task is still OPEN
  const getDisplayAddress = () => {
    if (!task.address) return undefined;
    if (task.status === "OPEN" && viewMode !== "customer") {
      const parts = task.address.split(",");
      if (parts.length > 2) {
        return "Approx: " + parts.slice(-2).join(",").trim();
      }
      return "Approx: " + task.address;
    }
    return task.address;
  };
  const displayAddress = getDisplayAddress();

  return (
    <div className="group bg-paper rounded-2xl p-6 border border-smoke transition-all duration-300 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-4">
        {/* Category & Title */}
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-sand px-3 py-1 text-[12px] font-medium text-smoke border border-smoke/50">
              {task.category}
            </span>
            {task.status === "OPEN" && (
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase border ${
                task.isFixedPrice 
                  ? 'bg-moss/10 text-moss border-moss/30' 
                  : 'bg-[#FACC15]/20 text-charcoal border-[#FACC15]/30'
              }`}>
                {task.isFixedPrice ? "Fixed Price" : "Open to Bids"}
              </span>
            )}
          </div>
          <h3 className="mt-4 text-[20px] tracking-tight text-ink group-hover:text-smoke transition-colors leading-tight line-clamp-2">
            {task.title}
          </h3>
        </div>
        
        {/* Budget */}
        <div className="flex flex-col items-end shrink-0">
          <span className="text-[24px] text-ink tracking-tight">₹{task.budget}</span>
          {viewMode === "customer" && task.status === "OPEN" && (
            <span className="mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-sand text-smoke border border-smoke/50">
              2 Bids
            </span>
          )}
        </div>
      </div>

      <p className="mt-3 text-[14px] text-smoke line-clamp-2 leading-relaxed">
        {task.description}
      </p>

      {/* Meta tags row */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {/* Time */}
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-smoke bg-sand px-2.5 py-1 rounded-full border border-smoke/30">
          <Clock className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>

        {/* Location / Distance */}
        {displayAddress && (
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-smoke bg-sand px-2.5 py-1 rounded-full border border-smoke/30 max-w-[150px] truncate" title={displayAddress}>
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{displayAddress}</span>
          </div>
        )}
        
        {viewMode === "helper" && task.distance !== undefined && (
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-smoke bg-sand px-2.5 py-1 rounded-full border border-smoke/30">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{task.distance.toFixed(1)} km</span>
          </div>
        )}

        {/* Status */}
        <div
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[13px] font-medium ${statusColors[task.status]}`}
        >
          {task.status === "OPEN" && <AlertCircle className="w-3.5 h-3.5" />}
          {task.status === "COMPLETED" && <CheckCircle className="w-3.5 h-3.5" />}
          <span>{task.status}</span>
        </div>
      </div>

      {/* Interactive CTA buttons based on role */}
      <div className="mt-6 pt-5 border-t border-smoke">
        {viewMode === "helper" && task.status === "OPEN" && onPlaceBid && (
          <button
            onClick={() => onPlaceBid(task)}
            className={`w-full flex items-center justify-center rounded-full px-4 py-2.5 text-[14px] font-medium transition duration-200 cursor-pointer ${
              task.isFixedPrice 
                ? 'bg-moss text-paper hover:opacity-90' 
                : 'bg-charcoal text-paper hover:opacity-90'
            }`}
          >
            {task.isFixedPrice ? "Accept Job" : "Place a Bid"}
          </button>
        )}

        {viewMode === "customer" && task.status === "OPEN" && onViewBids && (
          <button
            onClick={() => onViewBids(task)}
            className="w-full flex items-center justify-center rounded-full border border-smoke bg-paper px-4 py-2.5 text-[14px] font-medium text-ink hover:bg-sand transition duration-200 cursor-pointer"
          >
            Review Offers
          </button>
        )}

        {viewMode === "customer" &&
          task.status === "IN_PROGRESS" &&
          onReleasePayment && (
            <button
              onClick={() => onReleasePayment(task)}
              className="w-full flex items-center justify-center rounded-full bg-charcoal px-4 py-2.5 text-[14px] font-medium text-paper hover:opacity-90 transition duration-200 cursor-pointer"
            >
              Release Payment
            </button>
          )}

        {/* Helper Options for Assigned / In Progress */}
        {viewMode === "helper" && task.status === "ASSIGNED" && onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus(task, "IN_PROGRESS")}
            className="w-full flex items-center justify-center rounded-full bg-charcoal px-4 py-2.5 text-[14px] font-medium text-paper hover:opacity-90 transition duration-200 cursor-pointer"
          >
            Start Task
          </button>
        )}

        {viewMode === "helper" && task.status === "IN_PROGRESS" && onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus(task, "COMPLETED")}
            className="w-full flex items-center justify-center rounded-full bg-moss px-4 py-2.5 text-[14px] font-medium text-paper hover:opacity-90 transition duration-200 cursor-pointer"
          >
            Mark as Completed
          </button>
        )}
      </div>
    </div>
  );
}

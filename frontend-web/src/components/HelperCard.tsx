"use client";

import React from "react";
import { Star, ShieldCheck, MapPin, CheckCircle } from "lucide-react";

export interface Helper {
  id: string;
  name: string;
  email: string;
  role: "helper";
  phone?: string;
  skills: string[];
  profession?: string;
  latitude: number;
  longitude: number;
  rating: number;
  completedTasksCount: number;
  isVerified: boolean;
  distanceMeters?: number;
  mateTier?: "generalist" | "specialist";
}

interface HelperCardProps {
  helper: Helper;
  onHire?: (helper: Helper) => void;
  onViewProfile?: (helper: Helper) => void;
}

export default function HelperCard({ helper, onHire, onViewProfile }: HelperCardProps) {
  // A mate is PRO if they explicitly registered as a specialist, OR legacy fallback
  const isPro = helper.mateTier === "specialist" || (!helper.mateTier && helper.rating >= 4.9 && helper.isVerified);

  return (
    <div className={`group flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 relative ${isPro ? 'bg-charcoal text-paper border border-charcoal shadow-lg hover:shadow-xl hover:-translate-y-1' : 'bg-paper text-ink border border-smoke hover:border-ink'}`}>
      
      {/* PRO Badge Overlay */}
      {isPro && (
        <div className="absolute -top-3 left-6 bg-[#FACC15] text-charcoal px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border-2 border-paper shadow-sm flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" /> Pro Mate
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        {/* Avatar & Info */}
        <div 
          className={`flex gap-4 ${onViewProfile ? "cursor-pointer" : ""}`}
          onClick={() => onViewProfile?.(helper)}
        >
          <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[24px] font-serif border ${isPro ? 'bg-paper/10 border-paper/20 text-paper' : 'bg-sand border-smoke text-ink'}`}>
            {helper.name.charAt(0)}
            {helper.isVerified && !isPro && (
              <span className="absolute -bottom-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-moss/20 text-moss border-2 border-paper">
                <CheckCircle className="h-3 w-3 fill-current" />
              </span>
            )}
            {isPro && (
              <span className="absolute -bottom-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#FACC15] text-charcoal border-2 border-charcoal">
                <ShieldCheck className="h-3 w-3 fill-current" />
              </span>
            )}
          </div>
          <div className="flex flex-col justify-center pt-0.5">
            <div className="flex items-center gap-1.5">
              <h4 className={`text-[18px] font-serif tracking-tight transition-colors ${onViewProfile ? (isPro ? "group-hover:text-paper/80" : "group-hover:text-smoke") : ""} ${isPro ? "text-paper" : "text-ink"}`}>
                {helper.name}
              </h4>
            </div>
            {helper.profession && isPro && (
              <div className={`text-[13px] font-medium mt-0.5 ${isPro ? 'text-[#FACC15]' : 'text-smoke'}`}>
                {helper.profession}
              </div>
            )}
            {(!isPro || helper.mateTier === "generalist") && (
              <div className="text-[13px] font-medium mt-0.5 text-smoke">
                Generalist - All Tasks
              </div>
            )}
            {/* Rating & Distance */}
            <div className="mt-1.5 flex items-center gap-2 text-[13px] font-medium">
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${isPro ? 'bg-paper/10 border-paper/20 text-paper' : 'bg-sand border-smoke/30 text-ink'}`}>
                <Star className={`h-3.5 w-3.5 fill-current ${isPro ? 'text-[#FACC15]' : 'text-[#FACC15]'}`} />
                {helper.rating.toFixed(1)}
              </span>
              <span className={isPro ? 'text-paper/70' : 'text-smoke'}>
                {helper.completedTasksCount} jobs
              </span>
            </div>
          </div>
        </div>

        {/* Distance Badge */}
        <div className={`flex items-center gap-1 text-[12px] font-medium px-2 py-1 rounded-full border ${isPro ? 'bg-paper/10 border-paper/20 text-paper/80' : 'bg-sand border-smoke/30 text-smoke'}`}>
          <MapPin className="h-3.5 w-3.5" />
          <span>
            {helper.distanceMeters !== undefined
              ? `${(helper.distanceMeters / 1000).toFixed(1)}km`
              : "Nearby"}
          </span>
        </div>
      </div>

      {/* Skills Tags */}
      <div className="mt-5 flex flex-wrap gap-2">
        {helper.skills?.map((skill, index) => (
          <span
            key={index}
            className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium border ${isPro ? 'bg-paper/5 border-paper/20 text-paper/80' : 'bg-sand border-smoke/50 text-smoke'}`}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Hire CTA */}
      {onHire && (
        <div className={`mt-6 pt-5 border-t ${isPro ? 'border-paper/10' : 'border-smoke'}`}>
          <button
            onClick={() => onHire(helper)}
            className={`w-full flex items-center justify-center rounded-full px-4 py-2.5 text-[14px] font-medium transition duration-200 cursor-pointer ${isPro ? 'bg-paper text-charcoal hover:bg-[#FACC15]' : 'bg-charcoal text-paper hover:opacity-90'}`}
          >
            Choose & Chat
          </button>
        </div>
      )}
    </div>
  );
}

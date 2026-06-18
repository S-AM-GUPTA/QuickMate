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
  latitude: number;
  longitude: number;
  rating: number;
  completedTasksCount: number;
  isVerified: boolean;
  distanceMeters?: number;
}

interface HelperCardProps {
  helper: Helper;
  onHire?: (helper: Helper) => void;
  onViewProfile?: (helper: Helper) => void;
}

export default function HelperCard({ helper, onHire, onViewProfile }: HelperCardProps) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        {/* Avatar & Info */}
        <div 
          className={`flex gap-4 ${onViewProfile ? "cursor-pointer" : ""}`}
          onClick={() => onViewProfile?.(helper)}
        >
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-base font-bold text-emerald-600">
            {helper.name.charAt(0)}
            {helper.isVerified && (
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white border-2 border-white">
                <CheckCircle className="h-3 w-3 fill-current" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className={`font-bold text-slate-900 transition-colors ${onViewProfile ? "group-hover:text-emerald-600" : ""}`}>
                {helper.name}
              </h4>
              {helper.isVerified && (
                <span title="Verified Helper">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </span>
              )}
            </div>
            {/* Rating & Distance */}
            <div className="mt-1 flex items-center gap-2.5 text-xs">
              <span className="flex items-center gap-0.5 font-bold text-amber-500">
                <Star className="h-3.5 w-3.5 fill-current" />
                {helper.rating.toFixed(1)}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-medium">
                {helper.completedTasksCount} tasks completed
              </span>
            </div>
          </div>
        </div>

        {/* Distance Badge */}
        <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
          <MapPin className="h-3.5 w-3.5" />
          <span>
            {helper.distanceMeters !== undefined
              ? `${helper.distanceMeters}m away`
              : "Nearby"}
          </span>
        </div>
      </div>

      {/* Skills Tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {helper.skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Hire CTA */}
      {onHire && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <button
            onClick={() => onHire(helper)}
            className="w-full flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition duration-200 cursor-pointer shadow-md shadow-emerald-600/20"
          >
            Choose & Chat
          </button>
        </div>
      )}
    </div>
  );
}

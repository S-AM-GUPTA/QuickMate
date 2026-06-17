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
}

export default function HelperCard({ helper, onHire }: HelperCardProps) {
  return (
    <div className="group rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-zinc-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="flex items-start justify-between gap-4">
        {/* Avatar & Info */}
        <div className="flex gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-base font-bold text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
            {helper.name.charAt(0)}
            {helper.isVerified && (
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white border-2 border-white dark:border-zinc-900">
                <CheckCircle className="h-3 w-3 fill-current" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
              <span className="flex items-center gap-0.5 font-medium text-amber-500">
                <Star className="h-3.5 w-3.5 fill-current" />
                {helper.rating.toFixed(1)}
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {helper.completedTasksCount} tasks completed
              </span>
            </div>
          </div>
        </div>

        {/* Distance Badge */}
        <div className="flex items-center gap-1 text-xs text-zinc-400">
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
            className="inline-flex items-center rounded-full bg-zinc-50 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Hire CTA */}
      {onHire && (
        <div className="mt-5 border-t border-zinc-50 pt-4 dark:border-zinc-800/50">
          <button
            onClick={() => onHire(helper)}
            className="w-full flex items-center justify-center rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition duration-200 cursor-pointer"
          >
            Choose & Chat
          </button>
        </div>
      )}
    </div>
  );
}

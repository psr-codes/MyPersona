"use client";

import { Activity, Globe } from "lucide-react";

export default function Header({ title, subtitle }) {
  return (
    <header className="flex items-center justify-between px-8 py-5 glass border-b border-gray-100 sticky top-0 z-40 min-h-[72px]">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Network Badge */}
        <div className="flex items-center gap-2 px-3 py-2 network-badge rounded-full text-xs font-semibold text-purple-600">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-glow" />
          <span>Polygon Amoy</span>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full">
          <Activity size={14} className="text-emerald-500" />
          <span className="text-sm font-medium text-gray-700">Online</span>
        </div>
      </div>
    </header>
  );
}

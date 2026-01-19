"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Landmark,
  ShieldAlert,
  Settings,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Manage Issuers", path: "/issuers", icon: Landmark },
  { name: "System Status", path: "/system", icon: ShieldAlert },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-slate-900 text-white flex flex-col z-50 transition-all duration-300 shadow-xl ${isCollapsed ? "w-20" : "w-70"}`}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800 min-h-[72px]">
        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg text-white font-bold flex-shrink-0 shadow-lg shadow-amber-900/20">
          <Landmark size={24} />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col  overflow-hidden">
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              RBI Admin
            </span>
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap uppercase tracking-wider">
              Super Authority
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 flex flex-col gap-1 mt-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`relative flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-900/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              } ${isCollapsed ? "justify-center px-3" : ""}`}
            >
              <Icon
                size={20}
                className={
                  isActive
                    ? "text-white"
                    : "text-slate-400 group-hover:text-amber-400 transition-colors"
                }
              />
              {!isCollapsed && <span>{item.name}</span>}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-white rounded-r opacity-50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-800 mt-auto bg-slate-950/30">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 font-medium border border-slate-800">
            <Fingerprint size={14} className="text-amber-600" />
            <span>Secure Admin Access</span>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        className="absolute -right-3 top-20 w-6 h-6 flex items-center justify-center bg-slate-800 border border-slate-700 rounded-full text-slate-400 cursor-pointer transition-all hover:bg-amber-600 hover:border-amber-600 hover:text-white z-10 shadow-lg"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}

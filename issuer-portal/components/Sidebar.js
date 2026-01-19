"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileKey,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { CONTRACT_ADDRESSES, getAddressExplorerUrl } from "@/lib/contracts";

const navigation = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Issuers", path: "/issuers", icon: Users },
  { name: "Credentials", path: "/credentials", icon: FileKey },
  { name: "System", path: "/system", icon: Settings },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 flex flex-col z-50 shadow-sm transition-all duration-300 ${isCollapsed ? "w-20" : "w-70"}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 min-h-[72px]">
        <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-teal-500 to-indigo-600 rounded-lg text-white flex-shrink-0">
          <Shield size={26} />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
              MyPersona
            </span>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              Issuer Portal
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-gradient-to-r from-teal-50 to-indigo-50 text-teal-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              } ${isCollapsed ? "justify-center px-3" : ""}`}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{item.name}</span>}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gradient-to-b from-teal-500 to-indigo-600 rounded-r" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Contract Info */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-100 mt-auto">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Deployed Contracts
          </div>
          <a
            href={getAddressExplorerUrl(CONTRACT_ADDRESSES.ISSUER_REGISTRY)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between py-2 text-xs text-gray-500 hover:text-teal-600 transition-colors"
          >
            <span>IssuerRegistry</span>
            <ExternalLink size={12} />
          </a>
          <a
            href={getAddressExplorerUrl(CONTRACT_ADDRESSES.REVOCATION_REGISTRY)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between py-2 text-xs text-gray-500 hover:text-teal-600 transition-colors"
          >
            <span>RevocationRegistry</span>
            <ExternalLink size={12} />
          </a>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        className="absolute -right-3 top-20 w-6 h-6 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-500 cursor-pointer transition-all hover:bg-teal-500 hover:border-teal-500 hover:text-white z-10"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}

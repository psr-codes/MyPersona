"use client";

import {
  Building2,
  Users,
  ShieldCheck,
  Activity,
  Plus,
  ArrowRight,
  AlertTriangle,
  Landmark,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import { useAdmin } from "@/hooks/useAdmin";
import { useWallet } from "@/contexts/WalletContext";

export default function Dashboard() {
  const { isConnected } = useWallet();
  const { issuers, isLoading, isPaused, isAdmin } = useAdmin();

  return (
    <div className="min-h-screen">
      <Header title="Dashboard" subtitle="System Overview & Statistics" />

      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Welcome / Status Banner */}
        <div className="mb-8">
          {!isConnected ? (
            <div className="bg-white border-l-4 border-amber-500 p-6 rounded-r-xl shadow-sm flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Admin Access Required
                </h3>
                <p className="text-slate-500 mt-1">
                  Please connect the RBI Admin Wallet to manage the registry.
                </p>
              </div>
            </div>
          ) : !isAdmin ? (
            <div className="bg-white border-l-4 border-rose-500 p-6 rounded-r-xl shadow-sm flex items-start gap-4">
              <div className="bg-rose-100 p-3 rounded-full text-rose-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Unauthorized Account
                </h3>
                <p className="text-slate-500 mt-1">
                  The connected wallet is not the owner of the Issuer Registry.
                  View-only mode active.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="relative z-10 text-white">
                <h2 className="text-2xl font-bold mb-2">
                  Welcome, Super Admin
                </h2>
                <p className="text-slate-300 max-w-xl">
                  You have full control over the Trusted Issuer Registry.
                  Monitor network activity and manage authorized entities.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${isPaused ? "bg-rose-500/20 border-rose-500 text-rose-300" : "bg-emerald-500/20 border-emerald-500 text-emerald-300"}`}
                  >
                    <Activity size={12} />
                    System {isPaused ? "Paused" : "Active"}
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-500/20 border border-amber-500 text-amber-300">
                    <ShieldCheck size={12} />
                    Secure Mode
                  </span>
                </div>
              </div>
              {/* Background Decoration */}
              <Landmark className="absolute -bottom-6 -right-6 text-white/5 w-64 h-64 rotate-12" />
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: "Trusted Issuers",
              value: isLoading ? "..." : issuers.length,
              icon: Building2,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Active Users",
              value: "12.5k",
              desc: "Estimated across network",
              icon: Users,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "System Status",
              value: isPaused ? "Paused" : "Operational",
              icon: Activity,
              color: isPaused ? "text-rose-600" : "text-amber-600",
              bg: isPaused ? "bg-rose-50" : "bg-amber-50",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}
                >
                  <stat.icon size={24} />
                </div>
                {stat.desc && (
                  <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">
                    {stat.desc}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900">
                  {stat.value}
                </h3>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Building2 size={18} className="text-amber-600" />
                Registry Management
              </h3>
            </div>
            <div className="p-6 grid gap-4">
              <Link
                href="/issuers"
                className="group flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-amber-500 hover:bg-amber-50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 p-2 rounded-lg text-amber-700 group-hover:bg-amber-200 transition-colors">
                    <Plus size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      Add New Issuer
                    </h4>
                    <p className="text-sm text-slate-500">
                      Authorize a new entity (Bank/Gov)
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="text-slate-300 group-hover:text-amber-600 transition-colors"
                />
              </Link>

              <Link
                href="/issuers"
                className="group flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-700 group-hover:bg-blue-200 transition-colors">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      View Issuer List
                    </h4>
                    <p className="text-sm text-slate-500">
                      Audit current authorized entities
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="text-slate-300 group-hover:text-blue-600 transition-colors"
                />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Activity size={18} className="text-slate-600" />
                System Controls
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-6">
                Emergency controls for the entire zk-KYC ecosystem. Only use in
                case of critical security events.
              </p>

              <Link
                href="/system"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-amber-600 transition-colors"
              >
                Go to System Status <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

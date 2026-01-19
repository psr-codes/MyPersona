"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Users,
  FileX,
  Activity,
  ScanLine,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  ExternalLink,
  RefreshCw,
  Zap,
} from "lucide-react";
import Header from "@/components/Header";
import { useVerification } from "@/hooks/useVerification";
import { getExplorerUrl } from "@/lib/contracts";

export default function Dashboard() {
  const {
    getRevokedCount,
    getTrustedIssuersCount,
    getRecentRevocations,
    registryPaused,
    checkContractStatus,
  } = useVerification();

  const [stats, setStats] = useState({
    issuersCount: 0,
    revokedCount: 0,
    loading: true,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadStats = async () => {
    const [issuers, revoked, activity] = await Promise.all([
      getTrustedIssuersCount(),
      getRevokedCount(),
      getRecentRevocations(10),
    ]);
    setStats({ issuersCount: issuers, revokedCount: revoked, loading: false });
    setRecentActivity(activity);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadStats();
    await checkContractStatus();
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const formatAddress = (address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle="Real-time verification status and network overview"
      />

      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Welcome Banner */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-violet-500/8 to-teal-500/8 border border-violet-500/15 rounded-2xl mb-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-violet-500 to-teal-500 rounded-xl text-white">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Welcome to MyPersona Verifier Portal
              </h2>
              <p className="text-sm text-gray-600">
                Verify user KYC credentials with zero-knowledge proofs. No
                wallet connection required for verification.
              </p>
            </div>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-violet-500 hover:text-violet-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              size={18}
              className={isRefreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          {[
            {
              icon: Users,
              value: stats.loading ? "..." : stats.issuersCount,
              label: "Trusted Issuers",
              href: "/status",
              bg: "bg-violet-500/10",
              color: "text-violet-600",
            },
            {
              icon: FileX,
              value: stats.loading ? "..." : stats.revokedCount,
              label: "Revoked Credentials",
              href: "/status",
              bg: "bg-rose-500/10",
              color: "text-rose-500",
            },
            {
              icon: Activity,
              value: registryPaused ? "Paused" : "Active",
              label: "Registry Status",
              bg: registryPaused ? "bg-amber-500/10" : "bg-emerald-500/10",
              color: registryPaused ? "text-amber-500" : "text-emerald-500",
            },
            {
              icon: Zap,
              value: "Ready",
              label: "Verification Service",
              bg: "bg-teal-500/10",
              color: "text-teal-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="relative flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg group card-gradient-top overflow-hidden"
            >
              <div
                className={`w-13 h-13 flex items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}
              >
                <stat.icon size={24} />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </span>
                <span className="text-sm text-gray-500 font-medium">
                  {stat.label}
                </span>
              </div>
              {stat.href && (
                <Link
                  href={stat.href}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 transition-all hover:bg-violet-500 hover:text-white"
                >
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <Zap size={18} />
                Quick Actions
              </h3>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {[
                {
                  icon: ScanLine,
                  title: "Verify Credential",
                  desc: "Check if a credential is valid",
                  href: "/verify",
                },
                {
                  icon: ShieldCheck,
                  title: "Check Revocation",
                  desc: "Check credential revocation status",
                  href: "/status",
                },
                {
                  icon: Clock,
                  title: "View History",
                  desc: "See recent verification requests",
                  href: "/history",
                },
              ].map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gradient-to-r hover:from-violet-500/8 hover:to-teal-500/8 transition-all group"
                >
                  <div className="w-11 h-11 flex items-center justify-center bg-white rounded-lg text-violet-600 shadow-sm">
                    <action.icon size={20} />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-sm font-semibold text-gray-800">
                      {action.title}
                    </span>
                    <span className="text-xs text-gray-500">{action.desc}</span>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-gray-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <TrendingUp size={18} />
                How Verification Works
              </h3>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-4">
                {[
                  {
                    step: "1",
                    title: "Generate Request",
                    desc: "Create a verification request with requirements",
                  },
                  {
                    step: "2",
                    title: "User Shares Proof",
                    desc: "User scans QR and submits ZK proof",
                  },
                  {
                    step: "3",
                    title: "On-Chain Verification",
                    desc: "Check issuer trust and revocation status",
                  },
                  {
                    step: "4",
                    title: "Get Result",
                    desc: "Receive verified status without seeing personal data",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-violet-500 to-teal-500 rounded-full text-white text-sm font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div className="flex flex-col gap-1 pt-1">
                      <span className="text-sm font-semibold text-gray-800">
                        {item.title}
                      </span>
                      <span className="text-xs text-gray-500">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <Clock size={18} />
                Recent Network Activity
              </h3>
              <Link
                href="/status"
                className="flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="p-4">
              {recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Activity size={40} className="text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">No recent activity</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {recentActivity.slice(0, 8).map((event, index) => (
                    <a
                      key={`${event.transactionHash}-${index}`}
                      href={getExplorerUrl(event.transactionHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${event.type === "CredentialRevoked" ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-500"}`}
                      >
                        {event.type === "CredentialRevoked" ? (
                          <XCircle size={16} />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-700">
                          {event.type === "CredentialRevoked"
                            ? "Credential Revoked"
                            : "Credential Reinstated"}
                        </span>
                        <span className="text-xs text-gray-400">
                          Nonce: #{event.credentialNonce} • Block #
                          {event.blockNumber}
                        </span>
                      </div>
                      <ExternalLink
                        size={14}
                        className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

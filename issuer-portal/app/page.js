"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Users,
  FileX,
  Activity,
  Shield,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import Header from "@/components/Header";
import { useWallet } from "@/contexts/WalletContext";
import { useIssuerRegistry, useRevocationRegistry } from "@/hooks/useContracts";
import { getExplorerUrl, getAddressExplorerUrl } from "@/lib/contracts";

export default function Dashboard() {
  const { isConnected, formatAddress } = useWallet();
  const issuerRegistry = useIssuerRegistry();
  const revocationRegistry = useRevocationRegistry();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([issuerRegistry.refresh(), revocationRegistry.refresh()]);
    setIsRefreshing(false);
  };

  const allEvents = [
    ...issuerRegistry.events.map((e) => ({ ...e, registry: "issuer" })),
    ...revocationRegistry.events.map((e) => ({ ...e, registry: "revocation" })),
  ]
    .sort((a, b) => b.blockNumber - a.blockNumber)
    .slice(0, 10);

  const getEventIcon = (type) => {
    switch (type) {
      case "IssuerAdded":
        return <CheckCircle size={16} className="text-emerald-500" />;
      case "IssuerRemoved":
        return <XCircle size={16} className="text-rose-500" />;
      case "CredentialRevoked":
        return <XCircle size={16} className="text-rose-500" />;
      case "CredentialUnRevoked":
        return <CheckCircle size={16} className="text-emerald-500" />;
      case "Paused":
        return <AlertCircle size={16} className="text-amber-500" />;
      case "Unpaused":
        return <CheckCircle size={16} className="text-emerald-500" />;
      default:
        return <Activity size={16} className="text-gray-400" />;
    }
  };

  const formatEventMessage = (event) => {
    switch (event.type) {
      case "IssuerAdded":
        return `Issuer added: ${formatAddress(event.args?.issuerAddress || event.args?.[0])}`;
      case "IssuerRemoved":
        return `Issuer removed: ${formatAddress(event.args?.issuerAddress || event.args?.[0])}`;
      case "CredentialRevoked":
        return `Credential #${event.args?.credentialNonce} revoked`;
      case "CredentialUnRevoked":
        return `Credential #${event.args?.credentialNonce} reinstated`;
      case "Paused":
        return "Contract paused";
      case "Unpaused":
        return "Contract unpaused";
      default:
        return event.type;
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle="Overview of your zk-KYC network status"
      />

      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Welcome Banner */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-teal-500/8 to-indigo-500/8 border border-teal-500/15 rounded-2xl mb-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-teal-500 to-indigo-600 rounded-xl text-white">
              <Shield size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Welcome to MyPersona Issuer Portal
              </h2>
              <p className="text-sm text-gray-600">
                {isConnected
                  ? "Manage trusted issuers and credential revocations for the zk-KYC network."
                  : "Connect your wallet to start managing the zk-KYC network."}
              </p>
            </div>
          </div>
          {isConnected && (
            <button
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-teal-500 hover:text-teal-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                size={18}
                className={isRefreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          {[
            {
              icon: Users,
              value: issuerRegistry.isLoading
                ? "..."
                : issuerRegistry.trustedIssuers.length,
              label: "Trusted Issuers",
              href: "/issuers",
              bg: "bg-teal-500/10",
              color: "text-teal-600",
            },
            {
              icon: FileX,
              value: revocationRegistry.isLoading
                ? "..."
                : revocationRegistry.revokedCount,
              label: "Revoked Credentials",
              href: "/credentials",
              bg: "bg-rose-500/10",
              color: "text-rose-500",
            },
            {
              icon: Activity,
              value: issuerRegistry.isLoading
                ? "..."
                : issuerRegistry.isPaused || revocationRegistry.isPaused
                  ? "Paused"
                  : "Active",
              label: "System Status",
              href: "/system",
              bg:
                issuerRegistry.isPaused || revocationRegistry.isPaused
                  ? "bg-amber-500/10"
                  : "bg-emerald-500/10",
              color:
                issuerRegistry.isPaused || revocationRegistry.isPaused
                  ? "text-amber-500"
                  : "text-emerald-500",
            },
            {
              icon: TrendingUp,
              value: allEvents.length,
              label: "Recent Events",
              bg: "bg-indigo-500/10",
              color: "text-indigo-600",
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
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 transition-all hover:bg-teal-500 hover:text-white"
                >
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Activity Feed */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <Clock size={18} />
                Recent Activity
              </h3>
            </div>
            <div className="p-4">
              {allEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Activity size={40} className="text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">No recent activity</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {allEvents.map((event, index) => (
                    <a
                      key={`${event.transactionHash}-${index}`}
                      href={getExplorerUrl(event.transactionHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-700">
                          {formatEventMessage(event)}
                        </span>
                        <span className="text-xs text-gray-400">
                          Block #{event.blockNumber}
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

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <Activity size={18} />
                Quick Actions
              </h3>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {[
                {
                  icon: Users,
                  title: "Add Issuer",
                  desc: "Register a new trusted authority",
                  href: "/issuers",
                },
                {
                  icon: FileX,
                  title: "Revoke Credential",
                  desc: "Invalidate a compromised credential",
                  href: "/credentials",
                },
                {
                  icon: Shield,
                  title: "Emergency Controls",
                  desc: "Pause or unpause the system",
                  href: "/system",
                },
              ].map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gradient-to-r hover:from-teal-500/8 hover:to-indigo-500/8 transition-all group"
                >
                  <div className="w-11 h-11 flex items-center justify-center bg-white rounded-lg text-teal-600 shadow-sm">
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
                    className="text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Trusted Issuers List */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <Users size={18} />
                Trusted Issuers
              </h3>
              <Link
                href="/issuers"
                className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="p-4">
              {issuerRegistry.trustedIssuers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Users size={40} className="text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">
                    No trusted issuers registered
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {issuerRegistry.trustedIssuers.slice(0, 5).map((issuer) => (
                    <a
                      key={issuer.address}
                      href={getAddressExplorerUrl(issuer.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-teal-500 to-indigo-600 rounded-full text-white text-sm font-semibold">
                        {issuer.address.slice(2, 4).toUpperCase()}
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <span className="font-mono text-sm font-medium text-gray-800">
                          {formatAddress(issuer.address)}
                        </span>
                        <span className="text-xs text-gray-400">
                          Added at block #{issuer.addedAt}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 bg-emerald-50 rounded-full text-xs font-semibold text-emerald-700">
                        <CheckCircle size={14} />
                        Active
                      </div>
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

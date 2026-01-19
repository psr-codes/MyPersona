"use client";

import Header from "@/components/Header";
import { useAdmin } from "@/hooks/useAdmin";
import { useWallet } from "@/contexts/WalletContext";
import {
  ShieldAlert,
  PauseCircle,
  PlayCircle,
  Activity,
  Server,
  Lock,
  Copy,
  ExternalLink,
} from "lucide-react";
import { CONTRACT_ADDRESSES, getAddressExplorerUrl } from "@/lib/contracts";
import toast from "react-hot-toast";
import { useState } from "react";

export default function SystemPage() {
  const { isConnected } = useWallet();
  const { isPaused, contractOwner, isLoading, togglePause, isOwner } =
    useAdmin();
  const [isToggling, setIsToggling] = useState(false);

  const handleTogglePause = async () => {
    if (!isOwner) return;

    if (
      confirm(
        `Are you sure you want to ${isPaused ? "ACTIVATE" : "PAUSE"} the entire registry?`,
      )
    ) {
      setIsToggling(true);
      await togglePause(!isPaused);
      setIsToggling(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="min-h-screen">
      <Header
        title="System Status"
        subtitle="Registry Diagnostics & Controls"
      />

      <div className="p-8 max-w-[1000px] mx-auto">
        {/* Status Card */}
        <div
          className={`rounded-xl border shadow-sm p-8 mb-8 text-white ${
            isPaused
              ? "bg-rose-900 border-rose-800"
              : "bg-emerald-900 border-emerald-800"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-full ${
                  isPaused
                    ? "bg-rose-800 text-rose-200"
                    : "bg-emerald-800 text-emerald-200"
                }`}
              >
                {isPaused ? <ShieldAlert size={32} /> : <Activity size={32} />}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  System is {isPaused ? "PAUSED" : "OPERATIONAL"}
                </h2>
                <p
                  className={`mt-1 ${isPaused ? "text-rose-200" : "text-emerald-200"}`}
                >
                  {isPaused
                    ? "All new issuer authorizations are currently suspended."
                    : "The registry is active and processing transactions normally."}
                </p>
              </div>
            </div>

            {isOwner && (
              <button
                onClick={handleTogglePause}
                disabled={isToggling}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold shadow-lg transition-all ${
                  isPaused
                    ? "bg-emerald-500 hover:bg-emerald-400 text-white"
                    : "bg-rose-500 hover:bg-rose-400 text-white"
                } disabled:opacity-50`}
              >
                {isToggling ? (
                  "Processing..."
                ) : (
                  <>
                    {isPaused ? (
                      <PlayCircle size={20} />
                    ) : (
                      <PauseCircle size={20} />
                    )}
                    {isPaused ? "Resume Operations" : "Emergency Pause"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Contract Info */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Server size={18} className="text-slate-600" />
              Smart Contract Deployment
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                  Issuer Registry
                  <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">
                    Core
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <code className="text-sm font-mono text-slate-700 flex-1">
                  {CONTRACT_ADDRESSES.ISSUER_REGISTRY}
                </code>
                <button
                  onClick={() =>
                    copyToClipboard(CONTRACT_ADDRESSES.ISSUER_REGISTRY)
                  }
                  className="text-slate-400 hover:text-slate-600"
                >
                  <Copy size={16} />
                </button>
                <a
                  href={getAddressExplorerUrl(
                    CONTRACT_ADDRESSES.ISSUER_REGISTRY,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-600"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                  Revocation Registry
                </span>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <code className="text-sm font-mono text-slate-700 flex-1">
                  {CONTRACT_ADDRESSES.REVOCATION_REGISTRY}
                </code>
                <button
                  onClick={() =>
                    copyToClipboard(CONTRACT_ADDRESSES.REVOCATION_REGISTRY)
                  }
                  className="text-slate-400 hover:text-slate-600"
                >
                  <Copy size={16} />
                </button>
                <a
                  href={getAddressExplorerUrl(
                    CONTRACT_ADDRESSES.REVOCATION_REGISTRY,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-600"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Ownership */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Lock size={18} className="text-slate-600" />
              Ownership & Architecture
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-2">
                  Contract Owner
                </h4>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm bg-amber-50 text-amber-900 border border-amber-200 px-2 py-1 rounded">
                    {contractOwner || "Loading..."}
                  </span>
                  {contractOwner && (
                    <a
                      href={getAddressExplorerUrl(contractOwner)}
                      target="_blank"
                      className="text-slate-400 hover:text-blue-500"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  The account with super-admin privileges over the registry.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-2">
                  Network
                </h4>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span className="font-medium text-indigo-900">
                    Polygon Amoy Testnet
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Chain ID: 80002</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import {
  Wallet,
  CreditCard,
  ShieldCheck,
  ScanLine,
  ArrowRight,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import Header from "@/components/Header";
import { useWallet } from "@/contexts/WalletContext";
import { useCredentials } from "@/hooks/useCredentials";
import { formatTimestamp } from "@/lib/contracts";

export default function Dashboard() {
  const { isConnected, account, formatAddress } = useWallet();
  const { credentials, validCredentials, isLoading, requestCredential } =
    useCredentials();

  const handleRequestCredential = async () => {
    const credential = await requestCredential();
    if (credential) {
      // Success handled by toast in requestCredential
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle="Manage your digital identity credentials"
      />

      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Welcome Banner */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-500/8 to-emerald-500/8 border border-blue-500/15 rounded-2xl mb-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl text-white animate-float">
              <Wallet size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {isConnected ? `Welcome back!` : "Welcome to MyPersona"}
              </h2>
              <p className="text-sm text-gray-600">
                {isConnected
                  ? "Your secure digital identity wallet is ready."
                  : "Connect your wallet to access your KYC credentials."}
              </p>
            </div>
          </div>
          {isConnected && (
            <button
              onClick={handleRequestCredential}
              className="flex items-center gap-2 px-5 py-3 btn-primary-gradient rounded-lg text-white text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30"
            >
              <Plus size={18} />
              Request Credential
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          {[
            {
              icon: CreditCard,
              value: isLoading ? "..." : credentials.length,
              label: "Total Credentials",
              href: "/credentials",
              bg: "bg-blue-500/10",
              color: "text-blue-600",
            },
            {
              icon: ShieldCheck,
              value: isLoading ? "..." : validCredentials.length,
              label: "Valid Credentials",
              bg: "bg-emerald-500/10",
              color: "text-emerald-600",
            },
            {
              icon: Clock,
              value: isLoading
                ? "..."
                : credentials.length - validCredentials.length,
              label: "Expired/Revoked",
              bg: "bg-amber-500/10",
              color: "text-amber-600",
            },
            {
              icon: ScanLine,
              value: "Ready",
              label: "QR Scanner",
              href: "/scan",
              bg: "bg-violet-500/10",
              color: "text-violet-600",
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
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 transition-all hover:bg-blue-500 hover:text-white"
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
                <Sparkles size={18} />
                Quick Actions
              </h3>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {[
                {
                  icon: CreditCard,
                  title: "View Credentials",
                  desc: "Manage your KYC credentials",
                  href: "/credentials",
                },
                {
                  icon: ScanLine,
                  title: "Scan QR Code",
                  desc: "Respond to verification requests",
                  href: "/scan",
                },
                {
                  icon: Plus,
                  title: "Request Credential",
                  desc: "Get a new KYC credential",
                  action: handleRequestCredential,
                },
              ].map((action, i) =>
                action.href ? (
                  <Link
                    key={i}
                    href={action.href}
                    className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gradient-to-r hover:from-blue-500/8 hover:to-emerald-500/8 transition-all group"
                  >
                    <div className="w-11 h-11 flex items-center justify-center bg-white rounded-lg text-blue-600 shadow-sm">
                      <action.icon size={20} />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <span className="text-sm font-semibold text-gray-800">
                        {action.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        {action.desc}
                      </span>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                    />
                  </Link>
                ) : (
                  <button
                    key={i}
                    onClick={action.action}
                    disabled={!isConnected}
                    className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gradient-to-r hover:from-blue-500/8 hover:to-emerald-500/8 transition-all group disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    <div className="w-11 h-11 flex items-center justify-center bg-white rounded-lg text-blue-600 shadow-sm">
                      <action.icon size={20} />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <span className="text-sm font-semibold text-gray-800">
                        {action.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        {action.desc}
                      </span>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                    />
                  </button>
                ),
              )}
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <ShieldCheck size={18} />
                How It Works
              </h3>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-4">
                {[
                  {
                    step: "1",
                    title: "Get Verified",
                    desc: "Complete KYC with a trusted issuer",
                  },
                  {
                    step: "2",
                    title: "Store Credential",
                    desc: "Your encrypted credential is stored locally",
                  },
                  {
                    step: "3",
                    title: "Scan & Share",
                    desc: "Scan a verifier QR code to share proof",
                  },
                  {
                    step: "4",
                    title: "Zero-Knowledge Proof",
                    desc: "Prove your status without revealing data",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full text-white text-sm font-bold flex-shrink-0">
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

          {/* Recent Credentials */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <CreditCard size={18} />
                Recent Credentials
              </h3>
              <Link
                href="/credentials"
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="p-4">
              {!isConnected ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle size={40} className="text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">
                    Connect your wallet to view credentials
                  </p>
                </div>
              ) : credentials.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CreditCard size={40} className="text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500 mb-4">
                    No credentials yet
                  </p>
                  <button
                    onClick={handleRequestCredential}
                    className="inline-flex items-center gap-2 px-4 py-2 btn-primary-gradient rounded-lg text-white text-sm font-semibold"
                  >
                    <Plus size={16} />
                    Request Your First Credential
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {credentials.slice(0, 4).map((credential) => (
                    <div
                      key={credential.id}
                      className="credential-card rounded-xl p-5 text-white relative"
                    >
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <ShieldCheck size={20} />
                            <span className="text-sm font-semibold">
                              KYC Credential
                            </span>
                          </div>
                          {credential.isRevoked ? (
                            <span className="px-2 py-1 bg-red-500/30 rounded text-xs">
                              Revoked
                            </span>
                          ) : credential.expiresAt < Date.now() ? (
                            <span className="px-2 py-1 bg-amber-500/30 rounded text-xs">
                              Expired
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-emerald-500/30 rounded text-xs flex items-center gap-1">
                              <CheckCircle size={12} />
                              Valid
                            </span>
                          )}
                        </div>
                        <div className="mb-3">
                          <span className="text-xs text-white/60 uppercase tracking-wide">
                            Credential ID
                          </span>
                          <p className="font-mono text-lg font-bold">
                            {credential.id}
                          </p>
                        </div>
                        <div className="flex justify-between text-xs text-white/60">
                          <span>
                            Issued: {formatTimestamp(credential.issuedAt)}
                          </span>
                          <span>
                            Expires: {formatTimestamp(credential.expiresAt)}
                          </span>
                        </div>
                      </div>
                    </div>
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

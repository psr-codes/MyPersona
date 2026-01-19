"use client";

import { useState } from "react";
import {
  CreditCard,
  Plus,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  RefreshCw,
  Eye,
  AlertCircle,
} from "lucide-react";
import Header from "@/components/Header";
import { useWallet } from "@/contexts/WalletContext";
import { useCredentials } from "@/hooks/useCredentials";
import { formatTimestamp, formatFullTimestamp } from "@/lib/contracts";
import toast from "react-hot-toast";

export default function CredentialsPage() {
  const { isConnected } = useWallet();
  const {
    credentials,
    isLoading,
    requestCredential,
    removeCredential,
    checkAllRevocations,
  } = useCredentials();

  const [isRequesting, setIsRequesting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);

  const handleRequestCredential = async () => {
    setIsRequesting(true);
    const credential = await requestCredential();
    if (credential) {
      toast.success("New credential received!");
    }
    setIsRequesting(false);
  };

  const handleCheckRevocations = async () => {
    setIsChecking(true);
    await checkAllRevocations();
    toast.success("Revocation status updated!");
    setIsChecking(false);
  };

  const handleRemoveCredential = (id) => {
    if (confirm("Are you sure you want to remove this credential?")) {
      removeCredential(id);
      toast.success("Credential removed");
    }
  };

  const getStatusInfo = (credential) => {
    if (credential.isRevoked) {
      return {
        status: "revoked",
        color: "rose",
        icon: XCircle,
        text: "Revoked",
      };
    }
    if (credential.expiresAt < Date.now()) {
      return {
        status: "expired",
        color: "amber",
        icon: Clock,
        text: "Expired",
      };
    }
    return {
      status: "valid",
      color: "emerald",
      icon: CheckCircle,
      text: "Valid",
    };
  };

  return (
    <div className="min-h-screen">
      <Header title="Credentials" subtitle="Manage your KYC credentials" />

      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Action Banner */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-500/8 to-emerald-500/8 border border-blue-500/15 rounded-xl mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg text-white">
              <CreditCard size={24} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Your Digital Credentials
              </h3>
              <p className="text-sm text-gray-500">
                Securely stored and encrypted locally
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCheckRevocations}
              disabled={!isConnected || isChecking || credentials.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                size={16}
                className={isChecking ? "animate-spin" : ""}
              />
              Check Status
            </button>
            <button
              onClick={handleRequestCredential}
              disabled={!isConnected || isRequesting}
              className="flex items-center gap-2 px-5 py-2 btn-primary-gradient rounded-lg text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRequesting ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Requesting...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Request Credential
                </>
              )}
            </button>
          </div>
        </div>

        {/* Not Connected Banner */}
        {!isConnected && (
          <div className="flex items-center gap-3 px-5 py-4 bg-blue-50 border border-blue-200 rounded-xl mb-6 text-sm text-blue-700">
            <AlertCircle size={20} className="flex-shrink-0" />
            <span>Connect your wallet to view and manage your credentials</span>
          </div>
        )}

        {/* Credentials Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="text-sm text-gray-500">Loading credentials...</p>
          </div>
        ) : credentials.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-16 text-center">
            <CreditCard size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Credentials Yet
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              {isConnected
                ? "Request your first KYC credential to get started with zero-knowledge proof verification."
                : "Connect your wallet and request a credential to get started."}
            </p>
            {isConnected && (
              <button
                onClick={handleRequestCredential}
                disabled={isRequesting}
                className="inline-flex items-center gap-2 px-6 py-3 btn-primary-gradient rounded-lg text-white text-sm font-semibold"
              >
                <Plus size={18} />
                Request Your First Credential
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {credentials.map((credential) => {
              const statusInfo = getStatusInfo(credential);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={credential.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="credential-card p-5 text-white relative">
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={24} />
                          <span className="font-semibold">KYC Credential</span>
                        </div>
                        <span
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                            statusInfo.color === "emerald"
                              ? "bg-emerald-500/30"
                              : statusInfo.color === "amber"
                                ? "bg-amber-500/30"
                                : "bg-rose-500/30"
                          }`}
                        >
                          <StatusIcon size={12} />
                          {statusInfo.text}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-xs text-white/60 uppercase tracking-wide">
                          Credential ID
                        </span>
                        <p className="font-mono text-xl font-bold">
                          {credential.id}
                        </p>
                      </div>
                      <div className="text-xs text-white/60">
                        Nonce: #{credential.nonce}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">
                          Issued
                        </span>
                        <p className="text-sm font-medium text-gray-800">
                          {formatFullTimestamp(credential.issuedAt)}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">
                          Expires
                        </span>
                        <p className="text-sm font-medium text-gray-800">
                          {formatFullTimestamp(credential.expiresAt)}
                        </p>
                      </div>
                    </div>

                    {/* Claims */}
                    <div className="mb-4">
                      <span className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">
                        Verified Claims
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {credential.claims.kycVerified && (
                          <span className="verified-badge px-2 py-1 rounded text-xs font-medium text-emerald-700 flex items-center gap-1">
                            <CheckCircle size={12} />
                            KYC Verified
                          </span>
                        )}
                        {credential.claims.ageAbove18 && (
                          <span className="verified-badge px-2 py-1 rounded text-xs font-medium text-emerald-700 flex items-center gap-1">
                            <CheckCircle size={12} />
                            Age 18+
                          </span>
                        )}
                        {credential.claims.nationality && (
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                            🇮🇳 {credential.claims.nationality}
                          </span>
                        )}
                        {credential.claims.riskLevel && (
                          <span className="px-2 py-1 bg-blue-50 rounded text-xs font-medium text-blue-600">
                            Risk: {credential.claims.riskLevel}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedCredential(credential)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-all"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                      <button
                        onClick={() => handleRemoveCredential(credential.id)}
                        className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 hover:bg-rose-100 hover:text-rose-500 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Credential Detail Modal */}
      {selectedCredential && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
            <div className="credential-card p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={28} />
                  <div>
                    <h3 className="text-lg font-bold">KYC Credential</h3>
                    <p className="text-sm text-white/70">
                      {selectedCredential.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCredential(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-xs text-gray-400 uppercase">Nonce</span>
                  <p className="font-mono text-sm font-medium text-gray-800">
                    #{selectedCredential.nonce}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase">Type</span>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedCredential.type}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase">
                    Issued
                  </span>
                  <p className="text-sm font-medium text-gray-800">
                    {formatFullTimestamp(selectedCredential.issuedAt)}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase">
                    Expires
                  </span>
                  <p className="text-sm font-medium text-gray-800">
                    {formatFullTimestamp(selectedCredential.expiresAt)}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-xs text-gray-400 uppercase mb-2 block">
                  All Claims
                </span>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-xs text-gray-600 font-mono whitespace-pre-wrap">
                    {JSON.stringify(selectedCredential.claims, null, 2)}
                  </pre>
                </div>
              </div>

              <button
                onClick={() => setSelectedCredential(null)}
                className="w-full px-5 py-3 btn-primary-gradient rounded-lg text-white text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  FileKey,
  XCircle,
  CheckCircle,
  Search,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Shield,
  FileX,
} from "lucide-react";
import Header from "@/components/Header";
import { useWallet } from "@/contexts/WalletContext";
import { useRevocationRegistry } from "@/hooks/useContracts";
import { getExplorerUrl } from "@/lib/contracts";
import toast from "react-hot-toast";

export default function CredentialsPage() {
  const { isConnected, formatAddress } = useWallet();
  const {
    events,
    isLoading,
    isTrustedIssuer,
    isPaused,
    revokedCount,
    revokeCredential,
    unRevokeCredential,
    checkIsRevoked,
  } = useRevocationRegistry();

  const [credentialNonce, setCredentialNonce] = useState("");
  const [isRevoking, setIsRevoking] = useState(false);
  const [unrevokeNonce, setUnrevokeNonce] = useState("");
  const [isUnrevoking, setIsUnrevoking] = useState(false);
  const [checkNonce, setCheckNonce] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  const handleRevokeCredential = async (e) => {
    e.preventDefault();
    if (!credentialNonce || isNaN(credentialNonce)) {
      toast.error("Please enter a valid credential nonce (number)");
      return;
    }
    setIsRevoking(true);
    const success = await revokeCredential(credentialNonce);
    if (success) setCredentialNonce("");
    setIsRevoking(false);
  };

  const handleUnrevokeCredential = async (e) => {
    e.preventDefault();
    if (!unrevokeNonce || isNaN(unrevokeNonce)) {
      toast.error("Please enter a valid credential nonce (number)");
      return;
    }
    setIsUnrevoking(true);
    const success = await unRevokeCredential(unrevokeNonce);
    if (success) setUnrevokeNonce("");
    setIsUnrevoking(false);
  };

  const handleCheckCredential = async (e) => {
    e.preventDefault();
    if (!checkNonce || isNaN(checkNonce)) {
      toast.error("Please enter a valid credential nonce (number)");
      return;
    }
    setIsChecking(true);
    const isRevoked = await checkIsRevoked(checkNonce);
    setCheckResult({ nonce: checkNonce, isRevoked });
    setIsChecking(false);
  };

  const canRevoke = isConnected && isTrustedIssuer && !isPaused;

  return (
    <div className="min-h-screen">
      <Header
        title="Credential Management"
        subtitle="Revoke and manage credential status in the zk-KYC network"
      />

      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-5 mb-6">
          <div className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="w-13 h-13 flex items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
              <FileX size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-gray-900">
                {revokedCount}
              </span>
              <span className="text-sm text-gray-500 font-medium">
                Revoked Credentials
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div
              className={`w-13 h-13 flex items-center justify-center rounded-lg ${isTrustedIssuer ? "bg-emerald-500/10 text-emerald-500" : "bg-gray-400/10 text-gray-400"}`}
            >
              <Shield size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-gray-900">
                {isTrustedIssuer ? "Yes" : "No"}
              </span>
              <span className="text-sm text-gray-500 font-medium">
                Trusted Issuer Status
              </span>
            </div>
          </div>
        </div>

        {/* Banners */}
        {!isConnected && (
          <div className="flex items-center gap-3 px-5 py-4 bg-blue-50 border border-blue-200 rounded-xl mb-6 text-sm font-medium text-blue-700">
            <AlertCircle size={20} />
            <span>Connect your wallet to manage credentials</span>
          </div>
        )}
        {isConnected && !isTrustedIssuer && (
          <div className="flex items-start gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-xl mb-6 text-sm text-amber-700">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <strong className="font-semibold">Not a Trusted Issuer</strong>
              <span className="opacity-90">
                Only trusted issuers can revoke or unrevoke credentials. Contact
                the admin to be added as an issuer.
              </span>
            </div>
          </div>
        )}
        {isPaused && (
          <div className="flex items-center gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-xl mb-6 text-sm font-medium text-amber-700">
            <AlertCircle size={20} />
            <span>
              The contract is currently paused. State-changing operations are
              disabled.
            </span>
          </div>
        )}

        {/* Forms Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Revoke Credential */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center px-6 py-5 border-b border-gray-100 bg-gray-50">
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <XCircle size={18} />
                Revoke Credential
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                Mark a credential as invalid. Use this when a user's device is
                stolen, credential is compromised, or KYC needs updating.
              </p>
              <form
                onSubmit={handleRevokeCredential}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Credential Nonce
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 text-sm text-gray-800 bg-white border-2 border-gray-200 rounded-lg transition-all focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter credential ID (e.g., 12345)"
                    value={credentialNonce}
                    onChange={(e) => setCredentialNonce(e.target.value)}
                    disabled={!canRevoke}
                  />
                  <span className="text-xs text-gray-400">
                    The unique identifier assigned when the credential was
                    issued
                  </span>
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-5 py-3 btn-danger-gradient rounded-lg text-white text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={!canRevoke || isRevoking || !credentialNonce}
                >
                  {isRevoking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Revoking...
                    </>
                  ) : (
                    <>
                      <XCircle size={16} />
                      Revoke Credential
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Reinstate Credential */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center px-6 py-5 border-b border-gray-100 bg-gray-50">
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <RotateCcw size={18} />
                Reinstate Credential
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                Restore a previously revoked credential. Use this if the
                revocation was made in error.
              </p>
              <form
                onSubmit={handleUnrevokeCredential}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Credential Nonce
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 text-sm text-gray-800 bg-white border-2 border-gray-200 rounded-lg transition-all focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter revoked credential ID"
                    value={unrevokeNonce}
                    onChange={(e) => setUnrevokeNonce(e.target.value)}
                    disabled={!canRevoke}
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-5 py-3 btn-success-gradient rounded-lg text-white text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={!canRevoke || isUnrevoking || !unrevokeNonce}
                >
                  {isUnrevoking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Reinstating...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Reinstate Credential
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Check Status Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="flex items-center px-6 py-5 border-b border-gray-100 bg-gray-50">
            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
              <Search size={18} />
              Check Credential Status
            </h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              Verify if a credential has been revoked. This is a read-only
              operation that anyone can perform.
            </p>
            <form onSubmit={handleCheckCredential} className="flex gap-3">
              <input
                type="text"
                className="flex-1 px-4 py-3 text-sm text-gray-800 bg-white border-2 border-gray-200 rounded-lg transition-all focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                placeholder="Enter credential nonce to check..."
                value={checkNonce}
                onChange={(e) => setCheckNonce(e.target.value)}
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 btn-secondary-gradient rounded-lg text-white text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                disabled={isChecking || !checkNonce}
              >
                {isChecking ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    Check
                  </>
                )}
              </button>
            </form>

            {checkResult && (
              <div
                className={`flex items-center gap-4 p-5 rounded-xl mt-5 ${checkResult.isRevoked ? "bg-rose-50" : "bg-emerald-50"}`}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0 ${checkResult.isRevoked ? "bg-rose-500/20 text-rose-500" : "bg-emerald-500/20 text-emerald-500"}`}
                >
                  {checkResult.isRevoked ? (
                    <XCircle size={24} />
                  ) : (
                    <CheckCircle size={24} />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <strong
                    className={`text-base font-semibold ${checkResult.isRevoked ? "text-rose-600" : "text-emerald-700"}`}
                  >
                    {checkResult.isRevoked
                      ? "Credential Revoked"
                      : "Credential Valid"}
                  </strong>
                  <span
                    className={`text-sm ${checkResult.isRevoked ? "text-rose-500" : "text-emerald-600"}`}
                  >
                    Credential #{checkResult.nonce}{" "}
                    {checkResult.isRevoked
                      ? "has been revoked and is no longer valid"
                      : "has not been revoked"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Revocation History */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <FileKey size={20} className="text-teal-600" />
              <h3 className="text-base font-semibold text-gray-800">
                Revocation History
              </h3>
              <span className="flex items-center justify-center min-w-6 h-6 px-2 bg-teal-500 rounded-full text-xs font-semibold text-white">
                {events.length}
              </span>
            </div>
          </div>

          <div>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-10 h-10 border-3 border-gray-200 border-t-teal-500 rounded-full animate-spin mb-4" />
                <p className="text-sm text-gray-500">Loading history...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileKey size={48} className="text-gray-300 mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  No Revocation History
                </h4>
                <p className="text-sm text-gray-500">
                  No credentials have been revoked or reinstated yet
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {events.map((event, index) => (
                  <a
                    key={`${event.transactionHash}-${index}`}
                    href={getExplorerUrl(event.transactionHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group last:border-b-0"
                  >
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 ${event.type === "CredentialRevoked" ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-500"}`}
                    >
                      {event.type === "CredentialRevoked" ? (
                        <XCircle size={18} />
                      ) : (
                        <CheckCircle size={18} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-800 mb-1">
                        {event.type === "CredentialRevoked"
                          ? "Credential Revoked"
                          : "Credential Reinstated"}
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span className="font-mono font-medium">
                          Nonce: #{event.args.credentialNonce}
                        </span>
                        <span>
                          By: {formatAddress(event.args.issuerAddress)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>Block #{event.blockNumber}</span>
                      <ExternalLink
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

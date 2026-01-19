"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  FileX,
  ExternalLink,
  Clock,
} from "lucide-react";
import Header from "@/components/Header";
import { useVerification } from "@/hooks/useVerification";
import { getExplorerUrl, getAddressExplorerUrl } from "@/lib/contracts";
import { ethers } from "ethers";
import toast from "react-hot-toast";

export default function StatusPage() {
  const { checkRevocationStatus, verifyIssuer, getRecentRevocations } =
    useVerification();

  const [credentialNonce, setCredentialNonce] = useState("");
  const [isCheckingCredential, setIsCheckingCredential] = useState(false);
  const [credentialResult, setCredentialResult] = useState(null);

  const [issuerAddress, setIssuerAddress] = useState("");
  const [isCheckingIssuer, setIsCheckingIssuer] = useState(false);
  const [issuerResult, setIssuerResult] = useState(null);

  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  const handleCheckCredential = async (e) => {
    e.preventDefault();
    if (!credentialNonce || isNaN(credentialNonce)) {
      toast.error("Please enter a valid credential nonce (number)");
      return;
    }

    setIsCheckingCredential(true);
    const result = await checkRevocationStatus(credentialNonce);
    setCredentialResult(result);
    setIsCheckingCredential(false);
  };

  const handleCheckIssuer = async (e) => {
    e.preventDefault();
    if (!ethers.isAddress(issuerAddress)) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }

    setIsCheckingIssuer(true);
    const result = await verifyIssuer(issuerAddress);
    setIssuerResult(result);
    setIsCheckingIssuer(false);
  };

  const loadRecentActivity = async () => {
    setLoadingActivity(true);
    const activity = await getRecentRevocations(20);
    setRecentActivity(activity);
    setLoadingActivity(false);
  };

  const formatAddress = (address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="min-h-screen">
      <Header
        title="Check Status"
        subtitle="Verify credentials and issuer trust status on-chain"
      />

      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Info Banner */}
        <div className="flex items-center gap-3 px-5 py-4 bg-violet-50 border border-violet-200 rounded-xl mb-6 text-sm text-violet-700">
          <AlertCircle size={20} className="flex-shrink-0" />
          <span>
            These checks are performed directly on the Polygon Amoy blockchain.
            No wallet connection required.
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Check Credential Revocation */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center px-6 py-5 border-b border-gray-100 bg-gray-50">
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <FileX size={18} />
                Check Credential Revocation
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                Verify if a credential has been revoked by its issuer. Enter the
                credential nonce (unique ID) to check.
              </p>
              <form
                onSubmit={handleCheckCredential}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Credential Nonce
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 text-sm text-gray-800 bg-white border-2 border-gray-200 rounded-lg transition-all focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                    placeholder="Enter credential ID (e.g., 12345)"
                    value={credentialNonce}
                    onChange={(e) => setCredentialNonce(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-5 py-3 btn-primary-gradient rounded-lg text-white text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isCheckingCredential || !credentialNonce}
                >
                  {isCheckingCredential ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      Check Status
                    </>
                  )}
                </button>
              </form>

              {credentialResult && (
                <div
                  className={`flex items-center gap-4 p-5 rounded-xl mt-5 ${credentialResult.isRevoked ? "status-failed" : "status-verified"}`}
                >
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0 ${credentialResult.isRevoked ? "bg-rose-500/20 text-rose-500" : "bg-emerald-500/20 text-emerald-500"}`}
                  >
                    {credentialResult.isRevoked ? (
                      <XCircle size={24} />
                    ) : (
                      <CheckCircle size={24} />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <strong
                      className={`text-base font-semibold ${credentialResult.isRevoked ? "text-rose-600" : "text-emerald-700"}`}
                    >
                      {credentialResult.isRevoked
                        ? "Credential Revoked"
                        : "Credential Valid"}
                    </strong>
                    <span
                      className={`text-sm ${credentialResult.isRevoked ? "text-rose-500" : "text-emerald-600"}`}
                    >
                      Credential #{credentialResult.nonce}{" "}
                      {credentialResult.isRevoked
                        ? "has been revoked"
                        : "is not revoked"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Verify Issuer */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center px-6 py-5 border-b border-gray-100 bg-gray-50">
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <Users size={18} />
                Verify Trusted Issuer
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                Check if an address is registered as a trusted issuer in the
                MyPersona network.
              </p>
              <form
                onSubmit={handleCheckIssuer}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Issuer Address
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 font-mono text-sm text-gray-800 bg-white border-2 border-gray-200 rounded-lg transition-all focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                    placeholder="0x..."
                    value={issuerAddress}
                    onChange={(e) => setIssuerAddress(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-5 py-3 btn-secondary-gradient rounded-lg text-white text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isCheckingIssuer || !issuerAddress}
                >
                  {isCheckingIssuer ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      Verify Issuer
                    </>
                  )}
                </button>
              </form>

              {issuerResult && (
                <div
                  className={`flex items-center gap-4 p-5 rounded-xl mt-5 ${issuerResult.isTrusted ? "status-verified" : "status-failed"}`}
                >
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0 ${issuerResult.isTrusted ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500"}`}
                  >
                    {issuerResult.isTrusted ? (
                      <ShieldCheck size={24} />
                    ) : (
                      <XCircle size={24} />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <strong
                      className={`text-base font-semibold ${issuerResult.isTrusted ? "text-emerald-700" : "text-rose-600"}`}
                    >
                      {issuerResult.isTrusted
                        ? "Trusted Issuer"
                        : "Not a Trusted Issuer"}
                    </strong>
                    <a
                      href={getAddressExplorerUrl(issuerResult.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm inline-flex items-center gap-1 ${issuerResult.isTrusted ? "text-emerald-600 hover:text-emerald-700" : "text-rose-500 hover:text-rose-600"}`}
                    >
                      {formatAddress(issuerResult.address)}
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Revocation Activity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-violet-600" />
              <h3 className="text-base font-semibold text-gray-800">
                Recent Revocation Activity
              </h3>
            </div>
            <button
              onClick={loadRecentActivity}
              disabled={loadingActivity}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-violet-500 hover:text-violet-600 transition-all disabled:opacity-60"
            >
              {loadingActivity ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-violet-500 rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Load Activity
                </>
              )}
            </button>
          </div>

          <div>
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Clock size={48} className="text-gray-300 mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  No Activity Loaded
                </h4>
                <p className="text-sm text-gray-500">
                  Click "Load Activity" to fetch recent revocation events
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {recentActivity.map((event, index) => (
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
                          Nonce: #{event.credentialNonce}
                        </span>
                        <span>By: {formatAddress(event.issuerAddress)}</span>
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

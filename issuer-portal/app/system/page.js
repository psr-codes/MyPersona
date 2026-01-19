"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Pause,
  Play,
  ExternalLink,
  Copy,
  Activity,
  Lock,
  Unlock,
  AlertCircle,
  Server,
  Shield,
} from "lucide-react";
import Header from "@/components/Header";
import { useWallet } from "@/contexts/WalletContext";
import { useIssuerRegistry, useRevocationRegistry } from "@/hooks/useContracts";
import { getAddressExplorerUrl, CONTRACT_ADDRESSES } from "@/lib/contracts";
import toast from "react-hot-toast";

export default function SystemPage() {
  const { isConnected, formatAddress, account } = useWallet();
  const issuerRegistry = useIssuerRegistry();
  const revocationRegistry = useRevocationRegistry();

  const [isPausingIssuer, setIsPausingIssuer] = useState(false);
  const [isUnpausingIssuer, setIsUnpausingIssuer] = useState(false);
  const [isPausingRevocation, setIsPausingRevocation] = useState(false);
  const [isUnpausingRevocation, setIsUnpausingRevocation] = useState(false);

  const handlePauseIssuerRegistry = async () => {
    setIsPausingIssuer(true);
    await issuerRegistry.pause();
    setIsPausingIssuer(false);
  };

  const handleUnpauseIssuerRegistry = async () => {
    setIsUnpausingIssuer(true);
    await issuerRegistry.unpause();
    setIsUnpausingIssuer(false);
  };

  const handlePauseRevocationRegistry = async () => {
    setIsPausingRevocation(true);
    await revocationRegistry.pause();
    setIsPausingRevocation(false);
  };

  const handleUnpauseRevocationRegistry = async () => {
    setIsUnpausingRevocation(true);
    await revocationRegistry.unpause();
    setIsUnpausingRevocation(false);
  };

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  const isOwner = issuerRegistry.isOwner || revocationRegistry.isOwner;

  return (
    <div className="min-h-screen">
      <Header
        title="System Controls"
        subtitle="Emergency controls and system configuration"
      />

      <div className="p-8 max-w-[1200px] mx-auto">
        {/* Banners */}
        {!isConnected && (
          <div className="flex items-center gap-3 px-5 py-4 bg-blue-50 border border-blue-200 rounded-xl mb-6 text-sm font-medium text-blue-700">
            <AlertCircle size={20} />
            <span>Connect your wallet to access system controls</span>
          </div>
        )}
        {isConnected && !isOwner && (
          <div className="flex items-start gap-3 px-5 py-4 bg-gradient-to-r from-amber-50 to-red-50 border border-amber-200 rounded-xl mb-6 text-sm text-amber-700">
            <AlertTriangle
              size={20}
              className="flex-shrink-0 mt-0.5 text-amber-500"
            />
            <div className="flex flex-col gap-1">
              <strong className="font-semibold text-amber-800">
                Owner Access Required
              </strong>
              <span className="opacity-90">
                Only the contract owner can pause or unpause the system. You are
                connected as: {formatAddress(account)}
              </span>
            </div>
          </div>
        )}

        {/* Emergency Controls Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle size={20} className="text-teal-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Emergency Controls
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-6 max-w-[700px] leading-relaxed">
            Use these controls to pause or unpause contract functionality in
            case of security threats or system maintenance. When paused,
            state-changing operations are disabled while read operations remain
            functional.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {/* Issuer Registry Controls */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="w-13 h-13 flex items-center justify-center bg-gradient-to-br from-teal-500/10 to-indigo-500/10 rounded-xl text-teal-600">
                  <Server size={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Issuer Registry
                  </h3>
                  <a
                    href={getAddressExplorerUrl(
                      CONTRACT_ADDRESSES.ISSUER_REGISTRY,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs text-gray-500 hover:text-teal-600 transition-colors"
                  >
                    {formatAddress(CONTRACT_ADDRESSES.ISSUER_REGISTRY)}
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="flex justify-center py-4">
                <div
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold ${issuerRegistry.isPaused ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}
                >
                  {issuerRegistry.isPaused ? (
                    <Lock size={16} />
                  ) : (
                    <Unlock size={16} />
                  )}
                  <span>{issuerRegistry.isPaused ? "Paused" : "Active"}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Owner</span>
                  <span className="font-medium text-gray-800 font-mono">
                    {issuerRegistry.owner
                      ? formatAddress(issuerRegistry.owner)
                      : "..."}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Issuers</span>
                  <span className="font-medium text-gray-800">
                    {issuerRegistry.trustedIssuers.length}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {issuerRegistry.isPaused ? (
                  <button
                    className="flex items-center justify-center gap-2 p-4 btn-success-gradient rounded-lg text-white text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={handleUnpauseIssuerRegistry}
                    disabled={
                      !isConnected ||
                      !issuerRegistry.isOwner ||
                      isUnpausingIssuer
                    }
                  >
                    {isUnpausingIssuer ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Unpausing...
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        Unpause Contract
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    className="flex items-center justify-center gap-2 p-4 btn-warning-gradient rounded-lg text-white text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={handlePauseIssuerRegistry}
                    disabled={
                      !isConnected || !issuerRegistry.isOwner || isPausingIssuer
                    }
                  >
                    {isPausingIssuer ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Pausing...
                      </>
                    ) : (
                      <>
                        <Pause size={16} />
                        Pause Contract
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Revocation Registry Controls */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="w-13 h-13 flex items-center justify-center bg-gradient-to-br from-teal-500/10 to-indigo-500/10 rounded-xl text-teal-600">
                  <Shield size={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Revocation Registry
                  </h3>
                  <a
                    href={getAddressExplorerUrl(
                      CONTRACT_ADDRESSES.REVOCATION_REGISTRY,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs text-gray-500 hover:text-teal-600 transition-colors"
                  >
                    {formatAddress(CONTRACT_ADDRESSES.REVOCATION_REGISTRY)}
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="flex justify-center py-4">
                <div
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold ${revocationRegistry.isPaused ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}
                >
                  {revocationRegistry.isPaused ? (
                    <Lock size={16} />
                  ) : (
                    <Unlock size={16} />
                  )}
                  <span>
                    {revocationRegistry.isPaused ? "Paused" : "Active"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Owner</span>
                  <span className="font-medium text-gray-800 font-mono">
                    {revocationRegistry.owner
                      ? formatAddress(revocationRegistry.owner)
                      : "..."}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Revoked Credentials</span>
                  <span className="font-medium text-gray-800">
                    {revocationRegistry.revokedCount}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {revocationRegistry.isPaused ? (
                  <button
                    className="flex items-center justify-center gap-2 p-4 btn-success-gradient rounded-lg text-white text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={handleUnpauseRevocationRegistry}
                    disabled={
                      !isConnected ||
                      !revocationRegistry.isOwner ||
                      isUnpausingRevocation
                    }
                  >
                    {isUnpausingRevocation ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Unpausing...
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        Unpause Contract
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    className="flex items-center justify-center gap-2 p-4 btn-warning-gradient rounded-lg text-white text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={handlePauseRevocationRegistry}
                    disabled={
                      !isConnected ||
                      !revocationRegistry.isOwner ||
                      isPausingRevocation
                    }
                  >
                    {isPausingRevocation ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Pausing...
                      </>
                    ) : (
                      <>
                        <Pause size={16} />
                        Pause Contract
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contract Addresses Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Activity size={20} className="text-teal-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Contract Addresses
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-6 max-w-[700px] leading-relaxed">
            Deployed contract addresses on the Polygon Amoy Testnet. These are
            immutable and cannot be changed.
          </p>

          <div className="flex flex-col gap-4">
            {[
              {
                icon: Server,
                label: "Issuer Registry",
                address: CONTRACT_ADDRESSES.ISSUER_REGISTRY,
              },
              {
                icon: Shield,
                label: "Revocation Registry",
                address: CONTRACT_ADDRESSES.REVOCATION_REGISTRY,
              },
            ].map((contract, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-3"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <contract.icon size={16} className="text-teal-600" />
                  <span>{contract.label}</span>
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <code className="font-mono text-sm text-gray-800 break-all">
                    {contract.address}
                  </code>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-500 hover:border-teal-500 hover:text-teal-600 transition-all cursor-pointer"
                      onClick={() => copyAddress(contract.address)}
                      title="Copy Address"
                    >
                      <Copy size={14} />
                    </button>
                    <a
                      href={getAddressExplorerUrl(contract.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-500 hover:border-teal-500 hover:text-teal-600 transition-all"
                      title="View on Explorer"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Info */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Activity size={20} className="text-teal-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Network Information
            </h2>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 network-badge rounded-full text-sm font-semibold text-purple-600 mb-5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-glow" />
              <span>Polygon Amoy Testnet</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Chain ID", value: "80002", mono: true },
                { label: "Currency", value: "MATIC" },
                {
                  label: "RPC URL",
                  value: "https://rpc-amoy.polygon.technology",
                  mono: true,
                },
                {
                  label: "Block Explorer",
                  value: "amoy.polygonscan.com",
                  link: "https://amoy.polygonscan.com",
                },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {item.label}
                  </span>
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700"
                    >
                      {item.value}
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <code
                      className={`text-sm text-gray-800 ${item.mono ? "font-mono" : ""}`}
                    >
                      {item.value}
                    </code>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

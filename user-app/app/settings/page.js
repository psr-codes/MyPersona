"use client";

import {
  Settings as SettingsIcon,
  Wallet,
  Shield,
  Globe,
  Server,
  ExternalLink,
  Copy,
  Fingerprint,
  Lock,
  Eye,
} from "lucide-react";
import Header from "@/components/Header";
import { useWallet } from "@/contexts/WalletContext";
import { CONTRACT_ADDRESSES, getAddressExplorerUrl } from "@/lib/contracts";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { account, isConnected, formatAddress } = useWallet();

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  return (
    <div className="min-h-screen">
      <Header title="Settings" subtitle="Configure your wallet preferences" />

      <div className="p-8 max-w-[1200px] mx-auto">
        {/* About Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Wallet size={20} className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              About MyPersona Wallet
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-6 max-w-[700px] leading-relaxed">
            Your secure digital wallet for managing zk-KYC credentials. Store
            your credentials locally, generate zero-knowledge proofs, and share
            verified identity attributes without revealing personal data.
          </p>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-500/10 rounded-xl text-blue-600">
                  <Lock size={24} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    Local Storage
                  </h3>
                  <p className="text-sm text-gray-500">
                    Your credentials are encrypted and stored locally on your
                    device
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-emerald-500/10 rounded-xl text-emerald-600">
                  <Fingerprint size={24} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    Zero-Knowledge Proofs
                  </h3>
                  <p className="text-sm text-gray-500">
                    Prove your identity without revealing sensitive information
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-violet-500/10 rounded-xl text-violet-600">
                  <Eye size={24} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    Privacy First
                  </h3>
                  <p className="text-sm text-gray-500">
                    You control what data to share; verifiers see only what you
                    allow
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-amber-500/10 rounded-xl text-amber-600">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    Blockchain Verified
                  </h3>
                  <p className="text-sm text-gray-500">
                    Issuer trust and revocation checked on Polygon blockchain
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Info */}
        {isConnected && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Wallet size={20} className="text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Your Wallet</h2>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    Connected Address
                  </span>
                  <code className="font-mono text-sm text-gray-800 block">
                    {account}
                  </code>
                </div>
                <div className="flex gap-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-all cursor-pointer"
                    onClick={() => copyAddress(account)}
                    title="Copy Address"
                  >
                    <Copy size={14} />
                  </button>
                  <a
                    href={getAddressExplorerUrl(account)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-all"
                    title="View on Explorer"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contract Addresses */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Server size={20} className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Smart Contract Addresses
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-6 max-w-[700px] leading-relaxed">
            These contracts on Polygon Amoy Testnet are used for issuer
            verification and revocation checking.
          </p>

          <div className="flex flex-col gap-4">
            {[
              {
                icon: Server,
                label: "Issuer Registry",
                address: CONTRACT_ADDRESSES.ISSUER_REGISTRY,
                desc: "Trusted issuer addresses",
              },
              {
                icon: Shield,
                label: "Revocation Registry",
                address: CONTRACT_ADDRESSES.REVOCATION_REGISTRY,
                desc: "Revoked credential tracking",
              },
            ].map((contract, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <contract.icon size={16} className="text-blue-600" />
                    <span>{contract.label}</span>
                  </div>
                  <span className="text-xs text-gray-400">{contract.desc}</span>
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <code className="font-mono text-sm text-gray-800 break-all">
                    {contract.address}
                  </code>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-all cursor-pointer"
                      onClick={() => copyAddress(contract.address)}
                      title="Copy Address"
                    >
                      <Copy size={14} />
                    </button>
                    <a
                      href={getAddressExplorerUrl(contract.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-all"
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
            <Globe size={20} className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Network Information
            </h2>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 network-badge rounded-full text-sm font-semibold text-blue-600 mb-5">
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
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
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

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Built for{" "}
            <strong className="text-blue-600">RBI HaRBInger 2025</strong>{" "}
            Hackathon
          </p>
          <p className="text-xs text-gray-400 mt-2">
            MyPersona zk-KYC System • Digital Wallet
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  ExternalLink,
  Copy,
  AlertCircle,
  Shield,
} from "lucide-react";
import Header from "@/components/Header";
import { useWallet } from "@/contexts/WalletContext";
import { useIssuerRegistry } from "@/hooks/useContracts";
import { getAddressExplorerUrl } from "@/lib/contracts";
import { ethers } from "ethers";
import toast from "react-hot-toast";

export default function IssuersPage() {
  const { isConnected, formatAddress } = useWallet();
  const {
    trustedIssuers,
    isLoading,
    isOwner,
    isPaused,
    addIssuer,
    removeIssuer,
    checkIsTrusted,
  } = useIssuerRegistry();

  const [newIssuerAddress, setNewIssuerAddress] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [removingAddress, setRemovingAddress] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkAddress, setCheckAddress] = useState("");
  const [checkResult, setCheckResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleAddIssuer = async (e) => {
    e.preventDefault();
    if (!ethers.isAddress(newIssuerAddress)) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }
    setIsAdding(true);
    const success = await addIssuer(newIssuerAddress);
    if (success) setNewIssuerAddress("");
    setIsAdding(false);
  };

  const handleRemoveIssuer = async (address) => {
    setRemovingAddress(address);
    await removeIssuer(address);
    setRemovingAddress(null);
  };

  const handleCheckIssuer = async (e) => {
    e.preventDefault();
    if (!ethers.isAddress(checkAddress)) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }
    setIsChecking(true);
    const isTrusted = await checkIsTrusted(checkAddress);
    setCheckResult({ address: checkAddress, isTrusted });
    setIsChecking(false);
  };

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  const filteredIssuers = trustedIssuers.filter((issuer) =>
    issuer.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen">
      <Header
        title="Issuer Management"
        subtitle="Manage trusted authorities in the zk-KYC network"
      />

      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Banners */}
        {!isConnected && (
          <div className="flex items-center gap-3 px-5 py-4 bg-blue-50 border border-blue-200 rounded-xl mb-6 text-sm font-medium text-blue-700">
            <AlertCircle size={20} />
            <span>Connect your wallet to manage issuers</span>
          </div>
        )}
        {isConnected && !isOwner && (
          <div className="flex items-center gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-xl mb-6 text-sm font-medium text-amber-700">
            <AlertCircle size={20} />
            <span>
              You are not the contract owner. You cannot add or remove issuers.
            </span>
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
          {/* Add Issuer */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center px-6 py-5 border-b border-gray-100 bg-gray-50">
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <Plus size={18} />
                Add New Issuer
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                Register a new trusted authority (e.g., bank, CKYCR node) that
                can issue and revoke credentials.
              </p>
              <form onSubmit={handleAddIssuer} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Issuer Address
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 font-mono text-sm text-gray-800 bg-white border-2 border-gray-200 rounded-lg transition-all focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="0x..."
                    value={newIssuerAddress}
                    onChange={(e) => setNewIssuerAddress(e.target.value)}
                    disabled={!isOwner || isPaused}
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-5 py-3 btn-primary-gradient rounded-lg text-white text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={
                    !isConnected ||
                    !isOwner ||
                    isPaused ||
                    isAdding ||
                    !newIssuerAddress
                  }
                >
                  {isAdding ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Add Issuer
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Check Issuer */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center px-6 py-5 border-b border-gray-100 bg-gray-50">
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <Search size={18} />
                Verify Issuer Status
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                Check if an address is registered as a trusted issuer in the
                network.
              </p>
              <form
                onSubmit={handleCheckIssuer}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Address to Check
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 font-mono text-sm text-gray-800 bg-white border-2 border-gray-200 rounded-lg transition-all focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="0x..."
                    value={checkAddress}
                    onChange={(e) => setCheckAddress(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-5 py-3 btn-secondary-gradient rounded-lg text-white text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isChecking || !checkAddress}
                >
                  {isChecking ? (
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

              {checkResult && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg mt-4 ${checkResult.isTrusted ? "bg-emerald-50" : "bg-rose-50"}`}
                >
                  {checkResult.isTrusted ? (
                    <>
                      <CheckCircle size={20} className="text-emerald-600" />
                      <div className="flex flex-col gap-1">
                        <strong className="text-sm font-semibold text-emerald-700">
                          Trusted Issuer
                        </strong>
                        <span className="text-xs font-mono text-emerald-600/80">
                          {formatAddress(checkResult.address)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle size={20} className="text-rose-500" />
                      <div className="flex flex-col gap-1">
                        <strong className="text-sm font-semibold text-rose-600">
                          Not a Trusted Issuer
                        </strong>
                        <span className="text-xs font-mono text-rose-500/80">
                          {formatAddress(checkResult.address)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Issuers List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <Users size={20} className="text-teal-600" />
              <h3 className="text-base font-semibold text-gray-800">
                Trusted Issuers
              </h3>
              <span className="flex items-center justify-center min-w-6 h-6 px-2 bg-teal-500 rounded-full text-xs font-semibold text-white">
                {trustedIssuers.length}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg min-w-[280px]">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                className="flex-1 border-none bg-transparent text-sm text-gray-800 outline-none"
                placeholder="Search by address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-10 h-10 border-3 border-gray-200 border-t-teal-500 rounded-full animate-spin mb-4" />
                <p className="text-sm text-gray-500">Loading issuers...</p>
              </div>
            ) : filteredIssuers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Shield size={48} className="text-gray-300 mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  No Issuers Found
                </h4>
                <p className="text-sm text-gray-500">
                  {searchQuery
                    ? "No issuers match your search query"
                    : "No trusted issuers have been registered yet"}
                </p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <span>Address</span>
                  <span>Status</span>
                  <span>Block Added</span>
                  <span>Actions</span>
                </div>
                {filteredIssuers.map((issuer) => (
                  <div
                    key={issuer.address}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-teal-500 to-indigo-600 rounded-full text-white text-sm font-semibold flex-shrink-0">
                        {issuer.address.slice(2, 4).toUpperCase()}
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="font-mono text-sm font-medium text-gray-800 truncate hidden sm:block">
                          {issuer.address}
                        </span>
                        <span className="font-mono text-sm font-medium text-gray-800 sm:hidden">
                          {formatAddress(issuer.address)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 rounded-full text-xs font-semibold text-emerald-700 w-fit">
                        <CheckCircle size={14} />
                        Active
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      #{issuer.addedAt || "N/A"}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all cursor-pointer"
                        onClick={() => copyAddress(issuer.address)}
                        title="Copy Address"
                      >
                        <Copy size={16} />
                      </button>
                      <a
                        href={getAddressExplorerUrl(issuer.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all"
                        title="View on Explorer"
                      >
                        <ExternalLink size={16} />
                      </a>
                      {isOwner && !isPaused && (
                        <button
                          className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 hover:bg-rose-100 hover:text-rose-500 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                          onClick={() => handleRemoveIssuer(issuer.address)}
                          disabled={removingAddress === issuer.address}
                          title="Remove Issuer"
                        >
                          {removingAddress === issuer.address ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-rose-500 rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

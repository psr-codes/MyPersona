"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { useAdmin } from "@/hooks/useAdmin";
import { useWallet } from "@/contexts/WalletContext";
import {
  Building2,
  Trash2,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { getAddressExplorerUrl } from "@/lib/contracts";
import toast from "react-hot-toast";
import { ethers } from "ethers";

export default function IssuersPage() {
  const { isConnected } = useWallet();
  const { issuers, isLoading, addIssuer, removeIssuer, isOwner } = useAdmin();
  const [newIssuerAddress, setNewIssuerAddress] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddIssuer = async (e) => {
    e.preventDefault();
    if (!ethers.isAddress(newIssuerAddress)) {
      toast.error("Invalid Ethereum address");
      return;
    }

    setIsAdding(true);
    const success = await addIssuer(newIssuerAddress);
    if (success) {
      setNewIssuerAddress("");
    }
    setIsAdding(false);
  };

  const handleRemoveIssuer = async (address) => {
    if (
      confirm(
        `Are you sure you want to revoke trust for issuer ${address}? This cannot be undone easily.`,
      )
    ) {
      await removeIssuer(address);
    }
  };

  const filteredIssuers = issuers.filter((issuer) =>
    issuer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen">
      <Header title="Manage Issuers" subtitle="Authorize Trusted Entities" />

      <div className="p-8 max-w-[1200px] mx-auto">
        {/* Add Issuer Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Plus size={18} className="text-amber-600" />
              Add Trusted Issuer
            </h3>
            {!isOwner && isConnected && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-200">
                View Only
              </span>
            )}
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-600 mb-4">
              Authorize a new entity (e.g., Bank, Government Body) to issue
              verifiable credentials.
            </p>
            <form onSubmit={handleAddIssuer} className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="0x..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono text-sm"
                  value={newIssuerAddress}
                  onChange={(e) => setNewIssuerAddress(e.target.value)}
                  disabled={!isOwner || isAdding}
                />
              </div>
              <button
                type="submit"
                disabled={!isOwner || isAdding || !newIssuerAddress}
                className="px-6 py-3 btn-gold-gradient text-white font-bold rounded-lg shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {isAdding ? "Adding..." : "Authorize Issuer"}
              </button>
            </form>
          </div>
        </div>

        {/* Issuers List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Building2 size={18} className="text-slate-600" />
              Trusted Issuers ({filteredIssuers.length})
            </h3>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search address..."
                className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-amber-500 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-500">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-2" />
              Loading registry data...
            </div>
          ) : filteredIssuers.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <ShieldCheck size={48} className="mx-auto text-slate-300 mb-3" />
              <p>No authorized issuers found in the registry.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredIssuers.map((issuer, i) => (
                <div
                  key={issuer}
                  className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-medium text-slate-900">
                          {issuer}
                        </span>
                        <a
                          href={getAddressExplorerUrl(issuer)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-blue-500 transition-colors"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <ShieldCheck size={10} />
                        Authorized
                      </span>
                    </div>
                  </div>

                  {isOwner && (
                    <button
                      onClick={() => handleRemoveIssuer(issuer)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Revoke Authorization"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

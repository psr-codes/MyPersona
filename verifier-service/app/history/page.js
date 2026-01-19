"use client";

import { useState } from "react";
import {
  History as HistoryIcon,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Search,
  Filter,
  Calendar,
  ScanLine,
} from "lucide-react";
import Header from "@/components/Header";
import { useVerificationRequests } from "@/hooks/useVerification";
import { formatTimestamp } from "@/lib/contracts";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const { requests, deleteRequest, clearAllRequests } =
    useVerificationRequests();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = req.id
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all verification history?")) {
      clearAllRequests();
      toast.success("History cleared");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 rounded-full text-xs font-semibold text-emerald-700">
            <CheckCircle size={12} />
            Verified
          </span>
        );
      case "failed":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-rose-50 rounded-full text-xs font-semibold text-rose-600">
            <XCircle size={12} />
            Failed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-amber-50 rounded-full text-xs font-semibold text-amber-600">
            <Clock size={12} />
            Pending
          </span>
        );
    }
  };

  const stats = {
    total: requests.length,
    verified: requests.filter((r) => r.status === "verified").length,
    pending: requests.filter((r) => r.status === "pending").length,
    failed: requests.filter((r) => r.status === "failed").length,
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Verification History"
        subtitle="Track all your verification requests"
      />

      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          {[
            {
              label: "Total Requests",
              value: stats.total,
              bg: "bg-violet-500/10",
              color: "text-violet-600",
              icon: ScanLine,
            },
            {
              label: "Verified",
              value: stats.verified,
              bg: "bg-emerald-500/10",
              color: "text-emerald-600",
              icon: CheckCircle,
            },
            {
              label: "Pending",
              value: stats.pending,
              bg: "bg-amber-500/10",
              color: "text-amber-600",
              icon: Clock,
            },
            {
              label: "Failed",
              value: stats.failed,
              bg: "bg-rose-500/10",
              color: "text-rose-500",
              icon: XCircle,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}
              >
                <stat.icon size={22} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </span>
                <span className="text-sm text-gray-500 font-medium">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg min-w-[280px]">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  className="flex-1 border-none bg-transparent text-sm text-gray-800 outline-none"
                  placeholder="Search by request ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-violet-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {requests.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            )}
          </div>

          {/* Table */}
          {filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <HistoryIcon size={48} className="text-gray-300 mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                No Verification History
              </h4>
              <p className="text-sm text-gray-500">
                {searchQuery || statusFilter !== "all"
                  ? "No requests match your filters"
                  : "Your verification requests will appear here"}
              </p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <span>Request ID</span>
                <span>Status</span>
                <span>Requirements</span>
                <span>Created</span>
                <span>Actions</span>
              </div>

              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-violet-500 to-teal-500 rounded-full text-white">
                      <ScanLine size={18} />
                    </div>
                    <span className="font-mono text-sm font-medium text-gray-800">
                      {request.id}
                    </span>
                  </div>

                  <div>{getStatusBadge(request.status)}</div>

                  <div className="flex flex-wrap gap-1">
                    {request.requirements.kycVerified && (
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                        KYC
                      </span>
                    )}
                    {request.requirements.ageAbove18 && (
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                        18+
                      </span>
                    )}
                    {request.requirements.notRevoked && (
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                        Valid
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>{formatTimestamp(request.createdAt)}</span>
                  </div>

                  <div>
                    <button
                      onClick={() => deleteRequest(request.id)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-gray-500 hover:bg-rose-100 hover:text-rose-500 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

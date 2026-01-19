"use client";

import { useState, useEffect } from "react";
import {
  History,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  ExternalLink,
  ScanLine,
  ShieldCheck,
} from "lucide-react";
import Header from "@/components/Header";
import { useWallet } from "@/contexts/WalletContext";
import { formatFullTimestamp } from "@/lib/contracts";

export default function ActivityPage() {
  const { isConnected } = useWallet();
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Load activities from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mypersona_activity");
      if (saved) {
        setActivities(JSON.parse(saved));
      } else {
        // Add some mock activities for demo
        const mockActivities = [
          {
            id: "activity-1",
            type: "credential_requested",
            timestamp: Date.now() - 86400000 * 2,
            details: { credentialId: "VC-123456" },
          },
          {
            id: "activity-2",
            type: "verification_completed",
            timestamp: Date.now() - 86400000,
            details: { verifier: "MyPersona Verifier", requestId: "VR-789" },
          },
          {
            id: "activity-3",
            type: "credential_checked",
            timestamp: Date.now() - 3600000,
            details: { credentialId: "VC-123456", status: "valid" },
          },
        ];
        setActivities(mockActivities);
      }
    }
  }, []);

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.details?.credentialId
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      activity.details?.verifier
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || activity.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getActivityIcon = (type) => {
    switch (type) {
      case "credential_requested":
        return <ShieldCheck size={18} className="text-blue-500" />;
      case "verification_completed":
        return <CheckCircle size={18} className="text-emerald-500" />;
      case "verification_failed":
        return <XCircle size={18} className="text-rose-500" />;
      case "credential_checked":
        return <ScanLine size={18} className="text-violet-500" />;
      default:
        return <Clock size={18} className="text-gray-500" />;
    }
  };

  const getActivityTitle = (type) => {
    switch (type) {
      case "credential_requested":
        return "Credential Requested";
      case "verification_completed":
        return "Verification Completed";
      case "verification_failed":
        return "Verification Failed";
      case "credential_checked":
        return "Revocation Checked";
      default:
        return "Activity";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "credential_requested":
        return "bg-blue-50";
      case "verification_completed":
        return "bg-emerald-50";
      case "verification_failed":
        return "bg-rose-50";
      case "credential_checked":
        return "bg-violet-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Activity"
        subtitle="View your credential and verification history"
      />

      <div className="p-8 max-w-[1200px] mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-5 mb-6">
          {[
            {
              label: "Total Activities",
              value: activities.length,
              icon: History,
              color: "text-blue-600",
              bg: "bg-blue-500/10",
            },
            {
              label: "Verifications",
              value: activities.filter((a) => a.type.includes("verification"))
                .length,
              icon: CheckCircle,
              color: "text-emerald-600",
              bg: "bg-emerald-500/10",
            },
            {
              label: "Credentials",
              value: activities.filter((a) => a.type.includes("credential"))
                .length,
              icon: ShieldCheck,
              color: "text-violet-600",
              bg: "bg-violet-500/10",
            },
            {
              label: "This Week",
              value: activities.filter(
                (a) => a.timestamp > Date.now() - 604800000,
              ).length,
              icon: Clock,
              color: "text-amber-600",
              bg: "bg-amber-500/10",
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

        {/* Activity List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg min-w-[250px]">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  className="flex-1 border-none bg-transparent text-sm text-gray-800 outline-none"
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="credential_requested">
                    Credential Requested
                  </option>
                  <option value="verification_completed">
                    Verification Completed
                  </option>
                  <option value="verification_failed">
                    Verification Failed
                  </option>
                  <option value="credential_checked">Revocation Checked</option>
                </select>
              </div>
            </div>
          </div>

          {filteredActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <History size={48} className="text-gray-300 mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                No Activity Yet
              </h4>
              <p className="text-sm text-gray-500">
                {searchQuery || typeFilter !== "all"
                  ? "No activities match your filters"
                  : "Your activity history will appear here"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${getActivityColor(activity.type)}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 mb-1">
                      {getActivityTitle(activity.type)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {activity.details?.credentialId && (
                        <span className="font-mono mr-3">
                          {activity.details.credentialId}
                        </span>
                      )}
                      {activity.details?.verifier && (
                        <span className="mr-3">
                          Verifier: {activity.details.verifier}
                        </span>
                      )}
                      {activity.details?.status && (
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            activity.details.status === "valid"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {activity.details.status}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">
                      {formatFullTimestamp(activity.timestamp)}
                    </span>
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

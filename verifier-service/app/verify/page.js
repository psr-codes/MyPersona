"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  ScanLine,
  Plus,
  Copy,
  CheckCircle,
  ShieldCheck,
  User,
  Calendar,
  FileCheck,
  Download,
  RefreshCw,
  Trash2,
} from "lucide-react";
import Header from "@/components/Header";
import { useVerificationRequests } from "@/hooks/useVerification";
import { generateRequestId, formatTimestamp } from "@/lib/contracts";
import toast from "react-hot-toast";

export default function VerifyPage() {
  const { requests, createRequest, deleteRequest } = useVerificationRequests();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    ageAbove18: true,
    kycVerified: true,
    notRevoked: true,
    trustedIssuer: true,
    customMessage: "",
  });

  const handleCreateRequest = () => {
    const request = createRequest(newRequest);
    setShowCreateModal(false);
    setNewRequest({
      ageAbove18: true,
      kycVerified: true,
      notRevoked: true,
      trustedIssuer: true,
      customMessage: "",
    });
    toast.success("Verification request created!");
  };

  const copyRequestId = (id) => {
    navigator.clipboard.writeText(id);
    toast.success("Request ID copied!");
  };

  const getQRData = (request) => {
    return JSON.stringify({
      type: "MYPERSONA_VERIFY",
      requestId: request.id,
      createdAt: request.createdAt,
      requirements: request.requirements,
      verifier: "MyPersona Verifier Portal",
    });
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Verify Credentials"
        subtitle="Create verification requests and scan QR codes"
      />

      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Create Request Banner */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-violet-500/8 to-teal-500/8 border border-violet-500/15 rounded-2xl mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-violet-500 to-teal-500 rounded-xl text-white">
              <ScanLine size={28} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                Create Verification Request
              </h2>
              <p className="text-sm text-gray-600">
                Generate a QR code that users can scan to share their zk-KYC
                credentials.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-3 btn-primary-gradient rounded-lg text-white text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/30"
          >
            <Plus size={18} />
            New Request
          </button>
        </div>

        {/* Active Requests */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Active Verification Requests
          </h3>

          {requests.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
              <ScanLine size={48} className="text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                No Active Requests
              </h4>
              <p className="text-sm text-gray-500 mb-6">
                Create a verification request to get started
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-5 py-3 btn-primary-gradient rounded-lg text-white text-sm font-semibold"
              >
                <Plus size={16} />
                Create Request
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${request.status === "verified" ? "bg-emerald-500" : request.status === "failed" ? "bg-rose-500" : "bg-amber-500 animate-pulse"}`}
                      />
                      <span className="font-mono text-sm font-medium text-gray-700">
                        {request.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyRequestId(request.id)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-500 hover:border-violet-500 hover:text-violet-600 transition-all"
                        title="Copy ID"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => deleteRequest(request.id)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-500 hover:border-rose-500 hover:text-rose-500 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex gap-6">
                      {/* QR Code */}
                      <div className="qr-container p-4 rounded-xl flex items-center justify-center">
                        <QRCodeSVG
                          value={getQRData(request)}
                          size={160}
                          level="M"
                          includeMargin
                          bgColor="transparent"
                          fgColor="#1E293B"
                        />
                      </div>

                      {/* Requirements */}
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          Requirements
                        </h4>
                        <div className="flex flex-col gap-2">
                          {request.requirements.kycVerified && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FileCheck
                                size={14}
                                className="text-violet-500"
                              />
                              <span>KYC Verified</span>
                            </div>
                          )}
                          {request.requirements.ageAbove18 && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar size={14} className="text-violet-500" />
                              <span>Age Above 18</span>
                            </div>
                          )}
                          {request.requirements.notRevoked && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle
                                size={14}
                                className="text-violet-500"
                              />
                              <span>Not Revoked</span>
                            </div>
                          )}
                          {request.requirements.trustedIssuer && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <ShieldCheck
                                size={14}
                                className="text-violet-500"
                              />
                              <span>Trusted Issuer</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <span className="text-xs text-gray-400">
                            Created {formatTimestamp(request.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Footer */}
                  <div
                    className={`px-6 py-3 ${request.status === "verified" ? "status-verified" : request.status === "failed" ? "status-failed" : "status-pending"}`}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {request.status === "verified" ? (
                        <>
                          <CheckCircle size={16} className="text-emerald-600" />
                          <span className="text-emerald-700">
                            Verification Successful
                          </span>
                        </>
                      ) : request.status === "failed" ? (
                        <>
                          <span className="text-rose-600">
                            Verification Failed
                          </span>
                        </>
                      ) : (
                        <>
                          <RefreshCw
                            size={16}
                            className="text-amber-600 animate-spin"
                          />
                          <span className="text-amber-700">
                            Waiting for user...
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Create Verification Request
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Select the requirements for this verification
              </p>
            </div>

            <div className="p-6">
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={newRequest.kycVerified}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        kycVerified: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-800">
                      KYC Verified
                    </span>
                    <p className="text-xs text-gray-500">
                      User must have completed KYC verification
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={newRequest.ageAbove18}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        ageAbove18: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-800">
                      Age Above 18
                    </span>
                    <p className="text-xs text-gray-500">
                      User must be 18 years or older
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={newRequest.notRevoked}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        notRevoked: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-800">
                      Not Revoked
                    </span>
                    <p className="text-xs text-gray-500">
                      Credential must not be revoked
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={newRequest.trustedIssuer}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        trustedIssuer: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-800">
                      Trusted Issuer
                    </span>
                    <p className="text-xs text-gray-500">
                      Credential must be from a trusted issuer
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRequest}
                className="px-5 py-3 btn-primary-gradient rounded-lg text-white text-sm font-semibold"
              >
                Create Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import {
  ScanLine,
  Camera,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShieldCheck,
  Send,
  X,
} from "lucide-react";
import Header from "@/components/Header";
import { useWallet } from "@/contexts/WalletContext";
import { useCredentials, useVerificationHandler } from "@/hooks/useCredentials";
import toast from "react-hot-toast";

export default function ScanPage() {
  const { isConnected } = useWallet();
  const { credentials, validCredentials, generateProof } = useCredentials();
  const {
    pendingRequest,
    isProcessing,
    handleVerificationRequest,
    submitProof,
    cancelRequest,
  } = useVerificationHandler();

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [manualInput, setManualInput] = useState("");
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const startScanning = async () => {
    setIsScanning(true);
    setScanResult(null);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          handleQRResult(decodedText);
          stopScanning();
        },
        () => {}, // Ignore error frames
      );
    } catch (error) {
      console.error("Failed to start scanner:", error);
      toast.error("Failed to access camera");
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (error) {
        console.error("Failed to stop scanner:", error);
      }
    }
    setIsScanning(false);
  };

  const handleQRResult = async (data) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === "MYPERSONA_VERIFY") {
        setScanResult(parsed);
        const result = await handleVerificationRequest(parsed);
        if (!result.success) {
          toast.error(result.error);
        }
      } else {
        toast.error("Invalid QR code format");
      }
    } catch (error) {
      console.error("Failed to parse QR:", error);
      toast.error("Invalid QR code");
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput) {
      handleQRResult(manualInput);
      setManualInput("");
    }
  };

  const handleSubmitProof = async () => {
    if (!selectedCredential) {
      toast.error("Please select a credential");
      return;
    }

    const proof = await submitProof(selectedCredential);
    if (proof) {
      toast.success("Proof submitted successfully!");
      setScanResult(null);
      setSelectedCredential(null);
    }
  };

  const handleCancel = () => {
    cancelRequest();
    setScanResult(null);
    setSelectedCredential(null);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Scan QR Code"
        subtitle="Respond to verification requests"
      />

      <div className="p-8 max-w-[1200px] mx-auto">
        {/* Not Connected Banner */}
        {!isConnected && (
          <div className="flex items-center gap-3 px-5 py-4 bg-blue-50 border border-blue-200 rounded-xl mb-6 text-sm text-blue-700">
            <AlertCircle size={20} className="flex-shrink-0" />
            <span>
              Connect your wallet to scan and respond to verification requests
            </span>
          </div>
        )}

        {/* No Credentials Banner */}
        {isConnected && validCredentials.length === 0 && (
          <div className="flex items-center gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-xl mb-6 text-sm text-amber-700">
            <AlertCircle size={20} className="flex-shrink-0" />
            <span>
              You need at least one valid credential to respond to verification
              requests
            </span>
          </div>
        )}

        {!scanResult && !pendingRequest ? (
          <div className="grid grid-cols-2 gap-6">
            {/* Camera Scanner */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-6 py-5 border-b border-gray-100 bg-gray-50">
                <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                  <Camera size={18} />
                  Camera Scanner
                </h3>
              </div>
              <div className="p-6">
                <div className="qr-scanner-container rounded-xl overflow-hidden mb-4 relative h-[300px] flex items-center justify-center">
                  {isScanning ? (
                    <div id="qr-reader" className="w-full h-full" />
                  ) : (
                    <div className="text-center">
                      <Camera
                        size={48}
                        className="text-blue-300 mx-auto mb-4"
                      />
                      <p className="text-sm text-gray-500 mb-4">
                        Point your camera at a verification QR code
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={isScanning ? stopScanning : startScanning}
                  disabled={!isConnected || validCredentials.length === 0}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    isScanning
                      ? "bg-rose-500 hover:bg-rose-600 text-white"
                      : "btn-primary-gradient text-white hover:-translate-y-0.5 hover:shadow-lg"
                  }`}
                >
                  {isScanning ? (
                    <>
                      <X size={18} />
                      Stop Scanning
                    </>
                  ) : (
                    <>
                      <ScanLine size={18} />
                      Start Scanner
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Manual Input */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-6 py-5 border-b border-gray-100 bg-gray-50">
                <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                  <ScanLine size={18} />
                  Manual Input
                </h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-4">
                  Paste a verification request JSON if you can't use the camera
                  scanner.
                </p>
                <form
                  onSubmit={handleManualSubmit}
                  className="flex flex-col gap-4"
                >
                  <textarea
                    className="w-full px-4 py-3 font-mono text-sm text-gray-800 bg-white border-2 border-gray-200 rounded-lg transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 h-[180px] resize-none"
                    placeholder='{"type": "MYPERSONA_VERIFY", ...}'
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    disabled={!isConnected || validCredentials.length === 0}
                  />
                  <button
                    type="submit"
                    disabled={
                      !isConnected ||
                      validCredentials.length === 0 ||
                      !manualInput
                    }
                    className="flex items-center justify-center gap-2 px-5 py-3 btn-secondary-gradient rounded-lg text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle size={18} />
                    Process Request
                  </button>
                </form>
              </div>
            </div>

            {/* How It Works */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                How QR Verification Works
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  {
                    step: "1",
                    title: "Scan QR",
                    desc: "Scan the verification request QR code",
                  },
                  {
                    step: "2",
                    title: "Choose Credential",
                    desc: "Select which credential to use",
                  },
                  {
                    step: "3",
                    title: "Generate Proof",
                    desc: "Sign to create a ZK proof",
                  },
                  {
                    step: "4",
                    title: "Submit",
                    desc: "Share your proof with the verifier",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full text-white text-sm font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800 block">
                        {item.title}
                      </span>
                      <span className="text-xs text-gray-500">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Verification Request Handler */
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-w-2xl mx-auto">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-emerald-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl text-white">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Verification Request
                  </h3>
                  <p className="text-sm text-gray-500">
                    {scanResult?.verifier || "Unknown Verifier"} wants to verify
                    your identity
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Requirements */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Requirements
                </h4>
                <div className="flex flex-wrap gap-2">
                  {scanResult?.requirements?.kycVerified && (
                    <span className="px-3 py-1 bg-blue-50 rounded-full text-sm font-medium text-blue-700">
                      KYC Verified
                    </span>
                  )}
                  {scanResult?.requirements?.ageAbove18 && (
                    <span className="px-3 py-1 bg-blue-50 rounded-full text-sm font-medium text-blue-700">
                      Age 18+
                    </span>
                  )}
                  {scanResult?.requirements?.notRevoked && (
                    <span className="px-3 py-1 bg-blue-50 rounded-full text-sm font-medium text-blue-700">
                      Not Revoked
                    </span>
                  )}
                  {scanResult?.requirements?.trustedIssuer && (
                    <span className="px-3 py-1 bg-blue-50 rounded-full text-sm font-medium text-blue-700">
                      Trusted Issuer
                    </span>
                  )}
                </div>
              </div>

              {/* Select Credential */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Select Credential
                </h4>
                <div className="flex flex-col gap-2">
                  {validCredentials.map((cred) => (
                    <button
                      key={cred.id}
                      onClick={() => setSelectedCredential(cred)}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                        selectedCredential?.id === cred.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg text-white">
                        <ShieldCheck size={20} />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="font-mono text-sm font-medium text-gray-800 block">
                          {cred.id}
                        </span>
                        <span className="text-xs text-gray-500">
                          Nonce: #{cred.nonce}
                        </span>
                      </div>
                      {selectedCredential?.id === cred.id && (
                        <CheckCircle size={20} className="text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-5 py-3 bg-gray-100 rounded-lg text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitProof}
                  disabled={!selectedCredential || isProcessing}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 btn-primary-gradient rounded-lg text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating Proof...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Share Proof
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useWallet } from "@/contexts/WalletContext";
import {
  Wallet,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export default function Header({ title, subtitle }) {
  const {
    account,
    isConnected,
    isConnecting,
    isCorrectNetwork,
    connect,
    disconnect,
    switchToPolygonAmoy,
    formatAddress,
    networkName,
  } = useWallet();

  return (
    <header className="flex items-center justify-between px-8 py-5 glass border-b border-gray-100 sticky top-0 z-40 min-h-[72px]">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Network Badge */}
        {isConnected && (
          <div>
            {isCorrectNetwork ? (
              <div className="flex items-center gap-2 px-3 py-2 network-badge rounded-full text-xs font-semibold text-purple-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-glow" />
                <span>{networkName}</span>
              </div>
            ) : (
              <button
                className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-all cursor-pointer"
                onClick={switchToPolygonAmoy}
              >
                <AlertTriangle size={14} />
                <span>Wrong Network</span>
              </button>
            )}
          </div>
        )}

        {/* Wallet Connection */}
        {isConnected ? (
          <div className="flex items-center gap-2 pl-4 pr-2 py-2 bg-white border border-gray-200 rounded-full">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="font-mono text-sm font-medium text-gray-700">
                {formatAddress(account)}
              </span>
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-rose-100 hover:text-rose-500 transition-all cursor-pointer"
              onClick={disconnect}
              title="Disconnect Wallet"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            className="flex items-center gap-2 px-5 py-3 btn-primary-gradient rounded-full text-white text-sm font-semibold cursor-pointer transition-all shadow-md hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={connect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Wallet size={16} />
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
}

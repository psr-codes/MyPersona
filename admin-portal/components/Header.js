"use client";

import { useWallet } from "@/contexts/WalletContext";
import {
  Wallet,
  LogOut,
  AlertTriangle,
  Building2,
  Lock,
  Loader2,
} from "lucide-react";
import { shortAddress } from "@/lib/contracts";

export default function Header({ title, subtitle }) {
  const {
    account,
    isConnected,
    isConnecting,
    isCorrectNetwork,
    connect,
    disconnect,
    switchToPolygonAmoy,
  } = useWallet();

  return (
    <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 sticky top-0 z-40 min-h-[72px] shadow-sm">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Network Badge */}
        {isConnected && (
          <div>
            {isCorrectNetwork ? (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-700 uppercase tracking-wide">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse-gold" />
                <span>Polygon Amoy</span>
              </div>
            ) : (
              <button
                className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-full text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all cursor-pointer uppercase tracking-wide"
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
          <div className="flex items-center gap-2 pl-4 pr-2 py-1.5 bg-slate-900 border border-slate-900 rounded-full shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="font-mono text-sm font-bold text-white">
                {shortAddress(account)}
              </span>
            </div>
            <button
              className="w-7 h-7 flex items-center justify-center bg-slate-700 rounded-full text-slate-300 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
              onClick={disconnect}
              title="Disconnect Admin Wallet"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button
            className="flex items-center gap-2 px-5 py-2.5 btn-gold-gradient rounded-lg text-white text-sm font-bold shadow-md hover:shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wide"
            onClick={connect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Wallet size={16} />
                <span>Connect Admin Wallet</span>
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
}

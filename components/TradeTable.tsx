"use client";

import { useState } from "react";

interface TradeTableProps {
  allTrades?: any[];
  trades?: any[]; 
  fetchingTrades?: boolean;
  isDark: boolean;
  deleteTrade?: (id: string) => Promise<void> | void;
  onEdit?: (trade: any) => void; // 🟢 Sabon abu: Don kunna gyara (Edit) a page.tsx
}

export function TradeTable({ allTrades, trades, fetchingTrades = false, isDark, deleteTrade, onEdit }: TradeTableProps) {
  const [selectedTrade, setSelectedTrade] = useState<any | null>(null);

  const incomingTrades = trades || allTrades || [];

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="w-full transition-all duration-300">
      {fetchingTrades ? (
        <div className="text-center py-12 text-sm opacity-60">Loading history...</div>
      ) : incomingTrades.length === 0 ? (
        <div className={`text-center py-12 text-sm opacity-40 border-2 border-dashed rounded-xl ${isDark ? "border-slate-800" : "border-slate-200"}`}>
          No trades logged yet. Your journal is empty.
        </div>
      ) : (
        <div className="space-y-2.5">
          {incomingTrades.map((trade: any) => {
            const isWin = trade.status === "WIN" || (trade.status === "BE" && (trade.pnl || 0) > 0);
            const dateString = trade.entry_time || trade.date || trade.created_at;
            const formattedDate = dateString ? dateString.split("T")[0] : "N/A";

            return (
              <div 
                key={trade.id} 
                onClick={() => setSelectedTrade(trade)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer hover:scale-[1.005] active:scale-[0.99] gap-2 ${
                  isDark 
                    ? "bg-slate-950/30 border-slate-900/80 hover:bg-slate-950/80 hover:border-slate-800" 
                    : "bg-slate-50/50 border-slate-100 hover:bg-slate-50 hover:border-slate-200 shadow-sm"
                }`}
              >
                {/* Bangaren Hagu: Suna da Kasuwa */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-sm tracking-tight font-mono">{trade.asset}</span>
                    <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-medium tracking-wide uppercase ${
                      isDark ? "bg-slate-900 text-slate-400" : "bg-slate-200 text-slate-700"
                    }`}>
                      {trade.category || trade.market_category}
                    </span>
                  </div>
                  <div className="text-[10px] opacity-50 mt-0.5 font-mono truncate">
                    {trade.strategy ? `${trade.strategy} • ` : ""}{formattedDate}
                  </div>
                </div>

                {/* Bangaren Tsakiya: Type da Farashi */}
                <div className="text-center min-w-[70px]">
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                    trade.type === "BUY" || trade.trade_type === "BUY" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                  }`}>
                    {trade.type || trade.trade_type}
                  </span>
                  <div className="text-[11px] opacity-60 mt-0.5 font-mono">{trade.entry_price}</div>
                </div>

                {/* Bangaren Dama: PnL da Status */}
                <div className="text-right min-w-[75px]">
                  <div className={`text-xs font-bold font-mono ${isWin ? "text-emerald-500" : "text-rose-500"}`}>
                    {trade.pnl !== null && trade.pnl !== undefined ? `${trade.pnl >= 0 ? "+" : ""}${trade.pnl}` : "0.00"}
                  </div>
                  <span className={`inline-block text-[8px] font-black tracking-wider px-1 rounded mt-0.5 ${
                    trade.status === "WIN" ? "bg-emerald-500/10 text-emerald-400" : trade.status === "LOSS" ? "bg-rose-500/10 text-rose-400" : "bg-slate-500/10 text-slate-400"
                  }`}>
                    {trade.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- ADVANCED MODAL DIALOG (Cikakken Bayani) --- */}
      {selectedTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`rounded-2xl max-w-3xl w-full p-5 shadow-2xl border max-h-[92vh] overflow-y-auto ${
            isDark ? "bg-[#121926] border-slate-900 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-5 gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-black font-mono tracking-tight">{selectedTrade.asset}</h3>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase ${isDark ? "bg-slate-900 text-slate-400" : "bg-slate-100 text-slate-600"}`}>
                    {selectedTrade.category || selectedTrade.market_category}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    selectedTrade.type === "BUY" || selectedTrade.trade_type === "BUY" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                  }`}>
                    {selectedTrade.type || selectedTrade.trade_type}
                  </span>
                </div>
                <p className="text-[10px] opacity-50 mt-1">Logged on: {formatDateTime(selectedTrade.entry_time || selectedTrade.created_at)}</p>
              </div>

              {/* Madannai na Ayyuka (Edit, Delete, Close) */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* 🟢 Gunkin Edit */}
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit(selectedTrade);
                      setSelectedTrade(null); // Kulle modal bayan an danna edit
                    }}
                    className={`p-2 rounded-lg border transition ${
                      isDark ? "border-slate-800 bg-slate-950 text-blue-400 hover:bg-blue-500/10" : "border-slate-200 bg-white text-blue-600 hover:bg-blue-50"
                    }`}
                    title="Gyara Trade"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}

                {/* 🟢 Gunkin Delete (An dawo da shi cikin modal anan) */}
                {deleteTrade && (
                  <button
                    onClick={() => {
                      if (confirm("Kuna da tabbas kuna son goge wannan trade ɗin gaba ɗaya?")) {
                        deleteTrade(selectedTrade.id);
                        setSelectedTrade(null);
                      }
                    }}
                    className={`p-2 rounded-lg border transition ${
                      isDark ? "border-slate-800 bg-slate-950 text-rose-400 hover:bg-rose-500/10" : "border-slate-200 bg-white text-rose-500 hover:bg-rose-50"
                    }`}
                    title="Goge Trade"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}

                {/* Gunkin Kullewa */}
                <button 
                  onClick={() => setSelectedTrade(null)} 
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition ${
                    isDark ? "bg-slate-950 border-slate-800 hover:bg-slate-900 text-slate-200" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Performance Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
              <div className={`p-3 rounded-xl border ${isDark ? "bg-slate-950/20 border-slate-900" : "bg-slate-50 border-slate-100"}`}>
                <span className="block text-[8px] uppercase font-bold tracking-wider opacity-40 mb-0.5">Net P&L</span>
                <span className={`text-sm font-black font-mono ${selectedTrade.pnl >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  {selectedTrade.pnl >= 0 ? "+" : ""}{selectedTrade.pnl}
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? "bg-slate-950/20 border-slate-900" : "bg-slate-50 border-slate-100"}`}>
                <span className="block text-[8px] uppercase font-bold tracking-wider opacity-40 mb-0.5">Fees</span>
                <span className="text-sm font-black font-mono text-amber-500">{selectedTrade.fee || 0}</span>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? "bg-slate-950/20 border-slate-900" : "bg-slate-50 border-slate-100"}`}>
                <span className="block text-[8px] uppercase font-bold tracking-wider opacity-40 mb-0.5">Size</span>
                <span className="text-sm font-black font-mono">{selectedTrade.position_size || "N/A"}</span>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? "bg-slate-950/20 border-slate-900" : "bg-slate-50 border-slate-100"}`}>
                <span className="block text-[8px] uppercase font-bold tracking-wider opacity-40 mb-0.5">Session</span>
                <span className="text-sm font-black text-cyan-400 truncate block">{selectedTrade.trading_session || "N/A"}</span>
              </div>
            </div>

            {/* Price Levels Section */}
            <div className="mb-5">
              <h4 className="text-[9px] uppercase font-bold tracking-wider opacity-40 mb-2">Price Levels & Timestamps</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs font-mono">
                <div className="flex justify-between items-center border-b border-slate-800/20 py-1">
                  <span className="opacity-60">Entry Price:</span>
                  <span className="font-bold">{selectedTrade.entry_price}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800/20 py-1">
                  <span className="opacity-60">Exit Price:</span>
                  <span className="font-bold">{selectedTrade.exit_price || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800/20 py-1">
                  <span className="opacity-60">Stop Loss (SL):</span>
                  <span className="font-bold text-rose-500">{selectedTrade.stop_loss || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800/20 py-1">
                  <span className="opacity-60">Take Profit (TP):</span>
                  <span className="font-bold text-emerald-500">{selectedTrade.take_profit || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* 🟢 GYARA: Sashen Strategy da Psychology Tags da suka baje a baya */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div>
                <h4 className="text-[9px] uppercase font-bold tracking-wider opacity-40 mb-1">Strategy System</h4>
                <div className={`p-2.5 rounded-xl border text-xs font-mono ${isDark ? "bg-slate-950/20 border-slate-900" : "bg-slate-50 border-slate-100"}`}>
                  {selectedTrade.strategy || "No Strategy Selected"}
                </div>
              </div>
              <div>
                <h4 className="text-[9px] uppercase font-bold tracking-wider opacity-40 mb-1">Psychology Tags</h4>
                <div className={`p-2.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 ${isDark ? "bg-slate-950/20 border-slate-900" : "bg-slate-50 border-slate-100"}`}>
                  <span>💬</span> {selectedTrade.psychology_tags || "No Tags"}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mb-5">
              <h4 className="text-[9px] uppercase font-bold tracking-wider opacity-40 mb-1">Notes / Confluences</h4>
              <div className={`p-3 rounded-xl border text-xs leading-relaxed min-h-[45px] ${isDark ? "bg-slate-950/20 border-slate-900" : "bg-slate-50 border-slate-100"}`}>
                {selectedTrade.notes || "Babu wani bayani da aka rubuta."}
              </div>
            </div>

            {/* Screenshots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/20">
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-wider opacity-40 mb-1.5">Before Chart</span>
                {selectedTrade.image_before ? (
                  <img src={selectedTrade.image_before} alt="Before Setup" className="w-full h-auto rounded-xl border border-slate-800/30" />
                ) : (
                  <div className={`h-24 flex items-center justify-center border border-dashed rounded-xl text-[11px] opacity-40 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                    Babu hoton "Before"
                  </div>
                )}
              </div>
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-wider opacity-40 mb-1.5">After Chart</span>
                {selectedTrade.image_after ? (
                  <img src={selectedTrade.image_after} alt="After Outcome" className="w-full h-auto rounded-xl border border-slate-800/30" />
                ) : (
                  <div className={`h-24 flex items-center justify-center border border-dashed rounded-xl text-[11px] opacity-40 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                    Babu hoton "After"
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
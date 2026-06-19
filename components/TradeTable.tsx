"use client";

import { useState } from "react";

interface TradeTableProps {
  allTrades?: any[];
  trades?: any[]; // Mun kara wannan don ya dace da abinda ke cikin page.tsx
  fetchingTrades?: boolean;
  isDark: boolean;
}

export function TradeTable({ allTrades, trades, fetchingTrades = false, isDark }: TradeTableProps) {
  const [selectedTrade, setSelectedTrade] = useState<any | null>(null);

  // Muna hada sunayen guda biyu; idan babu ko daya ya dauki array wofi [] don gudun crash
  const incomingTrades = trades || allTrades || [];

  // Taimakon gyara lokaci zuwa yadda yake a hoto
  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className={`border rounded-2xl p-6 shadow-xl transition-all duration-300 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-lg font-bold">Recent Trades</h2>
          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Your last 10 logged market entries (Click to view)</p>
        </div>
        <button className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
          isDark ? "border-slate-800 bg-slate-950 hover:bg-slate-800 text-blue-400" : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-blue-600"
        }`}>
          View All
        </button>
      </div>

      {fetchingTrades ? (
        <div className="text-center py-12 text-sm opacity-60">Loading history...</div>
      ) : incomingTrades.length === 0 ? ( // Mun canza zuwa safe variable anan
        <div className="text-center py-12 text-sm opacity-40 border-2 border-dashed rounded-xl border-slate-800/40">
          No trades logged yet. Your journal is empty.
        </div>
      ) : (
        <div className="space-y-3">
          {incomingTrades.slice(0, 10).map((trade: any) => {
            const isWin = trade.status === "WIN" || (trade.status === "BE" && (trade.pnl || 0) > 0);
            const formattedDate = trade.created_at ? trade.created_at.split("T")[0] : "";

            return (
              <div 
                key={trade.id} 
                onClick={() => setSelectedTrade(trade)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
                  isDark ? "bg-slate-950/40 border-slate-800/60 hover:bg-slate-950 hover:border-slate-700" : "bg-slate-50/60 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm tracking-tight">{trade.asset}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                      isDark ? "bg-slate-900 text-slate-400" : "bg-slate-200 text-slate-700"
                    }`}>
                      {trade.market_category}
                    </span>
                  </div>
                  <div className="text-[11px] opacity-60 mt-0.5">
                    {trade.strategy ? `${trade.strategy} • ` : ""}{formattedDate}
                  </div>
                </div>

                <div className="text-center">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    trade.trade_type === "BUY" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                  }`}>
                    {trade.trade_type}
                  </span>
                  <div className="text-xs opacity-60 mt-1 font-mono">${trade.entry_price}</div>
                </div>

                <div className="text-right">
                  <div className={`text-sm font-bold font-mono ${isWin ? "text-emerald-500" : "text-rose-500"}`}>
                    {trade.pnl !== null && trade.pnl !== undefined ? `${trade.pnl >= 0 ? "+" : ""}$${trade.pnl}` : "N/A"}
                  </div>
                  <span className={`inline-block text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded mt-1 ${
                    trade.status === "WIN" ? "bg-emerald-500/20 text-emerald-500" : trade.status === "LOSS" ? "bg-rose-500/20 text-rose-500" : "bg-slate-500/20 text-slate-400"
                  }`}>
                    {trade.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- ADVANCED MODAL DIALOG --- */}
      {selectedTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`rounded-2xl max-w-3xl w-full p-6 shadow-2xl border max-h-[92vh] overflow-y-auto ${
            isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-2xl font-black tracking-tight font-mono">{selectedTrade.asset}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"}`}>
                    {selectedTrade.market_category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    selectedTrade.trade_type === "BUY" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                  }`}>
                    {selectedTrade.trade_type}
                  </span>
                </div>
                <p className="text-[11px] opacity-50 mt-1">Logged on: {formatDateTime(selectedTrade.created_at)}</p>
              </div>
              <button 
                onClick={() => setSelectedTrade(null)} 
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border flex items-center gap-1 transition ${
                  isDark ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200" : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700"
                }`}
              >
                ✕ Close
              </button>
            </div>

            {/* Top 4 Performance Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className={`p-3.5 rounded-xl border ${isDark ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-100"}`}>
                <span className="block text-[9px] uppercase font-bold tracking-wider opacity-40 mb-1">Net Profit/Loss</span>
                <span className={`text-base font-black font-mono ${selectedTrade.pnl >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  {selectedTrade.pnl >= 0 ? "+" : ""}${selectedTrade.pnl}
                </span>
              </div>
              <div className={`p-3.5 rounded-xl border ${isDark ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-100"}`}>
                <span className="block text-[9px] uppercase font-bold tracking-wider opacity-40 mb-1">Broker Fee / Comm.</span>
                <span className="text-base font-black font-mono text-amber-500">${selectedTrade.fee || 0}</span>
              </div>
              <div className={`p-3.5 rounded-xl border ${isDark ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-100"}`}>
                <span className="block text-[9px] uppercase font-bold tracking-wider opacity-40 mb-1">Position Size</span>
                <span className="text-base font-black font-mono">{selectedTrade.position_size || "N/A"}</span>
              </div>
              <div className={`p-3.5 rounded-xl border ${isDark ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-100"}`}>
                <span className="block text-[9px] uppercase font-bold tracking-wider opacity-40 mb-1">Trading Session</span>
                <span className="text-base font-black text-cyan-400">{selectedTrade.trading_session || "N/A"}</span>
              </div>
            </div>

            {/* Price Levels & Timestamps Section */}
            <div className="mb-6">
              <h4 className="text-[10px] uppercase font-bold tracking-wider opacity-40 mb-2.5">Price Levels & Timestamps</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs font-mono">
                <div className="flex justify-between items-center border-b border-slate-800/30 py-1.5">
                  <span className="opacity-60">Entry Price:</span>
                  <span className="font-bold">${selectedTrade.entry_price}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800/30 py-1.5">
                  <span className="opacity-60">Exit Price:</span>
                  <span className="font-bold">${selectedTrade.exit_price || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800/30 py-1.5">
                  <span className="opacity-60">Stop Loss (SL):</span>
                  <span className="font-bold text-rose-500">${selectedTrade.stop_loss || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800/30 py-1.5">
                  <span className="opacity-60">Take Profit (TP):</span>
                  <span className="font-bold text-emerald-500">${selectedTrade.take_profit || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800/30 py-1.5">
                  <span className="opacity-60">Entry Time:</span>
                  <span className="opacity-80">{formatDateTime(selectedTrade.entry_time)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800/30 py-1.5">
                  <span className="opacity-60">Exit Time:</span>
                  <span className="opacity-80">{formatDateTime(selectedTrade.exit_time)}</span>
                </div>
              </div>
            </div>

            {/* Strategy & Psychology Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-wider opacity-40 mb-1.5">Strategy System</h4>
                <div className={`p-3 rounded-xl border text-xs font-mono ${isDark ? "bg-slate-950/30 border-slate-800/60" : "bg-slate-50 border-slate-100"}`}>
                  {selectedTrade.strategy || "No Strategy Selected"}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-wider opacity-40 mb-1.5">Psychology Tags</h4>
                <div className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-1.5 ${isDark ? "bg-slate-950/30 border-slate-800/60" : "bg-slate-50 border-slate-100"}`}>
                  <span>💬</span> {selectedTrade.psychology_tags || "No Tags"}
                </div>
              </div>
            </div>

            {/* Trade Notes / Confluences */}
            <div className="mb-6">
              <h4 className="text-[10px] uppercase font-bold tracking-wider opacity-40 mb-1.5">Trade Notes / Confluences</h4>
              <div className={`p-3 rounded-xl border text-xs leading-relaxed min-h-[45px] ${isDark ? "bg-slate-950/30 border-slate-800/60" : "bg-slate-50 border-slate-100"}`}>
                {selectedTrade.notes || "No notes recorded for this trade."}
              </div>
            </div>

            {/* Screenshot Charts Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-2 border-t border-slate-800/30">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider opacity-45 mb-2">Before Execution Chart</span>
                {selectedTrade.image_before ? (
                  <img src={selectedTrade.image_before} alt="Before Execution" className="w-full h-auto rounded-xl border border-slate-700/30 shadow-sm" />
                ) : (
                  <div className={`h-32 flex items-center justify-center border border-dashed rounded-xl text-xs opacity-40 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                    No "Before" setup uploaded
                  </div>
                )}
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider opacity-45 mb-2">After Execution Chart</span>
                {selectedTrade.image_after ? (
                  <img src={selectedTrade.image_after} alt="After Execution" className="w-full h-auto rounded-xl border border-slate-700/30 shadow-sm" />
                ) : (
                  <div className={`h-32 flex items-center justify-center border border-dashed rounded-xl text-xs opacity-40 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                    No "After" outcome uploaded
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
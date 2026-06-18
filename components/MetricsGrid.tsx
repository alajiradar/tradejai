// components/MetricsGrid.tsx
"use client";

interface MetricsGridProps {
  netPnl: number;
  winRate: string;
  profitFactor: string;
  totalTrades: number;
  isDark: boolean;
}

export function MetricsGrid({ netPnl, winRate, profitFactor, totalTrades, isDark }: MetricsGridProps) {
  return (
    <div className="lg:col-span-5 grid grid-cols-2 gap-4">
      {/* Card 1: Net P&L */}
      <div className={`border rounded-xl p-4 shadow-sm flex flex-col justify-center transition-all duration-300 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        <span className="block text-[10px] uppercase font-bold tracking-wider opacity-50 mb-1">Net P&L ($)</span>
        <div className={`text-xl font-black font-mono tracking-tight ${netPnl >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
          {netPnl >= 0 ? "+" : ""}${netPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* Card 2: Win Rate */}
      <div className={`border rounded-xl p-4 shadow-sm flex flex-col justify-center transition-all duration-300 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        <span className="block text-[10px] uppercase font-bold tracking-wider opacity-50 mb-1">Win Rate</span>
        <div className="text-xl font-black font-mono tracking-tight text-blue-500">
          {winRate}%
        </div>
      </div>

      {/* Card 3: Profit Factor */}
      <div className={`border rounded-xl p-4 shadow-sm flex flex-col justify-center transition-all duration-300 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        <span className="block text-[10px] uppercase font-bold tracking-wider opacity-50 mb-1">Profit Factor</span>
        <div className={`text-xl font-black font-mono tracking-tight ${parseFloat(profitFactor) >= 1.0 ? "text-amber-500" : "text-slate-400"}`}>
          {profitFactor}
        </div>
      </div>

      {/* Card 4: Total Trades */}
      <div className={`border rounded-xl p-4 shadow-sm flex flex-col justify-center transition-all duration-300 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        <span className="block text-[10px] uppercase font-bold tracking-wider opacity-50 mb-1">Total Trades</span>
        <div className={`text-xl font-black font-mono tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          {totalTrades}
        </div>
      </div>
    </div>
  );
}
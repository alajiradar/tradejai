'use client';

import React from 'react';

interface MetricsGridProps {
  trades: any[];
  filteredTrades: any[];
  activeFilter: 'all' | 'weekly' | 'monthly' | 'yearly';
  setActiveFilter: (filter: 'all' | 'weekly' | 'monthly' | 'yearly') => void;
  isDark: boolean;
}

export default function MetricsGrid({ trades = [], filteredTrades = [], activeFilter, setActiveFilter, isDark }: MetricsGridProps) {
  
  // Lissafin Metrics Kai Tsaye (Live Database Calculations)
  const stats = React.useMemo(() => {
    const tradeSource = filteredTrades || [];
    const totalTrades = tradeSource.length;
    
    let netPnL = 0;
    let totalWins = 0;
    let totalLosses = 0;
    let grossProfit = 0;
    let grossLoss = 0;

    tradeSource.forEach((trade) => {
      const pnlValue = Number(trade.pnl) || 0;
      netPnL += pnlValue;

      if (pnlValue > 0 || trade.status === 'WIN') {
        totalWins++;
        grossProfit += pnlValue;
      } else if (pnlValue < 0 || trade.status === 'LOSS') {
        totalLosses++;
        grossLoss += Math.abs(pnlValue);
      }
    });

    const winRate = totalTrades > 0 ? (totalWins / totalTrades) * 100 : 0;
    const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss) : grossProfit > 0 ? grossProfit : 0;

    // Lissafin kididdigar rukunoni na gaibu don adana lambobi a maɓallan tace bayanai
    const countByFilter = (filterType: string) => {
      const now = new Date();
      return (trades || []).filter((t: any) => {
        if (!t.date) return false;
        const d = new Date(t.date);
        if (filterType === 'weekly') return d >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (filterType === 'monthly') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        if (filterType === 'yearly') return d.getFullYear() === now.getFullYear();
        return true;
      }).length;
    };

    return {
      netPnL,
      winRate: winRate.toFixed(1),
      profitFactor: profitFactor.toFixed(2),
      totalTrades,
      totalWins,
      totalLosses,
      weeklyCount: countByFilter('weekly'),
      monthlyCount: countByFilter('monthly'),
      yearlyCount: countByFilter('yearly'),
    };
  }, [trades, filteredTrades]);

  const cardStyle = `p-4 rounded-xl border transition-all ${isDark ? 'bg-[#121926] border-slate-800/80' : 'bg-white border-slate-200'}`;

  return (
    <div className="space-y-4">
      {/* TRADING CORE METRICS GRID (NO PURPLE BORDERS) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className={cardStyle}>
          <p className="text-xs font-medium text-slate-400">NET P&L</p>
          <p className={`text-lg font-bold mt-1 ${stats.netPnL >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {stats.netPnL >= 0 ? `+$${stats.netPnL.toLocaleString()}` : `-$${Math.abs(stats.netPnL).toLocaleString()}`}
          </p>
        </div>

        <div className={cardStyle}>
          <p className="text-xs font-medium text-slate-400">WIN RATE</p>
          <p className="text-lg font-bold text-blue-500 mt-1">{stats.winRate}%</p>
        </div>

        <div className={cardStyle}>
          <p className="text-xs font-medium text-slate-400">PROFIT FACTOR</p>
          <p className="text-lg font-bold text-amber-500 mt-1">{stats.profitFactor}</p>
        </div>

        <div className={cardStyle}>
          <p className="text-xs font-medium text-slate-400">TOTAL TRADES</p>
          <p className="text-lg font-bold mt-1">{stats.totalTrades}</p>
        </div>

        <div className={cardStyle}>
          <p className="text-xs font-medium text-slate-400">TOTAL WIN</p>
          <p className="text-lg font-bold text-emerald-500 mt-1">{stats.totalWins}</p>
        </div>

        <div className={cardStyle}>
          <p className="text-xs font-medium text-slate-400">TOTAL LOSS</p>
          <p className="text-lg font-bold text-rose-500 mt-1">{stats.totalLosses}</p>
        </div>
      </div>

      {/* TIMEFRAME FILTER CARDS (LIVE CLICKABLE BUTTONS) */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: 'weekly', label: 'WEEKLY', count: stats.weeklyCount },
          { id: 'monthly', label: 'MONTHLY', count: stats.monthlyCount },
          { id: 'yearly', label: 'YEARLY', count: stats.yearlyCount },
        ].map((item) => {
          const isActive = activeFilter === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveFilter(isActive ? 'all' : (item.id as any))}
              className={`p-3 rounded-xl border text-center transition-all active:scale-98 flex flex-col items-center justify-center ${
                isActive 
                  ? 'bg-blue-600/10 border-blue-500 text-blue-500 font-semibold' 
                  : isDark ? 'bg-[#121926] border-slate-800/80 hover:bg-slate-800/50 text-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="text-[10px] tracking-wider text-slate-400 block">{item.label}</span>
              <span className="text-base font-bold mt-0.5">{item.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
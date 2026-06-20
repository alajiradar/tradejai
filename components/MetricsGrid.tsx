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
  
  // Ingantaccen mai fassara kwanan wata don kowane irin tsari (dd/mm/yyyy ko yyyy/mm/dd ko ISO)
  const parseTradeDate = (dateVal: any): Date | null => {
    if (!dateVal) return null;
    if (dateVal instanceof Date) return isNaN(dateVal.getTime()) ? null : dateVal;
    
    const str = String(dateVal).trim();
    
    // Idan kwanan watan yana ɗauke da alamar "/"
    if (str.includes('/')) {
      const parts = str.split(' ');
      const dateParts = parts[0].split('/');
      if (dateParts.length === 3) {
        let day, month, year;
        
        // Idan ya fara da shekara (yyyy/mm/dd)
        if (dateParts[0].length === 4) {
          year = parseInt(dateParts[0], 10);
          month = parseInt(dateParts[1], 10) - 1;
          day = parseInt(dateParts[2], 10);
        } else {
          // Idan ya fara da rana (dd/mm/yyyy)
          day = parseInt(dateParts[0], 10);
          month = parseInt(dateParts[1], 10) - 1;
          year = parseInt(dateParts[2], 10);
        }
        
        if (parts[1]) {
          const timeParts = parts[1].split(':');
          const hour = parseInt(timeParts[0], 10) || 0;
          const minute = parseInt(timeParts[1], 10) || 0;
          return new Date(year, month, day, hour, minute);
        }
        return new Date(year, month, day);
      }
    }
    
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  };

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

    // Lissafin ƙididdigar kowane rukuni na lokaci guda ɗaya da zai yi daidai da babban shafi
    const countByFilter = (filterType: string) => {
      const now = new Date();
      
      // 1. Farkon makon nan (Daga Lahadi)
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      // 2. Farkon watan nan (Ranar 1 ga wata)
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      
      // 3. Shekarar da ta gabata (Last Year)
      const lastYear = now.getFullYear() - 1;

      return (trades || []).filter((t: any) => {
        const dateRaw = t.entry_date || t.date || t.entryDate || t.created_at || t.createdAt;
        const d = parseTradeDate(dateRaw);
        if (!d) return false;

        if (filterType === 'weekly') {
          return d >= startOfWeek && d <= now;
        }
        if (filterType === 'monthly') {
          return d >= startOfMonth && d <= now;
        }
        if (filterType === 'yearly') {
          return d.getFullYear() === lastYear;
        }
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
          { id: 'yearly', label: 'LAST YEAR', count: stats.yearlyCount },
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
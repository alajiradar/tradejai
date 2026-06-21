'use client';

import React, { useState } from 'react';
import BottomNav from '@/components/BottomNav';

export default function Analytics() {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'calendar' | 'ai-coach' | 'settings'>('analytics');
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  // Bayanan kwaikwayo (Mock Data) don tsara UI/UX na sashen Analytics
  const behavioralStats = [
    { name: 'FOMO Trades Identified', value: '4', status: 'Warning', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Revenge Trading Triggers', value: '1', status: 'Good', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Over-Trading Risk Level', value: 'Low', status: 'Safe', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Avg. Holding Time', value: '42 mins', status: 'Optimal', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  const assetPerformance = [
    { pair: 'EURUSD', trades: 12, winRate: '66%', pnl: '+$1,240.00', isProfit: true },
    { pair: 'GBPUSD', trades: 8, winRate: '50%', pnl: '+$450.00', isProfit: true },
    { pair: 'NAS100', trades: 5, winRate: '20%', pnl: '-$820.00', isProfit: false },
    { pair: 'BTCUSD', trades: 3, winRate: '33%', pnl: '-$150.00', isProfit: false },
  ];

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-[#0b121f]' : 'bg-slate-50'} ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* HEADER */}
      <header className={`sticky top-0 z-40 px-4 py-4 backdrop-blur-md border-b flex justify-between items-center ${isDark ? 'bg-[#0b121f]/80 border-slate-900/60' : 'bg-white/80 border-slate-200'}`}>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Performance Analytics</h1>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Kula da dabi'un ciniki da dabarun kasuwancinka</p>
        </div>
        <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-lg border transition-all ${isDark ? 'border-slate-800 hover:bg-slate-800 text-amber-400' : 'border-slate-200 hover:bg-slate-100 text-slate-700'}`}>
          {isDark ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M7.757 6.343l.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        
        {/* TIMEFRAME SELECTOR */}
        <div className="flex justify-end">
          <div className={`p-1 rounded-lg border flex gap-1 ${isDark ? 'bg-[#121926]/60 border-slate-900' : 'bg-white border-slate-200'}`}>
            {(['weekly', 'monthly', 'yearly'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 text-xs font-medium rounded-md uppercase tracking-wider transition-all ${
                  timeframe === t 
                    ? 'bg-blue-600 text-white shadow' 
                    : `${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* BEHAVIORAL & PSYCHOLOGY MATRIX (Almanac na Dabi'u) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {behavioralStats.map((stat, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${stat.bg} ${stat.color}`}>
                {stat.status}
              </span>
              <h4 className="text-2xl font-bold tracking-tight mt-2">{stat.value}</h4>
              <p className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.name}</p>
            </div>
          ))}
        </div>

        {/* VISUAL CHARTS PLACEHOLDER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Win/Loss Consistency Chart */}
          <div className={`lg:col-span-2 p-5 rounded-xl border flex flex-col justify-between h-64 ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold tracking-tight">Equity Curve & Growth</h3>
              <span className="text-xs text-emerald-500 font-semibold">+$870.00 Net</span>
            </div>
            {/* Minimal Premium Line Graphic Simulation using SVG */}
            <div className="w-full h-32 flex items-end pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0,25 Q15,28 30,18 T60,12 T90,5 T100,2" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                <path d="M0,25 Q15,28 30,18 T60,12 T90,5 T100,2 L100,30 L0,30 Z" fill="url(#chart-gradient)" opacity="0.05" />
                <defs>
                  <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className={`flex justify-between text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
            </div>
          </div>

          {/* Win Rate Distribution Circle */}
          <div className={`p-5 rounded-xl border flex flex-col justify-between ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
            <h3 className="text-sm font-bold tracking-tight">Overall Win Rate</h3>
            <div className="relative flex items-center justify-center my-auto">
              {/* Circular progress display */}
              <div className="w-28 h-28 rounded-full border-4 border-slate-700/30 flex items-center justify-center border-t-blue-500 border-r-blue-500">
                <span className="text-xl font-black">58%</span>
              </div>
            </div>
            <div className="flex justify-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Wins</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-600"></span> Losses</div>
            </div>
          </div>
        </div>

        {/* ASSET PERFORMANCE TABLE */}
        <div className={`p-4 sm:p-5 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
          <h3 className="text-sm font-bold tracking-tight mb-4">Performance by Instrument</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'} font-semibold`}>
                  <th className="pb-3">Asset/Pair</th>
                  <th className="pb-3">Total Trades</th>
                  <th className="pb-3">Win Rate</th>
                  <th className="pb-3 text-right">Net PnL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/20">
                {assetPerformance.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-500/5 transition-colors">
                    <td className="py-3 font-bold tracking-tight text-blue-500">{item.pair}</td>
                    <td className="py-3 font-medium">{item.trades}</td>
                    <td className="py-3 font-semibold">{item.winRate}</td>
                    <td className={`py-3 font-bold text-right ${item.isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {item.pnl}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* BOTTOM NAVIGATION */}
      <BottomNav isDark={isDark} />
    </div>
  );
}
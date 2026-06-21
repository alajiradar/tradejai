'use client';

import React, { useState } from 'react';
import BottomNav from '@/components/BottomNav';

export default function Analytics() {
  const [isDark, setIsDark] = useState(true);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  // --- MOCK DATA STRUCTURES MAPPED TO YOUR 10 MVP REQUIREMENTS ---

  // 1 & 3. Performance Overview & Streak Analytics
  const overviewStats = {
    totalTrades: 140,
    totalWins: 85,
    totalLosses: 45,
    totalBreakEven: 10,
    winRate: '60.7%',
    lossRate: '32.1%',
    breakEvenRate: '7.2%',
    netPnl: '+$6,820.00',
    grossProfit: '+$11,200.00',
    grossLoss: '-$4,380.00',
    profitFactor: '2.55',
    avgWin: '+$131.76',
    avgLoss: '-$97.33',
    riskRewardAvg: '1:1.8',
    expectancy: '+$42.30',
    largestWin: '+$1,450.00',
    largestLoss: '-$380.00',
    currentWinStreak: 4,
    currentLossStreak: 0,
    longestWinStreak: 9,
    longestLossStreak: 3
  };

  // 4. Market Analytics
  const marketAnalytics = [
    { market: 'Forex', trades: 50, winRate: '70%', pnl: '+$2,500.00', isProfit: true },
    { market: 'Crypto', trades: 30, winRate: '40%', pnl: '-$400.00', isProfit: false },
    { market: 'Indices', trades: 60, winRate: '75%', pnl: '+$4,720.00', isProfit: true },
  ];

  // 5. Asset Analytics
  const assetAnalytics = [
    { asset: 'EURUSD', trades: 40, winRate: '72%', pnl: '+$1,500.00', isProfit: true },
    { asset: 'XAUUSD', trades: 20, winRate: '45%', pnl: '-$700.00', isProfit: false },
    { asset: 'NAS100', trades: 60, winRate: '80%', pnl: '+$4,000.00', isProfit: true },
    { asset: 'BTCUSD', trades: 20, winRate: '35%', pnl: '-$200.00', isProfit: false },
  ];

  // 6. Strategy Analytics
  const strategyAnalytics = [
    { strategy: 'ICT Silver Bullet', trades: 40, winRate: '78%', pnl: '+$3,500.00', isProfit: true },
    { strategy: 'SMC Orderflow', trades: 25, winRate: '52%', pnl: '+$200.00', isProfit: true },
    { strategy: 'High/Low Breakout', trades: 15, winRate: '40%', pnl: '-$500.00', isProfit: false },
  ];

  // 7. Session Analytics
  const sessionAnalytics = [
    { session: 'London Session', winRate: '72%', pnl: '+$2,000.00', isProfit: true },
    { session: 'New York Session', winRate: '65%', pnl: '+$1,500.00', isProfit: true },
    { session: 'Asian Session', winRate: '35%', pnl: '-$700.00', isProfit: false },
  ];

  // 8. Trade Direction Analytics
  const directionAnalytics = [
    { direction: 'Buy (Longs)', winRate: '70%', pnl: '+$2,500.00', isProfit: true },
    { direction: 'Sell (Shorts)', winRate: '45%', pnl: '-$800.00', isProfit: false },
  ];

  // 9. Time Analytics (Day of Week)
  const dayOfWeekAnalytics = [
    { day: 'Monday', winRate: '80%', progress: 80 },
    { day: 'Tuesday', winRate: '75%', progress: 75 },
    { day: 'Wednesday', winRate: '40%', progress: 40 },
    { day: 'Thursday', winRate: '70%', progress: 70 },
    { day: 'Friday', winRate: '35%', progress: 35 },
  ];

  // 10. Psychology Analytics
  const psychologyAnalytics = [
    { emotion: 'Disciplined', trades: 62, winRate: '75%', color: 'text-emerald-500' },
    { emotion: 'Calm', trades: 38, winRate: '70%', color: 'text-teal-500' },
    { emotion: 'Fear / Hesitation', trades: 18, winRate: '30%', color: 'text-amber-500' },
    { emotion: 'FOMO', trades: 12, winRate: '20%', color: 'text-rose-400' },
    { emotion: 'Revenge Trading', trades: 7, winRate: '10%', color: 'text-rose-600' },
    { emotion: 'Over-trading', trades: 3, winRate: '10%', color: 'text-red-500' },
  ];

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-300 ${isDark ? 'bg-[#0b121f]' : 'bg-slate-50'} ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* HEADER SECTION */}
      <header className={`sticky top-0 z-40 px-4 py-4 backdrop-blur-md border-b flex justify-between items-center ${isDark ? 'bg-[#0b121f]/80 border-slate-900/60' : 'bg-white/80 border-slate-200'}`}>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Performance Analytics</h1>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Advanced system insights & trader behavior metrics</p>
        </div>
        <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-lg border transition-all ${isDark ? 'border-slate-800 hover:bg-slate-800 text-amber-400' : 'border-slate-200 hover:bg-slate-100 text-slate-700'}`}>
          {isDark ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M7.757 6.343l.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" /></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        
        {/* TIMEFRAME CONTROLLER */}
        <div className="flex justify-end">
          <div className={`p-1 rounded-lg border flex gap-1 ${isDark ? 'bg-[#121926]/60 border-slate-900' : 'bg-white border-slate-200'}`}>
            {(['weekly', 'monthly', 'yearly'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 text-xs font-semibold rounded-md uppercase tracking-wider transition-all ${
                  timeframe === t ? 'bg-blue-600 text-white shadow' : `${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 1. PERFORMANCE OVERVIEW MATRIX */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Performance Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 font-medium block">Total Trades</span>
              <span className="text-xl font-bold tracking-tight">{overviewStats.totalTrades}</span>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-emerald-500 font-medium block">Total Wins</span>
              <span className="text-xl font-bold tracking-tight text-emerald-500">{overviewStats.totalWins}</span>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-rose-500 font-medium block">Total Losses</span>
              <span className="text-xl font-bold tracking-tight text-rose-500">{overviewStats.totalLosses}</span>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-400 font-medium block">Break Even</span>
              <span className="text-xl font-bold tracking-tight text-slate-400">{overviewStats.totalBreakEven}</span>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-blue-500 font-medium block">Win Rate</span>
              <span className="text-xl font-bold tracking-tight text-blue-500">{overviewStats.winRate}</span>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 font-medium block">Net P&L</span>
              <span className="text-xl font-bold tracking-tight text-emerald-500">{overviewStats.netPnl}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#121926]/20 border-slate-900/60' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 block">Gross Profit</span>
              <span className="text-sm font-semibold text-emerald-500">{overviewStats.grossProfit}</span>
            </div>
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#121926]/20 border-slate-900/60' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 block">Gross Loss</span>
              <span className="text-sm font-semibold text-rose-500">{overviewStats.grossLoss}</span>
            </div>
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#121926]/20 border-slate-900/60' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 block">Profit Factor</span>
              <span className="text-sm font-semibold text-blue-500">{overviewStats.profitFactor}</span>
            </div>
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#121926]/20 border-slate-900/60' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 block">Avg Win / Avg Loss</span>
              <span className="text-sm font-semibold">{overviewStats.avgWin} / {overviewStats.avgLoss}</span>
            </div>
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#121926]/20 border-slate-900/60' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 block">Risk Reward Avg</span>
              <span className="text-sm font-semibold text-indigo-400">{overviewStats.riskRewardAvg}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#121926]/20 border-slate-900/60' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 block">Expectancy</span>
              <span className="text-sm font-semibold text-emerald-400">{overviewStats.expectancy}</span>
            </div>
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#121926]/20 border-slate-900/60' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 block">Largest Win</span>
              <span className="text-sm font-semibold text-emerald-500">{overviewStats.largestWin}</span>
            </div>
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#121926]/20 border-slate-900/60' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 block">Largest Loss</span>
              <span className="text-sm font-semibold text-rose-500">{overviewStats.largestLoss}</span>
            </div>
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#121926]/20 border-slate-900/60' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 block">Loss / BE Rate</span>
              <span className="text-sm font-semibold text-slate-400">{overviewStats.lossRate} / {overviewStats.breakEvenRate}</span>
            </div>
          </div>
        </section>

        {/* 2 & 3. EQUITY CURVE & STREAK ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Display */}
          <section className={`lg:col-span-2 p-5 rounded-xl border flex flex-col justify-between h-72 ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">2. Equity Curve & Growth Chart</h2>
                <p className="text-[10px] text-slate-500">Cumulative performance growth metric representation</p>
              </div>
              <span className="text-xs text-emerald-500 font-bold">+$6,820.00 Net Growth</span>
            </div>
            <div className="w-full h-36 flex items-end pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0,25 Q15,26 30,19 T60,14 T85,6 T100,2" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                <path d="M0,25 Q15,26 30,19 T60,14 T85,6 T100,2 L100,30 L0,30 Z" fill="url(#equity-gradient)" opacity="0.05" />
                <defs>
                  <linearGradient id="equity-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className={`flex justify-between text-[9px] uppercase font-bold tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              <span>Sample Period Start</span><span>Drawdown Safe Level</span><span>Current Matrix Point</span>
            </div>
          </section>

          {/* Streaks Matrix */}
          <section className={`p-5 rounded-xl border flex flex-col justify-between ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">3. Streak Analytics</h2>
            <div className="divide-y divide-slate-800/40 my-auto">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-xs text-slate-500">Current Winning Streak</span>
                <span className="text-sm font-bold text-emerald-500">{overviewStats.currentWinStreak} Trades</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-xs text-slate-500">Current Losing Streak</span>
                <span className="text-sm font-bold text-rose-500">{overviewStats.currentLossStreak} Trades</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-xs text-slate-500">Longest Winning Streak</span>
                <span className="text-sm font-bold text-emerald-400">{overviewStats.longestWinStreak} Trades</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-xs text-slate-500">Longest Losing Streak</span>
                <span className="text-sm font-bold text-rose-400">{overviewStats.longestLossStreak} Trades</span>
              </div>
            </div>
          </section>
        </div>

        {/* TABLES LOWER CONTAINER (MARKET, ASSET, STRATEGY, SESSION, DIRECTION) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 4. MARKET ANALYTICS */}
          <section className={`p-4 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">4. Market Analytics</h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800/40 text-slate-500 pb-2">
                  <th className="pb-2">Market Segment</th>
                  <th className="pb-2">Trades</th>
                  <th className="pb-2">Win Rate</th>
                  <th className="pb-2 text-right">Net P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10">
                {marketAnalytics.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-500/5">
                    <td className="py-2.5 font-bold">{item.market}</td>
                    <td className="py-2.5">{item.trades}</td>
                    <td className="py-2.5 text-blue-500 font-semibold">{item.winRate}</td>
                    <td className={`py-2.5 text-right font-bold ${item.isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>{item.pnl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* 5. ASSET ANALYTICS */}
          <section className={`p-4 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">5. Asset Analytics</h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800/40 text-slate-500 pb-2">
                  <th className="pb-2">Instrument</th>
                  <th className="pb-2">Trades</th>
                  <th className="pb-2">Win Rate</th>
                  <th className="pb-2 text-right">Net P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10">
                {assetAnalytics.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-500/5">
                    <td className="py-2.5 font-bold text-blue-400">{item.asset}</td>
                    <td className="py-2.5">{item.trades}</td>
                    <td className="py-2.5 text-blue-500 font-semibold">{item.winRate}</td>
                    <td className={`py-2.5 text-right font-bold ${item.isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>{item.pnl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* 6. STRATEGY ANALYTICS */}
          <section className={`p-4 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">6. Strategy Analytics</h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800/40 text-slate-500 pb-2">
                  <th className="pb-2">Trading Setup/Strategy</th>
                  <th className="pb-2">Trades</th>
                  <th className="pb-2">Win Rate</th>
                  <th className="pb-2 text-right">Net P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10">
                {strategyAnalytics.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-500/5">
                    <td className="py-2.5 font-semibold">{item.strategy}</td>
                    <td className="py-2.5">{item.trades}</td>
                    <td className="py-2.5 text-blue-500 font-semibold">{item.winRate}</td>
                    <td className={`py-2.5 text-right font-bold ${item.isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>{item.pnl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* 7. SESSION ANALYTICS */}
          <section className={`p-4 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">7. Session Analytics</h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800/40 text-slate-500 pb-2">
                  <th className="pb-2">Trading Session</th>
                  <th className="pb-2">Win Rate</th>
                  <th className="pb-2 text-right">Net P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10">
                {sessionAnalytics.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-500/5">
                    <td className="py-2.5 font-medium">{item.session}</td>
                    <td className="py-2.5 text-blue-500 font-semibold">{item.winRate}</td>
                    <td className={`py-2.5 text-right font-bold ${item.isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>{item.pnl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* 8 & 9. DIRECTION & TIME MATRIX */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 8. Trade Direction */}
          <section className={`p-4 rounded-xl border flex flex-col justify-between ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">8. Trade Direction Analytics</h3>
            <div className="space-y-3 my-auto">
              {directionAnalytics.map((item, i) => (
                <div key={i} className={`p-3 rounded-lg border ${isDark ? 'bg-[#0b121f]/60 border-slate-900' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>{item.direction}</span>
                    <span className={item.isProfit ? 'text-emerald-500' : 'text-rose-500'}>{item.pnl}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                    <span>Win Rate Profile</span>
                    <span className="text-blue-500 font-medium">{item.winRate}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 9. Time Analytics - Day of Week */}
          <section className={`md:col-span-2 p-4 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">9. Time Analytics (Day of Week Performance)</h3>
            <div className="space-y-2.5">
              {dayOfWeekAnalytics.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{item.day}</span>
                    <span className="text-blue-500 font-bold">{item.winRate} Win Rate</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${item.progress >= 70 ? 'bg-emerald-500' : item.progress >= 40 ? 'bg-blue-500' : 'bg-rose-500'}`} 
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 10. PSYCHOLOGY ANALYTICS (PROUD OUTSTANDING DIFFERENTIATOR) */}
        <section className={`p-5 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">10. Psychology & Behavioral Discipline Analytics</h3>
              <p className="text-[10px] text-slate-500">Core metrics computed from mandatory mental trigger tracking logs</p>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-md mt-1 sm:mt-0">
              Tradejai Core Engine
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {psychologyAnalytics.map((item, i) => (
              <div key={i} className={`p-3.5 rounded-xl border text-center transition-all ${isDark ? 'bg-[#0b121f]/40 border-slate-900 hover:border-slate-800' : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'}`}>
                <span className={`text-lg font-black tracking-tight ${item.color}`}>{item.winRate}</span>
                <h4 className="text-xs font-bold mt-1 truncate">{item.emotion}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{item.trades} logged trades</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* FIXED BOTTOM NAVIGATION CHIP ENGINE */}
      <BottomNav isDark={isDark} />
    </div>
  );
}
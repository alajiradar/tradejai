'use client';

import React, { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import EquityChart from '@/components/EquityChart'; // Shigo da EquityChart dinmu
import { useTrades } from '@/hooks/useTrades';
import { calculateAnalytics } from '@/analytics/analyticsCalculations';
import { MarketCategory, TradingSession, Trade } from '@/types/trade';

export default function Analytics() {
  const [isDark, setIsDark] = useState(true);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  
  const { allTrades: trades = [], loading = false } = useTrades() || {};

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-[#0b121f]' : 'bg-slate-50'}`}>
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium tracking-wider uppercase opacity-60">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  const analytics = calculateAnalytics(trades);
  const closedTrades = trades.filter((t: Trade) => t.pnl !== null && t.status !== null);
  
  const totalWins = closedTrades.filter((t: Trade) => t.status === 'WIN').length;
  const totalLosses = closedTrades.filter((t: Trade) => t.status === 'LOSS').length;
  const totalBE = closedTrades.filter((t: Trade) => t.status === 'BE').length;
  const lossRate = closedTrades.length === 0 ? 0 : (totalLosses / closedTrades.length) * 100;

  const assetMap: Record<string, { pnl: number; wins: number; total: number }> = {};
  const strategyMap: Record<string, { pnl: number; wins: number; total: number }> = {};
  const directionMap = { BUY: { pnl: 0, wins: 0, total: 0 }, SELL: { pnl: 0, wins: 0, total: 0 } };

  closedTrades.forEach((t: Trade) => {
    const pnl = t.pnl || 0;
    const isWin = t.status === 'WIN';
    
    if (t.asset) {
      if (!assetMap[t.asset]) assetMap[t.asset] = { pnl: 0, wins: 0, total: 0 };
      assetMap[t.asset].pnl += pnl;
      assetMap[t.asset].total++;
      if (isWin) assetMap[t.asset].wins++;
    }
    if (t.strategy) {
      if (!strategyMap[t.strategy]) strategyMap[t.strategy] = { pnl: 0, wins: 0, total: 0 };
      strategyMap[t.strategy].pnl += pnl;
      strategyMap[t.strategy].total++;
      if (isWin) strategyMap[t.strategy].wins++;
    }
    
    if (t.trade_type === 'BUY' || t.trade_type === 'SELL') {
      const dir = t.trade_type as 'BUY' | 'SELL';
      directionMap[dir].pnl += pnl;
      directionMap[dir].total++;
      if (isWin) directionMap[dir].wins++;
    }
  });

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
              <span className="text-xl font-bold tracking-tight">{analytics.riskAndActivity.totalTrades}</span>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-emerald-500 font-medium block">Total Wins</span>
              <span className="text-xl font-bold tracking-tight text-emerald-500">{totalWins}</span>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-rose-500 font-medium block">Total Losses</span>
              <span className="text-xl font-bold tracking-tight text-rose-500">{totalLosses}</span>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-400 font-medium block">Break Even</span>
              <span className="text-xl font-bold tracking-tight text-slate-400">{totalBE}</span>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-blue-500 font-medium block">Win Rate</span>
              <span className="text-xl font-bold tracking-tight text-blue-500">{analytics.performance.winRate.toFixed(1)}%</span>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 font-medium block">Net P&L</span>
              <span className={`text-xl font-bold tracking-tight ${analytics.performance.netPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {analytics.performance.netPnl >= 0 ? '+' : ''}{formatCurrency(analytics.performance.netPnl)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#121926]/20 border-slate-900/60' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 block">Gross Profit</span>
              <span className="text-sm font-semibold text-emerald-500">+{formatCurrency(analytics.performance.grossProfit)}</span>
            </div>
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#121926]/20 border-slate-900/60' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 block">Gross Loss</span>
              <span className="text-sm font-semibold text-rose-500">-{formatCurrency(analytics.performance.grossLoss)}</span>
            </div>
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#121926]/20 border-slate-900/60' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 block">Profit Factor</span>
              <span className="text-sm font-semibold text-blue-500">{analytics.performance.profitFactor.toFixed(2)}</span>
            </div>
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#121926]/20 border-slate-900/60' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 block">Avg Win / Avg Loss</span>
              <span className="text-sm font-semibold text-xs truncate">
                <span className="text-emerald-500">+{formatCurrency(analytics.performance.averageWin)}</span> / <span className="text-rose-500">-{formatCurrency(analytics.performance.averageLoss)}</span>
              </span>
            </div>
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#121926]/20 border-slate-900/60' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 block">Risk Reward Avg</span>
              <span className="text-sm font-semibold text-indigo-400">1:{analytics.riskAndActivity.averageRiskReward.toFixed(1)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#121926]/20 border-slate-900/60' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 block">Activity (Weekly / Monthly)</span>
              <span className="text-sm font-semibold text-emerald-400">{analytics.riskAndActivity.weeklyTrades.toFixed(1)} / {analytics.riskAndActivity.monthlyTrades.toFixed(1)}</span>
            </div>
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#121926]/20 border-slate-900/60' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 block">Largest Win</span>
              <span className="text-sm font-semibold text-emerald-500">+{formatCurrency(analytics.riskAndActivity.bestTrade)}</span>
            </div>
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#121926]/20 border-slate-900/60' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 block">Largest Loss</span>
              <span className="text-sm font-semibold text-rose-500">-{formatCurrency(Math.abs(analytics.riskAndActivity.worstTrade))}</span>
            </div>
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#121926]/20 border-slate-900/60' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] text-slate-500 block">Loss / BE Rate</span>
              <span className="text-sm font-semibold text-slate-400">{lossRate.toFixed(1)}% / {analytics.performance.breakEvenRate.toFixed(1)}%</span>
            </div>
          </div>
        </section>

        {/* 2 & 3. EQUITY CURVE WITH THE DEDICATED COMPONENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className={`lg:col-span-2 p-5 rounded-xl border flex flex-col justify-between h-72 ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">2. Equity Curve & Growth Chart</h2>
                <p className="text-[10px] text-slate-500">Real-time dynamic account metric representation</p>
              </div>
              <span className={`text-xs font-bold ${analytics.performance.netPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {analytics.performance.netPnl >= 0 ? '+' : ''}{formatCurrency(analytics.performance.netPnl)} Net Growth
              </span>
            </div>
            
            {/* AN NAN MAZAN JE: Muna tura closedTrades cikin file din EquityChart */}
            <div className="w-full flex-1 min-h-[160px] relative">
              <EquityChart trades={closedTrades} />
            </div>

            <div className={`flex justify-between text-[9px] uppercase font-bold tracking-widest mt-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              <span>Start</span><span>Safe Horizon</span><span>Current Balance</span>
            </div>
          </section>

          <section className={`p-5 rounded-xl border flex flex-col justify-between ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">3. Consistency Indicators</h2>
            <div className="divide-y divide-slate-800/40 my-auto">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-xs text-slate-500">Profit Factor Health</span>
                <span className={`text-sm font-bold ${analytics.performance.profitFactor >= 1.5 ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {analytics.performance.profitFactor >= 1.5 ? 'Strong' : 'Awaiting Data'}
                </span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-xs text-slate-500">Sample Size Status</span>
                <span className="text-sm font-bold text-blue-500">{analytics.riskAndActivity.totalTrades} Trades Logged</span>
              </div>
            </div>
          </section>
        </div>

        {/* TABLES LOWER CONTAINER */}
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
                {analytics.markets.length === 0 ? (
                  <tr><td colSpan={4} className="py-4 text-center text-slate-500 text-xs">No market data logged yet</td></tr>
                ) : (
                  analytics.markets.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-500/5">
                      <td className="py-2.5 font-bold">{item.market}</td>
                      <td className="py-2.5">{item.totalTrades}</td>
                      <td className="py-2.5 text-blue-500 font-semibold">{item.winRate.toFixed(1)}%</td>
                      <td className={`py-2.5 text-right font-bold ${item.netPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {item.netPnl >= 0 ? '+' : ''}{formatCurrency(item.netPnl)}
                      </td>
                    </tr>
                  ))
                )}
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
                {Object.keys(assetMap).length === 0 ? (
                  <tr><td colSpan={4} className="py-4 text-center text-slate-500 text-xs">No assets logged yet</td></tr>
                ) : (
                  Object.keys(assetMap).slice(0, 5).map((asset, i) => {
                    const item = assetMap[asset];
                    const assetWinRate = (item.wins / item.total) * 100;
                    return (
                      <tr key={i} className="hover:bg-slate-500/5">
                        <td className="py-2.5 font-bold text-blue-400">{asset}</td>
                        <td className="py-2.5">{item.total}</td>
                        <td className="py-2.5 text-blue-500 font-semibold">{assetWinRate.toFixed(1)}%</td>
                        <td className={`py-2.5 text-right font-bold ${item.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {item.pnl >= 0 ? '+' : ''}{formatCurrency(item.pnl)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </section>

          {/* 6. STRATEGY ANALYTICS */}
          <section className={`p-4 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">6. Strategy Analytics</h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800/40 text-slate-500 pb-2">
                  <th className="pb-2">Setup/Strategy</th>
                  <th className="pb-2">Trades</th>
                  <th className="pb-2">Win Rate</th>
                  <th className="pb-2 text-right">Net P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10">
                {Object.keys(strategyMap).length === 0 ? (
                  <tr><td colSpan={4} className="py-4 text-center text-slate-500 text-xs">No strategies logged yet</td></tr>
                ) : (
                  Object.keys(strategyMap).slice(0, 5).map((strat, i) => {
                    const item = strategyMap[strat];
                    const stratWinRate = (item.wins / item.total) * 100;
                    return (
                      <tr key={i} className="hover:bg-slate-500/5">
                        <td className="py-2.5 font-semibold">{strat}</td>
                        <td className="py-2.5">{item.total}</td>
                        <td className="py-2.5 text-blue-500 font-semibold">{stratWinRate.toFixed(1)}%</td>
                        <td className={`py-2.5 text-right font-bold ${item.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {item.pnl >= 0 ? '+' : ''}{formatCurrency(item.pnl)}
                        </td>
                      </tr>
                    );
                  })
                )}
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
                  <th className="pb-2">Trades</th>
                  <th className="pb-2">Win Rate</th>
                  <th className="pb-2 text-right">Net P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10">
                {analytics.sessions.length === 0 ? (
                  <tr><td colSpan={4} className="py-4 text-center text-slate-500 text-xs">No session data logged yet</td></tr>
                ) : (
                  analytics.sessions.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-500/5">
                      <td className="py-2.5 font-medium">{item.session} Session</td>
                      <td className="py-2.5">{item.totalTrades}</td>
                      <td className="py-2.5 text-blue-500 font-semibold">{item.winRate.toFixed(1)}%</td>
                      <td className={`py-2.5 text-right font-bold ${item.netPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {item.netPnl >= 0 ? '+' : ''}{formatCurrency(item.netPnl)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </div>

        {/* 8 & 9. DIRECTION ANALYTICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className={`p-4 rounded-xl border flex flex-col justify-between ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">8. Trade Direction Analytics</h3>
            <div className="space-y-3 my-auto">
              {(['BUY', 'SELL'] as const).map((dir) => {
                const item = directionMap[dir];
                const dirWinRate = item.total === 0 ? 0 : (item.wins / item.total) * 100;
                return (
                  <div key={dir} className={`p-3 rounded-lg border ${isDark ? 'bg-[#0b121f]/60 border-slate-900' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>{dir === 'BUY' ? 'Buy (Longs)' : 'Sell (Shorts)'}</span>
                      <span className={item.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                        {item.pnl >= 0 ? '+' : ''}{formatCurrency(item.pnl)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                      <span>Win Rate ({item.total} trades)</span>
                      <span className="text-blue-500 font-medium">{dirWinRate.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className={`md:col-span-2 p-4 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">9. System Information</h3>
            <div className="p-4 rounded-lg flex items-center justify-center border border-dashed border-slate-800 text-xs text-slate-500 h-32">
              Advanced charts and sample period maps are active with real-time logging triggers.
            </div>
          </section>
        </div>

        {/* 10. PSYCHOLOGY ANALYTICS */}
        <section className={`p-5 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'}`}>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">10. Psychology Analytics</h3>
              <p className="text-[10px] text-slate-500">Core metrics computed from mental trigger tracking logs</p>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-md mt-1 sm:mt-0">
              Tradejai Core Engine
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {analytics.psychology.length === 0 ? (
              <div className="col-span-full py-4 text-center text-slate-500 text-xs">No psychology tags logged yet</div>
            ) : (
              analytics.psychology.map((item, i) => {
                const isGoodTag = ['Disciplined', 'Patient', 'Calm', 'Focused', 'Confident'].includes(item.tag);
                return (
                  <div key={i} className={`p-3.5 rounded-xl border text-center transition-all ${isDark ? 'bg-[#0b121f]/40 border-slate-900 hover:border-slate-800' : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'}`}>
                    <span className={`text-lg font-black tracking-tight ${isGoodTag ? 'text-emerald-500' : 'text-rose-400'}`}>
                      {item.winRate.toFixed(1)}%
                    </span>
                    <h4 className="text-xs font-bold mt-1 truncate">{item.tag}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.count} trades logged</p>
                    <p className={`text-[10px] font-medium mt-1 ${item.netPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {item.netPnl >= 0 ? '+' : ''}{formatCurrency(item.netPnl)}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </section>

      </main>

      <BottomNav isDark={isDark} />
    </div>
  );
}
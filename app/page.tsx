'use client';

import React, { useState, useEffect } from 'react';
import MetricsGrid from '@/components/MetricsGrid';
import { TradeTable } from '@/components/TradeTable'; 
import { TradeForm } from '@/components/TradeForm';
import BottomNav from '@/components/BottomNav'; 
import { useTrades } from '@/hooks/useTrades';

export default function Home() {
  const { allTrades = [], loading, addTrade } = useTrades();
  const [isDark, setIsDark] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'weekly' | 'monthly' | 'yearly'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'calendar' | 'ai-coach' | 'settings'>('dashboard');

  // Tace Trades dangane da lokacin da aka zaɓa (Live Filtering Engine)
  const filteredTrades = React.useMemo(() => {
    const now = new Date();
    return (allTrades || []).filter((trade: any) => {
      if (!trade.date) return activeFilter === 'all';
      const tradeDate = new Date(trade.date);
      
      if (activeFilter === 'weekly') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return tradeDate >= oneWeekAgo;
      }
      if (activeFilter === 'monthly') {
        return tradeDate.getMonth() === now.getMonth() && tradeDate.getFullYear() === now.getFullYear();
      }
      if (activeFilter === 'yearly') {
        return tradeDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [allTrades, activeFilter]);

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-[#0b121f] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* 1. SABON HEADER NAVBAR (UI/UX SIMPLIFIED) */}
      <header className={`sticky top-0 z-40 px-4 py-4 backdrop-blur-md border-b flex justify-between items-center ${isDark ? 'bg-[#0b121f]/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">Tradejai</h1>
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-lg border transition-all ${isDark ? 'border-slate-800 hover:bg-slate-800 text-amber-400' : 'border-slate-200 hover:bg-slate-100 text-slate-700'}`}>
            {isDark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M7.757 6.343l.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
          {/* Notification Bell */}
          <button className={`p-2 rounded-lg border ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </button>
        </div>
      </header>

      {/* DYNAMIC VIEW MANAGER */}
      <main className="max-w-7xl mx-auto px-4 pt-6">
        {activeTab === 'dashboard' ? (
          <div className="space-y-6">
            {/* 2. METRICS GRID & LIVE TIMEFRAME FILTERS */}
            <MetricsGrid 
              trades={allTrades} 
              filteredTrades={filteredTrades}
              activeFilter={activeFilter} 
              setActiveFilter={setActiveFilter} 
              isDark={isDark} 
            />

            {/* RECENT TRADES CONTAINER */}
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#121926] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold tracking-tight">Recent Trades</h3>
                {activeFilter !== 'all' && (
                  <button onClick={() => setActiveFilter('all')} className="text-xs font-semibold text-blue-500 hover:underline">Clear Filter</button>
                )}
              </div>
              <TradeTable trades={filteredTrades} isDark={isDark} />
            </div>
          </div>
        ) : (
          /* 5. EMPTY STATES FOR OTHER UNBUILT TABS */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className={`p-4 rounded-full mb-4 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            </div>
            <h3 className="text-lg font-bold">Sashen {activeTab.toUpperCase()}</h3>
            <p className={`text-sm max-w-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Muna kammala Dashboard za mu dawo mu gina wannan shafin daki-daki.</p>
          </div>
        )}
      </main>

      {/* 4. REPOSITIONED FLOATING ACTION BUTTON FOR ADD TRADE */}
      {activeTab === 'dashboard' && (
        <button 
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-24 right-5 z-50 p-4 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center border border-blue-500/50"
          aria-label="Add Trade"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
        </button>
      )}

      {/* 🟢 MODAL DIALOG FOR ENTERING NEW TRADES (GYARARREN TSARI MAI FITOWA A TSAKIYA) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl relative max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
            <TradeForm 
              onClose={() => setIsFormOpen(false)} 
              onAdd={addTrade} 
              isDark={isDark} 
            />
          </div>
        </div>
      )}

      {/* 5. PROFESSIONAL BOTTOM NAVIGATION BAR */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isDark={isDark} />
    </div>
  );
}
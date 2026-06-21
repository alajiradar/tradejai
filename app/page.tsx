'use client';

import React, { useState } from 'react';
import MetricsGrid from '@/components/MetricsGrid';
import { TradeTable } from '@/components/TradeTable'; 
import { TradeForm } from '@/components/TradeForm';
import BottomNav from '@/components/BottomNav'; 
import { useTrades } from '@/hooks/useTrades';

export default function Home() {
  const { allTrades = [], loading, addTrade, deleteTrade, updateTrade } = useTrades();
  const [isDark, setIsDark] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'weekly' | 'monthly' | 'yearly'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'calendar' | 'ai-coach' | 'settings'>('dashboard');
  const [showAllTrades, setShowAllTrades] = useState(false);
  const [editingTrade, setEditingTrade] = useState<any | null>(null);

  // Timeframe filtering engine configured dynamically to isolate exact calendar matches
  const filteredTrades = React.useMemo(() => {
    const now = new Date();

    // Amintaccen mai fassara kwanan wata don daidaituwa tsakanin shafuka
    const parseTradeDate = (dateVal: any): Date | null => {
      if (!dateVal) return null;
      if (dateVal instanceof Date) return isNaN(dateVal.getTime()) ? null : dateVal;
      
      const str = String(dateVal).trim();
      
      if (str.includes('/')) {
        const parts = str.split(' ');
        const dateParts = parts[0].split('/');
        if (dateParts.length === 3) {
          let day, month, year;
          
          if (dateParts[0].length === 4) {
            year = parseInt(dateParts[0], 10);
            month = parseInt(dateParts[1], 10) - 1;
            day = parseInt(dateParts[2], 10);
          } else {
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

    // Lissafin rukunonin lokaci daidai da na MetricsGrid
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const lastYear = now.getFullYear() - 1;

    return (allTrades || []).filter((trade: any) => {
      if (activeFilter === 'all') return true;

      const dateString = trade.entry_time || trade.entry_date || trade.date || trade.entryDate || trade.created_at || trade.createdAt; 
      if (!dateString) return false;

      const tradeDate = parseTradeDate(dateString);
      if (!tradeDate) return false;
      
      if (activeFilter === 'weekly') {
        return tradeDate >= startOfWeek && tradeDate <= now;
      }
      if (activeFilter === 'monthly') {
        return tradeDate >= startOfMonth && tradeDate <= now;
      }
      if (activeFilter === 'yearly') {
        // Maida shi ya tace na "Last Year" (2025) kamar yadda katin kasa yake nunawa
        return tradeDate.getFullYear() === lastYear;
      }
      return true;
    });
  }, [allTrades, activeFilter]);

  const displayedTrades = showAllTrades ? filteredTrades : filteredTrades.slice(0, 5);

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-[#0b121f]' : 'bg-slate-50'} ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* HEADER NAVBAR */}
      <header className={`sticky top-0 z-40 px-4 py-4 backdrop-blur-md border-b flex justify-between items-center ${isDark ? 'bg-[#0b121f]/80 border-slate-900/60' : 'bg-white/80 border-slate-200'}`}>
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">Tradejai</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-lg border transition-all ${isDark ? 'border-slate-800 hover:bg-slate-800 text-amber-400' : 'border-slate-200 hover:bg-slate-100 text-slate-700'}`}>
            {isDark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M7.757 6.343l.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
          <button className={`p-2 rounded-lg border ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </button>
        </div>
      </header>

      {/* DYNAMIC VIEW MANAGER */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 pt-6">
        {activeTab === 'dashboard' ? (
          <div className="space-y-6">
            <MetricsGrid 
              trades={allTrades} 
              filteredTrades={filteredTrades}
              activeFilter={activeFilter} 
              setActiveFilter={setActiveFilter} 
              isDark={isDark} 
            />

            <div className={`p-4 sm:p-5 rounded-xl border ${isDark ? 'bg-[#121926]/40 border-slate-900' : 'bg-white border-slate-100'} w-full`}>
              <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="text-base font-bold tracking-tight">Recent Trades</h3>
                <div className="flex items-center gap-3">
                  {activeFilter !== 'all' && (
                    <button onClick={() => setActiveFilter('all')} className="text-xs font-semibold text-rose-400 hover:underline">Clear Filter</button>
                  )}
                  <button 
                    onClick={() => setShowAllTrades(!showAllTrades)} 
                    className="text-xs font-semibold text-blue-500 hover:underline bg-blue-500/10 px-2.5 py-1 rounded-md"
                  >
                    {showAllTrades ? "Show Less" : `View All (${filteredTrades.length})`}
                  </button>
                </div>
              </div>
              
              <TradeTable 
                trades={displayedTrades} 
                deleteTrade={deleteTrade} 
                isDark={isDark} 
                onEdit={(trade) => {
                  setEditingTrade(trade);
                  setIsFormOpen(true);
                }}
              />
            </div>
          </div>
        ) : (
          /* EMPTY STATES FOR OTHER UNBUILT TABS */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className={`p-4 rounded-full mb-4 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            </div>
            <h3 className="text-lg font-bold">{activeTab.toUpperCase()} Section</h3>
            <p className={`text-sm max-w-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Once the Dashboard design is fully finalized, we will build this segment step-by-step.</p>
          </div>
        )}
      </main>

      {/* FLOATING ACTION BUTTON FOR ADD TRADE */}
      {activeTab === 'dashboard' && (
        <button 
          onClick={() => {
            setEditingTrade(null);
            setIsFormOpen(true);
          }}
          className="fixed bottom-24 right-5 z-50 p-4 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center border border-blue-500/50"
          aria-label="Add Trade"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
        </button>
      )}

      {/* MODAL DIALOG FOR ENTERING / EDITING TRADES */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl relative max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
            <TradeForm 
              onClose={() => {
                setIsFormOpen(false);
                setEditingTrade(null);
              }} 
              onAdd={addTrade} 
              onUpdate={updateTrade}
              editingTrade={editingTrade}
              isDark={isDark} 
            />
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION BAR */}
      <BottomNav isDark={isDark} />
    </div>
  );
}
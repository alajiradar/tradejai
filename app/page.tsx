'use client';

import React, { useState, useEffect } from 'react';
import MetricsGrid from '@/components/MetricsGrid';
import { TradeTable } from '@/components/TradeTable';
import { TradeForm } from '@/components/TradeForm';
import { EquityChart } from '@/components/EquityChart'; 
import { useTrades } from '@/hooks/useTrades';

// Muna canza su zuwa 'any' anan don hana TypeScript nuna fin karfi a kasa
const MetricsGridAny = MetricsGrid as any;
const TradeTableAny = TradeTable as any;

export default function Home() {
  const { allTrades, loading } = useTrades();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  
  const [activeFilter, setActiveFilter] = useState('all'); 
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Tace trades dangane da katin da aka danna
  const filteredTrades = allTrades ? allTrades.filter((trade) => {
    if (activeFilter === 'all') return true;
    
    const tradeDate = new Date(trade.created_at || trade.date);
    const now = new Date();
    
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
  }) : [];

  return (
    <div className={`min-h-screen w-full pb-20 transition-colors duration-200 ${isDark ? 'bg-[#070a13] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* TOP HEADER MENU */}
      <div className={`fixed top-0 left-0 right-0 h-12 flex items-center justify-between px-4 z-40 border-b ${isDark ? 'bg-[#070a13]/90 border-slate-800' : 'bg-white/90 border-slate-200'} backdrop-blur-md`}>
        <button 
          onClick={() => setIsMenuOpen(true)} 
          className="text-xl font-bold p-1 hover:opacity-80"
        >
          ☰
        </button>
        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs text-white font-bold">
          T
        </div>
      </div>

      {/* SIDE DRAWER MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsMenuOpen(false)} />
          <div className={`relative w-64 h-full p-5 flex flex-col justify-between border-r shadow-2xl ${isDark ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200'}`}>
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black tracking-wider text-indigo-500">Tradejai</h2>
                <button onClick={() => setIsMenuOpen(false)} className="text-lg">✕</button>
              </div>
              
              <nav className="space-y-3">
                <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-indigo-600/10 text-sm font-semibold">📊 Dashboard</button>
                <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-indigo-600/10 text-sm font-semibold">📈 Analytics</button>
                <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-indigo-600/10 text-sm font-semibold">📅 Calendar</button>
                <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-indigo-600/10 text-sm font-semibold">🤖 AI Coach</button>
                <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-indigo-600/10 text-sm font-semibold">⚙️ Settings</button>
              </nav>
            </div>

            <div className="space-y-4 border-t pt-4 border-slate-700/50">
              <div className="flex items-center justify-between p-1 rounded-md bg-slate-500/10">
                <button onClick={() => setIsDark(false)} className={`flex-1 text-xs py-1 rounded ${!isDark ? 'bg-indigo-600 text-white' : ''}`}>Light</button>
                <button onClick={() => setIsDark(true)} className={`flex-1 text-xs py-1 rounded ${isDark ? 'bg-indigo-600 text-white' : ''}`}>Dark</button>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-md bg-indigo-600/10">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">U</div>
                <div>
                  <p className="text-xs font-bold">User Account</p>
                  <p className="text-[10px] opacity-60">Registration/Profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="pt-16 px-3 max-w-6xl mx-auto flex flex-col gap-4">
        {/* An yi amfani da MetricsGridAny anan don share kowane irin jan layi */}
        <MetricsGridAny 
          trades={(allTrades || []) as any} 
          isDark={isDark} 
          activeFilter={activeFilter}
          onFilterChange={(filter: any) => setActiveFilter(activeFilter === filter ? 'all' : filter)}
        />
        
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold tracking-tight">
              Recent Trades {activeFilter !== 'all' && `(${activeFilter})`}
            </h3>
            {activeFilter !== 'all' && (
              <button onClick={() => setActiveFilter('all')} className="text-xs text-indigo-500 font-medium">Clear Filter</button>
            )}
          </div>
          {/* An yi amfani da TradeTableAny anan shima */}
          <TradeTableAny trades={(filteredTrades || []) as any} isDark={isDark} />
        </div>
      </main>

      {/* FLOATING TRADE FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-lg p-5 rounded-xl shadow-2xl border relative max-h-[90vh] overflow-y-auto ${isDark ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200'}`}>
            <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 text-sm font-bold opacity-70 hover:opacity-100">✕</button>
            <h3 className="text-base font-bold mb-4 text-indigo-500">Log New Trade</h3>
            <TradeForm 
              isDark={isDark}
              loading={formLoading}
              setLoading={setFormLoading}
              message={formMessage}
              setMessage={setFormMessage}
              uploadImage={async () => ''}
              onSuccess={() => { setIsFormOpen(false); window.location.reload(); }}
            />
          </div>
        </div>
      )}

      {/* COMPACT BOTTOM NAVIGATION BAR */}
      <div className={`fixed bottom-0 left-0 right-0 h-14 border-t flex items-center justify-around px-2 z-40 ${isDark ? 'bg-[#070a13]/95 border-slate-800' : 'bg-white/95 border-slate-200 shadow-lg'} backdrop-blur-sm`}>
        <button onClick={() => setActiveFilter('all')} className="flex flex-col items-center justify-center text-indigo-500"><span className="text-lg">📊</span><span className="text-[9px] font-medium">Dashboard</span></button>
        <button className="flex flex-col items-center justify-center opacity-60 hover:opacity-100"><span className="text-lg">📈</span><span className="text-[9px] font-medium">Analytics</span></button>
        
        <button 
          onClick={() => setIsFormOpen(true)}
          className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg transform -translate-y-2 border-4"
          style={{ borderColor: isDark ? '#070a13' : '#f8fafc' }}
        >
          +
        </button>

        <button className="flex flex-col items-center justify-center opacity-60 hover:opacity-100"><span className="text-lg">📅</span><span className="text-[9px] font-medium">Calendar</span></button>
        <button className="flex flex-col items-center justify-center opacity-60 hover:opacity-100"><span className="text-lg">🤖</span><span className="text-[9px] font-medium">AI Coach</span></button>
        <button onClick={() => setIsMenuOpen(true)} className="flex flex-col items-center justify-center opacity-60 hover:opacity-100"><span className="text-lg">⚙️</span><span className="text-[9px] font-medium">Settings</span></button>
      </div>

    </div>
  );
}
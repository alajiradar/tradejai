'use client';

import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiCamera, FiSettings } from 'react-icons/fi';

// Sabon tsarin MOCK DATA dake amfani da ainihin PnL na kudi
const MOCK_DAILY_DATA: Record<string, { pnl: number; tradesCount: number }> = {
  '2026-05-01': { pnl: 90.05, tradesCount: 1 },
  '2026-05-04': { pnl: 50.00, tradesCount: 1 },
  '2026-05-05': { pnl: -120.50, tradesCount: 3 },
  '2026-05-06': { pnl: -26.33, tradesCount: 3 },
  '2026-05-07': { pnl: 45.10, tradesCount: 1 },
  '2026-05-08': { pnl: 110.00, tradesCount: 3 },
  '2026-05-14': { pnl: 200.00, tradesCount: 2 },
  '2026-05-15': { pnl: -150.00, tradesCount: 3 },
  '2026-05-19': { pnl: -40.00, tradesCount: 1 },
  '2026-05-22': { pnl: 165.20, tradesCount: 4 },
};

export default function TradingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // May 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Mon start
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  const prevMonthDays = new Date(year, month, 0).getDate();
  
  for (let i = startOffset - 1; i >= 0; i--) {
    calendarDays.push({ day: prevMonthDays - i, isCurrentMonth: false, dateStr: '' });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = i < 10 ? `0${i}` : `${i}`;
    const monthStr = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      dateStr: `${year}-${monthStr}-${dayStr}`
    });
  }
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({ day: i, isCurrentMonth: false, dateStr: '' });
  }

  const changeMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else {
      setCurrentDate(new Date(year, month + 1, 1));
    }
  };

  // Injin tsara tsarin kudi na Premium Fintech (Currency Formatter)
  const formatPnL = (val: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
    return val > 0 ? `+${formatted}` : formatted;
  };

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div className="w-full bg-[#0d111a] border border-zinc-800/80 rounded-xl p-5 text-slate-200">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => changeMonth('prev')} className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-slate-400">
            <FiChevronLeft size={16} />
          </button>
          <span className="text-sm font-bold min-w-[90px] text-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={() => changeMonth('next')} className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-slate-400">
            <FiChevronRight size={16} />
          </button>
          
          <button onClick={() => setCurrentDate(new Date(2026, 4, 1))} className="ml-2 px-2.5 py-1 text-xs font-semibold rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-slate-300">
            This month
          </button>
        </div>

        {/* MONTHLY ACCUMULATED STATS */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 font-medium">Monthly Stats:</span>
            <span className="text-emerald-400 font-bold bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/10">+$433.22</span>
            <span className="text-zinc-400 font-medium bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">37 trades</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-500 border-l border-zinc-800 pl-4">
            <button className="p-1.5 hover:text-slate-300"><FiCamera size={14} /></button>
            <button className="p-1.5 hover:text-slate-300"><FiSettings size={14} /></button>
          </div>
        </div>
      </div>

      {/* MATRIX AND WEEKLY BREAKDOWN */}
      <div className="grid grid-cols-12 gap-3">
        
        {/* CALENDAR BLOCK (10 COLUMNS) */}
        <div className="col-span-12 lg:col-span-10">
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-zinc-500 mb-2 tracking-wider">
            {daysOfWeek.map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((item, index) => {
              const tradeData = item.dateStr ? MOCK_DAILY_DATA[item.dateStr] : null;
              
              let boxBg = 'bg-zinc-900/20 border-zinc-800/40 text-zinc-600'; 
              if (item.isCurrentMonth) {
                if (tradeData) {
                  boxBg = tradeData.pnl > 0 
                    ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-400' 
                    : 'bg-rose-950/20 border-rose-500/20 text-rose-400';
                } else {
                  boxBg = 'bg-zinc-900/40 border-zinc-800/60 text-slate-400'; 
                }
              }

              return (
                <div 
                  key={index} 
                  className={`min-h-[85px] p-2 rounded-lg border flex flex-col justify-between relative ${boxBg}`}
                >
                  {/* Ranar Wata */}
                  <span className={`text-[10px] font-bold self-end ${item.isCurrentMonth ? 'text-zinc-500' : 'text-zinc-700'}`}>
                    {item.day}
                  </span>

                  {/* Nuna ainihin Kudin PnL maimakon R-Multiple */}
                  {tradeData && item.isCurrentMonth ? (
                    <div className="flex flex-col items-center justify-center my-auto w-full px-0.5">
                      <span className="text-[11px] font-black tracking-tight text-center truncate block w-full">
                        {formatPnL(tradeData.pnl)}
                      </span>
                      <span className="text-[9px] opacity-60 font-medium">
                        {tradeData.tradesCount} {tradeData.tradesCount === 1 ? 'trade' : 'trades'}
                      </span>
                    </div>
                  ) : (
                    <div className="my-auto h-3"></div>
                  )}

                  {/* Dot indicator na asarar kudi */}
                  {tradeData && tradeData.pnl < 0 && (
                    <span className="absolute bottom-1.5 right-1.5 w-1 h-1 bg-rose-500 rounded-full"></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SIDEBAR WEEKLY STATS (2 COLUMNS) */}
        <div className="col-span-12 lg:col-span-2 flex flex-col justify-end gap-1.5 pb-0.5">
          <div className="text-[10px] font-bold text-transparent hidden lg:block mb-2 py-1">WEEK</div>
          
          {[
            { label: 'WEEK 18', pnl: 129.50, count: '7 trades', win: true },
            { label: 'WEEK 19', pnl: -15.40, count: '11 trades', win: false },
            { label: 'WEEK 20', pnl: 160.00, count: '9 trades', win: true },
            { label: 'WEEK 21', pnl: 159.12, count: '7 trades', win: true },
          ].map((wk, idx) => (
            <div 
              key={idx} 
              className="h-[85px] p-2 bg-zinc-900/30 border border-zinc-800/60 rounded-lg flex flex-col justify-between items-center text-center"
            >
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">{wk.label}</span>
              <div className="my-auto w-full">
                <div className={`text-[11px] font-black truncate px-0.5 ${wk.win ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatPnL(wk.pnl)}
                </div>
                <div className="text-[9px] text-zinc-500 font-medium">{wk.count}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
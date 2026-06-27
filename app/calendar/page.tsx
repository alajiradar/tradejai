'use client';

import React, { useState } from 'react';
import TradingCalendar from '@/components/TradingCalendar';
import BottomNav from '@/components/BottomNav';

export default function CalendarPage() {
  // Karin kariya don tsarin premium dark mode
  const [isDark] = useState(true);

  return (
    <main className="min-h-screen bg-[#06090f] pb-24 font-sans selection:bg-emerald-500/30">
      {/* Kyakkyawan Header na Shafi */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <h1 className="text-xl font-black text-slate-100 tracking-tight">
          Trading Performance Calendar
        </h1>
        <p className="text-xs text-zinc-500 font-medium mt-1">
          Deep dive into your daily trade distributions and multi-period P&L heatmaps.
        </p>
      </div>

      {/* Rukunin Calendar Component ɗinmu */}
      <div className="max-w-7xl mx-auto px-4 mt-2">
        <TradingCalendar />
      </div>

      {/* Fixed bottom navigation engine */}
      <BottomNav isDark={isDark} />
    </main>
  );
}
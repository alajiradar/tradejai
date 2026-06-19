import React from 'react';

interface MetricsProps {
  trades: any[];
  isDark?: boolean;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function MetricsGrid({ trades, isDark = true, activeFilter, onFilterChange }: MetricsProps) {
  const stats = [
    { id: 'all', title: 'Net P&L', value: '+$2,700.00', color: isDark ? 'text-emerald-400' : 'text-emerald-600', clickable: false },
    { id: 'all', title: 'Win Rate', value: '66.7%', color: isDark ? 'text-blue-400' : 'text-blue-600', clickable: false },
    { id: 'all', title: 'Profit Factor', value: '4.00', color: isDark ? 'text-amber-400' : 'text-amber-600', clickable: false },
    { id: 'all', title: 'Total Trades', value: '9', color: isDark ? 'text-slate-300' : 'text-slate-700', clickable: false },
    { id: 'all', title: 'Total Win', value: '6', color: isDark ? 'text-emerald-400' : 'text-emerald-600', clickable: false },
    { id: 'all', title: 'Total Loss', value: '3', color: isDark ? 'text-rose-400' : 'text-rose-600', clickable: false },
    { id: 'weekly', title: 'Weekly', value: '4', color: isDark ? 'text-indigo-400' : 'text-indigo-600', clickable: true },
    { id: 'monthly', title: 'Monthly', value: '9', color: isDark ? 'text-purple-400' : 'text-purple-600', clickable: true },
    { id: 'yearly', title: 'Yearly', value: '48', color: isDark ? 'text-cyan-400' : 'text-cyan-600', clickable: true },
  ];

  return (
    <div className="w-full grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-1.5 p-1">
      {stats.map((item, index) => {
        const isActive = activeFilter === item.id;
        return (
          <div 
            key={index} 
            onClick={() => item.clickable && onFilterChange(item.id)}
            className={`p-1.5 rounded-md border text-center transition-all duration-200 ${
              item.clickable ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
            } ${
              isActive 
                ? (isDark ? 'bg-indigo-950 border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'bg-indigo-50 border-indigo-400 shadow-sm ring-1 ring-indigo-400')
                : (isDark ? 'bg-[#0f1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm')
            }`}
          >
            <p className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {item.title} {item.clickable && isActive && '•'}
            </p>
            <p className={`text-xs md:text-sm font-black mt-0.5 ${item.color}`}>
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
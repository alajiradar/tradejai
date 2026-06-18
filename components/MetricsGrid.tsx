import React from 'react';

interface MetricsProps {
  trades: any[];
  isDark?: boolean;
}

export default function MetricsGrid({ trades, isDark = true }: MetricsProps) {
  // Katukan sun dawo gajeru kuma babu dogon bayani na kasa
  const stats = [
    { title: 'Net P&L', value: '+$2,700.00', color: isDark ? 'text-emerald-400' : 'text-emerald-600' },
    { title: 'Win Rate', value: '66.7%', color: isDark ? 'text-blue-400' : 'text-blue-600' },
    { title: 'Profit Factor', value: '4.00', color: isDark ? 'text-amber-400' : 'text-amber-600' },
    { title: 'Total Trades', value: '9', color: isDark ? 'text-slate-300' : 'text-slate-700' },
    { title: 'Total Win', value: '6', color: isDark ? 'text-emerald-400' : 'text-emerald-600' },
    { title: 'Total Loss', value: '3', color: isDark ? 'text-rose-400' : 'text-rose-600' },
    { title: 'Weekly', value: '4', color: isDark ? 'text-indigo-400' : 'text-indigo-600' },
    { title: 'Monthly', value: '9', color: isDark ? 'text-purple-400' : 'text-purple-600' },
    { title: 'Yearly', value: '48', color: isDark ? 'text-cyan-400' : 'text-cyan-600' },
  ];

  return (
    <div className="w-full grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 p-1">
      {stats.map((item, index) => (
        <div 
          key={index} 
          className={`p-2 rounded-lg border text-center transition-all duration-200 ${
            isDark 
              ? 'bg-[#0f1424] border-slate-800 text-white' 
              : 'bg-white border-slate-200 text-slate-900 shadow-sm'
          }`}
        >
          <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {item.title}
          </p>
          <p className={`text-sm md:text-base font-extrabold mt-0.5 ${item.color}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
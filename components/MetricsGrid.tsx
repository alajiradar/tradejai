import React from 'react';

interface MetricsProps {
  trades: any[]; // Za mu daidaita ainihin bayanan daga baya
}

export default function MetricsGrid({ trades }: MetricsProps) {
  // Dan jauran lissafi na jiran gaske (Za mu hada da Supabase daga baya)
  const stats = [
    { title: 'Net P&L', value: '+$2,700.00', color: 'text-emerald-400', bg: 'bg-emerald-500/10', desc: 'Live Equity Line Included' },
    { title: 'Win Rate', value: '66.7%', color: 'text-blue-400', bg: 'bg-blue-500/10', desc: '+2.3% from last week' },
    { title: 'Profit Factor', value: '4.00', color: 'text-amber-400', bg: 'bg-amber-500/10', desc: 'Healthy expectancy' },
    { title: 'Total Trades', value: '9', color: 'text-slate-300', bg: 'bg-slate-500/10', desc: 'All assets logged' },
    { title: 'Total Win', value: '6', color: 'text-emerald-400', bg: 'bg-emerald-500/10', desc: 'Successful closures' },
    { title: 'Total Loss', value: '3', color: 'text-rose-400', bg: 'bg-rose-500/10', desc: 'Managed risk trades' },
    { title: 'Weekly Trades', value: '4', color: 'text-indigo-400', bg: 'bg-indigo-500/10', desc: 'This calendar week' },
    { title: 'Monthly Trades', value: '9', color: 'text-purple-400', bg: 'bg-purple-500/10', desc: 'Current month cycle' },
    { title: 'Yearly Trades', value: '48', color: 'text-cyan-400', bg: 'bg-cyan-500/10', desc: 'Total 2026 history' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 gap-4 p-1">
      {stats.map((item, index) => (
        <div 
          key={index} 
          className={`p-4 rounded-xl border border-slate-800 bg-[#0f1424] hover:border-slate-700 transition-all duration-200 ${
            item.title === 'Net P&L' ? 'col-span-2 md:col-span-1' : ''
          }`}
        >
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{item.title}</p>
          <p className={`text-xl md:text-2xl font-bold mt-2 ${item.color}`}>
            {item.value}
          </p>
          
          {/* Idan Net P&L ne, za mu bar gurbin karamin Sparkline line a nan gaba */}
          {item.title === 'Net P&L' && (
            <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div className="w-3/4 h-full bg-emerald-500"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
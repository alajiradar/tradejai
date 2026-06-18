// components/EquityChart.tsx
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface EquityChartProps {
  equityCurveData: any[];
  isDark: boolean;
  mounted: boolean;
}

export function EquityChart({ equityCurveData, isDark, mounted }: EquityChartProps) {
  return (
    <div className={`lg:col-span-7 border rounded-xl p-4 shadow-sm flex flex-col justify-between transition-all duration-300 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="block text-[10px] uppercase font-bold tracking-wider opacity-50">Equity Curve Tracker</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold font-mono">Live Performance Line</span>
      </div>
      <div className="w-full h-[115px] sm:h-[120px]">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={equityCurveData} margin={{ top: 5, right: 10, left: -25, bottom: -5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1E293B" : "#E2E8F0"} />
              <XAxis dataKey="name" stroke="#64748B" fontSize={9} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={9} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                  borderColor: isDark ? "#334155" : "#CBD5E1",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: isDark ? "#F8FAFC" : "#0F172A"
                }}
              />
              <Line
                type="monotone"
                dataKey="Net P&L"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ r: 2, strokeWidth: 1, fill: "#2563EB" }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs opacity-50">Loading Equity Analytics Chart...</div>
        )}
      </div>
    </div>
  );
}
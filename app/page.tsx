// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useTrades } from "../hooks/useTrades";
import  MetricsGrid  from "../components/MetricsGrid";
import { EquityChart } from "../components/EquityChart";
import { TradeForm } from "../components/TradeForm";
import { TradeTable } from "../components/TradeTable";

export default function Home() {
  const {
    allTrades,
    fetchingTrades,
    loading,
    setLoading,
    message,
    setMessage,
    totalTrades,
    netPnl,
    winRate,
    profitFactor,
    equityCurveData,
    fetchTradesData,
    uploadImage
  } = useTrades();

  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("tradejai-theme") || "system";
    setTheme(savedTheme);
  }, []);

  const getActiveTheme = () => {
    if (theme === "system") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return "dark";
    }
    return theme;
  };

  const activeTheme = mounted ? getActiveTheme() : "dark";
  const isDark = activeTheme === "dark";

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("tradejai-theme", newTheme);
  };

  return (
    <main className={`min-h-screen flex flex-col items-center p-4 transition-colors duration-300 pb-12 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      
      {/* Theme Switcher Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mt-4 px-2">
        <div className="flex flex-col">
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>Tradejai</h1>
          <p className="text-xs opacity-60">SaaS Multi-Asset Trading Journal</p>
        </div>
        <div className={`flex rounded-lg p-1 text-xs font-medium border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
          {["light", "dark", "system"].map((t) => (
            <button
              key={t}
              onClick={() => handleThemeChange(t)}
              className={`px-3 py-1.5 rounded-md capitalize transition-all ${
                theme === t ? "bg-blue-600 text-white shadow-sm" : "opacity-60 hover:opacity-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* STAGE 1 PERFORMANCE OVERVIEW */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-4 mt-6 px-2">
        <MetricsGrid trades={allTrades} />
           {/* STAGE 1 PERFORMANCE OVERVIEW */}
<div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-4">
  
  {/* Sanya shi ya canza launi da isDark, sannan ya mamaye layi gaba daya a laptop */}
  <div className="lg:col-span-12">
    <MetricsGrid trades={allTrades} isDark={isDark} />
  </div>
  
  {/* Graph din zai dawo kasa da katukan yanzu */}
  <div className="lg:col-span-12">
    <EquityChart
      equityCurveData={equityCurveData}
      isDark={isDark}
      mounted={mounted}
    />
  </div>
  
</div>
        <EquityChart 
          equityCurveData={equityCurveData} 
          isDark={isDark} 
          mounted={mounted} 
        />
      </div>

      {/* Main Split Screen Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 items-start">
        <TradeForm 
          isDark={isDark}
          loading={loading}
          setLoading={setLoading}
          message={message}
          setMessage={setMessage}
          uploadImage={uploadImage}
          onSuccess={fetchTradesData}
        />
        <TradeTable 
          allTrades={allTrades}
          fetchingTrades={fetchingTrades}
          isDark={isDark}
        />
      </div>
    </main>
  );
}
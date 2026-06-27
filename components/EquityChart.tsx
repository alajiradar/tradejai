'use client';

import React, { useState } from 'react';
import { Trade } from '@/types/trade';

interface EquityChartProps {
  trades: Trade[];
}

export default function EquityChart({ trades }: EquityChartProps) {
  // Ji da canjin ma'auni lokacin da aka yi hover
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!trades || trades.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500 font-medium border border-dashed border-slate-800/60 rounded-lg">
        Awaiting transaction logs to generate equity projection path...
      </div>
    );
  }

  // 1. Samar da lissafin cumulative equity curve data points
  let currentEquity = 0;
  const fullPoints = [0]; // Farawa daga 0 baseline
  
  trades.forEach((t) => {
    currentEquity += t.pnl || 0;
    fullPoints.push(currentEquity);
  });

  // 2. Nemo Max da Min don tsara scaling din da ya dace
  const maxVal = Math.max(...fullPoints);
  const minVal = Math.min(...fullPoints);
  const range = maxVal - minVal === 0 ? 100 : maxVal - minVal;

  const width = 500;
  const height = 150;
  const padding = 15; // An kara sarari kadan don jujjuyawar akwatin bayanan
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const pointsCoordinates = fullPoints.map((val, index) => {
    const x = padding + (index / (fullPoints.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((val - minVal) / range) * chartHeight;
    return { x, y, value: val, index };
  });

  const pathD = pointsCoordinates
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const areaD = `
    ${pathD} 
    L ${pointsCoordinates[pointsCoordinates.length - 1].x.toFixed(1)} ${height - padding} 
    L ${pointsCoordinates[0].x.toFixed(1)} ${height - padding} Z
  `;

  const isOverallProfitable = currentEquity >= 0;
  const strokeColor = isOverallProfitable ? '#10b981' : '#f43f5e';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  // Ciro bayanan point din da aka yi hover a kai
  const activePoint = activeIndex !== null ? pointsCoordinates[activeIndex] : null;
  const activeTrade = activeIndex !== null && activeIndex > 0 ? trades[activeIndex - 1] : null;

  return (
    <div className="w-full h-full relative" onMouseLeave={() => setActiveIndex(null)}>
      
      {/* 3. PREMIUM FLOATING HTML TOOLTIP */}
      {activePoint && (
        <div
          className="absolute z-50 p-2.5 rounded-lg border shadow-xl text-[11px] backdrop-blur-md bg-[#121926]/95 border-slate-800 text-slate-200 pointer-events-none transition-all duration-75 ease-out flex flex-col gap-0.5"
          style={{
            left: `${(activePoint.x / width) * 100}%`,
            top: `${(activePoint.y / height) * 100}%`,
            transform: 'translate(-50%, -118%)', // Daga tsakiya saman node din daidai
          }}
        >
          <div className="flex justify-between gap-4 font-bold text-slate-400 border-b border-slate-800/60 pb-1 mb-1">
            <span>{activePoint.index === 0 ? 'Baseline Start' : `Trade #${activePoint.index}`}</span>
            {activeTrade && (
              <span className={activeTrade.status === 'WIN' ? 'text-emerald-500' : activeTrade.status === 'LOSS' ? 'text-rose-500' : 'text-slate-400'}>
                {activeTrade.asset}
              </span>
            )}
          </div>
          
          <div className="flex justify-between gap-6 items-center">
            <span className="text-slate-500 font-medium">Account Equity:</span>
            <span className={`font-black ${activePoint.value >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(activePoint.value)}
            </span>
          </div>

          {activeTrade && (
            <div className="flex justify-between gap-6 items-center mt-0.5">
              <span className="text-slate-500 font-medium">Trade Net P&L:</span>
              <span className={`font-bold ${activeTrade.pnl && activeTrade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {activeTrade.pnl && activeTrade.pnl >= 0 ? '+' : ''}{formatCurrency(activeTrade.pnl || 0)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 4. REAL SVG CHART VIEWPORT */}
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="equity-dynamic-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.18" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Horizontal Baseline dashed marker (0 point) */}
        <line 
          x1={padding} 
          y1={padding + chartHeight - ((0 - minVal) / range) * chartHeight} 
          x2={width - padding} 
          y2={padding + chartHeight - ((0 - minVal) / range) * chartHeight} 
          stroke="#475569" 
          strokeWidth="1" 
          strokeDasharray="4 4" 
          opacity="0.2"
        />

        {/* Gradient Fill Shadow Area */}
        <path d={areaD} fill="url(#equity-dynamic-gradient)" />

        {/* Real Dynamic SVG Line */}
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Vertical Crosshair Guideline Tracker */}
        {activePoint && (
          <line
            x1={activePoint.x}
            y1={padding}
            x2={activePoint.x}
            y2={height - padding}
            stroke="#2563eb"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            opacity="0.6"
          />
        )}

        {/* Interactive Highlight Vertex Dot Nodes */}
        {pointsCoordinates.map((p, idx) => (
          <circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r={activeIndex === idx ? "5" : "3.5"}
            fill={activeIndex === idx ? "#3b82f6" : strokeColor}
            stroke={activeIndex === idx ? "#ffffff" : "none"}
            strokeWidth={activeIndex === idx ? "1.5" : "0"}
            className="transition-all duration-75 ease-out"
          />
        ))}

        {/* 5. INVISIBLE HITBOX OVERLAYS FOR MAXIMUM SENSITIVITY */}
        {pointsCoordinates.map((p, idx) => {
          const zoneWidth = chartWidth / (pointsCoordinates.length - 1 || 1);
          return (
            <rect
              key={`hitbox-${idx}`}
              x={p.x - zoneWidth / 2}
              y={0}
              width={zoneWidth}
              height={height}
              fill="transparent"
              className="cursor-crosshair select-none"
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseMove={() => setActiveIndex(idx)}
            />
          );
        })}
      </svg>
    </div>
  );
}
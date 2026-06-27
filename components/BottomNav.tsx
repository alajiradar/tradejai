'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiBarChart2, FiCalendar, FiZap, FiSettings } from 'react-icons/fi';

interface BottomNavProps {
  isDark?: boolean;
}

export default function BottomNav({ isDark = true }: BottomNavProps) {
  const pathname = usePathname();

  // An gyara zuwa FiZap don tafiya da tsarin rukunin Feather Icons
  const navItems = [
    { label: 'Dashboard', icon: FiHome, href: '/' },
    { label: 'Analytics', icon: FiBarChart2, href: '/analytics' },
    { label: 'Calendar', icon: FiCalendar, href: '/calendar' },
    { label: 'AI Coach', icon: FiZap, href: '/ai-coach' },
    { label: 'Settings', icon: FiSettings, href: '/settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 bg-gradient-to-t from-[#06090f] via-[#06090f]/90 to-transparent pointer-events-none">
      <nav className="flex items-center justify-between w-full max-w-md px-6 py-3 bg-[#0d111a]/95 border border-zinc-800/80 backdrop-blur-md rounded-full shadow-2xl pointer-events-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          // Injin dake duba ko trader yana kan wannan takamaiman shafin
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-all duration-200 group relative ${
                isActive 
                  ? 'text-emerald-400 font-semibold scale-105' 
                  : 'text-zinc-500 hover:text-slate-200'
              }`}
            >
              {/* Icon dake girma kadan idan an taba shi (Hover effect) */}
              <Icon 
                size={20} 
                className={`transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-slate-200'
                }`} 
              />
              
              {/* Sunan Tab */}
              <span className="text-[10px] tracking-tight font-medium">
                {item.label}
              </span>
              
              {/* Karamin Indicator Dot na kasa idan tab din yana aiki (Active) */}
              {isActive && (
                <span className="absolute -bottom-1.5 w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"></span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
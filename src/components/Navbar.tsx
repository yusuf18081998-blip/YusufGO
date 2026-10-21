import React from 'react';
import { TabType, UserStats } from '../types';
import { 
  Sparkles, 
  Mic, 
  PenTool, 
  BookOpen, 
  Headphones, 
  Flame, 
  Target, 
  Bot, 
  LayoutDashboard,
  CheckCircle2,
  Languages,
  PhoneCall
} from 'lucide-react';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  stats: UserStats;
  uzbekMode: boolean;
  onToggleUzbek: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  stats,
  uzbekMode,
  onToggleUzbek,
}) => {
  const navItems = [
    { id: 'voice-chat', label: 'GoPrep Voice Chat', uzLabel: 'Preppy Ovozli Muloqot', icon: Flame, badge: '🔥 GO' },
    { id: 'dashboard', label: 'Dashboard', uzLabel: 'Bosh sahifa', icon: LayoutDashboard },
    { id: 'speaking', label: 'Speaking Mock', uzLabel: 'AI Examiner', icon: Mic, badge: 'Part 1-3' },
    { id: 'writing', label: 'AI Writing', uzLabel: 'AI Yozish', icon: PenTool, badge: 'Band 9' },
    { id: 'reading', label: 'Reading Test', uzLabel: 'O\'qish', icon: BookOpen },
    { id: 'listening', label: 'Listening Test', uzLabel: 'Eshitish', icon: Headphones },
    { id: 'vocab', label: 'GoVocab 570', uzLabel: 'Lug\'at', icon: Sparkles },
    { id: 'tutor', label: 'AI Tutor', uzLabel: 'AI Ustoz', icon: Bot, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0b0f19]/95 backdrop-blur-md">
      {/* Top Free Access banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-emerald-900/40 border-b border-indigo-500/20 px-4 py-1 text-xs text-center text-indigo-200 flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-emerald-300">YusufGo Pro:</span>
        <span>Yusuf uchun 100% BEPUL va Cheksiz AI Imkoniyatlari Faol (GoPrep Alternative)</span>
        <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30">Free Lifetime</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => onSelectTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <span className="font-black text-white text-xl tracking-tight">Y</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0b0f19]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-white tracking-tight">
                  yusuf<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">go</span>
                </span>
                <span className="text-[10px] uppercase font-bold bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">
                  Prep
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">IELTS & English Mastery</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as TabType)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{uzbekMode ? item.uzLabel : item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Stats & Controls */}
          <div className="flex items-center gap-3">
            {/* Uzbek Language Hints Toggle */}
            <button
              onClick={onToggleUzbek}
              title="O'zbekcha tarjima va ko'rsatmalarni yoqish/o'chirish"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                uzbekMode 
                  ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline font-mono">{uzbekMode ? "O'zbek: ON" : "UZ: OFF"}</span>
            </button>

            {/* Streak */}
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-400">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{stats.streakDays} {uzbekMode ? 'kun' : 'days'}</span>
            </div>

            {/* Target Band Pill */}
            <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-1.5 rounded-lg text-xs font-bold text-indigo-300">
              <Target className="w-4 h-4 text-indigo-400" />
              <span>Target: Band {stats.targetBand.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Nav */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 scrollbar-none border-t border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as TabType)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{uzbekMode ? item.uzLabel : item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

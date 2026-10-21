import React from 'react';
import { TabType, UserStats } from '../types';
import { 
  Mic, 
  PenTool, 
  BookOpen, 
  Headphones, 
  Sparkles, 
  Bot, 
  ArrowRight, 
  CheckCircle, 
  Award, 
  Zap,
  TrendingUp,
  Clock,
  ShieldCheck,
  BookMarked,
  PhoneCall,
  Flame
} from 'lucide-react';
import { VOCAB_DATABASE } from '../data/mockTestsData';
import { speakText } from '../utils/speech';

interface DashboardViewProps {
  stats: UserStats;
  onUpdateTargetBand: (band: number) => void;
  onSelectTab: (tab: TabType) => void;
  uzbekMode: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  onUpdateTargetBand,
  onSelectTab,
  uzbekMode,
}) => {
  const targetOptions = [6.5, 7.0, 7.5, 8.0, 8.5, 9.0];
  const wordOfTheDay = VOCAB_DATABASE[0];

  const skillCards = [
    {
      id: 'speaking',
      title: 'AI Speaking Coach',
      uzTitle: 'AI Gapirish Murabbiyi',
      desc: 'Simulate full Part 1, Part 2 & Part 3 with official IELTS rubric scoring and instant pronunciation guidance.',
      uzDesc: 'Rasmiy IELTS mezonlari asosida Part 1, 2, 3 testlarini ovozli topshiring va band ballingizni biling.',
      icon: Mic,
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/20',
      bgGlow: 'bg-purple-500/10',
      current: stats.skills.speaking,
      testsCount: '15+ Mavzular',
    },
    {
      id: 'writing',
      title: 'AI Writing Band 9 Checker',
      uzTitle: 'AI Insho Tekshiruvchi',
      desc: 'Detailed assessment for Task 1 charts and Task 2 essays with lexical resource suggestions and Band 9 rewrites.',
      uzDesc: 'Task 1 grafiklar va Task 2 insholaringizni tekshiring, xatolarni ko\'ring va Band 9 namunasini oling.',
      icon: PenTool,
      color: 'from-blue-500 to-cyan-600',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/20',
      bgGlow: 'bg-blue-500/10',
      current: stats.skills.writing,
      testsCount: 'Task 1 & Task 2',
    },
    {
      id: 'reading',
      title: 'Computer-Delivered Reading',
      uzTitle: 'Kompyuter O\'qish Testi',
      desc: 'Authentic split-screen format with True/False/Not Given, Headings matching, and detailed line references.',
      uzDesc: 'Haqiqiy kompyuter IELTS formati: matn chapda, savollar o\'ngda, avtomatik ball va tushuntirishlar.',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      bgGlow: 'bg-emerald-500/10',
      current: stats.skills.reading,
      testsCount: 'Akademik Matnlar',
    },
    {
      id: 'listening',
      title: 'Listening Mock Lab',
      uzTitle: 'Eshitish Sinov Xonasi',
      desc: 'Realistic academic dialogues and lectures with audio speed control, synchronized questions, and full transcripts.',
      uzDesc: 'Tezlikni sozlash (0.8x, 1x, 1.2x), audio simulyatsiyasi va savollarga javob berish.',
      icon: Headphones,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/20',
      bgGlow: 'bg-amber-500/10',
      current: stats.skills.listening,
      testsCount: 'Bo\'limlar & Transkript',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Yusufning Shaxsiy Bepul GoPrep Tizimi (100% Unlocked)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {uzbekMode ? "Salom, Yusuf! Ingliz tilini IELTS 8.0+ darajasiga chiqaramiz!" : "Welcome back, Yusuf! Accelerate to IELTS Band 8.0+"}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {uzbekMode
                ? "GoPrep platformasining barcha pullik qulayliklari (AI gapirish imtihoni, insho tahlili, rasmiy kompyuter testlari, 570 ta akademik so'z) siz uchun to'liq bepul ishlamoqda."
                : "All GoPrep premium features—AI Speaking Examiner, Band 9 Essay Checker, Computer-Delivered Reading, and Academic Vocabulary—are 100% unlocked and free for your personal prep."}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onSelectTab('live-speaking')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 transition-all hover:scale-[1.02] border border-rose-400/40"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>{uzbekMode ? "🔥 Jonli Qattiqqo'l AI Muloqot (Call)" : "🔥 Strict Live AI Speaking Call"}</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold">STRICT</span>
              </button>
              <button
                onClick={() => onSelectTab('speaking')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02]"
              >
                <Mic className="w-4 h-4" />
                <span>{uzbekMode ? "IELTS Speaking Part 1-3" : "Speaking Mock Test"}</span>
              </button>
              <button
                onClick={() => onSelectTab('tutor')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm transition-all"
              >
                <Bot className="w-4 h-4 text-indigo-400" />
                <span>{uzbekMode ? "AI Ustoz" : "Ask AI Tutor"}</span>
              </button>
            </div>
          </div>

          {/* Target Band Setting Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shrink-0 w-full md:w-72 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                {uzbekMode ? "Maqsadli Band Ball" : "Target Band Goal"}
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Band {stats.targetBand.toFixed(1)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 mb-4">
              {targetOptions.map((band) => (
                <button
                  key={band}
                  onClick={() => onUpdateTargetBand(band)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                    stats.targetBand === band
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white'
                  }`}
                >
                  {band.toFixed(1)}
                </button>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>{uzbekMode ? "Hozirgi taxminiy daraja:" : "Current estimated level:"}</span>
              <span className="font-bold text-emerald-400 font-mono">Band {stats.currentBand.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Skill Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            <span>{uzbekMode ? "Asosiy Tayyorgarlik Bo'limlari" : "Core Practice Modules"}</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {uzbekMode ? "Har bir bo'limda cheksiz AI tekshiruvi mavjud" : "Unlimited AI feedback on every section"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillCards.map((skill) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.id}
                onClick={() => onSelectTab(skill.id as TabType)}
                className={`group relative rounded-2xl bg-slate-900/60 border ${skill.borderColor} hover:border-indigo-500/50 p-6 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer hover:shadow-xl hover:shadow-indigo-500/5`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${skill.color} text-white shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
                        {uzbekMode ? skill.uzTitle : skill.title}
                      </h3>
                      <span className="text-xs font-mono text-slate-400">
                        {skill.testsCount}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">{uzbekMode ? "Taxminiy" : "Score"}</span>
                    <span className={`text-base font-bold font-mono ${skill.textColor}`}>
                      {skill.current.toFixed(1)} / 9.0
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {uzbekMode ? skill.uzDesc : skill.desc}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-indigo-400">
                  <span>{uzbekMode ? "Amaliyotni boshlash" : "Launch practice session"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Plan & Word of the Day Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Study Routine */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>{uzbekMode ? "Yusufning Bugungi 4 Bosqichli Rejasi" : "Yusuf's Daily 4-Step Action Plan"}</span>
            </h3>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              {uzbekMode ? "Tavsiya etiladi" : "Recommended"}
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                step: '1',
                title: uzbekMode ? 'Speaking Part 2 Cue Card (15 daq)' : 'Speaking Part 2 Cue Card (15 mins)',
                desc: uzbekMode ? 'Ovoz yozib javob bering, AI examinerdan Band score va yangi so\'zlar oling.' : 'Record your 2-minute speech and get instant examiner scoring.',
                tab: 'speaking',
                done: false
              },
              {
                step: '2',
                title: uzbekMode ? 'Writing Task 2 Inshosi (40 daq)' : 'Writing Task 2 Academic Essay (40 mins)',
                desc: uzbekMode ? 'AI texnologiyalari mavzusida insho yozing va Band 9 namunasini oling.' : 'Draft an argumentative essay and receive detailed corrections.',
                tab: 'writing',
                done: false
              },
              {
                step: '3',
                title: uzbekMode ? '570 Academic Word List (10 daq)' : 'GoVocab 570 Flashcards (10 mins)',
                desc: uzbekMode ? 'Paramount, Exacerbate, Ubiquitous so\'zlarini takrorlang.' : 'Master Band 8+ collocations with interactive spaced repetition.',
                tab: 'vocab',
                done: true
              },
              {
                step: '4',
                title: uzbekMode ? 'Kompyuter Reading Mini-Test (20 daq)' : 'Computer-Delivered Reading Mini-Test (20 mins)',
                desc: uzbekMode ? 'Termite Mounds ilmiy matnini o\'qib, True/False/Not Given savollarini yeching.' : 'Read academic passage and answer authentic test questions.',
                tab: 'reading',
                done: false
              }
            ].map((item) => (
              <div 
                key={item.step}
                onClick={() => onSelectTab(item.tab as TabType)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-300 font-bold font-mono text-sm flex items-center justify-center border border-indigo-500/30">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Word of the Day Widget */}
        <div className="rounded-2xl bg-gradient-to-b from-indigo-950/60 to-slate-900 border border-indigo-500/30 p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {uzbekMode ? "Kun So'zi (Band 8+)" : "Word of the Day"}
              </span>
              <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                {wordOfTheDay.bandLevel}
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <h4 className="text-2xl font-extrabold text-white">{wordOfTheDay.word}</h4>
                <span className="text-xs text-indigo-300 font-mono">{wordOfTheDay.phonetic}</span>
              </div>
              <span className="text-xs text-slate-400 italic font-serif">{wordOfTheDay.partOfSpeech}</span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-300 leading-relaxed font-medium">
                {wordOfTheDay.definitionEn}
              </p>
              {uzbekMode && (
                <p className="text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  <span className="font-semibold">O'zbekcha: </span>
                  {wordOfTheDay.definitionUz}
                </p>
              )}
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-slate-400 italic">
                "{wordOfTheDay.example}"
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-2">
            <button
              onClick={() => speakText(wordOfTheDay.word + ". " + wordOfTheDay.example)}
              className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow transition-colors"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>{uzbekMode ? "Talaffuzni tinglash" : "Listen pronunciation"}</span>
            </button>
            <button
              onClick={() => onSelectTab('vocab')}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Lug'at bo'limiga o'tish"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

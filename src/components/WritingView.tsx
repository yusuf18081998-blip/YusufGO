import React, { useState, useEffect } from 'react';
import { WritingPrompt, WritingEvaluation } from '../types';
import { WRITING_PROMPTS } from '../data/mockTestsData';
import { 
  PenTool, 
  Clock, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  RotateCcw, 
  Sparkles, 
  Copy, 
  ChevronRight, 
  TrendingUp, 
  FileText,
  HelpCircle,
  Check
} from 'lucide-react';

interface WritingViewProps {
  uzbekMode: boolean;
}

export const WritingView: React.FC<WritingViewProps> = ({ uzbekMode }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt>(WRITING_PROMPTS[1]); // Task 2 AI in Higher Education default
  const [userEssay, setUserEssay] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);
  
  // Timer state
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(selectedPrompt.timeMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [copiedRewrite, setCopiedRewrite] = useState<boolean>(false);

  useEffect(() => {
    setTimeLeftSeconds(selectedPrompt.timeMinutes * 60);
    setIsTimerRunning(false);
    setUserEssay('');
    setEvaluation(null);
  }, [selectedPrompt]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeftSeconds]);

  const wordCount = userEssay.trim() ? userEssay.trim().split(/\s+/).length : 0;
  const targetWords = selectedPrompt.targetWords;
  const isWordCountMet = wordCount >= targetWords;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleEvaluate = async () => {
    if (!userEssay || userEssay.trim().length < 30) {
      alert(uzbekMode ? "Iltimos, tekshirishdan oldin insho yozing (kamida 30 ta so'z)." : "Please write your essay before submitting (at least 30 words).");
      return;
    }

    setIsEvaluating(true);
    try {
      const res = await fetch('/api/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: selectedPrompt.taskType,
          promptText: selectedPrompt.promptText,
          userEssay: userEssay.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('Evaluation request failed');
      }

      const data = await res.json();
      setEvaluation(data);
    } catch (err: any) {
      console.error(err);
      alert(uzbekMode ? "Baholashda xatolik yuz berdi. Qaytadan urinib ko'ring." : "Error evaluating essay: " + err.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCopyRewrite = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRewrite(true);
    setTimeout(() => setCopiedRewrite(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white">
              {uzbekMode ? "GoPrep AI Writing Band 9 Examiner" : "AI Writing Lab & Band 9 Evaluator"}
            </h2>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold border border-indigo-500/30">
              Official Rubric
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {uzbekMode
              ? "Task 1 va Task 2 insholaringizni yozing, vaqtni nazorat qiling va rasmiy mezonlar bo'yicha tahlil oling."
              : "Timed IELTS writing simulation with instant band scoring, line-by-line grammar corrections, and Band 9 rewrite."}
          </p>
        </div>

        {/* Task selector toggle */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {WRITING_PROMPTS.map((p) => {
            const isSelected = selectedPrompt.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPrompt(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p.taskType.toUpperCase()} ({p.type.split(' ')[0]})
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompt details & timer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {selectedPrompt.taskType === 'task1' ? 'Task 1 (Report / Letter)' : 'Task 2 (Essay)'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {selectedPrompt.type}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              {selectedPrompt.title}
            </h3>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium whitespace-pre-line">
              {selectedPrompt.promptText}
            </div>

            {/* Chart description data for Task 1 */}
            {selectedPrompt.chartDescription && (
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 space-y-1">
                <span className="font-bold text-indigo-300 block">
                  {uzbekMode ? "Grafik Ma'lumotlari:" : "Data Trends & Key Features:"}
                </span>
                <p className="whitespace-pre-line text-slate-300">{selectedPrompt.chartDescription}</p>
              </div>
            )}

            {/* Timer and Requirement Stats */}
            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
                  <span>Countdown Timer</span>
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className={`text-xl font-mono font-bold ${timeLeftSeconds < 300 && isTimerRunning ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                    {formatTimer(timeLeftSeconds)}
                  </span>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    {isTimerRunning ? 'Pause' : 'Start'}
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
                  <span>Word Target</span>
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className={`text-xl font-mono font-bold ${isWordCountMet ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {wordCount} <span className="text-xs text-slate-500 font-normal">/ {targetWords}</span>
                  </span>
                  <span className={`text-[10px] font-bold ${isWordCountMet ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isWordCountMet ? 'Met' : `${targetWords - wordCount} more`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Writing Editor & Submission */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <PenTool className="w-4 h-4 text-indigo-400" />
                <span>{uzbekMode ? "Insho Matni" : "Your Essay Draft"}</span>
              </h4>
              <div className="flex items-center gap-2">
                {userEssay && (
                  <button
                    onClick={() => setUserEssay('')}
                    className="p-1.5 text-slate-400 hover:text-slate-200 text-xs rounded hover:bg-slate-800 transition-colors"
                    title="Tozalash"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  {wordCount} words • {userEssay.length} chars
                </span>
              </div>
            </div>

            <textarea
              value={userEssay}
              onChange={(e) => setUserEssay(e.target.value)}
              placeholder={uzbekMode 
                ? "Insho matnini shu yerga yozing. Kirish (Introduction), asosiy qism (Body Paragraph 1 & 2) va xulosa (Conclusion) tuzilmasiga e'tibor bering..." 
                : "Type your essay response here. Structure into introduction, body paragraphs, and a clear conclusion..."}
              rows={14}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed font-mono"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-400">
                {!isWordCountMet ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {uzbekMode ? `Kamida ${targetWords} ta so'z yozish tavsiya qilinadi (Hozir: ${wordCount})` : `Minimum requirement is ${targetWords} words (Current: ${wordCount})`}
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {uzbekMode ? "Kerakli so'zlar soni bajarildi!" : "Word count criterion satisfied!"}
                  </span>
                )}
              </div>

              <button
                onClick={handleEvaluate}
                disabled={isEvaluating || !userEssay.trim()}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  isEvaluating || !userEssay.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20'
                }`}
              >
                {isEvaluating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{uzbekMode ? "AI Inshoni Tekshirmoqda..." : "Evaluating Essay..."}</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>{uzbekMode ? "AI Examiner Tekshiruvi & Band Ball" : "Get Band Score & Diagnostics"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Writing Evaluation Results */}
      {evaluation && (
        <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/40 p-6 space-y-6 shadow-2xl animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
                Cambridge IELTS Writing Assessment
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                {uzbekMode ? "Insho Tahlili & Rasmiy Band Ball" : "Essay Diagnostics & Rubric Scoring"}
              </h3>
            </div>

            <div className="flex items-center gap-3 bg-slate-900 border border-emerald-500/40 p-3 rounded-2xl">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Overall Band</span>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  Band {evaluation.bandScore.toFixed(1)}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* 4 Official Descriptors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Task Response', score: evaluation.breakdown.taskResponse },
              { label: 'Coherence & Cohesion', score: evaluation.breakdown.coherenceCohesion },
              { label: 'Lexical Resource', score: evaluation.breakdown.lexicalResource },
              { label: 'Grammar Accuracy', score: evaluation.breakdown.grammaticalRange },
            ].map((crit, idx) => (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[11px] text-slate-400 block line-clamp-1">{crit.label}</span>
                <span className="text-lg font-bold font-mono text-indigo-300 mt-0.5 block">
                  {crit.score.toFixed(1)}
                </span>
              </div>
            ))}
          </div>

          {/* Verdict and Overview */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Verdict:</span>
              <span className="text-xs font-semibold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {evaluation.verdict}
              </span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {evaluation.overview}
            </p>
          </div>

          {/* Strengths & Areas to improve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{uzbekMode ? "Kuchli Jihatlar" : "Key Strengths"}</span>
              </h5>
              <ul className="space-y-1 text-xs text-slate-300">
                {evaluation.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-950/20 border border-amber-500/20 p-4 rounded-xl space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>{uzbekMode ? "Yaxshilash Kerak Bo'lgan Qismlar" : "Areas for Improvement"}</span>
              </h5>
              <ul className="space-y-1 text-xs text-slate-300">
                {evaluation.areasToImprove.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sentence Corrections */}
          {evaluation.sentenceCorrections && evaluation.sentenceCorrections.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>{uzbekMode ? "Jumlalardagi Xatolarni Qayta Shakllantirish" : "Sentence-Level Refinements"}</span>
              </h4>
              <div className="space-y-2">
                {evaluation.sentenceCorrections.map((corr, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1.5 text-xs">
                    <div className="text-rose-400 line-through font-mono">
                      "{corr.original}"
                    </div>
                    <div className="text-emerald-400 font-semibold font-mono flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>"{corr.correction}"</span>
                    </div>
                    <p className="text-slate-400 italic text-[11px] pt-1">
                      {corr.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Band 9 Model Rewrite */}
          {evaluation.band9Rewrite && (
            <div className="bg-indigo-950/30 border border-indigo-500/40 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>{uzbekMode ? "Sizning Fikrlaringiz Asosida Band 9 Namunaviy Qayta Yozuv" : "Band 9 Model Essay Rewrite"}</span>
                </h4>
                <button
                  onClick={() => handleCopyRewrite(evaluation.band9Rewrite)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/40 hover:bg-indigo-600/60 text-indigo-200 text-xs font-semibold transition-colors border border-indigo-500/30"
                >
                  {copiedRewrite ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRewrite ? 'Copied!' : 'Copy Essay'}</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-serif whitespace-pre-line">
                {evaluation.band9Rewrite}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

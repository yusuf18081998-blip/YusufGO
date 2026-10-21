import React, { useState, useEffect } from 'react';
import { ReadingTest, ReadingQuestion } from '../types';
import { READING_TESTS } from '../data/mockTestsData';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  RotateCcw, 
  Flag, 
  Award, 
  ZoomIn, 
  ZoomOut, 
  Highlighter, 
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ReadingViewProps {
  uzbekMode: boolean;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ uzbekMode }) => {
  const [selectedTest, setSelectedTest] = useState<ReadingTest>(READING_TESTS[0]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [fontSize, setFontSize] = useState<'text-xs' | 'text-sm' | 'text-base'>('text-sm');
  const [timeLeft, setTimeLeft] = useState<number>(20 * 60); // 20 minutes
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{ rawScore: number; bandScore: number } | null>(null);

  useEffect(() => {
    setAnswers({});
    setFlagged({});
    setIsSubmitted(false);
    setScoreResult(null);
    setTimeLeft(20 * 60);
    setIsTimerRunning(true);
  }, [selectedTest]);

  useEffect(() => {
    let timer: any = null;
    if (isTimerRunning && timeLeft > 0 && !isSubmitted) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft, isSubmitted]);

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectAnswer = (qId: number, val: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const toggleFlag = (qId: number) => {
    setFlagged((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitTest = () => {
    let raw = 0;
    selectedTest.questions.forEach((q) => {
      const userAns = (answers[q.id] || '').trim().toUpperCase();
      const correct = q.correctAnswer.trim().toUpperCase();
      if (userAns === correct) {
        raw += 1;
      }
    });

    const total = selectedTest.questions.length;
    const ratio = raw / total;
    let band = 5.0;
    if (ratio === 1) band = 9.0;
    else if (ratio >= 0.8) band = 8.0;
    else if (ratio >= 0.6) band = 7.0;
    else if (ratio >= 0.4) band = 6.0;

    setScoreResult({ rawScore: raw, bandScore: band });
    setIsSubmitted(true);
    setIsTimerRunning(false);
  };

  const handleReset = () => {
    setAnswers({});
    setFlagged({});
    setIsSubmitted(false);
    setScoreResult(null);
    setTimeLeft(20 * 60);
    setIsTimerRunning(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Test Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white">
              {uzbekMode ? "Kompyuter-Formatidagi IELTS Reading" : "Computer-Delivered IELTS Reading"}
            </h2>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold border border-emerald-500/30">
              Split Screen IDP Format
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {uzbekMode
              ? "Matn chap tomonda, savollar o'ng tomonda. Haqiqiy imtihon dasturi kabi ishlaydi."
              : "Official dual-pane layout: passage on left, question sheet on right with flag review."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Test Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {READING_TESTS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setSelectedTest(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedTest.id === t.id
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Passage {idx + 1}
              </button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span className={timeLeft < 300 ? 'text-rose-400 animate-pulse' : 'text-slate-200'}>
              {formatTimer(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Split-Screen IELTS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        {/* Left Column: Academic Reading Passage */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
          {/* Passage Toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Academic Reading Passage
              </span>
            </div>

            {/* Font size control */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 text-[10px] mr-1">Font:</span>
              <button
                onClick={() => setFontSize('text-xs')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${fontSize === 'text-xs' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('text-sm')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${fontSize === 'text-sm' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('text-base')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${fontSize === 'text-base' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                A+
              </button>
            </div>
          </div>

          {/* Passage Content with comfortable scrolling */}
          <div className="p-6 overflow-y-auto space-y-4 max-h-[650px] font-serif leading-relaxed text-slate-200">
            <h3 className="text-lg sm:text-xl font-bold font-sans text-white border-b border-slate-800 pb-3">
              {selectedTest.passageTitle}
            </h3>

            {selectedTest.passageContent.map((paragraph, idx) => (
              <p key={idx} className={`${fontSize} leading-loose text-slate-300`}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Questions Sheet */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
          {/* Questions Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/60">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Questions (1 - {selectedTest.questions.length})
            </span>
            <span className="text-xs font-mono text-indigo-400">
              {Object.keys(answers).length} / {selectedTest.questions.length} answered
            </span>
          </div>

          {/* Questions List */}
          <div className="p-5 overflow-y-auto space-y-5 max-h-[580px]">
            {selectedTest.questions.map((q, idx) => {
              const userAns = answers[q.id];
              const isFlag = flagged[q.id];
              const isCorrect = isSubmitted && userAns?.toUpperCase() === q.correctAnswer.toUpperCase();

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isSubmitted
                      ? isCorrect
                        ? 'bg-emerald-950/30 border-emerald-500/40'
                        : 'bg-rose-950/30 border-rose-500/40'
                      : isFlag
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      Question {idx + 1}
                    </span>

                    {!isSubmitted && (
                      <button
                        onClick={() => toggleFlag(q.id)}
                        className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                          isFlag
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Flag className="w-3 h-3" />
                        <span>{isFlag ? 'Flagged' : 'Flag'}</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-3">
                    {q.question}
                  </p>

                  {/* Question inputs based on type */}
                  {q.type === 'tfng' ? (
                    <div className="grid grid-cols-3 gap-2">
                      {['TRUE', 'FALSE', 'NOT GIVEN'].map((opt) => (
                        <button
                          key={opt}
                          disabled={isSubmitted}
                          onClick={() => handleSelectAnswer(q.id, opt)}
                          className={`py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                            userAns === opt
                              ? 'bg-indigo-600 text-white shadow'
                              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : q.options ? (
                    <div className="space-y-2">
                      {q.options.map((opt) => {
                        const optKey = opt.charAt(0);
                        const isChosen = userAns === optKey;
                        return (
                          <div
                            key={opt}
                            onClick={() => !isSubmitted && handleSelectAnswer(q.id, optKey)}
                            className={`p-2.5 rounded-lg text-xs font-medium cursor-pointer border transition-all ${
                              isChosen
                                ? 'bg-indigo-600/30 border-indigo-500 text-white'
                                : 'bg-slate-900 border-slate-800/80 text-slate-300 hover:bg-slate-850'
                            }`}
                          >
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                  ) : null}

                  {/* Submission Review mode details */}
                  {isSubmitted && (
                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-400">Your Answer: {userAns || 'None'}</span>
                        <span className={`font-bold font-mono ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isCorrect ? '✓ Correct' : `✗ Correct: ${q.correctAnswer}`}
                        </span>
                      </div>
                      <p className="text-slate-400 italic bg-slate-900/60 p-2 rounded text-[11px] leading-relaxed">
                        Explanation: {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
            {isSubmitted ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-400">
                    Raw Score: <span className="font-bold text-white font-mono">{scoreResult?.rawScore} / {selectedTest.questions.length}</span>
                  </div>
                  <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-lg text-xs font-mono font-bold">
                    Band {scoreResult?.bandScore.toFixed(1)}
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{uzbekMode ? "Qayta topshirish" : "Retake"}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-slate-400">
                  {uzbekMode ? "Barcha savollarni tekshirib chiqing" : "Review flagged items before submitting"}
                </span>
                <button
                  onClick={handleSubmitTest}
                  disabled={Object.keys(answers).length === 0}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                    Object.keys(answers).length === 0
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                  }`}
                >
                  {uzbekMode ? "Testni Yakunlash" : "Submit Reading Test"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { ListeningSection } from '../types';
import { LISTENING_SECTIONS } from '../data/mockTestsData';
import { 
  Headphones, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Award,
  Sparkles
} from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';

interface ListeningViewProps {
  uzbekMode: boolean;
}

export const ListeningView: React.FC<ListeningViewProps> = ({ uzbekMode }) => {
  const [currentSection, setCurrentSection] = useState<ListeningSection>(LISTENING_SECTIONS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{ raw: number; band: number } | null>(null);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handlePlayAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakText(currentSection.transcript, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleSelectAnswer = (qId: number, val: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = () => {
    let raw = 0;
    currentSection.questions.forEach((q) => {
      if ((answers[q.id] || '').trim().toUpperCase() === q.correctAnswer.trim().toUpperCase()) {
        raw += 1;
      }
    });

    const ratio = raw / currentSection.questions.length;
    let band = 5.5;
    if (ratio === 1) band = 9.0;
    else if (ratio >= 0.66) band = 7.5;
    else if (ratio >= 0.33) band = 6.5;

    setScoreResult({ raw, band });
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setIsSubmitted(false);
    setScoreResult(null);
    stopSpeaking();
    setIsPlayingAudio(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white">
              {uzbekMode ? "GoPrep Listening Mock Lab" : "IELTS Listening Lab"}
            </h2>
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold border border-amber-500/30">
              Audio Simulation
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {uzbekMode
              ? "Akademik suhbatni tinglang, audio asosida savollarga javob bering va darhol natijangizni tekshiring."
              : "Listen to the authentic audio dialogue, answer synchronized test questions, and review transcripts."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Audio Player & Context */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5 shadow-xl">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                IELTS Section 1
              </span>
              <h3 className="text-lg font-bold text-white">
                {currentSection.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentSection.context}
              </p>
            </div>

            {/* Audio Wave Player Widget */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  {isPlayingAudio ? (uzbekMode ? "Audio yangramoqda..." : "Audio Playing...") : "Audio Ready"}
                </span>
                <span className="text-xs font-mono text-slate-400">{currentSection.audioDuration}</span>
              </div>

              {/* Simulated Equalizer Bars */}
              <div className="flex items-end justify-center gap-1 h-12 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                {[40, 70, 30, 85, 60, 95, 45, 80, 50, 75, 90, 40, 65, 85, 30, 90].map((height, i) => (
                  <div
                    key={i}
                    style={{ height: isPlayingAudio ? `${Math.max(15, Math.round(height * Math.random()))}%` : '20%' }}
                    className={`w-1.5 rounded-full transition-all duration-150 ${
                      isPlayingAudio ? 'bg-gradient-to-t from-amber-500 to-indigo-500' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Player buttons */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handlePlayAudio}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isPlayingAudio
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                  }`}
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-slate-950" />}
                  <span>{isPlayingAudio ? (uzbekMode ? "To'xtatish" : "Pause Audio") : (uzbekMode ? "Audioni Boshlash" : "Play Recording")}</span>
                </button>
              </div>
            </div>

            {/* Transcript Toggle */}
            <div className="space-y-3">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-between border border-slate-700/80 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{uzbekMode ? "To'liq Audio Transkriptini Ko'rish" : "Toggle Full Audio Transcript"}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {showTranscript ? 'Hide' : 'Show'}
                </span>
              </button>

              {showTranscript && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto">
                  {currentSection.transcript}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Questions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {uzbekMode ? "Bo'lim Savollari" : "Section Questions"}
              </h3>
              <span className="text-xs font-mono text-amber-400">
                {Object.keys(answers).length} / {currentSection.questions.length} answered
              </span>
            </div>

            <div className="space-y-4">
              {currentSection.questions.map((q, idx) => {
                const userAns = answers[q.id];
                const isCorrect = isSubmitted && userAns?.toUpperCase() === q.correctAnswer.toUpperCase();

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isSubmitted
                        ? isCorrect
                          ? 'bg-emerald-950/30 border-emerald-500/40'
                          : 'bg-rose-950/30 border-rose-500/40'
                        : 'bg-slate-950/80 border-slate-800'
                    }`}
                  >
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      Question {idx + 1}
                    </span>

                    <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-2 mb-3">
                      {q.question}
                    </p>

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
                                ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                            }`}
                          >
                            {opt}
                          </div>
                        );
                      })}
                    </div>

                    {isSubmitted && (
                      <div className="mt-3 pt-3 border-t border-slate-800 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Your Answer: {userAns || 'None'}</span>
                          <span className={`font-bold font-mono ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isCorrect ? '✓ Correct' : `✗ Correct: ${q.correctAnswer}`}
                          </span>
                        </div>
                        <p className="text-slate-400 italic text-[11px] pt-1">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {isSubmitted ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                      Result: <strong className="text-white font-mono">{scoreResult?.raw} / {currentSection.questions.length}</strong>
                    </span>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Band {scoreResult?.band.toFixed(1)}
                    </span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{uzbekMode ? "Qayta urinish" : "Retake"}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-slate-400">
                    {uzbekMode ? "Audioni to'liq eshitgach topshiring" : "Ensure you have listened to the recording"}
                  </span>
                  <button
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length === 0}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                      Object.keys(answers).length === 0
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                    }`}
                  >
                    {uzbekMode ? "Natijani Tekshirish" : "Submit & Check Answers"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

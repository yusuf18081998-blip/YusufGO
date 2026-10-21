import React, { useState, useEffect, useRef } from 'react';
import { SpeakingTopic, SpeakingEvaluation } from '../types';
import { SPEAKING_TOPICS } from '../data/mockTestsData';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  Award, 
  Sparkles, 
  AlertCircle, 
  ChevronRight, 
  Clock, 
  FileText,
  HelpCircle,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { speakText, stopSpeaking, VoiceRecorder } from '../utils/speech';

interface SpeakingViewProps {
  uzbekMode: boolean;
}

export const SpeakingView: React.FC<SpeakingViewProps> = ({ uzbekMode }) => {
  const [selectedTopic, setSelectedTopic] = useState<SpeakingTopic>(SPEAKING_TOPICS[0]);
  const [partFilter, setPartFilter] = useState<number>(0); // 0 = all
  const [userSpeech, setUserSpeech] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<SpeakingEvaluation | null>(null);
  const [cueCardNotes, setCueCardNotes] = useState<string>('');
  
  // Timer states for Part 2
  const [prepTimeLeft, setPrepTimeLeft] = useState<number>(60);
  const [isPrepActive, setIsPrepActive] = useState<boolean>(false);
  const [speakTimeLeft, setSpeakTimeLeft] = useState<number>(120);
  const [isSpeakTimerActive, setIsSpeakTimerActive] = useState<boolean>(false);

  const recorderRef = useRef<VoiceRecorder | null>(null);

  useEffect(() => {
    recorderRef.current = new VoiceRecorder();
    return () => {
      stopSpeaking();
      if (recorderRef.current) {
        recorderRef.current.stop();
      }
    };
  }, []);

  // Timer countdown effects
  useEffect(() => {
    let interval: any = null;
    if (isPrepActive && prepTimeLeft > 0) {
      interval = setInterval(() => {
        setPrepTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (prepTimeLeft === 0 && isPrepActive) {
      setIsPrepActive(false);
      speakText("Preparation time is over. Please start speaking now.");
      startRecording();
      setIsSpeakTimerActive(true);
    }
    return () => clearInterval(interval);
  }, [isPrepActive, prepTimeLeft]);

  useEffect(() => {
    let interval: any = null;
    if (isSpeakTimerActive && speakTimeLeft > 0) {
      interval = setInterval(() => {
        setSpeakTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (speakTimeLeft === 0 && isSpeakTimerActive) {
      setIsSpeakTimerActive(false);
      stopRecording();
      speakText("Thank you. That is two minutes.");
    }
    return () => clearInterval(interval);
  }, [isSpeakTimerActive, speakTimeLeft]);

  const filteredTopics = partFilter === 0 
    ? SPEAKING_TOPICS 
    : SPEAKING_TOPICS.filter((t) => t.part === partFilter);

  const handleSelectTopic = (topic: SpeakingTopic) => {
    setSelectedTopic(topic);
    setUserSpeech('');
    setEvaluation(null);
    setIsRecording(false);
    setIsPrepActive(false);
    setIsSpeakTimerActive(false);
    setPrepTimeLeft(60);
    setSpeakTimeLeft(120);
    setCueCardNotes('');
  };

  const handleHearQuestion = () => {
    let textToSpeak = selectedTopic.question;
    if (selectedTopic.cueCardPoints && selectedTopic.cueCardPoints.length > 0) {
      textToSpeak += ". You should say: " + selectedTopic.cueCardPoints.join('. ');
    }
    speakText(textToSpeak);
  };

  const startRecording = () => {
    if (!recorderRef.current || !recorderRef.current.isSupported()) {
      alert("Microphone recognition is not supported in this browser. You can type your answer directly in the text area below!");
      return;
    }
    setIsRecording(true);
    recorderRef.current.start(
      (result) => {
        setUserSpeech(result.final + (result.interim ? ' ' + result.interim : ''));
      },
      (err) => {
        console.warn('Rec error:', err);
        setIsRecording(false);
      }
    );
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
    }
    setIsRecording(false);
    setIsSpeakTimerActive(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleEvaluate = async () => {
    if (!userSpeech || userSpeech.trim().length < 5) {
      alert(uzbekMode ? "Iltimos, avval javobingizni gapiring yoki yozing." : "Please speak or enter your response first.");
      return;
    }

    setIsEvaluating(true);
    try {
      const res = await fetch('/api/evaluate-speaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic.title,
          question: selectedTopic.question,
          part: selectedTopic.part,
          userSpeech: userSpeech.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('Evaluation request failed');
      }

      const data = await res.json();
      setEvaluation(data);
    } catch (err: any) {
      console.error(err);
      alert(uzbekMode ? "Baholashda xatolik yuz berdi. Qaytadan urinib ko'ring." : "Error evaluating response: " + err.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white">
              {uzbekMode ? "GoPrep AI Speaking Examiner" : "AI Speaking Examiner (Preppy Coach)"}
            </h2>
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono font-bold border border-purple-500/30">
              100% Free
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {uzbekMode 
              ? "Haqiqiy IELTS Speaking imtihoni simulyatsiyasi: Ovoz bilan gapiring, AI band ballingizni va xatolaringizni aniqlasin."
              : "Real-time IELTS Speaking test simulator with official 4-rubric scoring, lexical upgrades, and Band 9 model audio."}
          </p>
        </div>

        {/* Filter parts */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {[
            { id: 0, label: 'All Parts' },
            { id: 1, label: 'Part 1: Intro' },
            { id: 2, label: 'Part 2: Cue Card' },
            { id: 3, label: 'Part 3: Discussion' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPartFilter(tab.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                partFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Topics List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>{uzbekMode ? "Imtihon Mavzulari" : "Available Topics"}</span>
            <span className="font-mono text-indigo-400">{filteredTopics.length} tests</span>
          </h3>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredTopics.map((topic) => {
              const isSelected = selectedTopic.id === topic.id;
              return (
                <div
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Part {topic.part}
                    </span>
                    <span className="text-[11px] text-indigo-400 font-medium">
                      {topic.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {topic.question}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Test Room */}
        <div className="lg:col-span-8 space-y-6">
          {/* Examiner Question Box */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/30 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  AI
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {uzbekMode ? "IELTS Examiner (Preppy)" : "IELTS Examiner Prompt"}
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    Part {selectedTopic.part} • {selectedTopic.category}
                  </span>
                </div>
              </div>

              <button
                onClick={handleHearQuestion}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition-colors"
                title="Savolni tinglash"
              >
                <Volume2 className="w-4 h-4 text-indigo-400" />
                <span>{uzbekMode ? "Eshitish" : "Listen Question"}</span>
              </button>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                "{selectedTopic.question}"
              </p>

              {/* Cue Card Points for Part 2 */}
              {selectedTopic.part === 2 && selectedTopic.cueCardPoints && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                    {uzbekMode ? "Siz quyidagilar haqida gapirishingiz kerak:" : "You should say:"}
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedTopic.cueCardPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Part 2 Countdown Timer Controls */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">1-Min Preparation</span>
                        <span className={`text-xl font-bold font-mono ${prepTimeLeft <= 10 && isPrepActive ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
                          00:{prepTimeLeft < 10 ? `0${prepTimeLeft}` : prepTimeLeft}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setIsPrepActive(!isPrepActive);
                          if (!isPrepActive && prepTimeLeft === 60) {
                            speakText("You have one minute to prepare your notes. Your time starts now.");
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          isPrepActive 
                            ? 'bg-rose-600 text-white' 
                            : 'bg-amber-600 hover:bg-amber-500 text-white'
                        }`}
                      >
                        {isPrepActive ? 'Pause' : 'Start 1m Prep'}
                      </button>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">2-Min Speaking</span>
                        <span className={`text-xl font-bold font-mono ${speakTimeLeft <= 20 && isSpeakTimerActive ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                          {Math.floor(speakTimeLeft / 60)}:{(speakTimeLeft % 60) < 10 ? `0${speakTimeLeft % 60}` : speakTimeLeft % 60}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">Auto-timed</span>
                    </div>
                  </div>

                  {/* Preparation Notepad for Part 2 */}
                  <div className="mt-2">
                    <textarea
                      value={cueCardNotes}
                      onChange={(e) => setCueCardNotes(e.target.value)}
                      placeholder={uzbekMode ? "1 daqiqalik tayyorgarlik uchun qoralama qaydlar (Notes)..." : "Draft your 1-minute bullet point notes here..."}
                      rows={2}
                      className="w-full bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Speaking Tips */}
            {selectedTopic.tips && (
              <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60">
                <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-300">Examiner Tip: </span>
                  {selectedTopic.tips.join(' ')}
                </div>
              </div>
            )}
          </div>

          {/* User Voice Input Section */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>{uzbekMode ? "Sizning Nutqingiz (Transkript)" : "Your Spoken Response (Transcript)"}</span>
              </h4>
              <span className="text-xs font-mono text-slate-400">
                {userSpeech.trim() ? userSpeech.trim().split(/\s+/).length : 0} {uzbekMode ? "so'z" : "words"}
              </span>
            </div>

            {/* Live Recording Mic Controls */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleRecording}
                  className={`relative p-4 rounded-2xl flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 animate-pulse scale-105'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                  }`}
                  title={isRecording ? "Yozishni to'xtatish" : "Mikrofonni yoqish"}
                >
                  {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  {isRecording && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                  )}
                </button>
                <div>
                  <h5 className="font-bold text-white text-sm">
                    {isRecording 
                      ? (uzbekMode ? "Ovoz yozilmoqda... Gapiring!" : "Listening... Speak naturally!") 
                      : (uzbekMode ? "Mikrofonni yoqing yoki matn kiriting" : "Click mic to speak or type directly")}
                  </h5>
                  <p className="text-xs text-slate-400">
                    {isRecording 
                      ? (uzbekMode ? "Siz aytgan so'zlar avtomatik yoziladi" : "Your voice is transcribed in real time")
                      : (uzbekMode ? "Brauzeringiz mikrofonidan foydalaniladi" : "Powered by speech-to-text with auto punctuation")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {userSpeech && (
                  <button
                    onClick={() => setUserSpeech('')}
                    className="p-2 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleEvaluate}
                  disabled={isEvaluating || !userSpeech.trim()}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                    isEvaluating || !userSpeech.trim()
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  {isEvaluating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{uzbekMode ? "AI Baholamoqda..." : "Evaluating with AI..."}</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      <span>{uzbekMode ? "Examiner Bahosini Olish" : "Get Band Score Evaluation"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Editable Transcript Area */}
            <textarea
              value={userSpeech}
              onChange={(e) => setUserSpeech(e.target.value)}
              placeholder={uzbekMode 
                ? "Nutqingiz shu yerda aks etadi yoki javobingizni to'g'ridan-to'g'ri klaviatura orqali yozishingiz mumkin..."
                : "Your spoken response will appear here. You can also edit it or type directly..."}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-normal leading-relaxed"
            />
          </div>

          {/* AI Evaluation Report (GoPrep Style) */}
          {evaluation && (
            <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 p-6 space-y-6 shadow-2xl animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                      Official IELTS Assessment
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-500/30">
                      Verified
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">
                    {uzbekMode ? "Imtihon Natijasi & Tahlil" : "Examiner Evaluation & Diagnostic"}
                  </h3>
                </div>

                {/* Overall Band Pill */}
                <div className="flex items-center gap-3 bg-slate-900/90 border border-indigo-500/40 p-3 rounded-2xl">
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

              {/* 4 Official IELTS Sub-scores */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Fluency & Coherence', score: evaluation.breakdown.fluencyCoherence },
                  { label: 'Lexical Resource', score: evaluation.breakdown.lexicalResource },
                  { label: 'Grammar Accuracy', score: evaluation.breakdown.grammaticalRange },
                  { label: 'Pronunciation', score: evaluation.breakdown.pronunciation },
                ].map((crit, idx) => (
                  <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
                    <span className="text-[11px] text-slate-400 block line-clamp-1">{crit.label}</span>
                    <span className="text-lg font-bold font-mono text-indigo-300 mt-0.5 block">
                      {crit.score.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Overview Summary */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Examiner Summary
                </h5>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {evaluation.summary}
                </p>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>{uzbekMode ? "Kuchli Tomonlaringiz" : "Key Strengths"}</span>
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
                    <span>{uzbekMode ? "Oshirish Kerak Bo'lgan Joylar" : "Areas for Growth"}</span>
                  </h5>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {evaluation.improvements.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Grammar Corrections */}
              {evaluation.grammarCorrections && evaluation.grammarCorrections.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>{uzbekMode ? "Grammatik Xatolar & Tuzatishlar" : "Grammar Corrections & Rules"}</span>
                  </h4>
                  <div className="space-y-2">
                    {evaluation.grammarCorrections.map((corr, idx) => (
                      <div key={idx} className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="line-through text-rose-400 font-mono">"{corr.original}"</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-emerald-400 font-semibold font-mono">"{corr.suggestion}"</span>
                        </div>
                        <p className="text-slate-400 italic">
                          Rule: {corr.rule}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Band 8+ Vocabulary Upgrades */}
              {evaluation.vocabularyUpgrades && evaluation.vocabularyUpgrades.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>{uzbekMode ? "Band 8+ Lug'at Tavsiyalari" : "Band 8+ Vocabulary Upgrades"}</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {evaluation.vocabularyUpgrades.map((vocab, idx) => (
                      <div key={idx} className="bg-slate-900/90 border border-purple-500/20 p-3 rounded-xl space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 line-through">"{vocab.original}"</span>
                          <span className="text-purple-300 font-bold font-mono bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                            {vocab.upgrade}
                          </span>
                        </div>
                        <p className="text-slate-300 italic pt-1 border-t border-slate-800">
                          Example: "{vocab.example}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Model Band 9 Answer with Native Audio */}
              <div className="bg-indigo-950/30 border border-indigo-500/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-indigo-400" />
                    <span>{uzbekMode ? "Examiner Band 9 Namunaviy Javobi" : "Examiner Band 9 Model Response"}</span>
                  </h4>
                  <button
                    onClick={() => speakText(evaluation.modelAnswer)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{uzbekMode ? "Tinglash" : "Listen Audio"}</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif italic bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
                  "{evaluation.modelAnswer}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

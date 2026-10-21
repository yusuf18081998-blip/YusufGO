import React, { useState, useEffect, useRef } from 'react';
import { ConversationTurn, MistakeDetail } from '../types';
import { 
  Mic, 
  MicOff, 
  PhoneCall, 
  PhoneOff, 
  Volume2, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  Flame, 
  Sparkles, 
  Award, 
  Send, 
  ChevronRight,
  ShieldAlert,
  Headphones,
  Sliders,
  HelpCircle
} from 'lucide-react';
import { VoiceRecorder, speakWithStudioVoice, stopSpeaking } from '../utils/speech';

interface LiveSpeakingCallViewProps {
  uzbekMode: boolean;
}

export const LiveSpeakingCallView: React.FC<LiveSpeakingCallViewProps> = ({ uzbekMode }) => {
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isExaminerSpeaking, setIsExaminerSpeaking] = useState<boolean>(false);
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [strictness, setStrictness] = useState<'strict' | 'brutal' | 'standard'>('strict');
  const [selectedVoice, setSelectedVoice] = useState<string>('Charon'); // Charon is deep, strict British male
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [topic, setTopic] = useState<string>('Artificial Intelligence & Modern Lifestyle');

  const recorderRef = useRef<VoiceRecorder | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial welcome message from Professor Sterling
  useEffect(() => {
    recorderRef.current = new VoiceRecorder();
    return () => {
      stopSpeaking();
      if (recorderRef.current) recorderRef.current.stop();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isProcessing, isExaminerSpeaking]);

  const startCall = () => {
    setIsCallActive(true);
    const greeting = "Good day, Yusuf. I am Professor Sterling, your Cambridge IELTS speaking examiner. Let me be unequivocally clear: I expect rigorous, Band 8.0+ precision from you. If you make clumsy grammar mistakes, speak in fragments, or use lazy vocabulary, I will stop you immediately. Let us begin: tell me, how has artificial intelligence influenced the way you study English?";
    
    const initialTurn: ConversationTurn = {
      id: 'init-call',
      userSpeech: '',
      examinerReply: greeting,
      examinerMood: 'neutral',
      mistakes: [],
      bandEstimate: 7.0,
      advancedVocab: ['Unequivocally', 'Rigorous precision', 'Push the envelope'],
      uzbekTip: "Professor Sterling gapirishni boshladi. Xato qilsangiz, u darhol g'azablanib to'g'irlaydi! Diqqat bilan, to'liq gaplar tuzib javob bering.",
      timestamp: Date.now(),
    };

    setConversation([initialTurn]);
    setIsExaminerSpeaking(true);
    speakWithStudioVoice(
      greeting,
      selectedVoice,
      () => setIsExaminerSpeaking(true),
      () => setIsExaminerSpeaking(false)
    );
  };

  const endCall = () => {
    stopSpeaking();
    if (recorderRef.current) recorderRef.current.stop();
    setIsCallActive(false);
    setIsRecording(false);
    setIsExaminerSpeaking(false);
  };

  const startListening = () => {
    if (!recorderRef.current || !recorderRef.current.isSupported()) {
      alert("Microphone recognition not supported in this browser. Please type your speech in the input box!");
      return;
    }
    stopSpeaking();
    setIsExaminerSpeaking(false);
    setIsRecording(true);

    recorderRef.current.start(
      (result) => {
        setUserTranscript(result.final + (result.interim ? ' ' + result.interim : ''));
      },
      (err) => {
        console.warn('Speech rec err:', err);
        setIsRecording(false);
      }
    );
  };

  const stopListeningAndSend = () => {
    if (recorderRef.current) recorderRef.current.stop();
    setIsRecording(false);
    if (userTranscript.trim()) {
      handleSendSpeech(userTranscript.trim());
    }
  };

  const handleSendSpeech = async (speechText: string) => {
    if (!speechText || isProcessing) return;

    setIsProcessing(true);
    setUserTranscript('');

    const historyPayload = conversation.map((c) => ({
      role: 'user',
      text: c.userSpeech,
    })).concat(conversation.map((c) => ({
      role: 'model',
      text: c.examinerReply,
    })));

    try {
      const res = await fetch('/api/speaking-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userSpeech: speechText,
          conversationHistory: historyPayload,
          topic,
          strictness,
        }),
      });

      if (!res.ok) throw new Error('Speaking conversation failed');
      const data = await res.json();

      const newTurn: ConversationTurn = {
        id: Date.now().toString(),
        userSpeech: speechText,
        examinerReply: data.replyText,
        examinerMood: data.examinerMood || 'neutral',
        mistakes: data.mistakesFound || [],
        bandEstimate: data.instantBandEstimate || 6.5,
        advancedVocab: data.advancedVocabToUse || [],
        uzbekTip: data.uzbekTip || '',
        timestamp: Date.now(),
      };

      setConversation((prev) => [...prev, newTurn]);

      // Automatically speak the examiner's response with studio voice!
      setIsExaminerSpeaking(true);
      speakWithStudioVoice(
        data.replyText,
        selectedVoice,
        () => setIsExaminerSpeaking(true),
        () => setIsExaminerSpeaking(false)
      );
    } catch (err: any) {
      console.error(err);
      alert("Suhbatda xatolik yuz berdi: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const latestTurn = conversation[conversation.length - 1];
  const latestMood = latestTurn?.examinerMood || 'neutral';

  const getMoodBadge = (mood: string) => {
    switch (mood) {
      case 'furious':
        return {
          label: uzbekMode ? "G'azablangan (Qo'pol Xato!)" : "Furious (Blunder Detected!)",
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          ring: 'ring-rose-500/60 shadow-rose-500/30',
          emoji: '😠'
        };
      case 'stern':
        return {
          label: uzbekMode ? "Qattiqqo'l Tanbeh" : "Stern Reprimand",
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          ring: 'ring-amber-500/60 shadow-amber-500/30',
          emoji: '🧐'
        };
      case 'impressed':
        return {
          label: uzbekMode ? "Hayratlangan (Zo'r gap!)" : "Impressed (Band 8+ Phrase)",
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          ring: 'ring-emerald-500/60 shadow-emerald-500/30',
          emoji: '👏'
        };
      case 'proud':
        return {
          label: uzbekMode ? "Faxrlangan (Band 8.5+)" : "Proud (Band 8.5+ Mastery)",
          color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          ring: 'ring-indigo-500/60 shadow-indigo-500/30',
          emoji: '🌟'
        };
      default:
        return {
          label: uzbekMode ? "Diqqat bilan tinglamoqda" : "Assessing Candidate",
          color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          ring: 'ring-purple-500/60 shadow-purple-500/30',
          emoji: '👔'
        };
    }
  };

  const currentMoodBadge = getMoodBadge(latestMood);

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <PhoneCall className="w-6 h-6 text-indigo-400" />
              <span>{uzbekMode ? "Jonli AI Speaking Muloqot (GoPrep Voice Call)" : "Live AI Speaking Call (Professor Sterling)"}</span>
            </h2>
            <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono font-bold border border-rose-500/30 flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-400 fill-rose-400" />
              <span>{uzbekMode ? "Qattiqqo'l Rejim: Faol" : "Strict Examiner: Active"}</span>
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {uzbekMode
              ? "Noto'g'ri gapirsangiz darhol g'azablanib to'g'irlaydigan, robot ovozi bo'lmagan professional Britan IELTS examineri bilan jonli muloqot."
              : "Live interactive voice dialogue with an uncompromising British examiner who calls out grammar errors in real time with studio-grade natural voice."}
          </p>
        </div>

        {/* Settings: Voice & Strictness */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          {/* Strictness switcher */}
          <select
            value={strictness}
            onChange={(e) => setStrictness(e.target.value as any)}
            className="bg-slate-950 text-xs font-semibold text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500"
            title="Qattiqqo'llik darajasi"
          >
            <option value="strict">🔥 Qattiqqo'l (G'azablanuvchi)</option>
            <option value="brutal">⚡ Brutal 9.0 (Kechirimsiz)</option>
            <option value="standard">🎓 Standart Examiner</option>
          </select>

          {/* Voice selector */}
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="bg-slate-950 text-xs font-semibold text-indigo-300 px-2.5 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500"
            title="Examiner ovozi"
          >
            <option value="Charon">🎙️ Charon (Deep British Male)</option>
            <option value="Fenrir">🎙️ Fenrir (Authoritative Professor)</option>
            <option value="Kore">🎙️ Kore (Senior Female Examiner)</option>
            <option value="Puck">🎙️ Puck (Energetic Cambridge)</option>
          </select>
        </div>
      </div>

      {!isCallActive ? (
        /* Pre-Call Setup Screen */
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Examiner Avatar */}
          <div className="relative inline-block mx-auto">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-rose-600 p-1 shadow-2xl shadow-indigo-500/30">
              <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-center p-2">
                <span className="text-3xl sm:text-4xl">👨‍🏫</span>
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mt-1">Prof. Sterling</span>
              </div>
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-400 rounded-full border-4 border-slate-950 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>

          <div className="max-w-xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {uzbekMode ? "Professor Sterling bilan Jonli Imtihon" : "Live IELTS Interview with Professor Sterling"}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {uzbekMode 
                ? "Siz so'raganingizdek: AI faqat inglizcha gaplashadi. Agar xato qilsangiz, to'xtatib qattiq tanbeh beradi va to'g'ri shaklini takrorlatadi. Ovozi eng so'nggi Gemini Studio AI orqali jonli yangraydi."
                : "Real-time conversational IELTS test. The AI speaks with rich British studio cadence, instantly interrupts errors, demands corrections, and awards band scores."}
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 text-left space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-300 font-bold">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>{uzbekMode ? "Yusuf uchun maxsus qoidalar:" : "Ground Rules:"}</span>
              </div>
              <ul className="space-y-1 text-slate-400 pl-6 list-disc text-[11px]">
                <li>{uzbekMode ? "Hech qanday mayda gaplar ('um', 'err') qabul qilinmaydi." : "No lazy monosyllabic answers."}</li>
                <li>{uzbekMode ? "'I am agree' yoki noto'g'ri zamonlar kabi xatolarda examiner darhol to'xtatadi." : "Grammar mistakes like 'I am agree' will trigger an immediate stern rebuke."}</li>
                <li>{uzbekMode ? "Ovozli gapirish yoki yozish orqali javob berishingiz mumkin." : "Speak with your microphone or type your response."}</li>
              </ul>
            </div>
          </div>

          {/* Call button */}
          <div className="pt-2">
            <button
              onClick={startCall}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-extrabold text-base shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <PhoneCall className="w-5 h-5 animate-bounce" />
              <span>{uzbekMode ? "Qo'ng'iroqni Boshlash (Start Live Call)" : "Start Real-Time Voice Call"}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Call Interface */
        <div className="space-y-6">
          {/* Top Live Call Header & Status HUD */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Examiner Profile & Dynamic State */}
              <div className="flex items-center gap-4">
                <div className={`relative w-20 h-20 rounded-2xl p-1 transition-all duration-300 ring-4 ${currentMoodBadge.ring}`}>
                  <div className="w-full h-full rounded-xl bg-slate-950 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl">{currentMoodBadge.emoji}</span>
                    <span className="text-[9px] font-bold text-slate-400 font-mono mt-0.5">Examiner</span>
                  </div>
                  {isExaminerSpeaking && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500" />
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">Professor Sterling</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentMoodBadge.color}`}>
                      {currentMoodBadge.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {isExaminerSpeaking 
                      ? (uzbekMode ? "Examiner ovozli gapirmoqda..." : "Speaking in British studio audio...")
                      : isRecording
                      ? (uzbekMode ? "Sizni tinglamoqda... Gapiring!" : "Listening to candidate speech...")
                      : (uzbekMode ? "Sizning javobingizni kutmoqda" : "Awaiting candidate response")}
                  </p>
                </div>
              </div>

              {/* Real-time Band Score & Action Buttons */}
              <div className="flex items-center gap-4 justify-between md:justify-end">
                <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-2xl text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Level</span>
                  <span className="text-xl font-black font-mono text-emerald-400">
                    Band {latestTurn?.bandEstimate ? latestTurn.bandEstimate.toFixed(1) : '7.0'}
                  </span>
                </div>

                <button
                  onClick={endCall}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
                  title="Qo'ng'iroqni tugatish"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>{uzbekMode ? "Tugatish" : "End Call"}</span>
                </button>
              </div>
            </div>

            {/* If mistakes detected in latest turn, show prominent Warning Bar */}
            {latestTurn?.mistakes && latestTurn.mistakes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                  <span>{uzbekMode ? "Examiner Aniqlagan Xatolar (G'azab Sababi):" : "Immediate Examiner Correction:"}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {latestTurn.mistakes.map((m, idx) => (
                    <div key={idx} className="bg-rose-950/30 border border-rose-500/30 p-2.5 rounded-xl text-xs space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="line-through text-rose-400 font-mono">"{m.mistake}"</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-emerald-400 font-bold font-mono">"{m.correction}"</span>
                      </div>
                      <p className="text-[11px] text-slate-400 italic">{m.explanation}</p>
                    </div>
                  ))}
                </div>

                {latestTurn.uzbekTip && uzbekMode && (
                  <div className="bg-amber-950/20 border border-amber-500/30 p-2 rounded-lg text-xs text-amber-300 font-medium">
                    💡 <strong>O'zbekcha Maslahat:</strong> {latestTurn.uzbekTip}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Conversation Transcript Stream */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-4 sm:p-6 min-h-[380px] max-h-[500px] overflow-y-auto space-y-4 shadow-inner">
            {conversation.map((turn, idx) => (
              <div key={turn.id || idx} className="space-y-3">
                {/* User Turn */}
                {turn.userSpeech && (
                  <div className="flex items-start justify-end gap-3">
                    <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none p-4 max-w-[85%] text-xs sm:text-sm shadow-md leading-relaxed">
                      <span className="text-[10px] uppercase font-bold text-indigo-200 block mb-1">Yusuf</span>
                      <p>{turn.userSpeech}</p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      Y
                    </div>
                  </div>
                )}

                {/* Examiner Turn */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                    👨‍🏫
                  </div>
                  <div className={`p-4 max-w-[85%] rounded-2xl rounded-tl-none text-xs sm:text-sm leading-relaxed space-y-2 border shadow-lg ${
                    turn.examinerMood === 'furious'
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-100'
                      : turn.examinerMood === 'stern'
                      ? 'bg-amber-950/30 border-amber-500/30 text-amber-100'
                      : turn.examinerMood === 'impressed' || turn.examinerMood === 'proud'
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100'
                      : 'bg-slate-950 border-slate-800 text-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Prof. Sterling ({turn.examinerMood})
                      </span>
                      <button
                        onClick={() => speakWithStudioVoice(turn.examinerReply, selectedVoice)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                        title="Ovozni qayta tinglash"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Replay Voice</span>
                      </button>
                    </div>

                    <p className="font-serif sm:text-sm leading-relaxed whitespace-pre-line">
                      "{turn.examinerReply}"
                    </p>

                    {/* Band 8+ Vocabulary suggestions */}
                    {turn.advancedVocab && turn.advancedVocab.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Use these:</span>
                        {turn.advancedVocab.map((voc, vIdx) => (
                          <span key={vIdx} className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
                            {voc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs">
                  👨‍🏫
                </div>
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>{uzbekMode ? "Examiner javobingizni tahlil qilmoqda..." : "Examiner is scrutinizing your grammar..."}</span>
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>

          {/* User Input & Microphone Bar */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-indigo-400" />
                <span>{uzbekMode ? "Sizning Nutqingiz:" : "Your Spoken Response:"}</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {isRecording ? (uzbekMode ? "Mikrofon yozmoqda..." : "Recording live audio...") : (uzbekMode ? "Mikrofonni bosing yoki yozing" : "Push mic to speak or enter text")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Mic toggle button */}
              <button
                onClick={() => {
                  if (isRecording) {
                    stopListeningAndSend();
                  } else {
                    startListening();
                  }
                }}
                className={`p-4 rounded-2xl flex items-center justify-center transition-all ${
                  isRecording
                    ? 'bg-rose-600 text-white shadow-xl shadow-rose-600/50 scale-105 animate-pulse'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                }`}
                title={isRecording ? "Yozishni yakunlash va jo'natish" : "Ovoz bilan gapirish"}
              >
                {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              {/* Text Input / Live Transcript area */}
              <input
                type="text"
                value={userTranscript}
                onChange={(e) => setUserTranscript(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && userTranscript.trim()) {
                    handleSendSpeech(userTranscript.trim());
                  }
                }}
                placeholder={isRecording 
                  ? (uzbekMode ? "Nutqingiz eshitilmoqda... To'xtatish uchun mikrofonni yana bosing." : "Transcribing your voice... Press mic again when done speaking.")
                  : (uzbekMode ? "Inglizcha javobingizni shu yerga gapiring yoki klaviaturada yozing..." : "Speak into mic or type your English response here...")}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />

              {/* Send button */}
              <button
                onClick={() => {
                  if (userTranscript.trim()) {
                    handleSendSpeech(userTranscript.trim());
                  }
                }}
                disabled={!userTranscript.trim() || isProcessing}
                className={`p-3 rounded-xl transition-all ${
                  !userTranscript.trim() || isProcessing
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                }`}
                title="Examinerga topshirish"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

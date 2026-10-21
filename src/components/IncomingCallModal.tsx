import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Volume2, ExternalLink, Sparkles, X, MessageSquare, Send } from 'lucide-react';
import { PreppyAvatar } from './PreppyAvatar';
import { speakWithStudioVoice, stopSpeaking, unlockAudioAutoplay } from '../utils/speech';

interface IncomingCallModalProps {
  userName: string;
  userPhone: string;
  userPersona?: string;
  onClose: () => void;
  onStartLesson: () => void;
}

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  userName = 'Yusuf',
  userPhone = '+998 90 123 45 67',
  userPersona = 'developer',
  onClose,
  onStartLesson,
}) => {
  const [callState, setCallState] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [callSeconds, setCallSeconds] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const ringIntervalRef = useRef<any>(null);

  // Play realistic phone ringtone using Web Audio API oscillator
  const playRingtoneBeep = () => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(440, ctx.currentTime);
      osc2.frequency.setValueAtTime(480, ctx.currentTime);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.8);
      osc2.stop(ctx.currentTime + 1.8);

      // Trigger smartphone physical vibration
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([700, 300, 700, 300]);
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    if (callState === 'ringing') {
      playRingtoneBeep();
      ringIntervalRef.current = setInterval(() => {
        playRingtoneBeep();
      }, 3000);
    }

    return () => {
      if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
      stopSpeaking();
    };
  }, [callState]);

  // Timer when connected
  useEffect(() => {
    let timer: any = null;
    if (callState === 'connected') {
      timer = setInterval(() => setCallSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const handleAnswer = () => {
    unlockAudioAutoplay();
    if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    setCallState('connected');

    let scoldSpeech = '';
    if (userPersona === 'romantic') {
      scoldSpeech = `Allo, azizim ${userName}! Nega bugun darsga kirmadingiz?! Sizni sog'inib, o'zim telefon qildim! Qani, darhol dars qilamiz, 'Hello my love' yoki 'Hello Preppy' deb ayting!`;
    } else if (userPersona === 'developer') {
      scoldSpeech = `Allo senior dev ${userName}! Critical bug: bugungi dars bajarilmagan! Men sizga bekorga telefon qilayotganim yo'q! Qani hoziroq darsimizni boshlaymiz: 'Hello Preppy, I am ready' deb ayting!`;
    } else if (userPersona === 'spicy_18') {
      scoldSpeech = `Allo ${userName}! Qayerdasiz?! Nega dars qilmadingiz?! Men sizni kutib charchadim, hoziroq darsga kiring va 'Hello' deng!`;
    } else {
      scoldSpeech = `Allo, ${userName}! Qayerdasiz?! Nega bugun dars qilmadingiz?! Men senga bekorga telefon qilayotganim yo'q! Hoziroq 0 dan dars qilamiz! Qani, takrorlang: Hello! My name is ${userName}!`;
    }

    // Select warm, natural voice based on persona
    const callVoice = userPersona === 'romantic' ? 'Aoede' : (userPersona === 'spicy_18' ? 'Kore' : 'Puck');

    speakWithStudioVoice(
      scoldSpeech,
      callVoice,
      undefined,
      () => {}
    );
  };

  const handleEnd = () => {
    stopSpeaking();
    if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    setCallState('ended');
    setTimeout(() => onClose(), 400);
  };

  const handleDirectDeviceDial = () => {
    const cleanPhone = userPhone.replace(/[^\d+]/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  const handleSendSms = () => {
    const cleanPhone = userPhone.replace(/[^\d+]/g, '');
    const smsText = `Preppy ogohlantirishi: ${userName}, bugun ingliz tili darsingizni qilmadingiz! Hoziroq ilovaga kiring: https://yusufgo.uz`;
    window.location.href = `sms:${cleanPhone}?body=${encodeURIComponent(smsText)}`;
  };

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#250d1d] via-[#160810] to-[#0a0307] border-2 border-rose-500/40 rounded-[45px] p-6 shadow-2xl flex flex-col justify-between items-center text-slate-100 overflow-hidden min-h-[580px]">
        {/* Top Status */}
        <div className="text-center space-y-1 pt-2 w-full">
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-400 bg-rose-950/80 px-3 py-1 rounded-full border border-rose-800/40">
              {callState === 'ringing' ? '📞 KIRUVCHI QO\'NG\'IROQ...' : `JONLI ALOQA: ${formatSecs(callSeconds)}`}
            </span>
            <button onClick={handleEnd} className="text-slate-400 hover:text-white p-1 rounded-full bg-slate-900/60">
              <X className="w-4 h-4" />
            </button>
          </div>
          <h3 className="text-xl font-black text-white pt-2">Preppy (GoPrep)</h3>
          <p className="text-xs text-rose-300/80 font-mono">
            {userPhone || '+998 90 123 45 67'}
          </p>
        </div>

        {/* Center: Preppy Avatar with ringing animation */}
        <div className="my-auto flex flex-col items-center justify-center text-center space-y-3">
          <div className={`relative ${callState === 'ringing' ? 'animate-bounce duration-700' : ''}`}>
            <PreppyAvatar
              mood={userPersona === 'romantic' ? 'heart' : 'furious'}
              isSpeaking={callState === 'connected'}
              isListening={false}
              persona={userPersona as any}
            />
            {callState === 'ringing' && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500" />
              </span>
            )}
          </div>

          {callState === 'connected' ? (
            <div className="bg-slate-950/90 border border-rose-900/60 p-3 rounded-2xl max-w-xs text-xs space-y-2 shadow">
              <span className="font-bold text-rose-400 block flex items-center justify-center gap-1">
                <Volume2 className="w-3.5 h-3.5" />
                Preppy Gapirmoqda:
              </span>
              <p className="text-slate-200 italic leading-relaxed">
                "{userName}, nega bugun dars qilmadingiz?! Qani hoziroq 0 dan darsni boshlaymiz!"
              </p>
              <button
                onClick={() => {
                  handleEnd();
                  onStartLesson();
                }}
                className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg"
              >
                Muloqotni Boshlash (Mikrofon Ochiq) 🎙️
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-xs text-rose-300 font-bold animate-pulse">
                Preppy sizga dars qildirish uchun telefon qilmoqda!
              </p>
              <p className="text-[10px] text-slate-400 max-w-[240px]">
                Qo'ng'iroqqa javob bering yoki pastdagi tugma orqali telefoningizga real qo'ng'iroq qiling
              </p>
            </div>
          )}
        </div>

        {/* Bottom Call Buttons */}
        <div className="w-full pb-3 space-y-2.5">
          {callState === 'ringing' ? (
            <div className="flex items-center justify-around w-full px-4">
              {/* Decline */}
              <button
                onClick={handleEnd}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all"
                title="Rad etish"
              >
                <PhoneOff className="w-7 h-7" />
              </button>

              {/* Answer */}
              <button
                onClick={handleAnswer}
                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all animate-pulse"
                title="Javob berish"
              >
                <Phone className="w-7 h-7" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleEnd}
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Qo'ng'iroqni Yakunlash</span>
            </button>
          )}

          {/* Action Row: Real Cellular Call & SMS */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleDirectDeviceDial}
              className="py-2.5 px-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-rose-900/50 text-slate-200 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
              title="Telefon orqali real qo'ng'iroq qilish"
            >
              <ExternalLink className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Real Tel Qilish</span>
            </button>

            <button
              onClick={handleSendSms}
              className="py-2.5 px-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-900/50 text-slate-200 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
              title="SMS ogohlantirish yuborish"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>SMS Xabarnoma</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { PreppyAvatar, PreppyMood } from './PreppyAvatar';
import { ConversationTurn } from '../types';
import { OnboardingModal, UserProfile, PreppyPersona, PERSONA_OPTIONS } from './OnboardingModal';
import { EmailReminderModal } from './EmailReminderModal';
import { IncomingCallModal } from './IncomingCallModal';
import { 
  speakWithStudioVoice, 
  stopSpeaking, 
  VoiceRecorder,
  getAvailableNaturalVoices,
  VoiceOption,
  unlockAudioAutoplay
} from '../utils/speech';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Flame, 
  Sparkles, 
  RotateCcw, 
  PhoneCall, 
  Mail, 
  BookOpen, 
  Square, 
  History, 
  Keyboard, 
  Send,
  User,
  Radio,
  Languages,
  CheckCircle2
} from 'lucide-react';

export interface ZeroLesson {
  id: string;
  number: number;
  titleUz: string;
  titleEn: string;
  targetPhrase: string;
  translation: string;
  initialPrompt: string;
  tip: string;
}

export const ZERO_LESSONS: ZeroLesson[] = [
  {
    id: 'lesson-1',
    number: 1,
    titleUz: "1-Dars: Salomlashish & Tanishuv",
    titleEn: "Greetings & Intro",
    targetPhrase: "Hello! My name is Yusuf.",
    translation: "Salom! Mening ismim Yusuf.",
    initialPrompt: "Salom Yusuf! Keling, ingliz tilini 0 dan boshlaymiz! 1-mashqimiz: 'Salom! Mening ismim Yusuf' deb aytishni o'rganamiz. Bu inglizchada: 'Hello! My name is Yusuf.' Qani, mikrofoningiz ochiq, bemalol ayting: 'Hello! My name is Yusuf!'",
    tip: "Har doim 'My name is...' yoki 'I am...' deb aytiladi. Hech qachon 'Me is...' demang!"
  },
  {
    id: 'lesson-2',
    number: 2,
    titleUz: "2-Dars: Qayerdansiz?",
    titleEn: "Where are you from?",
    targetPhrase: "I am from Uzbekistan.",
    translation: "Men O'zbekistondanman.",
    initialPrompt: "Ajoyib! Endi 2-dars: Qayerdan ekanligingizni aytish. 'Men O'zbekistondanman' deyish uchun: 'I am from Uzbekistan'. Qani, men bilan qaytaring: 'I am from Uzbekistan'!",
    tip: "'From' so'zi '-dan' qo'shimchasi ma'nosini bildiradi."
  },
  {
    id: 'lesson-3',
    number: 3,
    titleUz: "3-Dars: Hol-ahvol so'rash",
    titleEn: "How are you?",
    targetPhrase: "How are you? I am fine, thank you.",
    translation: "Qalaysiz? Men yaxshiman, rahmat.",
    initialPrompt: "Juda yaxshi! 3-dars: Hol-ahvol so'rash. 'Qalaysiz?' inglizchada 'How are you?', javob esa 'I am fine, thank you'. Qani, ayting-chi: 'How are you? I am fine, thank you'!",
    tip: "Hurmat bilan javob berish uchun har doim 'thank you' qo'shiladi."
  },
  {
    id: 'lesson-4',
    number: 4,
    titleUz: "4-Dars: Til o'rganish maqsadi",
    titleEn: "Goal: Learning English",
    targetPhrase: "I want to learn English.",
    translation: "Men ingliz tilini o'rganmoqchiman.",
    initialPrompt: "Barakalla! 4-darsimiz: 'Men ingliz tilini o'rganmoqchiman' deb aytish. Bu inglizchada: 'I want to learn English'. Qani, to'g'ri ayting: 'I want to learn English'!",
    tip: "'Want to' biror narsa qilishni xohlash ma'nosida ishlatiladi."
  },
  {
    id: 'lesson-5',
    number: 5,
    titleUz: "5-Dars: Kundalik odatlar",
    titleEn: "Daily Routine",
    targetPhrase: "I wake up early every day.",
    translation: "Men har kuni erta uyg'onaman.",
    initialPrompt: "A'lo natija! 5-dars: Kundalik odatlar. 'Men har kuni erta uyg'onaman' deb aytamiz: 'I wake up early every day'. Qani, qaytaring: 'I wake up early every day'!",
    tip: "Har kuni qilinadigan ishlar uchun Present Simple (Oddiy hozirgi zamon) ishlatiladi."
  },
  {
    id: 'lesson-6',
    number: 6,
    titleUz: "6-Dars: O'tgan zamon (Past Simple)",
    titleEn: "Past Simple",
    targetPhrase: "Yesterday I studied English.",
    translation: "Kecha men ingliz tilini o'rgandim.",
    initialPrompt: "Diqqat qiling! 6-dars: O'tgan zamon. 'Kecha men ingliz tilini o'rgandim': 'Yesterday I studied English'. 'Yesterday I study' deb xato qilsangiz qattiq g'azablanaman! Qani, to'g'ri ayting: 'Yesterday I studied English'!",
    tip: "O'tgan zamonda fe'lning 2-shakli (studied, went, bought) ishlatiladi."
  },
  {
    id: 'lesson-7',
    number: 7,
    titleUz: "7-Dars: Erkin muloqot",
    titleEn: "Free Conversation",
    targetPhrase: "I agree with you because it is important.",
    translation: "Men sizga qo'shilaman, chunki bu muhim.",
    initialPrompt: "Barakalla! Endi erkin muloqot qilamiz! Xato qilsangiz darhol to'xtatib g'azablanaman va to'g'irlayman! Qani ayting: 'I agree with you because it is important'!",
    tip: "Hech qachon 'I am agree' demang! Har doim 'I agree' deb ayting!"
  }
];

const DEFAULT_PROFILE: UserProfile = {
  name: 'Yusuf',
  interest: '💻 Dasturchi (IT & Coding)',
  persona: 'developer',
  email: 'yusuf18081998@gmail.com',
  phone: '+998 90 123 45 67',
  level: '0 dan (Beginner)',
  emailReminder: true,
  phoneCallReminder: true,
  autoMicAlwaysOpen: true,
  isOnboarded: false,
};

const STUDIO_VOICES = [
  { id: 'Kore', name: 'Kore', displayName: '🌸 Kore (Eng Tabiiy & Yoqimli Ustoz ⭐ Tavsiya)' },
  { id: 'Puck', name: 'Puck', displayName: '⚡ Puck (Quvnoq & Jonli Erkak Ovoz)' },
  { id: 'Aoede', name: 'Aoede', displayName: '🎵 Aoede (Yumshoq & Romantik Ayol Ovoz)' },
  { id: 'Zephyr', name: 'Zephyr', displayName: '🍃 Zephyr (Tiniq & Zamonaviy Ovoz)' },
  { id: 'Charon', name: 'Charon', displayName: '🕶️ Charon (Juda Past & Qat\'iy Ovoz)' },
  { id: 'Fenrir', name: 'Fenrir', displayName: '🦁 Fenrir (Vazmin & Jiddiy Bass Ovoz)' },
];

interface GoPrepVoiceChatViewProps {
  uzbekMode: boolean;
  onToggleUzbek: () => void;
}

export const GoPrepVoiceChatView: React.FC<GoPrepVoiceChatViewProps> = ({
  uzbekMode,
  onToggleUzbek,
}) => {
  // User Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yusufgo_user_profile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...DEFAULT_PROFILE,
            ...parsed,
          };
        } catch (e) {
          // ignore
        }
      }
    }
    return DEFAULT_PROFILE;
  });

  // Always Open Mic Setting (Continuous listening)
  const [micAlwaysOpen, setMicAlwaysOpen] = useState<boolean>(profile.autoMicAlwaysOpen ?? true);
  const micAlwaysOpenRef = useRef<boolean>(profile.autoMicAlwaysOpen ?? true);

  // Microphone Recognition Language ('en-US' or 'uz-UZ')
  const [micLang, setMicLang] = useState<'en-US' | 'uz-UZ'>('en-US');

  // Modals
  const [showOnboarding, setShowOnboarding] = useState<boolean>(!profile.isOnboarded);
  const [showEmailReminder, setShowEmailReminder] = useState<boolean>(false);
  const [showIncomingCall, setShowIncomingCall] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);

  // Lesson state
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);
  const currentLesson = ZERO_LESSONS[currentLessonIndex];

  // Conversation state
  const [mood, setMood] = useState<PreppyMood>('neutral');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [voiceMuted, setVoiceMuted] = useState<boolean>(false);
  
  // Voices (Default to Kore - warm natural human tutor voice)
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('Kore');
  const [browserVoices, setBrowserVoices] = useState<VoiceOption[]>([]);

  // Call timer (06:17 / 10:00 style)
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isCallRunning, setIsCallRunning] = useState<boolean>(true);

  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [latestAiText, setLatestAiText] = useState<string>(currentLesson.initialPrompt);

  const recorderRef = useRef<VoiceRecorder | null>(null);

  // Keep ref synced
  useEffect(() => {
    micAlwaysOpenRef.current = micAlwaysOpen;
  }, [micAlwaysOpen]);

  // Load browser natural voices
  useEffect(() => {
    const updateVoices = () => {
      const voices = getAvailableNaturalVoices();
      setBrowserVoices(voices);
    };
    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Timer counter
  useEffect(() => {
    let interval: any = null;
    if (isCallRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallRunning]);

  // Initialize VoiceRecorder and welcome voice
  useEffect(() => {
    recorderRef.current = new VoiceRecorder();
    recorderRef.current.setLanguage(micLang);

    // Trigger initial studio voice
    const timer = setTimeout(() => {
      triggerAiVoice(currentLesson.initialPrompt, 'neutral');
    }, 600);

    return () => {
      clearTimeout(timer);
      stopSpeaking();
      if (recorderRef.current) recorderRef.current.stop();
    };
  }, []);

  // Update language in recorder when changed
  const handleToggleMicLang = () => {
    const nextLang = micLang === 'en-US' ? 'uz-UZ' : 'en-US';
    setMicLang(nextLang);
    if (recorderRef.current) {
      recorderRef.current.setLanguage(nextLang);
    }
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const triggerAiVoice = (text: string, newMood: PreppyMood) => {
    unlockAudioAutoplay();
    setLatestAiText(text);
    setMood(newMood);

    if (voiceMuted) {
      if (micAlwaysOpenRef.current && recorderRef.current) {
        recorderRef.current.resumeAfterAi();
        setIsListening(true);
      }
      return;
    }

    // Pause recording during AI speech so mic doesn't pick up speaker output
    if (recorderRef.current) {
      recorderRef.current.pauseForAi();
    }

    setIsListening(false);
    setIsSpeaking(true);
    speakWithStudioVoice(
      text,
      selectedVoiceName,
      () => {
        setIsListening(false);
        setIsSpeaking(true);
      },
      () => {
        setIsSpeaking(false);
        // If always-open mic is enabled, AUTOMATICALLY resume listening!
        if (micAlwaysOpenRef.current && recorderRef.current && isCallRunning) {
          recorderRef.current.resumeAfterAi();
          setIsListening(true);
        }
      }
    );
  };

  const handleTestVoice = (voiceName: string) => {
    unlockAudioAutoplay();
    setSelectedVoiceName(voiceName);
    stopSpeaking();
    setIsSpeaking(true);
    speakWithStudioVoice(
      `Hello ${profile.name}! This is your clear, studio quality English coach voice. No limits, and zero robot sound!`,
      voiceName,
      () => setIsSpeaking(true),
      () => {
        setIsSpeaking(false);
        if (micAlwaysOpenRef.current && recorderRef.current && isCallRunning) {
          recorderRef.current.resumeAfterAi();
          setIsListening(true);
        }
      }
    );
  };

  const handleSelectLesson = (idx: number) => {
    unlockAudioAutoplay();
    setCurrentLessonIndex(idx);
    const lesson = ZERO_LESSONS[idx];
    setConversation([]);
    triggerAiVoice(lesson.initialPrompt, 'neutral');
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    unlockAudioAutoplay();
    setProfile(newProfile);
    setMicAlwaysOpen(newProfile.autoMicAlwaysOpen);
    micAlwaysOpenRef.current = newProfile.autoMicAlwaysOpen;

    if (typeof window !== 'undefined') {
      localStorage.setItem('yusufgo_user_profile', JSON.stringify(newProfile));
    }
    setShowOnboarding(false);

    // Personalized persona welcome & matching voice
    let personaWelcome = '';
    if (newProfile.persona === 'romantic') {
      setSelectedVoiceName('Aoede');
      personaWelcome = `Assalomu alaykum jonim ${newProfile.name}! Preppy sizning ma'lumotlaringizni saqladi. Endi men siz bilan romantik va shirin uslubda ingliz tilini 0 dan o'rganamiz! Mikrofoningiz doim ochiq, 'Hello my love' yoki 'Hello Preppy' deb ayting-chi!`;
    } else if (newProfile.persona === 'developer') {
      setSelectedVoiceName('Puck');
      personaWelcome = `Assalomu alaykum senior dev ${newProfile.name}! Git repository initialized! Qiziqishingiz: ${newProfile.interest}. Mikrofoningiz har doim ochiq, 'Hello Preppy' deb aytib darsni boshlang!`;
    } else if (newProfile.persona === 'spicy_18') {
      setSelectedVoiceName('Kore');
      personaWelcome = `Oho ${newProfile.name}, xush kelibsiz! Komplekslarni chetga surib, 18+ qaynoq inglizcha gaplashamiz. Mikrofoningiz doim ochiq, bemalol 'Hello' deb boshlang!`;
    } else {
      setSelectedVoiceName('Kore');
      personaWelcome = `Assalomu alaykum ${newProfile.name}! Preppy ma'lumotlaringizni saqladi. 0 dan boshlaymiz! Mikrofoningiz doim ochiq. 'Hello! My name is ${newProfile.name}' deb ayting!`;
    }

    triggerAiVoice(personaWelcome, newProfile.persona === 'romantic' ? 'heart' : 'neutral');
  };

  const handleSwitchPersona = (newPersona: PreppyPersona) => {
    unlockAudioAutoplay();
    const updated = { ...profile, persona: newPersona };
    setProfile(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('yusufgo_user_profile', JSON.stringify(updated));
    }

    let phrase = '';
    if (newPersona === 'romantic') {
      setSelectedVoiceName('Aoede');
      phrase = `Romantik rejimga o'tdik, azizim ${profile.name}! Qani, yoqimli ovozingiz bilan inglizcha biror so'z ayting...`;
    } else if (newPersona === 'developer') {
      setSelectedVoiceName('Puck');
      phrase = `Developer rejimiga o'tdik ${profile.name}! Syntax error larni to'g'irlaymiz, clean code kabi toza gapiring!`;
    } else if (newPersona === 'spicy_18') {
      setSelectedVoiceName('Kore');
      phrase = `18+ Qaynoq rejim faollashdi, ${profile.name}! Hech qanday uyalishsiz olovdek gapiramiz!`;
    } else if (newPersona === 'strict') {
      setSelectedVoiceName('Charon');
      phrase = `Diqqat ${profile.name}! Qattiqqo'l rejim faollashdi! Xato qilsangiz qattiq so'rayman!`;
    } else {
      setSelectedVoiceName('Kore');
      phrase = `Do'stona rejim faollashdi ${profile.name}! Bemalol do'stona muloqot qilamiz!`;
    }

    triggerAiVoice(phrase, newPersona === 'romantic' ? 'heart' : 'neutral');
  };

  /**
   * Main Mic Toggle: When user presses mic button, it stays open!
   */
  const toggleMicrophone = () => {
    unlockAudioAutoplay();

    if (!recorderRef.current || !recorderRef.current.isSupported()) {
      setShowKeyboard(true);
      alert("Brauzeringizda mikrofon aniqlanmadi. Pastdagi matn maydoniga yozishingiz mumkin!");
      return;
    }

    if (isListening) {
      // User manually pauses mic
      recorderRef.current.stop();
      setIsListening(false);
      setUserTranscript('');
    } else {
      // User activates mic: KEEP OPEN CONTINUOUSLY
      stopSpeaking();
      setIsSpeaking(false);
      setIsListening(true);
      setUserTranscript('');

      if (micAlwaysOpen) {
        recorderRef.current.startContinuous(
          (result) => {
            const transcript = result.final + (result.interim ? ' ' + result.interim : '');
            setUserTranscript(transcript.trim());
          },
          (detectedSpeech) => {
            if (detectedSpeech.trim()) {
              handleSend(detectedSpeech.trim());
            }
          },
          (err) => {
            console.warn('Speech recognition error:', err);
          }
        );
      } else {
        recorderRef.current.start(
          (result) => {
            const transcript = result.final + (result.interim ? ' ' + result.interim : '');
            setUserTranscript(transcript.trim());
          },
          (err) => {
            console.warn('Speech error:', err);
            setIsListening(false);
          }
        );
      }
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    unlockAudioAutoplay();
    setIsListening(false);
    setIsProcessing(true);
    setUserTranscript('');

    // Pause mic while AI computes and speaks
    if (recorderRef.current) {
      recorderRef.current.pauseForAi();
    }

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
          userSpeech: text,
          conversationHistory: historyPayload,
          topic: currentLesson.titleUz,
          strictness: 'strict',
          userName: profile.name,
          userLevel: profile.level,
          currentLesson: currentLesson.titleUz,
          persona: profile.persona,
          interest: profile.interest,
        }),
      });

      if (!res.ok) throw new Error('API unavailable');
      const data = await res.json();

      let calculatedMood: PreppyMood = 'neutral';
      if (data.examinerMood === 'furious' || data.examinerMood === 'stern') {
        calculatedMood = 'furious';
      } else if (data.examinerMood === 'impressed' || data.examinerMood === 'proud' || data.examinerMood === 'heart') {
        calculatedMood = profile.persona === 'romantic' ? 'heart' : 'impressed';
      }

      const turn: ConversationTurn = {
        id: Date.now().toString(),
        userSpeech: text,
        examinerReply: data.replyText,
        examinerMood: calculatedMood,
        mistakes: data.mistakesFound || [],
        bandEstimate: data.instantBandEstimate || 6.5,
        advancedVocab: data.advancedVocabToUse || [],
        uzbekTip: data.uzbekTip || '',
        timestamp: Date.now(),
      };

      setConversation((prev) => [...prev, turn]);
      triggerAiVoice(data.replyText, calculatedMood);
    } catch (err: any) {
      console.warn('Handling locally with persona teacher brain:', err);
      const lower = text.toLowerCase();
      let fallbackText = `Barakalla ${profile.name}! Harakat ajoyib! Qani takrorlang: 'How are you?'`;
      let fallbackMood: PreppyMood = profile.persona === 'romantic' ? 'heart' : 'neutral';
      let mistakes: any[] = [];
      let uzbekTip = "";

      if (lower.includes('i am agree') || lower.includes("i'm agree")) {
        fallbackMood = 'furious';
        mistakes.push({
          mistake: "I am agree",
          correction: "I agree",
          explanation: "Agree bu fe'l, unga 'am' qo'shilmaydi!",
          severity: "critical"
        });
        if (profile.persona === 'romantic') {
          fallbackText = `Voy azizim ${profile.name}! 'I am agree' emas, 'I agree' deyiladi! Keling erkalab to'g'rilaymiz: 'I agree' deng, jonim!`;
        } else if (profile.persona === 'developer') {
          fallbackText = `To'xtang senior dev ${profile.name}! Syntax Error: 'I am agree' illegal expression! 'I agree' deb hotfix qiling!`;
        } else {
          fallbackText = `To'xtang ${profile.name}! No no no! Nega yana 'I am agree' deyapsiz?! In English it is simply 'I agree'! Qaytadan to'g'ri ayting!`;
        }
        uzbekTip = "'I am agree' mutlaqo xato! Har doim 'I agree' deb ayting!";
      } else if (lower.includes('me is') || lower.includes('my name are')) {
        fallbackMood = 'furious';
        mistakes.push({
          mistake: text,
          correction: `My name is ${profile.name}`,
          explanation: "'Me is' xato, 'My name is' deyiladi.",
          severity: "critical"
        });
        fallbackText = `To'xtang ${profile.name}! 'Me is' deb bo'lmaydi! 'My name is ${profile.name}' deyiladi! Qani, qaytaring: 'My name is ${profile.name}'!`;
        uzbekTip = "'My name is " + profile.name + "' deb aytiladi.";
      } else if (lower.includes('my name is')) {
        fallbackMood = 'heart';
        fallbackText = `Barakalla ${profile.name}! Juda to'g'ri aytdingiz! Endi 'Men O'zbekistondanman' deb aytamiz: 'I am from Uzbekistan'. Qani, men bilan qaytaring!`;
        uzbekTip = "Navbatdagi mashq: 'I am from Uzbekistan'";
      }

      const turn: ConversationTurn = {
        id: Date.now().toString(),
        userSpeech: text,
        examinerReply: fallbackText,
        examinerMood: fallbackMood,
        mistakes,
        bandEstimate: mistakes.length > 0 ? 5.5 : 7.0,
        advancedVocab: ['Hello', 'My name is', 'I agree'],
        uzbekTip,
        timestamp: Date.now(),
      };

      setConversation((prev) => [...prev, turn]);
      triggerAiVoice(fallbackText, fallbackMood);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStopCall = () => {
    setIsCallRunning(false);
    stopSpeaking();
    setIsSpeaking(false);
    if (recorderRef.current) recorderRef.current.stop();
    setIsListening(false);
  };

  const handleRestartCall = () => {
    unlockAudioAutoplay();
    setElapsedSeconds(0);
    setIsCallRunning(true);
    setConversation([]);
    triggerAiVoice(currentLesson.initialPrompt, 'neutral');
  };

  const latestTurn = conversation.length > 0 ? conversation[conversation.length - 1] : null;

  return (
    <div 
      onClick={() => unlockAudioAutoplay()}
      className="relative min-h-[calc(100vh-80px)] w-full flex flex-col justify-between p-3 sm:p-5 select-none overflow-hidden max-w-4xl mx-auto"
    >
      {/* Top Header Bar */}
      <div className="relative z-20 space-y-2">
        <div className="flex items-center justify-between gap-2 border-b border-rose-900/40 pb-2.5">
          {/* Left: Call Status & 10-Minute Timer */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              {isCallRunning && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isCallRunning ? 'bg-rose-500' : 'bg-slate-500'}`} />
            </span>
            <span className="text-xs font-mono font-bold text-rose-300">
              {formatTimer(elapsedSeconds)} / 10:00
            </span>
            <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
              GoPrep Preppy Tutor (0 dan O'rganish)
            </span>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* "Bugun dars qilmading!" Test Email Reminder Button */}
            <button
              onClick={() => {
                unlockAudioAutoplay();
                setShowEmailReminder(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all shadow-sm"
              title="Email eslatmasi (Bugun dars qilmading!)"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Email Xat Jo'natish</span>
            </button>

            {/* Simulated Phone Call from Preppy Button */}
            <button
              onClick={() => {
                unlockAudioAutoplay();
                setShowIncomingCall(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 animate-pulse"
              title="Preppy qo'ng'irog'i (Simulyatsiya)"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Tel Qilish</span>
            </button>

            {/* Profile & Persona Settings */}
            <button
              onClick={() => {
                unlockAudioAutoplay();
                setShowOnboarding(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-rose-900/60 text-slate-200 text-xs font-bold transition-all"
              title="Ism, qiziqish va Preppy uslubini sozlash"
            >
              <User className="w-3.5 h-3.5 text-rose-400" />
              <span className="max-w-[70px] truncate">{profile.name}</span>
            </button>

            {/* History Toggle */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition-colors"
              title="Xatolar tarixini ko'rish"
            >
              <History className="w-4 h-4" />
            </button>

            {/* Stop / Retake Button */}
            {isCallRunning ? (
              <button
                onClick={handleStopCall}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/50 text-xs font-bold transition-all"
              >
                <Square className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                <span>Стоп</span>
              </button>
            ) : (
              <button
                onClick={handleRestartCall}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Qaytadan</span>
              </button>
            )}
          </div>
        </div>

        {/* Persona Quick Switcher Pills */}
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-rose-400" />
              Preppy Uslubi:
            </span>
            {PERSONA_OPTIONS.map((item) => {
              const isSelected = profile.persona === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSwitchPersona(item.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 scale-105 border border-rose-400'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 opacity-80'
                  }`}
                  title={`${item.title} (${item.badge}): ${item.desc}`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Hands-free Always-open mic toggle button */}
          <button
            onClick={() => {
              const next = !micAlwaysOpen;
              setMicAlwaysOpen(next);
              micAlwaysOpenRef.current = next;
            }}
            className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
              micAlwaysOpen 
                ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 shadow'
                : 'bg-slate-900/80 border-slate-800 text-slate-400'
            }`}
            title="Mikrofon tugmasini qayta-qayta bosmasdan uzluksiz gaplashish rejimi"
          >
            <Radio className={`w-3.5 h-3.5 ${micAlwaysOpen ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Doimiy Mic:</span>
            <span className={micAlwaysOpen ? 'text-emerald-400 font-black' : 'text-slate-500'}>
              {micAlwaysOpen ? 'OCHIQ' : 'YOPIQ'}
            </span>
          </button>
        </div>

        {/* Row 3: 0-dan Darslar Selector & Voice Studio Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs">
          {/* Lesson selector */}
          <div className="flex items-center gap-2 bg-slate-950/90 border border-rose-900/60 rounded-2xl px-3 py-1.5 shadow">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 font-bold hidden sm:inline">0 dan Dars:</span>
            <select
              value={currentLessonIndex}
              onChange={(e) => handleSelectLesson(Number(e.target.value))}
              className="bg-transparent text-rose-200 font-bold focus:outline-none cursor-pointer text-xs"
            >
              {ZERO_LESSONS.map((l, idx) => (
                <option key={l.id} value={idx} className="bg-slate-900 text-white">
                  {l.titleUz} ({l.titleEn})
                </option>
              ))}
            </select>
          </div>

          {/* Voice Engine Studio Dropdown */}
          <div className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-800/60 rounded-2xl px-3 py-1.5 shadow">
            <select
              value={selectedVoiceName}
              onChange={(e) => handleTestVoice(e.target.value)}
              className="bg-transparent text-xs font-bold text-rose-200 focus:outline-none cursor-pointer max-w-[170px] sm:max-w-[230px] truncate"
              title="Yuqori sifatli AI ovozini tanlang"
            >
              <optgroup label="Studio AI Ovozlar (Tabiiy, chiroyli)">
                {STUDIO_VOICES.map((v) => (
                  <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                    {v.displayName}
                  </option>
                ))}
              </optgroup>
              {browserVoices.length > 0 && (
                <optgroup label="Brauzer Tabiiy Ovozlar">
                  {browserVoices.map((v) => (
                    <option key={v.id} value={v.name} className="bg-slate-900 text-white">
                      {v.displayName}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
            <button
              onClick={() => handleTestVoice(selectedVoiceName)}
              className="text-[10px] bg-rose-600/70 hover:bg-rose-600 text-white font-black px-2 py-0.5 rounded-lg transition-colors shadow"
              title="Ovozni sinab ko'rish"
            >
              Sinash
            </button>
            <button
              onClick={() => {
                if (!voiceMuted) stopSpeaking();
                setVoiceMuted(!voiceMuted);
              }}
              className="p-1 rounded text-rose-300 hover:text-white"
              title={voiceMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}
            >
              {voiceMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Central Stage: Animated Preppy Avatar & Speech Prompts */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2">
        {/* Preppy Avatar */}
        <PreppyAvatar
          mood={mood}
          isSpeaking={isSpeaking}
          isListening={isListening}
          persona={profile.persona}
        />

        {/* Persona Badge Label under Avatar */}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-slate-900/90 border border-rose-900/60 font-semibold text-rose-300 flex items-center gap-1.5 shadow">
            <span>{PERSONA_OPTIONS.find((p) => p.id === profile.persona)?.emoji || '👨‍🏫'}</span>
            <span>Preppy ({PERSONA_OPTIONS.find((p) => p.id === profile.persona)?.title || 'Teacher'} - {profile.name} uchun)</span>
          </span>
          {isListening && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 font-bold text-emerald-400 flex items-center gap-1 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Mikrofon Ochiq ({micLang === 'uz-UZ' ? 'O\'zbekcha' : 'English'})</span>
            </span>
          )}
        </div>

        {/* Latest Spoken AI Statement Card */}
        <div className="mt-4 max-w-xl w-full bg-slate-950/85 border border-rose-900/60 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-2 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-rose-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Preppy Aytmoqda:</span>
              {isSpeaking && (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-500/40 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Jonli Ovoz Chiqmoqda
                </span>
              )}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  unlockAudioAutoplay();
                  triggerAiVoice(latestAiText, mood);
                }}
                className="text-[11px] text-rose-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-900/40 hover:bg-rose-900/80 transition-colors shadow-sm"
                title="Preppy ovozini qayta eshitish yoki ovozni yoqish"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Ovozni Qayta Eshitish</span>
              </button>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
            {latestAiText}
          </p>
        </div>

        {/* Target Phrase Box for Zero-Dan Learners */}
        <div className="mt-2.5 max-w-xl w-full bg-slate-900/70 border border-rose-900/40 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-2 shadow">
          <div className="text-xs">
            <span className="text-amber-400 font-bold block text-[10px] uppercase tracking-wider">
              🎯 Hozirgi Vazifa (Qaytaring):
            </span>
            <span className="font-mono font-bold text-white text-sm">"{currentLesson.targetPhrase}"</span>
            <span className="text-slate-400 ml-2 text-xs font-sans">({currentLesson.translation})</span>
          </div>
          <button
            onClick={() => triggerAiVoice(currentLesson.targetPhrase, 'neutral')}
            className="text-[10px] bg-rose-600/50 hover:bg-rose-600 text-white font-bold px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1"
          >
            <Volume2 className="w-3 h-3" />
            <span>Talaffuz</span>
          </button>
        </div>

        {/* Real-time Error Warning Card when Yusuf makes mistakes */}
        {latestTurn?.mistakes && latestTurn.mistakes.length > 0 && mood === 'furious' && (
          <div className="mt-3 max-w-xl w-full bg-rose-950/80 border-2 border-rose-500/70 rounded-2xl p-3.5 shadow-2xl space-y-1.5 animate-in fade-in duration-300">
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-extrabold uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-rose-500 text-rose-500 animate-bounce" />
              <span>Preppy G'azablandi (Grammatik Xato):</span>
            </div>

            {latestTurn.mistakes.map((m, idx) => (
              <div key={idx} className="text-xs">
                <span className="line-through text-rose-400 font-mono font-bold">"{m.mistake}"</span>
                <span className="mx-1.5 text-slate-400">→</span>
                <span className="text-emerald-400 font-bold font-mono">"{m.correction}"</span>
                <p className="text-[11px] text-slate-300 italic mt-0.5">{m.explanation}</p>
              </div>
            ))}

            {latestTurn.uzbekTip && (
              <div className="pt-1 border-t border-rose-900/50 text-[11px] text-amber-300 font-semibold">
                💡 <strong>Preppy maslahati:</strong> {latestTurn.uzbekTip}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls Bar: Central Mic Button */}
      <div className="relative z-20 flex flex-col items-center gap-2.5 pt-2">
        {/* Real-time speech transcript bubble with quick SEND button */}
        {userTranscript ? (
          <div className="flex items-center justify-between gap-2 max-w-md w-full bg-slate-950/95 border-2 border-emerald-500/70 px-3.5 py-2.5 rounded-2xl shadow-xl animate-in fade-in">
            <div className="flex-1 text-xs text-emerald-200 font-mono truncate">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Siz gapirdingiz:</span>
              "{userTranscript}"
            </div>
            <button
              onClick={() => handleSend(userTranscript)}
              disabled={isProcessing}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md hover:scale-105 active:scale-95 transition-all"
              title="Preppy'ga darhol jo'natish"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Yuborish</span>
            </button>
          </div>
        ) : isListening ? (
          <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold bg-emerald-950/50 border border-emerald-500/40 px-3.5 py-1.5 rounded-full animate-pulse shadow">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Mikrofon eshitmoqda... {micLang === 'uz-UZ' ? "O'zbekcha" : "Inglizcha"} gapiring!</span>
          </div>
        ) : null}

        {/* Text input drawer if user wants to type */}
        {showKeyboard && (
          <div className="flex items-center gap-2 max-w-md w-full bg-slate-950/90 border border-rose-900/60 p-2 rounded-2xl shadow-xl">
            <input
              type="text"
              value={userTranscript}
              onChange={(e) => setUserTranscript(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && userTranscript.trim()) {
                  handleSend(userTranscript.trim());
                }
              }}
              placeholder="Inglizcha yoki o'zbekcha yozing..."
              className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={() => {
                if (userTranscript.trim()) handleSend(userTranscript.trim());
              }}
              disabled={!userTranscript.trim() || isProcessing}
              className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-5 sm:gap-7 w-full max-w-sm">
          {/* Keyboard toggle */}
          <button
            onClick={() => setShowKeyboard(!showKeyboard)}
            className={`p-3.5 rounded-2xl border transition-all ${
              showKeyboard
                ? 'bg-rose-600 text-white border-rose-500 shadow-lg'
                : 'bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border-rose-800/40'
            }`}
            title="Klaviatura orqali yozish"
          >
            <Keyboard className="w-5 h-5" />
          </button>

          {/* MAIN BIG MIC BUTTON */}
          <button
            onClick={toggleMicrophone}
            disabled={!isCallRunning}
            className={`relative p-6 sm:p-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
              isListening
                ? 'bg-emerald-500 hover:bg-emerald-400 text-white scale-110 shadow-emerald-500/60 ring-4 ring-emerald-400/40 animate-pulse'
                : 'bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 hover:scale-105 text-white shadow-rose-600/40'
            }`}
            title={isListening ? "Mikrofon ochiq (To'xtatish uchun bosing)" : "Mikrofonni yoqish (Doim ochiq turadi)"}
          >
            {isListening ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}

            {isListening && (
              <>
                <span className="absolute -inset-2 rounded-full border-4 border-emerald-400/50 animate-ping pointer-events-none" />
                <span className="absolute -inset-4 rounded-full border-2 border-emerald-400/20 animate-pulse pointer-events-none" />
              </>
            )}
          </button>

          {/* Microphone Language Toggle (O'zbekcha / English) */}
          <button
            onClick={handleToggleMicLang}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl border transition-all ${
              micLang === 'uz-UZ'
                ? 'bg-amber-600/30 border-amber-500/50 text-amber-300 shadow'
                : 'bg-blue-600/30 border-blue-500/50 text-blue-300 shadow'
            }`}
            title="Mikrofon tili (O'zbekcha gapirsangiz UZB qiling, inglizcha gapirsangiz ENG)"
          >
            <Languages className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              {micLang === 'uz-UZ' ? '🇺🇿 UZB' : '🇬🇧 ENG'}
            </span>
          </button>
        </div>

        {/* Status prompt */}
        <p className="text-[11px] text-center font-medium">
          {isProcessing ? (
            <span className="text-amber-400 font-bold flex items-center justify-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Preppy o'ylamoqda va javob tayyorlamoqda...
            </span>
          ) : isSpeaking ? (
            <span className="text-rose-300 font-bold flex items-center justify-center gap-1.5 animate-pulse">
              <Volume2 className="w-3.5 h-3.5 text-rose-400" />
              Preppy gapirmoqda... Tinglang!
            </span>
          ) : isListening ? (
            <span className="text-emerald-400 font-bold flex items-center justify-center gap-1.5 animate-pulse">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              Mikrofon doim ochiq! Bemalol gapiring, to'xtashingiz bilan Preppy javob beradi.
            </span>
          ) : (
            <span className="text-rose-300/70">
              Mikrofonni bir marta bosing — u doim ochiq turadi va ovozingizni eshitadi!
            </span>
          )}
        </p>
      </div>

      {/* History Slide-over Drawer */}
      {showHistory && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-950/95 border-l border-rose-900/60 backdrop-blur-xl p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-extrabold text-white text-base flex items-center gap-2">
                <History className="w-5 h-5 text-rose-400" />
                <span>Muloqot Tarixi & Xatolar</span>
              </h4>
              <button
                onClick={() => setShowHistory(false)}
                className="text-xs text-slate-400 hover:text-white p-1"
              >
                ✕ Yopish
              </button>
            </div>

            <div className="space-y-3">
              {conversation.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center italic">
                  Hozircha xabarlar yo'q. Mikrofonni bosib gapiring!
                </p>
              ) : (
                conversation.map((turn, idx) => (
                  <div key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-indigo-300 block mb-0.5">Siz ({profile.name}):</span>
                      <p className="text-slate-200 font-mono">"{turn.userSpeech}"</p>
                    </div>
                    <div>
                      <span className="font-bold text-rose-400 block mb-0.5">Preppy ({turn.examinerMood}):</span>
                      <p className="text-slate-300 italic">"{turn.examinerReply}"</p>
                    </div>

                    {turn.mistakes && turn.mistakes.length > 0 && (
                      <div className="bg-rose-950/40 p-2 rounded-lg border border-rose-500/30 space-y-1">
                        {turn.mistakes.map((m, mIdx) => (
                          <div key={mIdx}>
                            <span className="line-through text-rose-400 font-bold">"{m.mistake}"</span>
                            <span className="text-emerald-400 font-bold ml-1">→ "{m.correction}"</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setShowHistory(false)}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Muloqotga qaytish
          </button>
        </div>
      )}

      {/* Onboarding / Profile Setup Modal */}
      {showOnboarding && (
        <OnboardingModal
          initialProfile={profile}
          onComplete={handleSaveProfile}
          onClose={() => setShowOnboarding(false)}
        />
      )}

      {/* "Bugun dars qilmading!" Email Reminder Modal */}
      {showEmailReminder && (
        <EmailReminderModal
          userEmail={profile.email}
          userName={profile.name}
          onClose={() => setShowEmailReminder(false)}
        />
      )}

      {/* Preppy Incoming Phone Call Simulation Modal */}
      {showIncomingCall && (
        <IncomingCallModal
          userName={profile.name}
          userPhone={profile.phone}
          userPersona={profile.persona}
          onClose={() => setShowIncomingCall(false)}
          onStartLesson={() => {
            setShowIncomingCall(false);
            setCurrentLessonIndex(0);
            triggerAiVoice(ZERO_LESSONS[0].initialPrompt, 'neutral');
          }}
        />
      )}
    </div>
  );
};

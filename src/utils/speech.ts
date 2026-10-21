// High-Fidelity Natural Voice Engine and Speech Recognition

let cachedVoices: SpeechSynthesisVoice[] = [];
let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentAudioElement: HTMLAudioElement | null = null;
let synthesisKeepAliveInterval: any = null;

// Initialize and preload voices
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

/**
 * Unlocks browser audio autoplay by playing an inaudible 1ms sample
 * and resuming the Web Audio context + SpeechSynthesis on user gesture.
 */
export function unlockAudioAutoplay() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    }
  } catch (e) {
    // ignore
  }

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.resume();
    } catch (e) {
      // ignore
    }
  }
}

export function stopSpeaking() {
  if (synthesisKeepAliveInterval) {
    clearInterval(synthesisKeepAliveInterval);
    synthesisKeepAliveInterval = null;
  }

  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
    } catch (e) {
      // ignore
    }
    currentAudioElement = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
  }
}

export function playBase64Audio(
  base64: string, 
  onEnd?: () => void,
  onFallback?: () => void
): HTMLAudioElement {
  stopSpeaking();
  unlockAudioAutoplay();

  const audio = new Audio(`data:audio/wav;base64,${base64}`);
  currentAudioElement = audio;

  let hasEnded = false;
  // Safety timeout: guaranteed release so AI voice never blocks UI or speech
  const estimatedTimeout = Math.max(3000, Math.min(30000, (base64.length / 3500) * 1000 + 3000));
  const safetyTimeout = setTimeout(() => {
    console.warn('Audio playback watchdog safety timeout triggered');
    finish();
  }, estimatedTimeout);

  const finish = () => {
    if (hasEnded) return;
    hasEnded = true;
    clearTimeout(safetyTimeout);
    currentAudioElement = null;
    if (onEnd) onEnd();
  };

  audio.onended = finish;
  audio.onerror = (e) => {
    clearTimeout(safetyTimeout);
    console.warn('Audio playback error, triggering fallback:', e);
    currentAudioElement = null;
    if (onFallback) {
      onFallback();
    } else {
      finish();
    }
  };

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      clearTimeout(safetyTimeout);
      console.warn('Audio play() prevented by browser policy, triggering fallback:', err);
      currentAudioElement = null;
      if (onFallback) {
        onFallback();
      } else {
        finish();
      }
    });
  }

  return audio;
}

export interface VoiceOption {
  id: string;
  name: string;
  displayName: string;
  lang: string;
  gender: 'male' | 'female';
  isNatural: boolean;
}

// Get all high-quality natural voices available in browser
export function getAvailableNaturalVoices(): VoiceOption[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  
  let voices = cachedVoices;
  if (!voices || voices.length === 0) {
    voices = window.speechSynthesis.getVoices();
    cachedVoices = voices;
  }

  const englishVoices = voices.filter(v => v.lang.startsWith('en'));

  // Rank by naturalness
  const mapped: VoiceOption[] = englishVoices.map(v => {
    const isNatural = 
      v.name.includes('Natural') || 
      v.name.includes('Online (Natural)') || 
      v.name.includes('Google') || 
      v.name.includes('Neural') ||
      v.name.includes('Enhanced');

    const isFemale = 
      v.name.includes('Jenny') || 
      v.name.includes('Sonia') || 
      v.name.includes('Female') || 
      v.name.includes('Zira') ||
      v.name.includes('Samantha');

    let cleanName = v.name
      .replace(/Microsoft\s+/g, '')
      .replace(/Online\s+\(Natural\)/g, 'Natural')
      .replace(/English\s+\(United\s+Kingdom\)/g, 'UK')
      .replace(/English\s+\(United\s+States\)/g, 'US');

    return {
      id: v.name,
      name: v.name,
      displayName: cleanName + (isNatural ? ' ⭐ (Eng Tabiiy)' : ''),
      lang: v.lang,
      gender: isFemale ? 'female' : 'male',
      isNatural
    };
  });

  // Sort natural voices first
  mapped.sort((a, b) => {
    if (a.isNatural && !b.isNatural) return -1;
    if (!a.isNatural && b.isNatural) return 1;
    return a.name.localeCompare(b.name);
  });

  return mapped;
}

export function findBestNaturalVoice(preferredName?: string, text?: string): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  let voices = cachedVoices;
  if (!voices || voices.length === 0) {
    voices = window.speechSynthesis.getVoices();
    cachedVoices = voices;
  }

  if (preferredName) {
    const exact = voices.find(v => v.name === preferredName);
    if (exact) return exact;
  }

  // Check if text is predominantly Uzbek
  const isUzbekText = text ? /[ўғҳқ]/i.test(text) || /\b(salom|men|sen|bugun|dars|rahmat|qanday|yaxshi|ismim|o'rgan|qaytaring|barakalla|xush)\b/i.test(text) : false;
  if (isUzbekText) {
    // Turkish or Russian or Uzbek voices handle Uzbek phonetics far more naturally than English TTS
    const trUzVoice = voices.find(v => v.lang.startsWith('uz') || v.lang.startsWith('tr'));
    if (trUzVoice) return trUzVoice;
    const ruVoice = voices.find(v => v.lang.startsWith('ru'));
    if (ruVoice) return ruVoice;
  }

  // Priority 1: Microsoft Natural British/US (Ultra realistic human speech)
  const naturalBritish = voices.find(v => 
    v.lang.startsWith('en') && 
    (v.name.includes('Natural') || v.name.includes('Ryan') || v.name.includes('Sonia') || v.name.includes('Jenny') || v.name.includes('Guy'))
  );
  if (naturalBritish) return naturalBritish;

  // Priority 2: Google UK / US English (very smooth, non-robotic)
  const googleVoice = voices.find(v => 
    v.lang.startsWith('en') && 
    (v.name.includes('Google UK English Female') || v.name.includes('Google US English') || v.name.includes('Google UK English Male'))
  );
  if (googleVoice) return googleVoice;

  // Priority 3: Apple Enhanced / Samantha / Daniel / Oliver
  const appleVoice = voices.find(v => 
    v.lang.startsWith('en') && 
    (v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Oliver') || v.name.includes('Enhanced'))
  );
  if (appleVoice) return appleVoice;

  // Priority 4: Any English natural
  const anyNatural = voices.find(v => v.lang.startsWith('en') && v.name.includes('Natural'));
  if (anyNatural) return anyNatural;

  // Fallback: any English voice
  return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
}

// Clean text for speech
function sanitizeSpeechText(raw: string): string {
  return raw
    .replace(/[*#_`~]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function speakNaturalVoice(
  text: string, 
  preferredVoiceName?: string, 
  onStart?: () => void, 
  onEnd?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  stopSpeaking();
  unlockAudioAutoplay();

  const cleanText = sanitizeSpeechText(text);
  if (!cleanText) {
    if (onEnd) onEnd();
    return;
  }

  if (onStart) onStart();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 0.94;
  utterance.pitch = 1.0;

  const chosenVoice = findBestNaturalVoice(preferredVoiceName, cleanText);
  if (chosenVoice) {
    utterance.voice = chosenVoice;
  }

  let isDone = false;
  // Watchdog timer: guaranteed finish call if Chrome SpeechSynthesis pauses or hangs silently
  const wordsCount = cleanText.split(/\s+/).length;
  const estimatedDuration = Math.max(2500, Math.min(22000, wordsCount * 450 + 2000));
  const watchdogTimer = setTimeout(() => {
    if (!isDone) {
      console.warn('Speech synthesis watchdog timer triggered, releasing lock');
      finish();
    }
  }, estimatedDuration);

  const finish = () => {
    if (isDone) return;
    isDone = true;
    clearTimeout(watchdogTimer);
    if (synthesisKeepAliveInterval) {
      clearInterval(synthesisKeepAliveInterval);
      synthesisKeepAliveInterval = null;
    }
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onend = finish;
  utterance.onerror = (e) => {
    console.warn('Speech synthesis error:', e);
    finish();
  };

  currentUtterance = utterance;

  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);

    // Chrome bug fix: periodic resume while speaking so it never pauses silently
    if (synthesisKeepAliveInterval) clearInterval(synthesisKeepAliveInterval);
    synthesisKeepAliveInterval = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.resume();
        } else {
          clearInterval(synthesisKeepAliveInterval);
          synthesisKeepAliveInterval = null;
        }
      }
    }, 1000);
  } catch (err) {
    console.error('Speech synthesis speak failed:', err);
    finish();
  }
}

// In-memory audio cache to avoid re-fetching identical phrases
const audioCache = new Map<string, string>();

const STUDIO_VOICE_SET = new Set(['Kore', 'Puck', 'Zephyr', 'Aoede', 'Charon', 'Fenrir']);

// Master speak function: Plays Ultra High-Definition Studio Voice via server TTS,
// and falls back gracefully to warm natural browser speech synthesis.
export async function speakWithStudioVoice(
  text: string, 
  voice: string = 'Kore', 
  onStart?: () => void, 
  onEnd?: () => void
) {
  stopSpeaking();
  unlockAudioAutoplay();

  const clean = sanitizeSpeechText(text);
  if (!clean) {
    if (onEnd) onEnd();
    return;
  }

  if (onStart) onStart();

  const fallbackToNatural = () => {
    speakNaturalVoice(clean, voice, undefined, onEnd);
  };

  // If user selected a browser-specific voice name, play via browser speech synthesis directly
  if (voice && !STUDIO_VOICE_SET.has(voice)) {
    speakNaturalVoice(clean, voice, onStart, onEnd);
    return;
  }

  // 1. Check cache first
  const cacheKey = `${voice}:${clean.slice(0, 100)}`;
  if (audioCache.has(cacheKey)) {
    try {
      playBase64Audio(audioCache.get(cacheKey)!, onEnd, fallbackToNatural);
      return;
    } catch (e) {
      console.warn('Cached audio playback failed, falling back', e);
    }
  }

  // 2. Fetch studio-quality voice from backend
  try {
    const res = await fetch('/api/generate-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: clean.slice(0, 400),
        voice: voice || 'Kore',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.audioBase64) {
        audioCache.set(cacheKey, data.audioBase64);
        playBase64Audio(data.audioBase64, onEnd, fallbackToNatural);
        return;
      }
    }
  } catch (err) {
    console.warn('Studio voice fetch failed, using natural browser voice:', err);
  }

  // 3. Fallback to warm browser natural voice
  fallbackToNatural();
}

export function speakText(text: string, onEnd?: () => void) {
  speakWithStudioVoice(text, 'Kore', undefined, onEnd);
}

// Browser SpeechRecognition interface
export interface SpeechRecognitionResultObject {
  transcript: string;
  isFinal: boolean;
}

export class VoiceRecorder {
  private recognition: any = null;
  private isListening = false;
  private shouldKeepAlive = false;
  private isMutedForAi = false;
  private silenceTimer: any = null;
  private currentFinal = '';
  private currentInterim = '';
  private currentLang = 'en-US';
  private onResultCallback: ((result: { interim: string; final: string }) => void) | null = null;
  private onSilenceCallback: ((finalText: string) => void) | null = null;
  private onErrorCallback: ((err: any) => void) | null = null;

  constructor() {
    this.initRecognition('en-US');
  }

  private initRecognition(lang: string) {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = lang;
        this.currentLang = lang;

        this.recognition.onresult = (event: any) => {
          if (this.isMutedForAi) return;

          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              this.currentFinal += event.results[i][0].transcript + ' ';
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          this.currentInterim = interim;

          const combined = (this.currentFinal + (interim ? ' ' + interim : '')).trim();

          if (this.onResultCallback) {
            this.onResultCallback({
              interim,
              final: this.currentFinal.trim(),
            });
          }

          // Auto-silence submission (Continuous mode): 1.1s of silence
          if (this.onSilenceCallback && combined.length > 0) {
            if (this.silenceTimer) clearTimeout(this.silenceTimer);
            this.silenceTimer = setTimeout(() => {
              const textToSend = (this.currentFinal + (this.currentInterim ? ' ' + this.currentInterim : '')).trim();
              if (textToSend.length > 0 && this.onSilenceCallback) {
                this.currentFinal = '';
                this.currentInterim = '';
                this.onSilenceCallback(textToSend);
              }
            }, 1100);
          }
        };

        this.recognition.onerror = (event: any) => {
          if (event.error === 'no-speech' || event.error === 'aborted') {
            return;
          }
          console.warn('Speech recognition error:', event.error);
          if (this.onErrorCallback) {
            this.onErrorCallback(event.error);
          }
        };

        this.recognition.onend = () => {
          this.isListening = false;
          // Auto-restart if shouldKeepAlive is active
          if (this.shouldKeepAlive && !this.isMutedForAi) {
            setTimeout(() => {
              if (this.shouldKeepAlive && !this.isMutedForAi && !this.isListening) {
                try {
                  this.recognition.start();
                  this.isListening = true;
                } catch (e) {
                  // ignore
                }
              }
            }, 100);
          }
        };
      }
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public getShouldKeepAlive(): boolean {
    return this.shouldKeepAlive;
  }

  public setLanguage(lang: string) {
    this.currentLang = lang;
    if (this.recognition) {
      const wasListening = this.isListening;
      if (wasListening) {
        try {
          this.recognition.stop();
        } catch (e) {
          // ignore
        }
      }
      this.recognition.lang = lang;
      if (wasListening) {
        setTimeout(() => {
          try {
            this.recognition.start();
            this.isListening = true;
          } catch (e) {
            // ignore
          }
        }, 150);
      }
    }
  }

  public getLanguage(): string {
    return this.currentLang;
  }

  /**
   * Starts continuous, always-open microphone mode.
   */
  public startContinuous(
    onResult: (result: { interim: string; final: string }) => void,
    onSpeechDetected: (finalText: string) => void,
    onError: (err: any) => void
  ) {
    if (!this.recognition) return;

    this.shouldKeepAlive = true;
    this.isMutedForAi = false;
    this.currentFinal = '';
    this.currentInterim = '';
    this.onResultCallback = onResult;
    this.onSilenceCallback = onSpeechDetected;
    this.onErrorCallback = onError;

    if (!this.isListening) {
      try {
        this.recognition.start();
        this.isListening = true;
      } catch (e) {
        console.warn('Recognition start caught:', e);
      }
    }
  }

  public start(
    onResult: (result: { interim: string; final: string }) => void,
    onError: (err: any) => void
  ) {
    if (!this.recognition || this.isListening) return;

    this.shouldKeepAlive = false;
    this.isMutedForAi = false;
    this.currentFinal = '';
    this.currentInterim = '';
    this.onResultCallback = onResult;
    this.onSilenceCallback = null;
    this.onErrorCallback = onError;

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (e) {
      console.error('Could not start recognition', e);
    }
  }

  public pauseForAi() {
    this.isMutedForAi = true;
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    if (this.recognition && this.isListening) {
      try {
        this.recognition.abort();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  public resumeAfterAi() {
    this.isMutedForAi = false;
    this.currentFinal = '';
    this.currentInterim = '';
    if (!this.shouldKeepAlive || !this.recognition) return;

    // Give browser speech recognition engine 150ms to finish prior abort cycle
    setTimeout(() => {
      if (this.shouldKeepAlive && !this.isMutedForAi && !this.isListening) {
        try {
          this.recognition.start();
          this.isListening = true;
        } catch (e: any) {
          // If browser is still releasing audio track, retry after 250ms
          setTimeout(() => {
            if (this.shouldKeepAlive && !this.isMutedForAi && !this.isListening) {
              try {
                this.recognition.start();
                this.isListening = true;
              } catch (err) {
                // Engine already running or waiting
              }
            }
          }, 250);
        }
      }
    }, 150);
  }

  /**
   * Immediately retrieves current transcript and clears buffers (Instant Send)
   */
  public submitNow(): string {
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    const textToSend = (this.currentFinal + (this.currentInterim ? ' ' + this.currentInterim : '')).trim();
    this.currentFinal = '';
    this.currentInterim = '';
    return textToSend;
  }

  public stop(): string {
    this.shouldKeepAlive = false;
    this.isMutedForAi = false;
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
    const final = (this.currentFinal + (this.currentInterim ? ' ' + this.currentInterim : '')).trim();
    this.currentFinal = '';
    this.currentInterim = '';
    return final;
  }
}

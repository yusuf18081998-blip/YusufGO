import React from 'react';
import { PreppyPersona } from './OnboardingModal';

export type PreppyMood = 'neutral' | 'heart' | 'furious' | 'stern' | 'impressed' | 'proud';

interface PreppyAvatarProps {
  mood: PreppyMood;
  isSpeaking: boolean;
  isListening: boolean;
  persona?: PreppyPersona;
}

export const PreppyAvatar: React.FC<PreppyAvatarProps> = ({
  mood,
  isSpeaking,
  isListening,
  persona = 'romantic',
}) => {
  const isAngry = mood === 'furious' || mood === 'stern';
  const isHeart = mood === 'heart' || mood === 'impressed' || mood === 'proud';

  // Border & Glow styling according to mood & persona
  let borderColor = '#EF4444'; // Red default
  let shadowColor = 'rgba(239, 68, 68, 0.4)';

  if (isAngry) {
    borderColor = '#DC2626'; // Deep Red
    shadowColor = 'rgba(220, 38, 38, 0.6)';
  } else if (isHeart) {
    borderColor = '#EC4899'; // Pink / Gold
    shadowColor = 'rgba(236, 72, 153, 0.5)';
  } else {
    // Default by persona
    switch (persona) {
      case 'romantic':
        borderColor = '#F43F5E'; // Rose
        shadowColor = 'rgba(244, 63, 94, 0.45)';
        break;
      case 'developer':
        borderColor = '#06B6D4'; // Cyan
        shadowColor = 'rgba(6, 182, 212, 0.45)';
        break;
      case 'spicy_18':
        borderColor = '#F59E0B'; // Amber / Orange
        shadowColor = 'rgba(245, 158, 11, 0.5)';
        break;
      case 'strict':
        borderColor = '#EF4444'; // Red
        shadowColor = 'rgba(239, 68, 68, 0.5)';
        break;
      case 'friendly':
      default:
        borderColor = '#10B981'; // Emerald
        shadowColor = 'rgba(16, 185, 129, 0.45)';
        break;
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-6">
      {/* Animated Flames on top of head when Furious/Angry */}
      {isAngry && (
        <div className="absolute -top-12 sm:-top-16 z-20 pointer-events-none flex items-end justify-center w-48 sm:w-60 h-20 animate-pulse">
          <svg
            viewBox="0 0 200 90"
            className="w-full h-full drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 90 Q 25 30 40 50 Q 55 10 70 40 Q 90 0 100 35 Q 115 5 130 45 Q 145 15 160 55 Q 175 35 190 90 Z"
              fill="#DC2626"
            />
            <path
              d="M25 90 Q 38 45 50 60 Q 65 25 80 50 Q 100 15 110 45 Q 125 22 140 55 Q 155 35 175 90 Z"
              fill="#F97316"
            />
            <path
              d="M40 90 Q 50 60 62 70 Q 75 40 90 60 Q 102 30 115 55 Q 128 40 142 68 Q 150 55 160 90 Z"
              fill="#FDE047"
            />
          </svg>
        </div>
      )}

      {/* Main Pill Body */}
      <div
        style={{
          borderColor: borderColor,
          boxShadow: `0 12px 35px ${shadowColor}`,
        }}
        className={`relative z-10 w-52 sm:w-64 h-28 sm:h-34 rounded-[50px] sm:rounded-[60px] border-[10px] sm:border-[12px] bg-[#FFFBFB] flex items-center justify-center transition-all duration-300 ${
          isSpeaking ? 'scale-105' : 'scale-100'
        } ${isListening ? 'animate-bounce duration-1000' : ''}`}
      >
        {/* Blushing cheeks for romantic or 18+ mode */}
        {(persona === 'romantic' || persona === 'spicy_18' || isHeart) && !isAngry && (
          <>
            <div className="absolute left-6 sm:left-8 bottom-6 sm:bottom-7 w-5 h-2.5 rounded-full bg-rose-400/40 blur-[1px]" />
            <div className="absolute right-6 sm:right-8 bottom-6 sm:bottom-7 w-5 h-2.5 rounded-full bg-rose-400/40 blur-[1px]" />
          </>
        )}

        {/* Developer nerdy badge icon on top right corner */}
        {persona === 'developer' && !isAngry && (
          <div className="absolute -top-3 -right-2 px-2 py-0.5 rounded-full bg-cyan-600 text-[10px] font-mono text-white font-bold border border-cyan-400 shadow">
            &lt;/&gt;
          </div>
        )}

        {/* Face Elements */}
        {isHeart ? (
          /* Heart Eyes (Loving / Impressed Mode) */
          <div className="flex flex-col items-center justify-center gap-1.5">
            <div className="flex items-center gap-6 sm:gap-8">
              {/* Left Heart Eye */}
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 sm:w-9 sm:h-9 fill-black transition-transform duration-300 hover:scale-110"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {/* Right Heart Eye */}
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 sm:w-9 sm:h-9 fill-black transition-transform duration-300 hover:scale-110"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            {/* Cute Open Round Mouth */}
            <div
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black transition-all ${
                isSpeaking ? 'scale-125' : 'scale-100'
              }`}
            />
          </div>
        ) : isAngry ? (
          /* Angry / Furious Mode */
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-7 sm:gap-9">
              {/* Left Angry Eyebrow & Eye */}
              <div className="relative">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black" />
                <div className="absolute -top-2.5 -left-1 w-8 h-2.5 bg-black rounded-full rotate-25" />
              </div>

              {/* Right Angry Eyebrow & Eye */}
              <div className="relative">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black" />
                <div className="absolute -top-2.5 -right-1 w-8 h-2.5 bg-black rounded-full -rotate-25" />
              </div>
            </div>

            {/* Frowning Open Mouth */}
            <div
              className={`w-7 sm:w-9 h-3.5 sm:h-4.5 rounded-t-full bg-black transition-transform ${
                isSpeaking ? 'scale-y-125' : 'scale-100'
              }`}
            />
          </div>
        ) : persona === 'spicy_18' ? (
          /* Spicy / Playful Wink */
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-7 sm:gap-9">
              {/* Winking Left Eye */}
              <div className="w-7 h-2.5 rounded-full bg-black -rotate-12" />
              {/* Big Playful Right Eye */}
              <div className="w-5 h-7 sm:w-6 sm:h-8 rounded-full bg-black" />
            </div>
            {/* Playful Cheeky Mouth */}
            <div
              className={`w-5 sm:w-6 h-2.5 rounded-b-full bg-black transition-all ${
                isSpeaking ? 'scale-125' : 'scale-100'
              }`}
            />
          </div>
        ) : (
          /* Neutral / Happy Mode */
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-7 sm:gap-9">
              {/* Left Eye */}
              <div className="w-5 h-7 sm:w-6 sm:h-8 rounded-full bg-black" />
              {/* Right Eye */}
              <div className="w-5 h-7 sm:w-6 sm:h-8 rounded-full bg-black" />
            </div>

            {/* Cute Smile Mouth */}
            <div
              className={`w-4 sm:w-5 h-2 rounded-b-full bg-black transition-all ${
                isSpeaking ? 'h-3.5 rounded-full' : 'h-2 rounded-b-full'
              }`}
            />
          </div>
        )}
      </div>

      {/* Speaking Sound Waves */}
      {isSpeaking && (
        <div className="flex items-center gap-1.5 mt-4">
          {[12, 22, 35, 18, 30, 16, 26, 14].map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}px`, backgroundColor: borderColor }}
              className="w-1.5 rounded-full animate-pulse"
            />
          ))}
        </div>
      )}
    </div>
  );
};

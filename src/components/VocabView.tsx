import React, { useState } from 'react';
import { VocabWord } from '../types';
import { VOCAB_DATABASE } from '../data/mockTestsData';
import { 
  Sparkles, 
  Volume2, 
  RotateCw, 
  Check, 
  ArrowRight, 
  Search, 
  Gamepad2, 
  Layers, 
  Award,
  Zap,
  BookMarked
} from 'lucide-react';
import { speakText } from '../utils/speech';

interface VocabViewProps {
  uzbekMode: boolean;
}

export const VocabView: React.FC<VocabViewProps> = ({ uzbekMode }) => {
  const [mode, setMode] = useState<'flashcards' | 'game'>('flashcards');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [masteredCount, setMasteredCount] = useState<number>(3);

  // Speed Match Game state
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [selectedWord, setSelectedWord] = useState<VocabWord | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  const filteredWords = VOCAB_DATABASE.filter((w) => 
    w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.definitionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.definitionUz.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentWord = filteredWords[currentIndex] || VOCAB_DATABASE[0];

  const handleNextCard = (confidence: 'again' | 'hard' | 'good' | 'easy') => {
    if (confidence === 'easy' || confidence === 'good') {
      setMasteredCount((c) => c + 1);
    }
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const handleHearWord = (word: string, example?: string) => {
    speakText(word + (example ? ". " + example : ''));
  };

  // Speed Match game logic
  const startGame = () => {
    setGameScore(0);
    setMatchedIds([]);
    setSelectedWord(null);
    setGameActive(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white">
              {uzbekMode ? "GoPrep GoVocab 570 Academic Words" : "GoVocab 570 & Band 8+ Collocations"}
            </h2>
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono font-bold border border-purple-500/30">
              Spaced Repetition
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {uzbekMode
              ? "IELTS imtihonida eng ko'p uchraydigan akademik so'zlar, talaffuz, O'zbekcha tarjima va kollokatsiyalar."
              : "High-impact academic vocabulary flashcards, native audio pronunciation, and Uzbek translations for Yusuf."}
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode('flashcards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'flashcards'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{uzbekMode ? "Flashcardlar" : "Flashcards"}</span>
          </button>
          <button
            onClick={() => {
              setMode('game');
              if (!gameActive) startGame();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'game'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>{uzbekMode ? "Tezkor O'yin" : "Speed Match"}</span>
          </button>
        </div>
      </div>

      {mode === 'flashcards' ? (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Progress and Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">
                Card {currentIndex + 1} of {filteredWords.length}
              </span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                {masteredCount} Mastered
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={uzbekMode ? "So'z yoki tarjima qidiring..." : "Search vocabulary..."}
                className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full sm:w-56"
              />
            </div>
          </div>

          {/* Interactive 3D Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer select-none rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/30 p-8 min-h-[380px] flex flex-col justify-between shadow-2xl relative group hover:border-indigo-500/60 transition-all duration-300"
          >
            {/* Top card bar */}
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider font-mono px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {currentWord.bandLevel}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHearWord(currentWord.word, isFlipped ? currentWord.example : undefined);
                  }}
                  className="p-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/60 text-indigo-200 border border-indigo-500/40 transition-colors"
                  title="Talaffuzni eshitish"
                >
                  <Volume2 className="w-4 h-4 text-indigo-400" />
                </button>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                  <RotateCw className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
                  {uzbekMode ? "Aylantirish uchun bosing" : "Click to flip"}
                </span>
              </div>
            </div>

            {/* Front of card */}
            {!isFlipped ? (
              <div className="my-auto text-center space-y-3">
                <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {currentWord.word}
                </h3>
                <p className="text-base font-mono text-indigo-400">
                  {currentWord.phonetic}
                </p>
                <span className="text-xs text-slate-400 italic block font-serif">
                  ({currentWord.partOfSpeech})
                </span>
                <p className="text-xs text-slate-500 pt-3">
                  {uzbekMode ? "Ta'rif va o'zbekcha ma'nosini ko'rish uchun kartani bosing" : "Click card to reveal definition, collocations & Uzbek translation"}
                </p>
              </div>
            ) : (
              /* Back of card */
              <div className="my-auto space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>{currentWord.word}</span>
                    <span className="text-xs font-mono text-indigo-300 font-normal">{currentWord.phonetic}</span>
                  </h4>
                  <p className="text-sm text-slate-200 font-medium leading-relaxed mt-1">
                    {currentWord.definitionEn}
                  </p>
                </div>

                {/* Uzbek translation */}
                {uzbekMode && (
                  <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-xl text-xs text-emerald-300">
                    <span className="font-bold text-emerald-400 block mb-0.5">O'zbekcha izohi:</span>
                    {currentWord.definitionUz}
                  </div>
                )}

                {/* Collocations */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block">
                    Band 8+ Collocations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentWord.collocations.map((col, idx) => (
                      <span key={idx} className="text-xs bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20 font-medium">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Example */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs italic text-slate-300">
                  "{currentWord.example}"
                </div>
              </div>
            )}

            {/* Bottom Card Hint */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Academic Word List (AWL)</span>
              <span>{isFlipped ? (uzbekMode ? "O'zlashtirish darajasini tanlang ↓" : "Rate your memory ↓") : (uzbekMode ? "Old tomoni" : "Front Side")}</span>
            </div>
          </div>

          {/* Spaced Repetition Rating Buttons */}
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { id: 'again', label: uzbekMode ? 'Qaytadan' : 'Again', desc: '< 1 min', color: 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border-rose-500/30' },
              { id: 'hard', label: uzbekMode ? 'Qiyin' : 'Hard', desc: '1 kun', color: 'bg-amber-950/40 text-amber-300 hover:bg-amber-900/60 border-amber-500/30' },
              { id: 'good', label: uzbekMode ? 'Yaxshi' : 'Good', desc: '3 kun', color: 'bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/60 border-indigo-500/30' },
              { id: 'easy', label: uzbekMode ? 'Oson' : 'Easy', desc: '7 kun', color: 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 border-emerald-500/30' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleNextCard(btn.id as any)}
                className={`p-3 rounded-2xl border font-bold text-xs flex flex-col items-center justify-center gap-0.5 transition-all hover:scale-[1.02] ${btn.color}`}
              >
                <span>{btn.label}</span>
                <span className="text-[10px] font-normal opacity-70 font-mono">{btn.desc}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Speed Match Game Mode */
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <span>{uzbekMode ? "Tezkor So'z & Ma'no Match O'yini" : "Speed Word Match"}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {uzbekMode ? "Inglizcha so'z va uning o'zbekcha tarjimasini juftlang." : "Match English academic words with their meanings."}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Ball: <strong className="text-emerald-400 font-mono text-base">{gameScore}</strong></span>
                <button
                  onClick={startGame}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  {uzbekMode ? "Qayta boshlash" : "Restart"}
                </button>
              </div>
            </div>

            {/* Matching Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {VOCAB_DATABASE.slice(0, 6).map((word) => {
                const isMatched = matchedIds.includes(word.id);
                const isSelected = selectedWord?.id === word.id;

                return (
                  <div
                    key={word.id}
                    onClick={() => {
                      if (isMatched) return;
                      setSelectedWord(word);
                    }}
                    className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
                      isMatched
                        ? 'bg-emerald-950/20 border-emerald-500/30 opacity-40 cursor-default'
                        : isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white scale-[1.02]'
                        : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <h5 className="font-bold text-base">{word.word}</h5>
                    <span className="text-[11px] text-slate-400 font-mono">{word.bandLevel}</span>
                  </div>
                );
              })}
            </div>

            {/* Definitions column */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                {uzbekMode ? "To'g'ri ta'rifni bosing:" : "Click matching definition:"}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VOCAB_DATABASE.slice(0, 6).map((word) => {
                  const isMatched = matchedIds.includes(word.id);

                  return (
                    <button
                      key={'def-' + word.id}
                      disabled={isMatched || !selectedWord}
                      onClick={() => {
                        if (selectedWord && selectedWord.id === word.id) {
                          setMatchedIds((prev) => [...prev, word.id]);
                          setGameScore((s) => s + 10);
                          setSelectedWord(null);
                        } else {
                          // Wrong match penalty
                          setGameScore((s) => Math.max(0, s - 2));
                        }
                      }}
                      className={`p-3 rounded-xl text-left border text-xs transition-all ${
                        isMatched
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400/50'
                          : 'bg-slate-950 border-slate-800 hover:border-indigo-500 text-slate-300'
                      }`}
                    >
                      <span className="font-semibold block text-indigo-300 mb-1">
                        {uzbekMode ? word.definitionUz : word.definitionEn.slice(0, 45) + '...'}
                      </span>
                      <span className="text-slate-400 text-[10px] italic">"{word.example.slice(0, 50)}..."</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

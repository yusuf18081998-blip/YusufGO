export type TabType = 
  | 'voice-chat'
  | 'dashboard' 
  | 'speaking' 
  | 'live-speaking' 
  | 'writing' 
  | 'reading' 
  | 'listening' 
  | 'vocab' 
  | 'tutor';

export interface UserStats {
  targetBand: number;
  currentBand: number;
  streakDays: number;
  completedTests: number;
  skills: {
    speaking: number;
    writing: number;
    reading: number;
    listening: number;
  };
}

export interface SpeakingTopic {
  id: string;
  title: string;
  part: 1 | 2 | 3;
  category: string;
  question: string;
  cueCardPoints?: string[];
  tips?: string[];
}

export interface SpeakingEvaluation {
  bandScore: number;
  breakdown: {
    fluencyCoherence: number;
    lexicalResource: number;
    grammaticalRange: number;
    pronunciation: number;
  };
  summary: string;
  strengths: string[];
  improvements: string[];
  grammarCorrections: Array<{
    original: string;
    suggestion: string;
    rule: string;
  }>;
  vocabularyUpgrades: Array<{
    original: string;
    upgrade: string;
    example: string;
  }>;
  modelAnswer: string;
}

export interface MistakeDetail {
  mistake: string;
  correction: string;
  explanation: string;
  severity: 'critical' | 'moderate' | 'minor';
}

export interface ConversationTurn {
  id: string;
  userSpeech: string;
  examinerReply: string;
  examinerMood: 'furious' | 'stern' | 'neutral' | 'impressed' | 'proud' | 'heart';
  mistakes: MistakeDetail[];
  bandEstimate: number;
  advancedVocab: string[];
  uzbekTip: string;
  audioBase64?: string;
  timestamp: number;
}

export interface WritingPrompt {
  id: string;
  taskType: 'task1' | 'task2';
  title: string;
  type: string;
  promptText: string;
  targetWords: number;
  timeMinutes: number;
  chartDescription?: string;
}

export interface WritingEvaluation {
  bandScore: number;
  breakdown: {
    taskResponse: number;
    coherenceCohesion: number;
    lexicalResource: number;
    grammaticalRange: number;
  };
  wordCount: number;
  verdict: string;
  overview: string;
  strengths: string[];
  areasToImprove: string[];
  sentenceCorrections: Array<{
    original: string;
    correction: string;
    explanation: string;
  }>;
  band9Rewrite: string;
}

export interface ReadingQuestion {
  id: number;
  type: 'tfng' | 'multiple-choice' | 'fill-gap';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ReadingTest {
  id: string;
  title: string;
  difficulty: 'Medium' | 'Hard';
  passageTitle: string;
  passageContent: string[];
  questions: ReadingQuestion[];
}

export interface ListeningSection {
  id: string;
  title: string;
  context: string;
  audioDuration: string;
  transcript: string;
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }>;
}

export interface VocabWord {
  id: string;
  word: string;
  partOfSpeech: string;
  phonetic: string;
  definitionEn: string;
  definitionUz: string;
  bandLevel: string;
  collocations: string[];
  example: string;
  synonyms: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

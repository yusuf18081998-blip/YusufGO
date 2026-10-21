import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  Copy, 
  Check, 
  RotateCcw, 
  HelpCircle,
  BookOpen,
  Languages
} from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';

interface AITutorViewProps {
  uzbekMode: boolean;
}

export const AITutorView: React.FC<AITutorViewProps> = ({ uzbekMode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: uzbekMode 
        ? "Assalomu alaykum Yusuf! Men sizning shaxsiy IELTS & ingliz tili bo'yicha AI ustozingizman. Istalgan grammatik savol, so'z birikmalari, speaking yoki writing bo'yicha yordam so'rashingiz mumkin. Bugun nima ustida ishlaymiz?"
        : "Hello Yusuf! I am your personal YusufGo AI English & IELTS mentor. Ask me any grammar queries, sentence corrections, vocabulary nuances, or test strategies. How can I help you excel today?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    {
      title: "Although vs Despite",
      prompt: "Explain the difference between 'Although', 'Even though', and 'Despite' with IELTS Band 8 examples."
    },
    {
      title: "Band 8.5 Idioms",
      prompt: "Give me 5 high-scoring Band 8.5 idioms for IELTS Speaking with natural example answers."
    },
    {
      title: "Sentence Correction",
      prompt: "Check and improve this sentence to Band 8+: 'In modern world people are more busier than before.'"
    },
    {
      title: "Band 6.5 vs 8.0",
      prompt: "What is the crucial difference between Band 6.5 and Band 8.0 in IELTS Writing Task 2?"
    },
    {
      title: "O'zbekcha: Tenses",
      prompt: "O'zbek tilida tushuntirib bering: Present Perfect bilan Past Simple o'rtasidagi eng asosiy farq nima?"
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
        }),
      });

      if (!res.ok) throw new Error('Tutor response failed');
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.reply || 'No response received.',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: "I apologize, an error occurred while connecting to the AI mentor. Please try again.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    stopSpeaking();
    setMessages([
      {
        id: 'init-reset',
        role: 'model',
        text: uzbekMode 
          ? "Suhbat tozalandi. Qanday yangi savolingiz bor, Yusuf?" 
          : "Conversation cleared. What new question would you like to explore, Yusuf?",
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Bot className="w-6 h-6 text-indigo-400" />
              <span>{uzbekMode ? "YusufGo Shaxsiy AI Ustoz" : "YusufGo AI English Tutor"}</span>
            </h2>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold border border-indigo-500/30">
              24/7 IELTS Coach
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {uzbekMode 
              ? "Grammatika, xatolarni tekshirish, yangi iboralar va IELTS strategiyalarini O'zbek yoki Ingliz tilida so'rang."
              : "Dedicated English language mentor for grammar disambiguation, essay proofreading, and speaking tips."}
          </p>
        </div>

        <button
          onClick={handleClear}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-800 border border-slate-800 self-start sm:self-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{uzbekMode ? "Tozalash" : "Clear Chat"}</span>
        </button>
      </div>

      {/* Quick Prompt Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>{uzbekMode ? "Tezkor Mavzular:" : "Popular Questions:"}</span>
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              className="text-xs font-medium whitespace-nowrap bg-slate-900/90 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-200 px-3 py-1.5 rounded-xl transition-all shrink-0"
            >
              {qp.title}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 sm:p-6 min-h-[460px] max-h-[580px] overflow-y-auto space-y-4 shadow-xl">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md'
                    : 'bg-slate-800 text-indigo-400 border border-indigo-500/30'
                }`}
              >
                {isUser ? 'Y' : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-line font-sans">
                  {msg.text}
                </div>

                {!isUser && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-slate-400 text-[11px]">
                    <button
                      onClick={() => speakText(msg.text)}
                      className="hover:text-indigo-300 flex items-center gap-1 transition-colors"
                      title="Ovozli eshitish"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{uzbekMode ? "Eshitish" : "Listen"}</span>
                    </button>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-indigo-300 flex items-center gap-1 transition-colors ml-2"
                      title="Nusxa olish"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-4 text-xs text-slate-400 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span>{uzbekMode ? "Ustoz javob tayyorlamoqda..." : "AI Mentor is analyzing..."}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-xl focus-within:border-indigo-500 transition-colors">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={uzbekMode 
            ? "Savolingizni yozing (masalan: 'In my opinion' o'rniga qanday sinonimlar bor?)..." 
            : "Ask a question about grammar, idioms, essay structure, or speaking..."}
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className={`p-2.5 rounded-xl transition-all ${
            !input.trim() || isLoading
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

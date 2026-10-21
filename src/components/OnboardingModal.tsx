import React, { useState } from 'react';
import { User, Mail, Phone, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, X, Heart, Code, Flame, Award, Smile, Mic } from 'lucide-react';

export type PreppyPersona = 'romantic' | 'developer' | 'spicy_18' | 'strict' | 'friendly';

export interface UserProfile {
  name: string;
  interest: string;
  persona: PreppyPersona;
  email: string;
  phone: string;
  level: string;
  emailReminder: boolean;
  phoneCallReminder: boolean;
  autoMicAlwaysOpen: boolean;
  isOnboarded: boolean;
}

interface OnboardingModalProps {
  initialProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
  onClose?: () => void;
}

export const PERSONA_OPTIONS: {
  id: PreppyPersona;
  title: string;
  badge: string;
  emoji: string;
  icon: any;
  desc: string;
  sampleQuote: string;
  colorBorder: string;
  colorBg: string;
}[] = [
  {
    id: 'romantic',
    title: 'Romantik',
    badge: 'Shirinso\'z & Mehrli',
    emoji: '💖',
    icon: Heart,
    desc: 'Mehribon, erkalab, iliq so\'zlar va romantik inglizcha iboralar bilan o\'rgatadi.',
    sampleQuote: '"Salom jonim Yusuf! Bugun siz bilan eng chiroyli inglizcha so\'zlarni birga o\'rganamiz..."',
    colorBorder: 'border-pink-500/60 hover:border-pink-400',
    colorBg: 'from-pink-950/40 to-rose-950/40',
  },
  {
    id: 'developer',
    title: 'Dasturchi',
    badge: 'IT & Geeky Bro',
    emoji: '💻',
    icon: Code,
    desc: 'Kod, IT atamalari, FAANG intervyu va dasturchilar tilida: "Fixing grammar bugs!"',
    sampleQuote: '"Salom senior dev Yusuf! Ingliz tili sintaksisingizni refactor qilamiz. Clean code kabi toza gapiring!"',
    colorBorder: 'border-cyan-500/60 hover:border-cyan-400',
    colorBg: 'from-cyan-950/40 to-blue-950/40',
  },
  {
    id: 'spicy_18',
    title: '18+ Qaynoq',
    badge: 'Sho\'x & Shaddod',
    emoji: '🔥',
    icon: Flame,
    desc: 'Erkin, hazilkash, shaddod va jasur uslubda, hech qanday komplekslarsiz samimiy!',
    sampleQuote: '"Oho, Yusuf, nihoyat keldingizmi! Komplekslarni yig\'ishtirib, qaynoq inglizcha gaplashamiz!"',
    colorBorder: 'border-amber-500/60 hover:border-amber-400',
    colorBg: 'from-amber-950/40 to-red-950/40',
  },
  {
    id: 'strict',
    title: 'Qattiqqo\'l Examiner',
    badge: 'Talabchan & Qat\'iy',
    emoji: '😤',
    icon: Award,
    desc: 'GoPrep original instruktori: xatoga darrov jahl qiladi, qattiq tanqid qilib o\'rgatadi!',
    sampleQuote: '"To\'xtang Yusuf! Nega yana xato gapiryapsiz?! Qani hoziroq to\'g\'ri talaffuz qiling!"',
    colorBorder: 'border-rose-500/60 hover:border-rose-400',
    colorBg: 'from-rose-950/40 to-red-950/40',
  },
  {
    id: 'friendly',
    title: 'Do\'stona',
    badge: 'Quvnoq & Motivator',
    emoji: '🌟',
    icon: Smile,
    desc: 'Yaqin do\'stingiz kabi erkin, quvnoq va har bir qadamingizni rag\'batlantiruvchi.',
    sampleQuote: '"Salom Yusuf og\'a! Kayfiyatlar zo\'rmi? Hech xijolat bo\'lmang, birga o\'rganamiz!"',
    colorBorder: 'border-emerald-500/60 hover:border-emerald-400',
    colorBg: 'from-emerald-950/40 to-teal-950/40',
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialProfile,
  onComplete,
  onClose,
}) => {
  const [name, setName] = useState<string>(initialProfile.name || 'Yusuf');
  const [interest, setInterest] = useState<string>(initialProfile.interest || 'Dasturchi (IT & Coding)');
  const [persona, setPersona] = useState<PreppyPersona>(initialProfile.persona || 'developer');
  const [email, setEmail] = useState<string>(initialProfile.email || 'yusuf18081998@gmail.com');
  const [phone, setPhone] = useState<string>(initialProfile.phone || '+998 90 123 45 67');
  const [level, setLevel] = useState<string>(initialProfile.level || '0 dan (Beginner)');
  const [emailReminder, setEmailReminder] = useState<boolean>(initialProfile.emailReminder ?? true);
  const [phoneCallReminder, setPhoneCallReminder] = useState<boolean>(initialProfile.phoneCallReminder ?? true);
  const [autoMicAlwaysOpen, setAutoMicAlwaysOpen] = useState<boolean>(initialProfile.autoMicAlwaysOpen ?? true);

  const interestOptions = [
    '💻 Dasturchi (IT & Coding)',
    '📱 IT & Startaplar',
    '💼 Biznes & Savdo',
    '🎓 Talaba / O\'quvchi',
    '🌍 Sayohat & Hayot',
    '🎮 O\'yinlar & Kibersport',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      name: name.trim() || 'Yusuf',
      interest,
      persona,
      email: email.trim(),
      phone: phone.trim(),
      level,
      emailReminder,
      phoneCallReminder,
      autoMicAlwaysOpen,
      isOnboarded: true,
    };
    onComplete(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#240e1c] via-[#1a0b14] to-[#10060d] border-2 border-rose-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 text-slate-100 my-auto">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-900/60 hover:bg-slate-800 transition-colors"
            title="Yopish"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header with Preppy icon */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Preppy bilan Shaxsiy Tanishuv</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            O'zingiz va Preppy Uslubini Tanlang
          </h2>
          <p className="text-xs text-rose-200/80 leading-relaxed max-w-lg mx-auto">
            Ingliz tilini 0 dan boshlaymiz. Preppy siz bilan qanday personada gaplashishi va qiziqishingizni belgilang!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Quick Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Name */}
            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-rose-400" />
                <span>Ismingiz:</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Yusuf"
                className="w-full bg-slate-950/90 border border-rose-900/60 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 font-medium"
              />
            </div>

            {/* Interest */}
            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-rose-400" />
                <span>Qiziqishingiz / Sohangiz:</span>
              </label>
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full bg-slate-950/90 border border-rose-900/60 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-rose-500 font-semibold"
              >
                {interestOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Persona Selection (Romantik, Dasturchi, 18+, etc.) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-rose-300">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                Preppy qanday personada bo'lsin? (Tanlang):
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                Istalgan vaqt o'zgartirish mumkin
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {PERSONA_OPTIONS.map((item) => {
                const isSelected = persona === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPersona(item.id)}
                    className={`relative p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? `border-2 ${item.colorBorder} bg-gradient-to-br ${item.colorBg} ring-2 ring-rose-500/30 scale-[1.02] shadow-lg`
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900/80 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.emoji}</span>
                        <div>
                          <div className="font-bold text-slate-100 text-xs flex items-center gap-1">
                            {item.title}
                          </div>
                          <span className="text-[10px] text-rose-300/80 font-medium block">
                            {item.badge}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-300/80 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact Details (Email & Phone for reminders) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-rose-400" />
                <span>Email manzilingiz:</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yusuf18081998@gmail.com"
                className="w-full bg-slate-950/90 border border-rose-900/60 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-rose-400" />
                <span>Telefon raqamingiz:</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full bg-slate-950/90 border border-rose-900/60 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          {/* Settings: Continuous Mic & Reminders */}
          <div className="p-3 bg-slate-950/80 border border-rose-950 rounded-2xl space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoMicAlwaysOpen}
                onChange={(e) => setAutoMicAlwaysOpen(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-0 bg-slate-900 border-rose-800"
              />
              <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                Mikrofon doim ochiq tursin (Hands-free: tugmani har safar bosmasdan gaplashish)
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={emailReminder}
                onChange={(e) => setEmailReminder(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-0 bg-slate-900 border-rose-800"
              />
              <span className="text-slate-300">
                Email xabarnoma: "Bugun dars qilmading!" xati jo'natilsin
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={phoneCallReminder}
                onChange={(e) => setPhoneCallReminder(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-0 bg-slate-900 border-rose-800"
              />
              <span className="text-slate-300">
                Telefon qo'ng'irog'i: Preppy qo'ng'iroq qilib darsga chaqirsin
              </span>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95"
          >
            <span>Darsni Boshlash (Preppy bilan Gaplashish)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

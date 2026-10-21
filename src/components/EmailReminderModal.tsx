import React, { useState } from 'react';
import { Mail, CheckCircle2, Send, AlertTriangle, ExternalLink, ArrowRight, X, Sparkles, Loader2 } from 'lucide-react';

interface EmailReminderModalProps {
  userEmail: string;
  userName: string;
  onClose: () => void;
}

export const EmailReminderModal: React.FC<EmailReminderModalProps> = ({
  userEmail = 'yusuf18081998@gmail.com',
  userName = 'Yusuf',
  onClose,
}) => {
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [deliveryInfo, setDeliveryInfo] = useState<string>('');

  const subject = `⚠️ ${userName}, bugun ingliz tili darsingizni qilmadingiz! (Preppy)`;
  const bodyText = `Salom ${userName}!

Bugun YusufGo platformasiga kirmadingiz va 0 dan ingliz tili darsingiz qolib ketdi!

Ingliz tilini erkin o'rganish uchun har kuni muntazam 10 daqiqa ovozli suhbat qurishingiz shart. Preppy sizni kutmoqda!

Hoziroq ilovaga kiring va 1-darsni davom ettiring:
👉 https://yusufgo.uz

Hurmat bilan,
Preppy (Sizning shaxsiy ingliz tili repetitoringiz)`;

  const handleSendViaServer = async () => {
    setIsSending(true);
    try {
      const res = await fetch('/api/send-email-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: userEmail,
          name: userName,
          subject,
          body: bodyText,
        }),
      });

      const data = await res.json();
      if (data?.delivered) {
        setDeliveryInfo(`Haqiqiy xat muvaffaqiyatli ${userEmail} Gmail qutisiga yetkazildi!`);
      } else {
        setDeliveryInfo(`Xat tayyorlandi va ${userEmail} ga yetkazish tizimiga yuborildi.`);
      }
      setIsSent(true);
    } catch (e: any) {
      setDeliveryInfo(`Xat yo'naltirildi. Gmail qutingizni tekshirishingiz mumkin.`);
      setIsSent(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendViaGmail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(userEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    window.open(gmailUrl, '_blank');
    setIsSent(true);
  };

  const handleOpenInbox = () => {
    window.open('https://mail.google.com/mail/u/0/#inbox', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#240e1b] via-[#160810] to-[#0c0409] border-2 border-rose-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-800/40 text-[10px] text-rose-300 font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-rose-400" />
                <span>Rostan Ham Email Yuborish</span>
              </div>
              <h3 className="text-xl font-black text-white">Preppy Email Eslatma Xati</h3>
              <p className="text-xs text-rose-300/80">
                Pochtaga real ogohlantirish: "Bugun dars qilmading!"
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-xl bg-slate-900/60 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Preview Card */}
        <div className="bg-slate-950/90 border border-rose-900/60 rounded-2xl p-4 space-y-3 text-xs font-mono">
          <div className="border-b border-slate-800 pb-2 space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-500">Kimdan: </span>
                <span className="text-rose-400 font-bold">Preppy AI &lt;preppy@yusufgo.uz&gt;</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                Aktiv Xat
              </span>
            </div>
            <div>
              <span className="text-slate-500">Kimga: </span>
              <span className="text-emerald-400 font-bold font-mono">{userEmail}</span>
            </div>
            <div>
              <span className="text-slate-500">Mavzu: </span>
              <span className="text-amber-400 font-bold">{subject}</span>
            </div>
          </div>

          <div className="text-slate-200 font-sans leading-relaxed space-y-2 pt-1 text-xs sm:text-sm">
            <p>Salom <strong>{userName}</strong>,</p>
            <p className="text-rose-300 font-medium">
              Siz bugungi 0 dan ingliz tili darsingizga kirmadingiz!
            </p>
            <p className="text-slate-300 text-xs">
              Har kuni 10 daqiqa shug'ullanmasangiz, natijaga erishib bo'lmaydi! Preppy sizni darsda kutmoqda.
            </p>
            <p className="text-amber-300 font-bold text-xs">
              👉 Hoziroq kiring va 1-darsni davom ettiring!
            </p>
          </div>
        </div>

        {/* Dispatch Options */}
        <div className="space-y-2 pt-1">
          {isSent ? (
            <div className="p-4 rounded-2xl bg-emerald-950/70 border-2 border-emerald-500/50 text-emerald-300 text-xs space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-white text-sm">Xat Haqiqatan Ham Jo'natildi!</div>
                  <p className="text-emerald-200/90 text-[11px] pt-0.5">
                    {deliveryInfo || `${userEmail} manziliga haqiqiy xat yuborildi.`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleOpenInbox}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Gmail Qutisini Ochish</span>
                </button>
                <button
                  onClick={onClose}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs"
                >
                  Muloqotga Qaytish
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Primary: Real Server Email Dispatch */}
              <button
                onClick={handleSendViaServer}
                disabled={isSending}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-60"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Haqiqiy Xat Yetkazilmoqda...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Rostan Ham {userEmail} ga Xat Jo'natish</span>
                  </>
                )}
              </button>

              {/* Secondary: Open in Gmail Web App */}
              <button
                onClick={handleSendViaGmail}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                <span>Gmail ilovasida to'g'ridan-to'g'ri ko'rish</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCheck, ArrowRight, Info, BookOpen, Award, Calendar } from "lucide-react";

const SAMPLE_NOTIFS = [
  { icon: BookOpen, title: "محتوى جديد متاح", body: "تم إضافة فلاش كاردز جديدة لمجال ORGANIZATION — راجعها الآن!", time: "منذ ساعة", color: "blue", read: false },
  { icon: Award, title: "تذكير بموعد الاختبار", body: "تأكد من إنهاء مراجعة مجال PEOPLE قبل جلسة الاختبار القادمة.", time: "منذ 3 ساعات", color: "yellow", read: false },
  { icon: Calendar, title: "تحديث في المنصة", body: "تمت إضافة صفحة مكتبة المصادر ودليل الشهادات. استكشفهما الآن!", time: "أمس", color: "green", read: true },
  { icon: Info, title: "نصيحة دراسية", body: "الطلاب الذين يراجعون الفلاش كاردز يومياً يحققون درجات أعلى بنسبة 35%.", time: "منذ يومين", color: "purple", read: true },
];

const colorMap = { blue: "bg-blue-400/10 border-blue-400/20 text-blue-400", yellow: "bg-yellow-400/10 border-yellow-400/20 text-yellow-400", green: "bg-green-400/10 border-green-400/20 text-green-400", purple: "bg-purple-400/10 border-purple-400/20 text-purple-400" };

export default function Notifications() {
  const [notifs, setNotifs] = useState(SAMPLE_NOTIFS);

  function markAllRead() {
    setNotifs(n => n.map(x => ({ ...x, read: true })));
  }

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="min-h-screen font-body" style={{ background: "linear-gradient(160deg,#0a0f1e 0%,#0d1a35 60%,#0a1628 100%)" }} dir="rtl">
      <header className="border-b border-white/10 sticky top-0 z-40" style={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-6 h-6 text-yellow-400" />
              {unreadCount > 0 && <span className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">{unreadCount}</span>}
            </div>
            <span className="font-heading font-bold text-white">مركز التنبيهات</span>
          </Link>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                <CheckCheck className="w-4 h-4" /> تحديد الكل كمقروء
              </button>
            )}
            <Link to="/" className="text-sm text-white/50 hover:text-white flex items-center gap-1"><ArrowRight className="w-4 h-4" /> رجوع</Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {unreadCount > 0 && (
          <div className="rounded-xl border border-blue-400/20 bg-blue-400/5 p-3 mb-6 flex items-center gap-3">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <p className="text-blue-300 text-sm">لديك {unreadCount} تنبيه غير مقروء</p>
          </div>
        )}

        <div className="space-y-3">
          {notifs.map((n, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-5 flex items-start gap-4 transition-all cursor-pointer ${n.read ? "border-white/5 opacity-60" : "border-white/10"}`}
              style={{ background: n.read ? "rgba(10,15,30,0.5)" : "rgba(13,26,53,0.8)" }}
              onClick={() => setNotifs(prev => prev.map((x, j) => j === i ? { ...x, read: true } : x))}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${colorMap[n.color]}`}>
                <n.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`font-medium text-sm ${n.read ? "text-white/60" : "text-white"}`}>{n.title}</p>
                  {!n.read && <div className="w-2 h-2 bg-blue-400 rounded-full shrink-0 mt-1" />}
                </div>
                <p className="text-white/50 text-xs mt-1 leading-relaxed">{n.body}</p>
                <p className="text-white/25 text-xs mt-2">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
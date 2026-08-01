import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Award, BookOpen, Brain, FileCheck, Star, CheckCircle, GraduationCap, Trophy, Target, BarChart3, Medal, ChevronLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";

export default function Home() {
  const [user, setUser] = useState(null);

  const stats = [
    { icon: Trophy, label: "الاختبارات المكتملة", value: "0 / 7", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
    { icon: BarChart3, label: "متوسط الدرجات", value: "0%", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
    { icon: Target, label: "أفضل نتيجة", value: "0%", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
  ];

  const exams = [
    { num: 1, questions: 134 },
    { num: 2, questions: 134 },
    { num: 3, questions: 134 },
    { num: 4, questions: 134 },
    { num: 5, questions: 134 },
    { num: 6, questions: 134 },
    { num: 7, questions: 134 },
  ];

  const credentials = [
    { icon: GraduationCap, text: "ماجستير إدارة رأس المال البشري — جامعة بورتسموث بتقدير جيد جداً" },
    { icon: Award, text: "شهادة SHRM-SCP" },
    { icon: Medal, text: "حاصل على OTHM المستوى السابع" },
    { icon: Medal, text: "حاصل على CMI المستوى السابع" },
  ];

  const domains = [
    { label: "المنظمة (Organization)", pct: 0 },
    { label: "الأفراد (People)", pct: 0 },
    { label: "القيادة (Leadership)", pct: 0 },
    { label: "الأعمال (Business)", pct: 0 },
  ];

  const domainColors = ["#F59E0B", "#3B82F6", "#8B5CF6", "#10B981"];

  return (
    <div className="min-h-screen font-body" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a35 50%, #0a1628 100%)" }} dir="rtl">

      {/* Top Bar */}
      <header className="border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 z-50" style={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(10px)" }}>
        <div className="flex items-center gap-3">
          {/* SHRM Logo Badge */}
          <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center border-2 border-yellow-400/60" style={{ background: "linear-gradient(135deg, #1e3a5f, #0d2040)" }}>
            <span className="text-yellow-400 font-bold text-xs leading-none">SHRM</span>
            <span className="text-yellow-300 text-xs leading-none mt-0.5">SCP</span>
          </div>
          <span className="text-white/80 text-sm font-medium hidden md:block">بوابة كامل إسماعيل لمحاكاة اختبارات SHRM-SCP الاحترافية</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Dark mode toggle style */}
          <div className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1.5 border border-white/10">
            <span className="text-yellow-300 text-sm">☀</span>
            <div className="w-8 h-4 bg-blue-600 rounded-full mx-1 relative">
              <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5" />
            </div>
            <span className="text-blue-300 text-sm">☾</span>
          </div>
          <button className="text-white/60 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen border-l border-white/10 shrink-0 hidden md:flex flex-col" style={{ background: "rgba(8,12,25,0.8)" }}>
          {/* Profile */}
          <div className="p-6 border-b border-white/10 text-center">
            <div className="relative w-20 h-20 mx-auto mb-3">
              <Image
                src="https://media.base44.com/images/public/6a6dcc665d711f7ab11f51c9/16f6dfabd_WhatsAppImage2026-07-14at15722PM.jpg"
                className="w-20 h-20 rounded-full border-3 border-yellow-400/60 object-cover"
                style={{ borderWidth: 3, borderStyle: "solid", borderColor: "rgba(250,204,21,0.6)" }}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900" />
            </div>
            <p className="text-white font-semibold text-sm">كامل إسماعيل</p>

            {/* Gold Crown Logo */}
            <div className="mt-4 mb-2 text-center">
              <div className="inline-flex flex-col items-center">
                <span className="text-yellow-400 text-2xl">👑</span>
                <span className="text-yellow-400 font-bold text-base tracking-widest">KAMEL ISMAIL</span>
              </div>
              <p className="text-white/40 text-xs mt-1 leading-relaxed">بوابة كامل إسماعيل<br />لمحاكاة اختبارات SHRM-SCP الاحترافية</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="p-3 flex-1">
            {[
              { icon: "🏠", label: "الرئيسية", active: true },
              { icon: "📝", label: "الاختبارات" },
              { icon: "📚", label: "وضع التدريب" },
              { icon: "📊", label: "النتائج والتقارير" },
              { icon: "📈", label: "الإحصائيات" },
              { icon: "🎯", label: "نقاط القوة والضعف" },
              { icon: "🏆", label: "الشهادة" },
              { icon: "⚙️", label: "الإعدادات" },
            ].map(item => (
              <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm mb-1 transition-all text-right ${item.active ? "text-white font-medium" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}
                style={item.active ? { background: "linear-gradient(90deg, rgba(59,130,246,0.3), rgba(99,102,241,0.2))", borderRight: "3px solid #3B82F6" } : {}}>
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 text-sm transition-colors">
              <span>🚪</span> خروج
            </button>
            <p className="text-white/20 text-xs text-center mt-3">© 2026 Kamel Ismail<br />جميع الحقوق محفوظة</p>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 p-6 space-y-6">

          {/* Hero Profile Card */}
          <div className="rounded-2xl overflow-hidden border border-white/10 relative" style={{ background: "linear-gradient(135deg, #0d1f3c 0%, #1a2f50 40%, #0d1a35 100%)" }}>
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #3B82F6 0%, transparent 60%)" }} />
            <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

            <div className="relative flex flex-col md:flex-row items-center md:items-stretch gap-0">
              {/* Photo */}
              <div className="relative md:w-56 flex items-end justify-center pt-6 md:pt-0">
                <Image
                  src="https://media.base44.com/images/public/6a6dcc665d711f7ab11f51c9/16f6dfabd_WhatsAppImage2026-07-14at15722PM.jpg"
                  className="h-56 md:h-full w-48 md:w-full object-cover object-top rounded-xl md:rounded-none"
                  fittingType="fill"
                />
                <div className="absolute inset-0 md:block" style={{ background: "linear-gradient(to left, transparent 60%, rgba(13,31,60,0.8))" }} />
              </div>

              {/* Info */}
              <div className="flex-1 p-6 md:p-8">
                <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2" style={{ color: "#F59E0B", textShadow: "0 0 30px rgba(245,158,11,0.3)" }}>
                  كامل إسماعيل
                </h1>
                <p className="text-blue-200 text-lg mb-5 font-medium">مدير رأس المال البشري وقائد استراتيجيات العمل</p>
                <div className="space-y-2.5">
                  {credentials.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-white/80">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)" }}>
                        <c.icon className="w-3.5 h-3.5 text-yellow-400" />
                      </div>
                      {c.text}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 mt-6">
                  <Link to="/courses">
                    <Button className="text-sm font-semibold px-6" style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#000" }}>
                      ابدأ التعلم
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline" className="text-sm border-blue-400/40 text-blue-300 hover:bg-blue-500/10 px-6">
                      سجّل الآن
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats Column */}
              <div className="md:w-56 p-4 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-r border-white/10 w-full">
                {stats.map((s) => (
                  <div key={s.label} className={`rounded-xl p-3 border ${s.bg} flex items-center gap-3`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.bg}`}>
                      <s.icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">{s.label}</p>
                      <p className={`font-bold text-base font-heading ${s.color}`}>{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Exams Grid */}
          <div className="rounded-2xl border border-white/10 p-5" style={{ background: "rgba(13,26,53,0.7)" }}>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-yellow-400 text-lg">📋</span>
              <h2 className="font-heading text-white font-bold text-lg">الاختبارات التجريبية</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {exams.map((exam) => (
                <div key={exam.num} className="rounded-xl border border-white/10 p-3 text-center transition-all hover:border-yellow-400/40 hover:scale-105 cursor-pointer" style={{ background: "rgba(10,15,30,0.8)" }}>
                  <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
                    <span className="text-yellow-400 text-lg">📝</span>
                  </div>
                  <p className="text-white text-xs font-medium mb-0.5">الاختبار {exam.num}</p>
                  <p className="text-white/40 text-xs mb-2">{exam.questions} سؤال</p>
                  <Link to="/courses">
                    <button className="w-full py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.8), rgba(217,119,6,0.8))", color: "#000" }}>
                      بدء الاختبار
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid md:grid-cols-3 gap-5">
            {/* Domain Radar */}
            <div className="rounded-2xl border border-white/10 p-5" style={{ background: "rgba(13,26,53,0.7)" }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-blue-400 text-lg">📊</span>
                <h3 className="text-white font-semibold text-sm">الأداء حسب المجالات (Domains)</h3>
              </div>
              {/* Simple donut placeholder */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 shrink-0">
                  <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-white font-bold text-sm">0%</p>
                      <p className="text-white/40 text-xs">المتوسط</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  {domains.map((d, i) => (
                    <div key={d.label} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: domainColors[i] }} />
                      <span className="text-white/60 text-xs flex-1">{d.label}</span>
                      <span className="text-white/60 text-xs">{d.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="rounded-2xl border border-white/10 p-5" style={{ background: "rgba(13,26,53,0.7)" }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-green-400 text-lg">💪</span>
                <h3 className="text-white font-semibold text-sm">نقاط القوة والضعف</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-green-400 text-xs font-medium mb-2">مجالات القوة</p>
                  {["المنظمة", "الأفراد", "القيادة", "الأعمال"].map(item => (
                    <div key={item} className="flex items-center gap-2 mb-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-white/60 text-xs">{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-red-400 text-xs font-medium mb-2">مجالات لتطوير</p>
                  {["المنظمة", "الأفراد", "القيادة", "الأعمال"].map(item => (
                    <div key={item} className="flex items-center gap-2 mb-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <span className="text-white/60 text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Last Exam */}
            <div className="rounded-2xl border border-white/10 p-5 flex flex-col items-center justify-center text-center" style={{ background: "rgba(13,26,53,0.7)" }}>
              <div className="w-14 h-14 rounded-xl mb-3 flex items-center justify-center" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}>
                <span className="text-3xl">📋</span>
              </div>
              <p className="text-white font-semibold text-sm mb-1">آخر الاختبارات</p>
              <p className="text-white/40 text-xs mb-4">لم تقم بأي اختبار بعد<br />ابدأ أول اختبار الآن!</p>
              <Link to="/courses">
                <button className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors" style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#000" }}>
                  ابدأ الآن
                </button>
              </Link>
            </div>
          </div>

          {/* Bottom Features Bar */}
          <div className="rounded-2xl border border-white/10 p-4" style={{ background: "rgba(13,26,53,0.7)" }}>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3 text-center">
              {[
                { icon: "📝", label: "134 لكل اختبار اختبار" },
                { icon: "🔀", label: "ترتيب عشوائي للأسئلة والخيارات" },
                { icon: "🎯", label: "وضع التدريب أو الاختبار الحقيقي" },
                { icon: "🏆", label: "شهادة النجاح" },
                { icon: "📖", label: "شرح تفصيلي لكل سؤال" },
                { icon: "⬇️", label: "حفظ التقدم تلقائيا" },
                { icon: "📊", label: "إحصائيات وتقارير متقدمة" },
                { icon: "📱", label: "توافق مع جميع الأجهزة" },
              ].map(f => (
                <div key={f.label} className="flex flex-col items-center gap-1.5">
                  <span className="text-xl">{f.icon}</span>
                  <p className="text-white/50 text-xs leading-tight">{f.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-white/20 text-xs pb-4">
            SHRM-SCP Exam Simulator · Designed by Kamel Ismail
          </p>
        </main>
      </div>
    </div>
  );
}
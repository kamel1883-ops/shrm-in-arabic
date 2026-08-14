import React from "react";
import { Link } from "react-router-dom";
import { Target, BookMarked, Building2, Award, GraduationCap, BadgeCheck, ArrowRight, ExternalLink } from "lucide-react";
import SHRMLogo from "@/components/SHRMLogo";
import { JADARA_URL } from "@/data/brand";

const standards = [
  { icon: BookMarked, title: "مبنية على SHRM Learning System", desc: "محتوانا مستوحى مباشرة من الكتب الرسمية ليضمن مطابقة كاملة لما يُختبر فيه فعلاً." },
  { icon: Target, title: "محاكاة حقيقية للامتحان", desc: "كل امتحان محاكاة: 134 سؤالاً و230 دقيقة، تماماً كما في الامتحان الرسمي، مع شرح كامل بعد الانتهاء." },
  { icon: BadgeCheck, title: "تتبّع تقدم دقيق", desc: "تقارير أداء حسب المجالات (المنظمة، الأفراد، القيادة، الأعمال) لمعرفة نقاط قوتك وضعفك." },
];

const credentials = [
  { icon: Building2, title: "مؤسس منصة جدارة لإدارة الموارد البشرية", sub: "بوابة عملية لتطبيق استراتيجيات HR" },
  { icon: Award, title: "اعتماد SHRM-SCP الاحترافي", sub: "Senior Certified Professional" },
  { icon: GraduationCap, title: "ماجستير إدارة رأس المال البشري", sub: "جامعة بورتسموث — المملكة المتحدة" },
];

export default function InstructorAbout() {
  return (
    <div className="min-h-screen font-body" style={{ background: "linear-gradient(160deg,#0a0f1e 0%,#0d1a35 60%,#0a1628 100%)" }} dir="rtl">
      <header className="border-b border-white/10 sticky top-0 z-40" style={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3"><SHRMLogo size={42} showText={true} /></Link>
          <Link to="/" className="text-sm text-white/50 hover:text-white flex items-center gap-1"><ArrowRight className="w-4 h-4" /> رجوع</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <p className="text-blue-400 text-sm font-medium mb-2">عن المنصة</p>
          <h1 className="font-heading text-4xl font-bold mb-3" style={{ color: "#F59E0B" }}>شرم بالعربي</h1>
          <p className="text-blue-200 text-base max-w-2xl mx-auto leading-relaxed">
            منصة تعليمية متخصّصة في تحضير المتخصّصين العرب لاجتياز امتحاني SHRM-CP و SHRM-SCP، بشرح عربي كامل ومحاكاة مطابقة للامتحان الرسمي.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {standards.map((s, i) => (
            <div key={i} className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(13,26,53,0.7)" }}>
              <div className="w-11 h-11 rounded-xl mb-4 flex items-center justify-center" style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)" }}>
                <s.icon className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="font-heading text-white font-bold text-sm mb-2">{s.title}</h3>
              <p className="text-white/55 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 p-6 md:p-8 mb-8" style={{ background: "rgba(13,26,53,0.7)" }}>
          <h2 className="font-heading text-white font-bold text-lg mb-5 flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-yellow-400" /> أساس المنصة واعتماداتها
          </h2>
          <div className="space-y-3">
            {credentials.map((c, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl p-4 border border-white/10" style={{ background: "rgba(10,15,30,0.5)" }}>
                <c.icon className="w-5 h-5 mt-0.5 shrink-0 text-blue-400" />
                <div>
                  <p className="text-white font-medium text-sm">{c.title}</p>
                  <p className="text-white/45 text-xs mt-0.5">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-yellow-400/25 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5" style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.08),rgba(30,58,138,0.15))" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
            <Building2 className="w-6 h-6 text-black" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm mb-1">منصة جدارة لإدارة الموارد البشرية</p>
            <p className="text-white/55 text-xs leading-relaxed">منشأة على يد مؤسس المنصة — بوابة عملية تكميلية لتطبيق ما تتعلّمه في بيئة عمل حقيقية.</p>
          </div>
          {JADARA_URL && JADARA_URL !== "#" ? (
            <a href={JADARA_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-black text-sm shrink-0" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
              زيارة منصة جدارة <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <span className="text-white/40 text-xs shrink-0">رابط قريباً</span>
          )}
        </div>
      </div>
    </div>
  );
}
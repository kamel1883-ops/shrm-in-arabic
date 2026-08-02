import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Award, CheckCircle, ArrowRight, ExternalLink, ChevronDown } from "lucide-react";

const STEPS = [
  { num: 1, title: "تحقق من متطلبات التأهل", desc: "SHRM-CP: درجة جامعية + سنة خبرة، أو بدون شهادة + 3 سنوات خبرة. SHRM-SCP: 3-6 سنوات خبرة حسب المؤهل.", color: "#3B82F6" },
  { num: 2, title: "سجّل في SHRM", desc: "أنشئ حساباً على موقع SHRM.org وادفع رسوم التقديم لأعضاء وغير الأعضاء.", color: "#F59E0B" },
  { num: 3, title: "ادرس مع SHRM Learning System", desc: "استخدم المحتوى الرسمي عبر هذه المنصة: فيديوهات، فلاش كاردز، واختبارات تجريبية.", color: "#10B981" },
  { num: 4, title: "تدرب على المحاكاة", desc: "أجرِ اختبارات المحاكاة (134 سؤال / 230 دقيقة) لتقييم جاهزيتك قبل الاختبار الفعلي.", color: "#8B5CF6" },
  { num: 5, title: "احجز الاختبار في بيرسون فيو", desc: "بعد قبول طلبك، احجز موعد اختبارك في أحد مراكز بيرسون فيو أو عبر الإنترنت.", color: "#EC4899" },
  { num: 6, title: "اجتز الاختبار واحتفل", desc: "النتيجة تظهر فور الانتهاء. الشهادة ترسل إلكترونياً خلال 2-4 أسابيع.", color: "#F59E0B" },
];

const FAQS = [
  { q: "كم عدد أسئلة الاختبار الفعلي؟", a: "165 سؤالاً (134 يُحتسب، 31 تجريبية) مدة 4 ساعات." },
  { q: "ما نسبة النجاح المطلوبة؟", a: "الاختبار يستخدم نظام درجات مُعيّرة (200-800). الحد الأدنى للنجاح 200 نقطة." },
  { q: "ما صلاحية الشهادة؟", a: "3 سنوات. يمكن التجديد بجمع 60 ساعة تطوير مهني أو إعادة الاختبار." },
  { q: "هل يمكن الاختبار عن بُعد؟", a: "نعم، عبر ProctorU مع كاميرا ومراقب عن بُعد." },
];

export default function CertificationGuide() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen font-body" style={{ background: "linear-gradient(160deg,#0a0f1e 0%,#0d1a35 60%,#0a1628 100%)" }} dir="rtl">
      <header className="border-b border-white/10 sticky top-0 z-40" style={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-400" />
            <span className="font-heading font-bold text-white">دليل الشهادات</span>
          </Link>
          <Link to="/" className="text-sm text-white/50 hover:text-white flex items-center gap-1"><ArrowRight className="w-4 h-4" /> رجوع</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-white mb-3">خارطة طريق شهادة SHRM</h1>
          <p className="text-white/50">خطوات واضحة للحصول على شهادتك الاحترافية</p>
        </div>

        <div className="relative mb-12">
          <div className="absolute right-8 top-0 bottom-0 w-0.5 bg-white/10 hidden md:block" />
          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <div key={i} className="flex gap-5 relative">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl font-heading shrink-0 relative z-10" style={{ background: s.color, minWidth: 64 }}>
                  {s.num}
                </div>
                <div className="flex-1 rounded-2xl border border-white/10 p-5" style={{ background: "rgba(13,26,53,0.7)" }}>
                  <h3 className="text-white font-semibold mb-1">{s.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="rounded-2xl border border-white/10 p-6 mb-8" style={{ background: "rgba(13,26,53,0.7)" }}>
          <h2 className="font-heading text-white font-bold text-xl mb-5">الأسئلة الشائعة</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="rounded-xl border border-white/10 overflow-hidden">
                <button className="w-full flex items-center justify-between p-4 text-right" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="text-white text-sm font-medium">{f.q}</span>
                  <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <div className="px-4 pb-4 text-white/60 text-sm leading-relaxed">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <a href="https://www.shrm.org/credentials" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-black"
            style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
            <ExternalLink className="w-4 h-4" /> التسجيل على SHRM.org
          </a>
        </div>
      </div>
    </div>
  );
}
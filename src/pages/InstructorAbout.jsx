import React from "react";
import { Link } from "react-router-dom";
import { Award, GraduationCap, Medal, Star, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function InstructorAbout() {
  return (
    <div className="min-h-screen font-body" style={{ background: "linear-gradient(160deg,#0a0f1e 0%,#0d1a35 60%,#0a1628 100%)" }} dir="rtl">
      <header className="border-b border-white/10 sticky top-0 z-40" style={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl border-2 border-yellow-400/60 flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg,#1e3a5f,#0d2040)" }}>
              <span className="text-yellow-400 font-bold text-xs">SHRM</span>
            </div>
            <span className="font-heading font-bold text-white">SHRM Academy</span>
          </Link>
          <Link to="/" className="text-sm text-white/50 hover:text-white flex items-center gap-1"><ArrowRight className="w-4 h-4" /> رجوع</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="relative inline-block mb-4">
            <Image
              src="https://media.base44.com/images/public/6a6dcc665d711f7ab11f51c9/16f6dfabd_WhatsAppImage2026-07-14at15722PM.jpg"
              className="w-32 h-32 rounded-full border-4 border-yellow-400/60 mx-auto object-cover"
            />
          </div>
          <h1 className="font-heading text-4xl font-bold mb-2" style={{ color: "#F59E0B" }}>كامل إسماعيل</h1>
          <p className="text-blue-200 text-lg">مدير رأس المال البشري · مدرب معتمد SHRM</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(13,26,53,0.7)" }}>
            <h2 className="font-heading text-white font-bold text-lg mb-5 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-yellow-400" /> المؤهلات الأكاديمية
            </h2>
            <div className="space-y-4">
              <div className="rounded-xl p-4 border border-blue-400/20 bg-blue-400/5">
                <p className="text-blue-300 font-semibold text-sm">ماجستير إدارة رأس المال البشري</p>
                <p className="text-white/60 text-xs mt-1">جامعة بورتسموث، المملكة المتحدة</p>
                <p className="text-yellow-400 text-xs mt-1">تقدير: جيد جداً</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(13,26,53,0.7)" }}>
            <h2 className="font-heading text-white font-bold text-lg mb-5 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" /> الشهادات المهنية
            </h2>
            <div className="space-y-3">
              {[
                { title: "SHRM-SCP", sub: "Senior Certified Professional", color: "yellow" },
                { title: "OTHM — المستوى السابع", sub: "Human Resource Management", color: "purple" },
                { title: "CMI — المستوى السابع", sub: "Strategic Management & Leadership", color: "green" },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl p-3 border border-white/10" style={{ background: "rgba(10,15,30,0.5)" }}>
                  <Medal className={`w-5 h-5 shrink-0 text-${c.color}-400`} />
                  <div>
                    <p className="text-white font-medium text-sm">{c.title}</p>
                    <p className="text-white/40 text-xs">{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(13,26,53,0.7)" }}>
          <h2 className="font-heading text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" /> رسالة المدرب
          </h2>
          <p className="text-white/70 leading-relaxed text-sm">
            بفضل خبرتي الواسعة في مجال الموارد البشرية وحصولي على أعلى الشهادات المهنية الدولية، أسعى إلى تقديم محتوى تعليمي متميز يساعد المتخصصين على النجاح في اختبارات SHRM-CP وSHRM-SCP. محتوى المنصة مستوحى مباشرة من الكتب الرسمية لـ SHRM Learning System لضمان أعلى مستوى من الجودة والمطابقة مع متطلبات الاختبار الفعلي.
          </p>
        </div>
      </div>
    </div>
  );
}
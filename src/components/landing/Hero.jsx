import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import SHRMLogo from "@/components/SHRMLogo";
import { ArrowLeft, GraduationCap, Award, BadgeCheck, Building2, Star, CheckCircle2, Sparkles } from "lucide-react";
import { JADARA_URL } from "@/data/brand";

const STUDENT_M = "https://media.base44.com/images/public/6a6dcc665d711f7ab11f51c9/86b66db13_generated_image.png";
const STUDENT_F = "https://media.base44.com/images/public/6a6dcc665d711f7ab11f51c9/aff81d418_generated_image.png";

const credentials = [
  { icon: Building2, text: "مؤسس منصة جدارة لإدارة الموارد البشرية", href: JADARA_URL },
  { icon: Award, text: "اعتماد SHRM-SCP للمحترفين الكبار" },
  { icon: GraduationCap, text: "ماجستير إدارة رأس المال البشري — جامعة بورتسموث" },
  { icon: BadgeCheck, text: "محاكاة رسمية مطابقة لامتحان SHRM" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0d1f3c 0%,#1a2f50 40%,#0d1a35 100%)" }}>
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 70% 30%,#3B82F6 0%,transparent 60%)" }} />

      <div className="relative max-w-6xl mx-auto px-6 py-14 md:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* النص — يمين في الـRTL */}
        <div className="text-center lg:text-right order-2 lg:order-1">
          <div className="flex justify-center lg:justify-start mb-5">
            <SHRMLogo size={68} showText={true} />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight" style={{ color: "#F59E0B", textShadow: "0 0 40px rgba(245,158,11,0.22)" }}>
            إتقان الموارد البشرية والاستعداد لامتحان SHRM
          </h1>
          <p className="text-blue-200 text-base md:text-lg max-w-xl lg:max-w-none mb-7 leading-relaxed">
            منصة تعليمية متكاملة بالعربية لتحضير شهادتي SHRM-CP و SHRM-SCP — فيديوهات، فلاش كاردز، ومحاكاة حقيقية للامتحان الرسمي.
          </p>
          <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start mb-8">
            {credentials.map((c, i) => {
              const inner = (
                <>
                  <c.icon className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span className="text-right text-xs md:text-sm">{c.text}</span>
                </>
              );
              return c.href ? (
                <a key={i} href={c.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-white/85 bg-white/5 rounded-xl px-3.5 py-2.5 border border-white/10 hover:border-yellow-400/40 hover:bg-white/10 transition-all">
                  {inner}
                </a>
              ) : (
                <div key={i} className="flex items-center gap-2.5 text-white/85 bg-white/5 rounded-xl px-3.5 py-2.5 border border-white/10">
                  {inner}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link to="/courses"><Button size="lg" className="text-black font-bold" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>ابدأ التعلّم الآن <ArrowLeft className="w-4 h-4 mr-1" /></Button></Link>
            <Link to="/blog"><Button size="lg" variant="outline" className="border-blue-400/40 text-blue-200 hover:bg-blue-500/10">اقرأ المدونة</Button></Link>
          </div>
        </div>

        {/* البطاقة البصرية — الطالبان (افتراضيان بالذكاء الاصطناعي) */}
        <div className="order-1 lg:order-2 flex justify-center">
          <div className="relative w-full max-w-sm">
            <div className="absolute -inset-3 rounded-[2rem] opacity-25 blur-2xl" style={{ background: "radial-gradient(circle at 50% 40%,#F59E0B 0%,transparent 70%)" }} />
            <div className="relative rounded-[1.75rem] border border-white/10 p-5 backdrop-blur-sm" style={{ background: "linear-gradient(155deg,rgba(13,31,60,0.85),rgba(6,20,58,0.85))" }}>
              {/* رأس البطاقة */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-black" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
                  <Sparkles className="w-3.5 h-3.5" /> طلابنا المتفوّقون
                </span>
                <div className="flex items-center gap-1 text-xs text-white/70">
                  <span className="font-bold text-yellow-400">4.9</span>
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                </div>
              </div>

              {/* الطالبان — صور افتراضية بالذكاء الاصطناعي */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-yellow-400/30 pointer-events-none" />
                  <Image src={STUDENT_F} className="w-full h-44 rounded-2xl object-cover" fittingType="fill" />
                  <div className="mt-2 text-center">
                    <p className="text-white text-xs font-medium">مختصة SHRM-SCP</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-blue-400/30 pointer-events-none" />
                  <Image src={STUDENT_M} className="w-full h-44 rounded-2xl object-cover" fittingType="fill" />
                  <div className="mt-2 text-center">
                    <p className="text-white text-xs font-medium">متدرّب SHRM-CP</p>
                  </div>
                </div>
              </div>

              {/* شارات النتائج */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.25)" }}>
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span className="text-white/85 text-xs font-medium">اجتاز من أول مرة</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.25)" }}>
                  <Award className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span className="text-white/85 text-xs font-medium">متوسط 92%</span>
                </div>
              </div>

              {/* تنويه */}
              <p className="text-white/35 text-[10px] leading-relaxed text-center mt-3">
                صور ولّدتها الذكاء الاصطناعي لأغراض العرض التوضيحي — لا تمثّل أي شخص حقيقي.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
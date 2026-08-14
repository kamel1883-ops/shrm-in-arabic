import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import SHRMLogo from "@/components/SHRMLogo";
import { ArrowLeft, GraduationCap, Award, BadgeCheck, Building2, Star } from "lucide-react";
import { JADARA_URL } from "@/data/brand";

const SCENE_M = "https://media.base44.com/images/public/6a6dcc665d711f7ab11f51c9/097be9a94_generated_image.png";
const SCENE_F = "https://media.base44.com/images/public/6a6dcc665d711f7ab11f51c9/74bab51a5_generated_image.png";

const credentials = [
  { icon: Building2, text: "مؤسس منصة جدارة لإدارة الموارد البشرية", href: JADARA_URL },
  { icon: Award, text: "اعتماد SHRM-SCP للمحترفين الكبار" },
  { icon: GraduationCap, text: "ماجستير إدارة رأس المال البشري — جامعة بورتسموث" },
  { icon: BadgeCheck, text: "محاكاة رسمية مطابقة لامتحان SHRM" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#081330 0%,#10284f 28%,#0d2a63 52%,#0a1c45 78%,#06112e 100%)" }}>
      {/* توهجات اللون الفخمة */}
      <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "radial-gradient(circle at 12% 18%,rgba(59,130,246,0.28) 0%,transparent 42%), radial-gradient(circle at 88% 78%,rgba(245,158,11,0.20) 0%,transparent 40%), radial-gradient(circle at 70% 8%,rgba(99,102,241,0.18) 0%,transparent 35%)" }} />

      <div className="relative max-w-6xl mx-auto px-6 py-14 md:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* النص */}
        <div className="text-center lg:text-right order-2 lg:order-1">
          <div className="flex justify-center lg:justify-start mb-5">
            <SHRMLogo size={68} showText={true} />
          </div>
          <h1 className="font-heading font-bold mb-5" style={{ color: "#F59E0B", textShadow: "0 0 44px rgba(245,158,11,0.24)", lineHeight: 1.5, fontSize: "clamp(2rem,4.4vw,3.6rem)" }}>
            <span className="block">إتقان الموارد البشرية</span>
            <span className="block mt-2" style={{ color: "#FFFFFF" }}>والاستعداد لامتحان <span style={{ color: "#F59E0B" }}>SHRM</span></span>
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-xl lg:max-w-none mb-7 leading-relaxed">
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
            <Link to="/blog"><Button size="lg" variant="outline" className="border-blue-300/40 text-blue-100 hover:bg-blue-400/10">اقرأ المدونة</Button></Link>
          </div>
        </div>

        {/* مشاهد الدراسة مع كتب SHRM — صور أكبر وموضوعة أسفل قليلاً */}
        <div className="order-1 lg:order-2 flex justify-center mt-2 lg:mt-12">
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-4 rounded-[2.2rem] opacity-30 blur-3xl" style={{ background: "radial-gradient(circle at 50% 40%,#3B82F6 0%,transparent 70%)" }} />
            <div className="relative rounded-[1.75rem] border border-white/12 p-4 shadow-2xl backdrop-blur-sm" style={{ background: "linear-gradient(155deg,rgba(13,31,60,0.82),rgba(6,20,58,0.82))" }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 ring-1 ring-blue-400/30 rounded-2xl pointer-events-none z-10" />
                  <Image src={SCENE_F} className="w-full h-80 rounded-2xl object-cover" fittingType="fill" />
                </div>
                <div className="relative overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 ring-1 ring-yellow-400/30 rounded-2xl pointer-events-none z-10" />
                  <Image src={SCENE_M} className="w-full h-80 rounded-2xl object-cover" fittingType="fill" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mt-4 px-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <span className="text-white/80 text-xs font-medium">SHRM Learning System</span>
                </div>
                <span className="text-yellow-400 text-xs font-bold">منهج رسمي معتمد</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
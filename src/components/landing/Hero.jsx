import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SHRMLogo from "@/components/SHRMLogo";
import { ArrowLeft, GraduationCap, Award, BadgeCheck, Building2 } from "lucide-react";
import { JADARA_URL } from "@/data/brand";

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
      <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
        <div className="flex justify-center mb-6">
          <SHRMLogo size={76} showText={true} />
        </div>
        <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4" style={{ color: "#F59E0B", textShadow: "0 0 40px rgba(245,158,11,0.25)" }}>
          إتقان الموارد البشرية والاستعداد لامتحان SHRM
        </h1>
        <p className="text-blue-200 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          منصة تعليمية متكاملة بالعربية لتحضير شهادتي SHRM-CP و SHRM-SCP — فيديوهات، فلاش كاردز، ومحاكاة حقيقية للامتحان الرسمي.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {credentials.map((c, i) => {
            const inner = (
              <>
                <c.icon className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-right">{c.text}</span>
              </>
            );
            return c.href && c.href !== "#" ? (
              <a key={i} href={c.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-white/85 bg-white/5 rounded-xl px-3.5 py-2.5 border border-white/10 hover:border-yellow-400/40 hover:bg-white/10 transition-all">
                {inner}
              </a>
            ) : (
              <div key={i} className="flex items-center gap-2.5 text-sm text-white/85 bg-white/5 rounded-xl px-3.5 py-2.5 border border-white/10">
                {inner}
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/courses"><Button size="lg" className="text-black font-bold" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>ابدأ التعلّم الآن <ArrowLeft className="w-4 h-4 mr-1" /></Button></Link>
          <Link to="/blog"><Button size="lg" variant="outline" className="border-blue-400/40 text-blue-200 hover:bg-blue-500/10">اقرأ المدونة</Button></Link>
        </div>
      </div>
    </section>
  );
}
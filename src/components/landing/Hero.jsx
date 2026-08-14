import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { ArrowLeft, GraduationCap, Award, Medal, BadgeCheck } from "lucide-react";

const PHOTO = "https://media.base44.com/images/public/6a6dcc665d711f7ab11f51c9/bc2499f6c_WhatsAppImage2026-08-01at12947PM.jpeg";

const credentials = [
  { icon: GraduationCap, text: "ماجستير إدارة رأس المال البشري — جامعة بورتسموث" },
  { icon: Award, text: "شهادة SHRM-SCP المعتمدة" },
  { icon: Medal, text: "OTHM المستوى السابع" },
  { icon: BadgeCheck, text: "CMI المستوى السابع" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0d1f3c 0%,#1a2f50 40%,#0d1a35 100%)" }}>
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 70% 50%,#3B82F6 0%,transparent 60%)" }} />
      <div className="relative max-w-6xl mx-auto px-6 py-14 md:py-20 grid md:grid-cols-[auto_1fr] gap-10 items-center">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full opacity-30 blur-2xl" style={{ background: "radial-gradient(circle,#F59E0B,transparent 70%)" }} />
            <Image
              src={PHOTO}
              className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-full border-4 border-yellow-400/40 overflow-hidden relative"
              fittingType="fill"
            />
          </div>
        </div>
        <div className="text-center md:text-right">
          <span className="inline-block px-3 py-1 rounded-full text-xs text-yellow-300 mb-3" style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)" }}>
            منصة تعليمية معتمدة لتحضير SHRM
          </span>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-3" style={{ color: "#F59E0B", textShadow: "0 0 40px rgba(245,158,11,0.25)" }}>
            كامل إسماعيل
          </h1>
          <p className="text-blue-200 text-lg md:text-xl mb-5 font-medium">
            مدير رأس المال البشري · قائد استراتيجيات العمل
          </p>
          <div className="grid sm:grid-cols-2 gap-2.5 max-w-xl mb-6">
            {credentials.map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-white/80 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
                <c.icon className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-right">{c.text}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Link to="/courses"><Button size="lg" className="text-black font-bold" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>ابدأ التعلّم الآن <ArrowLeft className="w-4 h-4 mr-1" /></Button></Link>
            <Link to="/instructor-about"><Button size="lg" variant="outline" className="border-blue-400/40 text-blue-200 hover:bg-blue-500/10">تعرّف على المدرب</Button></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
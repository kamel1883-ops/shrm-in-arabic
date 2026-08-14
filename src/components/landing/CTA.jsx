import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CTA() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="relative overflow-hidden rounded-3xl border border-yellow-400/20 p-10 md:p-16 text-center" style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#0d1a35 60%,#4c1d95 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 20%,#F59E0B 0%,transparent 50%)" }} />
        <div className="relative">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">ابدأ رحلتك نحو اعتماد SHRM</h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">انضم إلى مئات المتخصّصين الذين حضّروا بمنصّتنا واجتازوا امتحان SHRM بثقة. رحلتك تبدأ بخطوة واحدة.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/courses"><Button size="lg" className="text-black font-bold" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>اشترك في دورة الآن <ArrowLeft className="w-4 h-4 mr-1" /></Button></Link>
            <Link to="/blog"><Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">اقرأ المدونة</Button></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
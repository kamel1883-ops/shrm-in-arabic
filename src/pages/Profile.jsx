import React from "react";
import { Link } from "react-router-dom";
import { Award, GraduationCap, Medal, Star, Briefcase, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import SHRMLogo from "@/components/SHRMLogo";

export default function Profile() {
  const credentials = [
    { icon: GraduationCap, title: "ماجستير إدارة رأس المال البشري", sub: "جامعة بورتسموث — تقدير جيد جداً", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
    { icon: Award, title: "SHRM-SCP", sub: "Senior Certified Professional in HR", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
    { icon: Medal, title: "OTHM — المستوى السابع", sub: "Human Resource Management", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
    { icon: Medal, title: "CMI — المستوى السابع", sub: "Strategic Management & Leadership", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
  ];

  const experiences = [
    { role: "مدير رأس المال البشري", years: "9 سنوات خبرة" },
    { role: "قائد استراتيجيات العمل", years: "استشارات مؤسسية" },
    { role: "مدرب معتمد SHRM", years: "تدريب وتطوير" },
  ];

  return (
    <div className="min-h-screen font-body" style={{ background: "linear-gradient(160deg,#0a0f1e 0%,#0d1a35 60%,#0a1628 100%)" }} dir="rtl">
      <header className="border-b border-white/10 sticky top-0 z-40" style={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <SHRMLogo size={40} showText={true} />
          </Link>
          <Link to="/" className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors">
            <ArrowRight className="w-4 h-4" /> الرئيسية
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="rounded-2xl border border-white/10 overflow-hidden mb-8" style={{ background: "linear-gradient(135deg,#0d1f3c,#1a2f50)" }}>
          <div className="flex flex-col md:flex-row items-center gap-8 p-8">
            <div className="relative shrink-0">
              <Image
                src="https://media.base44.com/images/public/6a6dcc665d711f7ab11f51c9/bc2499f6c_WhatsAppImage2026-08-01at12947PM.jpeg"
                className="w-36 h-36 rounded-full object-cover border-2 border-yellow-400/40 overflow-hidden"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-center md:text-right">
              <h1 className="font-heading text-4xl font-bold mb-2" style={{ color: "#F59E0B" }}>كامل إسماعيل</h1>
              <p className="text-blue-200 text-lg mb-4">مدير رأس المال البشري وقائد استراتيجيات العمل</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {["SHRM-SCP", "OTHM L7", "CMI L7", "MSc HRM"].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/20">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Credentials */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(13,26,53,0.7)" }}>
            <h2 className="font-heading text-white font-bold text-lg mb-5 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-yellow-400" /> المؤهلات العلمية والمهنية
            </h2>
            <div className="space-y-4">
              {credentials.map((c, i) => (
                <div key={i} className={`flex items-start gap-3 rounded-xl p-3 border ${c.bg}`}>
                  <c.icon className={`w-5 h-5 mt-0.5 shrink-0 ${c.color}`} />
                  <div>
                    <p className="text-white font-medium text-sm">{c.title}</p>
                    <p className="text-white/50 text-xs">{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(13,26,53,0.7)" }}>
            <h2 className="font-heading text-white font-bold text-lg mb-5 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-400" /> الخبرات المهنية
            </h2>
            <div className="space-y-4">
              {experiences.map((e, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl p-3 border border-white/10" style={{ background: "rgba(10,15,30,0.5)" }}>
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 text-xs font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{e.role}</p>
                    <p className="text-white/40 text-xs">{e.years}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl p-4 border border-yellow-400/20 bg-yellow-400/5">
              <p className="text-yellow-400 text-sm font-medium mb-1">نبذة تعريفية</p>
              <p className="text-white/70 text-xs leading-relaxed">
                متخصص في إدارة رأس المال البشري بخبرة واسعة في القطاعين العام والخاص. حاصل على أعلى الشهادات المهنية الدولية في مجال الموارد البشرية. يقدم برامج تدريبية متخصصة للتحضير لاختبارات SHRM-CP وSHRM-SCP.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
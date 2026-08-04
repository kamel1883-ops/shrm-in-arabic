import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, FileCheck, Lock, ArrowLeft, Play, Brain } from "lucide-react";
import { useLocalizedPrice, formatLocalizedPrice, COURSE_PRICES_SAR } from "@/utils/currency";

export default function HomeCourses() {
  const { currency } = useLocalizedPrice();
  const cards = [
    {
      certType: "SHRM-CP",
      type: "main",
      gradient: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)",
    },
    {
      certType: "SHRM-CP",
      type: "simulation",
      gradient: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
    },
  ];
  const courseTypes = [
    { key: "main", label: "دورة شاملة", icon: BookOpen, mainStats: [{ icon: Play, label: "فيديو", val: 10 }, { icon: Brain, label: "فلاش كارد", val: "100+" }, { icon: FileCheck, label: "اختبار", val: 10 }] },
    { key: "simulation", label: "محاكاة امتحان", icon: FileCheck, simStats: [{ label: "اختبارات", val: "10" }, { label: "سؤال/اختبار", val: "134" }, { label: "دقيقة", val: "230" }] },
  ];

  return (
    <div className="rounded-2xl border border-white/10 p-5" style={{ background: "rgba(13,26,53,0.7)" }}>
      <div className="flex items-center gap-2 mb-5">
        <span className="text-yellow-400 text-lg">📚</span>
        <h2 className="font-heading text-white font-bold text-lg">الدورات التعليمية</h2>
        <span className="text-white/30 text-xs mr-auto">SHRM-CP / SHRM-SCP</span>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Main course card */}
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-5" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/70 text-xs bg-white/10 px-2 py-0.5 rounded">دورة شاملة</span>
            </div>
            <h3 className="font-heading text-xl font-bold text-white mb-1">دورة SHRM-CP الشاملة</h3>
            <p className="text-white/70 text-xs leading-relaxed mb-3">محتوى تعليمي متكامل: 10 فيديوهات، 100+ فلاش كارد، 10 اختبارات وحدة + 10 امتحانات محاكاة كاملة (134 سؤال لكل امتحان).</p>
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="rounded-xl py-2 px-1 bg-white/10">
                <Play className="w-4 h-4 text-yellow-300 mx-auto mb-1" />
                <div className="text-sm font-bold text-white">10</div>
                <div className="text-xs text-white/50">فيديو</div>
              </div>
              <div className="rounded-xl py-2 px-1 bg-white/10">
                <Brain className="w-4 h-4 text-yellow-300 mx-auto mb-1" />
                <div className="text-sm font-bold text-white">100+</div>
                <div className="text-xs text-white/50">فلاش كارد</div>
              </div>
              <div className="rounded-xl py-2 px-1 bg-white/10">
                <FileCheck className="w-4 h-4 text-yellow-300 mx-auto mb-1" />
                <div className="text-sm font-bold text-white">10</div>
                <div className="text-xs text-white/50">امتحان</div>
              </div>
            </div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-2xl font-bold text-yellow-300">{formatLocalizedPrice(COURSE_PRICES_SAR["SHRM-CP"].main, currency).full}</span>
              <span className="text-xs text-white/40">وصول مدى الحياة</span>
            </div>
            <Link to="/courses">
              <button className="w-full py-2.5 rounded-lg text-sm font-semibold text-black" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
                اشترك الآن
              </button>
            </Link>
          </div>
        </div>

        {/* Exam simulation card */}
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-5" style={{ background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/70 text-xs bg-white/10 px-2 py-0.5 rounded">محاكاة امتحان</span>
            </div>
            <h3 className="font-heading text-xl font-bold text-white mb-1">محاكاة امتحان SHRM-CP</h3>
            <p className="text-white/70 text-xs leading-relaxed mb-3">10 اختبارات محاكاة كاملة للامتحان الرسمي — كل اختبار 134 سؤالاً و230 دقيقة، مع شرح كامل للإجابات بعد الانتهاء.</p>
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="rounded-xl py-2 px-1 bg-white/10">
                <div className="text-sm font-bold text-white">10</div>
                <div className="text-xs text-white/50">اختبارات</div>
              </div>
              <div className="rounded-xl py-2 px-1 bg-white/10">
                <div className="text-sm font-bold text-white">134</div>
                <div className="text-xs text-white/50">سؤال/اختبار</div>
              </div>
              <div className="rounded-xl py-2 px-1 bg-white/10">
                <div className="text-sm font-bold text-white">230</div>
                <div className="text-xs text-white/50">دقيقة</div>
              </div>
            </div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-2xl font-bold text-yellow-300">{formatLocalizedPrice(COURSE_PRICES_SAR["SHRM-CP"].simulation, currency).full}</span>
              <span className="text-xs text-white/40">وصول مدى الحياة</span>
            </div>
            <Link to="/courses">
              <button className="w-full py-2.5 rounded-lg text-sm font-semibold text-black" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
                اشترك الآن
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
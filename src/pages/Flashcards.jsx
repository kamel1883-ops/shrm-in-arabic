import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowRight, ArrowLeft, RotateCcw, CheckCircle, XCircle, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAMPLE_CARDS = [
  { front_text: "ما هو مفهوم SHRM-BoCK؟", back_text: "Body of Competency & Knowledge — إطار عمل SHRM الذي يحدد الكفاءات والمعارف اللازمة لمتخصصي الموارد البشرية" },
  { front_text: "ما الفرق بين SHRM-CP وSHRM-SCP؟", back_text: "SHRM-CP: للممارسين العمليين في الموارد البشرية. SHRM-SCP: للقادة الاستراتيجيين ذوي الخبرة العليا" },
  { front_text: "ما هي المجالات الأربعة الرئيسية في SHRM BoCK؟", back_text: "1. Organization (التنظيم) 2. People (الأفراد) 3. Workplace (بيئة العمل) 4. Competencies (الكفاءات)" },
  { front_text: "ما المقصود بـ HR Strategy؟", back_text: "خطة متكاملة تربط وظائف الموارد البشرية بالأهداف الاستراتيجية للمنظمة لتحقيق الميزة التنافسية" },
  { front_text: "ما مفهوم Talent Acquisition؟", back_text: "العملية الاستراتيجية لتحديد واستقطاب وتوظيف الكفاءات اللازمة لتحقيق أهداف المنظمة" },
  { front_text: "ما هو Employee Engagement؟", back_text: "مستوى الالتزام العاطفي والذهني للموظف تجاه منظمته وأهدافها، وله ارتباط مباشر بالإنتاجية" },
  { front_text: "ما المقصود بـ Total Rewards؟", back_text: "المنظومة الشاملة للمكافآت تشمل الراتب، المزايا، التطوير المهني، وبيئة العمل الإيجابية" },
  { front_text: "ما هو Workforce Planning؟", back_text: "تحليل وتوقع الاحتياجات المستقبلية من الكوادر البشرية وتطوير استراتيجيات لسد الفجوات" },
];

export default function Flashcards() {
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [unknown, setUnknown] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    base44.entities.FlashCard.list().then(data => {
      setCards(data.length > 0 ? data : SAMPLE_CARDS);
    }).catch(() => setCards(SAMPLE_CARDS));
  }, []);

  const card = cards[current];
  const progress = cards.length > 0 ? Math.round(((known.length + unknown.length) / cards.length) * 100) : 0;

  function handleKnow() {
    setKnown(p => [...p, current]);
    next();
  }
  function handleDontKnow() {
    setUnknown(p => [...p, current]);
    next();
  }
  function next() {
    setFlipped(false);
    if (current + 1 >= cards.length) setDone(true);
    else setCurrent(p => p + 1);
  }
  function restart() {
    setCurrent(0); setFlipped(false); setKnown([]); setUnknown([]); setDone(false);
  }

  return (
    <div className="min-h-screen font-body" style={{ background: "linear-gradient(160deg,#0a0f1e 0%,#0d1a35 60%,#0a1628 100%)" }} dir="rtl">
      <header className="border-b border-white/10 sticky top-0 z-40" style={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-yellow-400" />
            <span className="font-heading font-bold text-white">فلاش كاردز SHRM</span>
          </Link>
          <Link to="/" className="text-sm text-white/50 hover:text-white flex items-center gap-1">
            <ArrowRight className="w-4 h-4" /> رجوع
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {done ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="font-heading text-3xl font-bold text-white mb-3">أكملت جميع البطاقات!</h2>
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{known.length}</div>
                <div className="text-white/50 text-sm">أعرفها</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{unknown.length}</div>
                <div className="text-white/50 text-sm">تحتاج مراجعة</div>
              </div>
            </div>
            <Button onClick={restart} className="px-8" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#000" }}>
              <RotateCcw className="w-4 h-4 ml-2" /> إعادة المراجعة
            </Button>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-white/50 mb-2">
                <span>{current + 1} من {cards.length}</span>
                <span>{progress}% مكتمل</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "linear-gradient(90deg,#3B82F6,#F59E0B)" }} />
              </div>
            </div>

            {card && (
              <>
                {/* Card */}
                <div
                  className="cursor-pointer mb-6"
                  onClick={() => setFlipped(p => !p)}
                  style={{ perspective: "1000px" }}
                >
                  <div
                    className="relative w-full transition-transform duration-500"
                    style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", minHeight: 260 }}
                  >
                    {/* Front */}
                    <div
                      className="absolute inset-0 rounded-2xl border border-white/10 flex flex-col items-center justify-center p-8 text-center"
                      style={{ backfaceVisibility: "hidden", background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}
                    >
                      <div className="text-blue-200 text-xs mb-4 uppercase tracking-widest">السؤال — اضغط للكشف</div>
                      <p className="text-white font-heading text-2xl font-bold leading-relaxed">{card.front_text}</p>
                    </div>
                    {/* Back */}
                    <div
                      className="absolute inset-0 rounded-2xl border border-yellow-400/20 flex flex-col items-center justify-center p-8 text-center"
                      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(135deg,#1a3a1a,#1a4a1a)" }}
                    >
                      <div className="text-green-300 text-xs mb-4 uppercase tracking-widest">الإجابة</div>
                      <p className="text-white text-lg leading-relaxed">{card.back_text}</p>
                    </div>
                  </div>
                </div>

                {flipped && (
                  <div className="flex gap-4">
                    <Button onClick={handleDontKnow} variant="outline" className="flex-1 py-6 border-red-400/40 text-red-300 hover:bg-red-500/10">
                      <XCircle className="w-5 h-5 ml-2" /> تحتاج مراجعة
                    </Button>
                    <Button onClick={handleKnow} className="flex-1 py-6 bg-green-600 hover:bg-green-700 text-white">
                      <CheckCircle className="w-5 h-5 ml-2" /> أعرفها
                    </Button>
                  </div>
                )}
                {!flipped && (
                  <p className="text-center text-white/30 text-sm">اضغط على البطاقة لكشف الإجابة</p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
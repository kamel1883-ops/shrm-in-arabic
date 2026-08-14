import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowRight, ArrowLeft, RotateCcw, CheckCircle, XCircle, Brain, Lock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Flashcards() {
  const [cards, setCards] = useState([]);
  const [cert, setCert] = useState("");
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [unknown, setUnknown] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const u = await base44.auth.me();
        const email = (u.email || "").trim().toLowerCase();

        // 1) مشتريات الطالب المدفوعة
        const enrs = email
          ? await base44.entities.Enrollment.filter({ customer_email: email, payment_status: "paid" })
          : await base44.entities.Enrollment.filter({ user_id: u.id, payment_status: "paid" });
        const validEnrs = (enrs || []).filter(e => email && (e.customer_email || "").trim().toLowerCase() === email);

        // 2) ربط كل دورة بشهادتها
        const courses = await base44.entities.Course.list();
        const courseCert = {};
        courses.forEach(c => { courseCert[c.id] = c.certificate_type; });

        // شهادات الطالب (CP و/أو SCP) حسب ما اشتراه فقط
        const enrolledCourses = courses.filter(c => validEnrs.some(e => e.course_id === c.id));
        const myCerts = new Set(enrolledCourses.map(c => c.certificate_type));
        setCert([...myCerts].join(" / "));

        // 3) فلاش كاردز مخصّصة لشهادة الطالب فقط (لا خلط بين CP و SCP)
        const allCards = await base44.entities.FlashCard.list('-created_date', 1000);
        const mine = allCards.filter(c => courseCert[c.course_id] && myCerts.has(courseCert[c.course_id]));
        setCards(mine.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } catch (e) {
        console.error(e);
        setCards([]);
      }
      setLoading(false);
    })();
  }, []);

  const card = cards[current];
  const progress = cards.length > 0 ? Math.round(((known.length + unknown.length) / cards.length) * 100) : 0;

  function handleKnow() { setKnown(p => [...p, current]); next(); }
  function handleDontKnow() { setUnknown(p => [...p, current]); next(); }
  function next() {
    setFlipped(false);
    if (current + 1 >= cards.length) setDone(true);
    else setCurrent(p => p + 1);
  }
  function restart() { setCurrent(0); setFlipped(false); setKnown([]); setUnknown([]); setDone(false); }

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-700" /> فلاش كاردز
          </h1>
          <p className="text-gray-500 text-sm">
            {cert ? `مخصصة لشهادتك: ${cert}` : "مراجعة المصطلحات والمفاهيم"}
          </p>
        </div>
        <Link to="/dashboard">
          <Button variant="outline" size="sm"><ArrowRight className="w-4 h-4 ml-1" /> لوحتي</Button>
        </Link>
      </div>

      {cards.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
          {cert ? (
            <>
              <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-1">لا توجد فلاش كاردز متاحة لشهادة ({cert}) بعد</p>
              <p className="text-gray-400 text-sm">يتم إضافة البطاقات تدريجياً حسب الدورة المشتراة.</p>
            </>
          ) : (
            <>
              <Lock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-1">الفلاش كاردز متاحة لأصحاب الاشتراك</p>
              <p className="text-gray-400 text-sm mb-5">اشترك في دورة SHRM-CP أو SHRM-SCP للوصول إلى البطاقات المخصصة.</p>
              <Link to="/courses"><Button className="bg-blue-700 hover:bg-blue-800 text-white">تصفّح الدورات</Button></Link>
            </>
          )}
        </div>
      ) : done ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="font-heading text-3xl font-bold text-gray-900 mb-3">أكملت جميع البطاقات!</h2>
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{known.length}</div>
              <div className="text-gray-400 text-sm">أعرفها</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500">{unknown.length}</div>
              <div className="text-gray-400 text-sm">تحتاج مراجعة</div>
            </div>
          </div>
          <Button onClick={restart} className="px-8 bg-blue-700 hover:bg-blue-800 text-white">
            <RotateCcw className="w-4 h-4 ml-2" /> إعادة المراجعة
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{current + 1} من {cards.length}</span>
              <span>{progress}% مكتمل</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100">
              <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "linear-gradient(90deg,#1d4ed8,#1a3a6b)" }} />
            </div>
          </div>

          {card && (
            <>
              <div className="cursor-pointer mb-6" onClick={() => setFlipped(p => !p)} style={{ perspective: "1000px" }}>
                <div className="relative w-full transition-transform duration-500" style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", minHeight: 260 }}>
                  <div className="absolute inset-0 rounded-2xl border border-gray-200 flex flex-col items-center justify-center p-8 text-center" style={{ backfaceVisibility: "hidden", background: "linear-gradient(135deg,#1a3a6b,#1d4ed8)" }}>
                    <div className="text-blue-200 text-xs mb-4 uppercase tracking-widest">السؤال — اضغط للكشف</div>
                    <p className="text-white font-heading text-2xl font-bold leading-relaxed">{card.front_text}</p>
                  </div>
                  <div className="absolute inset-0 rounded-2xl border border-green-200 flex flex-col items-center justify-center p-8 text-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(135deg,#065f46,#047857)" }}>
                    <div className="text-green-200 text-xs mb-4 uppercase tracking-widest">الإجابة</div>
                    <p className="text-white text-lg leading-relaxed">{card.back_text}</p>
                  </div>
                </div>
              </div>

              {flipped ? (
                <div className="flex gap-4">
                  <Button onClick={handleDontKnow} variant="outline" className="flex-1 py-6 border-red-300 text-red-600 hover:bg-red-50">
                    <XCircle className="w-5 h-5 ml-2" /> تحتاج مراجعة
                  </Button>
                  <Button onClick={handleKnow} className="flex-1 py-6 bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="w-5 h-5 ml-2" /> أعرفها
                  </Button>
                </div>
              ) : (
                <p className="text-center text-gray-400 text-sm">اضغط على البطاقة لكشف الإجابة</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
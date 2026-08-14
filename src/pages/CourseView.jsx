import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Award, Play, FileCheck, Brain, ChevronLeft, ChevronRight, Lock, CheckCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ExamRunner from "@/components/ExamRunner";
import VideoLessonPlayer from "@/components/VideoLessonPlayer";
import { getLesson } from "@/data/courseLessons";

export default function CourseView() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [user, setUser] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeUnit, setActiveUnit] = useState(null);
  const [activeTab, setActiveTab] = useState("video");
  const [progress, setProgress] = useState([]);
  const [view, setView] = useState("units"); // units | exams
  const [openExam, setOpenExam] = useState(null); // exam number 1..10

  useEffect(() => {
    loadData();
  }, [courseId]);

  async function loadData() {
    setLoading(true);
    try {
      const [c, u, unitsData] = await Promise.all([
        base44.entities.Course.get(courseId),
        base44.auth.me().catch(() => null),
        base44.entities.Unit.filter({ course_id: courseId }),
      ]);
      setCourse(c);
      setUser(u);
      const sorted = unitsData.sort((a, b) => a.order - b.order);
      setUnits(sorted);
      if (sorted.length > 0) setActiveUnit(sorted[0]);

      if (u) {
        const enr = await base44.entities.Enrollment.filter({ user_id: u.id, course_id: courseId, payment_status: "paid" });
        setEnrolled(enr.length > 0);
        const prog = await base44.entities.UserProgress.filter({ user_id: u.id, course_id: courseId });
        setProgress(prog);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const isCompleted = (unitId, type) => progress.some(p => p.unit_id === unitId && p.progress_type === type);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
    </div>
  );

  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-body" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/courses" className="flex items-center gap-1 text-gray-500 hover:text-blue-700 text-sm transition-colors">
            <ChevronRight className="w-4 h-4" />
            الدورات
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-800 truncate">{course.title}</span>
          <div className="mr-auto flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{course.certificate_type}</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-blue-700 p-4">
              <h2 className="font-heading font-bold text-white text-sm">وحدات الدورة</h2>
              <p className="text-blue-200 text-xs mt-1">{units.length} وحدة</p>
            </div>
            <div className="divide-y divide-gray-100">
              {units.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => { setActiveUnit(unit); setActiveTab("video"); }}
                  className={`w-full text-right p-4 text-sm transition-colors ${activeUnit?.id === unit.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium leading-snug">{unit.title}</span>
                    <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${activeUnit?.id === unit.id ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {unit.order}
                    </span>
                  </div>
                  {isCompleted(unit.id, 'video_watched') && (
                    <div className="flex items-center gap-1 mt-1 text-green-600 text-xs">
                      <CheckCircle className="w-3 h-3" /> مكتملة
                    </div>
                  )}
                </button>
              ))}
              {units.length === 0 && (
                <div className="p-6 text-center text-gray-400 text-sm">لا توجد وحدات بعد</div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {!enrolled && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <Lock className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-sm">
                <span className="font-medium text-amber-800">أنت في وضع المعاينة. </span>
                <span className="text-amber-700">اشترك للوصول الكامل لجميع الوحدات والمحتوى.</span>
              </div>
              <Link to={`/checkout/${courseId}`} className="mr-auto shrink-0">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">اشترك الآن</Button>
              </Link>
            </div>
          )}

          {/* Mode switcher */}
          <div className="flex items-center gap-2 mb-6 border border-gray-200 rounded-xl p-1 bg-white w-fit">
            <button
              onClick={() => { setView("units"); setOpenExam(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${view === "units" ? "bg-blue-700 text-white" : "text-gray-500 hover:text-gray-800"}`}
            >
              محتوى الوحدات
            </button>
            <button
              onClick={() => { setView("exams"); setOpenExam(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${view === "exams" ? "bg-blue-700 text-white" : "text-gray-500 hover:text-gray-800"}`}
            >
              الامتحانات الكاملة (10)
            </button>
          </div>

          {view === "exams" ? (
            openExam ? (
              <ExamRunner
                examNumber={openExam}
                durationMinutes={230}
                feedbackMode="instant"
                certType={course.certificate_type}
                onBack={() => setOpenExam(null)}
              />
            ) : (
              <div>
                <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">الامتحانات الكاملة — {course.certificate_type}</h3>
                  <p className="text-gray-500 text-sm mb-4">10 امتحانات لكل امتحان 134 سؤالاً و230 دقيقة. وضع التعلم الفوري يُظهر النتيجة والشرح فور الإجابة على كل سؤال.</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <button
                        key={n}
                        onClick={() => setOpenExam(n)}
                        className="border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50 transition text-center"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                          <span className="text-blue-700 font-bold">{n}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-800">امتحان {n}</p>
                        <p className="text-xs text-gray-400">134 سؤال</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )
          ) : activeUnit ? (
            <>
              <div className="bg-white rounded-xl border border-gray-200 mb-4">
                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                  {[
                    { key: "video", label: "الفيديو", icon: Play },
                    { key: "quiz", label: "الاختبار", icon: FileCheck },
                    { key: "flashcards", label: "فلاش كاردز", icon: Brain },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-blue-700 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  <h2 className="font-heading text-xl font-bold text-gray-900 mb-4">
                    الوحدة {activeUnit.order}: {activeUnit.title}
                  </h2>
                  {activeTab === "video" && (
                    <VideoTab unit={activeUnit} enrolled={enrolled} user={user} courseId={courseId} certType={course.certificate_type} onComplete={loadData} />
                  )}
                  {activeTab === "quiz" && (
                    <QuizTab unit={activeUnit} enrolled={enrolled} user={user} courseId={courseId} onComplete={loadData} />
                  )}
                  {activeTab === "flashcards" && (
                    <FlashCardsTab unit={activeUnit} enrolled={enrolled} courseId={courseId} />
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    const idx = units.findIndex(u => u.id === activeUnit.id);
                    if (idx > 0) { setActiveUnit(units[idx - 1]); setActiveTab("video"); }
                  }}
                  disabled={units.findIndex(u => u.id === activeUnit.id) === 0}
                >
                  <ChevronRight className="w-4 h-4 ml-1" /> الوحدة السابقة
                </Button>
                <span className="text-sm text-gray-400">
                  {units.findIndex(u => u.id === activeUnit.id) + 1} / {units.length}
                </span>
                <Button
                  variant="outline"
                  onClick={() => {
                    const idx = units.findIndex(u => u.id === activeUnit.id);
                    if (idx < units.length - 1) { setActiveUnit(units[idx + 1]); setActiveTab("video"); }
                  }}
                  disabled={units.findIndex(u => u.id === activeUnit.id) === units.length - 1}
                >
                  الوحدة التالية <ChevronLeft className="w-4 h-4 mr-1" />
                </Button>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400">لا توجد وحدات متاحة حالياً</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function VideoTab({ unit, enrolled, user, courseId, certType, onComplete }) {
  const lesson = getLesson(certType, unit.order);
  return (
    <div>
      {unit.video_url ? (
        <div className="relative bg-black rounded-xl overflow-hidden mb-4" style={{ paddingTop: '56.25%' }}>
          <iframe
            src={unit.video_url}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      ) : lesson ? (
        <VideoLessonPlayer
          lesson={lesson}
          certType={certType}
          enrolled={enrolled}
          user={user}
          courseId={courseId}
          unitId={unit.id}
          onComplete={onComplete}
        />
      ) : (
        <div className="bg-gray-100 rounded-xl h-64 flex flex-col items-center justify-center mb-4 text-gray-400">
          <Play className="w-12 h-12 mb-2 opacity-40" />
          <p className="text-sm">الفيديو سيُضاف قريباً</p>
        </div>
      )}
      {unit.description && <p className="text-gray-600 text-sm leading-relaxed mb-4 mt-3">{unit.description}</p>}
    </div>
  );
}

function QuizTab({ unit, enrolled, user, courseId, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    base44.entities.Question.filter({ unit_id: unit.id, question_type: "unit_quiz" })
      .then(q => setQuestions(q))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [unit.id]);

  async function handleSubmit() {
    let correct = 0;
    questions.forEach(q => { if (answers[q.id] === q.correct_answer) correct++; });
    const sc = Math.round((correct / questions.length) * 100);
    setScore(sc);
    setSubmitted(true);
    if (user && enrolled) {
      await base44.entities.UserProgress.create({
        user_id: user.id,
        course_id: courseId,
        unit_id: unit.id,
        progress_type: "quiz_completed",
        quiz_score: sc,
        completed_at: new Date().toISOString(),
      });
      onComplete();
    }
  }

  if (!enrolled) return (
    <div className="text-center py-10 text-gray-400">
      <Lock className="w-8 h-8 mx-auto mb-2" />
      <p className="text-sm">اشترك للوصول إلى الاختبارات</p>
    </div>
  );
  if (loading) return <div className="h-32 flex items-center justify-center"><div className="w-6 h-6 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" /></div>;
  if (questions.length === 0) return <p className="text-center text-gray-400 py-10 text-sm">لا توجد أسئلة لهذه الوحدة بعد</p>;

  if (submitted) return (
    <div className="text-center py-8">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${score >= 70 ? 'bg-green-100' : 'bg-red-100'}`}>
        <span className={`text-2xl font-bold ${score >= 70 ? 'text-green-600' : 'text-red-600'}`}>{score}%</span>
      </div>
      <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">
        {score >= 70 ? "أحسنت! اجتزت الاختبار 🎉" : "حاول مرة أخرى"}
      </h3>
      <p className="text-gray-500 text-sm mb-6">{Math.round(score * questions.length / 100)} / {questions.length} إجابات صحيحة</p>
      <Button onClick={() => { setAnswers({}); setSubmitted(false); }} variant="outline">إعادة الاختبار</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {questions.map((q, i) => (
        <div key={q.id} className="border border-gray-100 rounded-xl p-4">
          <p className="font-medium text-gray-900 mb-3 text-sm leading-relaxed">
            <span className="text-blue-600 ml-1">{i + 1}.</span> {q.question_text}
          </p>
          <div className="space-y-2">
            {[['a', q.option_a], ['b', q.option_b], ['c', q.option_c], ['d', q.option_d]].map(([val, label]) => (
              <label
                key={val}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all text-sm ${answers[q.id] === val ? 'border-blue-400 bg-blue-50 text-blue-800' : 'border-gray-100 hover:border-gray-300 text-gray-700'}`}
              >
                <input type="radio" name={q.id} value={val} checked={answers[q.id] === val} onChange={() => setAnswers(prev => ({ ...prev, [q.id]: val }))} className="accent-blue-600" />
                <span className="font-medium text-blue-400 uppercase">{val})</span>
                {label}
              </label>
            ))}
          </div>
        </div>
      ))}
      <Button
        onClick={handleSubmit}
        disabled={Object.keys(answers).length < questions.length}
        className="w-full bg-blue-700 hover:bg-blue-800 text-white"
      >
        تسليم الاختبار
      </Button>
    </div>
  );
}

function FlashCardsTab({ unit, enrolled, courseId }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    base44.entities.FlashCard.filter({ unit_id: unit.id })
      .then(c => setCards(c.sort((a, b) => a.order - b.order)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [unit.id]);

  if (!enrolled) return (
    <div className="text-center py-10 text-gray-400">
      <Lock className="w-8 h-8 mx-auto mb-2" />
      <p className="text-sm">اشترك للوصول إلى الفلاش كاردز</p>
    </div>
  );
  if (loading) return <div className="h-32 flex items-center justify-center"><div className="w-6 h-6 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" /></div>;
  if (cards.length === 0) return <p className="text-center text-gray-400 py-10 text-sm">لا توجد فلاش كاردز لهذه الوحدة بعد</p>;

  const card = cards[current];

  return (
    <div className="text-center">
      <p className="text-sm text-gray-400 mb-4">{current + 1} / {cards.length}</p>
      <div
        onClick={() => setFlipped(!flipped)}
        className="relative cursor-pointer select-none"
        style={{ perspective: '1000px' }}
      >
        <div
          className={`relative transition-all duration-500 rounded-2xl p-10 min-h-48 flex items-center justify-center ${flipped ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-900'}`}
          style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          <div style={{ backfaceVisibility: 'hidden', position: 'absolute', width: '100%', padding: '2.5rem' }}>
            <p className="text-sm text-blue-400 mb-2 font-medium">السؤال</p>
            <p className="text-lg font-semibold leading-relaxed">{card.front_text}</p>
          </div>
          <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', width: '100%', padding: '2.5rem' }}>
            <p className="text-sm text-blue-200 mb-2 font-medium">الإجابة</p>
            <p className="text-lg font-semibold leading-relaxed">{card.back_text}</p>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2 mb-6">انقر على البطاقة لرؤية الإجابة</p>
      <div className="flex justify-center items-center gap-4">
        <Button variant="outline" onClick={() => { setCurrent(Math.max(0, current - 1)); setFlipped(false); }} disabled={current === 0}>
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button variant="outline" onClick={() => { setCurrent(Math.min(cards.length - 1, current + 1)); setFlipped(false); }} disabled={current === cards.length - 1}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
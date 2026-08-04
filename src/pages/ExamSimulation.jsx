import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, XCircle, Lock, AlertTriangle } from "lucide-react";
import { getExamQuestions } from "@/data/examQuestions";

const PERSONAL_PHOTO = "https://media.base44.com/images/public/6a6dcc665d711f7ab11f51c9/bc2499f6c_WhatsAppImage2026-08-01at12947PM.jpeg";

export default function ExamSimulation() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [examState, setExamState] = useState("intro");
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [examNumber, setExamNumber] = useState(1);
  const timerRef = useRef(null);

  useEffect(() => {
    loadData();
    return () => clearInterval(timerRef.current);
  }, [courseId]);

  async function loadData() {
    try {
      const [c, u] = await Promise.all([
        base44.entities.Course.get(courseId),
        base44.auth.me().catch(() => null),
      ]);
      setCourse(c);
      setUser(u);
      if (u) {
        const enr = await base44.entities.Enrollment.filter({ user_id: u.id, course_id: courseId, payment_status: "paid" });
        setEnrolled(enr.length > 0);
      }
      // Prefer DB if it has the full 134-question bank; otherwise use local bank
      const dbQs = await base44.entities.Question.filter({ course_id: courseId, question_type: "exam_simulation" });
      if (dbQs.length >= 134) {
        const shuffled = [...dbQs].sort(() => Math.random() - 0.5);
        setQuestions(shuffled.slice(0, 134));
      } else {
        // Local bank: 134 questions, shuffled differently per exam number
        setQuestions(getExamQuestions(examNumber));
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function startExam() {
    // Re-shuffle questions for the selected exam number
    const dbQs = await base44.entities.Question.filter({ course_id: courseId, question_type: "exam_simulation" });
    if (dbQs.length >= 134) {
      const shuffled = [...dbQs].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, 134));
    } else {
      setQuestions(getExamQuestions(examNumber));
    }
    setAnswers({});
    setFlagged(new Set());
    setCurrent(0);
    setTimeLeft(230 * 60);
    setExamState("running");
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); submitExam(); return 0; }
        return t - 1;
      });
    }, 1000);
  }

  function submitExam() {
    clearInterval(timerRef.current);
    // Score only counted for fully-answered questions; explanations revealed post-completion
    let correct = 0;
    questions.forEach(q => {
      const correctAns = q.correct_answer || q.correct;
      const userAns = answers[q.id];
      if (userAns === correctAns) correct++;
    });
    const score = Math.round((correct / questions.length) * 100);
    setResults({ correct, total: questions.length, score, examNumber });
    setExamState("review");
    if (user) {
      base44.entities.UserProgress.create({
        user_id: user.id, course_id: courseId,
        progress_type: "quiz_completed", quiz_score: score,
        completed_at: new Date().toISOString(),
      });
    }
  }

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const timeWarning = timeLeft < 600 && timeLeft > 0;
  const timeUrgent = timeLeft < 120 && timeLeft > 0;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="w-10 h-10 border-4 border-[#1a3a6b] border-t-blue-400 rounded-full animate-spin" />
    </div>
  );

  if (!course) return null;

  // ===== INTRO SCREEN — SHRM Official Style =====
  if (examState === "intro") return (
    <div className="min-h-screen font-body" style={{ background: "#f0f4f8" }} dir="rtl">
      {/* Top bar — SHRM Official Style */}
      <div className="bg-[#1a3a6b] text-white py-2 px-6 flex items-center justify-between text-xs">
        <span>SHRM Certification Exam</span>
        <span>{course.certificate_type} Practice Exam</span>
      </div>
      <header className="bg-white border-b-4 border-[#1a3a6b] px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#1a3a6b] rounded-lg flex flex-col items-center justify-center">
            <span className="text-white font-bold text-xs leading-none">S|HRM</span>
          </div>
          <div>
            <p className="font-bold text-[#1a3a6b] text-lg">SHRM in Arabic</p>
            <p className="text-gray-400 text-xs">شرم بالعربي — منصة التدريب والإعداد</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
          {/* Blue header */}
          <div className="bg-[#1a3a6b] px-8 py-6 text-white text-center">
            <p className="text-blue-200 text-sm mb-1">SHRM Certification · Practice Exam Package</p>
            <h1 className="font-heading text-2xl font-bold">{course.certificate_type} Practice Exam</h1>
            <p className="text-blue-200 text-sm mt-1">10 exams × 134 questions each</p>
          </div>

          <div className="px-8 py-8">
            {/* Exam number selector */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-right">
              <h3 className="font-bold text-[#1a3a6b] mb-3 text-sm">اختر رقم الاختبار (1 - 10)</h3>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {Array.from({ length: 10 }, (_, i) => (
                  <button key={i + 1} onClick={() => setExamNumber(i + 1)}
                    className={`py-2 rounded-lg text-sm font-semibold transition-colors ${examNumber === i + 1 ? "bg-[#1a3a6b] text-white" : "bg-white text-[#1a3a6b] border border-[#1a3a6b]/30 hover:bg-blue-50"}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-2">الاختبار الحالي: رقم {examNumber} — 134 سؤالاً · 230 دقيقة</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Number of Questions", val: 134 },
                { label: "Time Allowed", val: "3:50:00" },
                { label: "Passing Standard", val: "200-800" },
              ].map(item => (
                <div key={item.label} className="bg-[#f0f4f8] rounded-xl p-4 text-center border border-gray-200">
                  <div className="text-xl font-bold text-[#1a3a6b]">{item.val}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 text-right">
              <h3 className="font-bold text-[#1a3a6b] mb-3 text-sm">تعليمات الاختبار</h3>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>اقرأ كل سؤال بعناية قبل الإجابة</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>يمكنك تعليم الأسئلة للمراجعة لاحقاً</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>يمكنك التنقل بين الأسئلة بحرية</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>سيتوقف الاختبار تلقائياً عند انتهاء الوقت</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>اختر الإجابة الأفضل من بين الخيارات الأربعة</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span className="font-semibold text-[#1a3a6b]">عرض الإجابات الصحيحة والشرح الكامل يكون بعد إنهاء الاختبار بالكامل (134 سؤالاً)</span></li>
              </ul>
            </div>

            {!enrolled ? (
              <div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm text-amber-700">
                  <Lock className="w-4 h-4 shrink-0" />
                  يجب الاشتراك في الدورة للبدء
                </div>
                <Link to={`/checkout/${courseId}`}>
                  <button className="w-full py-3 rounded-xl font-semibold text-white" style={{ background: "#1a3a6b" }}>اشترك الآن</button>
                </Link>
              </div>
            ) : (
              <button
                onClick={startExam}
                className="w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #1a3a6b, #1d4ed8)" }}
              >
                بدء الاختبار الآن ← Start Exam
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ===== RESULTS SCREEN =====
  if (examState === "review") return (
    <div className="min-h-screen font-body" style={{ background: "#f0f4f8" }} dir="rtl">
      <div className="bg-[#1a3a6b] text-white py-2 px-6 text-xs flex justify-between">
        <span>SHRM {course.certificate_type} — Practice Exam Results</span>
        <Link to="/courses" className="underline text-blue-200">العودة للدورات</Link>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Score card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className={`w-36 h-36 rounded-full border-8 flex flex-col items-center justify-center shrink-0 ${results.score >= 70 ? 'border-green-400 bg-green-50' : 'border-red-300 bg-red-50'}`}>
              <span className={`text-4xl font-bold font-heading ${results.score >= 70 ? 'text-green-600' : 'text-red-500'}`}>{results.score}%</span>
              <span className={`text-xs font-medium ${results.score >= 70 ? 'text-green-500' : 'text-red-400'}`}>{results.score >= 70 ? 'PASSED' : 'NOT PASSED'}</span>
            </div>
            <div className="flex-1">
              <h2 className="font-heading text-2xl font-bold text-[#1a3a6b] mb-2">
                {results.score >= 70 ? "🎉 تهانينا! أداء ممتاز" : "للمزيد من المراجعة"}
              </h2>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-[#1a3a6b]">{results.correct}</div>
                  <div className="text-xs text-gray-500">إجابات صحيحة</div>
                </div>
                <div className="bg-red-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-red-500">{results.total - results.correct}</div>
                  <div className="text-xs text-gray-500">إجابات خاطئة</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-gray-700">{results.total}</div>
                  <div className="text-xs text-gray-500">إجمالي الأسئلة</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setAnswers({}); setFlagged(new Set()); setCurrent(0); setExamState("intro"); }}
                  className="px-5 py-2 rounded-xl border border-[#1a3a6b] text-[#1a3a6b] text-sm font-medium hover:bg-blue-50">
                  إعادة المحاولة
                </button>
                <Link to="/courses">
                  <button className="px-5 py-2 rounded-xl text-white text-sm font-medium" style={{ background: "#1a3a6b" }}>
                    العودة للدورات
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Answer review */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6">
          <h3 className="font-heading text-lg font-bold text-[#1a3a6b] mb-5 border-b pb-3">مراجعة الإجابات</h3>
          <div className="space-y-4">
            {questions.map((q, i) => {
              const correctAns = q.correct_answer || q.correct;
              const userAns = answers[q.id];
              const isCorrect = userAns === correctAns;
              return (
                <div key={q.id} className={`rounded-xl border p-4 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-start gap-3 mb-3">
                    {isCorrect
                      ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                    <p className="text-sm font-medium text-gray-800"><span className="text-gray-400 ml-1">{i + 1}.</span> {q.question_text || q.text}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mr-8 text-xs">
                    {[['a', q.option_a || q.options?.a], ['b', q.option_b || q.options?.b], ['c', q.option_c || q.options?.c], ['d', q.option_d || q.options?.d]].map(([val, label]) => (
                      <div key={val} className={`p-2 rounded-lg ${val === correctAns ? 'bg-green-100 text-green-700 font-semibold border border-green-300' : val === userAns && !isCorrect ? 'bg-red-100 text-red-600 border border-red-300' : 'text-gray-500 bg-white'}`}>
                        <span className="font-bold uppercase">{val})</span> {label}
                      </div>
                    ))}
                  </div>
                  {(q.explanation) && (
                    <div className="mr-8 mt-3 text-xs text-gray-600 bg-blue-50 rounded-lg p-2 border border-blue-100">
                      <span className="font-semibold text-blue-700">التفسير: </span>{q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  // ===== RUNNING EXAM — SHRM Official Environment =====
  const q = questions[current];
  const correctAnsKey = q?.correct_answer || q?.correct;
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = flagged.size;
  const unanswered = questions.length - answeredCount;

  return (
    <div className="min-h-screen font-body flex flex-col" style={{ background: "#f0f4f8" }} dir="rtl">
      {/* SHRM Top Bar */}
      <div className="bg-[#1a3a6b]">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded flex items-center justify-center">
              <span className="text-[#1a3a6b] font-bold text-xs">S|HRM</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">SHRM in Arabic</p>
              <p className="text-blue-300 text-xs">{course.certificate_type} Practice Exam</p>
            </div>
          </div>
          {/* Timer */}
          <div className={`flex items-center gap-2 px-5 py-2 rounded-xl font-mono font-bold text-lg ${timeUrgent ? 'bg-red-500 text-white' : timeWarning ? 'bg-yellow-400 text-gray-900' : 'bg-white/10 text-white'}`}>
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-white text-xs">الأسئلة المجاب عنها</p>
              <p className="text-blue-200 text-xs font-bold">{answeredCount} / {questions.length}</p>
            </div>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm transition-colors"
            >
              إنهاء الاختبار
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/20">
          <div className="h-full bg-yellow-400 transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="flex flex-1 max-w-6xl mx-auto w-full px-4 py-5 gap-5" dir="rtl">

        {/* Question Panel */}
        <main className="flex-1 min-w-0">
          {q && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Question header */}
              <div className="bg-[#1a3a6b] px-6 py-3 flex items-center justify-between">
                <span className="text-white text-sm font-semibold">
                  Section: {current < 34 ? 'Organization' : current < 68 ? 'People' : current < 102 ? 'Workplace' : 'Competencies'}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-blue-200 text-sm">Question {current + 1} of {questions.length}</span>
                  <button
                    onClick={() => {
                      const f = new Set(flagged);
                      f.has(q.id) ? f.delete(q.id) : f.add(q.id);
                      setFlagged(f);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${flagged.has(q.id) ? 'bg-yellow-400 text-gray-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    <Flag className="w-3 h-3" />
                    {flagged.has(q.id) ? 'Flagged' : 'Flag for Review'}
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-8">
                {/* Question text */}
                <div className="mb-7">
                  <p className="text-base md:text-lg font-semibold text-gray-900 leading-relaxed text-right">{q.question_text || q.text}</p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {[
                    ['a', q.option_a || q.options?.a],
                    ['b', q.option_b || q.options?.b],
                    ['c', q.option_c || q.options?.c],
                    ['d', q.option_d || q.options?.d],
                  ].map(([val, label]) => {
                    const isSelected = answers[q.id] === val;
                    return (
                      <label
                        key={val}
                        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all ${
                          isSelected
                            ? 'border-[#1a3a6b] bg-blue-50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-400 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 font-bold text-sm transition-all ${
                          isSelected ? 'bg-[#1a3a6b] border-[#1a3a6b] text-white' : 'border-gray-300 text-gray-400'
                        }`}>
                          {val.toUpperCase()}
                        </div>
                        <span className={`text-sm leading-relaxed flex-1 text-right ${isSelected ? 'text-[#1a3a6b] font-medium' : 'text-gray-700'}`}>{label}</span>
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={val}
                          checked={isSelected}
                          onChange={() => setAnswers(prev => ({ ...prev, [q.id]: val }))}
                          className="hidden"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Navigation footer */}
              <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50">
                <button
                  onClick={() => setCurrent(Math.max(0, current - 1))}
                  disabled={current === 0}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium disabled:opacity-40 hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" /> السابق
                </button>
                <span className="text-gray-400 text-sm">{current + 1} / {questions.length}</span>
                <button
                  onClick={() => setCurrent(Math.min(questions.length - 1, current + 1))}
                  disabled={current === questions.length - 1}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#1a3a6b] text-white text-sm font-medium disabled:opacity-40 hover:bg-[#1e4080] transition-colors"
                >
                  التالي <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Side Panel */}
        <aside className="w-56 shrink-0">
          {/* Progress summary */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-4">
            <p className="text-[#1a3a6b] font-bold text-sm mb-3">Exam Progress</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Answered</span>
                <span className="font-bold text-green-600">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Unanswered</span>
                <span className="font-bold text-red-500">{unanswered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Flagged</span>
                <span className="font-bold text-yellow-500">{flaggedCount}</span>
              </div>
            </div>
            <div className="mt-3 h-2 bg-gray-100 rounded-full">
              <div className="h-full bg-[#1a3a6b] rounded-full transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
            </div>
          </div>

          {/* Question Navigator */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <p className="text-[#1a3a6b] font-bold text-sm mb-3">Question Navigator</p>
            <div className="grid grid-cols-6 gap-1 max-h-80 overflow-y-auto">
              {questions.map((qItem, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                    i === current
                      ? 'bg-[#1a3a6b] text-white'
                      : answers[qItem.id]
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : flagged.has(qItem.id)
                          ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-1.5 text-xs text-gray-500">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#1a3a6b] inline-block" /> Current</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-100 border border-green-300 inline-block" /> Answered</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300 inline-block" /> Flagged</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-gray-100 inline-block" /> Not Answered</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl p-8 max-w-md w-full text-center" dir="rtl">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">إنهاء الاختبار؟</h3>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-600 space-y-1">
              <p>الأسئلة المجاب عنها: <span className="font-bold text-green-600">{answeredCount}</span></p>
              <p>الأسئلة غير المجاب عنها: <span className="font-bold text-red-500">{unanswered}</span></p>
              {flaggedCount > 0 && <p>الأسئلة المعلّمة: <span className="font-bold text-yellow-500">{flaggedCount}</span></p>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50">
                العودة للمراجعة
              </button>
              <button onClick={() => { setShowSubmitModal(false); submitExam(); }}
                className="flex-1 py-3 rounded-xl text-white text-sm font-bold"
                style={{ background: "#1a3a6b" }}>
                إنهاء وتسليم
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
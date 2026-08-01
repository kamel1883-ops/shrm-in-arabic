import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Award, Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, XCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ExamSimulation() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [examState, setExamState] = useState("intro"); // intro | running | review
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState(null);
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
      const qs = await base44.entities.Question.filter({ course_id: courseId, question_type: "exam_simulation" });
      setQuestions(qs);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  function startExam() {
    const duration = 230 * 60; // 230 minutes
    setTimeLeft(duration);
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
    let correct = 0;
    questions.forEach(q => { if (answers[q.id] === q.correct_answer) correct++; });
    const score = Math.round((correct / questions.length) * 100);
    setResults({ correct, total: questions.length, score });
    setExamState("review");
    if (user) {
      base44.entities.UserProgress.create({
        user_id: user.id,
        course_id: courseId,
        progress_type: "quiz_completed",
        quiz_score: score,
        completed_at: new Date().toISOString(),
      });
    }
  }

  const formatTime = (s) => `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
    </div>
  );

  if (!course) return null;

  // Intro Screen
  if (examState === "intro") return (
    <div className="min-h-screen bg-gray-50 font-body flex items-center justify-center px-4" dir="rtl">
      <div className="bg-white rounded-2xl border border-gray-200 p-10 max-w-lg w-full text-center shadow-sm">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Award className="w-8 h-8 text-blue-700" />
        </div>
        <Badge className="mb-4 bg-blue-100 text-blue-700 border-0">{course.certificate_type}</Badge>
        <h1 className="font-heading text-2xl font-bold text-gray-900 mb-3">{course.title}</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          محاكاة كاملة لامتحان {course.certificate_type} الرسمي. يشمل {questions.length} سؤالاً خلال 230 دقيقة.
        </p>
        <div className="grid grid-cols-3 gap-3 mb-8 text-center">
          {[
            { label: "عدد الأسئلة", val: questions.length || "150" },
            { label: "المدة", val: "230 د" },
            { label: "درجة النجاح", val: "70%" },
          ].map(item => (
            <div key={item.label} className="bg-gray-50 rounded-xl p-3">
              <div className="text-lg font-bold text-gray-900">{item.val}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
        {!enrolled ? (
          <div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm text-amber-700">
              <Lock className="w-4 h-4 shrink-0" />
              يجب الاشتراك في الدورة للبدء في محاكاة الامتحان
            </div>
            <Link to={`/checkout/${courseId}`}>
              <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white">اشترك الآن</Button>
            </Link>
          </div>
        ) : questions.length === 0 ? (
          <Button disabled className="w-full">الأسئلة ستُضاف قريباً</Button>
        ) : (
          <Button onClick={startExam} className="w-full bg-blue-700 hover:bg-blue-800 text-white py-5 text-base font-semibold">
            ابدأ الامتحان
          </Button>
        )}
        <Link to="/courses" className="block mt-4 text-sm text-blue-600 hover:text-blue-800">العودة للدورات</Link>
      </div>
    </div>
  );

  // Results Screen
  if (examState === "review") return (
    <div className="min-h-screen bg-gray-50 font-body" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm mb-8">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${results.score >= 70 ? 'bg-green-100' : 'bg-red-100'}`}>
            <span className={`text-3xl font-bold font-heading ${results.score >= 70 ? 'text-green-600' : 'text-red-600'}`}>{results.score}%</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
            {results.score >= 70 ? "تهانينا! نجحت في الامتحان 🎉" : "لم تجتز الحد الأدنى"}
          </h2>
          <p className="text-gray-500 mb-6">{results.correct} من {results.total} إجابة صحيحة</p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => { setAnswers({}); setFlagged(new Set()); setCurrent(0); setExamState("intro"); }} variant="outline">
              إعادة المحاولة
            </Button>
            <Link to="/courses"><Button className="bg-blue-700 hover:bg-blue-800 text-white">العودة للدورات</Button></Link>
          </div>
        </div>

        {/* Answer Review */}
        <h3 className="font-heading text-lg font-bold text-gray-900 mb-4">مراجعة الإجابات</h3>
        <div className="space-y-4">
          {questions.map((q, i) => {
            const userAns = answers[q.id];
            const correct = userAns === q.correct_answer;
            return (
              <div key={q.id} className={`bg-white rounded-xl border p-4 ${correct ? 'border-green-200' : 'border-red-200'}`}>
                <div className="flex items-start gap-3 mb-3">
                  {correct ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                  <p className="text-sm font-medium text-gray-800 leading-relaxed"><span className="text-gray-400 ml-1">{i + 1}.</span> {q.question_text}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mr-8">
                  {[['a', q.option_a], ['b', q.option_b], ['c', q.option_c], ['d', q.option_d]].map(([val, label]) => (
                    <div key={val} className={`p-2 rounded-lg ${val === q.correct_answer ? 'bg-green-50 text-green-700 font-medium' : val === userAns && !correct ? 'bg-red-50 text-red-600' : 'text-gray-500'}`}>
                      <span className="font-bold uppercase">{val})</span> {label}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <div className="mr-8 mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-2 leading-relaxed">
                    <span className="font-medium text-gray-700">التفسير: </span>{q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Running Exam
  const q = questions[current];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50 font-body flex flex-col" dir="rtl">
      {/* Exam Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-medium">{course.certificate_type}</Badge>
          <span className="text-sm text-gray-500">{answeredCount}/{questions.length} أجابات</span>
        </div>
        <div className="flex items-center gap-2 text-blue-700 font-mono font-bold">
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
        <Button onClick={submitExam} size="sm" className="bg-blue-700 hover:bg-blue-800 text-white">
          إنهاء الامتحان
        </Button>
      </header>

      <div className="flex flex-1 max-w-5xl mx-auto w-full px-4 py-6 gap-6">
        {/* Question Navigator */}
        <aside className="w-48 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-3 sticky top-20">
            <p className="text-xs text-gray-400 mb-2 font-medium">التنقل السريع</p>
            <div className="grid grid-cols-5 gap-1">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-7 h-7 rounded text-xs font-medium transition-colors ${i === current ? 'bg-blue-700 text-white' : answers[questions[i].id] ? 'bg-green-100 text-green-700' : flagged.has(questions[i].id) ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-1 text-xs text-gray-400">
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 rounded inline-block" /> أجبت</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-100 rounded inline-block" /> مُعلَّم</div>
            </div>
          </div>
        </aside>

        {/* Question */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-medium text-gray-500">سؤال {current + 1} من {questions.length}</span>
              <button
                onClick={() => {
                  const f = new Set(flagged);
                  f.has(q.id) ? f.delete(q.id) : f.add(q.id);
                  setFlagged(f);
                }}
                className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition-colors ${flagged.has(q.id) ? 'border-yellow-300 bg-yellow-50 text-yellow-600' : 'border-gray-200 text-gray-400 hover:border-yellow-300 hover:text-yellow-500'}`}
              >
                <Flag className="w-3.5 h-3.5" /> {flagged.has(q.id) ? "مُعلَّم" : "تعليم"}
              </button>
            </div>
            <p className="text-base font-semibold text-gray-900 leading-relaxed mb-6">{q.question_text}</p>
            <div className="space-y-3">
              {[['a', q.option_a], ['b', q.option_b], ['c', q.option_c], ['d', q.option_d]].map(([val, label]) => (
                <label
                  key={val}
                  className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all ${answers[q.id] === val ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <input type="radio" name={`q-${q.id}`} value={val} checked={answers[q.id] === val} onChange={() => setAnswers(prev => ({ ...prev, [q.id]: val }))} className="accent-blue-600" />
                  <span className="font-bold text-blue-500 uppercase text-sm">{val}</span>
                  <span className="text-gray-700 text-sm leading-relaxed">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>
              <ChevronRight className="w-4 h-4 ml-1" /> السابق
            </Button>
            <Button variant="outline" onClick={() => setCurrent(Math.min(questions.length - 1, current + 1))} disabled={current === questions.length - 1}>
              التالي <ChevronLeft className="w-4 h-4 mr-1" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
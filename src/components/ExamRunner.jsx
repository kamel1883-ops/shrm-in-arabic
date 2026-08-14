import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, Clock, RotateCcw, ArrowRight } from "lucide-react";
import { getExamQuestions } from "@/data/examQuestions";

/* Unified exam runner — supports two feedback modes:
   - "instant": after answering each question, shows correct/wrong + explanation immediately, then skips forward.
   - "final":   no feedback until the end. Countdown timer + final score + full review. */
export default function ExamRunner({
  examNumber = 1,
  durationMinutes = 230,
  totalQuestions = 134,
  feedbackMode = "instant",
  certType = "SHRM-CP",
  onBack,
}) {
  const [phase, setPhase] = useState("intro"); // intro | running | done
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [instant, setInstant] = useState(null); // { selected, isCorrect } for current question
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const timerRef = useRef(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const fmt = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  function startExam() {
    const q = getExamQuestions(examNumber, certType);
    setQuestions(q);
    setCurrent(0);
    setAnswers({});
    setInstant(null);
    setScore(0);
    setTimeLeft(durationMinutes * 60);
    setPhase("running");
    if (feedbackMode === "final") {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); finishExam(true); return 0; }
          return t - 1;
        });
      }, 1000);
    }
  }

  function handleAnswer(key) {
    const q = questions[current];
    if (!q) return;
    if (feedbackMode === "instant") {
      if (instant) return; // already answered — locked
      const isCorrect = key === q.correct;
      setAnswers(prev => ({ ...prev, [q.id]: key }));
      setInstant({ selected: key, isCorrect, correctAnswer: q.correct, explanation: q.explanation });
    } else {
      setAnswers(prev => ({ ...prev, [q.id]: key }));
    }
  }

  function nextQuestion() {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      const nextQ = questions[current + 1];
      if (feedbackMode === "instant") {
        if (answers[nextQ.id]) {
          setInstant({ selected: answers[nextQ.id], isCorrect: answers[nextQ.id] === nextQ.correct, correctAnswer: nextQ.correct, explanation: nextQ.explanation });
        } else setInstant(null);
      }
    } else {
      finishExam(false);
    }
  }

  function prevQuestion() {
    if (current > 0) {
      setCurrent(current - 1);
      const prevQ = questions[current - 1];
      if (feedbackMode === "instant" && answers[prevQ.id]) {
        setInstant({ selected: answers[prevQ.id], isCorrect: answers[prevQ.id] === prevQ.correct, correctAnswer: prevQ.correct, explanation: prevQ.explanation });
      } else if (feedbackMode === "instant") {
        setInstant(null);
      }
    }
  }

  function finishExam() {
    clearInterval(timerRef.current);
    let correct = 0;
    questions.forEach(q => { if (answers[q.id] === q.correct) correct++; });
    setScore(correct);
    setPhase("done");
  }

  // ===== INTRO SCREEN =====
  if (phase === "intro") {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center" dir="rtl">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 mb-4">
          <Clock className="w-7 h-7 text-blue-700" />
        </div>
        <h3 className="font-heading text-xl font-bold text-gray-900 mb-1">
          امتحان {certType} الكامل — رقم {examNumber}
        </h3>
        <p className="text-gray-500 text-sm mb-5">
          {totalQuestions} سؤال · {durationMinutes} دقيقة · 4 خيارات لكل سؤال
        </p>

        <div className={`rounded-lg p-4 mb-6 text-right text-sm leading-relaxed ${feedbackMode === "instant" ? "bg-blue-50 border border-blue-200 text-blue-900" : "bg-purple-50 border border-purple-200 text-purple-900"}`}>
          {feedbackMode === "instant" ? (
            <>
              <strong className="block mb-1">وضع التعلم الفوري:</strong>
              عند الإجابة على كل سؤال تظهر النتيجة فوراً (إجابة صحيحة / خاطئة) مع عرض الإجابة الصحيحة والشرح المفصّل، ثم تنتقل إلى السؤال التالي.
            </>
          ) : (
            <>
              <strong className="block mb-1">وضع المحاكاة الرسمية:</strong>
              تشبه بيئة الامتحان الرسمي تماماً — لا تُظهر النتيجة إلا بعد انتهاء كامل الامتحان، مع مراجعة كاملة لكل الأسئلة والإجابات الصحيحة والشروحات.
            </>
          )}
        </div>

        <div className="flex justify-center gap-3">
          {onBack && <Button variant="outline" onClick={onBack}>رجوع</Button>}
          <Button onClick={startExam} className="bg-blue-700 hover:bg-blue-800 text-white">ابدأ الامتحان الآن</Button>
        </div>
      </div>
    );
  }

  // ===== DONE SCREEN =====
  if (phase === "done" && questions.length > 0) {
    const correct = score;
    const total = questions.length;
    const pct = Math.round((correct / total) * 100);
    const passed = pct >= 70;

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8" dir="rtl">
        <div className="text-center mb-8">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? "bg-green-100" : "bg-red-100"}`}>
            <span className={`text-3xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>{pct}%</span>
          </div>
          <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">
            {passed ? "أحسنت! اجتزت الامتحان 🎉" : "حاول مرة أخرى"}
          </h3>
          <p className="text-gray-500 text-sm">
            {correct} / {total} إجابة صحيحة · امتحان رقم {examNumber} · {certType}
          </p>
        </div>

        {/* Full review */}
        <div className="space-y-4 mb-8">
          {questions.map((q, i) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correct;
            return (
              <div key={q.id} className={`border rounded-lg p-4 ${isCorrect ? "border-green-200 bg-green-50" : userAnswer ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50"}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${isCorrect ? "bg-green-600" : "bg-red-600"}`}>
                    {isCorrect ? <CheckCircle className="w-5 h-5 text-white" /> : <XCircle className="w-5 h-5 text-white" />}
                  </div>
                  <p className="font-semibold text-gray-800 text-sm leading-relaxed">
                    <span className="text-blue-600 ml-1">{i + 1}.</span> {q.text}
                  </p>
                </div>
                <div className="space-y-1.5 mb-3">
                  {Object.entries(q.options).map(([key, val]) => {
                    const isAns = key === q.correct;
                    const isPicked = key === userAnswer;
                    const cls = isAns
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : isPicked
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : "bg-white text-gray-600 border border-gray-100";
                    return (
                      <div key={key} className={`flex items-center gap-2 p-2.5 rounded text-sm ${cls}`}>
                        <span className="font-bold uppercase shrink-0">{key})</span>
                        <span className="flex-1">{val}</span>
                        {isAns && <CheckCircle className="w-4 h-4 text-green-600" />}
                        {isPicked && !isAns && <XCircle className="w-4 h-4 text-red-600" />}
                      </div>
                    );
                  })}
                </div>
                {!isCorrect && userAnswer && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-900 mb-2">
                    <strong>الإجابة الصحيحة:</strong> {q.options[q.correct]}
                  </div>
                )}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
                  <strong>الشرح:</strong> {q.explanation}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-3">
          {onBack && <Button onClick={onBack} variant="outline">رجوع لقائمة الامتحانات</Button>}
          <Button onClick={startExam} className="bg-blue-700 hover:bg-blue-800 text-white">
            <RotateCcw className="w-4 h-4 ml-1" /> إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  // ===== RUNNING SCREEN =====
  if (phase === "running" && questions.length > 0) {
    const q = questions[current];
    const isFinal = feedbackMode === "final";
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6" dir="rtl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
          <div className="text-sm font-bold text-gray-700">
            السؤال {current + 1} / {questions.length}
          </div>
          {isFinal ? (
            <div className={`flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-lg ${timeLeft < 300 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
              <Clock className="w-4 h-4" />
              {fmt(timeLeft)}
            </div>
          ) : (
            <div className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded font-medium">وضع التعلم الفوري</div>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-blue-700 transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>

        {/* Question + Options */}
        <div className="mb-6">
          <p className="font-medium text-gray-900 mb-5 text-base leading-relaxed">{q.text}</p>
          <div className="space-y-2.5">
            {Object.entries(q.options).map(([key, val]) => {
              const selected = answers[q.id];
              const isSelected = selected === key;
              const isAns = q.correct === key;
              const showAns = !isFinal && instant && isAns;
              const showWrong = !isFinal && instant && isSelected && !isAns;

              let cls = "border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700";
              if (isFinal && isSelected) cls = "border-2 border-blue-500 bg-blue-50 text-blue-900";
              if (showAns) cls = "border-2 border-green-500 bg-green-50 text-green-900";
              if (showWrong) cls = "border-2 border-red-500 bg-red-50 text-red-900";

              return (
                <button
                  key={key}
                  onClick={() => handleAnswer(key)}
                  disabled={!isFinal && !!instant}
                  className={`w-full text-right flex items-center gap-3 p-3.5 rounded-lg border transition-all text-sm ${cls}`}
                >
                  <span className="font-bold uppercase shrink-0 w-5">{key})</span>
                  <span className="flex-1">{val}</span>
                  {showAns && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {showWrong && <XCircle className="w-5 h-5 text-red-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Instant feedback block */}
        {!isFinal && instant && (
          <div className={`border rounded-xl p-5 mb-5 ${instant.isCorrect ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
            <div className="flex items-center gap-2 mb-3">
              {instant.isCorrect
                ? <><CheckCircle className="w-6 h-6 text-green-600" /><span className="font-bold text-green-800 text-base">إجابة صحيحة! ✓</span></>
                : <><XCircle className="w-6 h-6 text-red-600" /><span className="font-bold text-red-800 text-base">إجابة خاطئة ✗</span></>}
            </div>
            {!instant.isCorrect && (
              <p className="text-sm text-gray-800 mb-2">
                <strong>الإجابة الصحيحة:</strong> {q.options[q.correct]}
              </p>
            )}
            <p className="text-sm text-gray-800 leading-relaxed">
              <strong>الشرح:</strong> {instant.explanation}
            </p>
          </div>
        )}

        {/* Navigation */}
        {isFinal || (instant && feedbackMode === "instant") ? (
          <div className="flex items-center justify-between gap-3">
            {isFinal ? (
              <Button variant="outline" onClick={prevQuestion} disabled={current === 0}>
                <ChevronRight className="w-4 h-4 ml-1" /> السابق
              </Button>
            ) : (
              feedbackMode === "instant" && current > 0 ? (
                <Button variant="ghost" onClick={prevQuestion} disabled={!instant}>
                  <ChevronRight className="w-4 h-4 ml-1" /> مراجعة السابق
                </Button>
              ) : <span />
            )}

            {isFinal && (
              <span className="text-xs text-gray-400">
                {answeredCount} / {questions.length} مُجاب
              </span>
            )}

            {!isFinal && instant ? (
              <Button onClick={nextQuestion} className="bg-blue-700 hover:bg-blue-800 text-white">
                {current < questions.length - 1 ? "السؤال التالي" : "إنهاء الامتحان"}
                <ChevronLeft className="w-4 h-4 mr-1" />
              </Button>
            ) : isFinal ? (
              current < questions.length - 1 ? (
                <Button variant="outline" onClick={nextQuestion}>
                  التالي <ChevronLeft className="w-4 h-4 mr-1" />
                </Button>
              ) : (
                <Button onClick={finishExam} className="bg-green-700 hover:bg-green-800 text-white">
                  تسليم الامتحان
                </Button>
              )
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  return null;
}
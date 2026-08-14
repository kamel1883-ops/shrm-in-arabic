import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, RotateCcw, Volume2, Pause, Play, Loader2, BookOpen, Clapperboard, ArrowRight } from "lucide-react";
import { getScenarios } from "@/data/scenarioBank";

/**
 * مكوّن تشغيل امتحان «السيناريو» (SJT) على نهج SHRM:
 * يعرض نصّ السيناريو ويقرؤه بالصوت (TTS)، ثم يطرح الأسئلة المربوطة به بنمط التعلم الفوري.
 */
export default function ScenarioExamRunner({ certType = "SHRM-CP", onBack }) {
  const scenarios = getScenarios(certType);
  const [phase, setPhase] = useState("intro"); // intro | running | done
  const [sIdx, setSIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [instant, setInstant] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [preparingAudio, setPreparingAudio] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioErr, setAudioErr] = useState("");
  const audioRef = useRef(null);

  // بناء قائمة مسطّحة من الأسئلة مع مرجع السيناريو
  const flat = scenarios.flatMap((sc) =>
    sc.questions.map((q) => ({ scenarioId: sc.id, scenarioTitle: sc.title, scenario: sc.scenario, question: q }))
  );
  const current = flat[qIdx];
  const currentScenario = scenarios[sIdx];

  const cacheKey = (scId) => `shrm_scn:${certType}:${scId}`;

  async function ensureScenarioAudio(scId, scText) {
    let url = null;
    try { url = localStorage.getItem(cacheKey(scId)); } catch {}
    if (url) { setAudioUrl(url); return url; }
    setPreparingAudio(true);
    setAudioErr("");
    try {
      const res = await base44.integrations.Core.GenerateSpeech({
        text: scText,
        voice: "storm",
        language_code: "ar",
      });
      url = res?.url;
      if (!url) throw new Error("no url");
      setAudioUrl(url);
      try { localStorage.setItem(cacheKey(scId), url); } catch {}
    } catch (e) {
      console.error(e);
      setAudioErr("تعذّر توليد الصوت. يمكنك المتابعة بالقراءة.");
    } finally {
      setPreparingAudio(false);
    }
    return url;
  }

  // عند الانتقال لسيناريو جديد جهّز صوته
  useEffect(() => {
    if (phase !== "running" || !currentScenario) return;
    setAudioUrl("");
    setPlaying(false);
    setAudioErr("");
    ensureScenarioAudio(currentScenario.id, currentScenario.scenario);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, sIdx]);

  // تشغيل/إيقاف الصوت
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing && audioUrl) a.play().catch(() => {});
    else if (!playing) a.pause();
  }, [playing, audioUrl]);

  function startExam() {
    setSIdx(0);
    setQIdx(0);
    setAnswers({});
    setInstant(null);
    setPhase("running");
  }

  function handleAnswer(key) {
    const q = current.question;
    if (!q || instant) return;
    const isCorrect = key === q.correct;
    setAnswers((prev) => ({ ...prev, [q.id]: key }));
    setInstant({ selected: key, isCorrect, correctAnswer: q.correct, explanation: q.explanation });
  }

  function nextQuestion() {
    if (qIdx < flat.length - 1) {
      const nIndex = qIdx + 1;
      setQIdx(nIndex);
      const nextScId = flat[nIndex].scenarioId;
      if (nextScId !== current.scenarioId) {
        setSIdx(sIdx + 1);
      }
      const already = answers[flat[nIndex].question.id];
      setInstant(already ? { selected: already, isCorrect: already === flat[nIndex].question.correct, correctAnswer: flat[nIndex].question.correct, explanation: flat[nIndex].question.explanation } : null);
    } else {
      finishExam();
    }
  }

  function prevQuestion() {
    if (qIdx > 0) {
      const pIndex = qIdx - 1;
      setQIdx(pIndex);
      if (flat[pIndex].scenarioId !== current.scenarioId) {
        setSIdx(sIdx - 1);
      }
      const already = answers[flat[pIndex].question.id];
      setInstant(already ? { selected: already, isCorrect: already === flat[pIndex].question.correct, correctAnswer: flat[pIndex].question.correct, explanation: flat[pIndex].question.explanation } : null);
    }
  }

  function finishExam() {
    // إيقاف أي صوت
    setPlaying(false);
    setPhase("done");
  }

  function toggleAudio() {
    if (!audioUrl && !preparingAudio) {
      ensureScenarioAudio(currentScenario.id, currentScenario.scenario).then((u) => { if (u) setPlaying(true); });
      return;
    }
    setPlaying(!playing);
  }

  // ===== INTRO =====
  if (phase === "intro") {
    const totalQ = flat.length;
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center" dir="rtl">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 mb-4">
          <Clapperboard className="w-7 h-7 text-indigo-700" />
        </div>
        <h3 className="font-heading text-xl font-bold text-gray-900 mb-1">
          أسئلة السيناريو — {certType}
        </h3>
        <p className="text-gray-500 text-sm mb-5">
          {scenarios.length} سيناريو · {totalQ} سؤالاً · نهج الحكم الموقفي (SJT) لـ SHRM
        </p>
        <div className="rounded-lg p-4 mb-6 text-right text-sm leading-relaxed bg-indigo-50 border border-indigo-200 text-indigo-900">
          <strong className="block mb-1">كيف يعمل هذا المستوى؟</strong>
          يُعرض نصّ كل سيناريو ويُنطَق بالصوت العربي تلقائياً، ثم تُطرح الأسئلة المربوطة به. عند الإجابة تظهر النتيجة والشرح فوراً ضمن نمط التعلم، تماماً كما في امتحانات SHRM الرسمية.
        </div>
        <div className="flex justify-center gap-3">
          {onBack && <Button variant="outline" onClick={onBack}>رجوع</Button>}
          <Button onClick={startExam} className="bg-indigo-700 hover:bg-indigo-800 text-white">ابدأ أسئلة السيناريو</Button>
        </div>
      </div>
    );
  }

  // ===== DONE =====
  if (phase === "done") {
    let correct = 0;
    flat.forEach((f) => { if (answers[f.question.id] === f.question.correct) correct++; });
    const total = flat.length;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    const passed = pct >= 70;
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8" dir="rtl">
        <div className="text-center mb-8">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? "bg-green-100" : "bg-red-100"}`}>
            <span className={`text-3xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>{pct}%</span>
          </div>
          <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">{passed ? "أحسنت! اجتزت أسئلة السيناريو 🎉" : "حاول مرة أخرى"}</h3>
          <p className="text-gray-500 text-sm">{correct} / {total} إجابة صحيحة · {certType}</p>
        </div>
        <div className="space-y-4 mb-8">
          {flat.map((f, i) => {
            const q = f.question;
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correct;
            return (
              <div key={q.id} className={`border rounded-lg p-4 ${isCorrect ? "border-green-200 bg-green-50" : userAnswer ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50"}`}>
                <div className="text-xs text-indigo-700 font-medium mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> {f.scenarioTitle}
                </div>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${isCorrect ? "bg-green-600" : "bg-red-600"}`}>
                    {isCorrect ? <CheckCircle className="w-4 h-4 text-white" /> : <XCircle className="w-4 h-4 text-white" />}
                  </div>
                  <p className="font-semibold text-gray-800 text-sm leading-relaxed flex-1">{i + 1}. {q.text}</p>
                </div>
                <div className="space-y-1.5 mb-3">
                  {Object.entries(q.options).map(([key, val]) => {
                    const isAns = key === q.correct;
                    const isPicked = key === userAnswer;
                    const cls = isAns ? "bg-green-100 text-green-800 border border-green-200" : isPicked ? "bg-red-100 text-red-800 border border-red-200" : "bg-white text-gray-600 border border-gray-100";
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
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
                  <strong>الشرح:</strong> {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-3">
          {onBack && <Button onClick={onBack} variant="outline">رجوع لقائمة الامتحانات</Button>}
          <Button onClick={startExam} className="bg-indigo-700 hover:bg-indigo-800 text-white">
            <RotateCcw className="w-4 h-4 ml-1" /> إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  // ===== RUNNING =====
  if (!current) return null;
  const q = current.question;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6" dir="rtl">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
        <div className="text-sm font-bold text-gray-700">
          السؤال {qIdx + 1} / {flat.length}
        </div>
        <div className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded font-medium flex items-center gap-1.5">
          <Clapperboard className="w-3.5 h-3.5" /> السيناريو {sIdx + 1} / {scenarios.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-indigo-700 transition-all" style={{ width: `${((qIdx + 1) / flat.length) * 100}%` }} />
      </div>

      {/* Scenario panel */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 mb-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h4 className="font-heading font-bold text-indigo-900 text-sm flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> {current.scenarioTitle}
          </h4>
          <Button size="sm" variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-100" onClick={toggleAudio} disabled={preparingAudio}>
            {preparingAudio ? <Loader2 className="w-4 h-4 animate-spin" /> : playing ? <Pause className="w-4 h-4 ml-1" /> : <Play className="w-4 h-4 ml-1" />}
            {preparingAudio ? "تجهيز…" : playing ? "إيقاف" : "إقرأ السيناريو"}
          </Button>
        </div>
        <p className="text-indigo-900/80 text-sm leading-relaxed">{current.scenario}</p>
        {audioErr && <p className="text-amber-700 text-xs mt-2 flex items-center gap-1"><Volume2 className="w-3.5 h-3.5" /> {audioErr}</p>}
        <audio ref={audioRef} src={audioUrl || ""} onEnded={() => setPlaying(false)} className="hidden" />
      </div>

      {/* Question */}
      <div className="mb-5">
        <p className="font-medium text-gray-900 mb-4 text-base leading-relaxed">{q.text}</p>
        <div className="space-y-2.5">
          {Object.entries(q.options).map(([key, val]) => {
            const selected = answers[q.id];
            const isSelected = selected === key;
            const isAns = q.correct === key;
            const showAns = instant && isAns;
            const showWrong = instant && isSelected && !isAns;
            let cls = "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700";
            if (showAns) cls = "border-2 border-green-500 bg-green-50 text-green-900";
            if (showWrong) cls = "border-2 border-red-500 bg-red-50 text-red-900";
            return (
              <button key={key} onClick={() => handleAnswer(key)} disabled={!!instant}
                className={`w-full text-right flex items-center gap-3 p-3.5 rounded-lg border transition-all text-sm ${cls}`}>
                <span className="font-bold uppercase shrink-0 w-5">{key})</span>
                <span className="flex-1">{val}</span>
                {showAns && <CheckCircle className="w-5 h-5 text-green-600" />}
                {showWrong && <XCircle className="w-5 h-5 text-red-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Instant feedback */}
      {instant && (
        <div className={`border rounded-xl p-5 mb-5 ${instant.isCorrect ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
          <div className="flex items-center gap-2 mb-3">
            {instant.isCorrect
              ? <><CheckCircle className="w-6 h-6 text-green-600" /><span className="font-bold text-green-800 text-base">إجابة صحيحة! ✓</span></>
              : <><XCircle className="w-6 h-6 text-red-600" /><span className="font-bold text-red-800 text-base">إجابة خاطئة ✗</span></>}
          </div>
          {!instant.isCorrect && (
            <p className="text-sm text-gray-800 mb-2"><strong>الإجابة الصحيحة:</strong> {q.options[q.correct]}</p>
          )}
          <p className="text-sm text-gray-800 leading-relaxed"><strong>الشرح:</strong> {instant.explanation}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={prevQuestion} disabled={qIdx === 0 || !instant}>
          <ChevronRight className="w-4 h-4 ml-1" /> السابق
        </Button>
        <span className="text-xs text-gray-400">{answeredCount} / {flat.length} مُجاب</span>
        {instant ? (
          <Button onClick={nextQuestion} className="bg-indigo-700 hover:bg-indigo-800 text-white">
            {qIdx < flat.length - 1 ? "السؤال التالي" : "إنهاء"}
            <ChevronLeft className="w-4 h-4 mr-1" />
          </Button>
        ) : (
          <Button variant="outline" onClick={finishExam} className="border-gray-300 text-gray-500">
            <ArrowRight className="w-4 h-4" /> تخطّي وإنهاء
          </Button>
        )}
      </div>
    </div>
  );
}
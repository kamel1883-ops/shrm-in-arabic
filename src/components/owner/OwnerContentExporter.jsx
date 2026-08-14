import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { COURSE_LESSONS } from "@/data/courseLessons";
import { getBankForCert, EXAMS_PER_CERT } from "@/data/examQuestions";
import { downloadWordDoc, seededShuffle, esc } from "@/lib/wordExport";
import { Download, FileText, Eye, Loader2, Video, ClipboardList, AlertCircle } from "lucide-react";

const CERTS = ["SHRM-CP", "SHRM-SCP"];
const QUESTION_LABELS = { a: "أ", b: "ب", c: "ج", d: "د" };

function lessonToHtml(lesson, cert) {
  const slides = lesson.slides || [];
  let body = `<h1>${esc(lesson.title)}</h1>`;
  body += `<p><b>الشهادة:</b> ${esc(cert)} &nbsp;·&nbsp; <b>الدرس رقم:</b> ${esc(lesson.order)}</p>`;
  body += `<p><b>المدة التقريبية:</b> ${esc(lesson.duration_minutes || 20)} دقيقة</p>`;
  if (lesson.summary) body += `<p><b>ملخص:</b> ${esc(lesson.summary)}</p>`;
  body += `<hr/>`;
  slides.forEach((s, i) => {
    body += `<h2>الشريحة ${i + 1}: ${esc(s.heading)}</h2>`;
    if (s.bullets?.length) {
      s.bullets.forEach((b) => { body += `<p>• ${esc(b)}</p>`; });
    }
    if (s.narration) body += `<p><b>الشرح الصوتي:</b> ${esc(s.narration)}</p>`;
  });
  return body;
}

function examToHtml(examNumber, cert, questions) {
  let body = `<h1>الامتحان ${esc(examNumber)} — ${esc(cert)}</h1>`;
  body += `<p><b>عدد الأسئلة:</b> ${questions.length} &nbsp;·&nbsp; <b>المدة:</b> 4 ساعات &nbsp;·&nbsp; <b>النوع:</b> محاكاة رسمية</p>`;
  body += `<hr/>`;
  questions.forEach((q, i) => {
    const opts = q.options || { a: q.option_a, b: q.option_b, c: q.option_c, d: q.option_d };
    let block = `<div class="q"><p><b>السؤال ${i + 1}:</b> ${esc(q.text || q.question_text)}</p>`;
    ["a", "b", "c", "d"].forEach((k) => {
      const correct = q.correct === k;
      block += `<p>${QUESTION_LABELS[k]}) ${esc(opts[k] || "")}${correct ? ' <span class="correct">✓ الإجابة الصحيحة</span>' : ""}</p>`;
    });
    if (q.explanation) block += `<p><b>الشرح:</b> ${esc(q.explanation)}</p>`;
    block += `</div>`;
    body += block;
  });
  return body;
}

export default function OwnerContentExporter() {
  const [cert, setCert] = useState("SHRM-CP");
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [previewLesson, setPreviewLesson] = useState(null);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const list = await base44.entities.LessonContent.list("-generated_date", 100);
        const map = {};
        list.forEach((r) => { map[`${r.cert_type}-${r.lesson_order}`] = r; });
        if (active) setRecords(map);
      } catch (e) { console.error(e); }
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const lessons = COURSE_LESSONS[cert] || [];
  const bank = useMemo(() => getBankForCert(cert), [cert]);
  const exams = Array.from({ length: EXAMS_PER_CERT }, (_, i) => i + 1);

  function resolveLesson(lesson) {
    const rec = records[`${cert}-${lesson.order}`];
    if (rec?.status === "ready" && rec.slides?.length) {
      return { title: rec.title || lesson.title, summary: rec.summary || lesson.summary, duration_minutes: rec.duration_minutes || 20, slides: rec.slides };
    }
    return lesson; // الاحتياطي المختصر من courseLessons.js
  }

  function downloadLesson(lesson) {
    const key = `lesson-${cert}-${lesson.order}`;
    setDownloading(key);
    try {
      const full = resolveLesson(lesson);
      downloadWordDoc(`الدرس-${lesson.order}-${cert}.doc`, full.title, lessonToHtml(full, cert));
    } finally { setDownloading(null); }
  }

  function downloadExam(n) {
    const key = `exam-${cert}-${n}`;
    setDownloading(key);
    try {
      const questions = seededShuffle(bank, n).slice(0, Math.min(134, bank.length));
      downloadWordDoc(`الامتحان-${n}-${cert}.doc`, `الامتحان ${n} ${cert}`, examToHtml(n, cert, questions));
    } finally { setDownloading(null); }
  }

  function downloadAllLessons() {
    lessons.forEach((l, i) => setTimeout(() => downloadLesson(l), i * 600));
  }
  function downloadAllExams() {
    exams.forEach((n, i) => setTimeout(() => downloadExam(n), i * 600));
  }

  return (
    <div dir="rtl" className="space-y-6">
      {/* مفتاح الشهادة + إجراءات شاملة */}
      <div className="rounded-xl border border-white/10 p-4 flex items-center justify-between flex-wrap gap-3" style={{ background: "rgba(10,15,30,0.55)" }}>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-white/40 text-xs">الشهادة:</span>
          {CERTS.map((c) => (
            <button key={c} onClick={() => setCert(c)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition ${cert === c ? "border-yellow-400 text-black" : "border-white/15 text-white/60 hover:text-white"}`}
              style={cert === c ? { background: "linear-gradient(135deg,#F59E0B,#D97706)" } : { background: "rgba(255,255,255,0.04)" }}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" variant="outline" className="border-white/20 text-white/70 hover:bg-white/10" onClick={downloadAllLessons}>
            <Video className="w-4 h-4 ml-1" /> تحميل كل الدروس
          </Button>
          <Button size="sm" variant="outline" className="border-white/20 text-white/70 hover:bg-white/10" onClick={downloadAllExams}>
            <ClipboardList className="w-4 h-4 ml-1" /> تحميل كل الامتحانات
          </Button>
        </div>
      </div>

      {/* قسم الدروس / الفيديوهات */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Video className="w-5 h-5 text-yellow-400" />
          <h3 className="font-heading font-bold text-white text-base">الدروس التعليمية — {cert} ({lessons.length} درس)</h3>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-yellow-400 animate-spin" /></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {lessons.map((lesson) => {
              const rec = records[`${cert}-${lesson.order}`];
              const ready = rec?.status === "ready" && rec.slides?.length;
              const key = `lesson-${cert}-${lesson.order}`;
              return (
                <div key={lesson.order} className="rounded-lg border border-white/10 p-3 flex flex-col gap-2" style={{ background: "rgba(10,15,30,0.4)" }}>
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>{lesson.order}</span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-white/90 text-sm font-medium">{lesson.title}</h4>
                      <p className="text-white/35 text-xs mt-0.5 line-clamp-2">{lesson.summary}</p>
                      <p className={`text-xs mt-1 ${ready ? "text-green-400" : "text-white/40"}`}>
                        {ready ? `جاهز · ${rec.slides.length} شريحة · ~${rec.duration_minutes || 20} د` : "غير مولّد بعد (سيُصدّر النص الاحتياطي)"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-white/15 text-white/60 hover:bg-white/10 flex-1" onClick={() => setPreviewLesson(lesson)}>
                      <Eye className="w-4 h-4 ml-1" /> معاينة
                    </Button>
                    <Button size="sm" className="flex-1" disabled={downloading === key}
                      style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#000" }}
                      onClick={() => downloadLesson(lesson)}>
                      {downloading === key ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 ml-1" />} Word
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* قسم الامتحانات */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ClipboardList className="w-5 h-5 text-yellow-400" />
          <h3 className="font-heading font-bold text-white text-base">الامتحانات — {cert} ({exams.length} امتحانات · {bank.length} سؤالاً لكل امتحان)</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {exams.map((n) => {
            const key = `exam-${cert}-${n}`;
            return (
              <div key={n} className="rounded-lg border border-white/10 p-4 flex flex-col items-center gap-2" style={{ background: "rgba(10,15,30,0.4)" }}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(245,158,11,0.15)" }}>
                  <span className="text-yellow-400 font-bold text-lg">{n}</span>
                </div>
                <p className="text-white/70 text-xs text-center">امتحان {n}<br/>{bank.length} سؤالاً</p>
                <Button size="sm" className="w-full" disabled={downloading === key}
                  style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#000" }}
                  onClick={() => downloadExam(n)}>
                  {downloading === key ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4 ml-1" />} تحميل Word
                </Button>
              </div>
            );
          })}
        </div>
        <p className="text-white/30 text-xs mt-3 flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          كل ملف Word يحتوي الامتحان كاملاً (الأسئلة + الخيارات + الإجابة الصحيحة + الشرح) ضمن مستند واحد. ترتيب الأسئلة ثابت لكل رقم امتحان.
        </p>
      </div>

      {/* نافذة معاينة الدرس */}
      {previewLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }} onClick={() => setPreviewLesson(null)}>
          <div className="max-w-3xl w-full max-h-[85vh] overflow-y-auto rounded-2xl border border-white/15 p-6" style={{ background: "rgba(13,26,53,0.95)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-white text-lg">{resolveLesson(previewLesson).title}</h3>
              <button className="text-white/50 hover:text-white text-xl" onClick={() => setPreviewLesson(null)}>✕</button>
            </div>
            <p className="text-white/50 text-sm mb-4">{resolveLesson(previewLesson).summary}</p>
            <div className="space-y-4">
              {(resolveLesson(previewLesson).slides || []).map((s, i) => (
                <div key={i} className="rounded-lg border border-white/10 p-3" style={{ background: "rgba(6,14,30,0.6)" }}>
                  <h4 className="text-yellow-300 font-semibold text-sm">الشريحة {i + 1}: {s.heading}</h4>
                  {s.bullets?.length > 0 && (
                    <ul className="list-disc pr-5 mt-1 text-white/60 text-xs space-y-0.5">
                      {s.bullets.map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  )}
                  {s.narration && <p className="text-white/50 text-xs mt-2 leading-relaxed">{s.narration}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
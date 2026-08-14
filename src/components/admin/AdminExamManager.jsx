import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ClipboardList, FileCheck } from "lucide-react";
import { getBankForCert, getBankSize, EXAMS_PER_CERT } from "@/data/examQuestions";

/**
 * مدير الامتحانات — كل امتحان ينسب للدورة التي يتبع لها (CP أو SCP).
 * لكل دورة 10 امتحانات، كل امتحان يعرض 134 سؤالاً كاملاً مع الخيارات والإجابة الصحيحة والشرح.
 */
export default function AdminExamManager({ courses, selectedCourseId, setSelectedCourseId }) {
  const [openExam, setOpenExam] = useState(null);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const certType = selectedCourse?.certificate_type || "SHRM-CP";

  // بنك الأسئلة الخاص بشهادة الدورة المختارة (134 سؤالاً فريداً، بترتيب ثابت)
  const bank = useMemo(() => getBankForCert(certType), [certType]);
  const bankSize = bank.length || getBankSize(certType);
  const totalExams = EXAMS_PER_CERT; // 10
  const questionsPerExam = 134;

  return (
    <div className="space-y-4">
      {/* شريط الأدوات */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <select
            className="rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm"
            value={selectedCourseId || ""}
            onChange={e => { setSelectedCourseId(e.target.value); setOpenExam(null); }}
          >
            {courses.map(c => (
              <option key={c.id} value={c.id} className="bg-slate-800">
                {c.title} ({c.certificate_type})
              </option>
            ))}
          </select>
          <span className="text-white/40 text-sm">
            {totalExams} امتحانات · {questionsPerExam} سؤالاً لكل امتحان · بنك {certType}: {bankSize} سؤال فريد
          </span>
        </div>
      </div>

      {/* قائمة الامتحانات */}
      {openExam === null ? (
        <div>
          <div className="rounded-xl border border-white/10 p-5" style={{ background: "rgba(13,26,53,0.7)" }}>
            <div className="flex items-center gap-2 mb-1">
              <FileCheck className="w-4 h-4 text-yellow-400" />
              <h3 className="font-heading text-lg font-bold text-white">
                الامتحانات — {certType}
              </h3>
            </div>
            <p className="text-white/50 text-sm mb-4">
              كل امتحان يحتوي على {questionsPerExam} سؤالاً من بنك {certType}. كل امتحان منسوب للدورة المختارة.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Array.from({ length: totalExams }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setOpenExam(n)}
                  className="border border-white/10 rounded-xl p-4 hover:border-yellow-400/60 hover:bg-yellow-400/5 transition text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-yellow-400/15 flex items-center justify-center mx-auto mb-2">
                    <span className="text-yellow-400 font-bold">{n}</span>
                  </div>
                  <p className="text-sm font-medium text-white">امتحان {n}</p>
                  <p className="text-xs text-white/40">{questionsPerExam} سؤالاً</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 p-5" style={{ background: "rgba(13,26,53,0.7)" }}>
          <Button
            size="sm"
            variant="outline"
            className="border-white/20 text-white/70 hover:bg-white/10 mb-4"
            onClick={() => setOpenExam(null)}
          >
            <ChevronRight className="w-4 h-4 ml-1" /> رجوع لقائمة الامتحانات
          </Button>

          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-5 h-5 text-yellow-400" />
            <h3 className="font-heading text-xl font-bold text-white">
              امتحان {openExam} — {certType}
            </h3>
            <span className="text-white/40 text-sm">· {bank.length} سؤالاً</span>
          </div>

          <div className="space-y-3">
            {bank.map((q, i) => {
              const opts = q.options || { a: q.option_a, b: q.option_b, c: q.option_c, d: q.option_d };
              return (
                <div key={q.id || i} className="rounded-lg border border-white/10 p-4" style={{ background: "rgba(6,14,30,0.6)" }}>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-white/30 text-xs">#{i + 1} · {certType}</span>
                  </div>
                  <p className="text-white text-sm mb-3 font-medium">{q.text || q.question_text}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs">
                    {["a", "b", "c", "d"].map(k => (
                      <p
                        key={k}
                        className={
                          q.correct === k
                            ? "text-green-400 font-semibold"
                            : "text-white/40"
                        }
                      >
                        {k.toUpperCase()}. {opts[k]}
                        {q.correct === k && " ✓"}
                      </p>
                    ))}
                  </div>
                  {q.explanation && (
                    <p className="mt-2 text-xs text-yellow-200/70 bg-yellow-400/5 rounded px-2 py-1">
                      الشرح: {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
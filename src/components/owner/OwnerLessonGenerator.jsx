import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { COURSE_LESSONS } from "@/data/courseLessons";
import { Sparkles, RefreshCw, CheckCircle2, Loader2, Clock, AlertCircle } from "lucide-react";

/**
 * مولّد دروس الفيديو بالذكاء الاصطناعي — يُولّد لكل درس محتوى شرح كامل (~20 دقيقة)
 * مخصص حسب الشهادة (CP/SCP) ويخزّنه في LessonContent.
 * خاص بالمالك فقط؛ كل درس يولّد بإعادة واحدة ويُعاد توليده عند الحاجة.
 */
export default function OwnerLessonGenerator() {
  const [records, setRecords] = useState({});
  const [busy, setBusy] = useState(null); // `${cert}-${order}`
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const list = await base44.entities.LessonContent.list("-generated_date", 100);
      const map = {};
      list.forEach((r) => { map[`${r.cert_type}-${r.lesson_order}`] = r; });
      setRecords(map);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function generate(cert, lesson) {
    const key = `${cert}-${lesson.order}`;
    setBusy(key);
    setError("");
    try {
      const res = await base44.functions.invoke("generateLesson", {
        cert_type: cert,
        lesson_order: lesson.order,
        lesson_title: lesson.title,
        lesson_summary: lesson.summary,
      });
      if (res?.data?.error) throw new Error(res.data.error);
      await load();
    } catch (e) {
      console.error(e);
      setError(e.message || "تعذّر توليد الدرس");
    }
    setBusy(null);
  }

  const allLessons = [
    ...COURSE_LESSONS["SHRM-CP"].map((l) => ({ ...l, cert: "SHRM-CP" })),
    ...COURSE_LESSONS["SHRM-SCP"].map((l) => ({ ...l, cert: "SHRM-SCP" })),
  ];
  const readyCount = allLessons.filter((l) => records[`${l.cert}-${l.order}`]?.status === "ready").length;

  return (
    <div dir="rtl">
      <div className="rounded-xl border border-white/10 p-4 mb-5 flex items-center justify-between flex-wrap gap-3" style={{ background: "rgba(10,15,30,0.5)" }}>
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <div>
            <h3 className="font-heading font-bold text-white text-sm">دروس الفيديو (~20 دقيقة) — مولّدة بالذكاء الاصطناعي</h3>
            <p className="text-white/40 text-xs mt-0.5">المحتوى مخصّص لكل شهادة ويغطّي إطار SHRM Learning System.</p>
          </div>
        </div>
        <div className="text-yellow-400 font-bold text-sm">{readyCount} / {allLessons.length} جاهزة</div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 mb-4 flex items-center gap-2 text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-7 h-7 text-yellow-400 animate-spin" /></div>
      ) : (
        <div className="space-y-5">
          {["SHRM-CP", "SHRM-SCP"].map((cert) => (
            <div key={cert}>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)" }}>{cert}</span>
                <span className="text-white/30 text-xs">{COURSE_LESSONS[cert].length} دروس</span>
              </div>
              <div className="space-y-2">
                {COURSE_LESSONS[cert].map((lesson) => {
                  const key = `${cert}-${lesson.order}`;
                  const rec = records[key];
                  const ready = rec?.status === "ready";
                  const isBusy = busy === key;
                  return (
                    <div key={key} className="rounded-lg border border-white/10 p-3 flex items-center justify-between gap-3" style={{ background: "rgba(10,15,30,0.35)" }}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "rgba(255,255,255,0.06)", color: "#93c5fd" }}>{lesson.order}</span>
                          <h4 className="text-white/90 text-sm font-medium truncate">{lesson.title}</h4>
                        </div>
                        <p className="text-white/35 text-xs mt-1 truncate">{lesson.summary}</p>
                        {ready && (
                          <p className="flex items-center gap-2 text-green-400 text-xs mt-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> جاهز · {rec.slides?.length || 0} شريحة · ~{rec.duration_minutes || 20} دقيقة
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        disabled={isBusy}
                        onClick={() => generate(cert, lesson)}
                        className="shrink-0"
                        style={ready
                          ? { background: "transparent", border: "1px solid rgba(245,158,11,0.4)", color: "#F59E0B" }
                          : { background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#000" }}
                      >
                        {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : ready ? <RefreshCw className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                        <span className="mr-1">{isBusy ? "جارٍ التوليد..." : ready ? "إعادة توليد" : "توليد"}</span>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-white/30 text-xs mt-5 flex items-start gap-1.5">
        <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        التوليد يستخدم الذكاء الاصطناعي ويستهلك رصيد تكاملات لكل درس (نص + صوت). يُولّد كل درس مرة واحدة وتُخزّن الشرائح؛ يُنطق الصوت عند مشاهدة الطالب.
      </p>
    </div>
  );
}
import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import SHRMLogo from "@/components/SHRMLogo";
import { Button } from "@/components/ui/button";
import { Play, Pause, ChevronRight, ChevronLeft, Loader2, CheckCircle2, Volume2 } from "lucide-react";

/**
 * مشغّل درس فيديو مولّد: شرائح (شعار المنصة + عنوان + نقاط) + صوت عربي (TTS).
 * يُولِّد صوت كل شريحة عند التشغيل ويخزّن رابطه محلياً لتجنّب إعادة التوليد.
 * ينتقل تلقائياً بين الشرائح ويسجّل الإكمال عند انتهاء آخر شريحة.
 */
export default function VideoLessonPlayer({ lesson, certType, enrolled, user, courseId, unitId, onComplete }) {
  const slides = lesson?.slides || [];
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [audioUrls, setAudioUrls] = useState([]);
  const [preparing, setPreparing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [segDur, setSegDur] = useState(0);
  const [watched, setWatched] = useState(false);
  const [genError, setGenError] = useState("");
  const audioRef = useRef(null);

  const cacheKey = (i) => `shrm_aud:${certType}:${lesson?.order}:${i}`;

  // إعادة التهيئة عند تغيير الدرس
  useEffect(() => {
    if (!lesson) return;
    setIdx(0);
    setPlaying(false);
    setProgress(0);
    setSegDur(0);
    setWatched(false);
    setGenError("");
    const cached = slides.map((_, i) => {
      try { return localStorage.getItem(cacheKey(i)); } catch { return null; }
    });
    setAudioUrls(cached);
  }, [lesson?.order, certType]);

  async function ensureAudio(i) {
    if (audioUrls[i]) return audioUrls[i];
    try {
      const res = await base44.integrations.Core.GenerateSpeech({
        text: slides[i].narration,
        voice: "storm",
        language_code: "ar",
      });
      const url = res?.url;
      if (!url) throw new Error("no url");
      setAudioUrls((prev) => { const n = [...prev]; n[i] = url; return n; });
      try { localStorage.setItem(cacheKey(i), url); } catch {}
      return url;
    } catch (e) {
      console.error("TTS error", e);
      setGenError("تعذّر توليد الصوت. حاول مرة أخرى.");
      return null;
    }
  }

  // تشغيل/إيقاف الصوت عند توفره
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing && audioUrls[idx]) {
      a.play().catch(() => {});
    } else if (!playing) {
      a.pause();
    }
  }, [playing, idx, audioUrls]);

  async function togglePlay() {
    if (!playing) {
      if (!audioUrls[idx]) {
        setPreparing(true);
        await ensureAudio(idx);
        setPreparing(false);
      }
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }

  function handleEnded() {
    if (idx < slides.length - 1) {
      const ni = idx + 1;
      setIdx(ni);
      setProgress(0);
      setSegDur(0);
      if (!audioUrls[ni]) ensureAudio(ni);
    } else {
      setPlaying(false);
      markWatched();
    }
  }

  async function markWatched() {
    if (watched || !enrolled || !user) {
      setWatched(true);
      return;
    }
    setWatched(true);
    try {
      await base44.entities.UserProgress.create({
        user_id: user.id,
        course_id: courseId,
        unit_id: unitId,
        progress_type: "video_watched",
        completed_at: new Date().toISOString(),
      });
      onComplete && onComplete();
    } catch (e) { console.error(e); }
  }

  function next() {
    if (idx < slides.length - 1) { setIdx(idx + 1); setProgress(0); setSegDur(0); }
  }
  function prev() {
    if (idx > 0) { setIdx(idx - 1); setProgress(0); setSegDur(0); }
  }

  if (!lesson || slides.length === 0) {
    return (
      <div className="bg-gray-100 rounded-xl h-64 flex flex-col items-center justify-center mb-4 text-gray-400">
        <Play className="w-12 h-12 mb-2 opacity-40" />
        <p className="text-sm">الدرس غير متاح حالياً</p>
      </div>
    );
  }

  const slide = slides[idx];
  const ready = !!audioUrls[idx];
  const pct = segDur ? (progress / segDur) * 100 : 0;
  const allDone = idx === slides.length - 1 && !playing && watched;

  return (
    <div>
      {/* خشبة الفيديو */}
      <div
        className="relative rounded-2xl overflow-hidden border border-white/10 mb-4"
        style={{ aspectRatio: "16/9", background: "linear-gradient(160deg,#0a0f1e 0%,#0d1a35 55%,#0a1628 100%)" }}
      >
        {/* توهجات */}
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(circle at 12% 18%,rgba(59,130,246,0.22) 0%,transparent 45%), radial-gradient(circle at 88% 80%,rgba(245,158,11,0.18) 0%,transparent 45%)" }} />

        {/* شريط علوي: الشعار + الشهادة */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-between px-5 py-3 z-10">
          <SHRMLogo size={28} showText={false} />
          <span className="text-white/60 text-xs font-medium tracking-wide">{certType} · شرم بالعربي</span>
        </div>

        {/* محتوى الشريحة */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 md:px-16 z-10" dir="rtl">
          <div className="mb-4 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.35)" }}>
            <span className="text-yellow-400 font-bold text-sm">{idx + 1}</span>
          </div>
          <h3 className="font-heading font-bold mb-5" style={{ color: "#F59E0B", fontSize: "clamp(1.25rem,2.4vw,1.9rem)", lineHeight: 1.4 }}>
            {slide.heading}
          </h3>
          <ul className="space-y-2.5 max-w-2xl">
            {slide.bullets.map((b, i) => (
              <li key={i} className="text-white/85 text-sm md:text-base flex items-start justify-center gap-2">
                <span className="text-yellow-400 mt-1 shrink-0">◆</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* علامة ترقّم الشعار (علامة مائية) */}
        <div className="absolute bottom-3 right-4 z-10 opacity-30">
          <SHRMLogo size={30} showText={false} />
        </div>

        {/* مؤشّر الشرائح */}
        <div className="absolute bottom-3 left-4 z-10 flex items-center gap-1.5">
          {slides.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-yellow-400" : "w-1.5 bg-white/30"}`} />
          ))}
        </div>

        {/* إعداد/تحميل الصوت */}
        {preparing && !ready && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3" style={{ background: "rgba(10,15,30,0.75)" }}>
            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
            <p className="text-white/80 text-sm">جارٍ تجهيز صوت الشرح…</p>
          </div>
        )}

        {/* زر تشغيل وسطي عند التوقف وعدم وجود خطأ */}
        {!playing && !preparing && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 z-20 flex items-center justify-center group"
            aria-label="تشغيل الدرس"
          >
            <span className="w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-105" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
              <Play className="w-9 h-9 text-black mr-[-4px]" fill="black" />
            </span>
          </button>
        )}
      </div>

      {/* شريط التقدّم */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-amber-500 transition-all" style={{ width: `${(idx / slides.length) * 100 + (pct / slides.length)}%` }} />
      </div>

      {/* أدوات التحكّم */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <Button variant="outline" size="sm" onClick={prev} disabled={idx === 0}>
          <ChevronRight className="w-4 h-4 ml-1" /> السابق
        </Button>

        <div className="flex items-center gap-3">
          {playing ? (
            <Button size="icon" onClick={togglePlay} className="rounded-full h-11 w-11 text-black" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
              <Pause className="w-5 h-5" fill="black" />
            </Button>
          ) : (
            <Button size="icon" onClick={togglePlay} disabled={preparing} className="rounded-full h-11 w-11 text-black" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
              {preparing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" fill="black" />}
            </Button>
          )}
          <span className="text-xs text-gray-400 font-medium">
            شريحة {idx + 1} / {slides.length}
          </span>
        </div>

        <Button variant="outline" size="sm" onClick={next} disabled={idx === slides.length - 1}>
          التالي <ChevronLeft className="w-4 h-4 mr-1" />
        </Button>
      </div>

      {/* الحالة */}
      <div className="flex items-center gap-2 text-sm">
        {genError ? (
          <p className="text-red-500">{genError}</p>
        ) : allDone ? (
          <p className="text-green-600 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> تمّت مشاهدة الدرس بالكامل.</p>
        ) : (
          <p className="text-gray-400 flex items-center gap-1.5"><Volume2 className="w-4 h-4" /> شرح صوتي بالعربية — يُولَّد تلقائياً.</p>
        )}
      </div>

      {/* عنصر الصوت المخفي */}
      <audio
        key={idx}
        ref={audioRef}
        src={audioUrls[idx] || ""}
        onEnded={handleEnded}
        onTimeUpdate={(e) => { setProgress(e.currentTarget.currentTime || 0); setSegDur(e.currentTarget.duration || 0); }}
        className="hidden"
      />
    </div>
  );
}
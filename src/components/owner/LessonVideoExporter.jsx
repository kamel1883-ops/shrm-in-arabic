import { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Film, AlertCircle, X } from "lucide-react";

/**
 * يبني فيديو (MP4 إن أمكن، وإلا WebM) للدرس من شرائحه + الصوت العربي المولّد (TTS).
 * يرسم كل شريحة على Canvas 16:9 ويلتقط الصوت عبر Web Audio ثم يسجّل عبر MediaRecorder.
 * يعمل في المتصفّح في الوقت الحقيقي — يجب إبقاء النافذة مفتوحة حتى اكتمال التسجيل.
 */

function pickMime() {
  const opts = [
    "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
    "video/mp4;codecs=avc1,mp4a",
    "video/mp4",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  if (typeof window === "undefined" || !window.MediaRecorder) return "video/webm";
  for (const m of opts) {
    try { if (MediaRecorder.isTypeSupported(m)) return m; } catch {}
  }
  return "video/webm";
}

function wrapText(ctx, text, maxWidth) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

export default function LessonVideoExporter({ lesson, cert, onClose }) {
  const [phase, setPhase] = useState("idle"); // idle | audio | recording | done | error
  const [msg, setMsg] = useState("");
  const [step, setStep] = useState(0);
  const [total, setTotal] = useState(0);
  const [err, setErr] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [useMp4, setUseMp4] = useState(true);
  const canvasRef = useRef(null);

  const slides = lesson?.slides || [];
  const cacheKey = (i) => `shrm_aud:${cert}:${lesson?.order}:${i}`;

  async function ensureAllAudio() {
    const urls = [];
    setTotal(slides.length);
    for (let i = 0; i < slides.length; i++) {
      let url = null;
      try { url = localStorage.getItem(cacheKey(i)); } catch {}
      if (!url) {
        setMsg(`جارٍ توليد صوت الشريحة ${i + 1} من ${slides.length}…`);
        const res = await base44.integrations.Core.GenerateSpeech({
          text: slides[i].narration,
          voice: "storm",
          language_code: "ar",
        });
        url = res?.url;
        if (url) { try { localStorage.setItem(cacheKey(i), url); } catch {} }
      }
      urls.push(url);
      setStep(i + 1);
    }
    return urls;
  }

  function drawSlide(ctx, idx, W, H) {
    // الخلفية الكحلية المتدرّجة
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#0a0f1e");
    grad.addColorStop(0.55, "#0d1a35");
    grad.addColorStop(1, "#0a1628");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    // توهجات
    let r = ctx.createRadialGradient(W * 0.12, H * 0.18, 0, W * 0.12, H * 0.18, H * 0.6);
    r.addColorStop(0, "rgba(59,130,246,0.22)");
    r.addColorStop(1, "rgba(59,130,246,0)");
    ctx.fillStyle = r;
    ctx.fillRect(0, 0, W, H);
    r = ctx.createRadialGradient(W * 0.88, H * 0.82, 0, W * 0.88, H * 0.82, H * 0.6);
    r.addColorStop(0, "rgba(245,158,11,0.16)");
    r.addColorStop(1, "rgba(245,158,11,0)");
    ctx.fillStyle = r;
    ctx.fillRect(0, 0, W, H);

    // شريط علوي
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "600 22px Arial";
    ctx.textAlign = "left";
    ctx.fillText("شرم بالعربي", 40, 42);
    ctx.textAlign = "right";
    ctx.fillText(`${cert} · SHRM in Arabic`, W - 40, 42);

    // دائرة رقم الشريحة
    ctx.fillStyle = "rgba(245,158,11,0.15)";
    ctx.beginPath();
    ctx.arc(W / 2, 175, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(245,158,11,0.4)";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(String(idx + 1), W / 2, 178);

    const slide = slides[idx];
    try { ctx.direction = "rtl"; } catch {}

    // العنوان
    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 50px Arial";
    ctx.textAlign = "center";
    const hLines = wrapText(ctx, slide.heading, W - 220);
    let y = 290;
    hLines.forEach((l) => { ctx.fillText(l, W / 2, y); y += 62; });

    // النقاط
    if (slide.bullets?.length) {
      let by = y + 40;
      ctx.font = "32px Arial";
      slide.bullets.slice(0, 6).forEach((b) => {
        const lines = wrapText(ctx, b, W - 320);
        lines.forEach((l, j) => {
          const text = j === 0 ? "◆  " + l : l;
          ctx.fillStyle = "rgba(255,255,255,0.9)";
          ctx.fillText(text, W / 2, by);
          by += 44;
        });
        by += 14;
      });
    }

    // مؤشّر الشرائح (نقاط سفلية)
    ctx.textAlign = "center";
    const dotsY = H - 38;
    const total = slides.length;
    const gap = 16;
    const dotW = total > 14 ? 10 : 16;
    const totalW = total * dotW + (total - 1) * gap;
    let dx = (W - totalW) / 2;
    for (let i = 0; i < total; i++) {
      ctx.fillStyle = i === idx ? "#F59E0B" : "rgba(255,255,255,0.3)";
      ctx.beginPath();
      const w = i === idx ? dotW * 2.4 : dotW;
      if (ctx.roundRect) {
        ctx.roundRect(dx, dotsY - 3, w, 6, 3);
      } else {
        const rx = Math.min(3, w / 2);
        ctx.moveTo(dx + rx, dotsY - 3);
        ctx.arcTo(dx + w, dotsY - 3, dx + w, dotsY + 3, rx);
        ctx.arcTo(dx + w, dotsY + 3, dx, dotsY + 3, rx);
        ctx.arcTo(dx, dotsY + 3, dx, dotsY - 3, rx);
        ctx.arcTo(dx, dotsY - 3, dx + w, dotsY - 3, rx);
      }
      ctx.fill();
      dx += (i === idx ? w : dotW) + gap;
    }

    // تذييل
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillText("شرم بالعربي", 40, H - 24);
  }

  async function generate() {
    if (!slides.length) { setErr("لا توجد شرائح لهذا الدرس."); setPhase("error"); return; }
    setErr("");
    setVideoUrl("");
    setStep(0);
    setPhase("audio");
    try {
      const urls = await ensureAllAudio();
      if (urls.some((u) => !u)) throw new Error("تعذّر توليد الصوت لبعض الشرائح. حاول مجددًا.");

      const mime = pickMime();
      const isMp4 = mime.startsWith("video/mp4");
      setUseMp4(isMp4);

      setPhase("recording");
      setMsg("جارٍ تسجيل الفيديو… يُرجى إبقاء النافذة مفتوحة حتى الاكتمال.");

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      drawSlide(ctx, 0, 1280, 720);

      const vStream = canvas.captureStream(24);
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const aCtx = new AudioCtx();
      await aCtx.resume().catch(() => {});
      const dest = aCtx.createMediaStreamDestination();
      dest.stream.getAudioTracks().forEach((t) => vStream.addTrack(t));

      const rec = new MediaRecorder(vStream, { mimeType: mime, videoBitsPerSecond: 2000000 });
      const chunks = [];
      rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: mime });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setPhase("done");
        setMsg("");
        try { aCtx.close(); } catch {}
      };
      rec.start(1000);

      for (let i = 0; i < slides.length; i++) {
        drawSlide(ctx, i, 1280, 720);
        setMsg(`تسجيل الشريحة ${i + 1} من ${slides.length}…`);
        const a = new Audio();
        a.crossOrigin = "anonymous";
        a.src = urls[i];
        const mSource = aCtx.createMediaElementSource(a);
        mSource.connect(dest);
        try { await a.play(); } catch {}
        await new Promise((res) => { a.onended = () => res(); });
        await new Promise((r) => setTimeout(r, 500));
      }
      setTimeout(() => { try { rec.stop(); } catch {} }, 600);
    } catch (e) {
      console.error(e);
      setErr(e.message || "خطأ غير متوقع أثناء توليد الفيديو.");
      setPhase("error");
    }
  }

  function downloadVideo() {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `الدرس-${lesson.order}-${cert}.${useMp4 ? "mp4" : "webm"}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.78)" }} onClick={onClose}>
      <div className="max-w-2xl w-full rounded-2xl border border-white/15 p-6" style={{ background: "rgba(13,26,53,0.96)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-yellow-400" />
            <h3 className="font-heading font-bold text-white text-lg">توليد فيديو الدرس</h3>
          </div>
          <button className="text-white/50 hover:text-white text-xl" onClick={onClose}><X className="w-5 h-5" /></button>
        </div>

        <p className="text-white/60 text-sm mb-1">{lesson.title}</p>
        <p className="text-white/35 text-xs mb-4">{cert} · {slides.length} شريحة</p>

        <canvas ref={canvasRef} width={1280} height={720} className="w-full rounded-lg border border-white/10 mb-4" style={{ aspectRatio: "16/9" }} />

        {phase === "idle" && (
          <>
            <div className="rounded-lg border border-yellow-500/20 p-3 mb-4 text-xs text-white/55 leading-relaxed" style={{ background: "rgba(245,158,11,0.06)" }}>
              سيتم توليد الصوت العربي لكل شريحة (إن لم يكن مخزّنًا) ثم تسجيل فيديو يجمع الشرائح مع الصوت.
              يستغرق التسجيل وقتًا حقيقيًا تقريبًا مساويًا لمدة الدرس — يُرجى إبقاء هذه النافذة وتبويبها مفتوحًا حتى الاكتمال.
            </div>
            <Button className="w-full" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#000" }} onClick={generate}>
              <Film className="w-4 h-4 ml-1" /> ابدأ توليد الفيديو
            </Button>
          </>
        )}

        {phase === "audio" && (
          <div className="flex flex-col items-center gap-2 py-4">
            <Loader2 className="w-7 h-7 text-yellow-400 animate-spin" />
            <p className="text-white/70 text-sm">{msg || "جارٍ تجهيز الصوت…"}</p>
            {total > 0 && <p className="text-white/40 text-xs">{step} / {total} شريحة</p>}
          </div>
        )}

        {phase === "recording" && (
          <div className="flex flex-col items-center gap-2 py-4">
            <Loader2 className="w-7 h-7 text-red-400 animate-spin" />
            <p className="text-white/80 text-sm">{msg}</p>
            <p className="text-red-300 text-xs flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> لا تُغلق النافذة حتى ينتهي التسجيل.</p>
          </div>
        )}

        {phase === "done" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <video src={videoUrl} controls className="w-full rounded-lg border border-white/10 max-h-72" />
            <Button className="w-full" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#000" }} onClick={downloadVideo}>
              <Download className="w-4 h-4 ml-1" /> تحميل الفيديو ({useMp4 ? "MP4" : "WebM"})
            </Button>
            {!useMp4 && (
              <p className="text-white/40 text-xs text-center">متصفّحك لا يدعم تسجيل MP4 مباشرةً؛ تم إنتاج WebM (قابل للتشغيل في معظم المشغّلات وإعادة ترميزه إلى MP4 إن لزم).</p>
            )}
          </div>
        )}

        {phase === "error" && (
          <div className="flex flex-col items-center gap-2 py-4">
            <AlertCircle className="w-7 h-7 text-red-400" />
            <p className="text-red-300 text-sm text-center">{err}</p>
            <Button variant="outline" className="border-white/20 text-white/70" onClick={() => setPhase("idle")}>إعادة المحاولة</Button>
          </div>
        )}
      </div>
    </div>
  );
}
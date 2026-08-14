import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import pptxgen from "pptxgenjs";
import { Loader2, Download, Layers, AlertCircle } from "lucide-react";

/**
 * يصدّر فلاش كاردز دورة محدّدة كعرض تقديمي PowerPoint (.pptx):
 * شريحة غلاف + شريحة لكل بطاقة (السؤال أعلى + الإجابة أسفل) بتصميم كحلي/ذهبي موحّد.
 */
export default function FlashcardPptxExporter({ cert }) {
  const [courses, setCourses] = useState([]);
  const [selCourse, setSelCourse] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.Course.list("-created_date", 50);
        const cc = (list || []).filter(
          (c) => c.certificate_type === cert && c.course_type === "main"
        );
        setCourses(cc);
        if (cc[0]) setSelCourse(cc[0].id);
      } catch (e) { console.error(e); }
    })();
  }, [cert]);

  useEffect(() => {
    if (!selCourse) { setCards([]); return; }
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const all = await base44.entities.FlashCard.list("order", 500);
        const mine = (all || [])
          .filter((c) => c.course_id === selCourse)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        if (active) setCards(mine);
      } catch (e) { console.error(e); }
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, [selCourse]);

  async function exportPptx() {
    if (!cards.length) { setErr("لا توجد بطاقات لتصديرها لهذه الدورة."); return; }
    setErr("");
    setBusy(true);
    try {
      const pptx = new pptxgen();
      pptx.layout = "LAYOUT_16x9";
      pptx.rtlMode = true;
      pptx.author = "شرم بالعربي";
      pptx.title = `فلاش كاردز — ${cert}`;

      // شريحة الغلاف
      const cover = pptx.addSlide();
      cover.background = { color: "0A0F1E" };
      cover.addText("شرم بالعربي", { x: 0.6, y: 1.3, w: 8.8, h: 0.9, align: "center", fontSize: 42, bold: true, color: "F59E0B", fontFace: "Arial" });
      cover.addText(`فلاش كاردز — ${cert}`, { x: 0.6, y: 2.3, w: 8.8, h: 0.7, align: "center", fontSize: 28, color: "FFFFFF", fontFace: "Arial" });
      const cTitle = courses.find((c) => c.id === selCourse)?.title || cert;
      cover.addText(cTitle, { x: 1.2, y: 3.15, w: 7.6, h: 0.6, align: "center", fontSize: 18, color: "9DB4FF", fontFace: "Arial" });
      cover.addText(`${cards.length} بطاقة`, { x: 0.6, y: 3.9, w: 8.8, h: 0.5, align: "center", fontSize: 18, color: "FFFFFF", fontFace: "Arial" });

      cards.forEach((card, i) => {
        const s = pptx.addSlide();
        s.background = { color: "0D1A35" };
        // شارة الرقم
        s.addText(String(i + 1), { x: 4.3, y: 0.25, w: 1.4, h: 0.7, align: "center", valign: "middle", fontSize: 24, bold: true, color: "F59E0B", fill: { color: "1B2440" }, fontFace: "Arial" });
        // السؤال
        s.addText("السؤال", { x: 0.4, y: 1.1, w: 9.2, h: 0.4, align: "center", fontSize: 13, color: "9DB4FF", bold: true, fontFace: "Arial" });
        s.addText(card.front_text || "", { x: 0.4, y: 1.5, w: 9.2, h: 2.3, align: "center", valign: "middle", fontSize: 24, color: "FFFFFF", fontFace: "Arial" });
        // فاصل
        s.addShape(pptx.ShapeType.line, { x: 2.5, y: 4.0, w: 5, h: 0, line: { color: "F59E0B", width: 1.5 } });
        // الإجابة
        s.addText("الإجابة", { x: 0.4, y: 4.2, w: 9.2, h: 0.4, align: "center", fontSize: 13, color: "F59E0B", bold: true, fontFace: "Arial" });
        s.addText(card.back_text || "", { x: 0.4, y: 4.6, w: 9.2, h: 2.3, align: "center", valign: "middle", fontSize: 22, color: "E5E7EB", fontFace: "Arial" });
      });

      await pptx.writeFile({ fileName: `فلاش-كاردز-${cert}.pptx` });
    } catch (e) {
      console.error(e);
      setErr(e.message || "تعذّر تصدير العرض التقديمي.");
    } finally {
      setBusy(false);
    }
  }

  const selTitle = courses.find((c) => c.id === selCourse)?.title;

  return (
    <div>
      <div className="flex items-end gap-3 flex-wrap mb-3">
        <div className="flex-1 min-w-[200px]">
          <label className="text-white/50 text-xs mb-1 block">الدورة</label>
          <select
            value={selCourse}
            onChange={(e) => setSelCourse(e.target.value)}
            className="w-full h-9 rounded-md border border-white/15 bg-[#0a1530] text-white text-sm px-3"
          >
            {courses.length === 0 && <option value="">لا توجد دورات</option>}
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
        <Button
          className="border-0"
          style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#000" }}
          disabled={busy || loading || !cards.length}
          onClick={exportPptx}
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 ml-1" />}
          تحميل PowerPoint
        </Button>
      </div>

      <div className="flex items-center gap-2 text-xs text-white/45">
        <Layers className="w-4 h-4 text-yellow-400" />
        {loading ? "جارٍ تحميل البطاقات…" : (
          cards.length
            ? <>{cards.length} بطاقة {selTitle ? `· ${selTitle}` : ""} · شريحة لكل بطاقة + غلاف</>
            : "لا توجد بطاقات لهذه الدورة بعد."
        )}
      </div>

      {err && (
        <p className="text-red-400 text-xs mt-2 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" /> {err}
        </p>
      )}
    </div>
  );
}
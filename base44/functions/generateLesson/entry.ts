import { createClientFromRequest } from "npm:@base44/sdk@0.8.40";

/**
 * generateLesson — يولّد نص شرح كامل (~20 دقيقة) لدرس محدّد بالذكاء الاصطناعي
 * من إطار SHRM Learning System المخصص للشهادة (CP أو SCP)، ويخزّنه في LessonContent.
 * يُستدعى من لوحة المالك (admin) فقط.
 */
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const { cert_type, lesson_order, lesson_title, lesson_summary, force } = body || {};
    if (!cert_type || !lesson_order || !lesson_title) {
      return Response.json({ error: "missing fields" }, { status: 400 });
    }

    const existing = await base44.asServiceRole.entities.LessonContent.filter({
      cert_type,
      lesson_order,
    });
    if (existing.length && existing[0].status === "ready" && !force) {
      return Response.json({ lesson: existing[0], cached: true });
    }

    const prompt = [
      `أنت خبير أكاديمي معتمد في إعداد المحتوى التدريبي لاختبارات SHRM (${cert_type}).`,
      `ألّف درساً تعليمياً كاملاً يُلقّن باللغة العربية الفصحى، يستغرق نحو 20 دقيقة عند النطق الصوتي.`,
      `عنوان الدرس: "${lesson_title}".`,
      lesson_summary ? `الإطار العام للدرس: ${lesson_summary}` : "",
      `المطلوب:`,
      `1) المحتوى مبنٍّ حصراً على نطاق SHRM Learning System لشهادة ${cert_type} (وليس للشهادة الأخرى).`,
      `2) غطِّ الموضوع بعمق وشمول: المفاهيم، المبادئ، الممارسات، الأمثلة العملية، وربطها بمواقف الامتحان.`,
      `3) خاطب الطالب مباشرة بأسلوب محاضر محترف ومترابط.`,
      `4) أخرج JSON يحتوي: title (عنوان موجز)، slides (مصفوفة من 10 إلى 12 شريحة).`,
      `5) كل شريحة: { heading (عنوان قصير للعرض)، bullets (3-5 نقاط مختصرة تظهر على الشاشة)، narration (فقرة شرح تفصيلية بالعربية <= 4200 حرف) }.`,
      `6) مجوع نصوص narration يجب أن يقترب من 45000 حرف لتغطية ~20 دقيقة.`,
      `7) لا تكتب حرفاً غير عربي إلا المصطلحات الإنجليزية بين قوسين عند الحاجة.`,
    ].filter(Boolean).join("\n");

    const res = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: "gemini_3_flash",
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          slides: {
            type: "array",
            items: {
              type: "object",
              properties: {
                heading: { type: "string" },
                bullets: { type: "array", items: { type: "string" } },
                narration: { type: "string" },
              },
              required: ["heading", "narration"],
            },
          },
        },
        required: ["slides"],
      },
    });

    const slides = (Array.isArray(res?.slides) ? res.slides : [])
      .map((s) => ({
        heading: String(s.heading || s.title || "").slice(0, 200),
        bullets: (Array.isArray(s.bullets) ? s.bullets : []).map((b) => String(b).slice(0, 160)).slice(0, 6),
        narration: String(s.narration || "").slice(0, 4900),
      }))
      .filter((s) => s.narration.trim().length > 50);

    if (slides.length === 0) throw new Error("لم يُولّد المحرك أي محتوى صالح");

    const payload = {
      cert_type,
      lesson_order,
      title: lesson_title,
      summary: lesson_summary || "",
      slides,
      duration_minutes: 20,
      status: "ready",
      generated_at: new Date().toISOString(),
    };

    let lesson;
    if (existing.length) {
      lesson = await base44.asServiceRole.entities.LessonContent.update(existing[0].id, payload);
    } else {
      lesson = await base44.asServiceRole.entities.LessonContent.create(payload);
    }

    return Response.json({ lesson, slidesCount: slides.length });
  } catch (error) {
    console.error("generateLesson error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
import React from "react";
import { Star, Quote, User } from "lucide-react";

// آراء تمثيلية تعكس تجربة عامة لطلابنا —without attributing to real identifiable persons.
const TESTIMONIALS = [
  { tag: "SHRM-CP", role: "متدرّب اجتاز SHRM-CP من أول مرة", text: "محاكاة الامتحان كانت المفتاح — حليت الاختبارات التدريبية ووصلت للامتحان وأنا واثق. أسلوب المحاكاة مطابق للواقع." },
  { tag: "SHRM-SCP", role: "مختصة توظيف", text: "الشرح بالعربي وفّر عليّ وقتاً هائلاً. الفلاش كاردز ثبّتت كل المصطلحات الصعبة في ذاكرتي." },
  { tag: "HR Manager", role: "مدير موارد بشرية", text: "تقارير الأداء حسب المجالات كانت تُظهر لي بدقّة أين أضع وقت مذاكرتي. تجربة احترافية بكل المقاييس." },
  { tag: "HR Analyst", role: "محلّلة موارد بشرية", text: "متابعة الدروس والفلاش كاردز خلال شهرين رفعت ثقتي بالكفاءات القيادية بشكل ملحوظ." },
];

export default function Testimonials() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <p className="text-blue-400 text-sm font-medium mb-2">آراء طلابنا</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">قصص نجاح من خرّيجينا</h2>
        <p className="text-white/40 text-xs max-w-xl mx-auto">نماذج تعكس تجربة عامة لطلابنا — دون ذكر أسماء حقيقية حفاظاً على الخصوصية.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(13,26,53,0.5)" }}>
            <div className="flex items-center justify-between mb-3">
              <Quote className="w-8 h-8 text-yellow-400/40" />
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">{t.tag}</span>
            </div>
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-5">{t.text}</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}>
                <User className="w-5 h-5 text-white/80" />
              </div>
              <div>
                <p className="text-white/90 font-medium text-sm">{t.role}</p>
                <p className="text-white/35 text-xs">طالب / طالبة في المنصة</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
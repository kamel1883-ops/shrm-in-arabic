import React from "react";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  { name: "أحمد المطيري", role: "مختص توظيف", text: "محاكاة الامتحان كانت المفتاح — حليت 10 اختبارات قبله بيومين ووصلت للامتحان وأنا واثق. اجتزت SHRM-CP من أول مرة." },
  { name: "سارة العتيبي", role: "مديرة موارد بشرية", text: "الشرح بالعربي وفّر عليّ وقتاً هائلاً. الفلاش كاردز ثبّتت كل المصطلحات الصعبة في ذاكرتي." },
  { name: "خالد الشهري", role: "موظف HR", text: "تقارير الأداء حسب المجالات كانت تُظهر لي بدقة أين أضع وقت مذاكرتي. تجربة احترافية بكل المقاييس." },
  { name: "نورة القحطاني", role: "محلّلة HR", text: "دراسة 10 فيديوهات + 100 فلاش كارد خلال شهرين رفعت ثقتي بالكفاءات القيادية بشكل ملحوظ." },
];

export default function Testimonials() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-blue-400 text-sm font-medium mb-2">آراء الطلاب</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">قصص نجاح من خرّيجينا</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(13,26,53,0.5)" }}>
            <Quote className="w-8 h-8 text-yellow-400/40 mb-3" />
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-5">{t.text}</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}>
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{t.name}</p>
                <p className="text-white/40 text-xs">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
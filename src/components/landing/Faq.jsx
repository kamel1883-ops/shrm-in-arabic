import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "هل أحتاج خبرة سابقة في HR للتسجيل؟", a: "لا. الدورات تبدأ من الأساسيات وتتدرّج حتى المستوى الاستراتيجي. إلا أن امتحان SHRM الرسمي يشترط خبرة محددة لمنح الشهادة." },
  { q: "ما الفرق بين الدورة الشاملة ومحاكاة الامتحان؟", a: "الدورة الشاملة تشمل فيديوهات + فلاش كاردز + اختبارات وحدات + 10 امتحانات محاكاة. محاكاة الامتحان تقتصر على 10 اختبارات محاكاة كاملة فقط — لمن أتقن المحتوى ويريد التمرّن." },
  { q: "كم سؤالاً وكم دقيقة في كل امتحان محاكاة؟", a: "كل امتحان يحتوي 134 سؤالاً ومدته 230 دقيقة، مطابقاً لبنية امتحان SHRM الرسمي." },
  { q: "هل أحصل على شهادة إتمام؟", a: "المحاكاة تجعلك جاهزاً لامتحان SHRM الرسمي. شهادة SHRM نفسها تمنحها الجمعية بعد اجتياز الامتحان الرسمي." },
  { q: "هل أصل للمحتوى بعد الدفع مباشرة؟", a: "نعم. بعد الدفع تنشئ حساباً ببريد الدفع نفسه، تُفعَّل تلقائياً برمز OTP، فتدخل لوحة الطالب وتصل لكل المحتوى فوراً." },
  { q: "هل السعر يدفع مرة واحدة؟", a: "نعم، دفعة واحدة تمنحك وصولاً مدى الحياة دون أي اشتراك متجدّد." },
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-blue-400 text-sm font-medium mb-2">الأسئلة الشائعة</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">ما يهمّ معرفته قبل البدء</h2>
      </div>
      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <div key={i} className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "rgba(13,26,53,0.5)" }}>
            <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between gap-3 p-5 text-right">
              <span className="font-medium text-white text-sm">{f.q}</span>
              <ChevronDown className={`w-5 h-5 text-yellow-400 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="px-5 pb-5 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
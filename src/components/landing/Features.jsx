import React from "react";
import { Clock, Globe, BadgeCheck, LineChart, FileQuestion, GraduationCap } from "lucide-react";

const FEATURES = [
  { icon: BadgeCheck, title: "محاكاة حقيقية للامتحان", desc: "10 اختبارات محاكاة كاملة، كل اختبار 134 سؤالاً بـ230 دقيقة، تماماً كالامتحان الرسمي." },
  { icon: Globe, title: "شرح كامل بالعربية", desc: "محتوى تعليمي حصري باللغة العربية يغطّي كل مجالات SHRM Learning System." },
  { icon: LineChart, title: "تتبّع تقدم دقيق", desc: "تقارير أداء حسب المجالات (المنظمة، الأفراد، القيادة، الأعمال) لمعرفة نقاط قوتك وضعفك." },
  { icon: FileQuestion, title: "شروحات لكل إجابة", desc: "نُظهر لك الإجابة الصحيحة وسببها بعد كل امتحان — التعلّم من الخطأ أساس الإتقان." },
  { icon: Clock, title: "وصول مدى الحياة", desc: "ادفع مرة واحدة وتصل إلى المحتوى كاملاً للأبد، دون أي اشتراك متجدّد." },
  { icon: GraduationCap, title: "مدرب معتمد", desc: "إشراف حاصل على SHRM-SCP ودرجة الماجستير في إدارة رأس المال البشري." },
];

import { JADARA_URL } from "@/data/brand";
import { Building2, ArrowUpRight } from "lucide-react";

export default function Features() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-blue-400 text-sm font-medium mb-2">لماذا شرم بالعربي؟</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">منصّة بنيت خصيصاً لاجتياز SHRM</h2>
        <p className="text-white/50 max-w-2xl mx-auto">لا مجرد فيديوهات، بل نظام متكامل للتحضير يضمن فهمك العميق وتمرّنك على واقع الامتحان.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f, i) => (
          <div key={i} className="rounded-2xl border border-white/10 p-6 transition-all hover:border-yellow-400/30 hover:bg-white/5" style={{ background: "rgba(13,26,53,0.5)" }}>
            <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)" }}>
              <f.icon className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white mb-2">{f.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* منصة جدارة — ميزة مميزة */}
      <div className="mt-6 rounded-2xl border border-yellow-400/25 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5" style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.08),rgba(30,58,138,0.15))" }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
          <Building2 className="w-7 h-7 text-black" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-xl font-bold text-white mb-1">منصة جدارة لإدارة الموارد البشرية</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            منشأة على يد مؤسس «شرم بالعربي»، منصة جدارة بوابة عملية تكميلية لتطبيق استراتيجيات الموارد البشرية في بيئة العمل — امتداد تجريبي لما تتعلّمه هنا.
          </p>
        </div>
        {JADARA_URL && JADARA_URL !== "#" ? (
          <a href={JADARA_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl font-bold text-black text-sm shrink-0" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
            زيارة منصة جدارة <ArrowUpRight className="w-4 h-4" />
          </a>
        ) : (
          <span className="text-white/40 text-xs md:self-center shrink-0">رابط قريباً</span>
        )}
      </div>
    </section>
  );
}
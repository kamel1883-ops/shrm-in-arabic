import React from "react";
import { UserPlus, CreditCard, BadgeCheck, Rocket } from "lucide-react";

const STEPS = [
  { icon: Rocket, num: "01", title: "اختر دورتك", desc: "تصفّح دورات SHRM-CP أو SHRM-SCP واختر الشاملة أو محاكاة الامتحان." },
  { icon: CreditCard, num: "02", title: "أكمل الدفع ببريدك", desc: "ادفع بأمان عبر Stripe وأدخل بريدك الإلكتروني — سيربط دورتك بك لاحقاً." },
  { icon: UserPlus, num: "03", title: "أنشئ حسابك", desc: "بعد الدفع الناجح، أنشئ حساباً بالبريد نفسه وأكّده برمز OTP يصلك تلقائياً." },
  { icon: BadgeCheck, num: "04", title: "ابدأ التعلّم", desc: "ادخل لوحة الطالب وابدأ مباشرة: فيديوهات، فلاش كاردز، وامتحانات محاكاة." },
];

export default function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-blue-400 text-sm font-medium mb-2">كيف تبدأ؟</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">أربع خطوات بسيطة</h2>
        <p className="text-white/50 max-w-2xl mx-auto">من اختيار الدورة إلى أول امتحان محاكاة في أقل من عشر دقائق.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {STEPS.map((s, i) => (
          <div key={i} className="relative rounded-2xl border border-white/10 p-6" style={{ background: "rgba(13,26,53,0.5)" }}>
            <span className="absolute top-4 left-4 text-4xl font-bold text-white/5 font-heading">{s.num}</span>
            <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}>
              <s.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-heading text-base font-bold text-white mb-2">{s.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
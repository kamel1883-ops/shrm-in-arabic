import React from "react";

const DOMAINS = [
  { key: "organization", color: "#F59E0B", label: "المنظمة", labelEn: "ORGANIZATION", topics: ["بنية دالة HR", "الفعالية التنظيمية", "إدارة القوى العاملة", "علاقات الموظفين والعمال", "إدارة التقنية"] },
  { key: "people", color: "#3B82F6", label: "الأفراد", labelEn: "PEOPLE", topics: ["استراتيجية HR", "التوظيف", "الالتزام والاحتفاظ", "التدريب والتطوير", "المكافآت الشاملة"] },
  { key: "workplace", color: "#10B981", label: "بيئة العمل", labelEn: "WORKPLACE", topics: ["إدارة قوى عاملة عالمية", "إدارة المخاطر", "الإسناد الاجتماعي", "قوانين العمل"] },
  { key: "competencies", color: "#8B5CF6", label: "الكفاءات", labelEn: "COMPETENCIES", topics: ["القيادة والملاحة", "الممارسة الأخلاقية", "الشمول والتنوّع", "الحسّ التجاري", "الكفاءة التحليلية"] },
];

export default function LearningSystem() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-blue-400 text-sm font-medium mb-2">SHRM Learning System</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">المنهج الرسمي المتبع في التحضير</h2>
        <p className="text-white/50 max-w-2xl mx-auto">أربعة مجالات معرفية تتقاطع مع تسع كفاءات سلوكية — أساس كل سؤال في امتحان SHRM.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {DOMAINS.map(d => (
          <div key={d.key} className="rounded-2xl border border-white/10 p-5 hover:bg-white/5 transition-all" style={{ background: "linear-gradient(160deg,rgba(13,26,53,0.7),rgba(10,15,30,0.7))" }}>
            <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center" style={{ background: `${d.color}22`, border: `1px solid ${d.color}55` }}>
              <span className="text-lg" style={{ color: d.color }}>●</span>
            </div>
            <p className="text-white/40 text-xs mb-1" dir="ltr">{d.labelEn}</p>
            <h3 className="font-heading text-lg font-bold text-white mb-3">{d.label}</h3>
            <ul className="space-y-1.5">
              {d.topics.map(t => (
                <li key={t} className="flex items-start gap-2 text-white/60 text-xs leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: d.color }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
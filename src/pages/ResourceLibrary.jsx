import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Download, ExternalLink, ArrowRight, Search } from "lucide-react";

const RESOURCES = [
  { title: "SHRM Learning System — Organization", desc: "Structure of the HR Function, Organizational Effectiveness & Development, Workforce Management, Employee & Labor Relations, Technology Management", type: "كتاب رسمي", tag: "SHRM", color: "blue" },
  { title: "SHRM Learning System — People", desc: "HR Strategy, Talent Acquisition, Employee Engagement & Retention, Learning & Development, Total Rewards", type: "كتاب رسمي", tag: "SHRM", color: "blue" },
  { title: "SHRM Learning System — Workplace", desc: "Managing a Global Workforce, Risk Management, Corporate Social Responsibility, U.S. Employment Law & Regulations", type: "كتاب رسمي", tag: "SHRM", color: "blue" },
  { title: "SHRM Learning System — Competencies", desc: "Leadership & Navigation, Ethical Practice, Inclusion & Diversity, Relationship Management, Communication, Global Mindset, Business Acumen", type: "كتاب رسمي", tag: "SHRM", color: "blue" },
  { title: "SHRM BoCK — Body of Competency & Knowledge", desc: "الإطار الرسمي لكفاءات ومعارف متخصصي الموارد البشرية", type: "مرجع أساسي", tag: "SHRM", color: "yellow" },
  { title: "SHRM-CP & SHRM-SCP Exam Window Guide", desc: "دليل الاختبار الرسمي: الشروط، التسجيل، وأسلوب الأسئلة", type: "دليل الاختبار", tag: "SHRM", color: "green" },
  { title: "CMI Level 7 — Strategic Management", desc: "استراتيجيات القيادة والإدارة على المستوى السابع من CMI", type: "شهادة مهنية", tag: "CMI", color: "purple" },
  { title: "OTHM Level 7 — Human Resource Management", desc: "مناهج إدارة الموارد البشرية على المستوى السابع من OTHM", type: "شهادة مهنية", tag: "OTHM", color: "purple" },
];

const tagColors = { blue: "bg-blue-500/20 text-blue-300 border-blue-400/20", yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-400/20", green: "bg-green-500/20 text-green-300 border-green-400/20", purple: "bg-purple-500/20 text-purple-300 border-purple-400/20" };

export default function ResourceLibrary() {
  const [search, setSearch] = useState("");
  const filtered = RESOURCES.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.tag.includes(search));

  return (
    <div className="min-h-screen font-body" style={{ background: "linear-gradient(160deg,#0a0f1e 0%,#0d1a35 60%,#0a1628 100%)" }} dir="rtl">
      <header className="border-b border-white/10 sticky top-0 z-40" style={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-yellow-400" />
            <span className="font-heading font-bold text-white">مكتبة المصادر</span>
          </Link>
          <Link to="/" className="text-sm text-white/50 hover:text-white flex items-center gap-1"><ArrowRight className="w-4 h-4" /> رجوع</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl font-bold text-white mb-2">مكتبة المصادر الرسمية</h1>
          <p className="text-white/50 text-sm">الكتب والمراجع المعتمدة لشهادات SHRM-CP وSHRM-SCP</p>
        </div>

        <div className="relative mb-8 max-w-md mx-auto">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث في المصادر..."
            className="w-full pr-10 pl-4 py-3 rounded-xl border border-white/10 text-white text-sm outline-none"
            style={{ background: "rgba(13,26,53,0.8)" }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((r, i) => (
            <div key={i} className="rounded-2xl border border-white/10 p-5" style={{ background: "rgba(13,26,53,0.7)" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${tagColors[r.color]}`}>{r.tag}</span>
                  <span className="text-white/30 text-xs">{r.type}</span>
                </div>
              </div>
              <h3 className="text-white font-semibold text-sm mb-2 leading-relaxed">{r.title}</h3>
              <p className="text-white/50 text-xs leading-relaxed mb-4">{r.desc}</p>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50 border border-white/10 hover:bg-white/5 transition-colors">
                  <ExternalLink className="w-3 h-3" /> عرض على SHRM.org
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
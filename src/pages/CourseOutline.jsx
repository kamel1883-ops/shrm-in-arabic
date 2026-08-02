import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { BookOpen, ChevronDown, ChevronLeft, Play, FileCheck, ArrowRight } from "lucide-react";

const DOMAINS = [
  { label: "ORGANIZATION", labelAr: "التنظيم", color: "#3B82F6", topics: ["Structure of the HR Function", "Organizational Effectiveness & Development", "Workforce Management", "Employee & Labor Relations", "Technology Management"] },
  { label: "PEOPLE", labelAr: "الأفراد", color: "#F59E0B", topics: ["HR Strategy", "Talent Acquisition", "Employee Engagement & Retention", "Learning & Development", "Total Rewards"] },
  { label: "WORKPLACE", labelAr: "بيئة العمل", color: "#10B981", topics: ["Managing a Global Workforce", "Risk Management", "Corporate Social Responsibility", "U.S. Employment Law & Regulations"] },
  { label: "COMPETENCIES", labelAr: "الكفاءات", color: "#8B5CF6", topics: ["Leadership & Navigation", "Ethical Practice", "Inclusion & Diversity", "Relationship Management", "Communication", "Global Mindset", "Business Acumen", "Consultation", "Analytical Aptitude"] },
];

export default function CourseOutline() {
  const [courses, setCourses] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedCert, setSelectedCert] = useState("SHRM-CP");
  const [openDomain, setOpenDomain] = useState(0);

  useEffect(() => {
    base44.entities.Course.filter({ is_active: true }).then(setCourses);
    base44.entities.Unit.list().then(setUnits);
  }, []);

  const course = courses.find(c => c.certificate_type === selectedCert && c.course_type === "main");
  const courseUnits = units.filter(u => u.course_id === course?.id).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen font-body" style={{ background: "linear-gradient(160deg,#0a0f1e 0%,#0d1a35 60%,#0a1628 100%)" }} dir="rtl">
      <header className="border-b border-white/10 sticky top-0 z-40" style={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-yellow-400" />
            <span className="font-heading font-bold text-white">قائمة المحتويات</span>
          </Link>
          <Link to="/" className="text-sm text-white/50 hover:text-white flex items-center gap-1"><ArrowRight className="w-4 h-4" /> رجوع</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Tab */}
        <div className="flex justify-center mb-8">
          <div className="border border-white/10 rounded-xl p-1 flex gap-1" style={{ background: "rgba(13,26,53,0.7)" }}>
            {["SHRM-CP", "SHRM-SCP"].map(t => (
              <button key={t} onClick={() => setSelectedCert(t)}
                className="px-8 py-2.5 rounded-lg text-sm font-bold transition-all"
                style={selectedCert === t ? { background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)", color: "#fff" } : { color: "rgba(255,255,255,0.4)" }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <h2 className="font-heading text-white font-bold text-xl mb-1">منهج SHRM Learning System</h2>
          <p className="text-white/40 text-sm">المحتوى مستوحى من الكتب الرسمية لـ SHRM</p>
        </div>

        {/* Official SHRM Domains */}
        <div className="space-y-3 mb-8">
          {DOMAINS.map((d, i) => (
            <div key={d.label} className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: "rgba(13,26,53,0.7)" }}>
              <button className="w-full flex items-center justify-between p-5 text-right" onClick={() => setOpenDomain(openDomain === i ? -1 : i)}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 rounded-full" style={{ background: d.color }} />
                  <div>
                    <p className="text-white font-semibold">{d.labelAr}</p>
                    <p className="text-white/40 text-xs">{d.label} · {d.topics.length} موضوع</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${openDomain === i ? "rotate-180" : ""}`} />
              </button>
              {openDomain === i && (
                <div className="px-5 pb-5 space-y-2">
                  {d.topics.map((t, j) => (
                    <div key={t} className="flex items-center gap-3 rounded-xl p-3 border border-white/5" style={{ background: "rgba(10,15,30,0.5)" }}>
                      <span className="text-white/20 text-xs w-5 text-center">{j + 1}</span>
                      <Play className="w-3.5 h-3.5 text-white/30 shrink-0" />
                      <span className="text-white/70 text-sm">{t}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Units from DB if exist */}
        {courseUnits.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-4">الوحدات التعليمية المتاحة</h3>
            <div className="space-y-2">
              {courseUnits.map((u, i) => (
                <div key={u.id} className="flex items-center gap-4 rounded-xl p-4 border border-white/10" style={{ background: "rgba(13,26,53,0.7)" }}>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold shrink-0">{i + 1}</div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{u.title}</p>
                    {u.video_duration_minutes && <p className="text-white/40 text-xs">{u.video_duration_minutes} دقيقة</p>}
                  </div>
                  {course?.id && <Link to={`/course/${course.id}`}><ChevronLeft className="w-5 h-5 text-white/30" /></Link>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
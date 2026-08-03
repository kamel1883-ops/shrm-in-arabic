import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Award, BookOpen, FileCheck, Lock, ArrowLeft, Play, Brain } from "lucide-react";
import SHRMLogo from "@/components/SHRMLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// SHRM Learning System 2025 — Official Structure
const SHRM_BOOKS = [
  {
    key: "organization",
    color: "#F59E0B",
    gradient: "from-[#1a3a6b] to-[#0d2a55]",
    label: "ORGANIZATION",
    labelAr: "التنظيم",
    topics: [
      "Structure of the HR Function",
      "Organizational Effectiveness & Development",
      "Workforce Management",
      "Employee & Labor Relations",
      "Technology Management",
    ],
  },
  {
    key: "people",
    color: "#F59E0B",
    gradient: "from-[#1a3a6b] to-[#0d2a55]",
    label: "PEOPLE",
    labelAr: "الأفراد",
    topics: [
      "HR Strategy",
      "Talent Acquisition",
      "Employee Engagement & Retention",
      "Learning & Development",
      "Total Rewards",
    ],
  },
  {
    key: "workplace",
    color: "#F59E0B",
    gradient: "from-[#1a3a6b] to-[#0d2a55]",
    label: "WORKPLACE",
    labelAr: "بيئة العمل",
    topics: [
      "Managing a Global Workforce",
      "Risk Management",
      "Corporate Social Responsibility",
      "U.S. Employment Law & Regulations",
    ],
  },
  {
    key: "competencies",
    color: "#F59E0B",
    gradient: "from-[#1a3a6b] to-[#0d2a55]",
    label: "COMPETENCIES",
    labelAr: "الكفاءات",
    subGroups: [
      {
        label: "LEADERSHIP",
        topics: ["Leadership & Navigation", "Ethical Practice", "Inclusion & Diversity"],
      },
      {
        label: "INTERPERSONAL",
        topics: ["Relationship Management", "Communication", "Global Mindset"],
      },
      {
        label: "BUSINESS",
        topics: ["Business Acumen", "Consultation", "Analytical Aptitude"],
      },
    ],
  },
];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("SHRM-CP");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const coursesData = await base44.entities.Course.filter({ is_active: true });
      setCourses(coursesData);
      try {
        const u = await base44.auth.me();
        setUser(u);
        if (u) {
          const enrs = await base44.entities.Enrollment.filter({ user_id: u.id, payment_status: "paid" });
          setEnrollments(enrs);
        }
      } catch {}
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const isEnrolled = (courseId) => enrollments.some(e => e.course_id === courseId);
  const filtered = courses.filter(c => c.certificate_type === activeTab);
  const mainCourse = filtered.find(c => c.course_type === "main");
  const examCourse = filtered.find(c => c.course_type === "exam_simulation");

  return (
    <div className="min-h-screen font-body" style={{ background: "linear-gradient(160deg, #0a0f1e 0%, #0d1a35 60%, #0a1628 100%)" }} dir="rtl">

      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-40" style={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <SHRMLogo size={40} showText={true} />
            <span className="font-heading font-bold text-white text-base hidden md:block">شرم بالعربي</span>
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/dashboard"><Button size="sm" className="border-white/20 text-white/80 hover:bg-white/10" variant="outline">لوحتي</Button></Link>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm" className="text-white/60 hover:text-white">دخول</Button></Link>
                <Link to="/register"><Button size="sm" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#000" }}>سجّل الآن</Button></Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-12">
          {/* SHRM Logo style */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-xl border border-blue-400/20" style={{ background: "rgba(30,58,107,0.4)" }}>
            <div className="bg-[#1e3a6b] border border-white/20 rounded px-2 py-1">
              <span className="text-white font-bold text-sm tracking-wide">S|HRM</span>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-xs leading-none">BETTER WORKPLACES</p>
              <p className="text-blue-200 text-xs leading-none">BETTER WORLD™</p>
            </div>
          </div>

          <p className="text-blue-300 font-medium text-sm mb-2">SHRM-CP® / SHRM-SCP® Exam Preparation</p>
          <h1 className="font-heading text-4xl font-bold text-white mb-1">التحضير للاختبارات المهنية</h1>
          <h1 className="font-heading text-4xl font-bold mb-4" style={{ color: "#F59E0B" }}>SHRM-CP / SHRM-SCP</h1>
          <p className="text-white/50 text-sm">نظام تعليمي مستوحى من الكتب الرسمية لـ SHRM</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="border border-white/10 rounded-xl p-1 flex gap-1" style={{ background: "rgba(13,26,53,0.7)" }}>
            {["SHRM-CP", "SHRM-SCP"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-8 py-2.5 rounded-lg text-sm font-bold transition-all"
                style={activeTab === tab
                  ? { background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)", color: "#fff" }
                  : { color: "rgba(255,255,255,0.4)" }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-800 border-t-blue-400 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Course Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-14">
              <CourseCard course={mainCourse} enrolled={isEnrolled(mainCourse?.id)} user={user} type="main" certType={activeTab} />
              <CourseCard course={examCourse} enrolled={isEnrolled(examCourse?.id)} user={user} type="exam_simulation" certType={activeTab} />
            </div>

            {/* SHRM Books Section */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px flex-1 bg-white/10" />
                <div className="text-center">
                  <p className="text-blue-300 text-xs font-medium mb-0.5">SHRM Learning System 2025</p>
                  <h2 className="text-white font-heading font-bold text-xl">هيكل المحتوى الدراسي الرسمي</h2>
                </div>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {SHRM_BOOKS.map((book) => (
                  <BookCard key={book.key} book={book} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function BookCard({ book }) {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-white/10 relative"
      style={{ background: "linear-gradient(145deg, #1a3a6b 0%, #0d2a55 50%, #091d40 100%)" }}
    >
      {/* Hexagon pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='92' viewBox='0 0 80 92' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 4L76 24v44L40 88 4 68V24z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
        backgroundSize: "80px 92px",
        backgroundPosition: "bottom right",
      }} />

      {/* Top: SHRM Badge */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#1e3a6b] border border-white/30 rounded px-2 py-1">
              <span className="text-white font-bold text-xs tracking-wide">S|HRM</span>
            </div>
            <div>
              <p className="text-white/60 text-xs leading-none">BETTER WORKPLACES</p>
              <p className="text-white/60 text-xs leading-none">BETTER WORLD™</p>
            </div>
          </div>
          <span className="text-yellow-400 font-bold text-lg">SHRM</span>
        </div>

        <p className="text-blue-200 text-xs font-medium mb-0.5">SHRM-CP® / SHRM-SCP®</p>
        <p className="text-blue-200 text-xs mb-2">Exam Preparation</p>
        <p className="text-white font-bold text-2xl leading-tight">Learning<br />System</p>
      </div>

      {/* Bottom: Topics */}
      <div className="px-5 pb-6 pt-2">
        <p className="font-bold text-sm mb-3" style={{ color: book.color }}>{book.label}</p>

        {book.subGroups ? (
          <div className="grid grid-cols-3 gap-3">
            {book.subGroups.map(sg => (
              <div key={sg.label}>
                <div className="inline-block px-2 py-0.5 rounded text-xs font-bold mb-2" style={{ background: book.color, color: "#000" }}>
                  {sg.label}
                </div>
                {sg.topics.map(t => (
                  <p key={t} className="text-white/70 text-xs leading-relaxed">{t}</p>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {book.topics.map(t => (
              <p key={t} className="text-white/70 text-xs leading-relaxed">{t}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CourseCard({ course, enrolled, user, type, certType }) {
  const isMain = type === "main";
  const defaults = {
    title: isMain ? `دورة ${certType} الشاملة` : `محاكاة امتحان ${certType}`,
    description: isMain
      ? "محتوى تعليمي متكامل مستوحى من SHRM Learning System: فيديوهات، اختبارات لكل وحدة، وفلاش كاردز تفاعلية"
      : "بيئة محاكاة كاملة للامتحان الرسمي مع 134 سؤالاً وتحليل مفصّل للأداء حسب المجالات",
    price: isMain ? (certType === "SHRM-CP" ? 400 : 533.33) : (certType === "SHRM-CP" ? 400 : 533.33),
    priceDisplay: isMain ? (certType === "SHRM-CP" ? "1,300" : "1,800") : (certType === "SHRM-CP" ? "1,300" : "1,800"),
    total_units: 8,
  };
  const c = course || defaults;
  const displayPrice = isMain
    ? (certType === "SHRM-CP" ? "1,300" : "1,800")
    : (certType === "SHRM-CP" ? "1,300" : "1,800");

  const gradientMain = "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)";
  const gradientExam = "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)";

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: "rgba(13,26,53,0.8)" }}>
      <div className="p-5" style={{ background: isMain ? gradientMain : gradientExam }}>
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            {isMain ? <BookOpen className="w-5 h-5 text-white" /> : <FileCheck className="w-5 h-5 text-white" />}
          </div>
          <Badge className="bg-white/20 text-white border-0 text-xs">{isMain ? "دورة تعليمية" : "محاكاة امتحان"}</Badge>
        </div>
        <h3 className="font-heading text-xl font-bold text-white mb-1">{c.title}</h3>
        <p className="text-white/70 text-sm leading-relaxed">{c.description}</p>
      </div>

      <div className="p-5">
        {isMain ? (
          <div className="grid grid-cols-3 gap-2 mb-5 text-center">
            {[
              { icon: Play, label: "فيديو", val: c.total_units || 8 },
              { icon: Brain, label: "فلاش كارد", val: "50+" },
              { icon: FileCheck, label: "اختبار", val: c.total_units || 8 },
            ].map(item => (
              <div key={item.label} className="rounded-xl py-3 px-2 border border-white/10" style={{ background: "rgba(10,15,30,0.6)" }}>
                <item.icon className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <div className="text-base font-bold text-white">{item.val}</div>
                <div className="text-xs text-white/40">{item.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 mb-5 text-center">
            {[
              { label: "سؤال", val: "134" },
              { label: "دقيقة", val: "230" },
            ].map(item => (
              <div key={item.label} className="rounded-xl py-3 px-2 border border-white/10" style={{ background: "rgba(10,15,30,0.6)" }}>
                <div className="text-base font-bold text-white">{item.val}</div>
                <div className="text-xs text-white/40">{item.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-baseline justify-between mb-4">
          <span className="text-2xl font-bold text-yellow-400">{displayPrice} ر.س</span>
          <span className="text-xs text-white/30">وصول مدى الحياة</span>
        </div>

        {enrolled ? (
          <Link to={course?.id ? (type === "exam_simulation" ? `/exam/${course.id}` : `/course/${course.id}`) : "#"}>
            <Button className="w-full text-white font-semibold" style={{ background: isMain ? gradientMain : gradientExam }}>
              متابعة التعلم <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        ) : !user ? (
          <Link to="/register">
            <Button className="w-full text-white font-semibold" style={{ background: isMain ? gradientMain : gradientExam }}>
              <Lock className="w-4 h-4 ml-2" /> سجّل للاشتراك
            </Button>
          </Link>
        ) : course?.id ? (
          <Link to={`/checkout/${course.id}`}>
            <Button className="w-full text-white font-semibold" style={{ background: isMain ? gradientMain : gradientExam }}>
              اشترك الآن — {displayPrice} ر.س
            </Button>
          </Link>
        ) : (
          <Button disabled className="w-full bg-white/10 text-white/30">قريباً</Button>
        )}
      </div>
    </div>
  );
}
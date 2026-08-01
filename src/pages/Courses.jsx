import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Award, BookOpen, FileCheck, Brain, ArrowLeft, Clock, Lock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <div className="min-h-screen bg-gray-50 font-body" dir="rtl">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-700 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-gray-900">SHRM Academy</span>
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/dashboard"><Button variant="outline" size="sm">لوحتي</Button></Link>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">دخول</Button></Link>
                <Link to="/register"><Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white">سجّل الآن</Button></Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-3">الدورات التدريبية</h1>
          <p className="text-gray-500">لكل شهادة: دورة تعليمية شاملة + دورة محاكاة امتحان</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex gap-1 shadow-sm">
            {["SHRM-CP", "SHRM-SCP"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? "bg-blue-700 text-white shadow" : "text-gray-500 hover:text-gray-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <CourseCard course={mainCourse} enrolled={isEnrolled(mainCourse?.id)} user={user} type="main" certType={activeTab} />
            <CourseCard course={examCourse} enrolled={isEnrolled(examCourse?.id)} user={user} type="exam_simulation" certType={activeTab} />
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
      ? "محتوى تعليمي متكامل: فيديوهات احترافية، اختبارات لكل وحدة، وفلاش كاردز تفاعلية"
      : "بيئة محاكاة كاملة للامتحان الرسمي مع أسئلة متنوعة وتحليل مفصّل للأداء",
    price: isMain ? 199 : 99,
    total_units: 8,
  };

  const c = course || defaults;
  const color = isMain ? "blue" : "purple";
  const colorMap = {
    blue: { header: "from-blue-600 to-blue-800", btn: "bg-blue-700 hover:bg-blue-800" },
    purple: { header: "from-purple-600 to-indigo-800", btn: "bg-purple-700 hover:bg-purple-800" },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className={`bg-gradient-to-bl ${colorMap[color].header} p-6`}>
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
            {isMain ? <BookOpen className="w-6 h-6 text-white" /> : <FileCheck className="w-6 h-6 text-white" />}
          </div>
          <Badge className="bg-white/20 text-white border-0 text-xs">
            {isMain ? "دورة تعليمية" : "محاكاة امتحان"}
          </Badge>
        </div>
        <h3 className="font-heading text-xl font-bold text-white mb-2">{c.title}</h3>
        <p className="text-white/75 text-sm leading-relaxed">{c.description}</p>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Stats */}
        {isMain ? (
          <div className="grid grid-cols-3 gap-3 mb-6 text-center">
            {[
              { icon: Play, label: "فيديو", val: c.total_units || 8 },
              { icon: Brain, label: "فلاش كارد", val: "50+" },
              { icon: FileCheck, label: "اختبار", val: c.total_units || 8 },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-xl py-3 px-2">
                <item.icon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-800">{item.val}</div>
                <div className="text-xs text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-6 text-center">
            {[
              { icon: FileCheck, label: "سؤال", val: "150+" },
              { icon: Clock, label: "دقيقة", val: "230" },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-xl py-3 px-2">
                <item.icon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-800">{item.val}</div>
                <div className="text-xs text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-baseline justify-between mb-5">
          <span className="text-3xl font-bold text-gray-900">${c.price}</span>
          <span className="text-xs text-gray-400">وصول مدى الحياة</span>
        </div>

        {enrolled ? (
          <Link to={course?.id ? `/course/${course.id}` : "#"}>
            <Button className={`w-full ${colorMap[color].btn} text-white`}>
              متابعة التعلم <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        ) : !user ? (
          <Link to="/register">
            <Button className={`w-full ${colorMap[color].btn} text-white`}>
              <Lock className="w-4 h-4 ml-2" /> سجّل للاشتراك
            </Button>
          </Link>
        ) : course?.id ? (
          <Link to={`/checkout/${course.id}`}>
            <Button className={`w-full ${colorMap[color].btn} text-white`}>
              اشترك الآن — ${c.price}
            </Button>
          </Link>
        ) : (
          <Button disabled className="w-full bg-gray-100 text-gray-400">قريباً</Button>
        )}
      </div>
    </div>
  );
}
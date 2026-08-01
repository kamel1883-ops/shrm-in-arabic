import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Award, BookOpen, FileCheck, BarChart2, LogOut, ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const u = await base44.auth.me();
      setUser(u);
      const [enrs, allCourses, prog] = await Promise.all([
        base44.entities.Enrollment.filter({ user_id: u.id, payment_status: "paid" }),
        base44.entities.Course.filter({ is_active: true }),
        base44.entities.UserProgress.filter({ user_id: u.id }),
      ]);
      setEnrollments(enrs);
      setCourses(allCourses);
      setProgress(prog);
    } catch {
      navigate("/login");
    }
    setLoading(false);
  }

  const enrolledCourses = courses.filter(c => enrollments.some(e => e.course_id === c.id));
  const getProgress = (courseId) => {
    const prog = progress.filter(p => p.course_id === courseId);
    const quizzes = prog.filter(p => p.progress_type === "quiz_completed");
    const avgScore = quizzes.length > 0 ? Math.round(quizzes.reduce((s, p) => s + (p.quiz_score || 0), 0) / quizzes.length) : null;
    return { completed: prog.length, avgScore };
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-body" dir="rtl">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-700 rounded-xl flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-lg text-gray-900">SHRM Academy</span>
          </Link>
          <Button variant="ghost" size="sm" className="text-gray-500" onClick={() => base44.auth.logout("/")}>
            <LogOut className="w-4 h-4 ml-1" /> تسجيل الخروج
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-gray-900 mb-1">أهلاً، {user?.full_name || "طالب"} 👋</h1>
          <p className="text-gray-500">تابع تقدمك في مسار الشهادة</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: BookOpen, label: "الدورات المسجّلة", val: enrolledCourses.length, color: "blue" },
            { icon: FileCheck, label: "اختبارات مكتملة", val: progress.filter(p => p.progress_type === "quiz_completed").length, color: "green" },
            { icon: BarChart2, label: "متوسط الدرجات", val: progress.filter(p => p.quiz_score).length > 0 ? `${Math.round(progress.filter(p => p.quiz_score).reduce((s, p) => s + p.quiz_score, 0) / progress.filter(p => p.quiz_score).length)}%` : "—", color: "purple" },
            { icon: Award, label: "الشهادات المستهدفة", val: [...new Set(enrolledCourses.map(c => c.certificate_type))].length, color: "orange" },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${item.color === 'blue' ? 'bg-blue-100' : item.color === 'green' ? 'bg-green-100' : item.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'}`}>
                <item.icon className={`w-4 h-4 ${item.color === 'blue' ? 'text-blue-600' : item.color === 'green' ? 'text-green-600' : item.color === 'purple' ? 'text-purple-600' : 'text-orange-600'}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 font-heading">{item.val}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Enrolled Courses */}
        <h2 className="font-heading text-xl font-bold text-gray-900 mb-4">دوراتي</h2>
        {enrolledCourses.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">لم تشترك في أي دورة بعد</p>
            <Link to="/courses"><Button className="bg-blue-700 hover:bg-blue-800 text-white">استعرض الدورات</Button></Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {enrolledCourses.map(course => {
              const { completed, avgScore } = getProgress(course.id);
              const isExam = course.course_type === "exam_simulation";
              return (
                <div key={course.id} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge className={`text-xs mb-2 ${isExam ? 'bg-purple-100 text-purple-700 border-0' : 'bg-blue-100 text-blue-700 border-0'}`}>
                        {isExam ? "محاكاة امتحان" : "دورة تعليمية"} · {course.certificate_type}
                      </Badge>
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug">{course.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    {completed > 0 && <span className="flex items-center gap-1"><FileCheck className="w-3 h-3" />{completed} نشاط</span>}
                    {avgScore !== null && <span className="flex items-center gap-1"><BarChart2 className="w-3 h-3" />متوسط {avgScore}%</span>}
                  </div>
                  <Link to={isExam ? `/exam/${course.id}` : `/course/${course.id}`}>
                    <Button size="sm" className={`w-full ${isExam ? 'bg-purple-700 hover:bg-purple-800' : 'bg-blue-700 hover:bg-blue-800'} text-white`}>
                      {isExam ? "دخول الامتحان" : "متابعة التعلم"} <ArrowLeft className="w-3 h-3 mr-1" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Browse more */}
        <div className="mt-8 text-center">
          <Link to="/courses">
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">استعرض المزيد من الدورات</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
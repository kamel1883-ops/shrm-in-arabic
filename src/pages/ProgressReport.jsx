import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { ArrowRight, TrendingUp, Award, Target, BookOpen } from "lucide-react";

export default function ProgressReport() {
  const [progress, setProgress] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u) {
        base44.entities.UserProgress.filter({ user_id: u.id }).then(setProgress);
        base44.entities.Enrollment.filter({ user_id: u.id, payment_status: "paid" }).then(setEnrollments);
      }
    }).catch(() => {});
  }, []);

  const quizScores = progress.filter(p => p.progress_type === "quiz_completed" && p.quiz_score != null);
  const avgScore = quizScores.length > 0 ? Math.round(quizScores.reduce((s, p) => s + p.quiz_score, 0) / quizScores.length) : 0;
  const completedVideos = progress.filter(p => p.progress_type === "video_watched").length;
  const completedQuizzes = quizScores.length;

  const chartData = quizScores.slice(-8).map((p, i) => ({ name: `اختبار ${i + 1}`, score: p.quiz_score }));

  const domainData = [
    { domain: "التنظيم", score: avgScore * 0.9 },
    { domain: "الأفراد", score: avgScore * 1.1 },
    { domain: "بيئة العمل", score: avgScore * 0.8 },
    { domain: "الكفاءات", score: avgScore * 1.0 },
  ].map(d => ({ ...d, score: Math.min(100, Math.round(d.score)) }));

  const stats = [
    { icon: BookOpen, label: "الفيديوهات المشاهدة", val: completedVideos, color: "text-blue-400" },
    { icon: Target, label: "الاختبارات المكتملة", val: completedQuizzes, color: "text-yellow-400" },
    { icon: TrendingUp, label: "متوسط الدرجات", val: `${avgScore}%`, color: "text-green-400" },
    { icon: Award, label: "الدورات المسجلة", val: enrollments.length, color: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen font-body" style={{ background: "linear-gradient(160deg,#0a0f1e 0%,#0d1a35 60%,#0a1628 100%)" }} dir="rtl">
      <header className="border-b border-white/10 sticky top-0 z-40" style={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-yellow-400" />
            <span className="font-heading font-bold text-white">تقارير التقدم</span>
          </Link>
          <Link to="/" className="text-sm text-white/50 hover:text-white flex items-center gap-1"><ArrowRight className="w-4 h-4" /> رجوع</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {!user ? (
          <div className="text-center py-20">
            <p className="text-white/50 mb-4">يجب تسجيل الدخول لعرض تقاريرك</p>
            <Link to="/login"><button className="px-6 py-2 rounded-lg text-sm font-semibold text-black" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>تسجيل الدخول</button></Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map(s => (
                <div key={s.label} className="rounded-2xl border border-white/10 p-5 text-center" style={{ background: "rgba(13,26,53,0.7)" }}>
                  <s.icon className={`w-6 h-6 mx-auto mb-2 ${s.color}`} />
                  <div className={`text-3xl font-bold font-heading ${s.color}`}>{s.val}</div>
                  <div className="text-white/40 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(13,26,53,0.7)" }}>
                <h3 className="text-white font-semibold mb-5">درجات الاختبارات</h3>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" stroke="#ffffff40" tick={{ fill: "#ffffff60", fontSize: 11 }} />
                      <YAxis domain={[0, 100]} stroke="#ffffff40" tick={{ fill: "#ffffff60", fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: "#0d1a35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
                      <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-48 flex items-center justify-center text-white/30 text-sm">لا توجد بيانات بعد — ابدأ الاختبارات</div>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(13,26,53,0.7)" }}>
                <h3 className="text-white font-semibold mb-5">الأداء حسب المجالات</h3>
                {avgScore > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={domainData}>
                      <PolarGrid stroke="#ffffff20" />
                      <PolarAngleAxis dataKey="domain" tick={{ fill: "#ffffff60", fontSize: 11 }} />
                      <Radar dataKey="score" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-48 flex items-center justify-center text-white/30 text-sm">ابدأ الاختبارات لعرض الأداء</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
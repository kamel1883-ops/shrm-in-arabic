import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SHRMLogo from "@/components/SHRMLogo";
import { BookOpen, FileCheck, Brain, Video, Plus, Trash2, Save, ArrowRight, BarChart3, Upload } from "lucide-react";
import AdminUnitManager from "@/components/admin/AdminUnitManager";
import AdminFlashcardManager from "@/components/admin/AdminFlashcardManager";
import AdminQuestionManager from "@/components/admin/AdminQuestionManager";
import { TOTAL_EXAM_QUESTIONS } from "@/data/examQuestions";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [counts, setCounts] = useState({ units: 0, flashcards: 0, questions: 0 });
  const [editingCourse, setEditingCourse] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    try {
      const u = await base44.auth.me();
      if (!u || u.role !== "admin") {
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(u);
      const allCourses = await base44.entities.Course.list();
      setCourses(allCourses);
      if (allCourses.length > 0) setSelectedCourseId(allCourses[0].id);
      // Get counts
      const units = await base44.entities.Unit.list();
      const flashcards = await base44.entities.FlashCard.list();
      const questions = await base44.entities.Question.list();
      setCounts({ units: units.length, flashcards: flashcards.length, questions: questions.length });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function saveCourse(course) {
    setSaving(true);
    try {
      await base44.entities.Course.update(course.id, {
        price: course.price,
        description: course.description,
        is_active: course.is_active,
      });
      const updated = courses.map(c => c.id === course.id ? { ...c, ...course } : c);
      setCourses(updated);
      setEditingCourse(null);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0f1e" }} dir="rtl">
        <div className="w-8 h-8 border-4 border-blue-800 border-t-blue-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0a0f1e" }} dir="rtl">
        <div className="text-center">
          <SHRMLogo size={48} showText={true} />
          <h2 className="text-white text-xl font-bold mt-6 mb-2">صلاحية المدير مطلوبة</h2>
          <p className="text-white/50 text-sm mb-6">هذه الصفحة مخصصة للمدراء فقط. سجّل دخولك بحساب مدير.</p>
          <Link to="/login"><Button style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#000" }}>تسجيل الدخول</Button></Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "overview", label: "نظرة عامة", icon: BarChart3 },
    { key: "courses", label: "الدورات", icon: BookOpen },
    { key: "units", label: "الوحدات والفيديوهات", icon: Video },
    { key: "flashcards", label: "الفلاش كاردز", icon: Brain },
    { key: "questions", label: "الأسئلة", icon: FileCheck },
  ];

  return (
    <div className="min-h-screen font-body" style={{ background: "#0a0f1e" }} dir="rtl">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50" style={{ background: "rgba(10,15,30,0.95)" }}>
        <div className="flex items-center gap-3">
          <SHRMLogo size={36} showText={true} />
          <span className="text-white font-bold text-sm mr-2">لوحة تحكم المدير</span>
        </div>
        <Link to="/"><Button variant="outline" size="sm" className="border-white/20 text-white/60 hover:bg-white/10">العودة للموقع</Button></Link>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/10 px-6">
        <div className="max-w-6xl mx-auto flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${activeTab === tab.key ? "border-yellow-400 text-white" : "border-transparent text-white/40 hover:text-white/70"}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === "overview" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "الدورات", val: courses.length, icon: BookOpen, color: "text-blue-400" },
              { label: "الوحدات", val: counts.units, icon: Video, color: "text-green-400" },
              { label: "الفلاش كاردز", val: counts.flashcards, icon: Brain, color: "text-yellow-400" },
              { label: "الأسئلة", val: TOTAL_EXAM_QUESTIONS, icon: FileCheck, color: "text-purple-400" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-white/10 p-5" style={{ background: "rgba(13,26,53,0.7)" }}>
                <s.icon className={`w-6 h-6 ${s.color} mb-3`} />
                <div className="text-3xl font-bold text-white font-heading">{s.val}</div>
                <div className="text-white/40 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-4">
            {courses.map(course => (
              <div key={course.id} className="rounded-xl border border-white/10 p-5" style={{ background: "rgba(13,26,53,0.7)" }}>
                {editingCourse?.id === course.id ? (
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-white/60 text-xs mb-1">السعر (ريال)</Label>
                        <Input type="number" value={editingCourse.price || 0} onChange={e => setEditingCourse({ ...editingCourse, price: parseFloat(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
                      </div>
                      <div>
                        <Label className="text-white/60 text-xs mb-1">الحالة</Label>
                        <select className="w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm" value={editingCourse.is_active ? "active" : "inactive"} onChange={e => setEditingCourse({ ...editingCourse, is_active: e.target.value === "active" })}>
                          <option value="active" className="bg-slate-800">مفعّل</option>
                          <option value="inactive" className="bg-slate-800">معطّل</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-white/60 text-xs mb-1">الوصف</Label>
                      <Textarea value={editingCourse.description || ""} onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })} className="bg-white/5 border-white/10 text-white" rows={3} />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" disabled={saving} onClick={() => saveCourse(editingCourse)} style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#000" }}>
                        <Save className="w-4 h-4 ml-1" /> {saving ? "جاري الحفظ..." : "حفظ"}
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 text-white/60" onClick={() => setEditingCourse(null)}>إلغاء</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-white font-bold">{course.title}</h3>
                      <p className="text-white/40 text-xs mt-1">{course.certificate_type} · {course.course_type === "main" ? "دورة تعليمية" : "محاكاة امتحان"}</p>
                      <p className="text-yellow-400 font-bold text-sm mt-1">{course.price} ر.س</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-white/20 text-white/60 hover:bg-white/10" onClick={() => setEditingCourse(course)}>تعديل</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "units" && (
          <AdminUnitManager courses={courses} selectedCourseId={selectedCourseId} setSelectedCourseId={setSelectedCourseId} />
        )}

        {activeTab === "flashcards" && (
          <AdminFlashcardManager courses={courses} selectedCourseId={selectedCourseId} setSelectedCourseId={setSelectedCourseId} />
        )}

        {activeTab === "questions" && (
          <AdminQuestionManager courses={courses} selectedCourseId={selectedCourseId} setSelectedCourseId={setSelectedCourseId} />
        )}
      </div>
    </div>
  );
}
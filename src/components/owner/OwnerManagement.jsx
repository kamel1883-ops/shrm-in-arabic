import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, FileCheck, Brain, Video, Save, BarChart3 as BarChart3Icon } from "lucide-react";
import AdminUnitManager from "@/components/admin/AdminUnitManager";
import AdminFlashcardManager from "@/components/admin/AdminFlashcardManager";
import AdminExamManager from "@/components/admin/AdminExamManager";
import { TOTAL_EXAM_QUESTIONS } from "@/data/examQuestions";

/**
 * قسم إدارة المحتوى داخل صفحة المالك — يضم الدورات والوحدات والفلاش كاردز والامتحانات.
 * مطابق لمنطق لوحة الإدارة، لكن مدمج داخل لوحة المالك ليُدار كل شيء من مكان واحد.
 */
export default function OwnerManagement() {
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [counts, setCounts] = useState({ units: 0, flashcards: 0, questions: 0 });
  const [editingCourse, setEditingCourse] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const allCourses = await base44.entities.Course.list();
        setCourses(allCourses);
        if (allCourses.length > 0) setSelectedCourseId(allCourses[0].id);
        const units = await base44.entities.Unit.list();
        const flashcards = await base44.entities.FlashCard.list();
        const questions = await base44.entities.Question.list();
        setCounts({ units: units.length, flashcards: flashcards.length, questions: questions.length });
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    })();
  }, []);

  async function saveCourse(course) {
    setSaving(true);
    try {
      await base44.entities.Course.update(course.id, {
        price: course.price,
        description: course.description,
        is_active: course.is_active,
      });
      setCourses(prev => prev.map(c => (c.id === course.id ? { ...c, ...course } : c)));
      setEditingCourse(null);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-800 border-t-blue-400 rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { key: "overview", label: "نظرة عامة", icon: BarChart3Icon },
    { key: "courses", label: "الدورات", icon: BookOpen },
    { key: "units", label: "الوحدات والفيديوهات", icon: Video },
    { key: "flashcards", label: "الفلاش كاردز", icon: Brain },
    { key: "questions", label: "الامتحانات", icon: FileCheck },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden" dir="rtl">
      {/* tabs */}
      <div className="border-b border-gray-100 px-4 bg-gray-50">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${activeTab === t.key ? "border-yellow-500 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-700"}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "الدورات", val: courses.length, icon: BookOpen, color: "text-blue-600" },
              { label: "الوحدات", val: counts.units, icon: Video, color: "text-green-600" },
              { label: "الفلاش كاردز", val: counts.flashcards, icon: Brain, color: "text-yellow-600" },
              { label: "الأسئلة", val: TOTAL_EXAM_QUESTIONS, icon: FileCheck, color: "text-purple-600" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-gray-200 p-5 bg-gray-50">
                <s.icon className={`w-6 h-6 ${s.color} mb-3`} />
                <div className="text-3xl font-bold text-gray-900 font-heading">{s.val}</div>
                <div className="text-gray-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-4">
            {courses.map(course => (
              <div key={course.id} className="rounded-xl border border-gray-200 p-5 bg-gray-50">
                {editingCourse?.id === course.id ? (
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-gray-600 text-xs mb-1">السعر (ريال)</Label>
                        <Input type="number" value={editingCourse.price || 0}
                          onChange={e => setEditingCourse({ ...editingCourse, price: parseFloat(e.target.value) })}
                          className="bg-white border-gray-200" />
                      </div>
                      <div>
                        <Label className="text-gray-600 text-xs mb-1">الحالة</Label>
                        <select className="w-full rounded-md bg-white border border-gray-200 px-3 py-2 text-sm"
                          value={editingCourse.is_active ? "active" : "inactive"}
                          onChange={e => setEditingCourse({ ...editingCourse, is_active: e.target.value === "active" })}>
                          <option value="active">مفعّل</option>
                          <option value="inactive">معطّل</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-600 text-xs mb-1">الوصف</Label>
                      <Textarea value={editingCourse.description || ""}
                        onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })}
                        className="bg-white border-gray-200" rows={3} />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" disabled={saving} onClick={() => saveCourse(editingCourse)}
                        style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#000" }}>
                        <Save className="w-4 h-4 ml-1" /> {saving ? "جاري الحفظ..." : "حفظ"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingCourse(null)}>إلغاء</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{course.title}</h3>
                      <p className="text-gray-400 text-xs mt-1">{course.certificate_type} · {course.course_type === "main" ? "دورة تعليمية" : "محاكاة امتحان"}</p>
                      <p className="text-yellow-600 font-bold text-sm mt-1">{course.price} ر.س</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setEditingCourse(course)}>تعديل</Button>
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
          <AdminExamManager courses={courses} selectedCourseId={selectedCourseId} setSelectedCourseId={setSelectedCourseId} />
        )}
      </div>
    </div>
  );
}
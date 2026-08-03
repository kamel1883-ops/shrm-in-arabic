import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, FileCheck } from "lucide-react";

export default function AdminQuestionManager({ courses, selectedCourseId, setSelectedCourseId }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newQ, setNewQ] = useState({ question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_answer: "a", explanation: "", question_type: "exam_simulation" });

  const loadQuestions = useCallback(async () => {
    if (!selectedCourseId) return;
    setLoading(true);
    try {
      const data = await base44.entities.Question.filter({ course_id: selectedCourseId }, "-created_date", 200);
      setQuestions(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [selectedCourseId]);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  async function addQuestion() {
    if (!newQ.question_text || !newQ.option_a || !newQ.option_b || !newQ.option_c || !newQ.option_d) return;
    try {
      await base44.entities.Question.create({ ...newQ, course_id: selectedCourseId });
      setNewQ({ question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_answer: "a", explanation: "", question_type: "exam_simulation" });
      setAdding(false);
      loadQuestions();
    } catch (e) { console.error(e); }
  }

  async function deleteQuestion(id) {
    if (!confirm("هل أنت متأكد من حذف هذا السؤال؟")) return;
    try { await base44.entities.Question.delete(id); loadQuestions(); } catch (e) { console.error(e); }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <select className="rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm" value={selectedCourseId || ""} onChange={e => setSelectedCourseId(e.target.value)}>
            {courses.map(c => <option key={c.id} value={c.id} className="bg-slate-800">{c.title}</option>)}
          </select>
          <span className="text-white/40 text-sm">{questions.length} سؤال</span>
        </div>
        <Button size="sm" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#000" }} onClick={() => setAdding(!adding)}>
          <Plus className="w-4 h-4 ml-1" /> إضافة سؤال
        </Button>
      </div>

      {adding && (
        <div className="rounded-xl border border-white/10 p-5 space-y-3" style={{ background: "rgba(13,26,53,0.7)" }}>
          <div>
            <Label className="text-white/60 text-xs mb-1">نص السؤال</Label>
            <Textarea value={newQ.question_text} onChange={e => setNewQ({ ...newQ, question_text: e.target.value })} className="bg-white/5 border-white/10 text-white" rows={2} placeholder="اكتب السؤال هنا" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-white/60 text-xs mb-1">الخيار A</Label>
              <Input value={newQ.option_a} onChange={e => setNewQ({ ...newQ, option_a: e.target.value })} className="bg-white/5 border-white/10 text-white text-sm" />
            </div>
            <div>
              <Label className="text-white/60 text-xs mb-1">الخيار B</Label>
              <Input value={newQ.option_b} onChange={e => setNewQ({ ...newQ, option_b: e.target.value })} className="bg-white/5 border-white/10 text-white text-sm" />
            </div>
            <div>
              <Label className="text-white/60 text-xs mb-1">الخيار C</Label>
              <Input value={newQ.option_c} onChange={e => setNewQ({ ...newQ, option_c: e.target.value })} className="bg-white/5 border-white/10 text-white text-sm" />
            </div>
            <div>
              <Label className="text-white/60 text-xs mb-1">الخيار D</Label>
              <Input value={newQ.option_d} onChange={e => setNewQ({ ...newQ, option_d: e.target.value })} className="bg-white/5 border-white/10 text-white text-sm" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-32">
              <Label className="text-white/60 text-xs mb-1">الإجابة الصحيحة</Label>
              <select className="w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm" value={newQ.correct_answer} onChange={e => setNewQ({ ...newQ, correct_answer: e.target.value })}>
                <option value="a" className="bg-slate-800">A</option>
                <option value="b" className="bg-slate-800">B</option>
                <option value="c" className="bg-slate-800">C</option>
                <option value="d" className="bg-slate-800">D</option>
              </select>
            </div>
            <div className="flex-1">
              <Label className="text-white/60 text-xs mb-1">الشرح</Label>
              <Input value={newQ.explanation} onChange={e => setNewQ({ ...newQ, explanation: e.target.value })} className="bg-white/5 border-white/10 text-white text-sm" placeholder="شرح الإجابة الصحيحة" />
            </div>
          </div>
          <Button size="sm" style={{ background: "linear-gradient(135deg,#3B82F6,#1d4ed8)", color: "#fff" }} onClick={addQuestion}>
            <Save className="w-4 h-4 ml-1" /> حفظ السؤال
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-blue-800 border-t-blue-400 rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={q.id} className="rounded-xl border border-white/10 p-4" style={{ background: "rgba(13,26,53,0.7)" }}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-white/30 text-xs">#{i + 1} · {q.question_type === "exam_simulation" ? "محاكاة" : "اختبار وحدة"}</span>
                <Button size="icon" variant="ghost" className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 h-6 w-6" onClick={() => deleteQuestion(q.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <p className="text-white text-sm mb-2">{q.question_text}</p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <p className={q.correct_answer === "a" ? "text-green-400" : "text-white/40"}>A. {q.option_a}</p>
                <p className={q.correct_answer === "b" ? "text-green-400" : "text-white/40"}>B. {q.option_b}</p>
                <p className={q.correct_answer === "c" ? "text-green-400" : "text-white/40"}>C. {q.option_c}</p>
                <p className={q.correct_answer === "d" ? "text-green-400" : "text-white/40"}>D. {q.option_d}</p>
              </div>
            </div>
          ))}
          {questions.length === 0 && <p className="text-white/30 text-sm text-center py-8">لا توجد أسئلة بعد.</p>}
        </div>
      )}
    </div>
  );
}
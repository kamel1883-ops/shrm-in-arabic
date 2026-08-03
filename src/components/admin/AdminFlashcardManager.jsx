import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, Brain } from "lucide-react";

export default function AdminFlashcardManager({ courses, selectedCourseId, setSelectedCourseId }) {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newCard, setNewCard] = useState({ front_text: "", back_text: "" });

  const loadCards = useCallback(async () => {
    if (!selectedCourseId) return;
    setLoading(true);
    try {
      const data = await base44.entities.FlashCard.filter({ course_id: selectedCourseId }, "order", 200);
      setFlashcards(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [selectedCourseId]);

  useEffect(() => { loadCards(); }, [loadCards]);

  async function addCard() {
    if (!newCard.front_text || !newCard.back_text) return;
    try {
      await base44.entities.FlashCard.create({ ...newCard, course_id: selectedCourseId, order: flashcards.length + 1 });
      setNewCard({ front_text: "", back_text: "" });
      setAdding(false);
      loadCards();
    } catch (e) { console.error(e); }
  }

  async function deleteCard(id) {
    try { await base44.entities.FlashCard.delete(id); loadCards(); } catch (e) { console.error(e); }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <select className="rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm" value={selectedCourseId || ""} onChange={e => setSelectedCourseId(e.target.value)}>
            {courses.map(c => <option key={c.id} value={c.id} className="bg-slate-800">{c.title}</option>)}
          </select>
          <span className="text-white/40 text-sm">{flashcards.length} فلاش كارد</span>
        </div>
        <Button size="sm" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#000" }} onClick={() => setAdding(!adding)}>
          <Plus className="w-4 h-4 ml-1" /> إضافة فلاش كارد
        </Button>
      </div>

      {adding && (
        <div className="rounded-xl border border-white/10 p-5 space-y-3" style={{ background: "rgba(13,26,53,0.7)" }}>
          <div>
            <Label className="text-white/60 text-xs mb-1">الوجه الأمامي (السؤال)</Label>
            <Textarea value={newCard.front_text} onChange={e => setNewCard({ ...newCard, front_text: e.target.value })} className="bg-white/5 border-white/10 text-white" rows={2} placeholder="مثال: ما هو تعريف إدارة الأداء؟" />
          </div>
          <div>
            <Label className="text-white/60 text-xs mb-1">الوجه الخلفي (الإجابة)</Label>
            <Textarea value={newCard.back_text} onChange={e => setNewCard({ ...newCard, back_text: e.target.value })} className="bg-white/5 border-white/10 text-white" rows={3} placeholder="الإجابة التفصيلية" />
          </div>
          <Button size="sm" style={{ background: "linear-gradient(135deg,#3B82F6,#1d4ed8)", color: "#fff" }} onClick={addCard}>
            <Save className="w-4 h-4 ml-1" /> حفظ
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-blue-800 border-t-blue-400 rounded-full animate-spin" /></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {flashcards.map((card, i) => (
            <div key={card.id} className="rounded-xl border border-white/10 p-4" style={{ background: "rgba(13,26,53,0.7)" }}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-white/30 text-xs">#{i + 1}</span>
                <Button size="icon" variant="ghost" className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 h-6 w-6" onClick={() => deleteCard(card.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <p className="text-white text-sm font-medium mb-2">{card.front_text}</p>
              <p className="text-white/50 text-xs leading-relaxed">{card.back_text}</p>
            </div>
          ))}
          {flashcards.length === 0 && <p className="text-white/30 text-sm text-center py-8 col-span-2">لا توجد فلاش كاردز بعد.</p>}
        </div>
      )}
    </div>
  );
}
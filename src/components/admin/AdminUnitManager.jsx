import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, Upload, Video } from "lucide-react";

export default function AdminUnitManager({ courses, selectedCourseId, setSelectedCourseId }) {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newUnit, setNewUnit] = useState({ title: "", description: "", order: 1, video_url: "", video_duration_minutes: 0 });
  const [uploading, setUploading] = useState(false);

  const loadUnits = useCallback(async () => {
    if (!selectedCourseId) return;
    setLoading(true);
    try {
      const data = await base44.entities.Unit.filter({ course_id: selectedCourseId }, "order", 50);
      setUnits(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [selectedCourseId]);

  useEffect(() => { loadUnits(); }, [loadUnits]);

  async function handleUploadVideo(file) {
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setNewUnit(prev => ({ ...prev, video_url: file_url }));
    } catch (e) { console.error(e); }
    setUploading(false);
  }

  async function addUnit() {
    if (!newUnit.title) return;
    try {
      await base44.entities.Unit.create({ ...newUnit, course_id: selectedCourseId });
      setNewUnit({ title: "", description: "", order: units.length + 1, video_url: "", video_duration_minutes: 0 });
      setAdding(false);
      loadUnits();
    } catch (e) { console.error(e); }
  }

  async function deleteUnit(id) {
    if (!confirm("هل أنت متأكد من حذف هذه الوحدة؟")) return;
    try { await base44.entities.Unit.delete(id); loadUnits(); } catch (e) { console.error(e); }
  }

  async function updateUnitVideo(unit, videoUrl) {
    try { await base44.entities.Unit.update(unit.id, { video_url: videoUrl }); loadUnits(); } catch (e) { console.error(e); }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <select className="rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm" value={selectedCourseId || ""} onChange={e => setSelectedCourseId(e.target.value)}>
            {courses.map(c => <option key={c.id} value={c.id} className="bg-slate-800">{c.title}</option>)}
          </select>
        </div>
        <Button size="sm" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#000" }} onClick={() => setAdding(!adding)}>
          <Plus className="w-4 h-4 ml-1" /> إضافة وحدة
        </Button>
      </div>

      {adding && (
        <div className="rounded-xl border border-white/10 p-5 space-y-3" style={{ background: "rgba(13,26,53,0.7)" }}>
          <div>
            <Label className="text-white/60 text-xs mb-1">عنوان الوحدة</Label>
            <Input value={newUnit.title} onChange={e => setNewUnit({ ...newUnit, title: e.target.value })} className="bg-white/5 border-white/10 text-white" placeholder="مثال: الوحدة الأولى - مقدمة في HR" />
          </div>
          <div>
            <Label className="text-white/60 text-xs mb-1">الوصف</Label>
            <Textarea value={newUnit.description} onChange={e => setNewUnit({ ...newUnit, description: e.target.value })} className="bg-white/5 border-white/10 text-white" rows={2} placeholder="وصف مختصر لمحتوى الوحدة" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-white/60 text-xs mb-1">الترتيب</Label>
              <Input type="number" value={newUnit.order} onChange={e => setNewUnit({ ...newUnit, order: parseInt(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <Label className="text-white/60 text-xs mb-1">مدة الفيديو (دقيقة)</Label>
              <Input type="number" value={newUnit.video_duration_minutes} onChange={e => setNewUnit({ ...newUnit, video_duration_minutes: parseInt(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
            </div>
          </div>
          <div>
            <Label className="text-white/60 text-xs mb-1">رفع فيديو</Label>
            <div className="flex items-center gap-3">
              <input type="file" accept="video/*" onChange={e => e.target.files[0] && handleUploadVideo(e.target.files[0])} className="text-white/50 text-xs file:rounded-lg file:border-0 file:bg-yellow-500/20 file:text-yellow-400 file:px-3 file:py-1.5 file:mr-3 file:cursor-pointer" />
              {uploading && <span className="text-white/40 text-xs">جاري الرفع...</span>}
            </div>
            {newUnit.video_url && <p className="text-green-400 text-xs mt-1">✓ تم رفع الفيديو</p>}
          </div>
          <div>
            <Label className="text-white/60 text-xs mb-1">أو أدخل رابط الفيديو</Label>
            <Input value={newUnit.video_url} onChange={e => setNewUnit({ ...newUnit, video_url: e.target.value })} className="bg-white/5 border-white/10 text-white" placeholder="https://..." />
          </div>
          <Button size="sm" style={{ background: "linear-gradient(135deg,#3B82F6,#1d4ed8)", color: "#fff" }} onClick={addUnit}>
            <Save className="w-4 h-4 ml-1" /> حفظ الوحدة
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-blue-800 border-t-blue-400 rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {units.map((unit, idx) => (
            <div key={unit.id} className="rounded-xl border border-white/10 p-4 flex items-center justify-between" style={{ background: "rgba(13,26,53,0.7)" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">{idx + 1}</div>
                <div>
                  <h4 className="text-white text-sm font-medium">{unit.title}</h4>
                  <p className="text-white/40 text-xs">{unit.video_url ? "✓ يوجد فيديو" : "✗ لا يوجد فيديو"} {unit.video_duration_minutes ? `· ${unit.video_duration_minutes} دقيقة` : ""}</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10" onClick={() => deleteUnit(unit.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {units.length === 0 && <p className="text-white/30 text-sm text-center py-8">لا توجد وحدات بعد. اضغط "إضافة وحدة" للبدء.</p>}
        </div>
      )}
    </div>
  );
}
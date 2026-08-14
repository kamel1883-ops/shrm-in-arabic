import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Percent, Loader2, Copy, CheckCircle2, Trash2, Plus, Ticket } from "lucide-react";

function genCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `SHRM-${s}`;
}

export default function OwnerCouponManager() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pct, setPct] = useState(100);
  const [maxUses, setMaxUses] = useState(1);
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const list = await base44.entities.DiscountCode.list("-created_date", 100);
      setCodes(list);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function create() {
    if (pct < 1 || pct > 100) return;
    setSaving(true);
    try {
      const c = await base44.entities.DiscountCode.create({
        code: genCode(),
        percentage: Number(pct),
        max_uses: Number(maxUses) || 1,
        uses_count: 0,
        active: true,
        notes: notes || "",
      });
      setCodes([c, ...codes]);
      setNotes("");
      setMaxUses(1);
    } catch (e) { console.error(e); }
    setSaving(false);
  }

  async function remove(id) {
    if (!confirm("حذف هذا الكوبون؟")) return;
    try {
      await base44.entities.DiscountCode.delete(id);
      setCodes(codes.filter((c) => c.id !== id));
    } catch (e) { console.error(e); }
  }

  async function toggleActive(c) {
    try {
      const updated = await base44.entities.DiscountCode.update(c.id, { active: !c.active });
      setCodes(codes.map((x) => (x.id === c.id ? updated : x)));
    } catch (e) { console.error(e); }
  }

  function copy(c) {
    navigator.clipboard?.writeText(c.code);
    setCopied(c.id);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div>
      {/* نموذج إنشاء كوبون */}
      <div className="rounded-xl border border-yellow-400/30 p-5 mb-6" style={{ background: "rgba(13,26,53,0.7)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Ticket className="w-5 h-5 text-yellow-400" />
          <h3 className="font-heading font-bold text-white">إنشاء كود خصم جديد</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label className="text-white/60 text-sm">نسبة الخصم (1 إلى 100)%</Label>
            <div className="relative">
              <Input type="number" min={1} max={100} value={pct}
                onChange={(e) => setPct(Math.min(100, Math.max(1, Number(e.target.value))))}
                className="h-11 bg-white/5 border-white/20 text-white" />
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            </div>
            <p className="text-xs text-white/30">100% = اشتراك مجاني تماماً (بدون بطاقة)</p>
          </div>
          <div className="space-y-2">
            <Label className="text-white/60 text-sm">عدد مرات الاستخدام</Label>
            <Input type="number" min={1} value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              className="h-11 bg-white/5 border-white/20 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-white/60 text-sm">ملاحظات (اختياري)</Label>
            <Input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="للعميل فلان..."
              className="h-11 bg-white/5 border-white/20 text-white" />
          </div>
        </div>
        <Button onClick={create} disabled={saving || pct < 1 || pct > 100}
          className="text-black font-semibold" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
          {saving ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Plus className="w-4 h-4 ml-2" />}
          توليد كود خصم {pct}%
        </Button>
      </div>

      {/* قائمة الأكواد */}
      <h3 className="font-heading font-bold text-white mb-3">الأكواد الحالية</h3>
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-7 h-7 text-yellow-400 animate-spin" /></div>
      ) : codes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 p-10 text-center" style={{ background: "rgba(13,26,53,0.5)" }}>
          <Ticket className="w-9 h-9 text-white/20 mx-auto mb-2" />
          <p className="text-white/40 text-sm">لا توجد أكواد بعد</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "rgba(13,26,53,0.7)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="border-b border-white/10" style={{ background: "rgba(10,15,30,0.6)" }}>
                <tr>
                  <th className="py-3 px-4 font-medium text-white/50">الكود</th>
                  <th className="py-3 px-4 font-medium text-white/50">الخصم</th>
                  <th className="py-3 px-4 font-medium text-white/50">الاستخدام</th>
                  <th className="py-3 px-4 font-medium text-white/50">الحالة</th>
                  <th className="py-3 px-4 font-medium text-white/50">ملاحظات</th>
                  <th className="py-3 px-4 font-medium text-white/50"></th>
                </tr>
              </thead>
              <tbody>
                {codes.map((c) => {
                  const used = (c.uses_count || 0) >= (c.max_uses || 1);
                  return (
                    <tr key={c.id} className="border-b border-white/5 last:border-0">
                      <td className="py-3 px-4">
                        <button onClick={() => copy(c)} className="font-mono font-bold text-yellow-400 hover:underline flex items-center gap-1.5" dir="ltr">
                          {c.code}
                          {copied === c.id ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-white/40" />}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-white">{c.percentage}%</td>
                      <td className="py-3 px-4 text-white/70">{c.uses_count || 0} / {c.max_uses || 1}</td>
                      <td className="py-3 px-4">
                        {used ? (
                          <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/40">منتهي</span>
                        ) : c.active ? (
                          <button onClick={() => toggleActive(c)} className="text-xs px-2 py-0.5 rounded bg-green-500/15 text-green-400">فعّال</button>
                        ) : (
                          <button onClick={() => toggleActive(c)} className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/40">متوقف</button>
                        )}
                      </td>
                      <td className="py-3 px-4 text-white/40 text-xs max-w-[160px] truncate">{c.notes || "—"}</td>
                      <td className="py-3 px-4 text-left">
                        <button onClick={() => remove(c.id)} className="text-white/30 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
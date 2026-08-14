import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Check, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const u = await base44.auth.me();
      setUser(u);
      setName(u.full_name || "");
    } catch {}
    setLoading(false);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true); setSaved(false);
    try {
      await base44.auth.updateMe({ full_name: name });
      setUser({ ...user, full_name: name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  async function logout() { await base44.auth.logout("/"); }

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  if (!user) return <p className="text-center text-gray-500 py-20">تعذّر تحميل بيانات الحساب</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-1">ملفي الشخصي</h1>
        <p className="text-gray-500">إدارة معلومات حسابك</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}>
            {(user.full_name || user.email || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.full_name || "بدون اسم بعد"}</p>
            <p className="text-gray-500 text-sm" dir="ltr">{user.email}</p>
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              {user.role === "admin" ? "مدير" : "طالب"}
            </span>
          </div>
        </div>

        <form onSubmit={save} className="space-y-3 pt-2 border-t border-gray-100">
          <label className="text-sm font-medium text-gray-700 block">الاسم الكامل</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="أدخل اسمك الكامل" className="h-11" />
          <Button type="submit" disabled={saving} className="bg-blue-700 hover:bg-blue-800 text-white">
            {saving ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" />جارٍ الحفظ</>
              : saved ? <><Check className="w-4 h-4 ml-2" />تم الحفظ</>
              : "حفظ التغييرات"}
          </Button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">تسجيل الخروج وإنهاء الجلسة</p>
        <Button variant="ghost" onClick={logout} className="text-red-600 hover:bg-red-50">
          <LogOut className="w-4 h-4 ml-2" /> تسجيل الخروج
        </Button>
      </div>
    </div>
  );
}
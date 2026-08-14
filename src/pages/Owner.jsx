import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SHRMLogo from "@/components/SHRMLogo";
import { Mail, Lock, Loader2, LogOut, Users, BookOpen, FileCheck, BarChart3, ShieldAlert, ArrowLeft } from "lucide-react";

export default function Owner() {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    (async () => {
      const u = await base44.auth.me().catch(() => null);
      if (u) {
        setAuthed(true);
        setEmail(u.email);
        loadStats();
      }
    })();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const returnUrl = "/owner";
      window.history.replaceState({}, "", `/owner?returnTo=${encodeURIComponent(returnUrl)}`);
      await base44.auth.loginViaEmailPassword(email, password);
      // SDK hard-redirects to returnTo (/owner) — page reloads and re-mounts
    } catch (err) {
      setError(err.message || "فشل تسجيل الدخول");
      setLoading(false);
    }
  }

  async function loadStats() {
    setStatsLoading(true); setError(""); setDenied(false);
    try {
      const res = await base44.functions.invoke("getOwnerStats", {});
      if (res.status === 403 || res.data?.error?.includes("Forbidden")) {
        setDenied(true);
      } else if (res.data?.error) {
        setError(res.data.error);
      } else {
        setStats(res.data);
      }
    } catch (err) {
      setDenied(true);
    } finally {
      setStatsLoading(false);
    }
  }

  async function handleLogout() {
    await base44.auth.logout("/");
  }

  // ===== LOGIN SCREEN =====
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 font-body" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a35 60%, #0a1628 100%)" }} dir="rtl">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full shadow-xl">
          <div className="flex justify-center mb-6"><SHRMLogo size={56} showText={true} /></div>
          <div className="text-center mb-6">
            <div className="inline-flex w-12 h-12 rounded-xl items-center justify-center mb-3" style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)" }}>
              <ShieldAlert className="w-6 h-6 text-yellow-500" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">دخول المالك</h1>
            <p className="text-gray-500 text-sm mt-1">صفحة إدارة خاصة بمالك المنصة فقط</p>
          </div>

          {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-700">بريد المالك</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input id="email" type="email" required autoFocus placeholder="owner@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} className="pr-10 h-12" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-gray-700">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input id="password" type="password" required placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10 h-12" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 font-semibold text-black" style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}>
              {loading ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" />جارٍ الدخول...</> : "دخول صفحة المالك"}
            </Button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-5">يُسمح بالدخول لبريد المالك المحدد فقط.</p>
        </div>
      </div>
    );
  }

  // ===== DENIED (logged in but not owner) =====
  if (denied) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 font-body bg-gray-50" dir="rtl">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7 text-red-500" />
          </div>
          <h1 className="font-heading text-xl font-bold text-gray-900 mb-2">لا تملك صلاحية المالك</h1>
          <p className="text-gray-500 text-sm mb-6">هذا الحساب غير مصرّح له بالدخول لصفحة المالك.</p>
          <Button onClick={handleLogout} variant="outline" className="w-full py-5"><LogOut className="w-4 h-4 ml-2" /> تسجيل الخروج</Button>
        </div>
      </div>
    );
  }

  // ===== OWNER DASHBOARD =====
  const breakdown = stats?.breakdown || {};
  const cards = [
    { icon: Users, label: "إجمالي العملاء", val: stats?.total_customers ?? "—", color: "blue" },
    { icon: FileCheck, label: "إجمالي الاشتراكات", val: stats?.total_enrollments ?? "—", color: "green" },
    { icon: BookOpen, label: "CP — دورة شاملة", val: breakdown["SHRM-CP-main"] ?? 0, color: "indigo" },
    { icon: FileCheck, label: "CP — محاكاة امتحان", val: breakdown["SHRM-CP-exam_simulation"] ?? 0, color: "purple" },
    { icon: BookOpen, label: "SCP — دورة شاملة", val: breakdown["SHRM-SCP-main"] ?? 0, color: "amber" },
    { icon: FileCheck, label: "SCP — محاكاة امتحان", val: breakdown["SHRM-SCP-exam_simulation"] ?? 0, color: "rose" },
  ];

  return (
    <div className="min-h-screen font-body bg-gray-50" dir="rtl">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SHRMLogo size={40} showText={true} />
            <div>
              <p className="font-heading font-bold text-gray-900 text-sm">لوحة المالك</p>
              <p className="text-gray-400 text-xs" dir="ltr">{email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-500" onClick={handleLogout}>
            <LogOut className="w-4 h-4 ml-1" /> خروج
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">مرحباً كامل 👋</h1>
        <p className="text-gray-500 mb-8">إحصائيات حقيقية لعملاء المنصة واشتراكاتهم</p>

        {statsLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {cards.map(card => (
                <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    card.color === 'blue' ? 'bg-blue-100' : card.color === 'green' ? 'bg-green-100' :
                    card.color === 'indigo' ? 'bg-indigo-100' : card.color === 'purple' ? 'bg-purple-100' :
                    card.color === 'amber' ? 'bg-amber-100' : 'bg-rose-100'}`}>
                    <card.icon className={`w-5 h-5 ${
                      card.color === 'blue' ? 'text-blue-600' : card.color === 'green' ? 'text-green-600' :
                      card.color === 'indigo' ? 'text-indigo-600' : card.color === 'purple' ? 'text-purple-600' :
                      card.color === 'amber' ? 'text-amber-600' : 'text-rose-600'}`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 font-heading">{card.val}</div>
                  <div className="text-xs text-gray-400 mt-1">{card.label}</div>
                </div>
              ))}
            </div>

            <h2 className="font-heading text-xl font-bold text-gray-900 mb-4">قائمة العملاء</h2>
            {(!stats?.customers || stats.customers.length === 0) ? (
              <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
                <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">لا يوجد عملاء مشتركون بعد</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="py-3 px-4 font-medium text-gray-500">#</th>
                        <th className="py-3 px-4 font-medium text-gray-500">البريد</th>
                        <th className="py-3 px-4 font-medium text-gray-500">عدد الاشتراكات</th>
                        <th className="py-3 px-4 font-medium text-gray-500">الدورات المشتراة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.customers.map((c, i) => (
                        <tr key={c.email} className="border-b border-gray-50 last:border-0">
                          <td className="py-3 px-4 text-gray-400">{i + 1}</td>
                          <td className="py-3 px-4 font-medium text-gray-800" dir="ltr">{c.email}</td>
                          <td className="py-3 px-4 text-gray-600">{c.enrollments}</td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {c.courses.map((co, idx) => (
                                <span key={idx} className={`text-xs px-2 py-0.5 rounded ${co.type === 'exam_simulation' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                                  {co.cert} · {co.type === 'exam_simulation' ? 'محاكاة' : 'شاملة'}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
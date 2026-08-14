import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Award, ShieldCheck, ArrowRight, Loader2, BookOpen, FileCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SHRMLogo from "@/components/SHRMLogo";
import { useToast } from "@/components/ui/use-toast";

export default function Checkout() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => { loadData(); }, [courseId]);

  async function loadData() {
    try {
      const c = await base44.entities.Course.get(courseId);
      setCourse(c);
      const u = await base44.auth.me().catch(() => null);
      if (u?.email) setEmail(u.email);
    } catch {
      navigate("/courses");
    }
    setLoading(false);
  }

  async function handleCheckout(e) {
    e.preventDefault();
    if (window.self !== window.top) {
      alert("الدفع يعمل فقط من التطبيق المنشور. يرجى فتحه في نافذة مستقلة.");
      return;
    }
    if (!email || !email.includes("@")) {
      toast({ title: "أدخل بريداً صحيحاً", variant: "destructive" });
      return;
    }
    setPaying(true);
    try {
      const u = await base44.auth.me().catch(() => null);
      const res = await base44.functions.invoke("createCheckout", {
        course_id: courseId,
        course_title: course.title,
        amount: course.price,
        customer_email: email,
        user_id: u?.id,
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error(res.data?.error || "فشل إنشاء جلسة الدفع");
      }
    } catch (err) {
      toast({ title: "خطأ في الدفع", description: err.message, variant: "destructive" });
      setPaying(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
    </div>
  );

  if (!course) return null;

  const isExam = course.course_type === "exam_simulation";

  return (
    <div className="min-h-screen bg-gray-50 font-body flex items-center justify-center px-4 py-10" dir="rtl">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full shadow-sm">
        <div className="flex items-center gap-2 mb-8">
          <Link to="/" className="flex items-center gap-2">
            <SHRMLogo size={36} showText={true} />
          </Link>
        </div>

        <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">تأكيد الاشتراك</h1>

        <div className={`rounded-xl p-4 mb-6 flex gap-4 items-start ${isExam ? 'bg-purple-50 border border-purple-100' : 'bg-blue-50 border border-blue-100'}`}>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isExam ? 'bg-purple-100' : 'bg-blue-100'}`}>
            {isExam ? <FileCheck className="w-5 h-5 text-purple-600" /> : <BookOpen className="w-5 h-5 text-blue-600" />}
          </div>
          <div>
            <p className={`text-xs font-medium mb-1 ${isExam ? 'text-purple-600' : 'text-blue-600'}`}>
              {course.certificate_type} · {isExam ? "محاكاة امتحان" : "دورة تعليمية"}
            </p>
            <h2 className="font-semibold text-gray-900 text-sm leading-snug">{course.title}</h2>
          </div>
        </div>

        <div className="border-t border-b border-gray-100 py-4 mb-6">
          <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
            <span>سعر الدورة</span>
            <span>${course.price}</span>
          </div>
          <div className="flex justify-between items-center font-bold text-gray-900 text-lg">
            <span>الإجمالي</span>
            <span>${course.price}</span>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-gray-700">بريدك الإلكتروني (للدفع وإنشاء الحساب)</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-10 h-12"
              />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">استخدم البريد نفسه عند إنشاء حسابك بعد الدفع — به تُربط دورتك بك.</p>
          </div>
          <Button type="submit" disabled={paying} className="w-full bg-blue-700 hover:bg-blue-800 text-white py-6 text-base font-semibold">
            {paying ? (
              <><Loader2 className="w-4 h-4 ml-2 animate-spin" />جارٍ التحويل...</>
            ) : (
              `إتمام الدفع — $${course.price}`
            )}
          </Button>
        </form>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>مدفوعات آمنة ومشفرة عبر Stripe</span>
        </div>

        <Link to="/courses" className="flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-800">
          <ArrowRight className="w-4 h-4" />
          العودة للدورات
        </Link>
      </div>
    </div>
  );
}
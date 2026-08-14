import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { CheckCircle, Award, ArrowLeft, Loader2, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import SHRMLogo from "@/components/SHRMLogo";

export default function EnrollmentSuccess() {
  const [status, setStatus] = useState("verifying");
  const [courseId, setCourseId] = useState(null);
  const [customerEmail, setCustomerEmail] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const cId = params.get("course_id");
    const emailParam = params.get("email");
    setCourseId(cId);
    (async () => {
      const u = await base44.auth.me().catch(() => null);
      setCurrentUser(u);
      if (sessionId && cId) verify(sessionId, cId, emailParam);
      else setStatus("error");
    })();
  }, []);

  async function verify(sessionId, cId, emailParam) {
    try {
      const res = await base44.functions.invoke("verifyEnrollment", { session_id: sessionId, course_id: cId });
      if (res.data?.enrolled) {
        setCustomerEmail(res.data.customer_email || emailParam || "");
        setStatus("success");
      } else {
        setStatus("pending");
      }
    } catch {
      setStatus("pending");
    }
  }

  const loggedInAndMatches = currentUser && customerEmail &&
    currentUser.email.trim().toLowerCase() === customerEmail.trim().toLowerCase();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-body px-4 py-10" dir="rtl">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 max-w-md w-full text-center shadow-sm">
        <div className="flex justify-center mb-6">
          <Link to="/"><SHRMLogo size={48} showText={true} /></Link>
        </div>

        {status === "verifying" && (
          <>
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="font-heading text-xl font-bold text-gray-900">جارٍ التحقق من الدفع...</h2>
            <p className="text-gray-400 text-sm mt-2">لحظة من فضلك</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-9 h-9 text-green-600" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-3">تم الدفع بنجاح! 🎉</h2>
            <p className="text-gray-500 text-sm mb-2">تم تسجيل اشتراكك. للوصول إلى دورتك:</p>

            {loggedInAndMatches ? (
              <div className="space-y-3 mt-6">
                <Link to="/dashboard">
                  <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white py-5">
                    الذهاب إلى لوحة الطالب <ArrowLeft className="w-4 h-4 mr-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-3 text-right">
                {customerEmail && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                    <p className="text-sm text-blue-800 mb-1">
                      أنشئ حساباً بالبريد: <span className="font-bold" dir="ltr">{customerEmail}</span>
                    </p>
                    <p className="text-xs text-blue-600">يجب أن يكون بريد حسابك مطابقاً لبريد الدفع لربط الدورة بك تلقائياً.</p>
                  </div>
                )}
                <Link to={customerEmail ? `/register?email=${encodeURIComponent(customerEmail)}&returnTo=/dashboard` : "/register"}>
                  <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white py-5">
                    <UserPlus className="w-4 h-4 ml-2" /> إنشاء حساب بالبريد نفسه
                  </Button>
                </Link>
                <Link to="/login?returnTo=/dashboard">
                  <Button variant="outline" className="w-full py-5">
                    <LogIn className="w-4 h-4 ml-2" /> لديّ حساب — تسجيل الدخول
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}

        {(status === "pending" || status === "error") && (
          <>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-9 h-9 text-yellow-600" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-3">تم استلام طلبك</h2>
            <p className="text-gray-500 text-sm mb-8">جارٍ معالجة الدفع. ستظهر الدورة في لوحتك خلال لحظات.</p>
            <Link to="/dashboard">
              <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white py-5">الذهاب للوحة الطالب</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
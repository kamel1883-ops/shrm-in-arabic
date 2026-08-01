import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { CheckCircle, Award, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EnrollmentSuccess() {
  const [status, setStatus] = useState("verifying");
  const [courseId, setCourseId] = useState(null);
  const [isExam, setIsExam] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const cId = params.get("course_id");
    setCourseId(cId);
    if (sessionId && cId) verify(sessionId, cId);
    else setStatus("error");
  }, []);

  async function verify(sessionId, cId) {
    try {
      const u = await base44.auth.me().catch(() => null);
      const res = await base44.functions.invoke("verifyEnrollment", {
        session_id: sessionId,
        course_id: cId,
        user_id: u?.id,
      });
      if (res.data?.enrolled) {
        // check if exam course
        const course = await base44.entities.Course.get(cId).catch(() => null);
        setIsExam(course?.course_type === "exam_simulation");
        setStatus("success");
      } else {
        setStatus("pending");
      }
    } catch {
      setStatus("pending");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-body px-4" dir="rtl">
      <div className="bg-white rounded-2xl border border-gray-200 p-12 max-w-md w-full text-center shadow-sm">
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
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-3">تم الاشتراك بنجاح! 🎉</h2>
            <p className="text-gray-500 text-sm mb-8">يمكنك الآن الوصول الكامل للدورة</p>
            <div className="space-y-3">
              <Link to={courseId ? (isExam ? `/exam/${courseId}` : `/course/${courseId}`) : "/dashboard"}>
                <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white py-5">
                  ابدأ التعلم الآن <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" className="w-full">لوحة التحكم</Button>
              </Link>
            </div>
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
              <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white py-5">الذهاب للوحة التحكم</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { Award, BookOpen, Brain, FileCheck, ArrowLeft, Star, CheckCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const features = [
    { icon: BookOpen, title: "فيديوهات تعليمية احترافية", desc: "محتوى مصوّر عالي الجودة لكل وحدة مع شرح مفصّل للمفاهيم الأساسية" },
    { icon: FileCheck, title: "اختبارات الوحدات", desc: "اختبر فهمك بعد كل وحدة وتتبّع تقدمك بشكل مستمر" },
    { icon: Brain, title: "فلاش كاردز تفاعلية", desc: "بطاقات مراجعة ذكية لترسيخ المصطلحات والمفاهيم بأسلوب ممتع" },
    { icon: Award, title: "محاكاة الامتحان الرسمي", desc: "دورة كاملة تحاكي بيئة الاختبار الحقيقية لتقييم جاهزيتك" },
  ];

  const stats = [
    { value: "1200+", label: "سؤال تدريبي" },
    { value: "300+", label: "فلاش كارد" },
    { value: "16", label: "وحدة تعليمية" },
    { value: "2", label: "مسار احترافي" },
  ];

  return (
    <div className="min-h-screen bg-white font-body" dir="rtl">
      {/* Navbar */}
      <header className="bg-white/95 backdrop-blur border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-700 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-gray-900">SHRM Academy</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link to="/courses" className="hover:text-blue-700 transition-colors font-medium">الدورات</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost" size="sm" className="text-gray-600">تسجيل الدخول</Button></Link>
            <Link to="/register"><Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white">ابدأ الآن</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 text-sm px-4 py-1.5 rounded-full mb-6 border border-white/20">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span>المنصة العربية المتخصصة لشهادات SHRM</span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            احترف الموارد البشرية
            <br />
            <span className="text-blue-300">واحصل على شهادتك الدولية</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            منصة تعليمية متخصصة لإعدادك للنجاح في اختباري <strong className="text-white">SHRM‑CP</strong> و<strong className="text-white">SHRM‑SCP</strong> بمحتوى عربي احترافي وأدوات تعلم تفاعلية متكاملة.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses">
              <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50 px-8 py-6 text-base font-semibold shadow-lg">
                استعرض الدورات
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-8 py-6 text-base">
                سجّل مجاناً
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-blue-700">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-white font-heading">{s.value}</div>
              <div className="text-blue-200 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Certificates */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-3">مساراتنا التعليمية</h2>
            <p className="text-gray-500">دورتان متكاملتان لكل شهادة — اختر المسار المناسب لمستواك</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                type: "SHRM-CP",
                subtitle: "Certified Professional",
                level: "مبتدئ – متوسط",
                color: "blue",
                desc: "للمتخصصين في بداية مسيرتهم أو ذوي الخبرة المتوسطة. يغطي الكفاءات الأساسية والسلوكية في إدارة الموارد البشرية.",
              },
              {
                type: "SHRM-SCP",
                subtitle: "Senior Certified Professional",
                level: "متقدم",
                color: "indigo",
                desc: "للقادة والمديرين ذوي الخبرة العميقة. يركز على الموارد البشرية الاستراتيجية وصنع القرار التنظيمي.",
              }
            ].map((cert) => (
              <div key={cert.type} className={`rounded-2xl border-2 overflow-hidden ${cert.color === 'blue' ? 'border-blue-100' : 'border-indigo-100'}`}>
                <div className={`p-6 ${cert.color === 'blue' ? 'bg-blue-700' : 'bg-indigo-700'}`}>
                  <span className="text-xs font-medium bg-white/20 text-white px-3 py-1 rounded-full">{cert.level}</span>
                  <h3 className="font-heading text-2xl font-bold text-white mt-3">{cert.type}</h3>
                  <p className="text-white/70 text-sm">{cert.subtitle}</p>
                </div>
                <div className="p-6 bg-white">
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{cert.desc}</p>
                  <ul className="space-y-2 mb-6">
                    {["دورة تعليمية شاملة (فيديو + اختبارات + فلاش كاردز)", "دورة محاكاة امتحان مخصصة"].map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${cert.color === 'blue' ? 'text-blue-600' : 'text-indigo-600'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/courses">
                    <Button className={`w-full ${cert.color === 'blue' ? 'bg-blue-700 hover:bg-blue-800' : 'bg-indigo-700 hover:bg-indigo-800'} text-white`}>
                      اكتشف الدورة
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-3">كل ما تحتاجه للنجاح</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="font-heading font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-700">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">ابدأ رحلتك المهنية اليوم</h2>
          <p className="text-blue-200 mb-8">سجّل الآن وابدأ التعلم فوراً</p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-10 py-6 text-base font-semibold">
              سجّل مجاناً
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-6 bg-gray-900 text-center text-gray-500 text-sm">
        © 2026 SHRM Academy — جميع الحقوق محفوظة
      </footer>
    </div>
  );
}
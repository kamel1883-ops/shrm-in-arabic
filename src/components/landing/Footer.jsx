import React from "react";
import { Link } from "react-router-dom";
import SHRMLogo from "@/components/SHRMLogo";

const COLS = [
  { title: "المنصة", links: [
    { label: "الدورات", to: "/courses" },
    { label: "المدونة", to: "/blog" },
    { label: "عن المدرب", to: "/instructor-about" },
  ] },
  { title: "الطالب", links: [
    { label: "تسجيل الدخول", to: "/login" },
    { label: "إنشاء حساب", to: "/register" },
    { label: "لوحة الطالب", to: "/dashboard" },
  ] },
  { title: "الماضي", links: [
    { label: "دليل الشهادات", to: "/certification-guide" },
    { label: "مكتبة المصادر", to: "/resource-library" },
    { label: "صفحة المالك", to: "/owner" },
  ] },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10" style={{ background: "rgba(8,12,25,0.9)" }} dir="rtl">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <SHRMLogo size={48} showText={true} />
          <p className="text-white/40 text-xs mt-4 leading-relaxed">
            منصة تعليمية متخصّصة في التحضير لامتحانات SHRM-CP و SHRM-SCP بالعربية.
          </p>
          <p className="text-white/30 text-xs mt-2">إعداد وتطوير: كامل إسماعيل</p>
        </div>
        {COLS.map(col => (
          <div key={col.title}>
            <h4 className="font-heading font-bold text-white text-sm mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map(l => (
                <li key={l.to}><Link to={l.to} className="text-white/50 hover:text-yellow-400 text-sm transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-5 text-center">
        <p className="text-white/30 text-xs">© 2026 شرم بالعربي · SHRM in Arabic — جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
}
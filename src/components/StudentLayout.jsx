import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SHRMLogo from "@/components/SHRMLogo";
import { LayoutDashboard, Zap, BookOpen, ListTree, BarChart3, Award, Library, User, Bell, LogOut, Store } from "lucide-react";

const NAV = [
  { to: "/dashboard", label: "لوحة الطالب", icon: LayoutDashboard },
  { to: "/flashcards", label: "فلاش كاردز", icon: Zap },
  { to: "/course-outline", label: "قائمة المحتويات", icon: ListTree },
  { to: "/progress-report", label: "تقارير التقدم", icon: BarChart3 },
  { to: "/certification-guide", label: "دليل الشهادات", icon: Award },
  { to: "/resource-library", label: "مكتبة المصادر", icon: Library },
  { to: "/profile", label: "الملف الشخصي", icon: User },
  { to: "/notifications", label: "الإشعارات", icon: Bell },
];

export default function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  async function handleLogout() {
    await base44.auth.logout("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 font-body" dir="rtl">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard"><SHRMLogo size={40} showText={true} /></Link>
          <Link to="/courses" className="flex items-center gap-1.5 text-sm text-blue-700 hover:text-blue-900 font-medium">
            <Store className="w-4 h-4" /> تصفّح الدورات
          </Link>
        </div>
      </header>

      <div className="flex max-w-6xl mx-auto">
        {/* Sidebar */}
        <aside className="w-60 shrink-0 hidden md:block border-l border-gray-100 min-h-[calc(100vh-57px)] bg-white">
          <nav className="p-3 sticky top-[57px]">
            {NAV.map(item => {
              const active = location.pathname === item.to;
              return (
                <Link key={item.to} to={item.to}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm mb-1 transition-all ${active ? "bg-blue-700 text-white font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm mt-2 text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all">
              <LogOut className="w-4 h-4" /> تسجيل الخروج
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
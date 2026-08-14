import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SHRMLogo from "@/components/SHRMLogo";
import { Bell } from "lucide-react";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HomeCourses from "@/components/HomeCourses";
import LearningSystem from "@/components/landing/LearningSystem";
import HowItWorks from "@/components/landing/HowItWorks";
import BlogPreview from "@/components/landing/BlogPreview";
import Testimonials from "@/components/landing/Testimonials";
import Faq from "@/components/landing/Faq";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen font-body" style={{ background: "linear-gradient(160deg,#0a0f1e 0%,#0d1a35 55%,#0a1628 100%)" }} dir="rtl">

      <header className="border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 z-50" style={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(10px)" }}>
        <Link to="/" className="flex items-center gap-3"><SHRMLogo size={44} showText={true} /></Link>
        <div className="flex items-center gap-3">
          <Link to="/blog" className="hidden md:inline text-white/50 hover:text-white text-sm transition-colors">المدونة</Link>
          <Link to="/login"><Button size="sm" variant="outline" className="border-white/20 text-white/70 hover:bg-white/10 text-xs">دخول</Button></Link>
          <Link to="/register"><Button size="sm" className="text-xs font-semibold text-black" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>سجّل الآن</Button></Link>
        </div>
      </header>

      <Hero />

      <div className="max-w-6xl mx-auto px-6 -mt-4">
        <HomeCourses />
      </div>

      <Features />
      <LearningSystem />
      <HowItWorks />
      <BlogPreview />
      <Testimonials />
      <Faq />
      <CTA />
      <Footer />
    </div>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowLeft } from "lucide-react";
import SHRMLogo from "@/components/SHRMLogo";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS } from "@/data/blogPosts";

export default function Blog() {
  const categories = ["الكل", ...Array.from(new Set(BLOG_POSTS.map(p => p.category)))];
  const [active, setActive] = React.useState("الكل");
  const filtered = active === "الكل" ? BLOG_POSTS : BLOG_POSTS.filter(p => p.category === active);

  return (
    <div className="min-h-screen font-body" style={{ background: "linear-gradient(160deg,#0a0f1e 0%,#0d1a35 55%,#0a1628 100%)" }} dir="rtl">
      <header className="border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 z-50" style={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(10px)" }}>
        <Link to="/" className="flex items-center gap-3"><SHRMLogo size={44} showText={true} /></Link>
        <Link to="/"><Button size="sm" variant="outline" className="border-white/20 text-white/70 hover:bg-white/10 text-xs">الرئيسية</Button></Link>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <p className="text-blue-400 text-sm font-medium mb-2">مدونة شرم بالعربي</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">مقالات ومعلومات SHRM</h1>
          <p className="text-white/50 max-w-2xl mx-auto">أدلّة، استراتيجيات، وشروحات معمّقة تساعدك في رحلة التحضير لشهادة SHRM.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={active === cat
                ? { background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#000" }
                : { background: "rgba(13,26,53,0.6)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(post => (
            <Link key={post.slug} to={`/blog/${post.slug}`}
              className="group rounded-2xl border border-white/10 overflow-hidden hover:border-yellow-400/30 transition-all" style={{ background: "rgba(13,26,53,0.5)" }}>
              <div className="h-40 relative flex items-center justify-center" style={{ background: post.gradient }}>
                <span className="text-6xl opacity-90">{post.emoji}</span>
                <span className="absolute top-3 right-3 text-xs bg-black/30 text-white px-2 py-0.5 rounded">{post.category}</span>
              </div>
              <div className="p-6">
                <h3 className="font-heading text-base font-bold text-white mb-2 leading-snug group-hover:text-yellow-400 transition-colors">{post.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-white/30 text-xs">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  <span className="flex items-center gap-1 text-blue-400">قراءة <ArrowLeft className="w-3 h-3" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
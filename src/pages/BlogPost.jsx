import React from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Clock, ArrowRight, ArrowLeft } from "lucide-react";
import SHRMLogo from "@/components/SHRMLogo";
import { Button } from "@/components/ui/button";
import { getPostBySlug, BLOG_POSTS } from "@/data/blogPosts";

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center font-body" style={{ background: "linear-gradient(160deg,#0a0f1e,#0a1628)" }} dir="rtl">
        <div className="text-center">
          <p className="text-white/60 text-lg mb-4">المقال غير موجود</p>
          <Link to="/blog"><Button className="text-black" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>العودة للمدونة</Button></Link>
        </div>
      </div>
    );
  }

  const related = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 2);

  return (
    <div className="min-h-screen font-body" style={{ background: "linear-gradient(160deg,#0a0f1e 0%,#0d1a35 55%,#0a1628 100%)" }} dir="rtl">
      <header className="border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 z-50" style={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(10px)" }}>
        <Link to="/" className="flex items-center gap-3"><SHRMLogo size={44} showText={true} /></Link>
        <Link to="/blog"><Button variant="ghost" size="sm" className="text-white/60 hover:text-white text-xs">كل المقالات</Button></Link>
      </header>

      {/* Cover */}
      <div className="relative h-56 md:h-72 flex items-center justify-center" style={{ background: post.gradient }}>
        <span className="text-7xl md:text-8xl opacity-90">{post.emoji}</span>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent" />
      </div>

      <article className="max-w-3xl mx-auto px-6 py-10">
        <Link to="/blog" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm mb-4">
          <ArrowRight className="w-4 h-4" /> العودة للمدونة
        </Link>

        <span className="inline-block text-xs px-3 py-1 rounded-full mb-3" style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B" }}>
          {post.category}
        </span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
        <div className="flex items-center gap-4 text-white/40 text-sm mb-8 pb-6 border-b border-white/10">
          <span>بقلم كامل إسماعيل</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
        </div>

        <div className="prose prose-invert max-w-none text-white/80 leading-relaxed
          [&_h2]:text-white [&_h2]:font-heading [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-4
          [&_h3]:text-yellow-400 [&_h3]:font-heading [&_h3]:font-bold [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-3
          [&_p]:my-4 [&_p]:text-white/70
          [&_ul]:my-4 [&_ul]:text-white/70 [&_ul]:list-disc [&_ul]:pr-5 [&_li]:my-1
          [&_table]:w-full [&_table]:my-5 [&_table]:border [&_table]:border-white/10 [&_table]:rounded-lg
          [&_th]:bg-white/5 [&_th]:p-3 [&_th]:text-right [&_th]:text-white [&_th]:font-semibold
          [&_td]:p-3 [&_td]:text-right [&_td]:text-white/60 [&_td]:border-t [&_td]:border-white/5
          [&_blockquote]:border-r-4 [&_blockquote]:border-yellow-400/50 [&_blockquote]:bg-white/5 [&_blockquote]:py-2 [&_blockquote]:pr-4 [&_blockquote]:rounded-l-lg [&_blockquote]:text-white/80 [&_blockquote]:italic">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
          {post.tags.map(tag => (
            <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/5 text-white/50 border border-white/10">#{tag}</span>
          ))}
        </div>

        <div className="mt-10">
          <h3 className="font-heading text-lg font-bold text-white mb-4">مقالات ذات صلة</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {related.map(p => (
              <Link key={p.slug} to={`/blog/${p.slug}`}
                className="group rounded-xl border border-white/10 overflow-hidden hover:border-yellow-400/30 transition-all" style={{ background: "rgba(13,26,53,0.5)" }}>
                <div className="h-20 flex items-center justify-center" style={{ background: p.gradient }}>
                  <span className="text-3xl opacity-90">{p.emoji}</span>
                </div>
                <div className="p-4">
                  <p className="font-medium text-white text-sm leading-snug group-hover:text-yellow-400 transition-colors">{p.title}</p>
                  <p className="text-white/30 text-xs mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {p.readTime} <ArrowLeft className="w-3 h-3 mr-auto" /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
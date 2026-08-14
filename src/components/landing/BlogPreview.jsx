import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { BLOG_POSTS } from "@/data/blogPosts";

export default function BlogPreview() {
  const featured = BLOG_POSTS.slice(0, 3);
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="text-blue-400 text-sm font-medium mb-2">المدونة</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">مقالات متميّزة في SHRM</h2>
        </div>
        <Link to="/blog" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium">
          كل المقالات <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {featured.map(post => (
          <Link key={post.slug} to={`/blog/${post.slug}`}
            className="group rounded-2xl border border-white/10 overflow-hidden hover:border-yellow-400/30 transition-all" style={{ background: "rgba(13,26,53,0.5)" }}>
            <div className="h-36 relative flex items-center justify-center" style={{ background: post.gradient }}>
              <span className="text-5xl opacity-90">{post.emoji}</span>
              <span className="absolute top-3 right-3 text-xs bg-black/30 text-white px-2 py-0.5 rounded">{post.category}</span>
            </div>
            <div className="p-5">
              <h3 className="font-heading text-base font-bold text-white mb-2 leading-snug group-hover:text-yellow-400 transition-colors">{post.title}</h3>
              <p className="text-white/50 text-xs leading-relaxed line-clamp-3 mb-3">{post.excerpt}</p>
              <div className="flex items-center gap-1 text-white/30 text-xs"><Clock className="w-3 h-3" /> {post.readTime}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
import React from "react";

export default function SHRMLogo({ size = 40, showText = false }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* Logo Mark */}
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer shield/square */}
        <rect x="2" y="2" width="44" height="44" rx="10" fill="url(#grad1)" />
        {/* Inner border accent */}
        <rect x="4" y="4" width="40" height="40" rx="8" fill="none" stroke="url(#gold)" strokeWidth="1.5" />
        {/* Left accent bar */}
        <rect x="6" y="10" width="4" height="28" rx="2" fill="url(#goldBar)" />
        {/* Arabic شرم text area */}
        <text x="26" y="22" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fontWeight="bold" fill="#F59E0B">شرم</text>
        {/* SHRM below */}
        <text x="26" y="33" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="bold" fill="#93C5FD" letterSpacing="1">SHRM</text>
        {/* Small stars */}
        <circle cx="14" cy="10" r="1.2" fill="#F59E0B" opacity="0.8" />
        <circle cx="38" cy="38" r="1.2" fill="#F59E0B" opacity="0.6" />
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0a1628" />
          </linearGradient>
          <linearGradient id="gold" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="goldBar" x1="0" y1="0" x2="0" y2="28">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-heading font-bold text-yellow-400 text-lg leading-tight">شرم بالعربي</span>
          <span className="text-blue-300 text-xs tracking-widest">SHRM in Arabic</span>
        </div>
      )}
    </div>
  );
}
import React from "react";

/**
 * شعار "شرم بالعربي" — تصميم فخم مستوحى من هوية SHRM الرسمية:
 * كتلة كحلي عميق (SHRM Navy) + كلمة SHRM بيضاء + شريط ذهبي رفيع + حدّ ذهبي شعري.
 * يُستخدم عبر كل الصفحات فيعطي هوية موحّدة على الخلفيات الفاتحة والداكنة.
 */
export default function SHRMLogo({ size = 40, showText = false }) {
  const main = Math.max(13, Math.round(size * 0.42));
  const sub = Math.max(8, Math.round(size * 0.27));

  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="شرم بالعربي">
        <defs>
          <linearGradient id="shrmNavy" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1b3a8c" />
            <stop offset="52%" stopColor="#0a1f56" />
            <stop offset="100%" stopColor="#06143a" />
          </linearGradient>
          <linearGradient id="shrmGold" x1="13" y1="31" x2="35" y2="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F7CE6A" />
            <stop offset="100%" stopColor="#C8941E" />
          </linearGradient>
        </defs>

        {/* كتلة الشعار الكحلية */}
        <rect x="2" y="2" width="44" height="44" rx="11" fill="url(#shrmNavy)" />
        {/* حدّ ذهبي شعيري للفخامة */}
        <rect x="3.4" y="3.4" width="41.2" height="41.2" rx="9.6" fill="none" stroke="#E6B84F" strokeWidth="0.7" opacity="0.6" />

        {/* كلمة SHRM */}
        <text
          x="24" y="27"
          textAnchor="middle"
          fontFamily="'Helvetica Neue', Arial, sans-serif"
          fontSize="14"
          fontWeight="800"
          letterSpacing="0.6"
          fill="#FFFFFF"
        >SHRM</text>

        {/* شريط ذهبي تحت الكلمة */}
        <rect x="13" y="31.2" width="22" height="1.7" rx="0.85" fill="url(#shrmGold)" />

        {/* نقطة ذهبية صغيرة كلمسة فخرفة */}
        <circle cx="24" cy="36.5" r="0.9" fill="#E6B84F" opacity="0.9" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className="font-heading font-extrabold leading-tight"
            style={{ fontSize: `${main}px`, color: "#F59E0B" }}
          >
            شرم بالعربي
          </span>
          <span
            className="font-heading font-semibold tracking-[0.16em] leading-none mt-1"
            style={{ fontSize: `${sub}px`, color: "#3B82F6" }}
          >
            SHRM in Arabic
          </span>
        </div>
      )}
    </div>
  );
}
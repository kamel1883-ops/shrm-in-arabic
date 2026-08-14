// أداة تصدير محتوى عربي إلى ملف Word (.doc) عبر HTML Blob — يعمل في MS Word و Google Docs.
// تُستخدم لتنزيل الدروس والامتحانات كاملةً كنسخة على سطح المكتب.

export function esc(s) {
  return String(s ?? "").replace(/[&<>]/g, (c) =>
    c === "&" ? "&" + "amp;" : c === "<" ? "&" + "lt;" : "&" + "gt;"
  );
}

export function downloadWordDoc(filename, title, htmlBody) {
  const html =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>" +
    `<head><meta charset='utf-8'><title>${esc(title)}</title>` +
    "<style>" +
    "body{font-family:'Arial','Simplified Arabic','Traditional Arabic',sans-serif;font-size:12pt;direction:rtl;text-align:right;}" +
    "h1{font-size:20pt;color:#1b3a8c;margin-bottom:4pt;}" +
    "h2{font-size:14pt;color:#0a1f56;margin-top:14pt;}" +
    "p{margin:5px 0;line-height:1.6;}" +
    ".q{margin-bottom:10pt;border-bottom:1px solid #ddd;padding-bottom:6pt;}" +
    ".correct{color:#15803d;font-weight:bold;}" +
    "hr{border:none;border-top:1px solid #ccc;margin:10pt 0;}" +
    "</style></head>" +
    `<body dir="rtl">${htmlBody}</body></html>`;

  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// خلط ثابت حسب بذرة (seed) — لإنتاج نفس ترتيب الأسئلة في كل مرة لكل رقم امتحان
export function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = Math.max(1, seed | 0);
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
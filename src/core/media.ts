export function isImageFile(value: unknown): boolean {
  if (!value) return false;
  const clean = String(value).split('?')[0].toLowerCase().trim();
  return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].some((ext) => clean.endsWith(ext));
}

export function extractImgSrc(html: string): string | null {
  const match = html.match(/<img\b[^>]*\bsrc\s*=\s*(?:['"]([^'"]+)['"]|([^>\s]+))/i);
  return (match?.[1] || match?.[2] || '').trim() || null;
}

export function stripImgTags(html: string): string {
  return html
    .replace(/<img\b[^>]*(?:>|$)/gi, '')
    .replace(/(<br\s*\/?>(\s|&nbsp;)*)+$/gi, '')
    .trim();
}

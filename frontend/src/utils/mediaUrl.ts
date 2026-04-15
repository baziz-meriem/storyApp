/**
 * Patch image `content` may be an absolute URL, a data URL, or a path like `/uploads/...`
 * from this API (served via dev proxy or production API host).
 */
export function resolveMediaUrl(content: string): string {
  if (!content) return ''
  if (
    content.startsWith('http://') ||
    content.startsWith('https://') ||
    content.startsWith('data:') ||
    content.startsWith('blob:')
  ) {
    return content
  }
  if (content.startsWith('/')) {
    const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''
    return base ? `${base}${content}` : content
  }
  return content
}

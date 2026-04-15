import { API_BASE_URL } from '@/config/api'

/**
 * Patch image `content` may be an absolute URL, a data URL, or a path like `/uploads/...`
 * from this API.
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
    const base = API_BASE_URL.replace(/\/$/, '')
    return `${base}${content}`
  }
  return content
}

import type { Resource } from '../types/api'

export function normalizeResource(r: Resource): { label: string; url: string | null } {
  if (typeof r === 'string') return { label: r, url: null }
  return { label: r.title, url: r.url || null }
}

export function formatDate(iso: string | undefined, lang: 'id' | 'en'): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(d)
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

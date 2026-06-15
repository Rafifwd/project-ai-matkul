import type { Resource } from '../types/api'

/**
 * Backend mengembalikan resources dalam dua format:
 *   - String biasa: "Kaggle Learn"
 *   - Objek: { title: "Kaggle Learn", url: "https://..." }
 *
 * Fungsi ini menormalkan keduanya menjadi { label, url }.
 */
export function normalizeResource(r: Resource): { label: string; url: string | null } {
  if (typeof r === 'string') {
    return { label: r, url: null }
  }
  return { label: r.title, url: r.url || null }
}

/** Render satu item resource sebagai JSX */
export function ResourceItem({
  resource,
  className = '',
}: {
  resource: Resource
  className?: string
}) {
  const { label, url } = normalizeResource(resource)

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`hover:underline transition-colors ${className}`}
      >
        → {label}
      </a>
    )
  }

  return (
    <span className={className}>
      → {label}
    </span>
  )
}

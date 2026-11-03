import type { Resource } from '../../types/api'
import { normalizeResource } from '../../constants/resources'

export default function ResourceList({
  items,
  emptyLabel,
}: {
  items: Resource[]
  emptyLabel: string
}) {
  if (!items || items.length === 0) {
    return <p className="text-[13px] text-ink-faint">{emptyLabel}</p>
  }
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => {
        const res = normalizeResource(item)
        return (
          <li key={`${res.label}-${i}`} className="flex gap-2 text-[13.5px] leading-snug">
            <span aria-hidden="true" className="mt-[0.55em] h-px w-3 shrink-0 bg-[color:var(--rule-strong)]" />
            {res.url ? (
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-quiet text-ink-soft hover:text-ink"
              >
                {res.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <span className="text-ink-soft">{res.label}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

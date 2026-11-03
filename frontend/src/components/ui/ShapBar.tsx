import type { ShapExplanation } from '../../types/api'

interface Row {
  label: string
  value: number
}

export default function ShapBar({
  explanation,
  positiveLabel,
  negativeLabel,
  note,
}: {
  explanation: ShapExplanation
  positiveLabel: string
  negativeLabel: string
  note?: string
}) {
  const positives: Row[] = explanation.top_positive_features.map((f) => ({
    label: f.label,
    value: f.shap_value,
  }))
  const negatives: Row[] = explanation.top_negative_features.map((f) => ({
    label: f.label,
    value: f.shap_value,
  }))

  const all = [...positives, ...negatives]
  if (all.length === 0) return null

  const peak = Math.max(...all.map((r) => Math.abs(r.value)), 0.0001)
  const sorted = [...all].sort((a, b) => Math.abs(b.value) - Math.abs(a.value))

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="label">{positiveLabel}</span>
        <span className="label">{negativeLabel}</span>
      </div>

      <ul className="mt-3 space-y-2.5">
        {sorted.map((row) => {
          const width = (Math.abs(row.value) / peak) * 100
          const positive = row.value >= 0
          return (
            <li key={row.label} className="grid grid-cols-[minmax(0,9.5rem)_1fr_3.6rem] items-center gap-3">
              <span className="truncate text-[12.5px] text-ink-soft" title={row.label}>
                {row.label}
              </span>
              <span className="relative flex h-3.5 items-center bg-[color:var(--paper-deep)]">
                <span
                  className={`absolute top-0 h-full ${positive ? 'left-1/2 bg-signal' : 'right-1/2 bg-alert'}`}
                  style={{
                    width: `${width / 2}%`,
                    transition: 'width 420ms cubic-bezier(0.22,1,0.36,1)',
                  }}
                />
                <span className="absolute inset-y-0 left-1/2 w-px bg-[color:var(--rule-strong)]" />
              </span>
              <span className={`num text-right text-[12px] ${positive ? 'text-signal' : 'text-alert'}`}>
                {positive ? '+' : '−'}
                {Math.abs(row.value).toFixed(3)}
              </span>
            </li>
          )
        })}
      </ul>

      <p className="rule-t mt-4 pt-3 text-[12.5px] leading-relaxed text-ink-faint">
        {note ?? explanation.shap_narrative}
      </p>
    </div>
  )
}

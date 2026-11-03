import { scoreTone } from '../../constants/taxonomy'

const TONE_CLASS: Record<string, string> = {
  verify: 'text-verify',
  signal: 'text-signal',
  amber: 'text-amber',
  alert: 'text-alert',
}

const TONE_FILL: Record<string, string> = {
  verify: 'bg-verify',
  signal: 'bg-signal',
  amber: 'bg-amber',
  alert: 'bg-alert',
}

export function scoreColor(score: number): string {
  return TONE_CLASS[scoreTone(score)]
}

export function ScoreBar({
  value,
  max = 100,
  thickness = 4,
  showTrack = true,
  tone,
}: {
  value: number
  max?: number
  thickness?: number
  showTrack?: boolean
  tone?: 'ink' | 'signal' | 'verify' | 'amber' | 'alert'
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const resolved = tone ?? scoreTone(pct)
  const fill = tone === 'ink' ? 'bg-ink' : TONE_FILL[resolved]
  return (
    <div
      className={showTrack ? 'w-full bg-[color:var(--rule)]' : 'w-full'}
      style={{ height: thickness }}
      role="presentation"
    >
      <div
        className={`h-full ${fill}`}
        style={{ width: `${pct}%`, transition: 'width 420ms cubic-bezier(0.22,1,0.36,1)' }}
      />
    </div>
  )
}

export function ScoreFigure({
  value,
  label,
  size = 'md',
}: {
  value: number
  label: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const tone = scoreTone(value)
  const cls = TONE_CLASS[tone]
  const textSize =
    size === 'lg' ? 'text-6xl md:text-7xl' : size === 'md' ? 'text-4xl' : 'text-2xl'
  return (
    <div>
      <div className={`num ${textSize} ${cls} leading-none`}>
        {value.toFixed(1)}
      </div>
      <div className="label mt-2">{label}</div>
    </div>
  )
}

export function Meter({
  value,
  label,
  detail,
}: {
  value: number
  label: string
  detail?: string
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] text-ink-soft">{label}</span>
        <span className={`num text-[13px] ${scoreColor(value)}`}>{value.toFixed(1)}</span>
      </div>
      <div className="mt-1.5">
        <ScoreBar value={value} thickness={3} />
      </div>
      {detail ? <div className="label mt-1.5">{detail}</div> : null}
    </div>
  )
}

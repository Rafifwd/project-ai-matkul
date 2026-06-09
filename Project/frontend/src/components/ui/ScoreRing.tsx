interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
}

export default function ScoreRing({ score, size = 96, strokeWidth = 8, label }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.max(0, Math.min(100, score))
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const color =
    score >= 75
      ? ['#34d399', '#10b981']
      : score >= 55
      ? ['#38bdf8', '#0ea5e9']
      : score >= 35
      ? ['#fbbf24', '#f59e0b']
      : ['#f87171', '#ef4444']

  const id = `ring-grad-${Math.random().toString(36).slice(2)}`

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color[0]} />
            <stop offset="100%" stopColor={color[1]} />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center" style={{ marginTop: size / 2 - 18 }}>
        {/* Score is overlaid by parent's relative positioning */}
      </div>
      {/* We render text separately outside SVG for better centering */}
      <div className="relative" style={{ marginTop: -(size + (label ? 20 : 4)) }}>
        <div className="flex flex-col items-center justify-center" style={{ height: size, width: size }}>
          <span className="text-2xl font-bold text-slate-800 font-mono">{progress.toFixed(0)}</span>
          <span className="text-xs text-slate-400">/ 100</span>
        </div>
      </div>
      {label && <span className="text-xs text-slate-400 mt-1">{label}</span>}
    </div>
  )
}

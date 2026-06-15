interface HybridScoreBadgeProps {
  ruleScore: number
  mlProbability: number | null
  hybridScore: number
  engineMode: string
}

export default function HybridScoreBadge({
  ruleScore,
  mlProbability,
  hybridScore,
  engineMode,
}: HybridScoreBadgeProps) {
  const color =
    hybridScore >= 75
      ? 'text-emerald-600'
      : hybridScore >= 55
      ? 'text-sky-600'
      : hybridScore >= 35
      ? 'text-amber-600'
      : 'text-red-600'

  const bgColor =
    hybridScore >= 75
      ? 'bg-emerald-50 border-emerald-200'
      : hybridScore >= 55
      ? 'bg-sky-50 border-sky-200'
      : hybridScore >= 35
      ? 'bg-amber-50 border-amber-200'
      : 'bg-red-50 border-red-200'

  const barWidth = Math.min(100, hybridScore)
  const barGradient =
    hybridScore >= 75
      ? 'from-emerald-500 to-teal-400'
      : hybridScore >= 55
      ? 'from-sky-500 to-blue-400'
      : hybridScore >= 35
      ? 'from-amber-500 to-orange-400'
      : 'from-red-500 to-rose-400'

  return (
    <div className={`rounded-xl border p-4 ${bgColor} space-y-3`}>
      {/* Score rows */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 uppercase tracking-wide">Rule Score</span>
          <span className="font-mono font-semibold text-slate-700">{ruleScore.toFixed(1)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 uppercase tracking-wide">ML Prob.</span>
          <span className="font-mono font-semibold text-slate-700">
            {mlProbability !== null ? `${(mlProbability * 100).toFixed(0)}%` : '—'}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200" />

      {/* Hybrid Score */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wide">Hybrid Score</span>
          <div className={`text-2xl font-bold font-mono ${color}`}>{hybridScore.toFixed(1)}</div>
        </div>
        <span
          className={`text-xs font-mono px-2 py-0.5 rounded-full ${
            engineMode === 'hybrid'
              ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
              : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}
        >
          {engineMode}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-white/60 rounded-full overflow-hidden border border-slate-200">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-700`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  )
}

import { useTranslation } from 'react-i18next'

interface SkillBarProps {
  label: string
  current?: number
  required?: number
  weight?: number
  showGap?: boolean
}

export default function SkillBar({ label, current, required, weight, showGap }: SkillBarProps) {
  const { t } = useTranslation('common')
  const displayCurrent = current ?? 0
  const displayRequired = required ?? 0
  const gap = Math.max(0, displayRequired - displayCurrent)
  const isMet = displayCurrent >= displayRequired

  const badgeClass =
    weight !== undefined
      ? weight >= 2.5
        ? 'badge-critical'
        : weight >= 1.5
        ? 'badge-important'
        : 'badge-standard'
      : ''

  const badgeLabel =
    weight !== undefined
      ? weight >= 2.5
        ? t('critical')
        : weight >= 1.5
        ? t('important')
        : t('standard')
      : null

  const dotColor =
    weight !== undefined
      ? weight >= 2.5
        ? 'bg-red-500'
        : weight >= 1.5
        ? 'bg-amber-500'
        : 'bg-slate-400'
      : ''

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-700 font-medium">{label}</span>
        <div className="flex items-center gap-2">
          {badgeLabel && (
            <span className={`${badgeClass} text-xs flex items-center gap-1`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
              {badgeLabel}
            </span>
          )}
          <span className="text-xs font-mono text-slate-500">
            {current !== undefined ? (
              <>
                <span className={isMet ? 'text-emerald-600' : 'text-amber-600'}>{displayCurrent}</span>
                {required !== undefined && (
                  <span className="text-slate-300"> / {displayRequired}</span>
                )}
              </>
            ) : (
              <span>{displayRequired}</span>
            )}
          </span>
        </div>
      </div>

      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
        {/* Required threshold marker */}
        {required !== undefined && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-300 z-10"
            style={{ left: `${displayRequired}%` }}
          />
        )}
        {/* Current value bar */}
        {current !== undefined && (
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isMet ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-orange-400'
            }`}
            style={{ width: `${displayCurrent}%` }}
          />
        )}
        {/* Required bar (shown alone if no current) */}
        {current === undefined && required !== undefined && (
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
            style={{ width: `${displayRequired}%` }}
          />
        )}
      </div>

      {showGap && gap > 0 && (
        <p className="text-xs text-amber-600">{t('needs_improvement', { gap })}</p>
      )}
    </div>
  )
}

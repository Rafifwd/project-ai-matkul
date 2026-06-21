import type { ShapExplanation } from '../../types/api'
import { useTranslation } from 'react-i18next'
import { IconLightbulb } from './Icons'

interface ShapChartProps {
  shap: ShapExplanation
}

export default function ShapChart({ shap }: ShapChartProps) {
  const { t } = useTranslation(['common', 'skills', 'soft_skills', 'interests'])
  const maxAbs = Math.max(
    ...shap.top_positive_features.map(f => Math.abs(f.shap_value)),
    ...shap.top_negative_features.map(f => Math.abs(f.shap_value)),
    1,
  )

  return (
    <div className="space-y-4">
      {/* Narrative */}
      <div className="flex items-start gap-2.5 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
        <IconLightbulb size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-indigo-800 leading-relaxed">
          <span className="font-semibold text-indigo-600">{t('common:ai_explanation')}</span>
          {shap.shap_narrative}
        </p>
      </div>

      {/* Positive features */}
      {shap.top_positive_features.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
            {t('common:supporting_factors')}
          </p>
          <div className="space-y-2">
            {shap.top_positive_features.map(f => (
              <div key={f.feature} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-32 flex-shrink-0 truncate" title={f.label}>
                  {t([`skills:${f.feature}`, `soft_skills:${f.feature}`, `interests:${f.feature}`, f.label])}
                </span>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${(Math.abs(f.shap_value) / maxAbs) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-emerald-600 w-10 text-right">
                  +{f.shap_value.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Negative features */}
      {shap.top_negative_features.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
            {t('common:detracting_factors')}
          </p>
          <div className="space-y-2">
            {shap.top_negative_features.map(f => (
              <div key={f.feature} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-32 flex-shrink-0 truncate" title={f.label}>
                  {t([`skills:${f.feature}`, `soft_skills:${f.feature}`, `interests:${f.feature}`, f.label])}
                </span>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-rose-400 rounded-full transition-all duration-500"
                    style={{ width: `${(Math.abs(f.shap_value) / maxAbs) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-red-600 w-10 text-right">
                  {f.shap_value.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

import type { DiscoveryResult, ValidationResult } from '../types';

type Props = {
  result: Pick<
    DiscoveryResult | ValidationResult,
    'rule_score' | 'ml_probability' | 'hybrid_score' | 'engine_mode' | 'score_breakdown'
  >;
};

export default function HybridScoreBadge({ result }: Props) {
  const { rule_score, ml_probability, hybrid_score, engine_mode, score_breakdown } = result;
  const pct = Math.min(100, Math.max(0, hybrid_score));
  const filled = Math.round(pct / 10);

  return (
    <div className="bg-surface-container border border-outline-variant rounded-lg p-4 space-y-3 text-sm">
      {/* Top row: rule + ml */}
      <div className="flex items-center justify-between text-xs text-on-surface-variant">
        <span>
          Rule Score:{' '}
          <span className="font-semibold text-on-surface">{rule_score.toFixed(1)}</span>
        </span>
        {ml_probability != null ? (
          <span>
            ML Prob:{' '}
            <span className="font-semibold text-on-surface">
              {Math.round(ml_probability * 100)}%
            </span>
          </span>
        ) : (
          <span className="italic text-on-surface-variant/60">ML tidak aktif</span>
        )}
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            engine_mode === 'hybrid'
              ? 'bg-primary/10 text-primary'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {engine_mode === 'hybrid' ? '⚡ Hybrid' : '📐 Rule-Only'}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-outline-variant" />

      {/* Hybrid score */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-on-surface">Hybrid Score</span>
        <span className="font-bold text-lg text-primary">{hybrid_score.toFixed(1)}</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Score breakdown */}
      {score_breakdown && (
        <div className="flex gap-4 text-xs text-on-surface-variant pt-1">
          <span>
            Hard:{' '}
            <span className="font-medium text-on-surface">
              {score_breakdown.hard_skill_score.toFixed(0)}
            </span>
          </span>
          <span>
            Soft:{' '}
            <span className="font-medium text-on-surface">
              {score_breakdown.soft_skill_score.toFixed(0)}
            </span>
          </span>
          <span>
            Minat:{' '}
            <span className="font-medium text-on-surface">
              {score_breakdown.interest_score.toFixed(0)}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
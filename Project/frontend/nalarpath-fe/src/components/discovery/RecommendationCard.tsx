import type { DiscoveryResult } from '../../types';
import { getConfidenceLevel, confidenceConfig } from '../../utils/confidenceHelper';
import ConfidenceBanner from '../common/ConfidenceBanner';
import ProgressBar from '../common/ProgressBar';

interface RecommendationCardProps {
  result: DiscoveryResult;
  rank: number;
}

export default function RecommendationCard({ result, rank }: RecommendationCardProps) {
  const level = getConfidenceLevel(result.score);
  const config = confidenceConfig[level];

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 space-y-4">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-primary text-on-primary text-sm font-bold flex items-center justify-center flex-shrink-0">
            #{rank}
          </span>
          <h3 className="font-heading font-semibold text-on-surface text-lg">
            {result.career}
          </h3>
        </div>

        {/* Score badge */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div
            className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${
              level === 'high'
                ? 'border-secondary'
                : level === 'medium'
                ? 'border-primary'
                : 'border-amber-400'
            }`}
          >
            <span className="font-heading font-bold text-on-surface text-sm">
              {Math.round(result.score)}%
            </span>
          </div>
          <span className="text-xs text-on-surface-variant mt-1">Match</span>
        </div>
      </div>

      {/* Confidence banner */}
      <ConfidenceBanner score={result.score} message={result.confidence_message} />

      {/* Why match */}
      {result.why_match.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">
            ✓ Skill yang sudah memenuhi
          </p>
          <div className="space-y-2">
            {result.why_match.map((item) => (
              <div key={item.skill}>
                <div className="flex justify-between text-xs text-on-surface-variant mb-1">
                  <span>{item.skill.replace(/_/g, ' ')}</span>
                  <span>{item.current} / {item.required}</span>
                </div>
                <ProgressBar value={item.current} max={100} color="secondary" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gaps */}
      {result.gaps.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-error uppercase tracking-wide mb-2">
            ✗ Skill yang perlu ditingkatkan
          </p>
          <div className="space-y-2">
            {result.gaps.slice(0, 3).map((item) => (
              <div key={item.skill}>
                <div className="flex justify-between text-xs text-on-surface-variant mb-1">
                  <span>{item.skill.replace(/_/g, ' ')}</span>
                  <span>{item.current} → {item.required}</span>
                </div>
                <div className="relative h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-error/40 rounded-full"
                    style={{ width: `${item.required}%` }}
                  />
                  <div
                    className="absolute h-full bg-primary rounded-full"
                    style={{ width: `${item.current}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resources */}
      {result.free_resources.length > 0 && (
        <div className="pt-2 border-t border-outline-variant">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">
            Sumber Belajar Gratis
          </p>
          <div className="flex flex-wrap gap-1">
            {result.free_resources.map((r) => (
              <span
                key={r}
                className="text-xs px-2 py-0.5 bg-surface-container rounded-full text-on-surface-variant"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
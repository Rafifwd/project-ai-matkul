import { getConfidenceLevel, confidenceConfig } from '../../utils/confidenceHelper';

interface ConfidenceBannerProps {
  score: number;
  message: string;
}

export default function ConfidenceBanner({ score, message }: ConfidenceBannerProps) {
  const level = getConfidenceLevel(score);
  const config = confidenceConfig[level];

  return (
    <div className={`rounded-lg border px-4 py-3 ${config.bg} ${config.border}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-xs font-semibold uppercase tracking-wide ${config.text}`}>
          {config.label}
        </span>
      </div>
      <p className={`text-sm ${config.text}`}>{message}</p>
    </div>
  );
}
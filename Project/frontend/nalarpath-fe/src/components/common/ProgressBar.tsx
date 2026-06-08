interface ProgressBarProps {
  value: number;      // 0-100
  max?: number;       // default 100
  showLabel?: boolean;
  color?: 'primary' | 'secondary' | 'error';
}

export default function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  color = 'secondary',
}: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);

  const colors = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    error: 'bg-error',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors[color]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-on-surface-variant w-8 text-right">
          {value}
        </span>
      )}
    </div>
  );
}
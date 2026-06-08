import type { SkillGapItem } from '../../types';
import ProgressBar from '../common/ProgressBar';

interface StrengthGapTableProps {
  strengths: SkillGapItem[];
  gaps: SkillGapItem[];
}

export default function StrengthGapTable({ strengths, gaps }: StrengthGapTableProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Kekuatan */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
        <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-4">
          ✓ Kekuatan yang sudah terpenuhi
        </p>
        {strengths.length === 0 ? (
          <p className="text-sm text-on-surface-variant italic">
            Belum ada skill yang memenuhi syarat minimum.
          </p>
        ) : (
          <div className="space-y-3">
            {strengths.map((item) => (
              <div key={item.skill}>
                <div className="flex justify-between text-xs text-on-surface-variant mb-1">
                  <span className="font-medium">{item.skill.replace(/_/g, ' ')}</span>
                  <span>{item.current} / {item.required}</span>
                </div>
                <ProgressBar value={item.current} max={100} color="secondary" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gap */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
        <p className="text-xs font-semibold text-error uppercase tracking-wide mb-4">
          ✗ Kesenjangan yang perlu dikejar
        </p>
        {gaps.length === 0 ? (
          <p className="text-sm text-on-surface-variant italic">
            Tidak ada kesenjangan skill yang kritis.
          </p>
        ) : (
          <div className="space-y-3">
            {gaps.map((item) => (
              <div key={item.skill}>
                <div className="flex justify-between text-xs text-on-surface-variant mb-1">
                  <span className="font-medium">{item.skill.replace(/_/g, ' ')}</span>
                  <span>{item.current} → {item.required} (gap: {item.gap})</span>
                </div>
                <div className="relative h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-error/30 rounded-full"
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
        )}
      </div>

    </div>
  );
}
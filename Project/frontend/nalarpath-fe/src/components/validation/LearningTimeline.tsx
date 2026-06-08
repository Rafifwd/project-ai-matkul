import type { LearningStep } from '../../types';

interface LearningTimelineProps {
  steps: LearningStep[];
}

export default function LearningTimeline({ steps }: LearningTimelineProps) {
  if (steps.length === 0) {
    return (
      <p className="text-sm text-on-surface-variant italic">
        Tidak ada urutan belajar yang perlu ditempuh.
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <div key={step.skill} className="flex gap-4">

          {/* Line & dot */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center flex-shrink-0 z-10">
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className="w-0.5 flex-1 bg-outline-variant my-1" />
            )}
          </div>

          {/* Content */}
          <div className="pb-6 flex-1">
            <p className="font-semibold text-sm text-on-surface mb-0.5">
              {step.skill.replace(/_/g, ' ')}
            </p>
            <p className="text-xs text-on-surface-variant">{step.reason}</p>
          </div>

        </div>
      ))}
    </div>
  );
}
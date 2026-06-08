interface SkillChipProps {
  label: string;
}

export default function SkillChip({ label }: SkillChipProps) {
  return (
    <span className="text-xs font-medium px-3 py-1 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant">
      {label}
    </span>
  );
}
export type ConfidenceLevel = 'low' | 'medium' | 'high';

export const getConfidenceLevel = (score: number): ConfidenceLevel => {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};

export const confidenceConfig: Record<ConfidenceLevel, {
  bg: string;
  text: string;
  border: string;
  label: string;
}> = {
  low: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    label: 'Perlu Banyak Persiapan',
  },
  medium: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    label: 'Cukup Menjanjikan',
  },
  high: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    label: 'Sangat Cocok',
  },
};
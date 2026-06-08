import { useModelInfo } from '../hooks/useModelInfo';

export default function ModelInfoBadge() {
  const { data, isLoading } = useModelInfo();

  if (isLoading) {
    return (
      <div className="text-xs text-on-surface-variant/50 animate-pulse">
        Memuat info model...
      </div>
    );
  }

  if (!data) return null;

  if (!data.available) {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
        <span>⚠️</span>
        <span>Rule-Only Mode — ML belum dilatih</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container border border-outline-variant px-3 py-1.5 rounded-full">
      <span>⚡</span>
      <span className="font-medium text-primary">Hybrid AI v0.3.0</span>
      {data.model_type && (
        <>
          <span className="text-outline-variant">|</span>
          <span>{data.model_type}</span>
        </>
      )}
      {data.cv_accuracy != null && (
        <>
          <span className="text-outline-variant">|</span>
          <span>Akurasi: {(data.cv_accuracy * 100).toFixed(1)}%</span>
        </>
      )}
      {data.sample_count != null && (
        <>
          <span className="text-outline-variant">|</span>
          <span>{data.sample_count.toLocaleString('id-ID')} sampel</span>
        </>
      )}
    </div>
  );
}
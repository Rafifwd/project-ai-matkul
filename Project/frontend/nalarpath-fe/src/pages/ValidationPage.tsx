import { useState } from 'react';
import { useProfileStore } from '../store/useProfileStore';
import { useValidation } from '../hooks/useValidation';
import { useCareers } from '../hooks/useCareers';
import ProfileFormStepper from '../components/discovery/ProfileForm/ProfileFormStepper';
import StrengthGapTable from '../components/validation/StrengthGapTable';
import LearningTimeline from '../components/validation/LearningTimeline';
import ResourceList from '../components/validation/ResourceList';
import ConfidenceBanner from '../components/common/ConfidenceBanner';

export default function ValidationPage() {
  const { profile } = useProfileStore();
  const { data: careers } = useCareers();
  const { mutate, data, isPending, error, reset } = useValidation();
  const [targetCareer, setTargetCareer] = useState('');

  const handleSubmit = () => {
    if (!targetCareer) return;
    mutate({ targetCareer, profile });
  };

  const result = data?.result;

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-on-surface mb-2">
          Validation Mode
        </h1>
        <p className="text-on-surface-variant text-base">
          Uji kesiapanmu untuk karier spesifik yang kamu incar.
        </p>
      </div>

      {/* Form */}
      {!data && (
        <div className="space-y-4">
          {/* Pilih target karier */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Karier yang ingin kamu validasi
            </label>
            <select
              value={targetCareer}
              onChange={(e) => setTargetCareer(e.target.value)}
              className="w-full h-12 px-4 border border-outline-variant rounded-lg text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            >
              <option value="">Pilih karier target...</option>
              {careers?.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Form profil */}
          <ProfileFormStepper
            onSubmit={handleSubmit}
            isLoading={isPending}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-800 text-sm mb-4">
          Gagal memvalidasi. Pastikan backend berjalan dan karier target sudah dipilih.
          <button onClick={() => reset()} className="ml-3 underline font-semibold">
            Coba lagi
          </button>
        </div>
      )}

      {/* Hasil validasi */}
      {result && (
        <div className="space-y-6">

          {/* Header hasil */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading font-semibold text-xl text-on-surface">
                Hasil Validasi: {result.target_career}
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Berikut analisis kesiapanmu untuk karier ini.
              </p>
            </div>
            <button
              onClick={() => reset()}
              className="text-sm text-primary hover:underline font-semibold flex-shrink-0"
            >
              Ubah Profil
            </button>
          </div>

          {/* Score */}
          <div className="flex items-center gap-6 bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
            <div className="w-20 h-20 rounded-full border-4 border-primary flex items-center justify-center flex-shrink-0">
              <span className="font-heading font-bold text-on-surface text-xl">
                {Math.round(result.score)}%
              </span>
            </div>
            <div className="flex-1">
              <p className="font-heading font-semibold text-on-surface mb-2">
                Skor Kesiapan
              </p>
              <ConfidenceBanner
                score={result.score}
                message={result.confidence_message}
              />
            </div>
          </div>

          {/* Strength & Gap */}
          <div>
            <h3 className="font-heading font-semibold text-on-surface mb-3">
              Analisis Skill
            </h3>
            <StrengthGapTable
              strengths={result.fulfilled_strengths}
              gaps={result.critical_gaps}
            />
          </div>

          {/* Learning Timeline */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
            <h3 className="font-heading font-semibold text-on-surface mb-4">
              Roadmap Belajar yang Disarankan
            </h3>
            <LearningTimeline steps={result.recommended_learning_order} />
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-heading font-semibold text-on-surface mb-3">
              Sumber Daya & Portofolio
            </h3>
            <ResourceList
              freeResources={result.free_resources}
              paidResources={result.paid_resources}
              portfolio={result.portfolio}
            />
          </div>

          {/* Ethical notice */}
          <div className="px-4 py-3 bg-surface-container rounded-lg border border-outline-variant text-xs text-on-surface-variant">
            {result.ethical_notice}
          </div>

        </div>
      )}
    </div>
  );
}
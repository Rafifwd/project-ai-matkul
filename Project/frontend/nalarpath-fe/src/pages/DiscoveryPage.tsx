import { useProfileStore } from '../store/useProfileStore';
import { useDiscovery } from '../hooks/useDiscovery';
import ProfileFormStepper from '../components/discovery/ProfileForm/ProfileFormStepper';
import RecommendationCard from '../components/discovery/RecommendationCard';

export default function DiscoveryPage() {
  const { profile } = useProfileStore();
  const { mutate, data, isPending, error, reset } = useDiscovery();

  const handleSubmit = () => {
    mutate({ profile, topN: 3 });
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-on-surface mb-2">
          Discovery Mode
        </h1>
        <p className="text-on-surface-variant text-base">
          Temukan karier yang paling cocok berdasarkan profil dan keahlianmu saat ini.
        </p>
      </div>

      {/* Kalau belum ada hasil, tampilkan form */}
      {!data && (
        <ProfileFormStepper onSubmit={handleSubmit} isLoading={isPending} />
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-800 text-sm mb-4">
          Gagal menganalisis. Pastikan backend berjalan.
          <button
            onClick={() => reset()}
            className="ml-3 underline font-semibold"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Hasil rekomendasi */}
      {data && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-xl text-on-surface">
              Hasil Rekomendasi
            </h2>
            <button
              onClick={() => reset()}
              className="text-sm text-primary hover:underline font-semibold"
            >
              Ubah Profil
            </button>
          </div>

          {/* Ethical notice */}
          <div className="px-4 py-3 bg-surface-container rounded-lg border border-outline-variant text-xs text-on-surface-variant">
            {data.ethical_notice}
          </div>

          {/* Recommendation cards */}
          <div className="space-y-4">
            {data.results.map((result, index) => (
              <RecommendationCard
                key={result.career}
                result={result}
                rank={index + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
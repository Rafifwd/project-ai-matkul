import { useProfileStore } from '../../../store/useProfileStore';

export default function StepAcademic() {
  const { profile, setProfile } = useProfileStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-semibold text-xl text-on-surface mb-1">
          Informasi Akademik
        </h2>
        <p className="text-sm text-on-surface-variant">
          Ceritakan sedikit tentang latar belakang kuliahmu.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-1">
            Jurusan
          </label>
          <input
            type="text"
            value={profile.major ?? ''}
            onChange={(e) => setProfile({ major: e.target.value })}
            placeholder="contoh: Teknik Informatika, Manajemen, Psikologi..."
            className="w-full h-12 px-4 border border-outline-variant rounded-lg text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-on-surface mb-1">
            Semester saat ini
          </label>
          <select
            value={profile.semester ?? ''}
            onChange={(e) => setProfile({ semester: Number(e.target.value) })}
            className="w-full h-12 px-4 border border-outline-variant rounded-lg text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          >
            <option value="">Pilih semester</option>
            {Array.from({ length: 14 }, (_, i) => i + 1).map((s) => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-on-surface mb-1">
            Minat bidang karier
          </label>
          <input
            type="text"
            value={profile.preferences?.field_interest ?? ''}
            onChange={(e) =>
              setProfile({ preferences: { ...profile.preferences, field_interest: e.target.value } })
            }
            placeholder="contoh: Software Development, Data Science, Business..."
            className="w-full h-12 px-4 border border-outline-variant rounded-lg text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
import { useProfileStore } from '../../../store/useProfileStore';

// ─── Data ──────────────────────────────────────────────────────────────────

const SOFT_SKILLS: { key: string; label: string; emoji: string }[] = [
  { key: 'attention_to_detail',     label: 'Perhatian terhadap Detail', emoji: '🔍' },
  { key: 'intellectual_curiosity',  label: 'Rasa Ingin Tahu Intelektual', emoji: '🧠' },
  { key: 'innovation',              label: 'Inovatif', emoji: '💡' },
  { key: 'tolerance_for_ambiguity', label: 'Toleransi Ketidakpastian', emoji: '🌊' },
  { key: 'critical_thinking',       label: 'Berpikir Kritis', emoji: '⚖️' },
  { key: 'communication',           label: 'Komunikasi', emoji: '💬' },
  { key: 'integrity',               label: 'Integritas', emoji: '🛡️' },
  { key: 'dependability',           label: 'Dapat Diandalkan', emoji: '🤝' },
  { key: 'leadership',              label: 'Kepemimpinan', emoji: '🎯' },
  { key: 'cooperation',             label: 'Kerja Sama Tim', emoji: '👥' },
  { key: 'stress_tolerance',        label: 'Tahan Tekanan', emoji: '💪' },
  { key: 'adaptability',            label: 'Adaptif', emoji: '🔄' },
  { key: 'curiosity',               label: 'Rasa Ingin Tahu', emoji: '🌟' },
  { key: 'cautiousness',            label: 'Kehati-hatian', emoji: '🧩' },
  { key: 'perseverance',            label: 'Ketekunan', emoji: '🏃' },
  { key: 'originality',             label: 'Orisinalitas / Kreativitas', emoji: '🎨' },
];

const INTERESTS: { key: string; label: string; emoji: string }[] = [
  { key: 'mathematics_statistics',    label: 'Matematika & Statistika', emoji: '📐' },
  { key: 'information_technology',    label: 'Teknologi Informasi', emoji: '💻' },
  { key: 'investigative',             label: 'Investigatif / Analitis', emoji: '🔬' },
  { key: 'conventional',              label: 'Terstruktur / Prosedural', emoji: '📋' },
  { key: 'engineering',               label: 'Rekayasa / Engineering', emoji: '⚙️' },
  { key: 'management_administration', label: 'Manajemen & Administrasi', emoji: '🗂️' },
  { key: 'business_initiatives',      label: 'Inisiatif Bisnis', emoji: '📈' },
  { key: 'enterprising',              label: 'Wirausaha / Enterprising', emoji: '🚀' },
  { key: 'marketing_advertising',     label: 'Pemasaran & Periklanan', emoji: '📣' },
  { key: 'finance',                   label: 'Keuangan', emoji: '💰' },
  { key: 'accounting',                label: 'Akuntansi', emoji: '🧾' },
  { key: 'visual_arts',               label: 'Seni Visual', emoji: '🖼️' },
  { key: 'applied_arts_and_design',   label: 'Desain & Seni Terapan', emoji: '✏️' },
  { key: 'media',                     label: 'Media & Komunikasi', emoji: '📡' },
  { key: 'artistic',                  label: 'Artistik / Kreatif', emoji: '🎭' },
];

// ─── Component ─────────────────────────────────────────────────────────────

export default function StepSoftSkills() {
  const { profile, toggleSoftSkill, toggleInterest } = useProfileStore();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading font-semibold text-xl text-on-surface mb-1">
          Karakter & Minat
        </h2>
        <p className="text-sm text-on-surface-variant">
          Centang yang mencerminkan dirimu. Tidak ada jawaban benar/salah — ini membantu AI memahami kecocokan lebih dalam.
        </p>
      </div>

      {/* Soft Skills */}
      <div>
        <h3 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">S</span>
          Soft Skills — Pilih yang sesuai denganmu
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {SOFT_SKILLS.map((item) => {
            const checked = profile.soft_skills.includes(item.key);
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleSoftSkill(item.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-colors ${
                  checked
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-outline-variant bg-surface-container text-on-surface-variant hover:border-primary/50'
                }`}
              >
                <span className="text-base flex-shrink-0">{item.emoji}</span>
                <span className="leading-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interests */}
      <div>
        <h3 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs">M</span>
          Minat / Domain — Apa yang paling menarik bagimu?
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {INTERESTS.map((item) => {
            const checked = profile.interests.includes(item.key);
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleInterest(item.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-colors ${
                  checked
                    ? 'border-secondary bg-secondary/10 text-secondary font-medium'
                    : 'border-outline-variant bg-surface-container text-on-surface-variant hover:border-secondary/50'
                }`}
              >
                <span className="text-base flex-shrink-0">{item.emoji}</span>
                <span className="leading-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-on-surface-variant">
        {profile.soft_skills.length} soft skill · {profile.interests.length} minat dipilih
        {profile.soft_skills.length === 0 && profile.interests.length === 0 && (
          <span className="ml-1 text-amber-600">(opsional — jika kosong, AI menggunakan skor netral)</span>
        )}
      </p>
    </div>
  );
}
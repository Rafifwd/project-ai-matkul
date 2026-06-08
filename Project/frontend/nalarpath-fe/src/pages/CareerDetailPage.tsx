import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCareerDetail } from '../hooks/useCareerDetail';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SkillChip from '../components/common/SkillChip';
import RadarSkillChart from '../components/catalog/RadarSkillChart';

export default function CareerDetailPage() {
  const { careerName } = useParams<{ careerName: string }>();
  const navigate = useNavigate();
  const decoded = decodeURIComponent(careerName ?? '');
  const { data: career, isLoading, error } = useCareerDetail(decoded);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-800 text-sm">
        Gagal memuat detail karier. Pastikan backend berjalan.
      </div>
    );
  }

  if (!career) {
    return null;
  }

  return (
    <div className="max-w-4xl">
      <button
        onClick={() => navigate('/catalog')}
        className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Kembali ke Katalog
      </button>

      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-on-surface mb-2">
          {career.name}
        </h1>
        {career.source_basis && (
          <p className="text-xs text-primary">
            Sumber: O*NET {career.source_basis.onet_code} — {career.source_basis.primary_onet_occupation}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
          <h2 className="font-heading font-semibold text-on-surface text-lg mb-4">
            Kebutuhan Hard Skills
          </h2>
          <RadarSkillChart skills={career.hard_skills} />
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
          <h2 className="font-heading font-semibold text-on-surface text-lg mb-4">
            Soft Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {career.soft_skills.map((skill) => (
              <SkillChip key={skill} label={skill.replace(/_/g, ' ')} />
            ))}
          </div>

          <h2 className="font-heading font-semibold text-on-surface text-lg mt-6 mb-3">
            Mata Kuliah Relevan
          </h2>
          <ul className="space-y-2">
            {career.related_courses.map((course) => (
              <li key={course} className="flex items-center gap-2 text-sm text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {course}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
          <h2 className="font-heading font-semibold text-on-surface text-lg mb-4">
            Learning Path Standar
          </h2>
          <ol className="space-y-3">
            {career.learning_path.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-sm text-on-surface-variant">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
          <h2 className="font-heading font-semibold text-on-surface text-lg mb-4">
            Saran Portofolio
          </h2>
          <ul className="space-y-2 mb-6">
            {career.portfolio.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0 mt-1.5" />
                {item}
              </li>
            ))}
          </ul>

          <h2 className="font-heading font-semibold text-on-surface text-lg mb-3">
            Sumber Belajar
          </h2>
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">
            Gratis
          </p>
          <ul className="space-y-1 mb-4">
            {career.resources?.free.map((r) => (
              <li key={r} className="text-sm text-secondary">• {r}</li>
            ))}
          </ul>
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">
            Berbayar
          </p>
          <ul className="space-y-1">
            {career.resources?.paid.map((r) => (
              <li key={r} className="text-sm text-on-surface-variant">• {r}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
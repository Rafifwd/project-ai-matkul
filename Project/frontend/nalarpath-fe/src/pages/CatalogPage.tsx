import { useCareers } from '../hooks/useCareers';
import CareerGrid from '../components/catalog/CareerGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function CatalogPage() {
  const { data: careers, isLoading, error } = useCareers();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-on-surface mb-2">
          Career Catalog
        </h1>
        <p className="text-on-surface-variant text-base">
          Explore high-growth career paths, understand required skills, and discover your next professional milestone.
        </p>
      </div>

      {/* Content */}
      {isLoading && <LoadingSpinner />}

      {error && (
        <div className="rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-error text-sm">
          Gagal memuat data karier. Pastikan backend berjalan di{' '}
          <code className="font-mono">{import.meta.env.VITE_API_BASE_URL}</code>.
        </div>
      )}

      {careers && <CareerGrid careers={careers} />}
    </div>
  );
}
interface ResourceListProps {
  freeResources: string[];
  paidResources: string[];
  portfolio: string[];
}

export default function ResourceList({ freeResources, paidResources, portfolio }: ResourceListProps) {
  return (
    <div className="space-y-6">

      {/* Portfolio */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">
          Saran Portofolio
        </p>
        <ul className="space-y-2">
          {portfolio.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-on-surface-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Gratis */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
          <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-3">
            Sumber Belajar Gratis
          </p>
          <ul className="space-y-2">
            {freeResources.map((r) => (
              <li key={r} className="flex items-center gap-2 text-sm text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Berbayar */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">
            Sumber Belajar Berbayar
          </p>
          <ul className="space-y-2">
            {paidResources.map((r) => (
              <li key={r} className="flex items-center gap-2 text-sm text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-outline flex-shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
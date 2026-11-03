import { Link } from 'react-router-dom'
import { useCopy } from '../../session'

export default function Foot() {
  const { t } = useCopy()
  return (
    <footer className="mt-20 border-t border-[color:var(--rule)]">
      <div className="mx-auto max-w-sheet px-5 py-10 md:px-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <span className="display text-2xl">NalarPath</span>
            <p className="mt-2 max-w-[46ch] text-[13px] leading-relaxed text-ink-faint">
              {t('home.footnote')}
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/catalog" className="text-[13px] text-ink-soft hover:text-ink">
              {t('nav.catalog')}
            </Link>
            <Link to="/map" className="text-[13px] text-ink-soft hover:text-ink">
              {t('nav.discover')}
            </Link>
            <Link to="/validate" className="text-[13px] text-ink-soft hover:text-ink">
              {t('nav.validate')}
            </Link>
            <Link to="/engine" className="text-[13px] text-ink-soft hover:text-ink">
              {t('nav.model')}
            </Link>
          </nav>
        </div>

        <div className="rule-t mt-8 flex flex-wrap items-center justify-between gap-3 pt-5">
          <span className="label">Universitas Padjadjaran — Informatika</span>
          <span className="label">Hybrid rule + ML · SHAP</span>
        </div>
      </div>
    </footer>
  )
}

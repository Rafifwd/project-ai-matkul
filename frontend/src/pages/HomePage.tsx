import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCopy } from '../session'
import { getCareers, getModelInfo } from '../api/client'
import type { CareerListItem, ModelInfo } from '../types/api'
import { Reveal } from '../components/ui/Reveal'
import { pad2 } from '../constants/resources'
import { labelFor } from '../constants/taxonomy'

export default function HomePage() {
  const { t, lang } = useCopy()
  const [careers, setCareers] = useState<CareerListItem[] | null>(null)
  const [model, setModel] = useState<ModelInfo | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    Promise.all([getCareers(), getModelInfo()])
      .then(([c, m]) => {
        if (!active) return
        setCareers(c)
        setModel(m)
      })
      .catch(() => active && setFailed(true))
    return () => {
      active = false
    }
  }, [])

  const featureCount = careers
    ? new Set(careers.flatMap((c) => Object.keys(c.hard_skills))).size
    : null

  return (
    <div className="mx-auto max-w-sheet px-5 md:px-10">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="grid gap-10 border-b border-[color:var(--rule)] pb-14 pt-10 md:grid-cols-[1.35fr_0.65fr] md:gap-16 md:pb-20 md:pt-16">
        <div>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-ink" />
            <span className="label !text-[9.5px] !text-ink">{t('home.eyebrow')}</span>
          </div>

          <h1 className="display mt-7 text-[clamp(3.1rem,9.2vw,7rem)]">
            {t('home.title.a')}
            <br />
            <em className="italic">{t('home.title.b')}</em>
          </h1>

          <p className="mt-7 max-w-[54ch] text-[15.5px] leading-[1.65] text-ink-soft">
            {t('home.lede')}
          </p>

          <div className="mt-9 flex flex-wrap items-stretch gap-0">
            <Link to="/map" className="btn !px-6 !py-3">
              {t('home.cta.map')}
              <span aria-hidden="true">→</span>
            </Link>
            <Link to="/catalog" className="btn-quiet !border-l-0 !px-6 !py-3">
              {t('home.cta.catalog')}
            </Link>
          </div>
        </div>

        <aside className="self-end">
          <dl className="space-y-0">
            {[
              { k: t('home.stat.careers'), v: careers ? String(careers.length).padStart(2, '0') : '—' },
              { k: t('home.stat.features'), v: featureCount ? String(featureCount) : '—' },
              {
                k: t('home.stat.reliability'),
                v: model?.available && model.cv_accuracy ? `${(model.cv_accuracy * 100).toFixed(1)}%` : '—',
              },
            ].map((row, i) => (
              <div
                key={row.k}
                className={`flex items-baseline justify-between gap-4 py-3.5 ${
                  i === 0 ? 'border-t border-[color:var(--rule)]' : ''
                } border-b border-[color:var(--rule)]`}
              >
                <dt className="label !text-[9.5px]">{row.k}</dt>
                <dd className="num text-2xl text-ink">{row.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[12px] leading-relaxed text-ink-faint">
            {model?.available
              ? `${model.model_type} · ${model.sample_count?.toLocaleString('id-ID')} ${lang === 'id' ? 'sampel' : 'samples'}`
              : t('engine.degraded')}
          </p>
        </aside>
      </section>

      {/* ── Method ───────────────────────────────────────────────── */}
      <Reveal>
        <section className="border-b border-[color:var(--rule)] py-12 md:py-16">
          <div className="flex items-baseline justify-between gap-6">
            <h2 className="display text-[clamp(1.9rem,4vw,2.9rem)]">{t('home.section.method')}</h2>
            <span className="label hidden sm:block">01 — 03</span>
          </div>

          <ol className="mt-9 grid gap-px bg-[color:var(--rule)] md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <li key={n} className="bg-[color:var(--paper)] pr-0 md:pr-7">
                <div className="flex items-baseline gap-3 pt-5 md:pt-0">
                  <span className="num text-[11px] text-ink-faint">{pad2(n)}</span>
                  <h3 className="text-[15px] font-semibold tracking-tight">
                    {t(`home.method.${n}.title`)}
                  </h3>
                </div>
                <p className="mt-2.5 max-w-[38ch] pb-5 text-[13.5px] leading-relaxed text-ink-soft md:pb-0">
                  {t(`home.method.${n}.body`)}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      {/* ── Tracks ───────────────────────────────────────────────── */}
      <Reveal>
        <section className="border-b border-[color:var(--rule)] py-12 md:py-16">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="display text-[clamp(1.9rem,4vw,2.9rem)]">{t('home.section.roles')}</h2>
            <Link to="/catalog" className="link-quiet label !text-ink">
              {t('nav.catalog')} →
            </Link>
          </div>
          <p className="mt-3 max-w-[62ch] text-[13.5px] leading-relaxed text-ink-faint">
            {t('home.roles.note')}
          </p>

          {failed ? (
            <p className="mt-8 border border-[color:var(--alert)] px-4 py-3 text-[13px] text-alert">
              {t('common.error')}
            </p>
          ) : careers === null ? (
            <ul className="mt-8 space-y-px bg-[color:var(--rule)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="h-14 animate-pulse bg-[color:var(--paper)]" />
              ))}
            </ul>
          ) : (
            <ul className="mt-8 border-t border-[color:var(--rule)]">
              {careers.map((career, i) => (
                <li key={career.name}>
                  <Link
                    to={`/catalog/${encodeURIComponent(career.name)}`}
                    className="group flex items-center gap-4 border-b border-[color:var(--rule)] py-3.5 transition-colors hover:bg-[color:var(--paper-deep)] md:gap-7"
                  >
                    <span className="num w-7 shrink-0 text-[11px] text-ink-faint">
                      {pad2(i + 1)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium tracking-tight transition-colors group-hover:text-signal">
                        {career.name}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] text-ink-faint">
                        {career.hard_skills
                          ? Object.keys(career.hard_skills)
                              .slice(0, 3)
                              .map((k) => labelFor(k, lang))
                              .join(' · ')
                          : ''}
                      </span>
                    </span>
                    <span className="num hidden shrink-0 text-[11px] text-ink-faint sm:block">
                      {career.onet_code ?? '—'}
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-signal"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </Reveal>

      {/* ── Engine status ────────────────────────────────────────── */}
      <Reveal>
        <section className="py-12 md:py-16">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="display text-[clamp(1.9rem,4vw,2.9rem)]">{t('home.section.engine')}</h2>
            <Link to="/engine" className="link-quiet label !text-ink">
              {t('nav.model')} →
            </Link>
          </div>

          <div className="mt-7 grid gap-px bg-[color:var(--rule)] sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: t('engine.type'), v: model?.model_type ?? '—' },
              {
                k: t('engine.accuracy'),
                v: model?.cv_accuracy ? `${(model.cv_accuracy * 100).toFixed(1)}%` : '—',
              },
              {
                k: t('engine.f1'),
                v: model?.cv_f1_macro ? model.cv_f1_macro.toFixed(3) : '—',
              },
              { k: t('engine.classes'), v: model?.class_count ? String(model.class_count) : '—' },
            ].map((row) => (
              <div key={row.k} className="bg-[color:var(--paper)] px-4 py-5">
                <span className="label">{row.k}</span>
                <div className="num mt-2 text-xl text-ink">{row.v}</div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  )
}

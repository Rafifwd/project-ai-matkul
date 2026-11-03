import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCopy } from '../session'
import { getCareerDetail } from '../api/client'
import type { CareerDetail } from '../types/api'
import { labelFor, weightTier } from '../constants/taxonomy'
import { ScoreBar } from '../components/ui/Score'
import ResourceList from '../components/ui/ResourceList'
import { Reveal } from '../components/ui/Reveal'

function Section({
  label,
  title,
  children,
}: {
  label: string
  title?: string
  children: React.ReactNode
}) {
  return (
    <section className="rule-t py-8 first:border-t-0 first:pt-0">
      <span className="label">{label}</span>
      {title ? <h2 className="mt-1.5 text-[17px] font-semibold tracking-tight">{title}</h2> : null}
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default function CareerPage() {
  const { name = '' } = useParams()
  const { t, lang } = useCopy()
  const [career, setCareer] = useState<CareerDetail | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    setCareer(null)
    setFailed(false)
    getCareerDetail(name)
      .then((c) => active && setCareer(c))
      .catch(() => active && setFailed(true))
    return () => {
      active = false
    }
  }, [name])

  if (failed) {
    return (
      <div className="mx-auto max-w-sheet px-5 py-16 md:px-10">
        <p className="label">{t('common.index')}</p>
        <h1 className="display mt-4 text-5xl">{name}</h1>
        <p className="mt-4 border border-[color:var(--alert)] px-4 py-3 text-[13px] text-alert">
          {t('common.error')}
        </p>
        <Link to="/catalog" className="link-quiet mt-6 inline-block text-[13px]">
          ← {t('nav.catalog')}
        </Link>
      </div>
    )
  }

  if (!career) {
    return (
      <div className="mx-auto max-w-sheet px-5 py-16 md:px-10">
        <div className="h-3 w-24 animate-pulse bg-[color:var(--rule)]" />
        <div className="mt-6 h-14 w-2/3 animate-pulse bg-[color:var(--rule)]" />
        <div className="mt-10 grid gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-4 animate-pulse bg-[color:var(--rule)]" />
          ))}
        </div>
      </div>
    )
  }

  const skills = Object.entries(career.hard_skills ?? {}).sort(
    (a, b) => (career.skill_weights?.[b[0]] ?? 1) - (career.skill_weights?.[a[0]] ?? 1),
  )
  const tasks = career.onet_evidence && typeof career.onet_evidence === 'object'
    ? career.onet_evidence.top_tasks ?? career.onet_evidence.representative_tasks ?? []
    : []
  const knowledge = career.onet_evidence && typeof career.onet_evidence === 'object'
    ? career.onet_evidence.top_knowledge ?? []
    : []
  const interestAreas = career.onet_evidence && typeof career.onet_evidence === 'object'
    ? career.onet_evidence.top_interest_areas ?? []
    : []

  return (
    <div className="mx-auto max-w-sheet px-5 md:px-10">
      <div className="pt-7">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink hover:underline"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 12 8"
            className="h-2 w-2.5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <path d="M11 4H1M4.2 1 1.2 4l3 3" />
          </svg> {t('nav.catalog')}
        </Link>
      </div>

      <header className="grid gap-10 border-b border-[color:var(--rule)] pb-11 pt-7 md:grid-cols-[1.4fr_0.6fr] md:gap-16">
        <div>
          <span className="label">{t('detail.lede')}</span>
          <h1 className="display mt-3 text-[clamp(2.6rem,7vw,5rem)]">{career.name}</h1>
          {career.source_basis?.primary_onet_occupation ? (
            <p className="mt-4 max-w-[56ch] text-[14px] leading-relaxed text-ink-soft">
              {career.source_basis.primary_onet_occupation}
              {career.source_basis.onet_code ? (
                <>
                  {' · '}
                  <a
                    href={
                      career.source_basis.source_url ??
                      `https://www.onetonline.org/link/summary/${career.source_basis.onet_code}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="num link-quiet text-[12.5px]"
                  >
                    {career.source_basis.onet_code}
                  </a>
                </>
              ) : null}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col justify-end gap-3">
          <Link
            to={`/validate?career=${encodeURIComponent(career.name)}`}
            className="btn w-full !py-3"
          >
            {t('detail.validate')}
          </Link>
          <Link to="/map" className="btn-quiet w-full !py-3">
            {t('detail.discover')}
          </Link>
        </div>
      </header>

      <div className="grid gap-10 py-10 md:grid-cols-[minmax(0,1fr)_20rem] md:gap-16 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <div>
          <Section label={`01 — ${t('detail.requirements')}`}>
            <p className="mb-5 text-[13px] leading-relaxed text-ink-faint">
              {t('detail.requirements.note')}
            </p>
            <ul className="space-y-4">
              {skills.map(([key, level]) => {
                const weight = career.skill_weights?.[key] ?? 1
                const tier = weightTier(weight)
                return (
                  <li key={key}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span className="text-[14px] font-medium">{labelFor(key, lang)}</span>
                      <span className="flex items-baseline gap-3">
                        <span className="label !text-[9px]">{lang === 'id' ? tier.id : tier.idEn}</span>
                        <span className="num text-[13px] text-ink-soft">
                          {level}
                          <span className="text-ink-faint"> / 100</span>
                        </span>
                        <span className="num text-[11px] text-ink-faint">×{weight.toFixed(1)}</span>
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <ScoreBar value={level} thickness={3} tone="ink" />
                    </div>
                  </li>
                )
              })}
            </ul>
          </Section>

          {career.learning_path && career.learning_path.length > 0 ? (
            <Section label={`02 — ${t('detail.path')}`}>
              <ol className="space-y-3">
                {career.learning_path.map((step, i) => {
                  const skill = typeof step === 'string' ? step : step.skill
                  const reason = typeof step === 'string' ? null : step.reason
                  return (
                    <li key={`${skill}-${i}`} className="grid grid-cols-[2rem_1fr] gap-3">
                      <span className="num pt-0.5 text-[11px] text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <span className="text-[14px]">{labelFor(skill, lang)}</span>
                        {reason ? (
                          <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-faint">{reason}</p>
                        ) : null}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </Section>
          ) : null}

          {career.portfolio && career.portfolio.length > 0 ? (
            <Section label={`03 — ${t('detail.portfolio')}`}>
              <ul className="space-y-2">
                {career.portfolio.map((item, i) => (
                  <li key={i} className="flex gap-3 text-[13.5px] leading-relaxed text-ink-soft">
                    <span aria-hidden="true" className="mt-[0.6em] h-px w-4 shrink-0 bg-[color:var(--rule-strong)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {tasks.length > 0 ? (
            <Section label={`04 — ${t('detail.evidence')}`} title={t('detail.tasks')}>
              <ul className="space-y-2">
                {tasks.slice(0, 8).map((task, i) => (
                  <li key={i} className="flex gap-3 text-[13px] leading-relaxed text-ink-soft">
                    <span className="num mt-0.5 shrink-0 text-[10.5px] text-ink-faint">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {task}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
        </div>

        <aside className="md:sticky md:top-20 md:self-start">
          <div className="panel p-5">
            <span className="label">{t('detail.soft')}</span>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {(career.soft_skills ?? []).map((s) => (
                <li key={s} className="border border-[color:var(--rule-strong)] px-2 py-1 text-[11.5px] text-ink-soft">
                  {labelFor(s, lang)}
                </li>
              ))}
            </ul>

            <div className="rule-t mt-5 pt-4">
              <span className="label">{t('detail.interests')}</span>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {(career.interests ?? []).map((s) => (
                  <li key={s} className="border border-[color:var(--rule-strong)] px-2 py-1 text-[11.5px] text-ink-soft">
                    {labelFor(s, lang)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rule-t mt-5 pt-4">
              <span className="label">{t('detail.courses')}</span>
              <ul className="mt-3 space-y-1.5">
                {(career.related_courses ?? []).map((c) => (
                  <li key={c} className="text-[12.5px] leading-snug text-ink-soft">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="panel mt-4 p-5">
            <span className="label">{t('detail.free')}</span>
            <div className="mt-3">
              <ResourceList items={career.resources?.free ?? []} emptyLabel={t('common.empty')} />
            </div>
            <div className="rule-t mt-4 pt-4">
              <span className="label">{t('detail.paid')}</span>
              <div className="mt-3">
                <ResourceList items={career.resources?.paid ?? []} emptyLabel={t('common.empty')} />
              </div>
            </div>
          </div>

          {knowledge.length > 0 || interestAreas.length > 0 ? (
            <div className="panel mt-4 p-5">
              <span className="label">O*NET</span>
              {knowledge.length > 0 ? (
                <div className="mt-3">
                  <span className="label !text-[9px]">{lang === 'id' ? 'Pengetahuan' : 'Knowledge'}</span>
                  <ul className="mt-1.5 space-y-1">
                    {knowledge.slice(0, 6).map((k) => (
                      <li key={k} className="text-[12px] text-ink-soft">{k}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {interestAreas.length > 0 ? (
                <div className="rule-t mt-3 pt-3">
                  <span className="label !text-[9px]">{lang === 'id' ? 'Area minat' : 'Interest areas'}</span>
                  <ul className="mt-1.5 space-y-1">
                    {interestAreas.slice(0, 6).map((k) => (
                      <li key={k} className="text-[12px] text-ink-soft">{k}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {career.source_basis?.notebook_data_note ? (
            <Reveal>
              <p className="mt-4 text-[11px] leading-relaxed text-ink-faint">
                {career.source_basis.notebook_data_note}
              </p>
            </Reveal>
          ) : null}
        </aside>
      </div>
    </div>
  )
}

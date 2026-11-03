import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCopy, useSession } from '../session'
import { analyzeCareer } from '../api/client'
import type { AnalyzeResponse, DiscoveryResult } from '../types/api'
import PageHead from '../components/ui/PageHead'
import { ContextStep, SkillsStep, SoftStep, InterestsStep, ProfileSummary } from '../components/ProfileSteps'
import { pad2 } from '../constants/resources'
import { labelFor } from '../constants/taxonomy'
import { ScoreFigure, Meter } from '../components/ui/Score'
import ShapBar from '../components/ui/ShapBar'

const STEPS = ['map.step.1', 'map.step.2', 'map.step.3', 'map.step.4'] as const

export default function MapPage() {
  const { t } = useCopy()
  const { profile, patchProfile, lang } = useSession()
  const [step, setStep] = useState(0)
  const [topN, setTopN] = useState(5)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)

  const rated = useMemo(() => Object.keys(profile.skills).length, [profile.skills])

  const run = async () => {
    setBusy(true)
    setError(null)
    try {
      const res = await analyzeCareer(profile, topN, lang)
      setResult(res)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setError(t('map.error'))
    } finally {
      setBusy(false)
    }
  }

  if (result) {
    return <MapResults response={result} onEdit={() => setResult(null)} onRerun={run} busy={busy} />
  }

  return (
    <div className="mx-auto max-w-sheet px-5 md:px-10">
      <PageHead
        eyebrow={t('nav.discover')}
        title={t('map.title')}
        lede={t('map.lede')}
      />

      <div className="grid gap-10 py-10 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-14">
        <nav aria-label="Steps" className="md:sticky md:top-20 md:self-start">
          <ol className="space-y-0">
            {STEPS.map((key, i) => {
              const active = i === step
              const done = i < step
              return (
                <li key={key} className="border-t border-[color:var(--rule)] last:border-b">
                  <button
                    type="button"
                    onClick={() => setStep(i)}
                    aria-current={active ? 'step' : undefined}
                    className={`flex w-full items-baseline gap-3 py-2.5 text-left transition-colors ${
                      active ? 'text-ink' : 'text-ink-faint hover:text-ink-soft'
                    }`}
                  >
                    <span className={`num text-[10.5px] ${active ? 'text-signal' : ''}`}>
                      {pad2(i + 1)}
                    </span>
                    <span className={`text-[13px] ${active ? 'font-medium' : ''}`}>{t(key)}</span>
                    {done ? (
                      <span aria-hidden="true" className="ml-auto text-[11px] text-verify">
                        ✓
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ol>

          <div className="mt-6">
            <label htmlFor="topn" className="label">
              {t('map.topn')}
            </label>
            <select
              id="topn"
              className="field mt-2 !py-1.5 text-[13px]"
              value={topN}
              onChange={(e) => setTopN(Number(e.target.value))}
            >
              {[3, 5, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </nav>

        <div>
          <div>
            {step === 0 ? <ContextStep profile={profile} patch={patchProfile} /> : null}
            {step === 1 ? <SkillsStep profile={profile} patch={patchProfile} /> : null}
            {step === 2 ? <SoftStep profile={profile} patch={patchProfile} /> : null}
            {step === 3 ? <InterestsStep profile={profile} patch={patchProfile} /> : null}
          </div>

          {error ? (
            <p role="alert" className="mt-6 border border-[color:var(--alert)] px-4 py-3 text-[13px] text-alert">
              {error}
            </p>
          ) : null}

          <div className="rule-t mt-8 flex flex-wrap items-center justify-between gap-3 pt-5">
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-quiet"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0 || busy}
              >
                ← {t('map.prev')}
              </button>
              {step < STEPS.length - 1 ? (
                <button type="button" className="btn" onClick={() => setStep((s) => s + 1)}>
                  {t('map.next')} →
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-4">
              <span className="label hidden sm:block">
                {rated} {t('map.skills.rated')}
              </span>
              {step === STEPS.length - 1 ? (
                <button type="button" className="btn" onClick={run} disabled={busy}>
                  {busy ? t('map.running') : t('map.run')}
                </button>
              ) : null}
            </div>
          </div>

          <details className="mt-8 border-t border-[color:var(--rule)] pt-5">
            <summary className="label cursor-pointer !text-ink">{t('map.review')}</summary>
            <div className="mt-5">
              <ProfileSummary profile={profile} />
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}

function MapResults({
  response,
  onEdit,
  onRerun,
  busy,
}: {
  response: AnalyzeResponse
  onEdit: () => void
  onRerun: () => void
  busy: boolean
}) {
  const { t, lang } = useCopy()

  return (
    <div className="mx-auto max-w-sheet px-5 md:px-10">
      <div className="flex flex-wrap items-center justify-between gap-3 pt-7">
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
        <div className="flex gap-2">
          <button type="button" className="btn-quiet !py-1.5" onClick={onEdit}>
            ← {t('result.again')}
          </button>
          <button type="button" className="btn !py-1.5" onClick={onRerun} disabled={busy}>
            {busy ? t('map.running') : t('map.run')}
          </button>
        </div>
      </div>

      <PageHead
        eyebrow={t('result.title')}
        title={response.results[0]?.career ?? t('result.empty.title')}
        lede={
          response.results.length > 1
            ? `${t('result.hybrid')} ${response.results[0].hybrid_score.toFixed(1)} · ${response.results
                .slice(1, 4)
                .map((r) => r.career)
                .join(' · ')}`
            : response.results[0]?.confidence_message ?? ''
        }
        meta={[
          {
            label: t('engine.type'),
            value: response.model_info.available ? (response.model_info.model_type ?? '—') : 'rule-only',
          },
          {
            label: t('result.confidence'),
            value: response.model_info.cv_accuracy
              ? `${(response.model_info.cv_accuracy * 100).toFixed(1)}%`
              : '—',
          },
          { label: t('catalog.count'), value: String(response.results.length).padStart(2, '0') },
        ]}
      />

      <ol className="py-10">
        {response.results.map((r, i) => (
          <li key={r.career} className="border-t border-[color:var(--rule)] py-9 first:border-t-0 first:pt-0">
            <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_18rem] md:gap-14">
              <div>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="num text-[11px] text-ink-faint">{pad2(i + 1)}</span>
                  {i === 0 ? (
                    <span className="label !text-ink">{t('result.top')}</span>
                  ) : (
                    <h2 className="text-[clamp(1.25rem,2.4vw,1.6rem)] font-semibold tracking-tight">
                      {r.career}
                    </h2>
                  )}
                  <span className="label ml-auto shrink-0">{r.engine_mode}</span>
                </div>

                <p className="mt-3 max-w-[64ch] text-[13.5px] leading-relaxed text-ink-soft">
                  {r.narrative}
                </p>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <span className="label">{t('result.strengths')}</span>
                    {r.why_match.length === 0 ? (
                      <p className="mt-2 text-[12.5px] text-ink-faint">{t('common.empty')}</p>
                    ) : (
                      <ul className="mt-2.5 space-y-1.5">
                        {r.why_match.slice(0, 5).map((s) => (
                          <li key={s.skill} className="flex items-baseline justify-between gap-3">
                            <span className="text-[13px] text-ink-soft">{labelFor(s.skill, lang)}</span>
                            <span className="num text-[11.5px] text-verify">✓ {s.current}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <span className="label">{t('result.gaps')}</span>
                    {r.gaps.length === 0 ? (
                      <p className="mt-2 text-[12.5px] text-verify">{t('common.empty')}</p>
                    ) : (
                      <ul className="mt-2.5 space-y-1.5">
                        {r.gaps.slice(0, 5).map((g) => (
                          <li key={g.skill} className="flex items-baseline justify-between gap-3">
                            <span className="text-[13px] text-ink-soft">{labelFor(g.skill, lang)}</span>
                            <span className="num text-[11.5px] text-alert">
                              −{g.gap ?? Math.max(0, g.required - g.current)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <Link
                    to={`/catalog/${encodeURIComponent(r.career)}`}
                    className="link-quiet text-[12.5px] text-ink"
                  >
                    {t('result.detail')} →
                  </Link>
                  <Link
                    to={`/validate?career=${encodeURIComponent(r.career)}`}
                    className="link-quiet text-[12.5px] text-ink"
                  >
                    {t('nav.validate')} →
                  </Link>
                </div>
              </div>

              <div className="md:border-l md:border-[color:var(--rule)] md:pl-8">
                <ScoreStack result={r} />
              </div>
            </div>

            {r.shap_explanation ? (
              <div className="mt-8">
                <ShapSection explanation={r.shap_explanation} />
              </div>
            ) : null}
          </li>
        ))}
      </ol>

      <p className="rule-t py-6 text-[11.5px] leading-relaxed text-ink-faint">
        {response.ethical_notice}
      </p>
    </div>
  )
}

function ScoreStack({ result }: { result: DiscoveryResult }) {
  const { t } = useCopy()
  const breakdown = result.score_breakdown

  return (
    <div>
      <ScoreFigure value={result.hybrid_score} label={t('result.hybrid')} size="lg" />

      <dl className="mt-6 space-y-2.5">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="label !text-[9.5px]">{t('result.rule')}</dt>
          <dd className="num text-[13px] text-ink-soft">{result.rule_score.toFixed(1)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="label !text-[9.5px]">{t('result.ml')}</dt>
          <dd className="num text-[13px] text-ink-soft">
            {result.ml_probability === null ? '—' : `${(result.ml_probability * 100).toFixed(1)}%`}
          </dd>
        </div>
      </dl>

      {breakdown ? (
        <div className="rule-t mt-5 space-y-3 pt-4">
          <span className="label">{t('result.breakdown')}</span>
          <Meter value={breakdown.hard_skill_score} label={t('result.hard')} />
          <Meter value={breakdown.soft_skill_score} label={t('result.soft')} />
          <Meter value={breakdown.interest_score} label={t('result.interest')} />
        </div>
      ) : null}

      <p className="rule-t mt-5 pt-4 text-[11.5px] leading-relaxed text-ink-faint">
        {result.confidence_message}
      </p>
    </div>
  )
}

function ShapSection({ explanation }: { explanation: NonNullable<DiscoveryResult['shap_explanation']> }) {
  const { t } = useCopy()
  return (
    <div className="panel p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="label !text-ink">{t('result.explain')}</span>
        <span className="label">{t('result.ml')}</span>
      </div>
      <div className="mt-4">
        <ShapBar
          explanation={explanation}
          positiveLabel={t('result.raise')}
          negativeLabel={t('result.lower')}
          note={t('result.explain.note')}
        />
      </div>
    </div>
  )
}

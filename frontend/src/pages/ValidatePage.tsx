import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCopy, useSession } from '../session'
import { getCareers, validateTargetCareer } from '../api/client'
import type { CareerListItem, ValidateResponse } from '../types/api'
import PageHead from '../components/ui/PageHead'
import { ContextStep, SkillsStep, SoftStep, InterestsStep } from '../components/ProfileSteps'
import { labelFor, scoreTone } from '../constants/taxonomy'
import { ScoreBar, ScoreFigure } from '../components/ui/Score'
import ShapBar from '../components/ui/ShapBar'
import ResourceList from '../components/ui/ResourceList'
import { pad2 } from '../constants/resources'

export default function ValidatePage() {
  const { t, lang } = useCopy()
  const { profile, patchProfile } = useSession()
  const [params, setParams] = useSearchParams()
  const initialTarget = params.get('career') ?? ''

  const [careers, setCareers] = useState<CareerListItem[] | null>(null)
  const [target, setTarget] = useState(initialTarget)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ValidateResponse | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    let active = true
    getCareers()
      .then((c) => active && setCareers(c))
      .catch(() => active && setError(t('common.error')))
    return () => {
      active = false
    }
  }, [t])

  useEffect(() => {
    if (initialTarget) setTarget(initialTarget)
  }, [initialTarget])

  const run = async () => {
    if (!target) {
      setError(t('validate.pickFirst'))
      return
    }
    setBusy(true)
    setError(null)
    try {
      const res = await validateTargetCareer(target, profile, lang)
      setResult(res)
      setParams({ career: target }, { replace: true })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setError(t('validate.error'))
    } finally {
      setBusy(false)
    }
  }

  if (result) {
    return <ValidateResult response={result} onEdit={() => setResult(null)} />
  }

  return (
    <div className="mx-auto max-w-sheet px-5 md:px-10">
      <PageHead eyebrow={t('nav.validate')} title={t('validate.title')} lede={t('validate.lede')} />

      <div className="grid gap-10 py-10 md:grid-cols-[20rem_minmax(0,1fr)] md:gap-14">
        <div className="md:sticky md:top-20 md:self-start">
          <label htmlFor="target" className="label">
            {t('validate.target')}
          </label>
          <select
            id="target"
            className="field mt-2"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          >
            <option value="">—</option>
            {(careers ?? []).map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <button type="button" className="btn mt-4 w-full !py-3" onClick={run} disabled={busy || !target}>
            {busy ? t('validate.running') : t('validate.run')}
          </button>

          {error ? (
            <p role="alert" className="mt-4 border border-[color:var(--alert)] px-3 py-2 text-[12.5px] text-alert">
              {error}
            </p>
          ) : null}

          <div className="rule-t mt-6 pt-5">
            <button
              type="button"
              className="label !text-ink"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((v) => !v)}
            >
              {profileOpen ? '−' : '+'} {t('map.review')}
            </button>
            {profileOpen ? (
              <div className="mt-5">
                <ContextStep profile={profile} patch={patchProfile} />
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <div className="grid gap-8">
            <div>
              <span className="label">01 — {t('map.step.2')}</span>
              <div className="mt-4">
                <SkillsStep profile={profile} patch={patchProfile} />
              </div>
            </div>
            <div className="rule-t pt-8">
              <span className="label">02 — {t('map.step.3')}</span>
              <div className="mt-4">
                <SoftStep profile={profile} patch={patchProfile} />
              </div>
            </div>
            <div className="rule-t pt-8">
              <span className="label">03 — {t('map.step.4')}</span>
              <div className="mt-4">
                <InterestsStep profile={profile} patch={patchProfile} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ValidateResult({
  response,
  onEdit,
}: {
  response: ValidateResponse
  onEdit: () => void
}) {
  const { t, lang } = useCopy()
  const r = response.result
  const gaps = r.critical_gaps ?? []
  const strengths = r.fulfilled_strengths ?? []
  const tone = scoreTone(r.hybrid_score)

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
        <button type="button" className="btn-quiet !py-1.5" onClick={onEdit}>
          ← {t('result.again')}
        </button>
      </div>

      <header className="grid gap-10 border-b border-[color:var(--rule)] pb-11 pt-7 md:grid-cols-[1.35fr_0.65fr] md:gap-16">
        <div>
          <span className="label">{t('validate.verdict')}</span>
          <h1 className="display mt-3 text-[clamp(2.4rem,6.5vw,4.4rem)]">{r.target_career}</h1>
          <p className="mt-5 max-w-[58ch] text-[14.5px] leading-relaxed text-ink-soft">
            {r.narrative ?? r.confidence_message}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <span className="label">{t('result.rule')}</span>
              <div className="num mt-1 text-lg">{r.rule_score.toFixed(1)}</div>
            </div>
            <div>
              <span className="label">{t('result.ml')}</span>
              <div className="num mt-1 text-lg">
                {r.ml_probability === null ? '—' : `${(r.ml_probability * 100).toFixed(1)}%`}
              </div>
            </div>
            <div>
              <span className="label">{t('engine.type')}</span>
              <div className="mt-1 text-[13px]">{r.engine_mode}</div>
            </div>
          </div>
        </div>

        <div className="self-end md:border-l md:border-[color:var(--rule)] md:pl-10">
          <ScoreFigure value={r.hybrid_score} label={t('result.hybrid')} size="lg" />
          {r.score_breakdown ? (
            <div className="mt-6 space-y-2.5">
              {[
                [t('result.hard'), r.score_breakdown.hard_skill_score],
                [t('result.soft'), r.score_breakdown.soft_skill_score],
                [t('result.interest'), r.score_breakdown.interest_score],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[12px] text-ink-soft">{label}</span>
                    <span className="num text-[11.5px] text-ink-faint">
                      {(value as number).toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-1">
                    <ScoreBar value={value as number} thickness={3} />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          <p className={`mt-5 text-[11.5px] leading-relaxed ${tone === 'alert' ? 'text-alert' : 'text-ink-faint'}`}>
            {r.confidence_message}
          </p>
        </div>
      </header>

      <div className="grid gap-10 py-10 md:grid-cols-[minmax(0,1fr)_20rem] md:gap-14">
        <div>
          {gaps.length > 0 ? (
            <section className="rule-t py-8 first:border-t-0 first:pt-0">
              <div className="flex items-baseline justify-between gap-4">
                <span className="label !text-ink">{t('validate.gaps')}</span>
                <span className="num text-[11px] text-ink-faint">{gaps.length}</span>
              </div>
              <ul className="mt-5 space-y-4">
                {gaps.map((g) => (
                  <li key={g.skill}>
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <span className="text-[14px] font-medium">{labelFor(g.skill, lang)}</span>
                      <span className="num text-[12px]">
                        <span className={scoreTone(g.current) === 'alert' ? 'text-alert' : 'text-ink-soft'}>
                          {g.current}
                        </span>
                        <span className="text-ink-faint"> → {g.required}</span>
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <ScoreBar value={g.current} thickness={3} tone="signal" />
                      <span className="num w-8 shrink-0 text-right text-[11px] text-alert">
                        −{g.gap ?? Math.max(0, g.required - g.current)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {strengths.length > 0 ? (
            <section className="rule-t py-8">
              <span className="label !text-ink">{t('validate.strengths')}</span>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {strengths.map((s) => (
                  <li key={s.skill} className="inline-flex items-baseline gap-2 text-[13px]">
                    <span className="text-verify" aria-hidden="true">✓</span>
                    <span className="text-ink-soft">{labelFor(s.skill, lang)}</span>
                    <span className="num text-[11px] text-ink-faint">{s.current}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {r.recommended_learning_order.length > 0 ? (
            <section className="rule-t py-8">
              <span className="label !text-ink">{t('validate.order')}</span>
              <p className="mt-1.5 text-[12px] text-ink-faint">{t('validate.order.note')}</p>
              <ol className="mt-5 space-y-4">
                {r.recommended_learning_order.map((step, i) => {
                  const gapItem = gaps.find((g) => g.skill === step.skill)
                  const detail = gapItem
                    ? lang === 'id'
                      ? `Celah ${gapItem.gap ?? gapItem.required - gapItem.current} poin dari minimum ${gapItem.required}. Bobot prioritas ${gapItem.weight ?? 1}×.`
                      : `Gap of ${gapItem.gap ?? gapItem.required - gapItem.current} points from the ${gapItem.required} threshold. Priority weight ${gapItem.weight ?? 1}×.`
                    : step.reason
                  return (
                    <li key={`${step.skill}-${i}`} className="grid grid-cols-[2rem_1fr] gap-3">
                      <span className="num pt-0.5 text-[11px] text-ink-faint">{pad2(i + 1)}</span>
                      <div>
                        <span className="text-[14px] font-medium">{labelFor(step.skill, lang)}</span>
                        <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-faint">{detail}</p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </section>
          ) : null}

          {r.portfolio?.length ? (
            <section className="rule-t py-8">
              <span className="label !text-ink">{t('validate.portfolio')}</span>
              <ul className="mt-4 space-y-2">
                {r.portfolio.map((p, i) => (
                  <li key={i} className="flex gap-3 text-[13.5px] leading-relaxed text-ink-soft">
                    <span aria-hidden="true" className="mt-[0.6em] h-px w-4 shrink-0 bg-[color:var(--rule-strong)]" />
                    {p}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {r.shap_explanation ? (
            <section className="rule-t py-8">
              <span className="label !text-ink">{t('result.explain')}</span>
              <div className="mt-4">
                <ShapBar
                  explanation={r.shap_explanation}
                  positiveLabel={t('result.raise')}
                  negativeLabel={t('result.lower')}
                  note={t('result.explain.note')}
                />
              </div>
            </section>
          ) : null}
        </div>

        <aside>
          <div className="panel p-5">
            <span className="label">{t('validate.resources')}</span>
            <div className="mt-3">
              <span className="label !text-[9px]">{t('detail.free')}</span>
              <div className="mt-1.5">
                <ResourceList items={r.free_resources ?? []} emptyLabel={t('common.empty')} />
              </div>
            </div>
            <div className="rule-t mt-4 pt-4">
              <span className="label !text-[9px]">{t('detail.paid')}</span>
              <div className="mt-1.5">
                <ResourceList items={r.paid_resources ?? []} emptyLabel={t('common.empty')} />
              </div>
            </div>
          </div>

          <Link
            to={`/catalog/${encodeURIComponent(r.target_career)}`}
            className="btn-quiet mt-4 w-full !py-2.5"
          >
            {t('result.detail')} →
          </Link>

          {r.ethical_notice ? (
            <p className="mt-4 text-[11px] leading-relaxed text-ink-faint">{r.ethical_notice}</p>
          ) : null}
        </aside>
      </div>
    </div>
  )
}

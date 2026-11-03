import { useCallback, useEffect, useRef, useState } from 'react'
import { useCopy } from '../session'
import { getModelInfo, getTrainingStatus, triggerTraining } from '../api/client'
import type { ModelInfo, TrainingStatus } from '../types/api'
import PageHead from '../components/ui/PageHead'
import { formatDate } from '../constants/resources'
import { Reveal } from '../components/ui/Reveal'

export default function EnginePage() {
  const { t, lang } = useCopy()
  const [model, setModel] = useState<ModelInfo | null>(null)
  const [status, setStatus] = useState<TrainingStatus | null>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const timer = useRef<number | null>(null)

  const load = useCallback(async () => {
    try {
      const [m, s] = await Promise.all([getModelInfo(), getTrainingStatus()])
      setModel(m)
      setStatus(s)
    } catch {
      setNotice(t('common.error'))
    }
  }, [t])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const active = status?.status === 'training' || status?.status === 'generating_data' || status?.status === 'started'
    if (!active) {
      if (timer.current) window.clearTimeout(timer.current)
      return
    }
    timer.current = window.setTimeout(() => void load(), 2500)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [status, load])

  const retrain = async () => {
    setBusy(true)
    setNotice(null)
    try {
      const r = await triggerTraining(lang)
      setNotice(r.message)
      await load()
    } catch {
      setNotice(t('engine.prodGuard'))
    } finally {
      setBusy(false)
    }
  }

  const metrics = model?.available
    ? [
        { k: t('engine.type'), v: model.model_type ?? '—' },
        { k: t('engine.accuracy'), v: model.cv_accuracy ? `${(model.cv_accuracy * 100).toFixed(1)}%` : '—' },
        { k: t('engine.f1'), v: model.cv_f1_macro ? model.cv_f1_macro.toFixed(3) : '—' },
        { k: t('engine.samples'), v: model.sample_count ? model.sample_count.toLocaleString('id-ID') : '—' },
        { k: t('engine.classes'), v: model.class_count ? String(model.class_count) : '—' },
        { k: t('engine.trained'), v: formatDate(model.training_date, lang) },
      ]
    : []

  return (
    <div className="mx-auto max-w-sheet px-5 md:px-10">
      <PageHead
        eyebrow={t('nav.model')}
        title={t('engine.title')}
        lede={t('engine.lede')}
        aside={
          <div className="panel px-4 py-3">
            <span className="label">{t('engine.available')}</span>
            <div className="mt-1.5 flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${model?.available ? 'bg-verify' : 'bg-alert'}`}
              />
              <span className="text-[13px]">
                {model?.available ? t('engine.available') : t('engine.absent')}
              </span>
            </div>
          </div>
        }
      />

      <div className="grid gap-10 py-10 md:grid-cols-[minmax(0,1fr)_19rem] md:gap-14">
        <div>
          {model?.available ? (
            <>
              <section>
                <span className="label">01 — {t('engine.status')}</span>
                <dl className="mt-5 grid gap-px bg-[color:var(--rule)] sm:grid-cols-2 lg:grid-cols-3">
                  {metrics.map((m) => (
                    <div key={m.k} className="bg-[color:var(--paper)] px-4 py-5">
                      <dt className="label">{m.k}</dt>
                      <dd className="num mt-2 text-xl">{m.v}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              {model.class_names && model.class_names.length > 0 ? (
                <Reveal>
                  <section className="rule-t mt-10 pt-8">
                    <span className="label">02 — {t('engine.classNames')}</span>
                    <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                      {model.class_names.map((c, i) => (
                        <li key={c} className="flex items-baseline gap-3 text-[13px]">
                          <span className="num text-[10.5px] text-ink-faint">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-ink-soft">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </Reveal>
              ) : null}

              {model.feature_names && model.feature_names.length > 0 ? (
                <Reveal>
                  <section className="rule-t mt-10 pt-8">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="label">03 — {t('engine.features')}</span>
                      <span className="num text-[11px] text-ink-faint">{model.feature_names.length}</span>
                    </div>
                    <p className="mt-4 max-h-40 overflow-y-auto font-mono text-[11.5px] leading-relaxed text-ink-faint">
                      {model.feature_names.join(' · ')}
                    </p>
                  </section>
                </Reveal>
              ) : null}
            </>
          ) : (
            <section className="border border-[color:var(--rule)] p-6">
              <p className="max-w-[56ch] text-[13.5px] leading-relaxed text-ink-soft">
                {t('engine.degraded')}
              </p>
            </section>
          )}
        </div>

        <aside className="md:sticky md:top-20 md:self-start">
          <div className="panel p-5">
            <span className="label">{t('engine.status')}</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[15px] font-medium">
                {status ? t(`engine.states.${status.status}`) : '—'}
              </span>
              {status?.job_id ? (
                <span className="num text-[10.5px] text-ink-faint">{status.job_id.slice(0, 8)}</span>
              ) : null}
            </div>

            <button
              type="button"
              className="btn mt-4 w-full !py-2.5"
              onClick={retrain}
              disabled={busy}
            >
              {busy ? t('engine.retraining') : t('engine.retrain')}
            </button>

            <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">{t('engine.prodGuard')}</p>

            {notice ? (
              <p role="status" className="rule-t mt-4 pt-3 text-[11.5px] leading-relaxed text-ink-soft">
                {notice}
              </p>
            ) : null}
          </div>

          <div className="panel mt-4 p-5">
            <span className="label">{t('home.section.method')}</span>
            <p className="mt-2 text-[11.5px] leading-relaxed text-ink-faint">
              {t('engine.degraded')}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { getModelInfo, triggerTraining, getTrainingStatus } from '../api/client'
import type { ModelInfo, TrainingStatus } from '../types/api'
import {
  IconZap,
  IconRefresh,
  IconRocket,
  IconLayers,
  IconTarget,
  IconBarChart,
  IconDatabase,
  IconBox,
  IconGrid,
  IconAlertTriangle,
  IconCheckCircle,
} from '../components/ui/Icons'

const STATUS_LABELS: Record<TrainingStatus['status'], string> = {
  idle: 'Tidak ada aktivitas',
  started: 'Dimulai…',
  generating_data: 'Membuat data sintetis…',
  training: 'Melatih model ML…',
  completed: 'Selesai',
  failed: 'Gagal',
}

const STATUS_COLORS: Record<TrainingStatus['status'], string> = {
  idle: 'text-slate-500',
  started: 'text-sky-600',
  generating_data: 'text-amber-600',
  training: 'text-indigo-600',
  completed: 'text-emerald-600',
  failed: 'text-red-600',
}

const STATUS_PROGRESS: Record<TrainingStatus['status'], number> = {
  idle: 0,
  started: 5,
  generating_data: 30,
  training: 70,
  completed: 100,
  failed: 100,
}

export default function ModelInfoPage() {
  const { t } = useTranslation(['model', 'common'])
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null)
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus | null>(null)
  const [loadingInfo, setLoadingInfo] = useState(true)
  const [triggering, setTriggering] = useState(false)
  const [triggerMsg, setTriggerMsg] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetchModelInfo()
    fetchTrainingStatus()
  }, [])

  // Poll training status while running
  useEffect(() => {
    const isRunning =
      trainingStatus?.status === 'started' ||
      trainingStatus?.status === 'generating_data' ||
      trainingStatus?.status === 'training'

    if (isRunning) {
      if (!pollRef.current) {
        pollRef.current = setInterval(async () => {
          const status = await getTrainingStatus().catch(() => null)
          if (status) {
            setTrainingStatus(status)
            if (status.status === 'completed' || status.status === 'failed') {
              clearInterval(pollRef.current!)
              pollRef.current = null
              // Refresh model info on completion
              if (status.status === 'completed') {
                fetchModelInfo()
              }
            }
          }
        }, 2000)
      }
    } else {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [trainingStatus?.status])

  async function fetchModelInfo() {
    setLoadingInfo(true)
    getModelInfo()
      .then(setModelInfo)
      .catch(() => setModelInfo(null))
      .finally(() => setLoadingInfo(false))
  }

  async function fetchTrainingStatus() {
    getTrainingStatus()
      .then(setTrainingStatus)
      .catch(() => {})
  }

  async function handleTriggerTraining() {
    setTriggering(true)
    setTriggerMsg(null)
    try {
      const res = await triggerTraining()
      setTriggerMsg(`Job ID: ${res.job_id} — ${res.message}`)
      // Immediately refresh status
      const status = await getTrainingStatus()
      setTrainingStatus(status)
    } catch {
      setTriggerMsg(t('model:training_failed_msg'))
    } finally {
      setTriggering(false)
    }
  }

  const isTraining =
    trainingStatus?.status === 'started' ||
    trainingStatus?.status === 'generating_data' ||
    trainingStatus?.status === 'training'

  const progress = trainingStatus ? STATUS_PROGRESS[trainingStatus.status] : 0

  const MODEL_STATS = [
    {
      label: t('model:accuracy', 'Akurasi CV'),
      value: modelInfo?.cv_accuracy != null
        ? `${(modelInfo.cv_accuracy * 100).toFixed(1)}%`
        : '—',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
      Icon: IconTarget,
    },
    {
      label: t('model:f1_score', 'F1-Score'),
      value: modelInfo?.cv_f1_macro != null
        ? `${(modelInfo.cv_f1_macro * 100).toFixed(1)}%`
        : '—',
      color: 'text-sky-600',
      bg: 'bg-sky-50 border-sky-100',
      Icon: IconBarChart,
    },
    {
      label: t('model:trained_samples', 'Data Training'),
      value: modelInfo?.sample_count?.toLocaleString() ?? '—',
      color: 'text-violet-600',
      bg: 'bg-violet-50 border-violet-100',
      Icon: IconDatabase,
    },
    {
      label: t('model:supported_classes', 'Kelas Karier'),
      value: modelInfo?.class_count?.toString() ?? '—',
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-100',
      Icon: IconGrid,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
            <IconZap size={20} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{t('model:title')}</h1>
        </div>
        <p className="text-slate-500">
          {t('model:subtitle')}
        </p>
      </div>

      {/* Model Info Card */}
      <div className="glass-card p-6">
        <h2 className="section-title">{t('model:model_details')}</h2>

        {loadingInfo ? (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <span className="text-slate-500 text-sm">{t('model:loading')}</span>
          </div>
        ) : modelInfo ? (
          <div className="space-y-4">
            {/* Status badge */}
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${
                  modelInfo.available
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    modelInfo.available ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`}
                />
                {modelInfo.available ? t('model:model_active') : t('model:model_not_ready')}
              </div>
              {modelInfo.model_type && (
                <span className="badge badge-info font-mono">{modelInfo.model_type}</span>
              )}
            </div>

            {modelInfo.available ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {MODEL_STATS.map(item => (
                  <div key={item.label} className={`rounded-xl p-4 border ${item.bg}`}>
                    <div className={`mb-1 ${item.color}`}>
                      <item.Icon size={18} />
                    </div>
                    <div className={`text-xl font-bold font-mono ${item.color}`}>{item.value}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
                {t('model:unavailable')}
              </div>
            )}

            {/* Training date */}
            {modelInfo.training_date && (
              <p className="text-xs text-slate-400 font-mono">
                {t('model:last_updated')}: {new Date(modelInfo.training_date).toLocaleString('id-ID')}
              </p>
            )}

            {/* Class names */}
            {modelInfo.class_names && modelInfo.class_names.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">{t('model:recognized_careers')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {modelInfo.class_names.map(cn => (
                    <span key={cn} className="badge-standard text-xs">{cn}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">{t('model:error')}</p>
        )}
      </div>

      {/* Live Training Panel */}
      <div className="glass-card p-6 bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100">
        <h2 className="section-title flex items-center gap-2">
          <IconRefresh size={16} className="text-indigo-500" />
          {t('model:training_control')}
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          {t('model:training_control_desc')}
        </p>

        {/* Progress bar */}
        {trainingStatus && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${STATUS_COLORS[trainingStatus.status]}`}>
                {trainingStatus.status === 'idle' ? t('model:status_idle') : trainingStatus.status === 'started' ? t('model:status_gen') : trainingStatus.status === 'generating_data' ? t('model:status_gen') : trainingStatus.status === 'training' ? t('model:status_train') : trainingStatus.status === 'completed' ? t('model:status_done') : t('model:status_fail')}
              </span>
              {trainingStatus.job_id && (
                <span className="text-xs font-mono text-slate-400">
                  Job: {trainingStatus.job_id}
                </span>
              )}
            </div>

            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  trainingStatus.status === 'failed'
                    ? 'bg-gradient-to-r from-red-500 to-rose-500'
                    : trainingStatus.status === 'completed'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : 'bg-gradient-to-r from-indigo-500 to-violet-500'
                } ${isTraining ? 'animate-pulse-slow' : ''}`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Step labels */}
            <div className="flex justify-between text-xs text-slate-400">
              <span>{t('model:step_start')}</span>
              <span>{t('model:step_gen_data')}</span>
              <span>{t('model:step_training')}</span>
              <span>{t('model:step_done')}</span>
            </div>

            {/* Timestamps */}
            {trainingStatus.started_at && (
              <p className="text-xs text-slate-400 font-mono">
                Mulai: {new Date(trainingStatus.started_at).toLocaleTimeString('id-ID')}
                {trainingStatus.completed_at && (
                  <> · Selesai: {new Date(trainingStatus.completed_at).toLocaleTimeString('id-ID')}</>
                )}
              </p>
            )}

            {/* Result */}
            {trainingStatus.status === 'completed' && trainingStatus.result && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-xs font-semibold text-emerald-700 mb-2 flex items-center gap-1.5">
                  <IconCheckCircle size={12} />
                  {t('model:training_result')}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500">Model</span>
                    <p className="text-slate-800">{trainingStatus.result.model_type}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">{t('model:acc')}</span>
                    <p className="text-emerald-700">
                      {(trainingStatus.result.cv_accuracy * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">{t('model:f1')}</span>
                    <p className="text-sky-700">
                      {(trainingStatus.result.cv_f1_macro * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">{t('model:samples')}</span>
                    <p className="text-violet-700">
                      {trainingStatus.result.sample_count.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {trainingStatus.status === 'failed' && trainingStatus.error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                <IconAlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
                Error: {trainingStatus.error}
              </div>
            )}
          </div>
        )}

        {/* Trigger message */}
        {triggerMsg && (
          <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-700 font-mono">
            {triggerMsg}
          </div>
        )}

        {/* Trigger button */}
        <button
          className="btn-primary"
          onClick={handleTriggerTraining}
          disabled={triggering || isTraining}
        >
          {triggering || isTraining ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              {t('model:btn_training')}
            </>
          ) : (
            <>
              <IconRocket size={16} />
              {t('model:btn_train')}
            </>
          )}
        </button>

        <p className="text-xs text-slate-400 mt-3">
          {t('model:bg_process_notice')}
        </p>
      </div>

      {/* Engine info */}
      <div className="glass-card p-6">
        <h2 className="section-title flex items-center gap-2">
          <IconLayers size={16} className="text-indigo-500" />
          {t('model:engine_status')}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          {[
            {
              title: t('model:engine_rule'),
              desc: t('model:engine_rule_desc'),
              color: 'border-l-indigo-500',
              bg: 'bg-indigo-50',
            },
            {
              title: t('model:engine_ml'),
              desc: t('model:engine_ml_desc'),
              color: 'border-l-violet-500',
              bg: 'bg-violet-50',
            },
            {
              title: 'SHAP Explainer',
              desc: t('model:engine_shap_desc'),
              color: 'border-l-emerald-500',
              bg: 'bg-emerald-50',
            },
          ].map(item => (
            <div
              key={item.title}
              className={`${item.bg} rounded-xl p-4 border-l-2 ${item.color}`}
            >
              <h3 className="font-semibold text-slate-800 mb-1.5">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500 font-mono">
            hybrid_score = 0.5 × rule_score + 0.5 × ml_probability × 100
          </p>
        </div>
      </div>
    </div>
  )
}

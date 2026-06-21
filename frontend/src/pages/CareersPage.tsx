import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCareers } from '../api/client'
import type { CareerListItem } from '../types/api'
import { IconAlertTriangle, IconClipboard } from '../components/ui/Icons'

export default function CareersPage() {
  const [careers, setCareers] = useState<CareerListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const { t } = useTranslation(['careers'])

  useEffect(() => {
    getCareers()
      .then(setCareers)
      .catch(e => setError(e.message ?? 'Gagal memuat data karier'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = careers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-slate-500">{t('careers:loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
          <IconAlertTriangle size={18} />
          <span>{error}</span>
        </div>
        <p className="text-slate-400 text-sm">Pastikan backend berjalan di http://127.0.0.1:8000</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('careers:title')}</h1>
        <p className="text-slate-500">
          {t('careers:subtitle', { count: careers.length })}
        </p>
      </div>

      {/* Search */}
      <div className="mb-8 max-w-sm">
        <input
          type="text"
          className="input-field"
          placeholder={t('careers:search_placeholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-slate-400 py-12 text-center">{t('careers:not_found')}</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(career => (
            <CareerCard key={career.name} career={career} />
          ))}
        </div>
      )}
    </div>
  )
}

function CareerCard({ career }: { career: CareerListItem }) {
  const { t } = useTranslation(['skills', 'soft_skills'])

  const topSkills = Object.entries(career.hard_skills)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)

  return (
    <Link
      to={`/careers/${encodeURIComponent(career.name)}`}
      className="glass-card p-5 hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-200 group block"
    >
      {/* Career name */}
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors leading-tight">
          {career.name}
        </h2>
        <svg
          className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* O*NET source */}
      {career.source && (
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3 truncate" title={career.source}>
          <IconClipboard size={12} className="flex-shrink-0" />
          {career.source}
        </div>
      )}

      {/* Top skills */}
      <div className="space-y-2 mb-4">
        {topSkills.map(([skill, level]) => (
          <div key={skill} className="flex items-center gap-2">
            <span className="text-xs text-slate-500 w-28 flex-shrink-0 truncate">
              {t(`skills:${skill}`)}
            </span>
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                style={{ width: `${level}%` }}
              />
            </div>
            <span className="text-xs font-mono text-slate-400 w-6 text-right">{level}</span>
          </div>
        ))}
      </div>

      {/* Soft skills tags */}
      {career.soft_skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {career.soft_skills.slice(0, 3).map(sk => (
            <span key={sk} className="badge-info text-xs">
              {t(`soft_skills:${sk}`)}
            </span>
          ))}
          {career.soft_skills.length > 3 && (
            <span className="badge-standard text-xs">+{career.soft_skills.length - 3}</span>
          )}
        </div>
      )}
    </Link>
  )
}

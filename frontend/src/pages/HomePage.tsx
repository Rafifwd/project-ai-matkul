import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  IconFolder,
  IconCompass,
  IconCheckCircle,
  IconZap,
  IconArrowRight,
} from '../components/ui/Icons'

const FEATURES = [
  {
    Icon: IconFolder,
    titleKey: 'f1_title',
    descKey: 'f1_desc',
    to: '/careers',
    ctaKey: 'f1_cta',
    gradient: 'from-indigo-50 to-violet-50',
    border: 'border-indigo-100',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-100',
  },
  {
    Icon: IconCompass,
    titleKey: 'f2_title',
    descKey: 'f2_desc',
    to: '/discover',
    ctaKey: 'f2_cta',
    gradient: 'from-violet-50 to-purple-50',
    border: 'border-violet-100',
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-100',
  },
  {
    Icon: IconCheckCircle,
    titleKey: 'f3_title',
    descKey: 'f3_desc',
    to: '/validate',
    ctaKey: 'f3_cta',
    gradient: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-100',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
  },
]

const STATS = [
  { value: '10+', labelKey: 'stats_careers' },
  { value: 'Hybrid', labelKey: 'stats_hybrid' },
  { value: 'SHAP', labelKey: 'stats_xai' },
  { value: 'O*NET', labelKey: 'stats_data' },
]

export default function HomePage() {
  const { t } = useTranslation('home')
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-violet-100">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-indigo-300/40 rounded-full blur-3xl" />
          <div className="absolute top-16 right-1/4 w-80 h-80 bg-violet-300/35 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-indigo-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-200 text-indigo-700 text-xs font-semibold mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            {t('badge')}
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
            {t('title_part1')}
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">{t('title_part2')}</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed mb-10">
            {t('description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/discover" className="btn-primary text-base px-7 py-3 shadow-lg shadow-indigo-300/40">
              <IconCompass size={18} />
              {t('explore_btn')}
            </Link>
            <Link to="/validate" className="btn-outline text-base px-7 py-3">
              <IconCheckCircle size={18} />
              {t('validate_btn')}
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {STATS.map(stat => (
              <div key={stat.labelKey} className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{t(stat.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">{t('features_title')}</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            {t('features_desc')}
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div
              key={f.titleKey}
              className={`glass-card p-6 space-y-4 bg-gradient-to-br ${f.gradient} border ${f.border} hover:shadow-md hover:-translate-y-1 transition-all duration-200`}
            >
              <div className={`w-12 h-12 rounded-xl ${f.iconBg} flex items-center justify-center ${f.iconColor}`}>
                <f.Icon size={22} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{t(f.titleKey)}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{t(f.descKey)}</p>
              </div>
              <Link to={f.to} className="btn-primary w-full justify-center">
                {t(f.ctaKey)}
                <IconArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-slate-100 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">{t('how_title')}</h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              {t('how_desc')}
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                titleKey: 'h1_title',
                descKey: 'h1_desc',
                color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
              },
              {
                step: '02',
                titleKey: 'h2_title',
                descKey: 'h2_desc',
                color: 'bg-violet-100 text-violet-700 border-violet-200',
              },
              {
                step: '03',
                titleKey: 'h3_title',
                descKey: 'h3_desc',
                color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
              },
            ].map(item => (
              <div key={item.step} className="text-center space-y-3">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border ${item.color}`}>
                  <span className="font-bold font-mono text-sm">{item.step}</span>
                </div>
                <h3 className="font-semibold text-slate-900">{t(item.titleKey)}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{t(item.descKey)}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/model" className="btn-outline">
              <IconZap size={16} />
              {t('how_cta')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation('common')
  
  return (
    <footer className="border-t border-slate-200 bg-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <span className="font-semibold text-slate-700 text-sm">NalarPath AI</span>
          </div>

          <p className="text-slate-400 text-xs text-center">
            {t('footer_tagline')} &nbsp;•&nbsp; v0.3.0
          </p>

          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Powered by FastAPI + scikit-learn + SHAP
          </div>
        </div>
      </div>
    </footer>
  )
}

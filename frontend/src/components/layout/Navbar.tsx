import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { checkApiHealth } from '../../api/client'

// We will translate these dynamically inside the component
const NAV_ITEMS = [
  { to: '/', labelKey: 'Beranda', exact: true },
  { to: '/careers', labelKey: 'Katalog Karier' },
  { to: '/discover', labelKey: 'Temukan Karier' },
  { to: '/validate', labelKey: 'Validasi Karier' },
  { to: '/model', labelKey: 'Model AI' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation('common')
  const [menuOpen, setMenuOpen] = useState(false)
  const [apiOnline, setApiOnline] = useState<boolean | null>(null)
  const location = useLocation()

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'id' : 'en'
    i18n.changeLanguage(nextLang)
  }

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    checkApiHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false))
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img src="/logo.png" alt="NalarPath Logo" className="w-10 h-10 object-contain scale-125 drop-shadow-sm" />
            <span className="font-bold text-slate-800 text-lg tracking-tight">
              Nalar<span className="gradient-text">Path</span>
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'text-indigo-700 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                {item.labelKey === 'Beranda' ? (i18n.language === 'en' ? 'Home' : 'Beranda') : item.labelKey === 'Katalog Karier' ? (i18n.language === 'en' ? 'Career Catalog' : 'Katalog Karier') : item.labelKey === 'Temukan Karier' ? (i18n.language === 'en' ? 'Discover' : 'Temukan Karier') : item.labelKey === 'Validasi Karier' ? (i18n.language === 'en' ? 'Validate' : 'Validasi Karier') : (i18n.language === 'en' ? 'AI Model' : 'Model AI')}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* API Status */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono">
              <span
                className={`w-1.5 h-1.5 rounded-full ${apiOnline === null
                    ? 'bg-slate-400 animate-pulse'
                    : apiOnline
                      ? 'bg-emerald-500'
                      : 'bg-red-500'
                  }`}
              />
              <span className="text-slate-500">
                {apiOnline === null ? 'Connecting…' : apiOnline ? 'API Online' : 'API Offline'}
              </span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            >
              {i18n.language === 'en' ? 'EN' : 'ID'}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white animate-fade-in">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                    ? 'text-indigo-700 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                {item.labelKey === 'Beranda' ? (i18n.language === 'en' ? 'Home' : 'Beranda') : item.labelKey === 'Katalog Karier' ? (i18n.language === 'en' ? 'Career Catalog' : 'Katalog Karier') : item.labelKey === 'Temukan Karier' ? (i18n.language === 'en' ? 'Discover' : 'Temukan Karier') : item.labelKey === 'Validasi Karier' ? (i18n.language === 'en' ? 'Validate' : 'Validasi Karier') : (i18n.language === 'en' ? 'AI Model' : 'Model AI')}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

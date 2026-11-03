import { NavLink, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCopy, useSession } from '../../session'
import { checkApiHealth } from '../../api/client'

const ITEMS = [
  { to: '/catalog', key: 'nav.catalog' },
  { to: '/map', key: 'nav.discover' },
  { to: '/validate', key: 'nav.validate' },
  { to: '/engine', key: 'nav.model' },
]

export default function Shell() {
  const { t, lang } = useCopy()
  const { setLang } = useSession()
  const [online, setOnline] = useState<boolean | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let active = true
    checkApiHealth()
      .then(() => active && setOnline(true))
      .catch(() => active && setOnline(false))
    return () => {
      active = false
    }
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--rule)] bg-[color:var(--paper)]/92 backdrop-blur-sm">
      <div className="mx-auto max-w-sheet px-5 md:px-10">
        <div className="flex h-14 items-center justify-between gap-6">
          <Link to="/" className="group flex items-baseline gap-2.5">
            <span className="display text-[22px] leading-none">NalarPath</span>
            <span className="hidden text-[10px] uppercase tracking-[0.16em] text-ink-faint sm:inline">
              {t('brand.sub')}
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-[13px] transition-colors ${
                    isActive
                      ? 'text-ink underline decoration-[color:var(--ink)] decoration-1 underline-offset-[6px]'
                      : 'text-ink-soft hover:text-ink'
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span
              className="hidden items-center gap-1.5 sm:flex"
              title={online === null ? t('common.loading') : online ? t('home.engine.online') : t('home.engine.offline')}
            >
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${
                  online === null ? 'bg-[color:var(--rule-strong)]' : online ? 'bg-verify' : 'bg-alert'
                }`}
              />
              <span className="label !text-[9.5px]">
                {online === null ? '···' : online ? t('home.engine.online') : t('home.engine.offline')}
              </span>
            </span>

            <div
              className="flex items-center border border-[color:var(--rule-strong)]"
              role="group"
              aria-label={t('common.language')}
            >
              {(['id', 'en'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={`px-2 py-1 text-[11px] uppercase tracking-[0.1em] transition-colors ${
                    lang === l
                      ? 'bg-ink text-[color:var(--paper)]'
                      : 'text-ink-faint hover:text-ink'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="md:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="label !text-[10px]">{open ? t('common.close') : 'Menu'}</span>
            </button>
          </div>
        </div>

        {open ? (
          <nav id="mobile-nav" aria-label="Mobile" className="rule-t py-2 pb-3 md:hidden">
            {ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block py-2 text-[14px] ${isActive ? 'text-ink' : 'text-ink-soft'}`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  )
}

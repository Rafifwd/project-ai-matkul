import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Lang } from './constants/taxonomy'
import { t as translate } from './constants/copy'
import type { UserProfile } from './types/api'

interface SessionValue {
  lang: Lang
  setLang: (l: Lang) => void
  profile: UserProfile
  setProfile: (p: UserProfile) => void
  patchProfile: (p: Partial<UserProfile>) => void
}

const emptyProfile: UserProfile = {
  major: null,
  semester: null,
  skills: {},
  soft_skills: [],
  interests: [],
  experiences: [],
  preferences: {},
}

const SessionContext = createContext<SessionValue | null>(null)

const LANG_KEY = 'nalarpath.lang'
const PROFILE_KEY = 'nalarpath.profile'

function readLang(): Lang {
  try {
    const stored = localStorage.getItem(LANG_KEY)
    if (stored === 'id' || stored === 'en') return stored
  } catch {
    /* storage blocked */
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language : 'id'
  return nav.toLowerCase().startsWith('en') ? 'en' : 'id'
}

function readProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return emptyProfile
    const parsed = JSON.parse(raw) as Partial<UserProfile>
    return {
      ...emptyProfile,
      ...parsed,
      skills: parsed.skills ?? {},
      soft_skills: parsed.soft_skills ?? [],
      interests: parsed.interests ?? [],
      experiences: parsed.experiences ?? [],
      preferences: parsed.preferences ?? {},
    }
  } catch {
    return emptyProfile
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang)
  const [profile, setProfileState] = useState<UserProfile>(readProfile)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(LANG_KEY, lang)
    } catch {
      /* storage blocked */
    }
  }, [lang])

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    } catch {
      /* storage blocked */
    }
  }, [profile])

  const value = useMemo<SessionValue>(
    () => ({
      lang,
      setLang: setLangState,
      profile,
      setProfile: setProfileState,
      patchProfile: (patch) => setProfileState((prev) => ({ ...prev, ...patch })),
    }),
    [lang, profile],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside SessionProvider')
  return ctx
}

export function useCopy() {
  const { lang } = useSession()
  return useMemo(
    () => ({
      lang,
      t: (key: string) => translate(key, lang),
    }),
    [lang],
  )
}

export { emptyProfile }

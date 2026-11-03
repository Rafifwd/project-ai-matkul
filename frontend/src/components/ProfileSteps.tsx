import { useId } from 'react'
import { useCopy } from '../session'
import {
  SKILL_CATEGORIES,
  SOFT_SKILLS,
  INTERESTS,
  MAJORS,
  labelFor,
} from '../constants/taxonomy'
import type { UserProfile } from '../types/api'

interface Props {
  profile: UserProfile
  patch: (p: Partial<UserProfile>) => void
}

export function ContextStep({ profile, patch }: Props) {
  const { t, lang } = useCopy()
  const majorId = useId()
  const semId = useId()

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={majorId} className="label">
            {t('map.major')}
          </label>
          <select
            id={majorId}
            className="field mt-2"
            value={profile.major ?? ''}
            onChange={(e) => patch({ major: e.target.value || null })}
          >
            <option value="">—</option>
            {MAJORS.map((m) => (
              <option key={m.label} value={m.label}>
                {lang === 'id' ? m.label : m.labelEn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={semId} className="label">
            {t('map.semester')}
          </label>
          <select
            id={semId}
            className="field mt-2"
            value={profile.semester ?? ''}
            onChange={(e) => patch({ semester: e.target.value ? Number(e.target.value) : null })}
          >
            <option value="">—</option>
            {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="mt-4 max-w-[52ch] text-[12.5px] leading-relaxed text-ink-faint">
        {t('map.major.hint')}
      </p>
    </div>
  )
}

export function SkillsStep({ profile, patch }: Props) {
  const { t, lang } = useCopy()
  const ratedCount = Object.keys(profile.skills).length

  const setSkill = (key: string, value: number) => {
    const next = { ...profile.skills }
    if (value <= 0) delete next[key]
    else next[key] = value
    patch({ skills: next })
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-[15px] font-semibold tracking-tight">{t('map.skills.title')}</h3>
        <span className="label">
          {ratedCount} {t('map.skills.rated')}
        </span>
      </div>
      <p className="mt-1.5 max-w-[62ch] text-[12.5px] leading-relaxed text-ink-faint">
        {t('map.skills.hint')}
      </p>

      <div className="mt-7 space-y-8">
        {SKILL_CATEGORIES.map((cat) => (
          <fieldset key={cat.id}>
            <legend className="label !text-ink mb-3">{lang === 'id' ? cat.label : cat.labelEn}</legend>
            <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {cat.skills.map((skill) => {
                const value = profile.skills[skill.key] ?? 0
                const inputId = `skill-${skill.key}`
                return (
                  <div key={skill.key}>
                    <div className="flex items-baseline justify-between gap-3">
                      <label htmlFor={inputId} className="text-[13px] text-ink-soft">
                        {lang === 'id' ? skill.label : skill.labelEn}
                      </label>
                      <span className={`num text-[11.5px] ${value > 0 ? 'text-ink' : 'text-ink-faint'}`}>
                        {value > 0 ? value : '—'}
                      </span>
                    </div>
                    <input
                      id={inputId}
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={value}
                      onChange={(e) => setSkill(skill.key, Number(e.target.value))}
                      className="mt-1.5 w-full"
                      aria-valuetext={value > 0 ? String(value) : '—'}
                    />
                  </div>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  )
}

function ChipGrid({
  options,
  selected,
  onToggle,
}: {
  options: ReadonlyArray<{ key: string; label: string; labelEn: string }>
  selected: string[]
  onToggle: (key: string) => void
}) {
  const { lang } = useCopy()
  return (
    <ul className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = selected.includes(opt.key)
        return (
          <li key={opt.key}>
            <button
              type="button"
              className="chip"
              aria-pressed={active}
              onClick={() => onToggle(opt.key)}
            >
              {active ? (
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden="true">
                  <path d="M1.5 6.2 4.4 9 10.5 2.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              ) : null}
              {lang === 'id' ? opt.label : opt.labelEn}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export function SoftStep({ profile, patch }: Props) {
  const { t } = useCopy()
  const toggle = (key: string) => {
    const has = profile.soft_skills.includes(key)
    patch({
      soft_skills: has
        ? profile.soft_skills.filter((k) => k !== key)
        : [...profile.soft_skills, key],
    })
  }

  return (
    <div>
      <p className="max-w-[62ch] text-[13px] leading-relaxed text-ink-soft">{t('map.soft.hint')}</p>
      <div className="mt-5">
        <ChipGrid options={SOFT_SKILLS} selected={profile.soft_skills} onToggle={toggle} />
      </div>
      <p className="rule-t mt-6 pt-4 text-[12px] text-ink-faint">
        {profile.soft_skills.length} / {SOFT_SKILLS.length}
      </p>
    </div>
  )
}

export function InterestsStep({ profile, patch }: Props) {
  const { t } = useCopy()
  const toggle = (key: string) => {
    const has = profile.interests.includes(key)
    patch({
      interests: has ? profile.interests.filter((k) => k !== key) : [...profile.interests, key],
    })
  }

  return (
    <div>
      <p className="max-w-[62ch] text-[13px] leading-relaxed text-ink-soft">{t('map.interests.hint')}</p>
      <div className="mt-5">
        <ChipGrid options={INTERESTS} selected={profile.interests} onToggle={toggle} />
      </div>
      <p className="rule-t mt-6 pt-4 text-[12px] text-ink-faint">
        {profile.interests.length} / {INTERESTS.length}
      </p>
    </div>
  )
}

export function ProfileSummary({ profile }: { profile: UserProfile }) {
  const { t, lang } = useCopy()
  const skills = Object.entries(profile.skills)

  return (
    <dl className="grid gap-x-8 gap-y-4 text-[13px] sm:grid-cols-2">
      <div>
        <dt className="label">{t('map.major')}</dt>
        <dd className="mt-1 text-ink">{profile.major ?? '—'}</dd>
      </div>
      <div>
        <dt className="label">{t('map.semester')}</dt>
        <dd className="num mt-1 text-ink">{profile.semester ?? '—'}</dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="label">{t('map.step.2')}</dt>
        <dd className="mt-1.5">
          {skills.length === 0 ? (
            <span className="text-[12.5px] text-ink-faint">{t('map.noSkill')}</span>
          ) : (
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {skills
                .slice()
                .sort((a, b) => b[1] - a[1])
                .map(([k, v]) => (
                  <li key={k} className="inline-flex items-baseline gap-1.5">
                    <span className="text-ink-soft">{labelFor(k, lang)}</span>
                    <span className="num text-[11.5px] text-ink-faint">{v}</span>
                  </li>
                ))}
            </ul>
          )}
        </dd>
      </div>
      <div>
        <dt className="label">{t('map.step.3')}</dt>
        <dd className="mt-1.5 flex flex-wrap gap-1.5">
          {profile.soft_skills.length === 0 ? (
            <span className="text-[12.5px] text-ink-faint">—</span>
          ) : (
            profile.soft_skills.map((k) => (
              <span key={k} className="border border-[color:var(--rule-strong)] px-1.5 py-0.5 text-[11.5px] text-ink-soft">
                {labelFor(k, lang)}
              </span>
            ))
          )}
        </dd>
      </div>
      <div>
        <dt className="label">{t('map.step.4')}</dt>
        <dd className="mt-1.5 flex flex-wrap gap-1.5">
          {profile.interests.length === 0 ? (
            <span className="text-[12.5px] text-ink-faint">—</span>
          ) : (
            profile.interests.map((k) => (
              <span key={k} className="border border-[color:var(--rule-strong)] px-1.5 py-0.5 text-[11.5px] text-ink-soft">
                {labelFor(k, lang)}
              </span>
            ))
          )}
        </dd>
      </div>
    </dl>
  )
}

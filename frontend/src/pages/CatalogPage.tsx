import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCopy } from '../session'
import { getCareers } from '../api/client'
import type { CareerListItem } from '../types/api'
import PageHead from '../components/ui/PageHead'
import { labelFor } from '../constants/taxonomy'
import { pad2 } from '../constants/resources'

type SortKey = 'name' | 'skills' | 'code'

export default function CatalogPage() {
  const { t, lang } = useCopy()
  const [careers, setCareers] = useState<CareerListItem[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('name')

  useEffect(() => {
    let active = true
    getCareers()
      .then((c) => active && setCareers(c))
      .catch(() => active && setFailed(true))
    return () => {
      active = false
    }
  }, [])

  const rows = useMemo(() => {
    if (!careers) return []
    const q = query.trim().toLowerCase()
    const filtered = q
      ? careers.filter((c) => {
          const skillNames = Object.keys(c.hard_skills ?? {}).map((k) => labelFor(k, lang))
          const haystack = [c.name, c.onet_code ?? '', c.source ?? '', ...skillNames]
            .join(' ')
            .toLowerCase()
          return haystack.includes(q)
        })
      : careers

    const sorted = [...filtered]
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'skills')
      sorted.sort((a, b) => Object.keys(b.hard_skills ?? {}).length - Object.keys(a.hard_skills ?? {}).length)
    if (sort === 'code') sorted.sort((a, b) => (a.onet_code ?? '').localeCompare(b.onet_code ?? ''))
    return sorted
  }, [careers, query, sort, lang])

  return (
    <div className="mx-auto max-w-sheet px-5 md:px-10">
      <PageHead
        eyebrow={t('common.index')}
        title={t('catalog.title')}
        lede={t('catalog.lede')}
        meta={[
          { label: t('catalog.count'), value: careers ? pad2(careers.length) : '—' },
          {
            label: t('catalog.showing'),
            value: careers === null ? '—' : pad2(rows.length),
          },
        ]}
      />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <label htmlFor="catalog-search" className="sr-only">
            {t('catalog.search')}
          </label>
          <input
            id="catalog-search"
            type="search"
            className="field !pl-8"
            placeholder={t('catalog.search')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 fill-none stroke-[color:var(--ink-faint)]"
            strokeWidth="1.5"
          >
            <circle cx="7" cy="7" r="4.5" />
            <path d="m10.5 10.5 3 3" />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          <span className="label">{t('catalog.sort')}</span>
          <div className="flex border border-[color:var(--rule-strong)]">
            {(['name', 'skills', 'code'] as SortKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSort(key)}
                aria-pressed={sort === key}
                className={`px-2.5 py-1.5 text-[11.5px] transition-colors ${
                  sort === key ? 'bg-ink text-[color:var(--paper)]' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {t(`catalog.sort.${key}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {failed ? (
        <p className="mt-8 border border-[color:var(--alert)] px-4 py-3 text-[13px] text-alert">
          {t('common.error')}
        </p>
      ) : careers === null ? (
        <ul className="mt-8 space-y-px bg-[color:var(--rule)]">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="h-16 animate-pulse bg-[color:var(--paper)]" />
          ))}
        </ul>
      ) : rows.length === 0 ? (
        <p className="mt-10 border-t border-[color:var(--rule)] pt-6 text-[13.5px] text-ink-faint">
          {t('catalog.none')}
        </p>
      ) : (
        <ul className="mt-6 border-t border-[color:var(--rule)]">
          {rows.map((career, i) => {
            const skills = Object.entries(career.hard_skills ?? {})
            const weights = career.skill_weights ?? {}
            const top = skills
              .slice()
              .sort((a, b) => (weights[b[0]] ?? 0) - (weights[a[0]] ?? 0))
              .slice(0, 4)

            return (
              <li key={career.name}>
                <Link
                  to={`/catalog/${encodeURIComponent(career.name)}`}
                  className="group grid gap-3 border-b border-[color:var(--rule)] py-5 transition-colors hover:bg-[color:var(--paper-deep)] md:grid-cols-[2.5rem_minmax(0,18rem)_1fr_auto] md:items-start md:gap-6"
                >
                  <span className="num text-[11px] text-ink-faint">{pad2(i + 1)}</span>

                  <div className="min-w-0">
                    <h2 className="text-[17px] font-medium tracking-tight transition-colors group-hover:text-signal">
                      {career.name}
                    </h2>
                    <p className="mt-1 text-[11.5px] text-ink-faint">
                      <span className="num">{career.onet_code ?? '—'}</span>
                      {career.source ? ` · ${career.source}` : ''}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {top.map(([key, level]) => (
                      <span key={key} className="inline-flex items-baseline gap-1.5 text-[12px]">
                        <span className="text-ink-soft">{labelFor(key, lang)}</span>
                        <span aria-hidden="true" className="text-rule-strong">·</span>
                        <span className="num text-[11px] text-ink-faint">{level}</span>
                      </span>
                    ))}
                  </div>

                  <span
                    aria-hidden="true"
                    className="hidden self-center text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-signal md:block"
                  >
                    →
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

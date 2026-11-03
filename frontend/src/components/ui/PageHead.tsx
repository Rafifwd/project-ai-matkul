import type { ReactNode } from 'react'

interface PageHeadProps {
  eyebrow: string
  title: string
  lede: string
  aside?: ReactNode
  meta?: Array<{ label: string; value: string }>
}

export default function PageHead({ eyebrow, title, lede, aside, meta }: PageHeadProps) {
  return (
    <header className="rule-b pb-10 pt-8 md:pb-12 md:pt-12">
      <div className="label flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-ink">{eyebrow}</span>
      </div>

      <div className="mt-5 grid gap-8 md:mt-7 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:gap-14">
        <div>
          <h1 className="display text-[clamp(2.6rem,7vw,4.9rem)]">{title}</h1>
          <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-ink-soft md:text-base">
            {lede}
          </p>
        </div>
        {aside ? <div className="self-end">{aside}</div> : null}
      </div>

      {meta && meta.length > 0 ? (
        <dl className="rule-t mt-9 grid grid-cols-2 gap-y-5 pt-6 sm:grid-cols-3 md:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="label">{m.label}</dt>
              <dd className="num mt-1.5 text-xl text-ink">{m.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </header>
  )
}

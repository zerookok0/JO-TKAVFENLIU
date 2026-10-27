import { ArrowUpRight, EyeOff, Upload } from 'lucide-react'
import { Icon } from './Icon'
import { useConfig } from '../config/store'

/* ══════════════════════════ 亮点 ══════════════════════════ */

export function Highlights() {
  const { config } = useConfig()
  const copy = config.highlightsCopy
  const small = config.highlights.filter((h) => !h.featured)
  const featured = config.highlights.find((h) => h.featured)

  return (
    <section id="highlights" className="relative py-16 sm:py-24">
      <div className="container-page">
        <div className="reveal mx-auto max-w-[620px] text-center">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="mt-4 text-balance text-[clamp(1.6rem,4.6vw,2.4rem)] font-bold leading-[1.25] tracking-[-0.02em]">
            {copy.title}
            {copy.titleHighlight && (
              <span className="text-gradient"> {copy.titleHighlight} </span>
            )}
            {copy.titleTail}
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] text-[15px] leading-[1.8] text-white/50">
            {copy.sub}
          </p>
        </div>

        {/* 等宽卡片 */}
        <div className="mt-11 grid gap-3 sm:grid-cols-2">
          {small.map((h, i) => (
            <article
              key={h.id}
              className="reveal group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-surface/60 p-6 transition duration-500 hover:-translate-y-1 hover:border-white/[0.16] hover:bg-surface"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand/[0.07] blur-2xl transition duration-500 group-hover:bg-brand/20" />

              <div className="relative inline-grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand/25 to-accent/10 text-brand2 ring-1 ring-white/10">
                <Icon name={h.icon} className="h-5 w-5" />
              </div>

              <h3 className="relative mt-5 text-[17px] font-semibold tracking-tight text-white">
                {h.title}
              </h3>
              <p className="relative mt-2 text-[14px] leading-[1.8] text-white/50">{h.body}</p>
            </article>
          ))}
        </div>

        {/* 压轴大卡：隐私 + AI 变声 */}
        {featured && (
          <article className="reveal group relative mt-3 overflow-hidden rounded-3xl border border-white/[0.09] bg-gradient-to-br from-raised via-ink to-ink p-6 sm:p-9">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/25 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-accent/15 blur-[80px]" />

            <div className="relative grid gap-7 sm:grid-cols-[1.15fr_0.85fr] sm:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 backdrop-blur">
                  <EyeOff className="h-3.5 w-3.5 text-mint" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/65">
                    {copy.featured.badge}
                  </span>
                </div>

                <h3 className="mt-4 text-[clamp(1.3rem,3.6vw,1.75rem)] font-bold leading-[1.3] tracking-tight text-white">
                  {featured.title}
                </h3>
                <p className="mt-3 max-w-[440px] text-[14.5px] leading-[1.85] text-white/55">
                  {featured.body}
                </p>

                <ul className="mt-5 grid gap-2">
                  {copy.featured.points.filter(Boolean).map((line, i) => (
                    <li key={`${line}-${i}`} className="flex items-start gap-2 text-[13px] text-white/55">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-mint" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 变声器视觉 */}
              <div className="relative">
                <div className="relative rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/35">
                      {copy.featured.meterTitle}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-mint/15 px-2 py-[3px] text-[9.5px] font-semibold text-mint">
                      <span className="h-1 w-1 rounded-full bg-mint" />
                      {copy.featured.meterStatus}
                    </span>
                  </div>

                  {/* 波形 */}
                  <div className="mt-4 flex h-16 items-center justify-between gap-[3px]">
                    {[38, 62, 30, 84, 52, 96, 44, 70, 34, 88, 58, 40, 76, 30, 64, 48].map(
                      (h, i) => (
                        <span
                          key={i}
                          className="w-full rounded-full bg-gradient-to-t from-brand/50 to-mint/80"
                          style={{
                            height: `${h}%`,
                            opacity: 0.55 + (i % 3) * 0.15,
                            animation: `pulse-bar ${1.1 + (i % 4) * 0.24}s ease-in-out ${i * 0.05}s infinite alternate`,
                          }}
                        />
                      ),
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-1.5">
                    {copy.featured.meterOptions.map((p, i) => (
                      <span
                        key={`${p}-${i}`}
                        className={`rounded-lg py-1.5 text-center text-[10.5px] font-medium ${
                          i === 1
                            ? 'bg-white text-black'
                            : 'border border-white/10 bg-white/[0.04] text-white/50'
                        }`}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  )
}

/* ══════════════════════════ 它怎么用 ══════════════════════════ */

export function HowItWorks() {
  const { config } = useConfig()
  const copy = config.howCopy
  const steps = config.steps

  return (
    <section id="how" className="relative py-16 sm:py-24">
      <div className="container-page">
        <div className="reveal flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 className="mt-3.5 text-[clamp(1.5rem,4.2vw,2.15rem)] font-bold leading-[1.25] tracking-[-0.02em]">
              {copy.title}
            </h2>
          </div>
          <p className="max-w-[320px] text-[13.5px] leading-[1.8] text-white/45">{copy.sub}</p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className="reveal group relative rounded-3xl border border-white/[0.07] bg-surface/50 p-6 transition duration-500 hover:border-brand/30 hover:bg-surface"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {i < steps.length - 1 && (
                <span className="pointer-events-none absolute -end-1.5 top-12 hidden h-px w-3 bg-gradient-to-r from-white/20 to-transparent sm:block rtl:bg-gradient-to-l" />
              )}

              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.05] text-white/70 ring-1 ring-white/10 transition group-hover:text-brand2">
                  <Icon name={s.icon} className="h-[18px] w-[18px]" />
                </span>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-white/25">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="mt-4 text-[16px] font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-[13.5px] leading-[1.8] text-white/50">{s.body}</p>
            </div>
          ))}
        </div>

        {/* 上传提示 */}
        <div className="reveal mt-3 flex flex-col items-start justify-between gap-4 rounded-3xl border border-white/[0.07] bg-white/[0.025] px-6 py-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand2 ring-1 ring-brand/25">
              <Upload className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[14.5px] font-semibold text-white">{copy.uploadTitle}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-white/45">{copy.uploadBody}</p>
            </div>
          </div>
          <a
            href="#highlights"
            className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-brand2 transition hover:text-white"
          >
            {copy.uploadLink}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  )
}

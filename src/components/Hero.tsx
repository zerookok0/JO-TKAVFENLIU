import { useEffect, useState } from 'react'
import { ArrowUpRight, Download, Moon, MapPin, ShieldCheck } from 'lucide-react'
import { PhoneMockup } from './PhoneMockup'
import { useConfig } from '../config/store'
import { fill } from '../lib/format'
import { useClock } from '../lib/clock'
import type { GateKey } from '../config/defaults'

type Props = {
  onDownload: () => void
  onGate: (a: GateKey) => void
}

const ROTATE_MS = 8000

export function Hero({ onDownload, onGate }: Props) {
  const { config } = useConfig()
  const hero = config.hero
  const slides = config.heroSlides
  const ui = config.ui
  /** 与手机状态栏同一个节拍、同一份快照 —— 两处永远同一分钟 */
  const now = useClock()
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)

  /** 文案被删到 0 条时不崩，索引也不会越界 */
  const safeSlide = slides.length ? Math.min(slide, slides.length - 1) : 0

  useEffect(() => {
    if (paused || slides.length < 2) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const t = window.setInterval(() => {
      setSlide((s) => (s + 1) % slides.length)
    }, ROTATE_MS)
    return () => window.clearInterval(t)
  }, [paused, slides.length])

  const trustIcons = [MapPin, ShieldCheck]

  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-24 sm:pb-24 sm:pt-28 lg:pt-32">
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[900px] -translate-x-1/2 opacity-70 blur-[100px]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(150,40,52,0.42) 0%, rgba(124,27,44,0.14) 42%, transparent 72%)',
        }}
        aria-hidden="true"
      />

      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
          {/* 左：文案 */}
          <div className="relative z-10 mx-auto max-w-[560px] text-center lg:mx-0 lg:text-start">
            {/* 深夜状态条 */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-cream/[0.09] bg-cream/[0.035] px-3.5 py-2 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-blush" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blush" />
              </span>
              <span className="text-[12px] font-medium tracking-wide text-cream/60">
                {hero.statusPre} <span className="font-semibold text-cream">{now}</span>
                {' · '}
                {hero.statusMid}{' '}
                <span className="font-semibold text-cream">{hero.statusCount}</span>{' '}
                {hero.statusPost}
              </span>
            </div>

            {/* 轮播文案 */}
            <div
              className="mt-7 min-h-[236px] sm:min-h-[254px]"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              aria-live="polite"
            >
              {slides.map((s, i) => {
                const isActive = i === safeSlide
                return (
                  <div
                    key={s.id}
                    aria-hidden={!isActive}
                    className={`transition-all duration-700 ${
                      isActive
                        ? 'pointer-events-auto translate-y-0 opacity-100'
                        : 'pointer-events-none absolute translate-y-2 opacity-0'
                    }`}
                  >
                    <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-copper/75">
                      {s.kicker}
                    </p>

                    <h1 className="mt-4 text-balance text-[clamp(1.95rem,5.6vw,3.05rem)] font-semibold leading-[1.28] tracking-[-0.01em] text-cream">
                      {s.title}
                    </h1>

                    <p className="mx-auto mt-4 max-w-[470px] text-[15px] leading-[1.9] text-cream/55 sm:text-[16px] lg:mx-0">
                      {s.sub}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* 轮播点 */}
            {slides.length > 1 && (
              <div className="mt-2 flex items-center justify-center gap-2 lg:justify-start">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSlide(i)}
                    aria-label={fill(ui.slideDot, { n: i + 1 })}
                    aria-current={i === safeSlide}
                    className="relative h-[3px] overflow-hidden rounded-full bg-cream/12 transition-all duration-300"
                    style={{ width: i === safeSlide ? 40 : 18 }}
                  >
                    {i === safeSlide && (
                      <span
                        key={`${safeSlide}-${paused}`}
                        className="absolute inset-y-0 start-0 rounded-full bg-gradient-to-r from-wine via-blush to-copper"
                        style={{
                          animation: paused ? 'none' : `hero-bar ${ROTATE_MS}ms linear forwards`,
                          width: paused ? '100%' : undefined,
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <button type="button" onClick={onDownload} className="btn-primary group">
                <Download className="h-4 w-4" />
                {config.buttons.heroCta}
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
              <a href="#nearby" className="btn-ghost">
                <Moon className="h-4 w-4" />
                {config.buttons.heroSecondary}
              </a>
            </div>

            {/* 信任行 */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-[11.5px] text-cream/32 lg:justify-start">
              {hero.trusted.map((t, i) => {
                const Icon = trustIcons[i % trustIcons.length]
                return (
                  <span key={`${t}-${i}`} className="inline-flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-copper/60" />
                    {t}
                  </span>
                )
              })}
              {hero.badge18 && (
                <span className="rounded-full border border-cream/15 px-2 py-[1px] text-[10px] font-bold tracking-wide">
                  {hero.badge18}
                </span>
              )}
            </div>
          </div>

          {/* 右：手机 */}
          <div className="relative z-0">
            <div className="animate-fade-up">
              <PhoneMockup onGate={onGate} />
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-[12.5px] leading-relaxed text-cream/28">{hero.note}</p>
      </div>
    </section>
  )
}

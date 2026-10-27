import { useState } from 'react'
import { AlertTriangle, ArrowUpRight, Check, Download, ShieldCheck, Smartphone } from 'lucide-react'
import { useConfig } from '../config/store'

type Props = {
  onDownload: () => void
  /** 「直链地址（备用）」也走弹窗埋点，不再直接跳 APK */
  onBypass: () => void
}

export function InstallSection({ onDownload, onBypass }: Props) {
  const { config } = useConfig()
  const copy = config.installCopy
  const dl = config.download
  const ui = config.ui

  return (
    <section id="install" className="relative py-20 sm:py-28">
      <div className="container-page">
        <div className="reveal mx-auto max-w-[640px] text-center">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="mt-4 text-balance text-[clamp(1.65rem,4.6vw,2.5rem)] font-bold leading-[1.22] tracking-[-0.02em]">
            {copy.title}
            {copy.titleHighlight && (
              <span className="text-gradient">{copy.titleHighlight}</span>
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-[500px] text-[15px] leading-[1.85] text-white/50">
            {copy.sub}
          </p>
        </div>

        <div className="mt-12 grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
          {/* 左：三步 + 权限 */}
          <div className="grid gap-3">
            {config.installSteps.map((step, i) => (
              <div
                key={step.id}
                className="reveal group relative flex gap-4 rounded-3xl border border-white/[0.07] bg-surface/60 p-5 transition duration-500 hover:border-white/[0.15] hover:bg-surface sm:p-6"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-wine to-copper text-[12px] font-bold text-white shadow-glow">
                  {step.no}
                </span>
                <div>
                  <h3 className="text-[16px] font-semibold text-white">{step.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-[1.8] text-white/50">{step.body}</p>
                </div>
              </div>
            ))}

            {/* 权限明细 */}
            <div className="reveal rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-mint" />
                <p className="text-[13px] font-semibold text-white">{copy.permissionsTitle}</p>
              </div>
              <div className="mt-4 grid gap-2.5">
                {copy.permissions.map((p, i) => (
                  <div key={`${p.name}-${i}`} className="flex items-start justify-between gap-4">
                    <span className="inline-flex items-center gap-2 text-[12.5px] font-medium text-white/80">
                      <Check className="h-3 w-3 text-emerald-400" />
                      {p.name}
                    </span>
                    <span className="text-end text-[11.5px] text-white/35">{p.why}</span>
                  </div>
                ))}
              </div>
              {copy.permissionsNote && (
                <p className="mt-4 border-t border-white/[0.07] pt-3 text-[11.5px] leading-relaxed text-white/35">
                  {copy.permissionsNote}
                </p>
              )}
            </div>
          </div>

          {/* 右：安全 + 系统要求 + 提醒 */}
          <div className="grid gap-3">
            <div className="reveal rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
              <p className="eyebrow">{copy.safetyEyebrow}</p>
              <ul className="mt-3.5 grid gap-3">
                {config.safety.map((p) => (
                  <li key={p.id} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-400/15">
                      <Check className="h-2.5 w-2.5 text-emerald-300" />
                    </span>
                    <div>
                      <p className="text-[12.5px] font-semibold text-white/85">{p.title}</p>
                      <p className="mt-0.5 text-[11.5px] leading-[1.7] text-white/40">{p.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-brand2" />
                <p className="text-[13px] font-semibold text-white">{copy.apkTitle}</p>
              </div>
              <div className="mt-3.5 grid grid-cols-3 gap-2">
                {[
                  [ui.metaVersion, dl.version],
                  [ui.metaSize, dl.size],
                  [ui.metaSystem, dl.minAndroid],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-2.5 py-2.5 text-center"
                  >
                    <p className="text-[9.5px] uppercase tracking-[0.14em] text-white/30">{k}</p>
                    <p className="mt-1 truncate text-[12px] font-semibold text-white/85">{v}</p>
                  </div>
                ))}
              </div>
              {dl.apkUrl && (
                <button
                  type="button"
                  onClick={onBypass}
                  className="mt-3.5 inline-flex items-center gap-1.5 text-[11.5px] text-white/35 transition hover:text-white/70"
                >
                  {copy.apkLink}
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="reveal flex items-start gap-2.5 rounded-3xl border border-amber-400/20 bg-amber-400/[0.05] p-5">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <p className="text-[12px] leading-[1.75] text-amber-100/65">
                {copy.warningPrefix}
                <b className="mx-1 font-semibold text-amber-200">{copy.warningStrong}</b>
                {copy.warningSuffix}
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="reveal mt-14">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <h3 className="text-[clamp(1.3rem,3.4vw,1.75rem)] font-bold tracking-tight text-white">
              {copy.faqTitle}
            </h3>
            <p className="text-[12.5px] text-white/35">{copy.faqHint}</p>
          </div>

          <div className="mt-6 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {config.faqs.map((item, i) => (
              <FaqRow key={item.id} q={item.q} a={item.a} defaultOpen={i === 0} />
            ))}
          </div>
        </div>

        {/* 底部 CTA */}
        <div className="reveal mt-12 flex flex-col items-center gap-4 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-raised via-ink to-ink px-6 py-9 text-center">
          <p className="text-[clamp(1.2rem,3.4vw,1.6rem)] font-bold leading-snug text-white">
            {copy.ctaTitle}
          </p>
          <p className="max-w-[420px] text-[13.5px] leading-relaxed text-white/45">{copy.ctaSub}</p>
          <button type="button" onClick={onDownload} className="btn-primary group mt-1">
            <Download className="h-4 w-4" />
            {config.buttons.installCta}
            <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  )
}

function FaqRow({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-start"
      >
        <span className="text-[14.5px] font-medium text-white/85">{q}</span>
        <span
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
            open
              ? 'rotate-45 border-brand/50 bg-brand/15 text-brand2'
              : 'border-white/15 text-white/40'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      <div
        className="grid overflow-hidden transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="min-h-0">
          <p className="max-w-[600px] pb-5 pe-8 text-[13.5px] leading-[1.85] text-white/50">{a}</p>
        </div>
      </div>
    </div>
  )
}

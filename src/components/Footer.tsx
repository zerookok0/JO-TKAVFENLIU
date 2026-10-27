import { Download, Mail, ShieldCheck } from 'lucide-react'
import { AppIcon, AppName } from './BrandSlot'
import { useConfig } from '../config/store'

type Props = {
  onDownload: () => void
}

export function Footer() {
  const { config } = useConfig()
  const { brand, footer, installCopy } = config
  const email = brand.email

  return (
    <footer className="relative border-t border-white/[0.07] pb-28 pt-14 sm:pb-14">
      <div className="container-page">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-12">
          <div>
            <div className="flex items-center gap-3">
              <AppIcon className="h-11 w-11" />
              <div>
                <AppName className="text-[14px]" />
                {brand.tagline && (
                  <p className="mt-1 text-[9.5px] font-medium uppercase tracking-[0.24em] text-white/30">
                    {brand.tagline}
                  </p>
                )}
              </div>
            </div>
            <p className="mt-5 max-w-[320px] text-[13px] leading-[1.85] text-white/40">
              {footer.about}
            </p>
            {email && (
              <a
                href={`mailto:${email}`}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-[11.5px] text-white/50 transition hover:border-white/25 hover:text-white"
              >
                <Mail className="h-3.5 w-3.5" />
                {email}
              </a>
            )}
          </div>

          {footer.groups.map((group) => (
            <div key={group.id}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
                {group.title}
              </p>
              <ul className="mt-4 grid gap-2.5">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      className="text-[12.5px] text-white/50 transition hover:text-white"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 h-px hairline" />

        <div className="mt-6 flex flex-col gap-3 text-[10.5px] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3" />© {new Date().getFullYear()} {brand.copyright}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a href="#install" className="transition hover:text-white/60">
              {installCopy.footLegal}
            </a>
            <a href="#install" className="transition hover:text-white/60">
              {installCopy.footPrivacy}
            </a>
            <a href="#install" className="transition hover:text-white/60">
              {installCopy.footRules}
            </a>
            {installCopy.footAge && (
              <span className="rounded-full border border-white/15 px-2 py-[1px] font-bold tracking-wide">
                {installCopy.footAge}
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

/** 移动端常驻底栏，让下载按钮始终一手可及 */
export function MobileDock({ onDownload }: Props) {
  const { config } = useConfig()

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 sm:hidden">
      <div className="glass flex items-center gap-3 rounded-2xl px-3 py-2.5 shadow-panel">
        <AppIcon className="h-9 w-9 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold text-white">
            <AppName className="!border-0 !bg-transparent !p-0 !text-[12px] !tracking-normal" />
          </p>
          <p className="truncate text-[10px] text-white/45">{config.footer.dockNote}</p>
        </div>
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-wine via-copper to-blush px-4 py-2.5 text-[12.5px] font-bold text-white active:scale-95"
        >
          <Download className="h-3.5 w-3.5" />
          {config.buttons.dockCta}
        </button>
      </div>
    </div>
  )
}

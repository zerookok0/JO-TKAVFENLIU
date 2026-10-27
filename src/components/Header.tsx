import { useEffect, useState } from 'react'
import { ArrowUpRight, Download, Menu, X } from 'lucide-react'
import { Wordmark } from './BrandSlot'
import { useScrolledPast } from '../hooks/useReveal'
import { useConfig } from '../config/store'

/**
 * 顶栏。
 *
 * 这里原本有一个语言切换器（ع / EN）。
 * 站点只服务约旦本地用户、只有阿拉伯语，所以整个切换入口被拿掉了 ——
 * 留着它只会让人误点，然后把整站切成另一种语言。
 */
export function Header({ onDownload }: { onDownload: () => void }) {
  const scrolled = useScrolledPast(20)
  const [open, setOpen] = useState(false)
  const { config } = useConfig()
  const NAV = config.nav
  const ui = config.ui

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className="container-page">
          <div
            className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 sm:px-5 ${
              scrolled ? 'glass shadow-panel' : 'border border-transparent bg-transparent'
            }`}
          >
            <a href="#top" aria-label={ui.backToTop} className="shrink-0">
              <Wordmark />
            </a>

            <nav className="hidden items-center gap-1 md:flex" aria-label={ui.mainNav}>
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-[13px] font-medium text-white/60 transition hover:bg-white/[0.06] hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onDownload}
                className="group hidden items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-semibold text-black transition hover:scale-[1.03] active:scale-95 sm:inline-flex"
              >
                {config.buttons.headerCta}
                <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={ui.openMenu}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 md:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 移动端菜单 */}
      <div className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <button
          type="button"
          aria-label={ui.closeMenu}
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-x-3 top-3 rounded-3xl border border-white/10 bg-[#1a1a1e] p-5 transition-all duration-300 ${
            open ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="flex items-center justify-between">
            <Wordmark />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={ui.closeMenu}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/70"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="mt-5 grid gap-1" aria-label={ui.mobileNav}>
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium text-white/80 transition hover:bg-white/[0.06]"
              >
                {item.label}
                <ArrowUpRight className="h-4 w-4 text-white/30" />
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onDownload()
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand via-brand2 to-accent py-3.5 text-sm font-bold text-white"
          >
            <Download className="h-4 w-4" />
            {config.buttons.installCta}
          </button>
        </div>
      </div>
    </>
  )
}

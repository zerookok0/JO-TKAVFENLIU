import { useEffect, useRef, useState } from 'react'
import { Check, Globe } from 'lucide-react'
import { useLocale, LOCALE_META } from '../i18n/LocaleProvider'
import { useConfig } from '../config/store'
import { LOCALES, type Locale } from '../i18n/types'
import { fill } from '../lib/format'

/**
 * 语言切换器。
 *
 * 收起时只显示当前语言的短码（ع / EN），
 * 点开是一张竖排菜单，每项都用该语言自己的写法 —— 用户永远认得出自己的语言。
 *
 * 站点只有阿拉伯语与英语两种，默认阿拉伯语。
 * 键盘可用：Esc 关闭、Tab 移出时自动收起。
 */
export function LocaleSwitch({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLocale()
  const { config } = useConfig()
  const ui = config.ui
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const meta = LOCALE_META[locale]

  /** 点外面 / 按 Esc → 收起 */
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pick = (next: Locale) => {
    setLocale(next)
    setOpen(false)
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={fill(ui.localeSwitchAria, { label: meta.label })}
        className={`inline-flex items-center gap-1.5 rounded-full border border-cream/10 bg-cream/[0.04] font-medium text-cream/70 transition hover:border-copper/40 hover:bg-copper/10 hover:text-cream ${
          compact ? 'h-10 w-10 justify-center' : 'px-3 py-2 text-[12px]'
        }`}
      >
        {compact ? (
          <span className="text-[12px] font-semibold">{meta.short}</span>
        ) : (
          <>
            <Globe className="h-3.5 w-3.5 text-copper/70" />
            <span>{meta.short}</span>
          </>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label={ui.localeMenuAria}
          className="absolute end-0 top-[calc(100%+8px)] z-50 w-[168px] overflow-hidden rounded-2xl border border-cream/12 bg-[#161114]/97 p-1 shadow-panel backdrop-blur-xl"
        >
          {LOCALES.map((code) => {
            const item = LOCALE_META[code]
            const active = code === locale
            return (
              <button
                key={code}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => pick(code)}
                className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-start text-[12.5px] transition ${
                  active
                    ? 'bg-copper/15 font-semibold text-cream'
                    : 'text-cream/60 hover:bg-cream/[0.06] hover:text-cream'
                }`}
              >
                <span dir={item.dir} lang={item.htmlLang}>
                  {item.label}
                </span>
                {active && <Check className="h-3.5 w-3.5 shrink-0 text-copper" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ConfigContext, useConfig } from '../config/store'
import type { SiteConfig, Store } from '../config/store'
import { localize } from './index'
import {
  FALLBACK_LOCALE,
  LOCALE_META,
  detectLocale,
  isLocale,
  type Locale,
} from './types'

/**
 * 语言上下文。
 *
 * 结构很简单，但层次很关键：
 *
 *   ConfigProvider（阿拉伯语主库）
 *     └─ LocaleProvider  ← 在这里再包一层配置，换成「当前语言」
 *          └─ 页面组件   ← 照旧 useConfig()，拿到的就是翻译后的内容
 *     └─ 控制台          ← 留在这层外面，改的永远是阿拉伯语母版
 *
 * 这样做的好处：页面组件一行都不用改，
 * 而控制台不会因为切到英文就把英文存成母版。
 */

const STORAGE_KEY = 'nightyle.locale.v1'

/** 记住手动选择（刷新后沿用） */
const persist = (locale: Locale) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    /* 隐私模式：忽略 */
  }
}

/** 首次进入时的语言：?lang=xx → 本机记住的 → 浏览器语言 → 阿拉伯语 */
function initialLocale(): Locale {
  if (typeof window === 'undefined') return FALLBACK_LOCALE

  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (isLocale(fromUrl)) return fromUrl

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (isLocale(saved)) return saved
  } catch {
    /* ignore */
  }

  return detectLocale()
}

type LocaleStore = {
  locale: Locale
  setLocale: (next: Locale) => void
  /** 阿拉伯语主库（控制台编辑的那份） */
  base: SiteConfig
  /** 本地化后的配置 */
  config: SiteConfig
  dir: 'ltr' | 'rtl'
}

const LocaleContext = createContext<LocaleStore | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const outer = useConfig()
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    persist(next)

    // 写回地址栏：复制出去的链接会带着同一种语言
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href)
        if (next === FALLBACK_LOCALE) url.searchParams.delete('lang')
        else url.searchParams.set('lang', next)
        window.history.replaceState(
          window.history.state,
          '',
          `${url.pathname}${url.search}${url.hash}`,
        )
      } catch {
        /* ignore */
      }
    }
  }, [])

  const config = useMemo(() => localize(outer.config, locale), [outer.config, locale])
  const meta = LOCALE_META[locale] ?? LOCALE_META[FALLBACK_LOCALE]

  /**
   * 关键一步：给页面看的配置换成翻译版。
   *
   * 增删改的函数（set / update / importJson…）原样保留 ——
   * 它们写进 localStorage 的永远是阿拉伯语主库，
   * 所以你在英文界面下改内容，母版也不会被污染。
   */
  const innerStore = useMemo<Store>(
    () => ({ ...outer, config }),
    [outer, config],
  )

  /** <html lang / dir>：RTL 全靠这一行 */
  useEffect(() => {
    const root = document.documentElement
    root.lang = meta.htmlLang
    root.dir = meta.dir
    root.dataset.locale = locale
  }, [locale, meta.htmlLang, meta.dir])

  /** 页签标题、描述、分享卡片跟着语言走 */
  useEffect(() => {
    if (config.brand.docTitle) document.title = config.brand.docTitle

    const desc = document.querySelector('meta[name="description"]')
    if (desc && config.brand.docDescription) {
      desc.setAttribute('content', config.brand.docDescription)
    }

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle && config.heroSlides[0]?.title) {
      ogTitle.setAttribute('content', config.heroSlides[0].title)
    }
  }, [config.brand.docTitle, config.brand.docDescription, config.heroSlides])

  const value = useMemo<LocaleStore>(
    () => ({ locale, setLocale, base: outer.config, config, dir: meta.dir }),
    [locale, setLocale, outer.config, config, meta.dir],
  )

  return (
    <LocaleContext.Provider value={value}>
      <ConfigContext.Provider value={innerStore}>{children}</ConfigContext.Provider>
    </LocaleContext.Provider>
  )
}

/** 语言相关的读取口（切换器用） */
export function useLocale(): LocaleStore {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale 必须在 LocaleProvider 内使用')
  return ctx
}

/**
 * 页面组件统一从这里拿配置。
 *
 * 有 LocaleProvider 时拿到「当前语言」的那份；
 * 没有时退回到 useConfig()，单独渲染某个组件也不会崩。
 */
export function useSite(): SiteConfig {
  const ctx = useContext(LocaleContext)
  const { config } = useConfig()
  return ctx ? ctx.config : config
}

export { LOCALE_META }
export type { Locale }

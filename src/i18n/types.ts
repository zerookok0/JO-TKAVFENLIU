/**
 * 语言定义。
 *
 * 站点面向约旦市场：只提供阿拉伯语（默认，RTL）与英语两种。
 * 中文仍然留在代码里作为「主库默认值」，但不再是一种可选语言，
 * 访客永远不会看到中文界面。
 */

export const LOCALES = ['ar', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export type LocaleMeta = {
  code: Locale
  /** 该语言的自称，切换菜单里显示 */
  label: string
  /** 切换按钮上的短码 */
  short: string
  /** <html lang="…"> */
  htmlLang: string
  dir: 'ltr' | 'rtl'
  /** og:locale */
  ogLocale: string
  /** Intl 用的 BCP 47。阿语强制拉丁数字，避免与西文数字混排时忽大忽小 */
  intl: string
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  ar: {
    code: 'ar',
    label: 'العربية',
    short: 'ع',
    htmlLang: 'ar',
    dir: 'rtl',
    ogLocale: 'ar_JO',
    intl: 'ar-JO-u-nu-latn',
  },
  en: {
    code: 'en',
    label: 'English',
    short: 'EN',
    htmlLang: 'en',
    dir: 'ltr',
    ogLocale: 'en_US',
    intl: 'en-US',
  },
}

/** 认不出用户语言时用哪个 —— 约旦市场，默认阿拉伯语 */
export const FALLBACK_LOCALE: Locale = 'ar'

export const isLocale = (v: unknown): v is Locale =>
  typeof v === 'string' && (LOCALES as readonly string[]).includes(v)

/**
 * 浏览器语言 → 站点语言。
 *
 * 只看主语言标签（ar-JO、ar-EG、en-GB 都能认），
 * 用户手动切过之后就以手动为准（存在 localStorage）。
 * 除英语以外的任何语言，一律落到阿拉伯语。
 */
export function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return FALLBACK_LOCALE

  const list =
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language]

  for (const raw of list) {
    const tag = String(raw || '').toLowerCase().trim()
    if (!tag) continue
    const base = tag.split('-')[0]
    if (base === 'en') return 'en'
    if (base === 'ar') return 'ar'
  }

  return FALLBACK_LOCALE
}

import type { SiteConfig } from '../config/store'
import { applyLocale } from './merge'
import { en } from './messages/en'
import { ar } from './messages/ar'
import type { Locale } from './types'

/**
 * 语言包登记处。
 *
 * 站点只对外提供两种语言：阿拉伯语（默认）与英语。
 * 中文主库（src/config/defaults.ts）是「兜底数据源」，
 * 不是可切换的界面语言 —— 所以这里没有 zh 这一项。
 */
export const MESSAGES: Record<Locale, unknown> = {
  ar,
  en,
}

/**
 * 主库（中文默认值，含控制台本次编辑）→ 目标语言。
 *
 * 注意这里是纯函数，不读 localStorage、不读浏览器语言：
 * 谁调用、用哪种语言，都由上层决定。
 */
export function localize(config: SiteConfig, locale: Locale): SiteConfig {
  return applyLocale(config, MESSAGES[locale])
}

/** 某种语言大概翻译了百分之多少（用来提醒还缺哪些区块） */
export function coverage(config: SiteConfig, locale: Locale): number {
  const patch = MESSAGES[locale]
  if (!patch || typeof patch !== 'object') return 0

  const keys = Object.keys(config) as (keyof SiteConfig)[]
  const hit = keys.filter((k) => {
    const v = (patch as Record<string, unknown>)[k as string]
    if (v === undefined) return false
    if (Array.isArray(v)) return v.length > 0
    if (v && typeof v === 'object') return Object.keys(v).length > 0
    return true
  }).length

  return keys.length ? hit / keys.length : 0
}

/**
 * ════════════════════════════════════════════════════════════════
 *  数字、距离、模板填充  ·  约旦本地写法
 * ════════════════════════════════════════════════════════════════
 *
 *  为什么这些不能交给 toLocaleString 自己决定：
 *  同一条 128400，在不同浏览器里会变成 128K / ١٢٨٬٤٠٠ / 12.8万，
 *  和界面里其它数字的风格对不上。这里全部手写，输出稳定。
 *
 *  数字用拉丁数字（0-9）：约旦的社交应用普遍如此，
 *  和手机状态栏、点赞数、距离放在一起才不跳。
 */

/**
 * 按千分位加逗号：128400 → "128,400"
 *
 * 小数量级直接给准确值 —— 「128,400 个赞」比「128K」更有说服力。
 */
export const formatExact = (n: number): string => {
  if (!Number.isFinite(n)) return '0'
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 大数缩写：128400 → "128.4 ألف"
 *
 * 用阿拉伯语的「ألف」（千）而不是 K：
 * 这个站是约旦人看的，英文字母混在阿语句子里很刺眼。
 *
 * 小数量级仍然给准确值，因为点赞数大不大，对信任感是有影响的。
 */
export const formatCount = (n: number): string => {
  if (!Number.isFinite(n)) return '0'
  if (n < 10_000) return formatExact(n)

  const thousands = n / 1000
  // 一万以上才缩写，且只在超过 100 千时取整，避免 "128.4" 太长
  const text =
    thousands >= 100
      ? String(Math.round(thousands))
      : thousands.toFixed(1).replace(/\.0$/, '')

  return `${text} ألف`
}

/** 距离（公里）→ "620 م" / "1.2 كم" */
export const formatDistance = (km: number): string => {
  if (!Number.isFinite(km) || km <= 0) return '0 م'
  return km < 1 ? `${Math.round(km * 1000)} م` : `${km.toFixed(1)} كم`
}

/** 距离（米）→ "320 م" / "1.1 كم" */
export const formatMeters = (m: number): string => {
  if (!Number.isFinite(m) || m <= 0) return '0 م'
  return m < 1000 ? `${Math.round(m)} م` : `${(m / 1000).toFixed(1)} كم`
}

/**
 * 模板填充：fill('يبعد عنك {distance}', { distance: '360 م' })
 *
 * 为什么不直接字符串拼接：
 * 阿拉伯语的词序和中文、英文都不一样，而且介词要跟着词走 ——
 * 把变量位置固定在模板里，改文案时才不用动代码。
 *
 * 找不到的占位符原样保留，方便一眼发现写错的键。
 */
export const fill = (tpl: string, vars: Record<string, string | number>): string =>
  tpl.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in vars ? String(vars[key]) : whole,
  )

/** 新增列表项时用的短 id */
export const uid = (prefix = 'id'): string =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

/** #RRGGBB → "r g b"，给 CSS 变量用 */
export const hexToRgbChannels = (hex: string): string => {
  const clean = hex.replace('#', '').trim()
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean.padEnd(6, '0').slice(0, 6)
  const int = parseInt(full, 16)
  if (Number.isNaN(int)) return '124 27 44'
  return `${(int >> 16) & 255} ${(int >> 8) & 255} ${int & 255}`
}

/** 相对亮度，用于自动选择文字颜色 */
export const luminance = (hex: string): number => {
  const [r, g, b] = hexToRgbChannels(hex)
    .split(' ')
    .map((v) => Number(v) / 255)
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return clamp(0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b), 0, 1)
}

/** 十六进制合法校验 */
export const isHex = (v: string): boolean => /^#?[0-9a-fA-F]{6}$/.test(v.trim())

export const normalizeHex = (v: string): string => {
  const t = v.trim()
  if (!t.startsWith('#')) return `#${t.toUpperCase()}`
  return t.toUpperCase()
}

/** 只保留 http(s) 或 data:image，避免控制台里粘错协议把页面搞崩 */
export const safeImageUrl = (v: string): string => {
  const t = v.trim()
  if (!t) return ''
  if (/^(https?:\/\/|data:image\/)/i.test(t)) return t
  return ''
}

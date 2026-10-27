/**
 * 访客信号检测：国家 / 设备 / 语言。
 *
 * ── 国家：多源同时竞速 ─────────────────────────────────
 * 几个免费 IP 库**同时**发出，谁先成功听谁的——
 * 真实用户只等最快的那个，不用陪慢源干等。
 * 站点托管在 Cloudflare 上，它的 trace 接口通常第一个回来。
 * 全部失败才返回 null（交给 onError 决定放行还是拦截）。
 *
 * ── 预览参数（测试用，手动加在网址后）────────────────────
 *   ?geo=US          强制当成某国家（不区分大小写）
 *   ?device=desktop  强制当成电脑 / ?device=mobile 强制当成手机
 *   ?lang=zh         强制当成某界面语言
 * 三个参数可以叠加，例如 ?device=desktop&lang=zh
 * 不加参数就是真实检测。
 */

/** 单个源的请求超时：太长让访客干等，太短在慢网上误杀 */
const SOURCE_TIMEOUT_MS = 3000

/** 从 URL 读测试参数（geo / device / lang 共用） */
function forcedParam(key: string): string {
  if (typeof window === 'undefined') return ''
  try {
    return new URLSearchParams(window.location.search).get(key)?.trim() ?? ''
  } catch {
    return ''
  }
}

/* ══════════════════════ 国家 ══════════════════════ */

type Source = {
  url: string
  /** 从响应里提取两位国家代码，提不到返回 null */
  parse: (text: string) => string | null
}

const jsonCode = (text: string, key: string): string | null => {
  try {
    const code = String((JSON.parse(text) as Record<string, unknown>)[key] ?? '')
    return /^[A-Za-z]{2}$/.test(code) ? code.toUpperCase() : null
  } catch {
    return null
  }
}

const SOURCES: Source[] = [
  {
    url: 'https://www.cloudflare.com/cdn-cgi/trace',
    parse: (text) => {
      const line = text.split('\n').find((l) => l.startsWith('loc='))
      const code = line?.slice(4).trim().toUpperCase() ?? ''
      return /^[A-Z]{2}$/.test(code) ? code : null
    },
  },
  { url: 'https://ipapi.co/json/', parse: (text) => jsonCode(text, 'country_code') },
  { url: 'https://ipwho.is/', parse: (text) => jsonCode(text, 'country_code') },
]

async function trySource(source: Source): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), SOURCE_TIMEOUT_MS)
    const res = await fetch(source.url, { cache: 'no-store', signal: controller.signal })
    window.clearTimeout(timer)
    if (!res.ok) return null
    return source.parse(await res.text())
  } catch {
    /* 超时 / 被墙 / 解析失败 → 换下一个源 */
    return null
  }
}

/**
 * 访客所在国家（ISO 3166-1 两位大写），查不到返回 null。
 * 三个源同时竞速，取第一个成功的；全部失败才返回 null。
 * ?geo=XX 可强制指定，测试用。
 */
export async function detectCountry(): Promise<string | null> {
  if (typeof window === 'undefined') return null

  const forced = forcedParam('geo').toUpperCase()
  if (forced) return forced

  return new Promise((resolve) => {
    let remaining = SOURCES.length
    let settled = false

    SOURCES.forEach((source) => {
      void trySource(source).then((code) => {
        if (settled) return
        if (code) {
          /* 有人先答对了 —— 就听它的，后面回来的直接忽略 */
          settled = true
          resolve(code)
          return
        }
        remaining -= 1
        if (remaining === 0) {
          settled = true
          resolve(null)
        }
      })
    })
  })
}

/* ══════════════════════ 设备 ══════════════════════ */

/**
 * 是否手机（含平板）。
 * UA + 触屏判断：iPadOS 13+ 的 UA 伪装成 Mac，
 * 要靠 maxTouchPoints 认出来。这是内容分发用的粗略判断，
 * 不是安全校验——想绕过的人总能绕过，没关系。
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return true

  const forced = forcedParam('device').toLowerCase()
  if (forced === 'desktop') return false
  if (forced === 'mobile') return true

  const ua = navigator.userAgent
  if (/Macintosh/.test(ua) && (navigator.maxTouchPoints ?? 0) > 1) return true
  return /Android|iPhone|iPod|iPad|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    ua,
  )
}

/* ══════════════════════ 语言 ══════════════════════ */

/**
 * 浏览器的主要界面语言（小写）。
 * 取 navigator.languages 的第一个 —— 那是用户界面实际在用的语言，
 * 后面的只是备用偏好，不算数。?lang=zh 可强制指定，测试用。
 */
export function primaryLanguage(): string {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return ''

  const forced = forcedParam('lang').toLowerCase()
  if (forced) return forced

  return (navigator.languages?.[0] ?? navigator.language ?? '').toLowerCase()
}

/**
 * 主语言是否命中拦截列表。前缀匹配：
 * 'zh' 能命中 zh-CN / zh-TW / zh-Hans / zh-SG。
 */
export function isLanguageBlocked(blockList: string[]): boolean {
  if (!blockList.length) return false
  const lang = primaryLanguage()
  if (!lang) return false
  return blockList.some(
    (prefix) => prefix && lang.startsWith(prefix.trim().toLowerCase()),
  )
}

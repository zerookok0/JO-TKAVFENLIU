/**
 * ────────────────────────────────────────────────────────────────
 *  内嵌浏览器（In-App Browser）识别  ·  为什么必须做这件事
 * ────────────────────────────────────────────────────────────────
 *
 *  FB 投流进来的流量，默认落在 Facebook 自己的内置浏览器里。
 *  这个 WebView 不允许下载 APK：
 *    · Android 上点击 .apk 直链，多数机型没有任何反应（不报错，也不下载）
 *    · iOS 上根本没有「安装未知来源应用」这一说，点了只会打开一个坏页面
 *
 *  也就是说：不处理的话，这批流量点「下载」= 静默失败，
 *  像素那边还照常记一次 Purchase，钱花了、转化是假的。
 *
 *  所以这里做三件事：
 *    1. 认出当前是不是内嵌浏览器（FB / IG / Messenger / TikTok / LINE …）
 *    2. 给一个「尝试自动打开系统浏览器」的动作（Android intent / iOS x-safari）
 *    3. 自动打开失败时，把当前链接复制到剪贴板，让人自己粘到浏览器
 *
 *  预览参数（和 geo.ts 那套保持同一个习惯，方便本地截图）：
 *    ?iab=fb        强制当成 Facebook 内置浏览器
 *    ?iab=ig        Instagram
 *    ?iab=1         其它内嵌浏览器
 *    ?iab=0         强制当成普通浏览器（关掉引导）
 * ────────────────────────────────────────────────────────────────
 */

export type InAppFamily =
  | 'facebook'
  | 'messenger'
  | 'instagram'
  | 'tiktok'
  | 'line'
  | 'other'
  | null

/**
 * 认出是哪个 App 的内置浏览器，就把名字说对。
 *
 * 说「فيسبوك」比说「هذا التطبيق」有用得多 ——
 * 用户要去找的是那个 App 右上角的「⋯」，
 * 名字不对，他会在错的界面里翻半天。
 */
export function appLabelAr(family: InAppFamily): string {
  switch (family) {
    case 'facebook':
      return 'فيسبوك'
    case 'messenger':
      return 'ماسنجر'
    case 'instagram':
      return 'إنستغرام'
    case 'tiktok':
      return 'تيك توك'
    case 'line':
      return 'لاين'
    default:
      return 'هذا التطبيق'
  }
}

/** 读网址上的测试参数 */
function forcedParam(key: string): string {
  if (typeof window === 'undefined') return ''
  try {
    return new URLSearchParams(window.location.search).get(key)?.trim() ?? ''
  } catch {
    return ''
  }
}

function ua(): string {
  if (typeof navigator === 'undefined') return ''
  return navigator.userAgent
}

/** iOS（含 iPadOS 13+ 伪装成 Mac 的情况） */
export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  const u = ua()
  if (/iPad|iPhone|iPod/.test(u)) return true
  return /Macintosh/.test(u) && (navigator.maxTouchPoints ?? 0) > 1
}

export function isAndroid(): boolean {
  return /Android/i.test(ua())
}

/**
 * 当前是不是内嵌浏览器。
 *
 * 判定全部基于 UA 里的客户端标识 —— 这套标识十几年没变过，
 * 比任何 JS 特征检测都稳。顺序很重要：
 *   · Messenger 的 UA 里同时带 FBAN，必须先判 Messenger
 *   · Instagram 的 UA 里也常带 FBAN，必须排在 Facebook 前面
 */
export function detectInAppBrowser(): InAppFamily {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return null

  const forced = forcedParam('iab').toLowerCase()
  if (forced === '0' || forced === 'off' || forced === 'no') return null
  if (forced === 'fb' || forced === 'facebook') return 'facebook'
  if (forced === 'ig' || forced === 'instagram') return 'instagram'
  if (forced === 'tt' || forced === 'tiktok') return 'tiktok'
  if (forced) return 'other'

  const u = ua()
  if (/FB_IAB\/MESSENGER|MessengerForiOS|FBAN\/Messenger/i.test(u)) return 'messenger'
  if (/Instagram/i.test(u)) return 'instagram'
  if (/FBAN|FBAV|FB_IAB|FB4A|FBIOS/i.test(u)) return 'facebook'
  if (/musical_ly|BytedanceWebview|trill_|TikTok/i.test(u)) return 'tiktok'
  if (/\bLine\//i.test(u)) return 'line'
  if (/Twitter|WhatsApp|Pinterest|Snapchat|MicroMessenger|Telegram/i.test(u)) return 'other'
  return null
}

/**
 * 尝试把当前（或指定）网址交给系统浏览器打开。
 *
 * Android：用 intent:// 直接点名 Chrome。
 *   `S.browser_fallback_url` 是兜底 —— 没装 Chrome 时系统会退回普通跳转，
 *   不会留在白屏。
 * iOS：用 `x-safari-` 前缀。iOS 14+ 的 Safari 认这个 scheme；
 *   认不出来的版本会静默失败，所以调用方必须同时准备「复制链接」这条路。
 *
 * 返回值没有意义 —— 成功与否只能靠调用方过一会儿看页面有没有被切走。
 */
export function openInSystemBrowser(url: string): void {
  if (typeof window === 'undefined') return

  if (isAndroid()) {
    try {
      const target = new URL(url, window.location.href)
      const fallback = encodeURIComponent(target.href)
      window.location.href =
        `intent://${target.host}${target.pathname}${target.search}#Intent;` +
        `scheme=${target.protocol.replace(':', '')};` +
        `package=com.android.chrome;` +
        `S.browser_fallback_url=${fallback};end`
      return
    } catch {
      /* URL 解析失败就退回直接跳转 */
    }
  }

  if (isIOS()) {
    window.location.href = `x-safari-${url}`
    return
  }

  window.location.href = url
}

/**
 * 复制文本。
 *
 * 优先 Clipboard API。它在非 HTTPS、或某些 WebView 里会直接抛错/被拒，
 * 所以保留 textarea + execCommand 这条老路 —— 在 FB 的 WebView 里
 * 反而是它更容易成功。
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof document === 'undefined') return false

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* 落到下面的兜底 */
  }

  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.top = '-1000px'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    area.setSelectionRange(0, area.value.length)
    const ok = document.execCommand('copy')
    document.body.removeChild(area)
    return ok
  } catch {
    return false
  }
}

/**
 * ────────────────────────────────────────────────────────────────
 *  Facebook Pixel  ·  事件口径
 * ────────────────────────────────────────────────────────────────
 *  不是「只有两个按钮」触发，而是「两个事件」：
 *
 *  1) 任何入口弹出下载框  → InitiateCheckout（openSheet 统一触发）
 *     包括：顶部导航 / 首屏按钮 / 手机内点赞评论收藏分享 /
 *           附近的人卡片 / 聊天输入框 / 安装区 CTA / 底部 dock / 备用直链
 *  2) 弹窗内「开始下载」  → Purchase（并发起跳转）
 *
 *  其余按钮（FAQ / 取消 / 关闭 / 菜单）不触发，这是故意的。
 *  每个入口都会带一个 source，方便在事件管理器里看哪个入口转化最好。
 * ────────────────────────────────────────────────────────────────
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
  }
}

type Fbq = ((...args: unknown[]) => void) & {
  queue?: unknown[]
  loaded?: boolean
  version?: string
  push?: Fbq
}

const PIXEL_SRC = 'https://connect.facebook.net/en_US/fbevents.js'

let injected = false
/** 本页已绑定的 Pixel ID。一个页面只允许绑一个，否则会双份计数。 */
let boundId = ''

const active = (pixelId: string): boolean => Boolean(pixelId && pixelId.trim())

/** 控制台自检：在浏览器 Console 里看事件是否真的发出去了 */
const isDev = typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV)

/**
 * 建一个「占位队列」。
 *
 * fbevents.js 是异步加载的，脚本到手之前不能直接调 fbq。
 * 官方片段的做法就是先放一个把参数推进队列的假函数，
 * 等 SDK 加载完成后由它把队列补发出去。
 *
 * 所以 queue / loaded / version / push 这四个属性一个都不能少 ——
 * 少一个，队列就不会被接走，事件会静默消失，
 * 而页面上看不出任何异常，只有事件管理器里数字变少。
 */
function ensureStub(): Fbq {
  if (typeof window.fbq === 'function') return window.fbq

  const stub = function (...args: unknown[]) {
    stub.queue!.push(args)
  } as Fbq

  stub.queue = []
  stub.loaded = true
  stub.version = '2.0'
  stub.push = stub

  window.fbq = stub
  window._fbq = stub
  return stub
}

/** 注入脚本，只注入一次 */
function injectScript() {
  if (injected) return
  injected = true
  const script = document.createElement('script')
  script.async = true
  script.src = PIXEL_SRC
  document.head.appendChild(script)
}

/**
 * 初始化 Pixel。
 *
 * 关键行为：一个页面只认第一个 ID。
 *
 * 为什么不在 ID 变化时重新 init：
 * fbq('track') 是「广播」，会把事件发给页面上所有已初始化的 Pixel。
 * 如果在控制台把 ID 从 A 改成 B 还顺手 re-init，
 * 那之后每次点击都会同时记到 A 和 B 头上 ——
 * 两边数据都被污染，且从后台看不出问题（数字只会更好看）。
 * 所以这里改成：发现 ID 变了只提示，要求刷新页面。
 */
export function initPixel(pixelId: string) {
  if (typeof window === 'undefined') return
  const id = pixelId.trim()
  if (!active(id)) return

  if (boundId === id) return
  if (boundId && boundId !== id) {
    if (isDev) {
      console.warn('[pixel] 本页已绑定', boundId, '，新 ID', id, '未生效 —— 请刷新页面')
    }
    return
  }

  const fbq = ensureStub()
  injectScript()

  boundId = id
  fbq('init', id)
  fbq('track', 'PageView')

  if (isDev) console.info('[pixel] init', id)
}

/** 埋点：只从下面两个白名单入口调用 */
export function trackLead(
  pixelId: string,
  event: 'InitiateCheckout' | 'Purchase',
  source: string,
) {
  if (typeof window === 'undefined') return

  if (!active(pixelId)) {
    if (isDev) console.warn('[pixel] 未配置 Pixel ID，事件被跳过：', event, source)
    return
  }
  if (typeof window.fbq !== 'function') {
    if (isDev) console.warn('[pixel] fbq 尚未就绪，事件被跳过：', event, source)
    return
  }

  window.fbq('track', event, {
    content_name: source,
    content_category: 'app_download',
    currency: 'USD',
    value: 0,
  })

  if (isDev) console.info('[pixel] 已上报', event, '←', source)
}

/** 外层按钮：所有「下载」入口统一走这里 → InitiateCheckout */
export function trackOuter(pixelId: string, source: string) {
  trackLead(pixelId, 'InitiateCheckout', source)
}

/**
 * 弹窗内按钮：先上报，再跳转。
 *
 * 跳转会打断尚未发出的请求，所以：
 *  - 先触发 Purchase
 *  - 再等一小段时间让 fbevents 把请求送出去
 *  - 然后用一个 a[download] 点击去下载（比 location.href 更不容易被拦截）
 *
 * `innerFired` 是防重复：用户连点两下、或触屏上手抖，
 * 同一个弹窗会连发两次 Purchase，转化数直接翻倍。
 * 记一个「本次打开已上报」的标记，第二次点击只负责跳转，不再回传。
 * 用户重新打开弹窗时由 App 侧调用 resetInnerGuard() 复位，
 * 所以下一次真正的新下载照常计数，不会被永久锁死。
 */
let innerFired = false

/** 每次弹窗重新打开时复位，让新一轮下载能正常计数 */
export function resetInnerGuard() {
  innerFired = false
}

export function trackInnerAndGo(pixelId: string, apkUrl: string, source = 'dl_inner_modal') {
  const go = () => {
    if (!apkUrl) return
    const a = document.createElement('a')
    a.href = apkUrl
    a.rel = 'noopener'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  if (innerFired) {
    if (isDev) console.warn('[pixel] Purchase 本次已上报，跳过重复回传')
    go()
    return
  }

  if (!active(pixelId)) {
    go()
    return
  }

  innerFired = true
  trackLead(pixelId, 'Purchase', source)
  window.setTimeout(go, 400)
}

/**
 * ════════════════════════════════════════════════════════════════
 *  从视频里抓候选封面帧
 * ════════════════════════════════════════════════════════════════
 *
 *  用途：贴一个视频直链 → 抓几张不同位置的画面 → 你挑一张当封面。
 *
 *  ── 为什么「能播」但抓不到 ─────────────────────────────
 *
 *  这是最容易让人困惑的一点，值得说清楚：
 *
 *    <video> 播放          → 不需要 CORS，跨域也能放
 *    canvas.drawImage()    → 需要 CORS，否则画布被标记为「污染」
 *    canvas.toDataURL()    → 画布被污染时直接抛 SecurityError
 *
 *  所以「我在新标签页能播」和「抓帧失败」完全不矛盾 ——
 *  前者是 <video> 的能力，后者是 canvas 的限制。
 *
 *  这是浏览器的安全边界，前端没有任何办法绕过去。
 *  唯一的解法是让视频服务器返回 Access-Control-Allow-Origin。
 *
 *  ── 所以这里的做法 ─────────────────────────────────────
 *  把失败分成几种，各自给准确说明，不再混成一句模糊提示：
 *    · 读不到元数据      → 链接/格式问题
 *    · 能读但导不出来    → 明确的 CORS 问题（附怎么修）
 */

/** 抓帧的时间点分布：避开片头片尾，覆盖中段 */
export const FRAME_POINTS = [0.12, 0.28, 0.45, 0.62, 0.8]

export type CapturedFrame = {
  /** 这一帧在视频里的位置（0~1） */
  at: number
  /** dataURL，可直接当封面 */
  dataUrl: string
}

export type CaptureFailure = {
  ok: false
  /** 短标题，一行说清是什么问题 */
  error: string
  /** 为什么会这样 */
  hint: string
  /** 怎么解决 */
  fix?: string
  /** 是不是跨域导致的（用来决定要不要推「贴一张图」的退路） */
  cors: boolean
}

export type CaptureResult =
  | { ok: true; frames: CapturedFrame[]; duration: number }
  | CaptureFailure

/* ── 底层工具 ───────────────────────────────────────────── */

/** 把视频画到 canvas 并导出 dataURL；被污染时抛 SecurityError */
function grab(video: HTMLVideoElement, at: number, width = 360): CapturedFrame {
  const ratio = video.videoHeight / video.videoWidth || 16 / 9
  const w = width
  const h = Math.round(w * ratio)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas-unsupported')

  ctx.drawImage(video, 0, 0, w, h)

  // JPEG 0.72：手机框只有 420px 宽，这个质量够用，
  // 体积比 PNG 小一个量级，存 localStorage 才放得下
  return { at, dataUrl: canvas.toDataURL('image/jpeg', 0.72) }
}

/** 等元数据。读不到返回 null */
function readMeta(
  video: HTMLVideoElement,
  timeoutMs = 12000,
): Promise<{ duration: number } | null> {
  return new Promise((resolve) => {
    let settled = false
    const done = (v: { duration: number } | null) => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      video.removeEventListener('loadedmetadata', onOk)
      video.removeEventListener('error', onFail)
      resolve(v)
    }
    const onOk = () =>
      done({ duration: Number.isFinite(video.duration) ? video.duration : 0 })
    const onFail = () => done(null)
    const timer = window.setTimeout(() => done(null), timeoutMs)

    video.addEventListener('loadedmetadata', onOk, { once: true })
    video.addEventListener('error', onFail, { once: true })

    // 可能已经就绪
    if (video.readyState >= 1) onOk()
  })
}

/** seek 到某个时间点 */
function seekTo(video: HTMLVideoElement, time: number, timeoutMs = 8000): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false
    const done = (ok: boolean) => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      video.removeEventListener('seeked', onOk)
      video.removeEventListener('error', onFail)
      resolve(ok)
    }
    const onOk = () => done(true)
    const onFail = () => done(false)
    const timer = window.setTimeout(() => done(false), timeoutMs)

    video.addEventListener('seeked', onOk, { once: true })
    video.addEventListener('error', onFail, { once: true })
    video.currentTime = time
  })
}

/** 带 crossOrigin 探测：能不能跨域读到元数据 */
async function probeWithCors(src: string): Promise<boolean> {
  const v = document.createElement('video')
  v.muted = true
  v.playsInline = true
  v.preload = 'metadata'
  v.crossOrigin = 'anonymous'
  v.src = src
  const r = await readMeta(v, 8000)
  return !!r && r.duration > 0
}

/** 不带 crossOrigin 探测：确认视频本身是好的 */
async function probePlain(src: string): Promise<boolean> {
  const v = document.createElement('video')
  v.muted = true
  v.playsInline = true
  v.preload = 'metadata'
  v.src = src
  const r = await readMeta(v, 8000)
  return !!r && r.duration > 0
}

/* ── 主流程 ─────────────────────────────────────────────── */

export type CorsCheck = {
  ok: boolean
  /** 读到的 Access-Control-Allow-Origin，没有就是空 */
  acao: string
  /** 一句话结论 */
  verdict: string
  /** 建议动作 */
  action: string
  /** 视频和页面是否同源（同源根本不需要 CORS） */
  sameOrigin: boolean
}

/**
 * 判断是不是同源。
 *
 * 为什么这件事最值得先算：
 * 同源请求根本不走 CORS，canvas 不会被污染，抓帧直接可用。
 * 很多人花时间配存储桶策略，其实页面和视频本来就在同一个域名下 ——
 * 这一项算出来是 true，就完全不用配。
 *
 * 同源 = 协议 + 域名 + 端口三项全等。
 */
function isSameOrigin(url: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const a = new URL(url)
    const b = new URL(window.location.href)
    return a.protocol === b.protocol && a.hostname === b.hostname && a.port === b.port
  } catch {
    return false
  }
}

/**
 * 单独检查跨域配置。
 *
 * 为什么值得单独做一个：
 * 抓帧失败时你分不清是「CORS 没配好」还是「视频有问题」，
 * 这个只看响应头 —— 一眼就能确定是不是配置那一步的问题。
 *
 * 关于 Origin：不要手动加 headers: { Origin }。
 * Origin 是 fetch 的「禁止头」，浏览器会静默忽略，等于没写。
 * 好消息是跨域请求浏览器本来就会自动带上 Origin，所以什么都不用做。
 */
export async function checkCors(src: string): Promise<CorsCheck> {
  const url = src.trim()
  if (!url) {
    return {
      ok: false,
      acao: '',
      verdict: '还没填视频链接',
      action: '先填链接再来测',
      sameOrigin: false,
    }
  }

  /* 同源优先判断：同源不需要任何 CORS 配置 */
  const sameOrigin = isSameOrigin(url)
  if (sameOrigin) {
    return {
      ok: true,
      acao: '（同源，不需要 CORS）',
      verdict: '视频和页面同一个域名，走的是同源请求',
      action: '不需要配任何跨域规则，直接点「抓 5 帧」就能用',
      sameOrigin,
    }
  }

  try {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 10000)

    const res = await fetch(url, {
      method: 'HEAD',
      // 注意：不要写 headers.Origin —— 那是禁止头，浏览器会忽略。
      // 跨域请求会自动带上 Origin，服务端据此决定回不回 CORS 头。
      signal: controller.signal,
    })
    window.clearTimeout(timer)

    const acao = res.headers.get('access-control-allow-origin') ?? ''

    if (!res.ok) {
      return {
        ok: false,
        acao,
        verdict: `服务器返回 ${res.status}`,
        action: '链接本身有问题，先确认这个地址能正常打开',
        sameOrigin,
      }
    }

    if (acao === '*') {
      return {
        ok: true,
        acao,
        verdict: '跨域已放开（*）',
        action: '现在回去点「抓 5 帧」就能用了',
        sameOrigin,
      }
    }

    if (acao && (acao === window.location.origin || acao.includes(window.location.host))) {
      return {
        ok: true,
        acao,
        verdict: `只允许 ${acao}`,
        action: '当前域名在白名单里，可以抓帧',
        sameOrigin,
      }
    }

    if (!acao) {
      return {
        ok: false,
        acao: '',
        verdict: '响应里没有 Access-Control-Allow-Origin',
        action:
          '跨域还没生效。确认规则已经保存、约 30 秒后再测；也检查 AllowedOrigins 里是否包含当前域名',
        sameOrigin,
      }
    }

    return {
      ok: false,
      acao,
      verdict: `只允许了 ${acao}，不是你当前域名`,
      action: `把当前域名 ${window.location.origin} 加进 AllowedOrigins 里，或者直接填 *`,
      sameOrigin,
    }
  } catch (err) {
    const aborted = err instanceof Error && err.name === 'AbortError'
    return {
      ok: false,
      acao: '',
      verdict: aborted ? '请求超时' : '请求被拒绝（可能是跨域直接拦掉了）',
      action: '如果规则刚保存，等 30 秒再试；仍然不行就检查存储桶的 CORS 策略',
      sameOrigin,
    }
  }
}

export async function captureFrames(
  src: string,
  points: number[] = FRAME_POINTS,
): Promise<CaptureResult> {
  const url = src.trim()

  if (!url) {
    return {
      ok: false,
      error: '还没有视频链接',
      hint: '先把视频直链填好，再回来抓帧。',
      cors: false,
    }
  }

  /* 第一步：带 CORS 读一次元数据 */
  const readable = await probeWithCors(url)

  if (!readable) {
    /*
      带 CORS 读不到，有两种可能：
        a) 视频本身有问题（404 / 格式不对）
        b) 服务器不支持 CORS，加了 crossOrigin 就连加载都被拒

      用一个不带 crossOrigin 的探测区分开 —— 这个能读，
      就说明视频是好的，问题 100% 出在跨域上。
      这样提示才准，不会让人去查一个本来没问题的链接。
    */
    const playable = await probePlain(url)

    if (playable) {
      const same = isSameOrigin(url)
      return {
        ok: false,
        error: same
          ? '视频能播，但抓帧被拒绝了'
          : '视频能播，但这个服务器不允许跨域读取',
        hint: same
          ? '页面和视频在同一个域名下，本来不需要 CORS。' +
            '这种情况通常是：视频设置了防盗链、拒绝了带 Origin 的请求，' +
            '或者当前页面的协议/端口和视频地址不一致。'
          : '这是浏览器的安全限制，不是链接坏了：<video> 播放跨域视频没问题，' +
            '但把画面画进 canvas 再导出成图片时，如果服务器没返回 Access-Control-Allow-Origin，' +
            '浏览器会直接拒绝，防止网页偷偷读取其它站点的内容。' +
            '所以「能播」和「能抓帧」是两件事。',
        fix:
          '办法一：把视频放到自己可控、能开跨域的存储（Cloudflare R2 / 阿里云 OSS / AWS S3），' +
          '在该存储桶设置里加一条 AllowedOrigins = *、AllowedMethods = GET, HEAD。' +
          '办法二：跳过抓帧，直接在下面「封面图 URL」贴一张现成的图。',
        cors: true,
      }
    }

    return {
      ok: false,
      error: '视频读不出来',
      hint: '这个链接可能失效、不是 .mp4，或者服务器拒绝了请求。',
      fix: '把链接粘到浏览器地址栏回车，确认能直接播放，再回来填。',
      cors: false,
    }
  }

  /* 第二步：真去抓帧 */
  const video = document.createElement('video')
  video.muted = true
  video.playsInline = true
  video.preload = 'auto'
  video.crossOrigin = 'anonymous'
  video.src = url

  const meta = await readMeta(video, 12000)
  if (!meta || meta.duration <= 0) {
    return {
      ok: false,
      error: '读不到视频时长',
      hint: '这个源可能不是完整的视频文件（比如只是一张图或一个网页地址）。',
      fix: '确认链接以 .mp4 结尾，并且在新标签页打开时是直接播放视频。',
      cors: false,
    }
  }

  const duration = meta.duration
  const frames: CapturedFrame[] = []
  let blocked = false

  for (const at of points) {
    // 留余量，别贴片尾
    const t = Math.min(duration * at, duration - 0.2)
    if (t <= 0) continue

    const seeked = await seekTo(video, t)
    if (!seeked) continue

    // seeked 之后下一帧才真正解码完成，等一拍更稳
    await new Promise((r) => window.setTimeout(r, 60))

    try {
      frames.push(grab(video, at))
    } catch (err) {
      // SecurityError = 画布被污染，就是跨域问题，不必再试其它时间点
      const name = err instanceof Error ? err.name : ''
      if (name === 'SecurityError') {
        blocked = true
        break
      }
      /* 其它错误跳过着继续 */
    }
  }

  if (blocked || frames.length === 0) {
    return {
      ok: false,
      error: blocked ? '画面读到了，但导不出来（跨域限制）' : '一帧都没抓到',
      hint: blocked
        ? '视频本身没问题、时间点也定位到了，只是在「把画面导出成图片」这一步被拦住 —— ' +
          '这个服务器的响应里没有 Access-Control-Allow-Origin。'
        : '可能是视频编码浏览器解不开，或者服务器中途断开了请求。',
      fix:
        '把视频放到自己可控且开了跨域的存储（R2 / OSS / S3），或者直接用「封面图 URL」贴一张现成的图。',
      cors: true,
    }
  }

  return { ok: true, frames, duration }
}

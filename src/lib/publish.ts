/**
 * ════════════════════════════════════════════════════════════════
 *  把控制台里的内容写进仓库文件
 * ════════════════════════════════════════════════════════════════
 *
 *  浏览器不能直接写硬盘。所以真正落盘的那一步由本地的 vite 服务
 *  代劳：它开了一个 /__publish 接口（见 vite.config.ts），
 *  只在 `npm run dev` / `npm run preview` 时存在。
 *
 *  这意味着两件事，界面上必须让人看清楚：
 *    · 在本地开发服务器上点 → 真的写进 src/config/site.content.ts
 *    · 在已部署的线上站点上点 → 根本没有这个接口，必然失败
 *
 *  第二种情况不应该报「出错了」，那会让人以为是 bug；
 *  它只是「这里不是发布的地方」，所以单独给一个 offline 原因。
 */

export type PublishResult =
  | { ok: true; keys: number; file: string }
  | { ok: false; reason: 'offline' | 'error'; error: string }

/** 判断当前页面是不是跑在本地开发/预览服务器上 */
export function isLocalDevHost(): boolean {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '0.0.0.0'
}

export async function publishToRepo(content: unknown): Promise<PublishResult> {
  /* 线上静态站没有后端，直接说清楚，不用发一个注定 404 的请求 */
  if (!isLocalDevHost()) {
    return {
      ok: false,
      reason: 'offline',
      error: '当前是线上静态页面，没有写入接口。请在本地 npm run dev 下操作。',
    }
  }

  try {
    const res = await fetch('/__publish', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    const type = res.headers.get('content-type') ?? ''

    /* 接口不存在时，静态服务器会返回 index.html —— 用 content-type 认出来 */
    if (!type.includes('application/json')) {
      return {
        ok: false,
        reason: 'offline',
        error: '没有找到写入接口。确认是在 npm run dev 而不是线上页面。',
      }
    }

    const data = (await res.json()) as {
      ok?: boolean
      error?: string
      keys?: number
      file?: string
    }

    if (!res.ok || !data.ok) {
      return { ok: false, reason: 'error', error: data.error ?? `HTTP ${res.status}` }
    }

    return { ok: true, keys: data.keys ?? 0, file: data.file ?? '' }
  } catch (e) {
    return {
      ok: false,
      reason: 'error',
      error: e instanceof Error ? e.message : String(e),
    }
  }
}

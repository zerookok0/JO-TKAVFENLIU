import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'

/**
 * 默认用 '/'，本地开发和控制台预览都正常。
 *
 * 部署到 GitHub Pages 的「项目页」（地址形如 用户名.github.io/仓库名/）时，
 * 静态资源必须带上 /仓库名/ 前缀，否则 JS/CSS 会 404、页面白屏。
 *
 * 这个前缀由 .github/workflows/deploy.yml 在构建时通过 VITE_BASE 自动注入，
 * 不需要你手改代码。手工构建时也可以临时指定：
 *
 *   VITE_BASE=/你的仓库名/ npm run build
 */
export default defineConfig({
  plugins: [react(), publishPlugin()],
  base: process.env.VITE_BASE ?? '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})

/* ════════════════════════════════════════════════════════════════
 *  一键发布：把控制台里的内容写进仓库文件
 * ════════════════════════════════════════════════════════════════
 *
 *  ── 为什么需要这段 ──────────────────────────────────────
 *
 *  浏览器没有权限写你的硬盘。控制台点「保存」，内容只进了
 *  localStorage —— 那是你自己这台设备的草稿，不是发布。
 *
 *  线上站点是构建产物，构建时读的是 src/config/site.content.ts。
 *  这个文件一直是 {} 的话，线上永远是代码里的默认值，
 *  不管你在 /admin 里改了多少、预览看起来多正常。
 *
 *  ── 所以这里开一个小接口 ────────────────────────────────
 *
 *  只在 `npm run dev` / `npm run preview` 时存在（apply: 'serve'），
 *  构建出来的静态站里根本没有这段代码 —— 站点上线后
 *  访客不可能往里写任何东西。
 *
 *  控制台点「写入仓库文件」→ POST /__publish → 这里落盘。
 *  之后你只需要 git commit + push。
 */

const CONTENT_FILE = resolve(process.cwd(), 'src/config/site.content.ts')

/** 写出来的文件头，和 scripts/apply-config.mjs 保持一致的口径 */
const FILE_HEADER = `/**
 * ⚠️ 这个文件由「控制台 → 一键写入」或 \`npm run config:apply\` 生成，请勿手改。
 *
 * 它的作用是：把你在内容控制台里调好的内容，变成仓库里真实存在的一份数据。
 * 空对象 {} 表示「全部沿用代码里的默认值」。
 *
 * 流程：
 *   1. 控制台点「写入仓库文件」（需要本地 npm run dev 在跑）
 *   2. git add src/config/site.content.ts
 *   3. git commit -m "chore: 更新站点内容" && git push
 */
`

/** 单次请求体上限：几条视频的封面 dataURL 加起来可以不小，但也不该无限大 */
const MAX_BODY = 12_000_000

function publishPlugin(): Plugin {
  /**
   * 处理 POST /__publish。
   *
   * 只做三件事：校验是不是对象、写文件、回一句人话。
   * 不在这里做 schema 校验 —— 页面渲染时 store.tsx 会用默认值深合并补全，
   * 少字段不会把站点搞坏，多字段也只是被忽略。
   */
  const handler = (req: IncomingMessage, res: ServerResponse) => {
    const send = (code: number, payload: unknown) => {
      res.statusCode = code
      res.setHeader('content-type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(payload))
    }

    if (req.method !== 'POST') {
      send(405, { ok: false, error: '只接受 POST' })
      return
    }

    let raw = ''
    req.setEncoding('utf8')
    req.on('data', (chunk: string) => {
      raw += chunk
      if (raw.length > MAX_BODY) {
        req.destroy()
        send(413, { ok: false, error: '内容太大（超过 12MB），请减少内嵌图片' })
      }
    })

    req.on('end', () => {
      try {
        const parsed = JSON.parse(raw) as { content?: unknown }
        const content = parsed?.content

        if (!content || typeof content !== 'object' || Array.isArray(content)) {
          send(400, { ok: false, error: '内容必须是一个对象 { ... }' })
          return
        }

        const body = `${FILE_HEADER}export const SITE_CONTENT: Record<string, unknown> = ${JSON.stringify(
          content,
          null,
          2,
        )}\n`

        writeFileSync(CONTENT_FILE, body, 'utf8')

        /* 写盘之后 Vite 会自己热更新一次 —— 页面立刻就用上这份内容了 */
        send(200, {
          ok: true,
          file: 'src/config/site.content.ts',
          keys: Object.keys(content as Record<string, unknown>).length,
        })
      } catch (e) {
        send(500, {
          ok: false,
          error: e instanceof Error ? e.message : String(e),
        })
      }
    })
  }

  return {
    name: 'nightyle-publish',
    /** 只在 serve / preview 生效；vite build 不会带这段代码 */
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__publish', handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/__publish', handler)
    },
  }
}

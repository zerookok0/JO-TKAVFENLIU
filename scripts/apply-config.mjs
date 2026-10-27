#!/usr/bin/env node
/**
 * 把内容控制台导出的 JSON，写进仓库里的配置文件。
 *
 * 用法：
 *   npm run config:apply                 读取 ./site-config.json
 *   npm run config:apply -- 某路径.json   读取指定文件
 *   npm run config:reset                 清空覆盖，回到代码默认值
 *
 * 之所以要这一步：浏览器里的控制台没有权限写你的硬盘，
 * 它只能把配置存在本机 localStorage。要让它进 git、让所有人看到，
 * 必须落成仓库里的一个文件 —— 就是下面这个 OUT。
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'

const ROOT = process.cwd()
const OUT = resolve(ROOT, 'src/config/site.content.ts')
const DEFAULT_INPUT = resolve(ROOT, 'site-config.json')

/** 已知的顶层字段，用来提示拼错/过期的键 */
const KNOWN_KEYS = [
  'brand',
  'download',
  'theme',
  'nav',
  'buttons',
  'hero',
  'heroSlides',
  'highlightsCopy',
  'highlights',
  'nearbyCopy',
  'people',
  'howCopy',
  'steps',
  'chatCopy',
  'chat',
  'installCopy',
  'installSteps',
  'safety',
  'faqs',
  'modalCopy',
  'gates',
  'footer',
  'videos',
  'ui',
]

const HEADER = `/**
 * ⚠️ 这个文件由 \`npm run config:apply\` 自动生成，请勿手改。
 *
 * 它的作用是：把你在内容控制台里调好的内容，变成仓库里真实存在的一份数据。
 * 空对象 {} 表示「全部沿用代码里的默认值」。
 *
 * 流程：
 *   1. 控制台 →「数据」→ 导出为文件（得到 site-config.json）
 *   2. 把文件放到项目根目录，终端运行 npm run config:apply
 *   3. 提交并推送，线上就生效了
 */
`

const rel = (p) => relative(ROOT, p) || p

function write(content, note) {
  const body = `${HEADER}export const SITE_CONTENT: Record<string, unknown> = ${JSON.stringify(
    content,
    null,
    2,
  )}\n`
  writeFileSync(OUT, body, 'utf8')
  console.log(`\n✅ 已写入 ${rel(OUT)}${note ? `（${note}）` : ''}`)
  console.log('\n下一步：\n')
  console.log('  git add src/config/site.content.ts')
  console.log('  git commit -m "chore: 更新站点内容配置"')
  console.log('  git push\n')
}

/* ─────────────── 重置 ─────────────── */

if (process.argv.includes('--reset')) {
  write({}, '已清空所有覆盖')
  process.exit(0)
}

/* ─────────────── 读取输入 ─────────────── */

const arg = process.argv.slice(2).find((a) => !a.startsWith('-'))
const input = arg ? resolve(ROOT, arg) : DEFAULT_INPUT

if (!existsSync(input)) {
  console.error(`\n❌ 找不到配置文件：${rel(input)}\n`)
  console.error('请先在控制台「数据」标签点「导出为文件」，')
  console.error(`把下载得到的 site-config.json 放到项目根目录，再运行一次。\n`)
  process.exit(1)
}

let parsed
try {
  parsed = JSON.parse(readFileSync(input, 'utf8'))
} catch (e) {
  console.error(`\n❌ ${rel(input)} 不是合法的 JSON\n`)
  console.error(`   ${e instanceof Error ? e.message : String(e)}\n`)
  process.exit(1)
}

if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
  console.error('\n❌ 配置内容的顶层必须是一个对象 { ... }\n')
  process.exit(1)
}

/* ─────────────── 校验 ─────────────── */

const unknown = Object.keys(parsed).filter((k) => !KNOWN_KEYS.includes(k))
if (unknown.length) {
  console.warn(`\n⚠️  这些字段不认识，会被忽略：${unknown.join(', ')}`)
}

/** 空对象当成「没有任何覆盖」，避免把默认值也钉死 */
const isEmpty = Object.keys(parsed).length === 0
if (isEmpty) {
  write({}, '文件是空的')
  process.exit(0)
}

/* ─────────────── 写入 ─────────────── */

write(parsed, `共 ${Object.keys(parsed).length} 个字段`)

console.log('提示：源文件 site-config.json 可以删掉了，它只是个中转文件。\n')

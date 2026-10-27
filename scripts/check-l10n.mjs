#!/usr/bin/env node
/**
 * 本地化体检：
 *   1. 用与页面相同的 localize() 生成 ar / en 两份最终配置；
 *   2. 扫描是否还有中文字符（会直接显示给访客）；
 *   3. 顺带打印人名，方便一眼确认是否为本地的名字。
 *
 * 做法：用 esbuild（vite 自带）把 TS 打成 mjs 再 import 执行，
 * 检查的是真实运行结果，不是肉眼比对源文件。
 */
import { build } from 'esbuild'
import { rmSync } from 'node:fs'
import { join } from 'node:path'

const CJK = /[\u4e00-\u9fff]/

const entry = `
import { localize } from './src/i18n/index.ts'
import { BASE_CONFIG } from './src/config/store.tsx'
export { localize, BASE_CONFIG }
`

/**
 * 输出放项目目录，不放系统临时目录 ——
 * 临时目录里的文件解析不到 node_modules，import 会直接报错。
 */
const outfile = join(process.cwd(), '.l10n-check.mjs')

await build({
  stdin: { contents: entry, resolveDir: process.cwd(), loader: 'tsx' },
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile,
  jsx: 'automatic',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  logLevel: 'silent',
  define: { 'import.meta.env.DEV': 'false' },
})

const { localize, BASE_CONFIG } = await import(`${outfile}?t=${Date.now()}`)

/** 递归收集所有带中文的字段路径 */
function scan(value, path = '', out = []) {
  if (typeof value === 'string') {
    if (CJK.test(value)) out.push([path, value])
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => scan(v, `${path}[${i}]`, out))
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) scan(v, path ? `${path}.${k}` : k, out)
  }
  return out
}

let bad = 0

for (const locale of ['ar', 'en']) {
  const cfg = localize(BASE_CONFIG, locale)
  const hits = scan(cfg)

  const videos = cfg.videos ?? []
  const people = cfg.people ?? []
  const chat = cfg.chat ?? []

  console.log(`\n── ${locale.toUpperCase()} ──`)
  console.log(`  视频 ${videos.length} 条 · 人物 ${people.length} 位 · 聊天 ${chat.length} 段`)

  if (hits.length) {
    bad += hits.length
    console.log(`  ⚠️ 仍有 ${hits.length} 处中文会显示给访客：`)
    hits.slice(0, 30).forEach(([p, v]) => console.log(`      ${p} → ${v.slice(0, 44)}`))
  } else {
    console.log('  ✅ 没有中文残留')
  }

  const names = [
    ...people.map((p) => p.name),
    ...videos.map((v) => v.name),
    ...chat.map((c) => c.name),
  ]
  console.log(`  名字：${names.join(' · ')}`)
}

rmSync(outfile, { force: true })

if (bad) {
  console.log(`\n❌ 还有 ${bad} 处中文字符串会显示给访客`)
  process.exit(1)
}
console.log('\n✅ 阿拉伯语与英语成品里都没有中文')

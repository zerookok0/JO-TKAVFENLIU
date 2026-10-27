#!/usr/bin/env node
/**
 * 一次性清理：把 index.html 里的中文注释换成英文 / 中性注释。
 *
 * 为什么注释也要动：
 *   HTML 注释会被原样打进 dist/index.html —— 访客查看源代码就能看到。
 *   文案全是阿拉伯语，底下却躺着一行中文注释，很出戏。
 *   所以这个文件的注释一律走英文。
 *
 * 用法：node scripts/clean-html-comments.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = 'index.html'
const CJK = /[\u4e00-\u9fff]/

let html = readFileSync(FILE, 'utf8')

/** 逐条替换：规则彼此不重叠，顺序无所谓 */
const rules = [
  [/<!--\s*社交分享卡片\s*-->/g, '<!-- Open Graph / social sharing -->'],
  [/<!--\s*分享卡片\s*-->/g, '<!-- Open Graph / social sharing -->'],
  [
    /<!--[\s\S]*?只加载阿拉伯语字体[\s\S]*?-->/g,
    `<!--
      Arabic only. Noto Sans Arabic carries the right glyphs and line height
      for the diacritics Arabic letters sit above and below.

      Loaded with preload + onload so it never blocks first paint:
      the page draws with system fonts first, then swaps.
    -->`,
  ],
]

let changed = 0
for (const [pattern, replacement] of rules) {
  const before = html
  html = html.replace(pattern, replacement)
  if (html !== before) changed += 1
}

writeFileSync(FILE, html, 'utf8')

/** 收尾断言：不该再有中文注释残留 */
const leftovers = html.split('\n').filter((line) => line.includes('<!--') && CJK.test(line))

if (leftovers.length) {
  console.log('⚠️  还有中文注释没换掉：')
  leftovers.forEach((l) => console.log('   ' + l.trim()))
  process.exit(1)
}

console.log(`✓ 已处理 ${changed} 处注释，index.html 里不再有中文`)

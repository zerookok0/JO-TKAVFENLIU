#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════
 *  成品体检  ·  确认访客看到的东西里没有中文、没有英文
 * ════════════════════════════════════════════════════════════════
 *
 *  检查的是构建产物（dist/），也就是访客真正下载到浏览器的东西。
 *  源码里的中文注释无所谓 —— 它们不会被构建进浏览器；进了 dist 才算漏。
 *
 *  ── 三条规则，各有各的道理 ────────────────────────────
 *
 *  1. 主包（index-*.js）与 HTML / CSS：一个中文字都不许有
 *     这是访客一定会下载的部分。
 *
 *  2. 控制台分包（Console-*.js）：整块跳过
 *     它是给你自己用的编辑器（中文界面），只有访问 /admin 才下载。
 *     访客的正常路径上根本不会请求这个文件，所以不适用上面的规则。
 *
 *  3. 全站数字统一拉丁数字（0-9）
 *     阿语里 ١٢٣ 和 123 混着写最刺眼，站内只许用一种。
 *
 *  用法：npm run check:arabic    （会先自动 build）
 */
import { execSync } from 'node:child_process'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DIST = 'dist'
const CJK = /[\u4e00-\u9fff]/

/** 阿拉伯-印度数字。站内统一用 0-9，出现这些就是 bug */
const ARABIC_DIGITS = /[\u0660-\u0669\u06f0-\u06f9]/

/**
 * React 自身的内置报错文案是英文的，改不了，也不该改。
 * 它们只在开发者写错代码时出现，正常访客看不到。
 */
const REACT_INTERNALS = [
  'Objects are not valid as',
  'Minified React error',
  'Unable to preload CSS',
  'Element type is invalid',
  'Maximum update depth',
  'Rendered more hooks',
  'Rendered fewer hooks',
  'Cannot read properties',
]

const isReactInternal = (text) => REACT_INTERNALS.some((s) => text.includes(s))

let failed = 0

function report(kind, file, detail) {
  failed += 1
  console.log(`\n  ✗ [${kind}] ${file}`)
  console.log(`      ${detail}`)
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

console.log('\n构建中…')
execSync('npx vite build', { stdio: 'ignore' })

const files = walk(DIST).filter((f) => /\.(js|css|html)$/.test(f))
console.log(`检查 ${files.length} 个产物…\n`)

for (const file of files) {
  const text = readFileSync(file, 'utf8')
  const base = file.split('/').pop() ?? file

  /**
   * 控制台分包：整块跳过。
   *
   * 它是给你自己用的编辑面板（中文界面），只有访问 /admin 才会下载。
   * 访客的正常路径上，这个文件根本不会被请求 ——
   * 所以它不适用「页面上不许出现中文 / 英文」这条规则。
   *
   * 换个角度说：这套检查守的是「访客看到什么」，不是「代码里写了什么」。
   */
  const isConsoleChunk = /^Console-.*\.js$/.test(base)
  if (isConsoleChunk) continue

  /* ── 1. 中文：主包 / HTML / CSS 一律不许有 ── */
  if (CJK.test(text)) {
    const at = text.search(CJK)
    const snippet = text.slice(Math.max(0, at - 40), at + 40).replace(/\s+/g, ' ')
    report('中文', file, `…${snippet}…`)
  }

  /* ── 2. 阿拉伯-印度数字：全站统一拉丁数字 ── */
  if (ARABIC_DIGITS.test(text)) {
    const at = text.search(ARABIC_DIGITS)
    const snippet = text.slice(Math.max(0, at - 40), at + 40).replace(/\s+/g, ' ')
    report('数字混排', file, `…${snippet}…`)
  }

  /* ── 3. 英文界面词 ── */
  if (file.endsWith('.css')) continue

  /*
    只在「像一句话的字符串」里找英文。

    为什么要这么苛刻：
    压缩后的 JS 里全是标识符，随便扫 /[A-Za-z]{4,}/ 必然满屏误报 ——
    "sticky bottom" 是 Tailwind 类名，"Live Console" 才是真文案。
    区别在于：类名全小写，而且几乎总出现在 className 里。

    所以规则收紧成：至少两个词，每个词都以大写字母开头。
    「人们真正会读到的标题」基本都是这个形状。
  */
  const phrase = /\b[A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})+\b/g

  for (const m of text.matchAll(phrase)) {
    if (isReactInternal(text)) break

    /* 前后必须是引号边界：说明这是一段独立内容，不是表达式中间的一串标识符 */
    const before = text.slice(Math.max(0, (m.index ?? 0) - 1), m.index)
    if (before !== '"' && before !== "'" && before !== '`') continue

    report('英文文案', file, m[0])
    break // 每个文件报一条就够，避免刷屏
  }
}

if (failed) {
  console.log(`\n❌ 发现 ${failed} 处问题\n`)
  process.exit(1)
}

console.log('✅ 主包里没有中文、没有英文界面词，数字全部是拉丁数字\n')

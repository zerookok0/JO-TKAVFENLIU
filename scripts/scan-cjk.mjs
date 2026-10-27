import { readdirSync, statSync, readFileSync } from 'node:fs'
import { join, extname } from 'node:path'

const TARGETS = process.argv.slice(2).length ? process.argv.slice(2) : ['src']
const CJK = /[\u4e00-\u9fff]/

/** 去掉注释后再判断，避免把说明文字当文案 */
function stripComments(line) {
  return line
    .replace(/\/\*.*?\*\//g, '')
    .replace(/^\s*\/\/.*$/, '')
    .replace(/^\s*\*.*$/, '')
    .replace(/\{\/\*.*?\*\/\}/g, '')
    .replace(/\/\/.*$/, '')
}

const hits = []

function scanFile(full) {
  const lines = readFileSync(full, 'utf8').split('\n')
  lines.forEach((line, i) => {
    const code = stripComments(line)
    // 只看 JSX 文本 / 字符串字面量里的中文
    const inJsxText = />[^<>{}]*[\u4e00-\u9fff]/.test(code)
    const inString = /['"`][^'"`]*[\u4e00-\u9fff]/.test(code)
    if (CJK.test(code) && (inJsxText || inString)) {
      hits.push(`${full}:${i + 1}: ${line.trim().slice(0, 130)}`)
    }
  })
}

function walk(dir) {
  if (extname(dir)) {
    scanFile(dir)
    return
  }
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) {
      if (name === 'node_modules' || name.startsWith('.')) continue
      walk(full)
      continue
    }
    if (!['.ts', '.tsx'].includes(extname(name))) continue
    scanFile(full)
  }
}

TARGETS.forEach(walk)

if (!hits.length) console.log(`✅ ${TARGETS.join(', ')} 干净：没有硬编码中文`)
else {
  console.log(`⚠️  发现 ${hits.length} 处可能的硬编码中文：`)
  hits.forEach((h) => console.log('  ' + h))
}

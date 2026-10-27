import { readdirSync, statSync, readFileSync } from 'node:fs'
import { join, extname } from 'node:path'

/**
 * 检查组件里是否还有「物理方向」类名。
 *
 * RTL（阿拉伯语）靠 dir="rtl" 整体镜像，前提是布局用逻辑属性：
 *   left/right  → start/end
 *   ml-/mr-     → ms-/me-
 *   pl-/pr-     → ps-/pe-
 *   text-left   → text-start
 *
 * 注意排除内部固定 LTR 的场景，比如手机机身里的「复古」定位
 * （那里是产品截图，方向不该跟着语言翻）。
 */

const PATTERNS = [
  { re: /(?:^|[\s"'`])(?:-)?(?:left|right)-[0-9\[]/g, hint: 'left-/right- → start-/end-' },
  { re: /(?:^|[\s"'`])(?:ml|mr)-(?:\d|\[|auto)/g, hint: 'ml-/mr- → ms-/me-' },
  { re: /(?:^|[\s"'`])(?:pl|pr)-(?:\d|\[)/g, hint: 'pl-/pr- → ps-/pe-' },
  { re: /\btext-(?:left|right)\b/g, hint: 'text-left/right → text-start/end' },
]

const hits = []

function scanFile(full) {
  const raw = readFileSync(full, 'utf8')
  const lines = raw.split('\n')
  lines.forEach((line, i) => {
    const code = line.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '')
    if (!code.includes('className') && !code.includes('style')) return
    for (const { re, hint } of PATTERNS) {
      re.lastIndex = 0
      if (re.test(code)) {
        hits.push(`${full}:${i + 1}  (${hint})\n      ${line.trim().slice(0, 120)}`)
      }
    }
  })
}

function walk(dir) {
  if (extname(dir)) return scanFile(dir)
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      if (name === 'console' || name.startsWith('.')) continue
      walk(full)
      continue
    }
    if (['.tsx'].includes(extname(name))) scanFile(full)
  }
}

walk('src/components')

if (!hits.length) console.log('✅ 没有发现物理方向类名，RTL 镜像安全')
else {
  console.log(`⚠️  发现 ${hits.length} 处物理方向类名：\n`)
  hits.forEach((h) => console.log('  ' + h + '\n'))
}

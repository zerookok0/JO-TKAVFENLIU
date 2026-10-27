const fs = require('fs')
const path = require('path')

const css = fs.readFileSync('/tmp/out.css', 'utf8')

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (/\.(tsx|ts)$/.test(e.name)) out.push(p)
  }
  return out
}

const files = walk('src')

const tokens = new Set()
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8')
  const re = /className=(?:"([^"]*)"|\{`([^`]*)`\})/g
  let m
  while ((m = re.exec(text))) {
    const raw = (m[1] || m[2] || '')
      .replace(/\$\{[^}]*\}/g, ' ')
      .replace(/\s+/g, ' ')
    for (const t of raw.split(' ')) {
      const c = t.trim()
      if (!c || /[{}<>]/.test(c)) continue
      tokens.add(c)
    }
  }
}

/** Tailwind 的默认 opacity 刻度 —— 不在这份名单里的 /数字 都不会生成 */
const OPACITY = new Set([
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
])

const problems = []

for (const t of tokens) {
  // 跳过编组前缀（hover: sm: lg: group-hover: 等），只看基础类
  const base = t.includes(':') ? t.slice(t.lastIndexOf(':') + 1) : t

  // 1) /数字 透明度是否合法（/[...] 是任意值，永远合法）
  const slash = base.match(/\/(\d+)$/)
  if (slash && !base.endsWith(']')) {
    const n = Number(slash[1])
    if (!OPACITY.has(n)) problems.push(`非法透明度 ${n}%: ${t}`)
  }

  // 2) 自定义色是否存在（brand/brand2/accent/mint/surface/raised/line/ink/muted）
  //    通过检查基础类是否出现在生成的 CSS 里判断
  if (/^(bg|text|border|ring|from|via|to|divide)-/.test(base)) {
    const exists = [...css.matchAll(/\.([a-z0-9-]+)/g)].some((x) => x[1] === base)
    if (!exists && !base.includes('[')) problems.push(`未生成的类: ${t}`)
  }
}

const uniq = [...new Set(problems)]
console.log('tokens:', tokens.size)
console.log('problems:', uniq.length)
console.log(uniq.join('\n'))

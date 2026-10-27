const fs = require('fs')
const path = require('path')

const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)],
  )

const files = walk('src').filter((f) => /\.(tsx?|css)$/.test(f))
const patterns = [
  ['pexels 链接', /images\.pexels|videos\.pexels/],
  ['硬编码色值', /#[0-9a-fA-F]{3,8}\b/],
  ['tailwind 任意色', /(bg|text|from|via|to|border|ring)-\[#/],
]

for (const [label, re] of patterns) {
  const hits = {}
  for (const f of files) {
    if (f.includes('console/')) continue
    if (f.includes('config/')) continue
    fs.readFileSync(f, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        if (re.test(line)) {
          hits[f] = hits[f] || []
          hits[f].push(`${i + 1}: ${line.trim().slice(0, 92)}`)
        }
      })
  }
  const total = Object.values(hits).reduce((a, b) => a + b.length, 0)
  console.log(`\n### ${label} — ${total} 处`)
  for (const k of Object.keys(hits)) {
    console.log(`  ${k}  (${hits[k].length})`)
    hits[k].slice(0, 8).forEach((l) => console.log(`     ${l}`))
  }
}

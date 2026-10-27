const fs = require('fs')
const path = require('path')

function walk(d, o = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p, o)
    else if(/\.(tsx|ts)$/.test(e.name)) o.push(p)
  }
  return o
}

const BAD = ['/12"', '/12 ', '/48"', '/48 ', '/92"', '/92 ', ']/96', '/12`', '/12:']

for (const f of walk('src')) {
  fs.readFileSync(f, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      const hit = BAD.some((b) => line.includes(b))
      if (hit) console.log(f + ':' + (i + 1) + ': ' + line.trim())
    })
}

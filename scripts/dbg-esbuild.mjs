import { readFileSync } from 'node:fs'
import { transform } from 'esbuild'

const file = '.nuxt/dist/server/_nuxt/nuxt-BhR2fi5o.js'
const code = readFileSync(file, 'utf8')

// 模拟 nitro 的错误报告：定位含 undefined 的行
const lines = code.split('\n')
lines.forEach((ln, i) => {
  if (ln.includes('undefined')) {
    console.log(`line ${i + 1} (within file):`)
    console.log(ln)
    console.log('---')
  }
})

for (const fmt of ['esm', 'cjs']) {
  try {
    await transform(code, { format: fmt, minify: false, logLevel: 'silent' })
    console.log(`transform ok (format=${fmt})`)
  } catch (e) {
    console.log(`transform FAIL (format=${fmt}): ${e.message}`)
  }
}
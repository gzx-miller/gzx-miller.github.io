const n=`// ═══════════════════════════════════════════
// D27 - zlib 压缩与解压
// ═══════════════════════════════════════════

import zlib from 'node:zlib'
import fs from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

const pipelinePromise = promisify(pipeline)

// ───────── 压缩算法 ─────────

// Node.js zlib 支持的算法：
// - gzip      最常用，单个文件压缩
// - deflate   zlib 格式，更轻量
// - deflateRaw 无封装的 deflate
// - brotli    Google 开发，压缩率更高（Node 10+）

// 选择建议：
// - 通用：gzip（兼容性好）
// - Web 静态资源：brotli（压缩率更高，浏览器支持）
// - 内部系统：deflate（稍微轻量一点）

// ───────── 同步压缩/解压 ─────────

// 压缩字符串
const text = 'Hello, World! '.repeat(100)
console.log('原始大小:', text.length, '字节')

// Gzip 压缩
const gzipped = zlib.gzipSync(text)
console.log('Gzip 压缩后:', gzipped.length, '字节')
console.log('压缩率:', ((1 - gzipped.length / text.length) * 100).toFixed(1) + '%')

// Gzip 解压
const gunzipped = zlib.gunzipSync(gzipped).toString()
console.log('解压后长度:', gunzipped.length)

// Deflate
const deflated = zlib.deflateSync(text)
console.log('Deflate 压缩后:', deflated.length, '字节')

const inflated = zlib.inflateSync(deflated).toString()

// Brotli
const brotlied = zlib.brotliCompressSync(text)
console.log('Brotli 压缩后:', brotlied.length, '字节')
console.log('Brotli 压缩率:', ((1 - brotlied.length / text.length) * 100).toFixed(1) + '%')

const unbrotlied = zlib.brotliDecompressSync(brotlied).toString()

// ───────── 压缩级别 ─────────

// 压缩级别 1-9 (zlib, gzip)
// 1 = 最快，压缩率最低
// 9 = 最慢，压缩率最高
// 默认 6

const fastGzip = zlib.gzipSync(text, { level: 1 })
const bestGzip = zlib.gzipSync(text, { level: 9 })

console.log('级别 1:', fastGzip.length, '字节')
console.log('级别 9:', bestGzip.length, '字节')

// Brotli 级别 1-11
// 默认 6
const fastBrotli = zlib.brotliCompressSync(text, {
  params: {
    [zlib.constants.BROTLI_PARAM_QUALITY]: 1
  }
})
const bestBrotli = zlib.brotliCompressSync(text, {
  params: {
    [zlib.constants.BROTLI_PARAM_QUALITY]: 11
  }
})

console.log('Brotli 级别 1:', fastBrotli.length, '字节')
console.log('Brotli 级别 11:', bestBrotli.length, '字节')

// ───────── 异步版本 ─────────

// zlib.gzip(data, options, callback)
// 或 Promise 化

import { gzip, gunzip } from 'node:zlib'

const gzipPromise = promisify(gzip)
const gunzipPromise = promisify(gunzip)

async function compressAsync(data) {
  const compressed = await gzipPromise(data, { level: 6 })
  return compressed
}

// 使用：
// const compressed = await compressAsync('Hello')

// Node 15+ 也可以用 zlib/promises
// import { gzip } from 'node:zlib/promises'

// ───────── 流式压缩（大文件） ─────────

// 压缩文件
async function compressFile(inputPath, outputPath) {
  await pipelinePromise(
    fs.createReadStream(inputPath),
    zlib.createGzip({ level: 9 }),
    fs.createWriteStream(outputPath)
  )
  console.log('压缩完成:', outputPath)
}

// 解压文件
async function decompressFile(inputPath, outputPath) {
  await pipelinePromise(
    fs.createReadStream(inputPath),
    zlib.createGunzip(),
    fs.createWriteStream(outputPath)
  )
  console.log('解压完成:', outputPath)
}

// 使用：
// compressFile('input.txt', 'input.txt.gz')
// decompressFile('input.txt.gz', 'input.txt')

// ───────── HTTP 压缩 ─────────

// HTTP 服务端 gzip 压缩示例
import http from 'node:http'

const htmlContent = '<html><body>' + '<p>Hello World!</p>'.repeat(1000) + '</body></html>'

const httpServer = http.createServer((req, res) => {
  const acceptEncoding = req.headers['accept-encoding'] || ''

  // 检查客户端是否支持 gzip
  if (acceptEncoding.includes('gzip')) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Encoding': 'gzip'
    })

    // 流式压缩
    const gzip = zlib.createGzip()
    // 直接把字符串写入 gzip 流
    gzip.pipe(res)
    gzip.write(htmlContent)
    gzip.end()
  } else if (acceptEncoding.includes('br')) {
    // Brotli 压缩
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Encoding': 'br'
    })

    const brotli = zlib.createBrotliCompress()
    brotli.pipe(res)
    brotli.write(htmlContent)
    brotli.end()
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(htmlContent)
  }
})

// httpServer.listen(3000)

// 浏览器请求头会带 Accept-Encoding: gzip, deflate, br
// 服务器选择支持的算法，设置 Content-Encoding

// 注意：
// - 小文件（< 1KB）压缩后可能更大
// - 图片、视频等已经压缩的不要再压缩
// - 静态资源可以预压缩，避免运行时压缩

// ───────── 压缩流选项 ─────────

// createGzip / createDeflate / createBrotliCompress 的选项

// level:        压缩级别 (1-9, brotli 1-11)
// memLevel:     内存使用级别 (1-9, 默认 8)
// strategy:     压缩策略
// chunkSize:    块大小
// windowBits:   窗口大小

// 常见策略：
// zlib.constants.Z_DEFAULT_STRATEGY   默认
// zlib.constants.Z_FILTERED           过滤数据（PNG等）
// zlib.constants.Z_HUFFMAN_ONLY       只用霍夫曼编码
// zlib.constants.Z_RLE                行程编码
// zlib.constants.Z_FIXED              固定表

// ───────── 性能考虑 ─────────

// 1. 压缩是 CPU 密集操作
//    高压缩级别 = 高 CPU 使用率
//    根据场景选择级别，不要盲目用最高

// 2. 流式 vs 同步
//    同步：简单，但阻塞事件循环，仅适合小数据
//    流式：大文件必须用流式

// 3. 压缩率 vs 速度权衡
//    静态资源：可以用最高压缩级别（只压缩一次）
//    动态响应：用中等或低级别（每次都要压缩）
//    传输慢但 CPU 强：高压缩级别
//    传输快但 CPU 弱：低压缩级别

// 4. 什么时候不需要压缩
//    - 已经压缩过的文件（jpg, png, mp4, zip 等）
//    - 非常小的文件（< 1KB，压缩后可能更大）
//    - CPU 已经是瓶颈

// ───────── 常见压缩格式对比 ─────────

// 格式     | 压缩率 | 速度 | 兼容性 | 适用场景
// -------- | ------ | ---- | ------ | --------
// gzip     | 中等   | 快   | 最好   | 通用、HTTP
// deflate  | 中等   | 快   | 好     | 内部系统
// brotli   | 高     | 中   | 好(新) | Web 静态资源
// zip      | 中等   | 中   | 最好   | 多文件打包
// 7z       | 很高   | 慢   | 一般   | 归档存储

// ───────── 最佳实践 ─────────
// 小数据用同步 API，大数据用流式
// 选择合适的压缩级别，不要盲目最高
// HTTP 压缩检查 Accept-Encoding
// 静态资源预压缩，不要运行时压
// 图片视频等已压缩的不要再压
// 大文件压缩用 pipeline 处理错误和背压
// 解压注意 zip bomb（恶意压缩包，解压后巨大）
// 用 brotli 替代 gzip 可以提升 20-30% 压缩率
// 总是处理压缩/解压错误
`;export{n as default};

/**
 * 拆分 lessions.ts 为按分类的独立文件
 * 用法: node scripts/split-lessons.js
 */
const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const lessonsPath = path.join(projectRoot, 'src/data/lessons.ts')

console.log('读取 lessions.ts ...')
const source = fs.readFileSync(lessonsPath, 'utf8')

// 找到 lessons 数组的范围
const startMarker = 'export const lessons: Lesson[] = ['
const endMarker = '\n] as const'

const startIndex = source.indexOf(startMarker)
if (startIndex === -1) {
  console.error('无法找到 lessons 数组开始位置')
  process.exit(1)
}

// 找到 lessons 数组的结束位置（匹配的 ] as const）
// 需要计算大括号平衡
let braceCount = 0
let inArray = false
let endIndex = -1

for (let i = startIndex + startMarker.length; i < source.length; i++) {
  const ch = source[i]
  if (ch === '{') braceCount++
  if (ch === '}') braceCount--
  if (ch === '[' && !inArray) { inArray = true; braceCount++ }
  if (ch === ']' && inArray) {
    braceCount--
    // 检查后面是否跟着 " as const"
    const remaining = source.substring(i + 1, i + 20)
    if (remaining.trimStart().startsWith('as const')) {
      endIndex = i
      break
    }
  }
}

if (endIndex === -1) {
  console.error('无法找到 lessons 数组结束位置')
  process.exit(1)
}

console.log(`lessons 数组范围: ${startIndex} - ${endIndex}`)

const lessonsContent = source.substring(startIndex + startMarker.length, endIndex)

// 按分类拆分课程
const categories = {}

// 用正则匹配每门课程（从 { 开始到对应的 },）
// 简化方法：按 id 和 path 来识别课程边界
const lessonBlocks = []
let currentBlock = ''
let blockBraceCount = 0
let inString = false
let stringChar = ''
let escaped = false

for (let i = 0; i < lessonsContent.length; i++) {
  const ch = lessonsContent[i]
  const prev = i > 0 ? lessonsContent[i - 1] : ''

  // 处理字符串（避免字符串中的大括号干扰）
  if (!escaped && (ch === '"' || ch === "'" || ch === '`')) {
    if (!inString) {
      inString = true
      stringChar = ch
    } else if (ch === stringChar) {
      inString = false
    }
  }

  if (ch === '\\' && !escaped) {
    escaped = true
  } else {
    escaped = false
  }

  currentBlock += ch

  if (!inString) {
    if (ch === '{') blockBraceCount++
    if (ch === '}') {
      blockBraceCount--
      if (blockBraceCount === 0 && currentBlock.trim()) {
        // 一门课程结束
        lessonBlocks.push(currentBlock.trim())
        currentBlock = ''
      }
    }
  }
}

console.log(`共找到 ${lessonBlocks.length} 门课程`)

// 解析每门课程的 path，按分类分组
for (const block of lessonBlocks) {
  const pathMatch = block.match(/path:\s*'([^']+)'/)
  if (pathMatch) {
    const catId = pathMatch[1].split('/')[1]
    if (!categories[catId]) categories[catId] = []
    categories[catId].push(block)
  }
}

console.log('\n分类统计:')
for (const [catId, lessons] of Object.entries(categories)) {
  console.log(`  ${catId}: ${lessons.length} 门`)
}

// 确保输出目录存在
const demosDir = path.join(projectRoot, 'src/data/lesson-demos')
const dataDir = path.join(projectRoot, 'src/data/lessons-by-cat')
if (!fs.existsSync(demosDir)) fs.mkdirSync(demosDir, { recursive: true })
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

// 为每个分类生成课程数据文件
for (const [catId, lessons] of Object.entries(categories)) {
  console.log(`\n处理分类: ${catId} (${lessons.length} 门课)`)

  const content = `// ${catId} 课程分类数据
import type { Lesson } from '../lesson-types'
// TODO: 导入 demo 组件（需要手动补充）

export const lessons: Lesson[] = [
${lessons.join(',\n')}
] as const

export const lessonIdMap = new Map(lessons.map((l: Lesson) => [l.id, l]))
export const lessonPathMap = new Map(lessons.map((l: Lesson) => [l.path, l]))
`

  const dataPath = path.join(dataDir, `${catId}.ts`)
  fs.writeFileSync(dataPath, content, 'utf8')
  console.log(`  已写入: ${dataPath}`)
}

console.log('\n完成！请手动补充 demo 导入语句。')

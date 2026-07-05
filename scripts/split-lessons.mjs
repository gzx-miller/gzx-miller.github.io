/**
 * Split lessons.ts into per-category files
 * Usage: node scripts/split-lessons.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = resolve(__dirname, '..')

const lessonsPath = join(projectRoot, 'src/data/lessons.ts')
console.log('Reading lessons.ts ...')
const source = readFileSync(lessonsPath, 'utf8')

// Find lessons array range
const startIdx = source.indexOf('export const lessons: Lesson[] = [')
if (startIdx === -1) {
  console.error('Cannot find lessons array')
  process.exit(1)
}

// Find the end of lessons array (matching ] as const)
let bracketCount = 0
let inArray = false
let endIdx = -1

for (let i = startIdx; i < source.length; i++) {
  const ch = source[i]
  if (ch === '[' && !inArray) { inArray = true; bracketCount++ }
  else if (ch === '[' && inArray) { bracketCount++ }
  else if (ch === ']') {
    bracketCount--
    if (bracketCount === 0) {
      // Check if followed by " as const"
      const rest = source.substring(i + 1, i + 30)
      if (rest.trimStart().startsWith('as const')) {
        endIdx = i
        break
      }
    }
  }
  // Track braces inside array for accuracy
  if (inArray) {
    if (ch === '{') bracketCount = bracketCount // already counting []
    if (ch === '}') bracketCount = bracketCount
  }
}

// Simpler approach: extract by parsing objects
console.log('Parsing lessons ...')

const categories = new Map() // catId -> lesson strings array

// Split by objects: find each { ... } that is a lesson
let current = ''
let depth = 0
let inString = false
let strChar = ''
let escaped = false

const lessonsSection = source.substring(
  source.indexOf('[', startIdx) + 1,
  source.indexOf('] as const', startIdx)
)

for (let i = 0; i < lessonsSection.length; i++) {
  const ch = lessonsSection[i]
  const prev = i > 0 ? lessonsSection[i - 1] : ''

  // Handle strings
  if (!escaped && (ch === '"' || ch === "'" || ch === '`')) {
    if (!inString) { inString = true; strChar = ch }
    else if (ch === strChar) { inString = false }
  }
  if (ch === '\\' && !escaped) { escaped = true } else { escaped = false }

  current += ch

  if (!inString) {
    if (ch === '{') depth++
    if (ch === '}') {
      depth--
      if (depth === 0 && current.trim()) {
        const lessonStr = current.trim()
        // Get category from path
        const pathM = lessonStr.match(/path:\s*'([^']+)'/)
        if (pathM) {
          const catId = pathM[1].split('/')[1]
          if (!categories.has(catId)) categories.set(catId, [])
          categories.get(catId).push(lessonStr)
        }
        current = ''
      }
    }
  }
}

console.log(`\nFound ${Array.from(categories.values()).reduce((a, b) => a + b.length, 0)} lessons in ${categories.size} categories:`)
for (const [cat, lessons] of categories) {
  console.log(`  ${cat}: ${lessons.length}`)
}

// Ensure output dir
const dataDir = join(projectRoot, 'src/data/lessons-by-cat')
mkdirSync(dataDir, { recursive: true })

// Generate per-category files
for (const [catId, lessons] of categories) {
  // Build demo import names
  const demoNames = new Set()
  for (const ls of lessons) {
    const dm = ls.match(/demo:\s*(\w+)/)
    if (dm) demoNames.add(dm[1])
    // code is a function, not a direct import - skip
  }

  let content = `// ${catId} lessons\n`
  content += `import type { Lesson } from '../lesson-types'\n`
  if (demoNames.size > 0) {
    content += `import {\n`
    for (const n of demoNames) {
      content += `  ${n},\n`
    }
    content += `} from '../lesson-demos/${catId}'\n`
  }
  content += `\nexport const lessons: Lesson[] = [\n${lessons.join(',\n')}\n] as const\n\n`
  content += `export const lessonIdMap = new Map(lessons.map((l: Lesson) => [l.id, l]))\n`
  content += `export const lessonPathMap = new Map(lessons.map((l: Lesson) => [l.path, l]))\n`

  const outPath = join(dataDir, `${catId}.ts`)
  writeFileSync(outPath, content, 'utf8')
  console.log(`Written: ${outPath}`)
}

console.log('\nDone! Now update lessons.ts to use dynamic imports.')

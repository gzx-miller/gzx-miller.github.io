/**
 * 批量修复分类文件中的 Lesson 接口重复定义问题
 * 1. 添加 import type { Lesson } from '../lessons'
 * 2. 删除重复的 export interface Lesson { ... }
 */

import fs from 'fs'
import path from 'path'

const lessonsDir = 'src/data/lessons'
const files = fs.readdirSync(lessonsDir).filter(f => f.endsWith('.ts') && f !== 'index.ts')

console.log(`Found ${files.length} category files to fix...\n`)

for (const file of files) {
  const filePath = path.join(lessonsDir, file)
  let content = fs.readFileSync(filePath, 'utf-8')
  let modified = false

  // 1. 添加 import type { Lesson } from '../lessons'
  if (!content.includes("import type { Lesson } from '../lessons'")) {
    // 在文件开头的 import 语句之后添加
    const lines = content.split('\n')
    let insertIndex = -1
    
    // 找到最后一个 import 语句的位置
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        insertIndex = i
      }
    }
    
    if (insertIndex >= 0) {
      lines.splice(insertIndex + 1, 0, "import type { Lesson } from '../lessons'")
      content = lines.join('\n')
      modified = true
      console.log(`✓ Added Lesson import to ${file}`)
    }
  }

  // 2. 删除重复的 export interface Lesson { ... }
  // 找到接口定义的开始和结束位置
  const interfaceStart = content.indexOf('export interface Lesson {')
  if (interfaceStart !== -1) {
    // 找到接口定义的结束位置（下一个 export 或文件结束）
    const afterInterface = content.indexOf('\nexport const lessons:', interfaceStart)
    if (afterInterface !== -1) {
      // 删除从接口定义开始到 export const lessons: 之前的所有内容
      content = content.substring(0, interfaceStart) + content.substring(afterInterface)
      modified = true
      console.log(`✓ Removed duplicate Lesson interface from ${file}`)
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8')
  }
}

console.log('\n✅ All category files fixed!')

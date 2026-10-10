import { describe, expect, it } from 'vitest'
import { isCommentOnlySource } from './code-quality'

describe('isCommentOnlySource', () => {
  it('未加载或空内容时判为「还不能判定」', () => {
    expect(isCommentOnlySource(null)).toBe(false)
    expect(isCommentOnlySource(undefined)).toBe(false)
    expect(isCommentOnlySource('')).toBe(false)
    expect(isCommentOnlySource('   \n\n  ')).toBe(false)
  })

  it('整段只有注释时判为 true', () => {
    expect(isCommentOnlySource('// 第一章：要点\n// 第二章：要点\n', 'javascript')).toBe(true)
    expect(isCommentOnlySource('# 预训练 -> SFT -> RLHF\n# 缺一不可\n', 'python')).toBe(true)
    expect(isCommentOnlySource('/* 只有块注释\n   继续注释 */', 'css')).toBe(true)
    expect(isCommentOnlySource('<!-- 只有模板注释 -->', 'vue')).toBe(true)
  })

  it('被整段注释掉的示例也算纯注释', () => {
    const commentedExample = `// const express = require('express')
// const app = express()
// app.listen(3000)`
    expect(isCommentOnlySource(commentedExample, 'javascript')).toBe(true)
  })

  it('只要还剩一行真实代码就不算纯注释', () => {
    expect(isCommentOnlySource('// 说明\nconst total = 1', 'javascript')).toBe(false)
    expect(isCommentOnlySource('# 说明\nprint(1)', 'python')).toBe(false)
    expect(isCommentOnlySource('<template><p>hi</p></template>', 'vue')).toBe(false)
    expect(isCommentOnlySource('#include <iostream>\nint main() {}', 'cpp')).toBe(false)
  })

  it('未声明语言时按 // 处理', () => {
    expect(isCommentOnlySource('// 仅注释')).toBe(true)
    expect(isCommentOnlySource('const a = 1')).toBe(false)
  })
})

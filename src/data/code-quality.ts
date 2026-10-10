// 「关键代码」段落的质量判定。
//
// 少数章节的「关键代码」并不是代码：要么把整段要点写成注释，要么把示例整段注释掉，
// 渲染出来只剩一片灰绿的注释文字，读者拿不到任何代码信息。这种段落应当整段隐藏，
// 而不是留一个空壳标题占位。
//
// 判定刻意保守：只有在「去掉注释与空行后一行不剩」时才判为纯注释，宁可漏判也不
// 误杀真实代码。语言取不到或不认识时按 `//` 处理（覆盖本仓库绝大多数样本）。

/** 跨行注释：JS/TS/CSS/C++/GLSL/SCSS、HTML/Vue/XML、WAT。 */
const BLOCK_COMMENT_PATTERNS = [
  /\/\*[\s\S]*?\*\//g,
  /<!--[\s\S]*?-->/g,
  /\(;[\s\S]*?;\)/g,
]

/** 单行注释前缀。未列出的语言一律按 `//` 处理。 */
const LINE_COMMENT_PREFIXES: Record<string, string[]> = {
  python: ['#'],
  py: ['#'],
  ruby: ['#'],
  bash: ['#'],
  sh: ['#'],
  shell: ['#'],
  yaml: ['#'],
  yml: ['#'],
  wat: [';;'],
  wasm: [';;'],
  lisp: [';'],
  clojure: [';'],
}

const DEFAULT_LINE_PREFIXES = ['//']

/**
 * 判断一段「关键代码」是否只有注释和空行（没有任何实际代码）。
 *
 * 注意：内容为空或尚未加载（null / undefined / 空白串）时返回 `false` ——
 * 表示「还不能判定」，避免把加载中的骨架屏也一并隐藏掉。
 */
export function isCommentOnlySource(source: unknown, language?: string): boolean {
  if (typeof source !== 'string') return false

  const text = source.trim()
  if (text === '') return false

  const stripped = BLOCK_COMMENT_PATTERNS.reduce((acc, pattern) => acc.replace(pattern, ''), text)
  const prefixes = LINE_COMMENT_PREFIXES[(language ?? '').toLowerCase()] ?? DEFAULT_LINE_PREFIXES

  const hasRealLine = stripped
    .split('\n')
    .map((line) => line.trim())
    .some((line) => line !== '' && !prefixes.some((prefix) => line.startsWith(prefix)))

  return !hasRealLine
}

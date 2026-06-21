// unknown：比 any 更安全的顶层类型，使用前必须收窄
function isCourseData(value: unknown): value is { name: string; count: number } {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return typeof record.name === 'string' && typeof record.count === 'number'
}

// 自定义类型守卫：value is T 谓词让调用处自动收窄
function validate(json: string): string {
  try {
    const data: unknown = JSON.parse(json)
    if (isCourseData(data)) {
      // 此处 data 已被收窄为 { name: string; count: number }
      return `${data.name}：${data.count} 节`
    }
    return '字段结构不合法'
  } catch {
    return '不是有效 JSON'
  }
}

console.log(validate('{"name":"栗子课","count":12}'))  // 栗子课：12 节
console.log(validate('{"name":"栗子课"}'))              // 字段结构不合法

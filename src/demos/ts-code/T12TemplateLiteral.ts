// 模板字面量类型：在类型层面拼接和约束字符串模式

// ── 基础模板字面量 ──
type Color = 'red' | 'green' | 'blue'
type Shade = 'light' | 'dark'
type CssColor = `${Shade}-${Color}`
// 'light-red' | 'light-green' | 'light-blue' | 'dark-red' | 'dark-green' | 'dark-blue'

// ── 内置字符串工具类型 ──
type E1 = Uppercase<'hello'>       // 'HELLO'
type E2 = Lowercase<'Hello'>       // 'hello'
type E3 = Capitalize<'hello'>      // 'Hello'
type E4 = Uncapitalize<'Hello'>    // 'hello'

// ── 事件名约束 ──
type BaseEvent = 'click' | 'focus' | 'submit' | 'change'
type OnEvent = `on${Capitalize<BaseEvent>}`
// 'onClick' | 'onFocus' | 'onSubmit' | 'onChange'

// ── 路由路径类型 ──
type Module = 'vue' | 'react' | 'nuxt'
type LessonId = `${number}`
type RoutePath = `/${Module}/${LessonId}`
// '/vue/1' | '/vue/2' | ... | '/react/1' | ... | '/nuxt/1' | ...

// ── 条件类型 + 模板字面量：提取模式 ──
// 从 'on${Event}' 中提取事件名
type ExtractEvent<T> = T extends `on${infer E}` ? Uncapitalize<E> : never
type Click = ExtractEvent<'onClick'>   // 'click'
type Focus = ExtractEvent<'onFocus'>   // 'focus'

// ── 键名转换（映射类型 + 模板字面量） ──
interface ApiResponse {
  userId: number
  courseTitle: string
  isPublished: boolean
}

// camelCase → snake_case 映射（简化版）
type ToSnakeCase<S extends string> =
  S extends `${infer Head}${infer Tail}`
    ? Tail extends Uncapitalize<Tail>
      ? `${Lowercase<Head>}${ToSnakeCase<Tail>}`
      : `${Lowercase<Head>}_${ToSnakeCase<Tail>}`
    : S

type SnakeResponse = {
  [K in keyof ApiResponse as ToSnakeCase<K & string>]: ApiResponse[K]
}
// { user_id: number; course_title: string; is_published: boolean }

// ── 实际用途：类型安全的事件总线 ──
type EventMap = {
  'user:login': { userId: number }
  'user:logout': undefined
  'course:publish': { courseId: number; title: string }
}

function emit<K extends keyof EventMap>(event: K, payload: EventMap[K]) {
  console.log(`触发事件：${event}`, payload)
}

emit('user:login', { userId: 42 })
emit('course:publish', { courseId: 1, title: '模板字面量' })
// emit('user:login', { courseId: 1 })  // 错误：payload 类型不匹配

console.log('模板字面量类型演示完成')

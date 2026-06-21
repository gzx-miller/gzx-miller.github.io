// 枚举、常量枚举与字面量映射

// ── 数字枚举 ──
// 自动递增（默认从 0 开始），支持反向映射
enum CourseStatus {
  Draft = 0,
  Review = 1,
  Published = 2,
  Archived = 3,
}

const s: CourseStatus = CourseStatus.Published  // 2
const name = CourseStatus[2]                     // 'Published'（反向映射）

// ── 字符串枚举 ──
// 每个成员必须有字符串初始值，无反向映射
enum CourseLevel {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
}

// 枚举成员可以作为类型使用
type PublishedOrArchived = CourseStatus.Published | CourseStatus.Archived

// ── const enum ──
// 编译时完全内联，不生成运行时对象，减小产物体积
// 注意：不要把 ambient const enum 发布给下游；独立转译和版本错配时容易踩坑
const enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}
const move: Direction = Direction.Up  // 编译后直接替换为 'UP'

// ── 联合类型 vs 枚举 ──
// 联合类型更轻量，适合简单场景
type StatusUnion = 'draft' | 'review' | 'published' | 'archived'

// 枚举的优势：可遍历、可反向映射、语义更清晰
// 联合类型的优势：无运行时开销、树摇友好、搭配 as const 也很强

// ── as const 对象：枚举的替代方案 ──
const STATUS = {
  Draft: 'draft',
  Review: 'review',
  Published: 'published',
  Archived: 'archived',
} as const

type StatusFromConst = typeof STATUS[keyof typeof STATUS]
// 'draft' | 'review' | 'published' | 'archived'

// ── satisfies 运算符 + Record 映射 ──
// 确保每个枚举成员都有对应配置，且不丢失类型推导
const statusConfig = {
  [CourseStatus.Draft]:     { label: '草稿', color: '#999' },
  [CourseStatus.Review]:    { label: '审核中', color: '#f90' },
  [CourseStatus.Published]: { label: '已发布', color: '#0a0' },
  [CourseStatus.Archived]:  { label: '已归档', color: '#c00' },
} satisfies Record<CourseStatus, { label: string; color: string }>

console.log(statusConfig[CourseStatus.Published].label)  // 已发布

// ── 枚举遍历 ──
function getStatusLabels(): string[] {
  return Object.entries(CourseStatus)
    .filter(([key]) => isNaN(Number(key)))
    .map(([label]) => label)
}

console.log(getStatusLabels())  // ['Draft', 'Review', 'Published', 'Archived']

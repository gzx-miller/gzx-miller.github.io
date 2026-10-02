const e=`// 条件类型：T extends U ? X : Y —— 在类型层面做条件分支

// ── 基础条件类型 ──
type IsString<T> = T extends string ? true : false
type A = IsString<'hello'>  // true
type B = IsString<42>       // false

// ── 分布式条件类型 ──
// 当 T 是裸类型参数且传入联合类型时，条件会分配到每个成员上
type ToArray<T> = T extends any ? T[] : never
type StrOrNumArr = ToArray<string | number>  // string[] | number[]（而非 (string|number)[]）

// 用 [T] 包裹可禁止分布式行为
type ToArrayStrict<T> = [T] extends [any] ? T[] : never
type MixedArr = ToArrayStrict<string | number>  // (string | number)[]

// ── infer 关键字：在条件类型中捕获 / 推导子类型 ──
interface ApiResponse<T> { ok: true; data: T }

// 从 ApiResponse 中提取 data 的类型
type UnwrapData<R> = R extends ApiResponse<infer D> ? D : never
type CourseData = UnwrapData<ApiResponse<{ title: string }>>  // { title: string }

// ── 内置工具类型的实现原理 ──
// ReturnType：提取函数返回值类型
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never
type R1 = MyReturnType<() => string>                   // string
type R2 = MyReturnType<(x: number) => { ok: boolean }> // { ok: boolean }

// Parameters：提取函数参数类型为元组
type MyParameters<T> = T extends (...args: infer P) => any ? P : never
type P1 = MyParameters<(a: string, b: number) => void>  // [a: string, b: number]

// InstanceType：提取构造函数的实例类型
type MyInstanceType<T> = T extends new (...args: any[]) => infer I ? I : never
class Lesson { title = ''; duration = 0 }
type I1 = MyInstanceType<typeof Lesson>  // Lesson

// ── Exclude / Extract / NonNullable 实现 ──
type MyExclude<T, U> = T extends U ? never : T
type MyExtract<T, U> = T extends U ? T : never
type MyNonNullable<T> = T extends null | undefined ? never : T

type Status = 'draft' | 'published' | 'archived'
type Active = MyExclude<Status, 'archived'>  // 'draft' | 'published'

// ── 递归条件类型 ──
// 将嵌套对象所有属性递归变为可选
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T

interface Nested { a: { b: { c: string } } }
type PartialNested = DeepPartial<Nested>  // { a?: { b?: { c?: string } } }

console.log('条件类型演示完成')
`;export{e as default};

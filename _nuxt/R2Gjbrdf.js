const e=`// 交叉类型（&）：将多个类型合并为一个，成员必须同时满足所有类型
interface WithId { id: number }
interface Timestamped { createdAt: Date; updatedAt: Date }
interface Publishable { published: boolean; publishDate: Date | null }

// 交叉组合：Course 同时拥有 id、时间戳、发布状态
type Course = WithId & Timestamped & Publishable & {
  title: string
  teacher: string
}

const course: Course = {
  id: 1,
  title: 'Vue3 组合式 API',
  teacher: '松松',
  published: false,
  publishDate: null,
  createdAt: new Date('2025-09-01'),
  updatedAt: new Date('2025-09-10'),
}

// ── Mixin 模式：用函数组合行为，替代多层继承 ──
// 每个 Mixin 是一个"能力增强函数"，接收基础对象返回新对象

type Constructor<T = object> = new (...args: any[]) => T

// 可序列化 Mixin
function Serializable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    toJSON() {
      const instance = new Base() as Record<string, unknown>
      return { ...instance, _serialized: true }
    }
  }
}

// 可验证 Mixin
function Validatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    validate(): boolean {
      return true // 子类覆盖具体验证逻辑
    }
  }
}

// 组合多个 Mixin
class FormData {
  data: Record<string, unknown> = {}
}
const EnhancedForm = Serializable(Validatable(FormData))

// ── 交叉类型 vs extends ──
// extends：A extends B 表示 A 是 B 的子类型（"是一个"）
interface Animal { name: string }
interface Dog extends Animal { breed: string }

// 交叉类型：A & B 表示同时是 A 和 B（"既是…也是…"）
type SearchableCourse = Course & { tags: string[] }

// 冲突属性会变成 never（类型不相容时）
type Conflict = { status: 'active' } & { status: 'inactive' }
// Conflict.status 的类型是 never，两个字面量类型无交集

console.log(course.title)  // Vue3 组合式 API
`;export{e as default};

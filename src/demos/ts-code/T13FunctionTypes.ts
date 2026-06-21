// 函数类型、重载与断言函数

// ── 函数类型表达式 ──
type Comparator<T> = (a: T, b: T) => number
const byTitle: Comparator<{ title: string }> = (a, b) => a.title.localeCompare(b.title)

// 调用签名（Call Signature）：可附加属性的函数
interface Logger {
  (message: string): void
  level: 'debug' | 'info' | 'warn' | 'error'
}

// ── 函数重载 ──
interface Course { id: number; title: string }
interface CourseDetail extends Course { teacher: string; duration: number }

// 重载签名：编译器根据参数类型选择匹配的签名
function fetchCourse(id: number): CourseDetail
function fetchCourse(ids: number[]): Course[]
function fetchCourse(input: number | number[]): CourseDetail | Course[] {
  if (typeof input === 'number') {
    return { id: input, title: `课程${input}`, teacher: '松松', duration: 120 }
  }
  return input.map(id => ({ id, title: `课程${id}` }))
}

const detail = fetchCourse(1)      // CourseDetail（自动推导）
const list = fetchCourse([1, 2])   // Course[]

// ── 泛型重载 ──
function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K
): HTMLElementTagNameMap[K]
function createElement(tag: string): HTMLElement
function createElement(tag: string): HTMLElement {
  return document.createElement(tag)
}

const div = createElement('div')    // HTMLDivElement
const span = createElement('span')  // HTMLSpanElement

// ── this 参数类型 ──
interface Task {
  title: string
  priority: number
  compareTo(this: Task, other: Task): number
}

const task: Task = {
  title: '学习函数类型',
  priority: 1,
  compareTo(other) { return this.priority - other.priority }
}

// ── 断言函数（Assertion Functions） ──
// asserts 签名：调用成功后，TypeScript 自动收窄参数类型

function assertDefined<T>(value: T | null | undefined): asserts value is T {
  if (value == null) throw new Error('值不能为空')
}

function assertCourse(obj: unknown): asserts obj is Course {
  if (typeof obj !== 'object' || obj === null) throw new Error('不是对象')
  if (!('id' in obj && 'title' in obj)) throw new Error('缺少课程字段')
}

function process(raw: unknown) {
  assertCourse(raw)
  // 此处 raw 已自动收窄为 Course
  console.log(raw.title)
}

// ── 构造函数类型 ──
type Constructor<T = object> = new (...args: any[]) => T

class Lesson {
  constructor(public title: string, public id: number) {}
}

function createInstance<T>(Ctor: Constructor<T>, ...args: any[]): T {
  return new Ctor(...args)
}

const lesson = createInstance(Lesson, 'TypeScript 基础', 42)

console.log('函数类型演示完成')

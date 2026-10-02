const n=`// Vue 3 组件类型实践：用纯 TS 理解组件类型系统

// ── 组件 Props 类型定义 ──
interface ButtonProps {
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  loading?: boolean
}

// Props 默认值类型推导
function withDefaults<T extends object>(props: T, defaults: Partial<T>): Required<T> {
  return { ...defaults, ...props } as Required<T>
}

const defaultButtonProps: Partial<ButtonProps> = {
  size: 'medium',
  variant: 'primary',
  disabled: false,
  loading: false,
}

const buttonProps = withDefaults<ButtonProps>({}, defaultButtonProps)
// buttonProps.size 类型为 'small' | 'medium' | 'large'

// ── 组件 Emits 类型定义 ──
type EmitFn<Events extends Record<string, any[]>> = {
  <K extends keyof Events>(event: K, ...args: Events[K]): void
}

interface ButtonEmits {
  click: [e: MouseEvent]
  change: [value: boolean]
  update: [key: string, value: any]
}

declare const emit: EmitFn<ButtonEmits>

emit('click', new MouseEvent('click'))  // 正确
// emit('click', 'wrong')               // 错误：参数类型不匹配

// ── 模板引用类型 ──
interface Ref<T> {
  value: T | null
}

function ref<T>(): Ref<T> {
  return { value: null }
}

const inputRef = ref<HTMLInputElement>()
// inputRef.value 类型为 HTMLInputElement | null

// 访问前需要空值守卫
if (inputRef.value) {
  inputRef.value.focus()  // 安全访问
}

// ── 计算属性类型 ──
interface ComputedRef<T> {
  readonly value: T
}

function computed<T>(getter: () => T): ComputedRef<T> {
  return { get value() { return getter() } }
}

const count = { value: 0 }
const doubled = computed(() => count.value * 2)
// doubled.value 类型为 number（只读）

// ── 组合式函数类型 ──
interface UseCounterReturn {
  count: Ref<number>
  increment: () => void
  decrement: () => void
  reset: () => void
}

function useCounter(initial = 0): UseCounterReturn {
  const count = ref<number>()
  count.value = initial
  const increment = () => { count.value = (count.value ?? 0) + 1 }
  const decrement = () => { count.value = (count.value ?? 0) - 1 }
  const reset = () => { count.value = initial }
  return { count, increment, decrement, reset }
}

const { count: counter, increment } = useCounter(10)
increment()

console.log('Vue 组件类型演示完成')
`;export{n as default};

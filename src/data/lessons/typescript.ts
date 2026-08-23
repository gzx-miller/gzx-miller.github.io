import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })
const vueCodeModules = import.meta.glob<string>('../../demos/*.vue', { query: '?raw', import: 'default' })
const jsxCodeModules = import.meta.glob<string>('../../demos/react-jsx/*.jsx', { query: '?raw', import: 'default' })
const stateCodeModules = import.meta.glob<string>('../../demos/state-react/*.js', { query: '?raw', import: 'default' })
const jsCodeModules = import.meta.glob<string>('../../demos/js-code/*.js', { query: '?raw', import: 'default' })
const tsCodeModules = import.meta.glob<string>('../../demos/ts-code/*.ts', { query: '?raw', import: 'default' })
const styleCodeModules = import.meta.glob<string>('../../demos/style-code/*', { query: '?raw', import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到案例组件：${name}`)
  return defineAsyncComponent(async () => {
    if (name.startsWith('E')) await import('../../element-plus/styles')
    return loader()
  })
}

function createCodeLoader(path: string) {
  const modules = path.startsWith('react-jsx/')
    ? jsxCodeModules
    : path.startsWith('state-react/')
      ? stateCodeModules
      : path.startsWith('js-code/')
        ? jsCodeModules
        : path.startsWith('ts-code/')
          ? tsCodeModules
          : path.startsWith('style-code/')
            ? styleCodeModules
            : vueCodeModules
  const loader = modules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到案例源码：${path}`)
  return loader
}

const T01TypeInference = createDemo('T01TypeInference')
const T01Code = createCodeLoader('ts-code/T01TypeInference.ts')
const T02UnionNarrowing = createDemo('T02UnionNarrowing')
const T02Code = createCodeLoader('ts-code/T02UnionNarrowing.ts')
const T03ObjectModeling = createDemo('T03ObjectModeling')
const T03Code = createCodeLoader('ts-code/T03ObjectModeling.ts')
const T04Generics = createDemo('T04Generics')
const T04Code = createCodeLoader('ts-code/T04Generics.ts')
const T05Keyof = createDemo('T05Keyof')
const T05Code = createCodeLoader('ts-code/T05Keyof.ts')
const T06UtilityTypes = createDemo('T06UtilityTypes')
const T06Code = createCodeLoader('ts-code/T06UtilityTypes.ts')
const T07UnknownGuard = createDemo('T07UnknownGuard')
const T07Code = createCodeLoader('ts-code/T07UnknownGuard.ts')
const T08VueTyping = createDemo('T08VueTyping')
const T09IntersectionMixin = createDemo('T09IntersectionMixin')
const T09Code = createCodeLoader('ts-code/T09IntersectionMixin.ts')
const T10Conditional = createDemo('T10Conditional')
const T10Code = createCodeLoader('ts-code/T10Conditional.ts')
const T11Mapped = createDemo('T11Mapped')
const T11Code = createCodeLoader('ts-code/T11Mapped.ts')
const T12TemplateLiteral = createDemo('T12TemplateLiteral')
const T12Code = createCodeLoader('ts-code/T12TemplateLiteral.ts')
const T13FunctionTypes = createDemo('T13FunctionTypes')
const T13Code = createCodeLoader('ts-code/T13FunctionTypes.ts')
const T14Enums = createDemo('T14Enums')
const T14Code = createCodeLoader('ts-code/T14Enums.ts')
const T15DeclarationMerging = createDemo('T15DeclarationMerging')
const T15Code = createCodeLoader('ts-code/T15DeclarationMerging.ts')
const T16CompilerOptions = createDemo('T16CompilerOptions')
const T17DeclarationFiles = createDemo('T17DeclarationFiles')
const T18Namespace = createDemo('T18Namespace')
const T19BrandedTypes = createDemo('T19BrandedTypes')
const T20DiscriminatedUnion = createDemo('T20DiscriminatedUnion')
const T21InferKeyword = createDemo('T21InferKeyword')
const T22RecursiveTypes = createDemo('T22RecursiveTypes')
const T23TypeLevelProgramming = createDemo('T23TypeLevelProgramming')
const T24AsyncReturnType = createDemo('T24AsyncReturnType')


export const lessons: Lesson[] = [
{
    id: 'T_01', title: '类型推导与显式标注', navTitle: '类型推导', category: '类型基础',
    path: '/typescript/t-1/type-inference', summary: '从课程表单理解 TypeScript 如何推导类型，以及何时需要显式标注。',
    demo: T01TypeInference, code: T01Code, language: 'typescript',
    principle: 'TypeScript 会根据初始值推导变量类型；当值可能为空、类型会变化或公共 API 需要稳定契约时，应补充显式类型标注。',
    flow: ['先让编译器从确定的初始值推导类型。', '遇到联合状态或空值时显式声明。', '在编辑器和类型检查阶段发现不合法赋值。'],
    notes: ['避免给所有局部变量重复写显而易见的类型。', '不要用 any 绕过建模问题。'],
    problem: '解决"哪些类型可以交给编译器推导、哪些边界必须显式声明"的问题。',
  },
{
    id: 'T_02', title: '联合类型与控制流收窄', navTitle: '联合与收窄', category: '类型基础',
    path: '/typescript/t-2/union-narrowing', summary: '用订单状态机掌握字面量联合类型和条件分支收窄。',
    demo: T02UnionNarrowing, code: T02Code, language: 'typescript',
    principle: '联合类型把一个值可能的状态显式列举出来，TypeScript 在条件分支中通过相等判断、typeof、in 与判别属性逐步把范围缩窄到具体成员；剩余分支如果未覆盖，可借助 never 与 switch 的穷尽性检查发现遗漏。',
    flow: ['用字面量联合定义订单所有合法状态，禁用魔法字符串。', '在条件分支中判断当前状态，让 TypeScript 推断出具体成员。', '收窄后调用该状态专属的业务逻辑，未覆盖的分支抛出 never 校验失败。'],
    notes: ['状态值应来自一个统一类型或字面量常量，避免散落字符串。', '穷尽检查能在新增状态时编译期提醒遗漏分支。', '判别属性（tag）让联合的收窄比 typeof 更加精确。'],
    problem: '解决"如何让非法业务状态无法被创建，并安全处理不同分支"的问题。',
  },
{
    id: 'T_03', title: '对象类型与领域建模', navTitle: '对象建模', category: '类型基础',
    path: '/typescript/t-3/object-modeling', summary: '通过会员资料区分 interface、type 与对象结构约束。',
    demo: T03ObjectModeling, code: T03Code, language: 'typescript',
    principle: 'interface 适合表达可扩展的对象契约，支持声明合并；type 更适合组合联合、交叉和条件类型等复杂表达式；两者都遵循结构化类型系统，关注形状而非声明来源，让模型可以渐进式演化。',
    flow: ['识别领域对象的稳定字段与可变字段。', '用 interface 定义公开契约，用 type 组合联合、交叉等派生类型。', '让响应式状态、组件 Props 与接口响应都遵守同一份业务契约。'],
    notes: ['公共模型应使用业务语言命名，避免与数据库或接口字段名混用。', '可选字段只用于数据确实可能缺失的场景，否则应放在必填区。', 'interface 声明合并适合插件式扩展，普通业务对象用 type 更清晰。'],
    problem: '解决"如何把接口返回和业务对象建模成可维护类型"的问题。',
  },
{
    id: 'T_04', title: '泛型：复用类型关系', navTitle: '泛型', category: '类型进阶',
    path: '/typescript/t-4/generics', summary: '用通用 API 响应保留课程列表的精确数据类型。',
    demo: T04Generics, code: T04Code, language: 'typescript',
    principle: '泛型把类型作为参数传递，使函数、类与容器既能复用同一份实现，又能在调用时由实参推导具体类型，保留输入与输出之间的精确关系，避免在公共代码里写 any 或 unknown 牺牲类型安全。',
    flow: ['找出实现中需要变化的类型，例如响应数据的负载类型。', '用类型参数表达输入输出关系，让推导能贯穿整条链路。', '调用时由实参推导具体类型，必要时通过显式实参约束边界条件。'],
    notes: ['类型参数名应表达角色（T、Item、Key、Value），单字母只在最常见场景使用。', '仅使用一次且没有关系的类型参数通常没有价值，可考虑具体类型替代。', '泛型约束（extends）能让实现侧安全使用传入类型的属性。'],
    problem: '解决"如何复用 API、列表和工具函数而不丢失类型信息"的问题。',
  },
{
    id: 'T_05', title: 'keyof 与索引访问类型', navTitle: 'keyof', category: '类型进阶',
    path: '/typescript/t-5/keyof', summary: '构建只能读取合法配置键的设置面板。',
    demo: T05Keyof, code: T05Code, language: 'typescript',
    principle: 'keyof 从对象类型得到属性键的联合，T[K] 根据键取得对应值类型，两者结合可以编写安全的动态属性访问，配合泛型约束和查找类型就能让配置中心、设置面板等场景既灵活又不会拼错键名。',
    flow: ['从对象模型提取合法键的联合 keyof T。', '让函数参数受键联合约束，禁止传入不存在的键。', '通过索引访问 T[K] 取得与键匹配的值类型，保证返回类型精确。'],
    notes: ['Object.keys 默认返回 string[]，必要时通过类型断言或工具函数收窄。', '不要用宽泛 string 索引绕过键约束，那等于重新回到 any 模式。', '结合 as const 与字面量对象能进一步得到更精确的字面量联合。'],
    problem: '解决"动态访问对象属性时如何避免键名拼写错误"的问题。',
  },
{
    id: 'T_06', title: '工具类型与更新模型', navTitle: '工具类型', category: '类型进阶',
    path: '/typescript/t-6/utility-types', summary: '用 Partial、Pick 和 Omit 表达课程的局部更新。',
    demo: T06UtilityTypes, code: T06Code, language: 'typescript',
    principle: '内置工具类型通过映射类型和条件类型从已有模型派生新契约，让新增、详情、更新和接口响应等不同语义共用同一份领域模型，并避免手写重复类型带来的漂移和维护成本。',
    flow: ['先定义完整领域模型作为唯一来源。', '按操作语义挑选或排除字段，组合 Partial、Pick、Omit、Required。', '将派生类型用于表单初始值、提交负载和接口响应。'],
    notes: ['派生类型应保持来源清晰，必要时用 type 别名解释用途。', '深层对象的 Partial 不会自动递归，必要时借助工具库或自定义映射类型。', 'Readonly<T> 可以在状态初始化时显式表达不可变语义。'],
    problem: '解决"创建、编辑和接口响应类型重复且容易漂移"的问题。',
  },
{
    id: 'T_07', title: 'unknown 与自定义类型守卫', navTitle: '安全边界', category: '安全边界',
    path: '/typescript/t-7/unknown-guard', summary: '安全解析用户导入的 JSON，在使用前验证未知数据。',
    demo: T07UnknownGuard, code: T07Code, language: 'typescript',
    principle: '外部输入在验证之前都应视为 unknown，类型守卫既要在运行时执行真实检查，又要向编译器证明检查后的精确类型；结合 zod、valibot 等 schema 库可以把校验结果直接落到类型上。',
    flow: ['把网络或用户输入统一接收为 unknown，避免 any。', '用 typeof、in 或自定义守卫函数逐层检查对象与字段。', '守卫通过后再把数据交给业务逻辑，确保下游看到的都是精确类型。'],
    notes: ['类型断言（as）不会产生运行时校验，无法替代真实检查。', '复杂结构应使用 zod、valibot、io-ts 等 schema 校验库自动推导类型。', '断言函数（asserts）可以把守卫的 boolean 结果转成 never，让调用方自动收窄。'],
    problem: '解决"接口或本地数据不可信时，如何避免错误断言导致运行时崩溃"的问题。',
  },
{
    id: 'T_08', title: 'Vue 3 组件类型实践', navTitle: 'Vue 类型', category: '框架实践',
    path: '/typescript/t-8/vue-typing', summary: '掌握响应式状态、模板引用、Props 与 Emits 的类型边界。',
    demo: T08VueTyping, code: () => Promise.resolve(`// Vue 3 组件类型实践：用纯 TS 理解组件类型系统

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
`), language: 'typescript',
    principle: 'Vue 3 的 defineProps、defineEmits、withDefaults 等宏能从泛型声明推导模板类型；模板引用 ref<T>() 还要处理挂载前的 null 边界，与组件实例类型一起构成组件类型系统的完整闭环。',
    flow: ['为业务状态声明接口或类型别名。', '用泛型约束 Props、Emits、模板引用和 provide/inject 键。', '在访问 DOM 或子组件前处理空值，必要时用 watch 或 onMounted 等待挂载。'],
    notes: ['优先使用类型化的 defineProps 和 defineEmits，避免运行时声明。', '模板引用 ref<T | null>(null) + 守卫比直接 as 更安全。', '组件实例类型可以用 InstanceType<typeof Comp> 在父级引用。'],
    problem: '解决"如何让 Vue 组件的输入、输出和模板引用获得完整类型检查"的问题。',
  },
{
    id: 'T_09', title: '交叉类型与 Mixin 模式', navTitle: '交叉与 Mixin', category: '类型进阶',
    path: '/typescript/t-9/intersection-mixin', summary: '用交叉类型组合多个能力片段，用 Mixin 函数叠加行为。',
    demo: T09IntersectionMixin, code: T09Code, language: 'typescript',
    principle: '交叉类型 & 把多个接口合并为一个，要求同时满足所有成员；Mixin 用函数在运行时组合行为，提供比继承更灵活的复用方式。',
    flow: ['定义独立的能力接口。', '用 & 组合成交叉类型。', 'Mixin 函数在运行时叠加方法。'],
    notes: ['交叉类型中同名属性取交集。', 'Mixin 组合注意方法冲突。'],
    problem: '解决"如何灵活组合多个能力而不依赖继承层级"的问题。',
  },
{
    id: 'T_10', title: '条件类型与类型推导', navTitle: '条件类型', category: '类型进阶',
    path: '/typescript/t-10/conditional', summary: '用条件类型和 infer 从联合响应中提取精确类型。',
    demo: T10Conditional, code: T10Code, language: 'typescript',
    principle: '条件类型根据 extends 关系选择分支；infer 可在 extends 子句中捕获并复用未知类型，是构建高级工具类型的核心机制。',
    flow: ['用 T extends U ? X : Y 描述类型分支。', '用 infer 捕获嵌套或返回类型。', '组合条件类型实现复杂推导。'],
    notes: ['裸类型参数上的条件类型会自动分发。', 'ReturnType 和 Parameters 的底层就是 infer。'],
    problem: '解决"如何从复杂泛型中自动提取和转换子类型"的问题。',
  },
{
    id: 'T_11', title: '映射类型与键转换', navTitle: '映射类型', category: '类型进阶',
    path: '/typescript/t-11/mapped', summary: '用映射类型批量转换属性，掌握修饰符和键重命名。',
    demo: T11Mapped, code: T11Code, language: 'typescript',
    principle: '映射类型以 { [K in keyof T]: ... } 形式遍历已有类型的键并生成新类型，可添加 readonly/可选修饰符，也能通过 as 子句重命名或过滤键，是 Partial、Readonly、Pick 等内置工具的底层机制。',
    flow: ['从已有模型遍历 keyof T 的全部键。', '通过 +/-? 与 readonly 添加或移除修饰符。', '用 as 重命名键（如前缀化），或通过 never 过滤掉不需要的键。'],
    notes: ['Partial 和 Readonly 的底层实现就是映射类型，理解它们能写出更贴合业务的派生类型。', '-? 可以移除可选修饰符，-readonly 同样可以恢复可写。', '映射类型与键重命名结合时需注意不要破坏类型一致性。'],
    problem: '解决"如何从一个模型批量派生只读、可选或重命名版本"的问题。',
  },
{
    id: 'T_12', title: '模板字面量类型', navTitle: '模板字面量', category: '类型进阶',
    path: '/typescript/t-12/template-literal', summary: '构建类型安全的事件名、路由路径和 CSS 类名。',
    demo: T12TemplateLiteral, code: T12Code, language: 'typescript',
    principle: '模板字面量类型把字符串拼接提升到类型层面，配合 Uppercase、Lowercase、Capitalize 等内置工具以及条件类型与 infer，可以构造出精确的事件名、路由路径、CSS 类名约束，让编辑器在输入阶段就能提示错误。',
    flow: ['用 `${Prefix}${Suffix}` 拼接字面量类型与联合。', '用 Uppercase、Capitalize 等工具转换大小写形态。', '结合条件类型和 infer 提取字符串片段或解析结构。'],
    notes: ['模板字面量类型与联合组合时会自动展开成笛卡尔积，需注意爆炸性增长。', '配合 infer 可以从字符串类型中解析结构化信息。', '适合在事件总线、API 路由、状态机 key 等强约束场景使用。'],
    problem: '解决"如何让事件名、路由和 CSS 类名在编译期就保证正确性"的问题。',
  },
{
    id: 'T_13', title: '函数类型、重载与断言函数', navTitle: '函数类型', category: '类型进阶',
    path: '/typescript/t-13/function-types', summary: '为 API 编写重载签名，用断言函数做运行时类型守卫。',
    demo: T13FunctionTypes, code: T13Code, language: 'typescript',
    principle: '函数类型表达式描述参数与返回值，重载让同一函数名根据不同输入返回不同类型；断言函数（asserts）在运行时执行校验并向编译器声明"后续一定是正确类型"，是 unknown 安全收窄的关键工具。',
    flow: ['用 (x: T) => R 声明函数类型表达式。', '为同一函数编写多个重载签名，覆盖典型输入组合。', '用 asserts 签名实现运行时守卫，把 boolean 转成 never 自动收窄。'],
    notes: ['重载签名必须从最具体到最宽泛排列，否则 TS 不会命中期望分支。', '断言函数返回值是 asserts cond 而不是 boolean。', '配合泛型让守卫可以作用于多种输入结构。'],
    problem: '解决"同一函数如何根据输入返回不同类型，以及如何安全收窄 unknown"的问题。',
  },
{
    id: 'T_14', title: '枚举、常量枚举与字面量映射', navTitle: '枚举与映射', category: '类型进阶',
    path: '/typescript/t-14/enums', summary: '比较枚举与联合字面量在状态建模中的差异和适用场景。',
    demo: T14Enums, code: T14Code, language: 'typescript',
    principle: '枚举提供运行时值，其中数字枚举还会生成反向映射；联合字面量配合 as const 对象可实现类似效果，通常产物更轻、组合更灵活。',
    flow: ['用枚举定义有限状态集合。', '对比 const enum 的编译产物。', '用 as const + Record 实现无枚举映射。'],
    notes: ['数字枚举有反向映射，字符串枚举没有。', 'const enum 会内联成员，但在库声明和独立转译流程中应谨慎使用。'],
    problem: '解决"有限状态集合应该用枚举还是联合字面量来建模"的问题。',
  },
{
    id: 'T_15', title: '声明合并与模块扩展', navTitle: '声明合并', category: '类型进阶',
    path: '/typescript/t-15/declaration-merging', summary: '扩展第三方库类型，掌握接口合并和模块增强。',
    demo: T15DeclarationMerging, code: T15Code, language: 'typescript',
    principle: '同名 interface 自动合并，namespace 可与 class/function 合并；declare module 可为第三方包追加类型声明。',
    flow: ['声明同名接口触发合并。', '用 declare module 扩展已有模块。', '在 .d.ts 文件中放置全局类型增强。'],
    notes: ['class 不能与 class 合并。', '模块增强必须在模块作用域中使用。'],
    problem: '解决"如何在不修改源码的前提下为第三方库补充类型"的问题。',
  },
{
    id: 'T_16', title: 'tsconfig 编译配置详解', navTitle: 'tsconfig', category: '类型进阶',
    path: '/typescript/t-16/compiler-options', summary: '理解 strict、target、module 等核心编译选项对类型检查行为的影响。',
    demo: T16CompilerOptions, code: () => Promise.resolve(`// tsconfig 编译配置：用类型理解核心选项的影响

// ── strict 模式：启用所有严格类型检查选项 ──
// strict: true 等价于启用以下所有选项：
// - noImplicitAny: 禁止隐式 any
// - noImplicitThis: 禁止 this 隐式 any
// - strictNullChecks: 严格空值检查
// - strictFunctionTypes: 严格函数类型
// - strictBindCallApply: 严格 bind/call/apply
// - strictPropertyInitialization: 严格属性初始化
// - alwaysStrict: 始终使用严格模式

// noImplicitAny 示例：开启后下面代码会报错
// function add(a, b) {  // 错误：参数 a、b 隐式具有 any 类型
//   return a + b
// }
function add(a: number, b: number): number {  // 正确：显式标注类型
  return a + b
}

// strictNullChecks 示例：开启后 null/undefined 不能赋值给其他类型
// let name: string = null  // 错误：不能将 null 赋值给 string
let name: string | null = null  // 正确：显式声明联合类型
name = 'TypeScript'

// strictNullChecks 下的可选链与空值合并
interface User {
  profile?: {
    address?: {
      city?: string
    }
  }
}

const user: User = {}
const city = user.profile?.address?.city ?? '未知'
// city 类型为 string | undefined → 经 ?? 后为 string

// ── target：编译输出的 JavaScript 版本 ──
// target 影响可用的语法和内置类型
// ES5 → 不支持 Promise、Map、Set 等（需 polyfill）
// ES2015/ES6 → 支持 Promise、类、箭头函数等
// ES2020 → 支持可选链、空值合并、BigInt 等
// ESNext → 最新特性

// target 为 ES5 时，下面的语法会被转译
const greet = (name: string): string => \`Hello, \${name}!\`
// 会转译为：function greet(name) { return "Hello, " + name + "!"; }

// ── module：模块系统 ──
// module 决定编译后的模块格式
// - CommonJS: Node.js 传统格式 (require/module.exports)
// - ES2015/ESNext: ES 模块 (import/export)
// - AMD: 浏览器端异步模块
// - UMD: 通用模块定义（兼容浏览器+Node.js）

// 模块解析策略
// - classic: 旧版解析方式
// - node: Node.js 风格解析
// - bundler: 适合 Vite、Webpack 等打包工具

// ── paths 与 baseUrl：模块别名 ──
// 配合 baseUrl 和 paths 可以配置路径别名
// 例如：
// {
//   "baseUrl": ".",
//   "paths": {
//     "@/*": ["src/*"],
//     "@components/*": ["src/components/*"]
//   }
// }

// 配置后可以这样导入：
// import Button from '@/components/Button'
// 而不是：
// import Button from '../../components/Button'

// ── lib：编译时可用的内置库类型 ──
// lib 决定哪些全局类型可用
// - ES2020: ES2020 标准库类型
// - DOM: 浏览器 DOM 类型（document、window 等）
// - DOM.Iterable: DOM 可迭代类型
// - WebWorker: Web Worker 类型

// 例如：node 环境项目通常不需要 DOM 类型
// { "lib": ["ES2020"] }
// 前端项目通常需要 DOM 类型
// { "lib": ["ES2020", "DOM", "DOM.Iterable"] }

// ── declaration 与 declarationDir ──
// declaration: true → 生成 .d.ts 声明文件
// declarationDir → 声明文件输出目录
// 适合开发库时使用，让使用者获得类型提示

// ── skipLibCheck：跳过库文件类型检查 ──
// skipLibCheck: true → 跳过 .d.ts 文件的类型检查
// 可以加快编译速度，避免第三方库类型冲突

console.log('tsconfig 配置演示完成')
`), language: 'typescript',
    principle: 'tsconfig.json 控制 TypeScript 编译行为；strict 系列决定类型安全等级，target 决定输出 JS 版本，module/moduleResolution 决定模块系统。',
    flow: ['从 strict: true 开始获得最严格的类型检查。', '根据运行环境选择 target 和 module。', '用 paths 和 baseUrl 配置模块别名。'],
    notes: ['新项目建议直接启用 strict。', 'moduleResolution 的 bundler 模式适合 Vite 项目。'],
    problem: '解决"tsconfig 选项太多，如何理解和配置核心编译选项"的问题。',
  },
{
    id: 'T_17', title: '声明文件与全局类型增强', navTitle: '声明文件', category: '类型进阶',
    path: '/typescript/t-17/declaration-files', summary: '掌握 .d.ts 声明文件的编写模式、全局增强和第三方库类型补充。',
    demo: T17DeclarationFiles, code: () => Promise.resolve(`// 声明文件与全局类型增强：理解 .d.ts 的作用

// ── 环境声明：declare 关键字 ──
// 告诉 TypeScript "这个东西存在，但实现不在这"

// 声明全局变量
declare const __APP_VERSION__: string
declare const __BUILD_TIME__: number

// 使用环境变量
const version = __APP_VERSION__
const buildTime = new Date(__BUILD_TIME__)

// 声明全局函数
declare function ga(event: string, data?: object): void

// ga('page_view', { page: '/home' })

// ── 声明模块：为无类型 JS 库补充类型 ──
// 当第三方库没有 .d.ts 文件时，可以自己写声明

// 声明一个模块
// declare module 'some-js-lib' {
//   export function init(options: { debug?: boolean }): void
//   export const version: string
// }

// 使用时就能获得类型提示
// import { init, version } from 'some-js-lib'
// init({ debug: true })

// 声明通配符模块（如资源文件）
// declare module '*.svg' {
//   const content: string
//   export default content
// }
//
// declare module '*.png' {
//   const src: string
//   export default src
// }
//
// declare module '*.module.css' {
//   const classes: { [key: string]: string }
//   export default classes
// }

// ── 全局类型增强：扩展已有类型 ──
// 注意：必须在模块文件（有 import/export）中使用 declare global

// 扩展 String 接口
// declare global {
//   interface String {
//     capitalize(): string
//     padLeft(length: number, char?: string): string
//   }
// }

// 扩展后就可以在字符串上调用这些方法
// const str = 'hello'
// str.capitalize()  // 'Hello'
// str.padLeft(10)   // '     hello'

// 扩展 Array 接口
// declare global {
//   interface Array<T> {
//     first(): T | undefined
//     last(): T | undefined
//     unique(): T[]
//   }
// }

// const arr = [1, 2, 2, 3]
// arr.first()   // 1
// arr.last()    // 3
// arr.unique()  // [1, 2, 3]

// ── 扩展 Window 对象 ──
// 为 window 添加自定义属性

// declare global {
//   interface Window {
//     __INITIAL_STATE__: {
//       user: { id: number; name: string } | null
//       theme: 'light' | 'dark'
//     }
//     myGlobalFunc: (msg: string) => void
//   }
// }

// 访问 window 上的自定义属性
// const theme = window.__INITIAL_STATE__.theme
// window.myGlobalFunc('hello')

// ── 命名空间声明 ──
// 为库的命名空间补充类型

// declare namespace MyLib {
//   interface Config {
//     debug: boolean
//     version: string
//   }
//
//   function configure(cfg: Partial<Config>): void
//   const config: Config
// }

// MyLib.configure({ debug: true })
// console.log(MyLib.config.version)

// ── 声明合并：接口自动合并 ──
// 同名的 interface 会自动合并

interface UserConfig {
  debug: boolean
}

interface UserConfig {
  version: string
}

// 合并后相当于：
// interface UserConfig {
//   debug: boolean
//   version: string
// }

const config: UserConfig = {
  debug: true,
  version: '1.0.0',
}

console.log('声明文件演示完成')
`), language: 'typescript',
    principle: '声明文件 (.d.ts) 为 JavaScript 代码提供类型信息；ambient 声明用 declare 关键字，全局增强通过 declare global，模块声明用 declare module。',
    flow: ['为无类型的 JS 库编写 declare module。', '用 declare global 扩展 Window 等全局对象。', '在项目中组织 .d.ts 文件的引用路径。'],
    notes: ['DefinitelyTyped 是社区维护的类型声明仓库。', '声明文件不包含实现代码。'],
    problem: '解决"如何为 JavaScript 库和全局环境补充 TypeScript 类型声明"的问题。',
  },
{
    id: 'T_18', title: '命名空间与模块模式对比', navTitle: '命名空间', category: '类型进阶',
    path: '/typescript/t-18/namespace', summary: '比较 namespace 与 ES Module 在类型组织中的差异和适用场景。',
    demo: T18Namespace, code: () => Promise.resolve(`// 命名空间与模块模式：理解 namespace 与 ES Module 的差异

// ── 命名空间（namespace）基础 ──
// namespace 是 TypeScript 早期的模块组织方式

namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean
  }

  export const lettersRegexp = /^[A-Za-z]+$/
  export const numberRegexp = /^[0-9]+$/

  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s)
    }
  }

  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s)
    }
  }
}

// 使用命名空间中的类型
const validators: { [key: string]: Validation.StringValidator } = {
  letters: new Validation.LettersOnlyValidator(),
  zip: new Validation.ZipCodeValidator(),
}

console.log(validators.letters.isAcceptable('Hello'))  // true
console.log(validators.zip.isAcceptable('12345'))      // true

// ── 命名空间的声明合并 ──
// 同名的 namespace 会自动合并

namespace Animals {
  export interface Dog {
    name: string
    breed: string
  }
}

namespace Animals {
  export interface Cat {
    name: string
    color: string
  }

  export function createDog(name: string, breed: string): Dog {
    return { name, breed }
  }
}

// 合并后 Animals 同时有 Dog、Cat 和 createDog
const dog = Animals.createDog('旺财', '柴犬')
const cat: Animals.Cat = { name: '咪咪', color: '橘色' }

// ── 命名空间与类合并 ──
// namespace 可以与 class 合并，为类添加静态成员

class Album {
  title: string
  artist: string

  constructor(title: string, artist: string) {
    this.title = title
    this.artist = artist
  }
}

namespace Album {
  export function create(title: string, artist: string): Album {
    return new Album(title, artist)
  }

  export const GENRES = ['rock', 'pop', 'jazz', 'classical'] as const
  export type Genre = typeof GENRES[number]
}

const album = Album.create('Thriller', 'Michael Jackson')
const genre: Album.Genre = 'pop'

// ── ES Module 方式（现代推荐） ──
// ES Module 是 JavaScript 标准，每个文件就是一个模块

// 导出
// export interface User {
//   id: number
//   name: string
// }
//
// export function getUser(id: number): User {
//   return { id, name: 'User ' + id }
// }
//
// export default class UserService {
//   get(id: number) {
//     return { id, name: 'User ' + id }
//   }
// }

// 导入
// import { User, getUser } from './user'
// import UserService from './user'
// import * as UserModule from './user'

// ── 命名空间 vs ES Module 对比 ──

// 命名空间：
// - TypeScript 特有语法
// - 运行时会生成一个全局对象
// - 支持声明合并
// - 适合在全局环境中组织代码（旧代码）
// - 不需要打包工具

// ES Module：
// - JavaScript 标准语法
// - 静态分析友好，支持 tree-shaking
// - 每个文件是独立作用域
// - 依赖关系明确
// - 现代项目推荐使用

// ── 命名空间的适用场景 ──
// 1. .d.ts 声明文件中组织类型
// 2. 旧代码维护
// 3. 全局环境中的类型组织

// 示例：在声明文件中用 namespace 组织类型
// declare namespace MyAPI {
//   interface User { id: number; name: string }
//   interface Order { id: string; userId: number }
//
//   function getUser(id: number): Promise<User>
//   function getOrders(userId: number): Promise<Order[]>
// }
//
// const user: MyAPI.User = { id: 1, name: 'Tom' }

// ── 别名简化命名空间访问 ──
// 用 import 别名简化深层命名空间访问

namespace Shapes {
  export namespace Polygons {
    export class Triangle {
      constructor(public base: number, public height: number) {}
      area() { return this.base * this.height / 2 }
    }
    export class Square {
      constructor(public side: number) {}
      area() { return this.side * this.side }
    }
  }
}

// 别名
import polygons = Shapes.Polygons

const tri = new polygons.Triangle(3, 4)
console.log(tri.area())  // 6

const sq = new polygons.Square(5)
console.log(sq.area())   // 25

console.log('命名空间演示完成')
`), language: 'typescript',
    principle: 'namespace 是 TypeScript 早期的模块组织方式，支持声明合并；ES Module 是现代标准，两者不应混用。新项目应优先使用 ES Module。',
    flow: ['了解 namespace 的声明合并能力。', '对比 namespace 与 ES Module 的产物差异。', '确定项目中统一使用 ES Module。'],
    notes: ['namespace 主要存在于旧代码和声明文件中。', '不要在同一项目中混用 namespace 和 ES Module。'],
    problem: '解决"何时使用 namespace、何时使用 ES Module 来组织类型"的问题。',
  },
{
    id: 'T_19', title: '品牌类型(Branded Types)与名义类型', navTitle: '品牌类型', category: '类型进阶',
    path: '/typescript/t-19/branded-types', summary: '通过品牌类型模拟名义类型，让结构相同但语义不同的类型不能互相赋值。',
    demo: T19BrandedTypes, code: () => Promise.resolve(`// 品牌类型（Branded Types）：模拟名义类型，区分语义不同的结构相同类型

// ── 基础品牌类型 ──
// 使用交叉类型 & 加上唯一的 "品牌" 属性
// 运行时没有额外开销，只是类型层面的标记

type Brand<T, B extends string> = T & { readonly __brand: B }

// 定义不同语义的 ID 类型
type UserId = Brand<number, 'UserId'>
type OrderId = Brand<number, 'OrderId'>
type ProductId = Brand<string, 'ProductId'>

// 类型断言创建品牌类型的值
const userId = 1001 as UserId
const orderId = 2001 as OrderId
const productId = 'PROD-001' as ProductId

// 错误：不能将 OrderId 赋值给 UserId（虽然底层都是 number）
// const wrongId: UserId = orderId  // 类型不兼容

// 正确：同类型可以赋值
const anotherUserId: UserId = userId

// ── 品牌类型构造函数 ──
// 用函数封装类型断言，更安全

function createUserId(id: number): UserId {
  return id as UserId
}

function createOrderId(id: number): OrderId {
  return id as OrderId
}

const uid = createUserId(100)
const oid = createOrderId(200)

// 函数参数使用品牌类型，传参时自动校验身份
function fetchUser(id: UserId) {
  return { id, name: '用户' + id }
}

function fetchOrder(id: OrderId) {
  return { id, status: 'pending' }
}

fetchUser(uid)   // 正确
// fetchUser(oid) // 错误：类型不匹配

// ── 更多品牌类型示例 ──

// 邮箱类型
type Email = Brand<string, 'Email'>

function createEmail(email: string): Email | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) ? email as Email : null
}

function sendEmail(to: Email, subject: string) {
  console.log(\`发送邮件到 \${to}，主题：\${subject}\`)
}

const adminEmail = createEmail('a****@********')
if (adminEmail) {
  sendEmail(adminEmail, '系统通知')
}

// 金额类型（避免不同货币混用）
type USD = Brand<number, 'USD'>
type CNY = Brand<number, 'CNY'>

function usd(amount: number): USD {
  return amount as USD
}

function cny(amount: number): CNY {
  return amount as CNY
}

const priceUSD = usd(99.9)
const priceCNY = cny(699)

function payUSD(amount: USD) {
  console.log(\`支付 \${amount} 美元\`)
}

payUSD(priceUSD)  // 正确
// payUSD(priceCNY) // 错误：不能用人民币支付美元账户

// ── 使用 symbol 作为品牌（避免属性名冲突） ──
// 用 unique symbol 代替字符串，更安全

declare const __brand: unique symbol
type Branded<T, B> = T & { [__brand]: B }

type SafeUserId = Branded<number, 'UserId'>
type SafeOrderId = Branded<number, 'OrderId'>

// ── 带校验的品牌类型 ──
// 结合类型守卫，运行时也能验证

type PositiveNumber = Brand<number, 'PositiveNumber'>

function isPositiveNumber(n: number): n is PositiveNumber {
  return n > 0
}

function createPositive(n: number): PositiveNumber | null {
  return isPositiveNumber(n) ? n : null
}

function setAge(age: PositiveNumber) {
  console.log(\`年龄设置为：\${age}\`)
}

const age = createPositive(25)
if (age) {
  setAge(age)
}

// ── 去除品牌类型 ──
// 有时需要转回原始类型

type Unbrand<T> = T extends Brand<infer U, any> ? U : T

const rawUserId: number = userId as Unbrand<UserId>
console.log(rawUserId)  // 1001

// 或者直接用类型断言
const rawOrderId = orderId as number

// ── 实用场景：URL 路径 ──
type AbsoluteURL = Brand<string, 'AbsoluteURL'>
type RelativeURL = Brand<string, 'RelativeURL'>

function isAbsoluteURL(url: string): url is AbsoluteURL {
  return /^https?:\\/\\//.test(url)
}

function resolveURL(base: AbsoluteURL, path: RelativeURL): AbsoluteURL {
  return (base.replace(/\\/$/, '') + '/' + path.replace(/^\\//, '')) as AbsoluteURL
}

const base = 'https://example.com' as AbsoluteURL
const path = '/api/users' as RelativeURL
const fullUrl = resolveURL(base, path)
console.log(fullUrl)  // https://example.com/api/users

console.log('品牌类型演示完成')
`), language: 'typescript',
    principle: 'TypeScript 默认是结构化类型系统，但通过品牌类型（Branded Types）可以模拟名义类型，让结构相同但语义不同的类型（如 UserId 和 OrderId）不能互相赋值，提升类型安全。',
    flow: ['使用交叉类型 & { readonly __brand: \'TypeName\' } 创建品牌类型', '通过类型断言或构造函数创建品牌类型的值', '函数参数使用品牌类型，传参时自动校验身份'],
    notes: ['品牌类型在运行时没有额外开销', '__brand 是约定俗成的属性名，也可以用 symbol', '适合 ID、金额、邮箱等有业务语义的原始类型'],
    problem: '解决"结构相同但语义不同的类型无法区分、传参错误难以发现"的问题。',
  },
{
    id: 'T_20', title: '可辨识联合类型与穷尽性检查', navTitle: '可辨识联合', category: '类型进阶',
    path: '/typescript/t-20/discriminated-union', summary: '通过共同的判别属性区分联合类型成员，配合穷尽性检查安全处理所有分支。',
    demo: T20DiscriminatedUnion, code: () => Promise.resolve(`// 可辨识联合类型：通过判别属性区分联合成员，配合穷尽性检查

// ── 基础可辨识联合 ──
// 每个接口都有一个相同名字的字面量类型属性（判别属性）

interface Circle {
  kind: 'circle'  // 判别属性：字面量类型
  radius: number
}

interface Square {
  kind: 'square'  // 判别属性
  side: number
}

interface Rectangle {
  kind: 'rectangle'  // 判别属性
  width: number
  height: number
}

// 组成联合类型
type Shape = Circle | Square | Rectangle

// 根据判别属性收窄类型
function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      // shape 收窄为 Circle
      return Math.PI * shape.radius ** 2
    case 'square':
      // shape 收窄为 Square
      return shape.side ** 2
    case 'rectangle':
      // shape 收窄为 Rectangle
      return shape.width * shape.height
  }
}

const circle: Shape = { kind: 'circle', radius: 5 }
const square: Shape = { kind: 'square', side: 4 }
console.log(getArea(circle))  // 78.5398...
console.log(getArea(square))  // 16

// ── 穷尽性检查：never 类型 ──
// 在 default 分支中赋值给 never 类型，新增成员时编译期报错

function getAreaExhaustive(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'square':
      return shape.side ** 2
    case 'rectangle':
      return shape.width * shape.height
    default:
      // 如果有遗漏的 case，这里会编译报错
      // 因为 shape 不可能是 never
      const _exhaustiveCheck: never = shape
      return _exhaustiveCheck
  }
}

// 新增 Triangle 类型后，上面的函数会编译报错，提醒补充 case
// interface Triangle {
//   kind: 'triangle'
//   base: number
//   height: number
// }
// type Shape2 = Shape | Triangle  // 新增后 getAreaExhaustive 会报错

// ── 实用场景：订单状态机 ──

interface PendingOrder {
  status: 'pending'
  orderId: string
  createTime: number
}

interface PaidOrder {
  status: 'paid'
  orderId: string
  paidTime: number
  payMethod: 'alipay' | 'wechat' | 'card'
}

interface ShippedOrder {
  status: 'shipped'
  orderId: string
  shippedTime: number
  trackingNo: string
}

interface CompletedOrder {
  status: 'completed'
  orderId: string
  completedTime: number
}

interface CancelledOrder {
  status: 'cancelled'
  orderId: string
  cancelReason: string
  cancelTime: number
}

type Order = PendingOrder | PaidOrder | ShippedOrder | CompletedOrder | CancelledOrder

// 处理不同状态的订单
function processOrder(order: Order): string {
  switch (order.status) {
    case 'pending':
      return \`订单 \${order.orderId} 待支付，创建于 \${order.createTime}\`
    case 'paid':
      return \`订单 \${order.orderId} 已支付，支付方式：\${order.payMethod}\`
    case 'shipped':
      return \`订单 \${order.orderId} 已发货，物流单号：\${order.trackingNo}\`
    case 'completed':
      return \`订单 \${order.orderId} 已完成\`
    case 'cancelled':
      return \`订单 \${order.orderId} 已取消，原因：\${order.cancelReason}\`
    default:
      const _exhaustive: never = order
      return _exhaustive
  }
}

const order: Order = {
  status: 'paid',
  orderId: 'ORD-001',
  paidTime: Date.now(),
  payMethod: 'alipay',
}
console.log(processOrder(order))

// ── 实用场景：消息/事件类型 ──

interface TextMessage {
  type: 'text'
  content: string
}

interface ImageMessage {
  type: 'image'
  url: string
  width: number
  height: number
}

interface VoiceMessage {
  type: 'voice'
  url: string
  duration: number
}

type Message = TextMessage | ImageMessage | VoiceMessage

function renderMessage(msg: Message): string {
  switch (msg.type) {
    case 'text':
      return \`[文本] \${msg.content}\`
    case 'image':
      return \`[图片] \${msg.url} (\${msg.width}x\${msg.height})\`
    case 'voice':
      return \`[语音] \${msg.url} (\${msg.duration}秒)\`
  }
}

// ── 用 if/in 收窄 ──
// 不只是 switch，if 结合 in 操作符也可以收窄

function getShapeInfo(shape: Shape): string {
  if ('radius' in shape) {
    // 有 radius 属性 → Circle
    return \`圆形，半径 \${shape.radius}\`
  } else if ('side' in shape) {
    // 有 side 属性 → Square
    return \`正方形，边长 \${shape.side}\`
  } else {
    // 剩下的就是 Rectangle
    return \`长方形，宽 \${shape.width}，高 \${shape.height}\`
  }
}

// ── 可辨识联合 + 类型守卫 ──

function isCircle(shape: Shape): shape is Circle {
  return shape.kind === 'circle'
}

const shapes: Shape[] = [
  { kind: 'circle', radius: 3 },
  { kind: 'square', side: 2 },
  { kind: 'circle', radius: 5 },
]

// 过滤出所有圆形
const circles = shapes.filter(isCircle)
// circles 类型为 Circle[]

console.log('可辨识联合演示完成')
`), language: 'typescript',
    principle: '可辨识联合（Discriminated Union）通过一个共同的字面量类型属性（tag）区分联合类型的成员，配合类型收窄和穷尽性检查，可以安全地处理所有可能的分支，避免遗漏或错误处理某一类输入。',
    flow: ['为每种状态定义接口，添加相同名字的判别属性（如 type、kind）。', '将所有状态类型组成联合类型作为函数参数或状态字段。', '在 switch/case 中根据判别属性收窄类型，并在 default 分支做穷尽性检查。'],
    notes: ['判别属性应该是字面量类型（string/number literal），便于 TypeScript 区分。', 'default 分支用 never 类型做穷尽性检查，新增状态时编译期会报错。', '适合状态机、订单状态、消息类型、API 响应等场景。'],
    problem: '解决"联合类型分支处理不全、新增状态时无法被静态发现"的问题。',
  },
{
    id: 'T_21', title: 'infer 关键字与类型推断', navTitle: 'infer 关键字', category: '类型进阶',
    path: '/typescript/t-21/infer-keyword', summary: '在条件类型中使用 infer 声明待推断的类型变量，从上下文提取函数返回类型、参数类型等。',
    demo: T21InferKeyword, code: () => Promise.resolve(`// infer 关键字：在条件类型中声明待推断的类型变量

// ── infer 基础：提取函数返回类型 ──
// 经典的 ReturnType 实现

type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never

function greet(name: string): string {
  return \`Hello, \${name}!\`
}

type GreetReturn = MyReturnType<typeof greet>  // string

function sum(a: number, b: number): number {
  return a + b
}

type SumReturn = MyReturnType<typeof sum>  // number

// ── 提取函数参数类型 ──
// Parameters 的实现

type MyParameters<T> = T extends (...args: infer P) => any ? P : never

type GreetParams = MyParameters<typeof greet>  // [name: string]
type SumParams = MyParameters<typeof sum>      // [a: number, b: number]

// 提取第一个参数
type FirstParam<T> = T extends (first: infer F, ...rest: any[]) => any ? F : never

type GreetFirst = FirstParam<typeof greet>  // string
type SumFirst = FirstParam<typeof sum>      // number

// ── 提取 Promise 内部类型 ──

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

type StrPromise = Promise<string>
type UnwrappedStr = UnwrapPromise<StrPromise>  // string

type NumPromise = Promise<number>
type UnwrappedNum = UnwrapPromise<NumPromise>  // number

// 普通类型直接返回
type JustNumber = UnwrapPromise<number>  // number

// ── 递归解包嵌套 Promise ──

type DeepUnwrapPromise<T> = T extends Promise<infer U> ? DeepUnwrapPromise<U> : T

type Nested = Promise<Promise<Promise<string>>>
type DeepUnwrapped = DeepUnwrapPromise<Nested>  // string

// ── 提取数组元素类型 ──

type ArrayElement<T> = T extends (infer E)[] ? E : never

type StringArray = string[]
type StrEl = ArrayElement<StringArray>  // string

type NumberArray = number[]
type NumEl = ArrayElement<NumberArray>  // number

// 也可以用 T extends Array<infer E>
type ArrayElement2<T> = T extends Array<infer E> ? E : never

// ── 提取对象属性类型 ──
// 从对象类型中提取特定类型的属性键

type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]

interface Person {
  name: string
  age: number
  email: string
  active: boolean
}

type StringKeys = KeysOfType<Person, string>    // 'name' | 'email'
type NumberKeys = KeysOfType<Person, number>    // 'age'
type BooleanKeys = KeysOfType<Person, boolean>  // 'active'

// ── 提取构造函数的实例类型 ──
// InstanceType 的实现

type MyInstanceType<T> = T extends new (...args: any[]) => infer I ? I : never

class User {
  constructor(public id: number, public name: string) {}
}

type UserInstance = MyInstanceType<typeof User>  // User

const user: UserInstance = new User(1, 'Tom')

// ── 提取构造函数参数类型 ──
// ConstructorParameters 的实现

type MyConstructorParameters<T> = T extends new (...args: infer P) => any ? P : never

type UserCtorParams = MyConstructorParameters<typeof User>  // [id: number, name: string]

// ── 模板字面量类型中的 infer ──
// 从字符串类型中提取子串

type GetPrefix<T extends string> = T extends \`\${infer P}:\${string}\` ? P : never

type Event1 = 'click:button'
type Event2 = 'hover:card'

type Prefix1 = GetPrefix<Event1>  // 'click'
type Prefix2 = GetPrefix<Event2>  // 'hover'

// 提取文件名和扩展名
type SplitExt<T extends string> = T extends \`\${infer Name}.\${infer Ext}\` ? [Name, Ext] : never

type File1 = 'document.pdf'
type File2 = 'image.png'

type Split1 = SplitExt<File1>  // ['document', 'pdf']
type Split2 = SplitExt<File2>  // ['image', 'png']

// ── 多个 infer 变量 ──
// 同一位置可以有多个 infer 变量

type SwapTuple<T> = T extends [infer A, infer B] ? [B, A] : T

type Pair = [string, number]
type Swapped = SwapTuple<Pair>  // [number, string]

// ── 函数重载的 infer ──
// 注意：infer 对重载函数取最后一个签名

function overloaded(x: number): number
function overloaded(x: string): string
function overloaded(x: any) {
  return x
}

// 取最后一个签名的返回类型
type OverloadedReturn = MyReturnType<typeof overloaded>  // string

// ── 实用工具：获取函数 this 类型 ──

type ThisParameterType<T> = T extends (this: infer U, ...args: any[]) => any ? U : unknown

function greetUser(this: { name: string }, greeting: string) {
  return \`\${greeting}, I'm \${this.name}\`
}

type ThisType = ThisParameterType<typeof greetUser>  // { name: string }

console.log('infer 关键字演示完成')
`), language: 'typescript',
    principle: 'infer 关键字在条件类型中声明一个待推断的类型变量，让 TypeScript 从上下文推断出类型，常用于提取函数返回类型、参数类型、Promise 内部类型等。',
    flow: ['在条件类型的 extends 子句中使用 infer 声明类型变量', 'TypeScript 根据实际类型推断 infer 变量的值', '在条件为 true 的分支中使用推断出的类型'],
    notes: ['ReturnType、Parameters 等工具类型内部都用 infer 实现', 'infer 只能在条件类型中使用', '同一位置可以有多个 infer 变量'],
    problem: '解决"需要从已有类型中提取部分类型但无法直接访问"的问题。',
  },
{
    id: 'T_22', title: '递归类型与深嵌套对象', navTitle: '递归类型', category: '类型进阶',
    path: '/typescript/t-22/recursive-types', summary: '利用递归类型描述树形结构和深嵌套对象，实现 DeepReadonly、DeepPartial 等深度转换。',
    demo: T22RecursiveTypes, code: () => Promise.resolve(`// 递归类型：描述树形结构和深嵌套对象

// ── 树形结构 ──
// 递归类型最常用于描述树、JSON 等嵌套结构

interface TreeNode {
  value: string
  children: TreeNode[]  // 递归引用自身
}

const tree: TreeNode = {
  value: 'root',
  children: [
    {
      value: 'child-1',
      children: [
        { value: 'grandchild-1-1', children: [] },
        { value: 'grandchild-1-2', children: [] },
      ],
    },
    {
      value: 'child-2',
      children: [
        { value: 'grandchild-2-1', children: [] },
      ],
    },
  ],
}

// 遍历树
function traverse(node: TreeNode, depth = 0): void {
  console.log(' '.repeat(depth * 2) + node.value)
  node.children.forEach(child => traverse(child, depth + 1))
}

// ── DeepReadonly：深度只读 ──
// 递归地将对象所有属性变为只读

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends Function
      ? T[K]  // 函数保持不变
      : DeepReadonly<T[K]>
    : T[K]
}

interface NestedConfig {
  app: {
    name: string
    version: string
    settings: {
      debug: boolean
      theme: 'light' | 'dark'
      features: {
        auth: boolean
        analytics: boolean
      }
    }
  }
  server: {
    port: number
    host: string
  }
}

type ReadonlyConfig = DeepReadonly<NestedConfig>

const config: ReadonlyConfig = {
  app: {
    name: 'MyApp',
    version: '1.0.0',
    settings: {
      debug: false,
      theme: 'light',
      features: {
        auth: true,
        analytics: true,
      },
    },
  },
  server: {
    port: 3000,
    host: 'localhost',
  },
}

// config.app.name = 'NewApp'  // 错误：只读属性
// config.app.settings.theme = 'dark'  // 错误：只读属性

// ── DeepPartial：深度可选 ──
// 递归地将对象所有属性变为可选

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : DeepPartial<T[K]>
    : T[K]
}

// 深度更新配置
function updateConfig(
  target: NestedConfig,
  patch: DeepPartial<NestedConfig>
): NestedConfig {
  return {
    ...target,
    app: {
      ...target.app,
      ...patch.app,
      settings: {
        ...target.app.settings,
        ...patch.app?.settings,
        features: {
          ...target.app.settings.features,
          ...patch.app?.settings?.features,
        },
      },
    },
    server: {
      ...target.server,
      ...patch.server,
    },
  }
}

const updated = updateConfig(config as NestedConfig, {
  app: {
    settings: {
      theme: 'dark',
      features: {
        analytics: false,
      },
    },
  },
})

// ── DeepRequired：深度必填 ──
// 递归地将所有可选属性变为必填

type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : DeepRequired<T[K]>
    : T[K]
}

interface PartialData {
  id?: number
  info?: {
    name?: string
    address?: {
      city?: string
      street?: string
    }
  }
}

type FullData = DeepRequired<PartialData>

const fullData: FullData = {
  id: 1,
  info: {
    name: '张三',
    address: {
      city: '北京',
      street: '长安街',
    },
  },
}

// ── 递归类型与 JSON ──
// 描述任意 JSON 值的类型

type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue }

const jsonData: JSONValue = {
  name: 'Test',
  values: [1, 2, 3],
  nested: {
    a: true,
    b: null,
    c: ['x', 'y'],
  },
}

// ── 递归类型与目录树 ──

type FileNode = {
  type: 'file'
  name: string
  size: number
}

type DirectoryNode = {
  type: 'directory'
  name: string
  children: FileSystemNode[]
}

type FileSystemNode = FileNode | DirectoryNode

const fileSystem: DirectoryNode = {
  type: 'directory',
  name: 'src',
  children: [
    { type: 'file', name: 'index.ts', size: 1024 },
    {
      type: 'directory',
      name: 'components',
      children: [
        { type: 'file', name: 'Button.tsx', size: 2048 },
        { type: 'file', name: 'Input.tsx', size: 1536 },
      ],
    },
    {
      type: 'directory',
      name: 'utils',
      children: [
        { type: 'file', name: 'helpers.ts', size: 512 },
      ],
    },
  ],
}

// 统计目录大小
function getTotalSize(node: FileSystemNode): number {
  if (node.type === 'file') {
    return node.size
  }
  return node.children.reduce((sum, child) => sum + getTotalSize(child), 0)
}

console.log(getTotalSize(fileSystem))  // 5120

// ── 递归条件类型：扁平化数组 ──

type FlatArray<T> = T extends (infer U)[]
  ? U extends any[]
    ? FlatArray<U>
    : U
  : T

type NestedArray = number[][][]  // [[[1]]]
type Flattened = FlatArray<NestedArray>  // number

// ── 类型级别的字符串反转 ──

type ReverseString<S extends string> = S extends \`\${infer First}\${infer Rest}\`
  ? \`\${ReverseString<Rest>}\${First}\`
  : S

type Hello = 'hello'
type Olleh = ReverseString<Hello>  // 'olleh'

console.log('递归类型演示完成')
`), language: 'typescript',
    principle: '递归类型是在类型定义中引用自身的类型，常用于描述树形结构、深嵌套对象（如 DeepReadonly、DeepPartial），TypeScript 4.1+ 对递归类型有更好的支持。',
    flow: ['定义接口或类型别名时在内部引用自身', '配合条件类型和映射类型实现深度转换', '用递归类型描述目录树、JSON 等嵌套结构'],
    notes: ['递归类型要注意终止条件，避免无限递归', '深度映射类型可以统一处理嵌套对象', 'TypeScript 有递归深度限制，过深会报错'],
    problem: '解决"嵌套结构类型描述复杂、深度转换需要逐层手写"的问题。',
  },
{
    id: 'T_23', title: '类型级编程与类型体操', navTitle: '类型级编程', category: '类型进阶',
    path: '/typescript/t-23/type-level-programming', summary: '利用条件类型、映射类型、模板字面量类型等在类型层面实现计算和逻辑。',
    demo: T23TypeLevelProgramming, code: () => Promise.resolve(`// 类型级编程：在类型层面实现计算和逻辑

// ── 类型级条件判断 ──
// 条件类型就是类型层面的 if-else

type If<C extends boolean, T, F> = C extends true ? T : F

type A = If<true, string, number>   // string
type B = If<false, string, number>  // number

// 比较大小（通过元组长度）
type SmallerThan<
  A extends number,
  B extends number,
  Count extends any[] = []
> = Count['length'] extends A
  ? true
  : Count['length'] extends B
    ? false
    : SmallerThan<A, B, [...Count, 0]>

type S1 = SmallerThan<3, 5>  // true
type S2 = SmallerThan<5, 3>  // false
type S3 = SmallerThan<5, 5>  // false

// ── 类型级循环：递归 ──
// 用递归实现类型层面的循环

// 重复字符串类型
type RepeatString<
  S extends string,
  N extends number,
  Count extends any[] = [],
  Result extends string = ''
> = Count['length'] extends N
  ? Result
  : RepeatString<S, N, [...Count, 0], \`\${Result}\${S}\`>

type Hello3 = RepeatString<'hello', 3>  // 'hellohellohello'
type Dash5 = RepeatString<'-', 5>        // '-----'

// ── 元组操作 ──
// 类型层面的元组操作

// 元组长度
type Length<T extends any[]> = T['length']

type L1 = Length<[1, 2, 3]>  // 3
type L2 = Length<[]>          // 0

// 元组头部
type Head<T extends any[]> = T extends [infer H, ...infer _] ? H : never

type H1 = Head<[string, number, boolean]>  // string

// 元组尾部
type Tail<T extends any[]> = T extends [infer _, ...infer R] ? R : never

type T1 = Tail<[string, number, boolean]>  // [number, boolean]

// 元组拼接
type Concat<A extends any[], B extends any[]> = [...A, ...B]

type C1 = Concat<[1, 2], [3, 4]>  // [1, 2, 3, 4]

// ── 类型级 Fibonacci ──
// 通过元组长度实现斐波那契

type Fibonacci<
  N extends number,
  Prev extends any[] = [],
  Curr extends any[] = [0],
  Index extends any[] = [0]
> = Index['length'] extends N
  ? Curr['length']
  : Fibonacci<N, Curr, [...Prev, ...Curr], [...Index, 0]>

type F0 = Fibonacci<0>  // 1
type F1 = Fibonacci<1>  // 1
type F2 = Fibonacci<2>  // 2
type F3 = Fibonacci<3>  // 3
type F5 = Fibonacci<5>  // 8
type F7 = Fibonacci<7>  // 21

// ── 字符串操作：类型级 trim ──

// 去除左侧空格
type TrimLeft<S extends string> = S extends \` \${infer R}\` ? TrimLeft<R> : S

type TL1 = TrimLeft<'  hello'>  // 'hello'

// 去除右侧空格
type TrimRight<S extends string> = S extends \`\${infer L} \` ? TrimRight<L> : S

type TR1 = TrimRight<'hello  '>  // 'hello'

// 去除两侧空格
type Trim<S extends string> = TrimLeft<TrimRight<S>>

type TTrim = Trim<'  hello world  '>  // 'hello world'

// ── 字符串转大写下划线 ──

type KebabCase<S extends string> = S extends \`\${infer First}\${infer Rest}\`
  ? First extends Uppercase<First>
    ? First extends Lowercase<First>
      ? \`\${First}\${KebabCase<Rest>}\`
      : \`-\${Lowercase<First>}\${KebabCase<Rest>}\`
    : \`\${First}\${KebabCase<Rest>}\`
  : S

type Kebab1 = KebabCase<'HelloWorld'>    // '-hello-world'
type Kebab2 = KebabCase<'getUserName'>   // 'get-user-name'

// 驼峰转下划线
type SnakeCase<S extends string> = S extends \`\${infer First}\${infer Rest}\`
  ? First extends Uppercase<First>
    ? First extends Lowercase<First>
      ? \`\${First}\${SnakeCase<Rest>}\`
      : \`_\${Lowercase<First>}\${SnakeCase<Rest>}\`
    : \`\${First}\${SnakeCase<Rest>}\`
  : S

type Snake1 = SnakeCase<'HelloWorld'>    // '_hello_world'
type Snake2 = SnakeCase<'getUserName'>   // 'get_user_name'

// ── 对象键转换 ──
// 将对象的所有键转换为指定格式

type DeepKebabKeys<T> = T extends object
  ? {
      [K in keyof T as KebabCase<string & K>]: DeepKebabKeys<T[K]>
    }
  : T

interface UserSettings {
  userName: string
  avatarUrl: string
  notificationSettings: {
    emailNotification: boolean
    pushNotification: boolean
    smsNotification: boolean
  }
}

type KebabSettings = DeepKebabKeys<UserSettings>
// {
//   'user-name': string
//   'avatar-url': string
//   'notification-settings': {
//     'email-notification': boolean
//     'push-notification': boolean
//     'sms-notification': boolean
//   }
// }

// ── 类型级 ParseInt ──
// 字符串数字转数字类型

type ParseInt<S extends string, Acc extends any[] = []> = S extends \`\${Acc['length']}\`
  ? Acc['length']
  : ParseInt<S, [...Acc, 0]>

type P1 = ParseInt<'5'>   // 5
type P2 = ParseInt<'10'>  // 10（受递归深度限制，大数可能不行）

// ── 联合类型转交叉类型 ──

type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never

type U2I = UnionToIntersection<{ a: 1 } | { b: 2 }>  // { a: 1 } & { b: 2 }

// ── 获取联合类型的最后一个成员 ──

type LastOf<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => infer R
    ? R
    : never

type Last = LastOf<'a' | 'b' | 'c'>  // 'c'

// ── 联合类型转元组 ──

type UnionToTuple<T, L = LastOf<T>, N = [T] extends [never] ? true : false> =
  true extends N
    ? []
    : [...UnionToTuple<Exclude<T, L>>, L]

type UTT = UnionToTuple<'a' | 'b' | 'c'>  // ['a', 'b', 'c']

console.log('类型级编程演示完成')
`), language: 'typescript',
    principle: '类型级编程利用 TypeScript 的条件类型、映射类型、模板字面量类型、递归类型等能力，在类型层面实现计算和逻辑，让类型系统表达更丰富的约束和推导。',
    flow: ['使用条件类型实现类型层面的 if-else', '用映射类型遍历键并转换值类型', '结合模板字面量类型操作字符串类型'],
    notes: ['类型体操是手段不是目的，优先考虑可读性', '业务代码中适度使用，库代码可以更激进', '复杂类型建议加注释说明意图'],
    problem: '解决"类型系统表达能力不足、需要运行时校验才能保证安全"的问题。',
  },
{
    id: 'T_24', title: '异步返回类型与 Awaited', navTitle: '异步返回类型', category: '类型进阶',
    path: '/typescript/t-24/async-return-type', summary: '使用 Awaited 解包 Promise 嵌套，精确获取异步函数的返回值类型。',
    demo: T24AsyncReturnType, code: () => Promise.resolve(`// 异步返回类型与 Awaited：解包 Promise，获取异步函数返回值类型

// ── Awaited 基础用法 ──
// Awaited<T> 用于解包 Promise 类型

type StringPromise = Promise<string>
type UnwrappedString = Awaited<StringPromise>  // string

type NumberPromise = Promise<number>
type UnwrappedNumber = Awaited<NumberPromise>  // number

// 普通类型不变
type PlainType = Awaited<string>  // string

// ── 递归解包嵌套 Promise ──
// Awaited 会递归解包嵌套的 Promise

type NestedPromise = Promise<Promise<Promise<boolean>>>
type DeepUnwrapped = Awaited<NestedPromise>  // boolean

type DoublePromise = Promise<Promise<number[]>>
type UnwrappedArray = Awaited<DoublePromise>  // number[]

// ── 获取异步函数的返回类型 ──
// 组合 Awaited + ReturnType

async function fetchUser(id: number) {
  return {
    id,
    name: '用户' + id,
    email: \`user\${id}@example.com\`,
  }
}

// ReturnType 得到的是 Promise<User>
type FetchUserPromise = ReturnType<typeof fetchUser>
// Promise<{ id: number; name: string; email: string }>

// 用 Awaited 解包得到实际返回值类型
type FetchUserResult = Awaited<ReturnType<typeof fetchUser>>
// { id: number; name: string; email: string }

// ── 实用类型：AsyncReturnType ──
// 封装一个便捷的工具类型

type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<T>>

type UserResult = AsyncReturnType<typeof fetchUser>
// { id: number; name: string; email: string }

// ── Promise.all 的返回类型 ──
// 处理多个 Promise 并发

async function getUser() {
  return { id: 1, name: 'Tom' }
}

async function getOrders() {
  return [{ id: 'O001', total: 99 }]
}

async function getDashboardData() {
  const [user, orders] = await Promise.all([getUser(), getOrders()])
  return { user, orders }
}

type DashboardData = AsyncReturnType<typeof getDashboardData>
// {
//   user: { id: number; name: string }
//   orders: { id: string; total: number }[]
// }

// ── Promise.allSettled 的返回类型 ──

async function mightFail(flag: boolean): Promise<string> {
  if (flag) return 'success'
  throw new Error('failed')
}

async function runAllSettled() {
  const results = await Promise.allSettled([
    mightFail(true),
    mightFail(false),
  ])
  return results
}

type SettledResults = AsyncReturnType<typeof runAllSettled>
// PromiseSettledResult<string>[]
// 其中每个元素是：
// - PromiseFulfilledResult<string>  { status: 'fulfilled'; value: string }
// - PromiseRejectedResult           { status: 'rejected'; reason: any }

// ── Promise.race 的返回类型 ──

async function fastResponse() {
  return 'fast'
}

async function slowResponse() {
  return 'slow'
}

async function raceDemo() {
  return await Promise.race([fastResponse(), slowResponse()])
}

type RaceResult = AsyncReturnType<typeof raceDemo>  // string

// ── try/catch 中的错误类型 ──
// catch 中的 error 默认是 unknown

async function safeFetch(url: string): Promise<{ data: string } | null> {
  try {
    const response = await fetch(url)
    const data = await response.json()
    return { data }
  } catch (error) {
    // error 类型为 unknown，需要类型守卫
    if (error instanceof Error) {
      console.error('请求失败:', error.message)
    }
    return null
  }
}

// ── 自定义 Awaited 实现 ──
// 理解 Awaited 的工作原理

type MyAwaited<T> = T extends Promise<infer U>
  ? U extends Promise<any>
    ? MyAwaited<U>
    : U
  : T

// 测试
type Test1 = MyAwaited<Promise<string>>           // string
type Test2 = MyAwaited<Promise<Promise<number>>>  // number
type Test3 = MyAwaited<boolean>                    // boolean

// ── 带 then 的对象（thenable） ──
// Awaited 也能处理有 then 方法的对象

type Thenable<T> = { then: (onfulfilled: (value: T) => any) => any }

type ThenableString = Thenable<string>
type UnwrappedThenable = Awaited<ThenableString>  // string

// ── 实用场景：API 响应封装 ──

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

async function request<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url)
  return res.json()
}

async function getCourses() {
  const res = await request<{ id: number; title: string }[]>('/api/courses')
  return res.data
}

type CourseList = AsyncReturnType<typeof getCourses>
// { id: number; title: string }[]

// ── 延迟类型：模拟 sleep ──

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function delayedGreet(name: string) {
  await sleep(1000)
  return \`Hello, \${name}!\`
}

type DelayedResult = AsyncReturnType<typeof delayedGreet>  // string

console.log('异步返回类型演示完成')
`), language: 'typescript',
    principle: 'TypeScript 的 Awaited 工具类型用于解包 Promise 嵌套，获取最终的 resolve 值类型，配合 ReturnType 等可以精确获取异步函数的返回值类型。',
    flow: ['使用 Awaited<T> 解包 Promise 类型', 'ReturnType<typeof fn> 获取函数返回类型', '组合 Awaited<ReturnType<typeof fn>> 获取异步函数 resolve 类型'],
    notes: ['Awaited 会递归解包嵌套的 Promise', 'async 函数返回值自动包装为 Promise', '处理 Promise.all 等并发组合时很有用'],
    problem: '解决"Promise 嵌套类型难以解包、异步函数返回值类型不清晰"的问题。',
  }
]

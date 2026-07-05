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
const T08Code = createCodeLoader('T08VueTyping.vue')
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
const T16Code = createCodeLoader('T16CompilerOptions.vue')
const T17DeclarationFiles = createDemo('T17DeclarationFiles')
const T17Code = createCodeLoader('T17DeclarationFiles.vue')
const T18Namespace = createDemo('T18Namespace')
const T18Code = createCodeLoader('T18Namespace.vue')
const T19BrandedTypes = createDemo('T19BrandedTypes')
const T19Code = createCodeLoader('T19BrandedTypes.vue')
const T20DiscriminatedUnion = createDemo('T20DiscriminatedUnion')
const T20Code = createCodeLoader('T20DiscriminatedUnion.vue')
const T21InferKeyword = createDemo('T21InferKeyword')
const T21Code = createCodeLoader('T21InferKeyword.vue')
const T22RecursiveTypes = createDemo('T22RecursiveTypes')
const T22Code = createCodeLoader('T22RecursiveTypes.vue')
const T23TypeLevelProgramming = createDemo('T23TypeLevelProgramming')
const T23Code = createCodeLoader('T23TypeLevelProgramming.vue')
const T24AsyncReturnType = createDemo('T24AsyncReturnType')
const T24Code = createCodeLoader('T24AsyncReturnType.vue')


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
    demo: T08VueTyping, code: T08Code, language: 'vue',
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
    demo: T16CompilerOptions, code: T16Code, language: 'vue',
    principle: 'tsconfig.json 控制 TypeScript 编译行为；strict 系列决定类型安全等级，target 决定输出 JS 版本，module/moduleResolution 决定模块系统。',
    flow: ['从 strict: true 开始获得最严格的类型检查。', '根据运行环境选择 target 和 module。', '用 paths 和 baseUrl 配置模块别名。'],
    notes: ['新项目建议直接启用 strict。', 'moduleResolution 的 bundler 模式适合 Vite 项目。'],
    problem: '解决"tsconfig 选项太多，如何理解和配置核心编译选项"的问题。',
  },
{
    id: 'T_17', title: '声明文件与全局类型增强', navTitle: '声明文件', category: '类型进阶',
    path: '/typescript/t-17/declaration-files', summary: '掌握 .d.ts 声明文件的编写模式、全局增强和第三方库类型补充。',
    demo: T17DeclarationFiles, code: T17Code, language: 'vue',
    principle: '声明文件 (.d.ts) 为 JavaScript 代码提供类型信息；ambient 声明用 declare 关键字，全局增强通过 declare global，模块声明用 declare module。',
    flow: ['为无类型的 JS 库编写 declare module。', '用 declare global 扩展 Window 等全局对象。', '在项目中组织 .d.ts 文件的引用路径。'],
    notes: ['DefinitelyTyped 是社区维护的类型声明仓库。', '声明文件不包含实现代码。'],
    problem: '解决"如何为 JavaScript 库和全局环境补充 TypeScript 类型声明"的问题。',
  },
{
    id: 'T_18', title: '命名空间与模块模式对比', navTitle: '命名空间', category: '类型进阶',
    path: '/typescript/t-18/namespace', summary: '比较 namespace 与 ES Module 在类型组织中的差异和适用场景。',
    demo: T18Namespace, code: T18Code, language: 'vue',
    principle: 'namespace 是 TypeScript 早期的模块组织方式，支持声明合并；ES Module 是现代标准，两者不应混用。新项目应优先使用 ES Module。',
    flow: ['了解 namespace 的声明合并能力。', '对比 namespace 与 ES Module 的产物差异。', '确定项目中统一使用 ES Module。'],
    notes: ['namespace 主要存在于旧代码和声明文件中。', '不要在同一项目中混用 namespace 和 ES Module。'],
    problem: '解决"何时使用 namespace、何时使用 ES Module 来组织类型"的问题。',
  },
{
    id: 'T_19', title: '品牌类型(Branded Types)与名义类型', navTitle: '品牌类型', category: '类型进阶',
    path: '/typescript/t-19/branded-types', summary: '通过品牌类型模拟名义类型，让结构相同但语义不同的类型不能互相赋值。',
    demo: T19BrandedTypes, code: T19Code, language: 'vue',
    principle: 'TypeScript 默认是结构化类型系统，但通过品牌类型（Branded Types）可以模拟名义类型，让结构相同但语义不同的类型（如 UserId 和 OrderId）不能互相赋值，提升类型安全。',
    flow: ['使用交叉类型 & { readonly __brand: \'TypeName\' } 创建品牌类型', '通过类型断言或构造函数创建品牌类型的值', '函数参数使用品牌类型，传参时自动校验身份'],
    notes: ['品牌类型在运行时没有额外开销', '__brand 是约定俗成的属性名，也可以用 symbol', '适合 ID、金额、邮箱等有业务语义的原始类型'],
    problem: '解决结构相同但语义不同的类型无法区分、传参错误难以发现的问题。',
  },
{
    id: 'T_20', title: '可辨识联合类型与穷尽性检查', navTitle: '可辨识联合', category: '类型进阶',
    path: '/typescript/t-20/discriminated-union', summary: '通过共同的判别属性区分联合类型成员，配合穷尽性检查安全处理所有分支。',
    demo: T20DiscriminatedUnion, code: T20Code, language: 'vue',
    principle: '可辨识联合（Discriminated Union）通过一个共同的字面量类型属性（tag）区分联合类型的成员，配合类型收窄和穷尽性检查，可以安全地处理所有可能的分支，避免遗漏或错误处理某一类输入。',
    flow: ['为每种状态定义接口，添加相同名字的判别属性（如 type、kind）。', '将所有状态类型组成联合类型作为函数参数或状态字段。', '在 switch/case 中根据判别属性收窄类型，并在 default 分支做穷尽性检查。'],
    notes: ['判别属性应该是字面量类型（string/number literal），便于 TypeScript 区分。', 'default 分支用 never 类型做穷尽性检查，新增状态时编译期会报错。', '适合状态机、订单状态、消息类型、API 响应等场景。'],
    problem: '解决"联合类型分支处理不全、新增状态时无法被静态发现"的问题。',
  },
{
    id: 'T_21', title: 'infer 关键字与类型推断', navTitle: 'infer 关键字', category: '类型进阶',
    path: '/typescript/t-21/infer-keyword', summary: '在条件类型中使用 infer 声明待推断的类型变量，从上下文提取函数返回类型、参数类型等。',
    demo: T21InferKeyword, code: T21Code, language: 'vue',
    principle: 'infer 关键字在条件类型中声明一个待推断的类型变量，让 TypeScript 从上下文推断出类型，常用于提取函数返回类型、参数类型、Promise 内部类型等。',
    flow: ['在条件类型的 extends 子句中使用 infer 声明类型变量', 'TypeScript 根据实际类型推断 infer 变量的值', '在条件为 true 的分支中使用推断出的类型'],
    notes: ['ReturnType、Parameters 等工具类型内部都用 infer 实现', 'infer 只能在条件类型中使用', '同一位置可以有多个 infer 变量'],
    problem: '解决需要从已有类型中提取部分类型但无法直接访问的问题。',
  },
{
    id: 'T_22', title: '递归类型与深嵌套对象', navTitle: '递归类型', category: '类型进阶',
    path: '/typescript/t-22/recursive-types', summary: '利用递归类型描述树形结构和深嵌套对象，实现 DeepReadonly、DeepPartial 等深度转换。',
    demo: T22RecursiveTypes, code: T22Code, language: 'vue',
    principle: '递归类型是在类型定义中引用自身的类型，常用于描述树形结构、深嵌套对象（如 DeepReadonly、DeepPartial），TypeScript 4.1+ 对递归类型有更好的支持。',
    flow: ['定义接口或类型别名时在内部引用自身', '配合条件类型和映射类型实现深度转换', '用递归类型描述目录树、JSON 等嵌套结构'],
    notes: ['递归类型要注意终止条件，避免无限递归', '深度映射类型可以统一处理嵌套对象', 'TypeScript 有递归深度限制，过深会报错'],
    problem: '解决嵌套结构类型描述复杂、深度转换需要逐层手写的问题。',
  },
{
    id: 'T_23', title: '类型级编程与类型体操', navTitle: '类型级编程', category: '类型进阶',
    path: '/typescript/t-23/type-level-programming', summary: '利用条件类型、映射类型、模板字面量类型等在类型层面实现计算和逻辑。',
    demo: T23TypeLevelProgramming, code: T23Code, language: 'vue',
    principle: '类型级编程利用 TypeScript 的条件类型、映射类型、模板字面量类型、递归类型等能力，在类型层面实现计算和逻辑，让类型系统表达更丰富的约束和推导。',
    flow: ['使用条件类型实现类型层面的 if-else', '用映射类型遍历键并转换值类型', '结合模板字面量类型操作字符串类型'],
    notes: ['类型体操是手段不是目的，优先考虑可读性', '业务代码中适度使用，库代码可以更激进', '复杂类型建议加注释说明意图'],
    problem: '解决类型系统表达能力不足、需要运行时校验才能保证安全的问题。',
  },
{
    id: 'T_24', title: '异步返回类型与 Awaited', navTitle: '异步返回类型', category: '类型进阶',
    path: '/typescript/t-24/async-return-type', summary: '使用 Awaited 解包 Promise 嵌套，精确获取异步函数的返回值类型。',
    demo: T24AsyncReturnType, code: T24Code, language: 'vue',
    principle: 'TypeScript 的 Awaited 工具类型用于解包 Promise 嵌套，获取最终的 resolve 值类型，配合 ReturnType 等可以精确获取异步函数的返回值类型。',
    flow: ['使用 Awaited<T> 解包 Promise 类型', 'ReturnType<typeof fn> 获取函数返回类型', '组合 Awaited<ReturnType<typeof fn>> 获取异步函数 resolve 类型'],
    notes: ['Awaited 会递归解包嵌套的 Promise', 'async 函数返回值自动包装为 Promise', '处理 Promise.all 等并发组合时很有用'],
    problem: '解决 Promise 嵌套类型难以解包、异步函数返回值类型不清晰的问题。',
  }
]

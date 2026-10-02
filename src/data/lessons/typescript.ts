import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'
import { restoreCodeSource } from '../code-restore'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })
const vueCodeModules = import.meta.glob<string>('../../demos/*.vue', { query: '?raw', import: 'default' })
const jsxCodeModules = import.meta.glob<string>('../../demos/react-jsx/*.jsx', { query: '?raw', import: 'default' })
const stateCodeModules = import.meta.glob<string>('../../demos/state-react/*.js', { query: '?raw', import: 'default' })
const jsCodeModules = import.meta.glob<string>('../../demos/js-code/*.js', { query: '?raw', import: 'default' })
const tsCodeModules = import.meta.glob<string>('../../demos/ts-code/*.ts', { query: '?raw', import: 'default' })
const styleCodeModules = import.meta.glob<string>('../../demos/style-code/*', { query: '?raw', import: 'default' })
const typescriptCodeModules = import.meta.glob<string>('../../demos/typescript-code/*', { query: '?raw', import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到内容组件：${name}`)
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
            : path.startsWith('typescript-code/')
              ? typescriptCodeModules
            : vueCodeModules
  const loader = modules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到内容源码：${path}`)
  return () => loader().then(restoreCodeSource)
}

const T01TypeInference = createDemo('T01TypeInferenceArticle')
const T01Code = createCodeLoader('ts-code/T01TypeInference.ts')
const T02UnionNarrowing = createDemo('T02UnionNarrowingArticle')
const T02Code = createCodeLoader('ts-code/T02UnionNarrowing.ts')
const T03ObjectModeling = createDemo('T03ObjectModelingArticle')
const T03Code = createCodeLoader('ts-code/T03ObjectModeling.ts')
const T04Generics = createDemo('T04GenericsArticle')
const T04Code = createCodeLoader('ts-code/T04Generics.ts')
const T05Keyof = createDemo('T05KeyofArticle')
const T05Code = createCodeLoader('ts-code/T05Keyof.ts')
const T06UtilityTypes = createDemo('T06UtilityTypesArticle')
const T06Code = createCodeLoader('ts-code/T06UtilityTypes.ts')
const T07UnknownGuard = createDemo('T07UnknownGuardArticle')
const T07Code = createCodeLoader('ts-code/T07UnknownGuard.ts')
const T08VueTyping = createDemo('T08VueTypingArticle')
const T09IntersectionMixin = createDemo('T09IntersectionMixinArticle')
const T09Code = createCodeLoader('ts-code/T09IntersectionMixin.ts')
const T10Conditional = createDemo('T10ConditionalArticle')
const T10Code = createCodeLoader('ts-code/T10Conditional.ts')
const T11Mapped = createDemo('T11MappedArticle')
const T11Code = createCodeLoader('ts-code/T11Mapped.ts')
const T12TemplateLiteral = createDemo('T12TemplateLiteralArticle')
const T12Code = createCodeLoader('ts-code/T12TemplateLiteral.ts')
const T13FunctionTypes = createDemo('T13FunctionTypesArticle')
const T13Code = createCodeLoader('ts-code/T13FunctionTypes.ts')
const T14Enums = createDemo('T14EnumsArticle')
const T14Code = createCodeLoader('ts-code/T14Enums.ts')
const T15DeclarationMerging = createDemo('T15DeclarationMergingArticle')
const T15Code = createCodeLoader('ts-code/T15DeclarationMerging.ts')
const T16CompilerOptions = createDemo('T16CompilerOptionsArticle')
const T17DeclarationFiles = createDemo('T17DeclarationFilesArticle')
const T18Namespace = createDemo('T18NamespaceArticle')
const T19BrandedTypes = createDemo('T19BrandedTypesArticle')
const T20DiscriminatedUnion = createDemo('T20DiscriminatedUnionArticle')
const T21InferKeyword = createDemo('T21InferKeywordArticle')
const T22RecursiveTypes = createDemo('T22RecursiveTypesArticle')
const T23TypeLevelProgramming = createDemo('T23TypeLevelProgrammingArticle')
const T24AsyncReturnType = createDemo('T24AsyncReturnTypeArticle')


const T08Code = createCodeLoader('typescript-code/T08Code.ts.txt')
const T16Code = createCodeLoader('typescript-code/T16Code.ts.txt')
const T17Code = createCodeLoader('typescript-code/T17Code.ts.txt')
const T18Code = createCodeLoader('typescript-code/T18Code.ts.txt')
const T19Code = createCodeLoader('typescript-code/T19Code.ts.txt')
const T20Code = createCodeLoader('typescript-code/T20Code.ts.txt')
const T21Code = createCodeLoader('typescript-code/T21Code.ts.txt')
const T22Code = createCodeLoader('typescript-code/T22Code.ts.txt')
const T23Code = createCodeLoader('typescript-code/T23Code.ts.txt')
const T24Code = createCodeLoader('typescript-code/T24Code.ts.txt')

export const lessons: Lesson[] = [
{
    id: 'T_01', title: '类型推导与显式标注', navTitle: '类型推导', category: '类型基础',
    path: '/typescript/t-1/type-inference', summary: '从课程表单理解 TypeScript 如何推导类型，以及何时需要显式标注。',
    demo: T01TypeInference, code: T01Code, language: 'typescript',
    principle: 'TypeScript 依据变量的初始值自动推导其类型：局部常量、函数参数与绝大多数返回值都无需标注；当类型需要放宽为联合（例如可为 null）、推断不足以表达真实意图，或作为公共 API 的输入输出需要稳定契约时，才应显式标注，让编译器在赋值边界实施检查。',
    flow: ['局部常量与简单函数返回值由初始值自动推导，不写冗余标注。', '当类型需包含 null 等联合成员时，显式写出并把它们赋给变量。', '在编辑器和类型检查阶段发现对类型边界的非法赋值，及时修正。', '对比同一逻辑写与不写标注时的推导结果，体会边界价值。'],
    notes: ['只对必要的类型边界做显式标注，局部变量不重复写显而易见的类型。', '函数参数与返回值正是类型边界，优先为其标注以形成稳定的调用契约。', 'const 推导出的是字面量类型，需要 string 这类宽类型时要显式标注，或用 satisfies 在保留推导的同时做约束。', '返回值类型可交由推导，但公共函数的参数通常值得显式标注以稳定契约。'],
    problem: '解决"哪些类型可以放心交给编译器推导、哪些边界必须显式声明"的取舍问题。',
  },
{
    id: 'T_02', title: '联合类型与控制流收窄', navTitle: '联合与收窄', category: '类型基础',
    path: '/typescript/t-2/union-narrowing', summary: '用订单状态机掌握字面量联合类型和条件分支收窄。',
    demo: T02UnionNarrowing, code: T02Code, language: 'typescript',
    principle: '联合类型把一个值可能取到的状态显式列举出来，把散落各处的魔法字符串收拢成单一来源；TypeScript 会基于条件分支中对成员的相等比较，把参数类型逐步收窄到具体成员，使每个分支都按该成员独有的类型与业务逻辑编写，非法取值在编译期即被拦截。',
    flow: ['用字面量联合类型把订单的所有合法状态列举出来，禁用散落的魔法字符串。', '在函数内对状态参数做相等判断，让编译器在分支内把类型收窄为具体成员。', '在收窄后的分支中安全调用该状态专属的业务逻辑，其余分支由编译器保证不会失配。', '新增一个状态值，验证所有未处理的代码位置被编译器指出。'],
    notes: ['状态的合法取值应统一来自类型或常量，避免在多个地方硬编码字符串。', '收窄依靠相等比较；控制流越简单（if/else、switch），收窄结果越可预期。', '不要在收窄后重新还原成宽泛类型，否则会丢失编译器提供的精确信息。', '状态值来源要收敛到一处：类型、常量与校验函数共享同一份字面量联合。'],
    problem: '解决"如何让非法的业务状态无法被创建，并在各分支中被安全地处理"的问题。',
  },
{
    id: 'T_03', title: '对象类型与领域建模', navTitle: '对象建模', category: '类型基础',
    path: '/typescript/t-3/object-modeling', summary: '通过会员资料理解 interface 如何约束对象结构，并根据统一契约计算衍生值。',
    demo: T03ObjectModeling, code: T03Code, language: 'typescript',
    principle: 'interface 用一组字段刻画领域对象的形状，满足它即成为该类型的合法值；TypeScript 遵循结构化类型系统，只比较类型间的形状而不关心其声明来源，并在对象字面量赋值时执行多余属性检查，让公开契约与业务语言保持一致地演化；把领域模型收敛为单一来源，改动时编译器会指出所有受影响的调用点。',
    flow: ['识别领域对象的稳定字段与可变字段，用 interface 定义其形状。', '对象字面量必须同时满足必填字段与字段类型，缺漏或多出的字段由编译器拦截。', '让组件 Props、接口响应与业务函数都复用同一份接口契约，基于它计算衍生值。', '给接口变量赋一个多出字段的字面量，观察多余属性检查报错。'],
    notes: ['公共模型应用业务语言命名，避免与数据库或接口字段名混用。', '可选字段只用于数据确实可能缺失的场景，否则放进必填区。', '对象字面量赋值会做多余属性检查，而变量间赋值只比较形状，二者规则不同。', '接口只描述形状；需要精确拒绝额外字段时，靠多余属性检查或运行时校验。'],
    problem: '解决"如何把接口返回与业务对象建模成可维护的类型，避免字段漂移"的问题。',
  },
{
    id: 'T_04', title: '泛型：复用类型关系', navTitle: '泛型', category: '类型进阶',
    path: '/typescript/t-4/generics', summary: '用通用 API 响应保留课程列表的精确数据类型。',
    demo: T04Generics, code: T04Code, language: 'typescript',
    principle: '泛型把类型本身当作参与建模的变量：函数、类与容器复用同一份实现，调用时由实参自动推导出具体的类型参数，从而保持输入与输出之间的精确关系（如入参元素类型与返回值元素类型一致），避免为了换取通用性而退化为 any 或 unknown 后丢失全部类型信息。',
    flow: ['找出调用方希望在各个位置变化的类型，例如 API 响应的负载类型 T。', '用类型参数贯穿接口、函数签名与返回类型，让推导沿整条链路流动。', '调用时由实参自动推出 T，返回值即提供与之匹配的精确类型。', '故意传入类型不符的实参，观察泛型链路在调用处的报错。'],
    notes: ['类型参数名应表达角色（T、Item、Key、Value），单字母仅用于最常见的泛型场景。', '仅在定义一个位置出现且与其他类型无关的参数通常没有价值，可用具体类型替代。', '泛型约束（T extends 一些类型）能在实现侧安全访问传入类型的公共属性。', '把重复出现的具体类型抽成类型参数，是重构泛型最常用的切入点。'],
    problem: '解决"如何复用 API、列表与工具函数的实现，同时不丢失类型间的精确关联"的问题。',
  },
{
    id: 'T_05', title: 'keyof 与索引访问类型', navTitle: 'keyof', category: '类型进阶',
    path: '/typescript/t-5/keyof', summary: '构建只能读取合法配置键的设置面板。',
    demo: T05Keyof, code: T05Code, language: 'typescript',
    principle: 'keyof 从一个对象类型取出全部属性键组成的字面量联合类型，T[K] 索引访问类型则按键取回对应的值类型；把两者用作函数参数的类型（如 K extends keyof T），动态属性访问既灵活又不可能拼错键名，返回值类型还会随传入的键精确变化——传 "name" 得到 string，传 "age" 得到 number。',
    flow: ['用 keyof 从对象模型提取合法键的联合，例如 PreferenceKey。', '让函数参数受该键联合约束，传入不存在的键名会被编译器拦截。', '通过索引访问 T[K] 取得与键匹配的值类型，保证返回类型随键同步精确。', '传入不存在的键名，验证编辑器在调用处直接标红。'],
    notes: ['Object.keys 默认返回 string[]，必要时通过类型断言或工具函数收窄为具体键。', '不要用宽泛的 string 索引签名绕过键约束，那等于重新回到 any 模式。', '结合 as const 与 satisfies 可以保留更精确的字面量联合与对象结构。', '参数类型写成 K extends keyof T 是动态访问的通用防御姿势，先固化再取值。'],
    problem: '解决"动态访问对象属性时如何避免键名拼写错误，并让返回值类型同步精确"的问题。',
  },
{
    id: 'T_06', title: '工具类型与更新模型', navTitle: '工具类型', category: '类型进阶',
    path: '/typescript/t-6/utility-types', summary: '用 Partial、Pick 和 Omit 表达课程的局部更新。',
    demo: T06UtilityTypes, code: T06Code, language: 'typescript',
    principle: '内置工具类型基于映射类型与条件类型从既有模型派生出新的契约，例如用 Partial<Omit<Course, \'id\'>> 表达"除主键外字段皆可选"的更新补丁；派生类型都以领域模型为唯一来源，避免手写多份重复类型带来的漂移与维护成本。模型改动时，派生类型会随来源自动更新，编译器帮你找出受影响的位置。',
    flow: ['先定义一份完整领域模型作为唯一来源，例如 Course。', '用 Omit 排除不可变字段，再用 Partial 把剩余字段变为可选，组合成更新补丁类型。', '将目标实体与补丁作为 updateCourse 的参数，合并时只需传入要修改的字段。', '给补丁对象填上全部可选字段，验证赋值合法且不报多余属性。'],
    notes: ['派生类型应能看出其来源，必要时用 type 别名给用途命名。', 'Partial、Omit 只作用于一层，深层对象的整体可选需借助自定义映射或工具库。', '用 Readonly、Pick、Required 组合可以在不重复定义的前提下表达不同读写语义。', '工具类型嵌套过深时给组合结果起一个 type 别名，使用处的意图更清楚。'],
    problem: '解决"创建、编辑与接口响应三套类型重复书写，字段改动后互相漂移"的问题。',
  },
{
    id: 'T_07', title: 'unknown 与自定义类型守卫', navTitle: '安全边界', category: '安全边界',
    path: '/typescript/t-7/unknown-guard', summary: '安全解析用户导入的 JSON，在使用前验证未知数据。',
    demo: T07UnknownGuard, code: T07Code, language: 'typescript',
    principle: '外部输入在验证之前都应视为 unknown；自定义类型守卫（value is T 谓词）既在运行时执行真实检查，又向编译器证明检查通过后数据的精确类型，使 unknown 在通过守卫后被自动收窄，杜绝把不可信数据直接断言成业务类型带来的崩溃风险。',
    flow: ['把网络响应或本地解析结果先接收为 unknown，避免用 any 提前放弃类型安全。', '用 typeof、in 等操作编写守卫函数，逐层验证结构与字段类型并返回 is 谓词。', '守卫通过后完整数据被收窄为业务类型，再交给后续逻辑使用。', '为损坏的数据构造用例，验证守卫返回 false 而非放行。'],
    notes: ['类型断言（as）不会产生任何运行时校验，不能替代真实检查。', '嵌套结构应把校验拆成细粒度谓词逐层组合，避免一次断言跳过验证。', '结构复杂时可借助 zod、valibot 等 schema 工具，让校验结果直接推导为类型。', '为关键接口写一批非法输入的测试用例，守卫的正确性由测试兜底。'],
    problem: '解决"接口或本地数据不可信时，如何避免错误断言导致运行时崩溃"的问题。',
  },
{
    id: 'T_08', title: 'Vue 3 组件类型实践', navTitle: 'Vue 类型', category: '框架实践',
    path: '/typescript/t-8/vue-typing', summary: '掌握响应式状态、模板引用、Props 与 Emits 的类型边界。',
    demo: T08VueTyping, code: T08Code, language: 'typescript',
    principle: 'Vue 3 的 defineProps、defineEmits、withDefaults 等编译宏能从泛型声明直接推导模板中的类型；模板引用 ref<T>() 在挂载前值为 null 需要守卫，配合组件实例类型与组合式函数返回类型，共同构成组件类型系统的完整闭环。',
    flow: ['分别以类型参数声明组件的 Props 与 Emits，模板里即获得对应提示与校验。', '模板引用用 ref<T>() 声明，并在访问 DOM 或子组件前做空值守卫。', '为组合式函数与计算属性标注返回类型，保证解构出来的接口同样精确。', '故意写错一个 Prop 类型，验证模板与调用处都被标记。'],
    notes: ['优先使用类型化的 defineProps、defineEmits 与 withDefaults，避免重复的运行时声明。', '模板引用写 ref<T | null>(null) 再配合守卫比直接用 as 断言更安全。', '父组件可用 InstanceType<typeof Comp> 引用子组件的公开实例类型。', '对外暴露的类型尽量收窄，避免把内部实现的复杂类型泄漏给使用方。'],
    problem: '解决"如何让 Vue 组件的输入、输出和模板引用获得完整类型检查"的问题。',
  },
{
    id: 'T_09', title: '交叉类型与 Mixin 模式', navTitle: '交叉与 Mixin', category: '类型进阶',
    path: '/typescript/t-9/intersection-mixin', summary: '用交叉类型组合多个能力片段，用 Mixin 函数叠加行为。',
    demo: T09IntersectionMixin, code: T09Code, language: 'typescript',
    principle: '交叉类型 & 把多个对象类型合并，要求结果同时满足所有成员的约束，同名属性类型无交集时会退化成为 never 以暴露冲突；Mixin 用函数接收基类构造函数、返回增强后的新类来组合能力，配合泛型约束（TBase extends Constructor）保留原构造签名，比多层继承更灵活。',
    flow: ['把可复用的能力拆成独立的小接口，如 WithId、Timestamped、Publishable。', '用 & 组合出同时具备所有成员的目标类型，并处理同名属性的交叠。', '编写接收构造函数、返回增强类的 Mixin 函数，逐层叠加行为。', '构造交叉类型时故意制造同名冲突，观察 never 报错的提示方式。'],
    notes: ['交叉结果同时满足所有成员，无法删除或否决某个已有属性。', '同名属性类型无交集时收窄为 never，这是发现建模冲突的重要信号。', 'extends 表达"是一个"（子类型），交叉类型表达"既是…也是…"的组合关系。', 'Mixin 链超过两层后类型推导会明显变慢，优先用组合代替继续叠加。'],
    problem: '解决"多个可复用能力如何在类型与实现两侧灵活组合，而不陷入多层继承"的问题。',
  },
{
    id: 'T_10', title: '条件类型与类型推导', navTitle: '条件类型', category: '类型进阶',
    path: '/typescript/t-10/conditional', summary: '用条件类型和 infer 从联合响应中提取精确类型。',
    demo: T10Conditional, code: T10Code, language: 'typescript',
    principle: '条件类型用 T extends U ? X : Y 在类型层面做分支选择；当裸类型参数收到联合类型时，分支会逐个应用到每个成员（分布式条件类型），用 [T] 包裹即可把整个联合整体判断，Exclude、Extract、NonNullable 等工具正是这一机制的产物。',
    flow: ['用 T extends U 判断类型关系并选择相应分支，写出可复用的判断型别名。', '观察裸类型参数遇上联合时的分布式计算，需要在整体层面判断时用 [T] 包裹抑制。', '组合条件类型与映射/递归，实现 Exclude、Extract、NonNullable 等派生工具。', '给分布式分支加入 [T] 包裹，对比联合整体判断的前后差异。'],
    notes: ['并非所有条件类型都会分发，只有当 extends 的左操作数是裸类型参数时才会分发。', 'infer 用于在匹配分支中捕获未知子类型，专项内容见本板块 T_21。', '层层嵌套的条件类型难以阅读，尽量拆成具名的类型别名。', '条件类型分支只表达类型推导，不要在其中编写运行时代码。'],
    problem: '解决"如何按类型形状自动分支，从泛型容器中提取并转换出需要的子类型"的问题。',
  },
{
    id: 'T_11', title: '映射类型与键转换', navTitle: '映射类型', category: '类型进阶',
    path: '/typescript/t-11/mapped', summary: '用映射类型批量转换属性，掌握修饰符和键重命名。',
    demo: T11Mapped, code: T11Code, language: 'typescript',
    principle: '映射类型以 [K in keyof T] 的形式遍历已有类型的每个键并生成新的结构，可叠加 readonly 与可选修饰符，也能用 as 子句重命名（大写化、加前缀）或把键过滤为 never。它与模板字面量类型结合即可批量产出 getter/setter 等派生键，是 Partial、Readonly、Pick 等内置工具的底层机制。',
    flow: ['从已有模型用 [K in keyof T] 遍历全部键，逐个生成映射结果。', '用 +/-?、readonly 或 -readonly 调整可选与只读修饰符。', '用 as 重命名键（如加 get/set 前缀），或用 never 过滤掉不需要的键。', '把映射结果展开悬停查看，确认生成键与预期完全一致。'],
    notes: ['键重命名模板中的 K 需先收窄为 string，例如 string & K，才能参与字符串拼接。', '把不需要的键映射为 never 即可过滤；所有属性都由此规则派生出来。', '映射只作用于当前一层，深层结构要结合递归条件类型处理。', 'Key Remapping 中的键需与模板字面量兼容，无法拼接的键会被过滤。'],
    problem: '解决"如何从一个模型批量派生只读、可选或重命名版本，避免重复定义"的问题。',
  },
{
    id: 'T_12', title: '模板字面量类型', navTitle: '模板字面量', category: '类型进阶',
    path: '/typescript/t-12/template-literal', summary: '构建类型安全的事件名、路由路径和 CSS 类名。',
    demo: T12TemplateLiteral, code: T12Code, language: 'typescript',
    principle: '模板字面量类型把字符串的拼接、约束与解析提升到类型层面，配合 Uppercase、Lowercase、Capitalize 等内置工具和 infer，可以构造出精确的事件名、路由路径、类名与事件总线负载，让拼错写法在编辑阶段就被报错。它把字符串约定的校验从运行时前移，减少改名或手误造成的隐性缺陷。',
    flow: ['用 `${Prefix}${Suffix}` 组合字面量类型与联合，让编译器展开成所有合法形态。', '用 Uppercase、Capitalize 等工具统一大小写，再生成 onXxx 一类派生写法。', '配合条件类型与 infer 提取 `on${E}` 中的事件名，或把 camelCase 转成 snake_case。', '改动前缀常量，验证所有派生类型随之更新。'],
    notes: ['模板字面量与联合组合时自动做笛卡尔展开，键数过多需注意类型膨胀。', '用 `${number}` 一类内置模式可表达任何数字形态的片段。', '适合事件总线、API 路由、状态机 key 等强约束场景，近乎枚举但更易拼接。', '联合成员过多时注意类型膨胀：能收敛为模板模式的不要展开成具体字面量。'],
    problem: '解决"如何让事件名、路由和 CSS 类名在编译期就保证正确性"的问题。',
  },
{
    id: 'T_13', title: '函数类型、重载与断言函数', navTitle: '函数类型', category: '类型进阶',
    path: '/typescript/t-13/function-types', summary: '为 API 编写重载签名，用断言函数做运行时类型守卫。',
    demo: T13FunctionTypes, code: T13Code, language: 'typescript',
    principle: '函数类型既可用 (x: T) => R 的类型表达式表达，也能用调用签名（Call Signature）为函数附加属性；重载让同一函数名按输入参数形状返回不同精确类型；断言函数（asserts value is T）在运行时校验并把参数自动收窄，是安全消费 unknown 的关键工具。',
    flow: ['用类型表达式或调用签名声明函数形状，需要附加属性时选择调用签名。', '为同一函数编写多条重载签名，分别返回与之匹配的精确类型（id 时单条、id 数组时列表）。', '用 asserts 签名实现运行时守卫，调用后编译器自动收窄目标参数。', '调整重载签名顺序，观察匹配到的实现随声明序变化。'],
    notes: ['重载签名须从最具体到最宽泛排序，实际调用按声明顺序匹配第一满足的签名。', '断言函数返回值是 asserts 声明而不是 boolean，作用在于调用后的收窄效果。', 'this 参数是首个伪参数，用于精确约束方法内 this 的形状。', '重载数量过多时考虑改用联合参数或对象配置，可读性更好。'],
    problem: '解决"同一函数如何根据输入返回不同类型，以及如何安全收窄 unknown"的问题。',
  },
{
    id: 'T_14', title: '枚举、常量枚举与字面量映射', navTitle: '枚举与映射', category: '类型进阶',
    path: '/typescript/t-14/enums', summary: '比较枚举与联合字面量在状态建模中的差异和适用场景。',
    demo: T14Enums, code: T14Code, language: 'typescript',
    principle: '枚举提供运行时值，数字枚举还自动生成反向映射，const enum 则在编译期直接内联成员、不产出运行时对象；联合字面量搭配 as const 对象可实现近似效果，产物更轻、便于树摇与组合，同时用 satisfies 校验配置完整性又保留字面量类型。',
    flow: ['用枚举定义有限状态集合，理解数字/字符串枚举与反向映射的差异。', '观察 const enum 的完全内联产物，以及它在库声明与独立转译下的局限。', '用 as const 对象 + Record + satisfies 实现零运行时成本的替代方案。', '对比枚举与 as const 方案的编译产物体积差异。'],
    notes: ['数字枚举具备正向与反向双向映射，字符串枚举只有正向。', 'const enum 会内联成员；ambient const enum 及与 isolatedModules 等独立转译流程存在兼容风险，应谨慎发布到库。', 'Object.entries 遍历数字枚举时需要过滤反向映射产生的键。', '对外发布的类型中避免导出 const enum，isolatedModules 场景下会有兼容问题。'],
    problem: '解决"有限状态集合应该用枚举、const enum 还是联合字面量来建模"的选型问题。',
  },
{
    id: 'T_15', title: '声明合并与模块扩展', navTitle: '声明合并', category: '类型进阶',
    path: '/typescript/t-15/declaration-merging', summary: '扩展第三方库类型，掌握接口合并和模块增强。',
    demo: T15DeclarationMerging, code: T15Code, language: 'typescript',
    principle: '声明合并让多个分散的声明按规则拼成单一实体：同名 interface 的属性与成员自动合并，namespace 可与 class/函数/枚举合并以追加静态成员，declare module 则在模块作用域内为第三方包补充或改写类型——这一切都不需要改动被扩展方的源码。',
    flow: ['对同名 interface 多次声明，观察属性被自动合并成一个类型。', '用 namespace 与类/函数/枚举合并，向既有实体追加静态成员。', '在 .d.ts 中用 declare module 为第三方模块与全局对象做类型增强。', '在业务代码里调用增强后的成员，验证类型补充生效。'],
    notes: ['class 之间不能互相合并，只能借助 interface 或 namespace 扩展其类型形状。', '模块增强必须放在模块作用域内，用 declare module 按包逐个声明。', 'declare global 只在带 import/export 的模块文件中生效，用于扩展全局对象。', '第三方增强尽量集中到 types/ 目录统一管理，避免散落各处难以追踪。'],
    problem: '解决"如何在不修改第三方库源码的前提下，为其补充或修正缺失的类型"的问题。',
  },
{
    id: 'T_16', title: 'tsconfig 编译配置详解', navTitle: 'tsconfig', category: '类型进阶',
    path: '/typescript/t-16/compiler-options', summary: '理解 strict、target、module 等核心编译选项对类型检查行为的影响。',
    demo: T16CompilerOptions, code: T16Code, language: 'typescript',
    principle: 'tsconfig.json 控制 TypeScript 的编译与类型检查行为：strict 一次打开 noImplicitAny、strictNullChecks、strictFunctionTypes 等全部严格选项，target 决定输出所依赖的 ES 版本，lib 声明可用的内置类型，module 与 moduleResolution 决定模块格式与解析策略，paths/baseUrl 用于路径别名。',
    flow: ['开启 strict 获得最严格的类型检查，strictNullChecks 下再显式表达可空值。', '按运行环境选择 target 与 lib，浏览器项目补上 DOM 相关类型。', '用 moduleResolution: bundler 适配 Vite 等打包器，并用 paths/baseUrl 配置别名。', '修改 target 后对比产物语法，确认与新目标一致。'],
    notes: ['新项目建议直接启用 strict，量大时再逐步放开个别选项。', 'target 只影响产出语法，计划使用的 API 仍需 lib 提供对应类型。', 'declaration:true 可顺带产出 .d.ts，供以库形式被他人消费。', '多人协作项目应开启 isolatedModules，保证单文件转译工具与 tsc 行为一致。'],
    problem: '解决"tsconfig 选项太多，如何理解和配置核心编译选项"的问题。',
  },
{
    id: 'T_17', title: '声明文件与全局类型增强', navTitle: '声明文件', category: '类型进阶',
    path: '/typescript/t-17/declaration-files', summary: '掌握 .d.ts 声明文件的编写模式、全局增强和第三方库类型补充。',
    demo: T17DeclarationFiles, code: T17Code, language: 'typescript',
    principle: '声明文件（.d.ts）只含类型信息、不含实现，用来给 JavaScript 代码补全类型：declare 关键字声明运行时存在而实现别处的环境变量与函数，declare module 为无类型第三方包或模块补充导出，declare global 则在模块文件中扩展 Window、String 等全局类型。',
    flow: ['用 declare const / declare function 描述环境中存在但无源码的变量与函数。', '为缺少类型的库编写 declare module，或为资源文件写通配符声明。', '在模块文件中用 declare global 扩展 Window、Array 等全局对象。', '把声明文件加入 tsconfig 的 include，确认编辑器能解析到补充类型。'],
    notes: ['.d.ts 只声明类型，不写任何实现代码。', '声明不足的第三方库可从 DefinitelyTyped 安装对应类型包。', '通配符声明（如 *.module.css）可让资源导入获得默认导出类型。', '声明文件与源码并置时注意命名约定，避免被误当作实现文件参与打包。'],
    problem: '解决"如何为 JavaScript 库和全局环境补充 TypeScript 类型声明"的问题。',
  },
{
    id: 'T_18', title: '命名空间与模块模式对比', navTitle: '命名空间', category: '类型进阶',
    path: '/typescript/t-18/namespace', summary: '比较 namespace 与 ES Module 在类型组织中的差异和适用场景。',
    demo: T18Namespace, code: T18Code, language: 'typescript',
    principle: 'namespace 是 TypeScript 早期（对应 import 语法的模块标准尚未成熟时）的组织方式，运行时可能生成一个全局对象，且支持声明合并；ES Module 是 JavaScript 标准，静态分析友好、便于 tree-shaking。新项目应统一使用 ES Module，namespace 主要保留在声明文件或旧代码中。',
    flow: ['用 namespace 把相关类型与函数收敛到同一命名空间，成员需 export 才能被外部访问。', '对比产物差异：namespace 在运行时生成全局对象且支持声明合并，ES Module 是静态模块、便于 tree-shaking。', '新代码统一用 ES Module 组织导出；仅在 .d.ts 中保留 namespace 聚合全局类型，并用 import 别名简化深层访问。', '检查构建产物：确认 namespace 代码不被摇树误留或全局污染。'],
    notes: ['不要在同一个新模块内混用 namespace 与 ES Module 来组织导出。', '声明文件常用 declare namespace 把全局类型挂在命名空间下。', '用 import 别名（如 import polygons = Shapes.Polygons）可缩短深层 namespace 的访问路径。', '迁移旧 namespace 代码时先保持导出形状不变，再逐步换成具名导出。'],
    problem: '解决"旧代码与声明文件中的 namespace 何时该保留，新模块为何统一改用 ES Module"的问题。',
  },
{
    id: 'T_19', title: '品牌类型(Branded Types)与名义类型', navTitle: '品牌类型', category: '类型进阶',
    path: '/typescript/t-19/branded-types', summary: '通过品牌类型模拟名义类型，让结构相同但语义不同的类型不能互相赋值。',
    demo: T19BrandedTypes, code: T19Code, language: 'typescript',
    principle: 'TypeScript 采用结构化类型系统，两个形状相同的类型会被视为一致；品牌类型通过在底层类型上追加一个唯一的标记（品牌）来模拟名义类型，让结构相同但语义不同的类型（如 UserId 与 OrderId）无法互相赋值，从而在传参、字段等边界挡住语义错配。',
    flow: ['用交叉类型追加品牌标记：Brand<T, B> = T & { readonly [__brand]: B }。', '把构造品牌值的逻辑收敛到带校验的工厂函数或守卫里，避免到处硬断言。', '函数参数使用品牌类型，语义不同的品牌传错时编译器立即报错。', '尝试把普通字符串直接赋给品牌类型，确认编译错误。'],
    notes: ['品牌只是类型层标记，运行时零开销；其价值在于把合法性校验集中到创建处。', '推荐用 unique symbol 作为品牌键，比字符串字面量更能避免属性名冲突。', '适合 ID、金额、邮箱、URL 等有业务语义又被当作字符串/数字使用的原始类型。', '品牌类型的校验集中在工厂函数，绕过工厂的构造要在代码评审中重点拦截。'],
    problem: '解决"结构相同但语义不同的类型无法区分、传参错误难以在编译期发现"的问题。',
  },
{
    id: 'T_20', title: '可辨识联合类型与穷尽性检查', navTitle: '可辨识联合', category: '类型进阶',
    path: '/typescript/t-20/discriminated-union', summary: '通过共同的判别属性区分联合类型成员，配合穷尽性检查安全处理所有分支。',
    demo: T20DiscriminatedUnion, code: T20Code, language: 'typescript',
    principle: '可辨识联合（Discriminated Union）让联合的每个成员都持有一个同名、同类型（通常为字面量）的判别属性（tag），TypeScript 据此在 switch 或 if 中把值收窄到对应的具体成员；配合 default 分支将剩余值赋给 never，可对没有穷尽的分支做编译期检查。',
    flow: ['为每种状态定义接口，并添加相同名字的判别属性（type、kind 或 status）。', '把所有成员联合成类型作为函数参数，调用方只能传入合法组合。', '在 switch/case 中依据判别属性收窄类型，default 分支交给 never 做穷尽性检查。', '新增一个联合成员，验证 default 分支的 never 检查立即报错。'],
    notes: ['判别属性应为字面量类型，使编译器能据此区分并收窄每个成员。', 'default 分支把剩余值赋给 never；新增成员导致遗漏 case 时，编译器会报类型不兼容。', '除 switch 外，in 操作符与 is 类型守卫也能基于判别属性收窄联合成员。', '判别属性命名要统一（如都用 type），混用不同名字会失去收窄能力。'],
    problem: '解决"可辨识联合的分支处理不全、新增状态时遗漏的分支无法被静态发现"的问题。',
  },
{
    id: 'T_21', title: 'infer 关键字与类型推断', navTitle: 'infer 关键字', category: '类型进阶',
    path: '/typescript/t-21/infer-keyword', summary: '在条件类型中使用 infer 声明待推断的类型变量，从上下文提取函数返回类型、参数类型等。',
    demo: T21InferKeyword, code: T21Code, language: 'typescript',
    principle: 'infer 只能在条件类型的 extends 子句中声明一个待推断的类型变量，让 TypeScript 在匹配时反向推导它的取值，常用于提取函数返回类型、参数元组、Promise 内部类型、数组元素、构造函数参数等；ReturnType、Parameters、InstanceType 等内置工具正是以此实现。',
    flow: ['在条件类型的真分支用 infer R 捕获需要推导的子类型（如函数返回类型）。', '对 Promise、数组、构造函数等不同容器分别用对应模式捕获其内部类型。', '将捕获到的变量用于该分支的返回，配合递归即可实现脱离嵌套的解包。', '把常见解包封装成泛化的 Unwrap 工具类型，逐层解开嵌套容器。'],
    notes: ['infer 只能出现在条件类型的 extends 分支内，不能在其他表达式里独立使用。', '同一模式中可有多个 infer 变量，如从元组 [A, B] 中同时捕获两端。', 'infer 遇到函数重载时取最后一个实现的返回类型，使用前应留意。', 'infer 变量只存在于条件类型的真分支内，假分支中引用会报错。'],
    problem: '解决"函数返回值、参数与容器内部类型如何从既有类型自动提取，而无需重复书写"的问题。',
  },
{
    id: 'T_22', title: '递归类型与深嵌套对象', navTitle: '递归类型', category: '类型进阶',
    path: '/typescript/t-22/recursive-types', summary: '利用递归类型描述树形结构和深嵌套对象，实现 DeepReadonly、DeepPartial 等深度转换。',
    demo: T22RecursiveTypes, code: T22Code, language: 'typescript',
    principle: '递归类型是在自身定义中引用自己的类型，天然适合描述树、JSON 等嵌套结构；递归类型别名结合映射类型与条件类型，可以一键生成 DeepReadonly、DeepPartial 等深度转换，编译器会按规则的终止路径收敛，并对过深的实例化施加深度限制。',
    flow: ['用 interface 或类型别名在内部引用自身，描述树、JSON、目录等嵌套结构。', '结合映射类型与条件类型实现深度转换，并用终止条件保证收敛到基础类型。', '验证如 深度只读配置 或 扁平化多维数组 这类操作在深层结构上的表现。', '给嵌套对象添加新层级，确认深度转换仍然生效且不失配。'],
    notes: ['递归类型必须以可退出的分支终止，避免无限递归导致实例化过深。', '对象/函数成员应原样返回，使其不被错误地继续递归下去。', '编译器对类型实例化深度有限制；嵌套极深或递归过重时会报错。', '性能敏感的递归类型控制在必要深度，超过三层嵌套的转换考虑改用工具库。'],
    problem: '解决"嵌套结构类型描述复杂、深度转换需要逐层手写且容易遗漏出错"的问题。',
  },
{
    id: 'T_23', title: '类型级编程与类型体操', navTitle: '类型级编程', category: '类型进阶',
    path: '/typescript/t-23/type-level-programming', summary: '利用条件类型、映射类型、模板字面量类型等在类型层面实现计算和逻辑。',
    demo: T23TypeLevelProgramming, code: T23Code, language: 'typescript',
    principle: '类型级编程把条件类型、映射类型、模板字面量类型、递归与 infer 组合起来，在类型层面实现比较、循环、字符串变换甚至算术（借助元组长度充当数字），从而让类型本身承担校验与派生，减少运行时的重复检查。但类型体操应服务于可读性，业务代码中优先选择直白易懂的声明方式。',
    flow: ['用条件类型与递归实现类型层面的 if-else 与循环。', '用元组长度模拟整数，实现大小比较、重复拼接等算术。', '结合映射类型与模板字面量对对象的键和值做整体转换。', '为类型体操的输入与输出各写一组类型断言用例，锁住行为防止退化。'],
    notes: ['类型体操是手段而非目的，可读性优先，业务代码中应克制使用。', '借助元组 [...Prev, ...Curr] 的长度做计数，是类型级算术的通用手法。', '复杂类型会受实例化深度限制，务必给出可读的具名别名并补充适当注释。', '把这些技巧沉淀到团队的类型工具库，避免各业务文件中重复实现。'],
    problem: '解决"键名转换、数值比较这类约束如何在类型层面完成，让错误止步于编译期"的问题。',
  },
{
    id: 'T_24', title: '异步返回类型与 Awaited', navTitle: '异步返回类型', category: '类型进阶',
    path: '/typescript/t-24/async-return-type', summary: '使用 Awaited 解包 Promise 嵌套，精确获取异步函数的返回值类型。',
    demo: T24AsyncReturnType, code: T24Code, language: 'typescript',
    principle: 'Awaited<T> 会递归解包 Promise 及带 then 的对象，返回最终的 resolve 值类型；配合 ReturnType<typeof fn> 即可从任意 async 函数精确取得异步返回值类型，Promise.all、allSettled、race 等组合的返回类型也可据此还原为可读的具体结构。',
    flow: ['用 Awaited<T> 解包 Promise 类型，非 Promise 则原样返回。', '用 ReturnType<typeof fn> 取到 Promise，再经 Awaited<...> 得到实际返回类型。', '对 Promise.all/allSettled/race 的返回用同样方式推导出具体元素结构。', '用编辑器悬停验证解包结果与手写类型一致。'],
    notes: ['Awaited 会递归解开深层嵌套的 Promise。', 'catch 捕获到的 error 类型是 unknown，需配合类型守卫使用。', '同样适用带 then 方法的 thenable，可作为自定义 Awaited 的递归实现参考。', '遇到嵌套 Promise 的类型问题时，先检查是否需要 Awaited 而不是直接断言。'],
    problem: '解决"Promise 嵌套类型难以解包、异步函数返回值类型不清晰"的问题。',
  }
]

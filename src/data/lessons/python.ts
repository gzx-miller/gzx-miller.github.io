import type { Lesson } from '../lessons'
import { restoreCodeSource } from '../code-restore'
import PY01Variables from '../../demos/PY01VariablesArticle.vue'
import PY02Operators from '../../demos/PY02OperatorsArticle.vue'
import PY03Strings from '../../demos/PY03StringsArticle.vue'
import PY04ControlFlow from '../../demos/PY04ControlFlowArticle.vue'
import PY05ListsTuples from '../../demos/PY05ListsTuplesArticle.vue'
import PY06DictSets from '../../demos/PY06DictSetsArticle.vue'
import PY07Comprehensions from '../../demos/PY07ComprehensionsArticle.vue'
import PY08Functions from '../../demos/PY08FunctionsArticle.vue'
import PY09Decorators from '../../demos/PY09DecoratorsArticle.vue'
import PY10Generators from '../../demos/PY10GeneratorsArticle.vue'
import PY11Classes from '../../demos/PY11ClassesArticle.vue'
import PY12Inheritance from '../../demos/PY12InheritanceArticle.vue'
import PY13Dataclasses from '../../demos/PY13DataclassesArticle.vue'
import PY14Exceptions from '../../demos/PY14ExceptionsArticle.vue'
import PY15Modules from '../../demos/PY15ModulesArticle.vue'
import PY16Environments from '../../demos/PY16EnvironmentsArticle.vue'
import PY17FileIO from '../../demos/PY17FileIOArticle.vue'
import PY18Stdlib from '../../demos/PY18StdlibArticle.vue'
import PY19Concurrency from '../../demos/PY19ConcurrencyArticle.vue'
import PY20Asyncio from '../../demos/PY20AsyncioArticle.vue'
// 该分类专属的演示样式，随分类数据一起按需加载
import '../../styles/category-python.css'

const vueCodeModules = import.meta.glob<string>('../../demos/*.vue', { query: '?raw', import: 'default' })
const jsxCodeModules = import.meta.glob<string>('../../demos/react-jsx/*.jsx', { query: '?raw', import: 'default' })
const stateCodeModules = import.meta.glob<string>('../../demos/state-react/*.js', { query: '?raw', import: 'default' })
const jsCodeModules = import.meta.glob<string>('../../demos/js-code/*.js', { query: '?raw', import: 'default' })
const tsCodeModules = import.meta.glob<string>('../../demos/ts-code/*.ts', { query: '?raw', import: 'default' })
const styleCodeModules = import.meta.glob<string>('../../demos/style-code/*', { query: '?raw', import: 'default' })
const pythonCodeModules = import.meta.glob<string>('../../demos/python-code/*.py', { query: '?raw', import: 'default' })

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
            : path.startsWith('python-code/')
              ? pythonCodeModules
              : vueCodeModules
  const loader = modules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到内容源码：${path}`)
  return () => loader().then(restoreCodeSource)
}

const PY01Code = createCodeLoader('python-code/PY01Variables.py')
const PY02Code = createCodeLoader('python-code/PY02Operators.py')
const PY03Code = createCodeLoader('python-code/PY03Strings.py')
const PY04Code = createCodeLoader('python-code/PY04ControlFlow.py')
const PY05Code = createCodeLoader('python-code/PY05ListsTuples.py')
const PY06Code = createCodeLoader('python-code/PY06DictSets.py')
const PY07Code = createCodeLoader('python-code/PY07Comprehensions.py')
const PY08Code = createCodeLoader('python-code/PY08Functions.py')
const PY09Code = createCodeLoader('python-code/PY09Decorators.py')
const PY10Code = createCodeLoader('python-code/PY10Generators.py')
const PY11Code = createCodeLoader('python-code/PY11Classes.py')
const PY12Code = createCodeLoader('python-code/PY12Inheritance.py')
const PY13Code = createCodeLoader('python-code/PY13Dataclasses.py')
const PY14Code = createCodeLoader('python-code/PY14Exceptions.py')
const PY15Code = createCodeLoader('python-code/PY15Modules.py')
const PY16Code = createCodeLoader('python-code/PY16Environments.py')
const PY17Code = createCodeLoader('python-code/PY17FileIO.py')
const PY18Code = createCodeLoader('python-code/PY18Stdlib.py')
const PY19Code = createCodeLoader('python-code/PY19Concurrency.py')
const PY20Code = createCodeLoader('python-code/PY20Asyncio.py')

export const lessons: Lesson[] = [
  {
    id: 'PY_1',
    title: '变量、数据类型与动态类型',
    navTitle: '变量与类型',
    category: '基础入门',
    path: '/python/py-1/variables-types',
    summary: '理解 Python 变量是「名字到对象的绑定」，掌握动态类型、可变与不可变的区别，以及类型转换与注解的边界。',
    principle: 'Python 里变量不是盒子而是名字：赋值把名字绑定到一个已存在的对象上，b = a 不复制对象，只让两个名字指向同一个。类型属于对象而不属于名字，因此同一名字可以先后指向不同类型的对象——这就是动态类型。对象又分可变（list/dict/set，就地修改会对所有引用者生效）与不可变（int/str/tuple，「修改」即新建、可安全共享）。函数传参、容器嵌套共享状态都遵循这套对象引用语义。',
    flow: [
      '用 a = [1, 2, 3]; b = a 验证两个名字指向同一对象，b.append(4) 后 a 也跟着变。',
      '需要独立副本时对可变对象用 copy.copy / copy.deepcopy，不可变对象本就无需拷贝。',
      '在系统边界用 int() / float() 把外部输入转成数字，转换失败会抛 ValueError。',
      '用类型注解表达意图、用 isinstance() 在边界做校验，而不是依赖运行期强制。',
    ],
    notes: [
      'b = a 不是复制；需要独立副本时用 copy.copy（浅）或 copy.deepcopy（深）。',
      'int("3.14") 会失败，要先用 float()；bool("0") 是 True，因为判断依据是字符串是否为空。',
      '类型注解默认不做运行期强制，它的价值在于配合编辑器与静态检查工具发现不一致。',
      '可变的默认参数会跨调用共享，应改用 None 占位再在函数体内按需创建。',
    ],
    problem: '解决「变量赋值到底是复制还是共享，以及动态类型为何容易拖到运行时才暴露错误」的问题。',
    demo: null,
    demoComponent: PY01Variables,
    code: PY01Code,
    language: 'python',
  },
  {
    id: 'PY_2',
    title: '运算符与表达式求值',
    navTitle: '运算符与表达式',
    category: '基础入门',
    path: '/python/py-2/operators',
    summary: '理清算术、比较与布尔运算符的求值规则，尤其是除法家族、链式比较与短路求值。',
    principle: '表达式按固定优先级求值，** 幂运算最高且右结合，不确定时加括号最稳妥。除法家族分工明确：/ 是真除法恒为 float，// 是地板除、向下取整到负无穷，% 的余数符号跟随除数，三者满足 a == (a // b) * b + (a % b)。比较支持链式写法 0 < x < 10，等价于用 and 连接且中间项只求值一次。and / or 返回参与运算的对象本身并短路求值；== 比的是值、is 比的是身份，判断 None 应写成 is None。',
    flow: [
      '在同一表达式里混用多个运算符，按优先级阶梯核对谁先算，拿不准就加括号。',
      '用 /、//、% 与 divmod() 分别验证负数上的商与余数，理解向下取整与符号规则。',
      '用链式比较与 and / or 的短路特性简化范围判断与兜底取值。',
      '用 == 与 is 分别比较值相等和对象身份，确认 is None 才是判断空值的正确写法。',
    ],
    notes: [
      '// 是向负无穷取整而不是向零截断：-7 // 2 == -4，-7 % 2 == 1。',
      '/ 的结果恒为 float，哪怕能整除（4 / 2 得到 2.0）。',
      '只要 // 或 % 任一方是 float，结果就是 float；除数为 0 会抛 ZeroDivisionError。',
      'and / or 返回的是操作数本身而非 True/False，滥用会把表达式的类型变得难以预料。',
    ],
    problem: '解决「同一运算符在不同类型或负数上表现不同、以及表达式求值顺序难以预判」的问题。',
    demo: null,
    demoComponent: PY02Operators,
    code: PY02Code,
    language: 'python',
  },
  {
    id: 'PY_3',
    title: '字符串与格式化',
    navTitle: '字符串处理',
    category: '基础入门',
    path: '/python/py-3/strings',
    summary: '从「字符串不可变」出发，掌握索引切片、f-string 格式化、常用方法与文本/字节的转换。',
    principle: '字符串是不可变对象，任何看似「修改」的操作都返回新字符串，所以改一个字符要写成 "h" + s[1:] 或 s.replace(...)；比较内容用 ==，别用 is 比身份。它支持与列表一致的索引与切片（不含 stop、负步长可反转），切片边界自动裁剪不越界。f-string 把表达式直接写进文本并可控制对齐与精度。文本与字节是两回事，落盘或走网络要靠 encode / decode，编码不匹配会抛 UnicodeDecodeError。',
    flow: [
      '用 s[0] 与 s[-1] 取首尾字符，用 s[::-1] 反转，验证切片边界的宽松裁剪。',
      '用 f"{name} = {age}" 把值排进文本，并用 {v:>6}、{v:.2f}、{n:04d} 控制格式。',
      '用 split / join / strip / replace / find / startswith 处理文本，注意它们都返回新串。',
      '用 "栗子".encode("utf-8") 与 bytes.decode("utf-8") 在文本与字节之间往返。',
    ],
    notes: [
      '字符串不可变，s[0] = "h" 会抛 TypeError，拼接大量分片时用 join 比反复 + 更高效。',
      '切片 s[start:stop:step] 不含 stop，越界会被自动裁剪而不会报错。',
      'f-string 里的 {} 会求值任意表达式，但应保持简短可读。',
      '文本与字节必须显式 encode / decode，跨平台场景统一用 utf-8 避免乱码。',
    ],
    problem: '解决「字符串为何改不动、如何高效拼接与格式化，以及文本和字节何时需要转换」的问题。',
    demo: null,
    demoComponent: PY03Strings,
    code: PY03Code,
    language: 'python',
  },
  {
    id: 'PY_4',
    title: '条件判断与循环',
    navTitle: '条件与循环',
    category: '基础入门',
    path: '/python/py-4/control-flow',
    summary: '掌握 if / elif / else 与 while / for 的执行规则，特别是真值判断、range 边界与循环的 else 子句。',
    principle: '条件判断自上而下依次测试，命中第一个为真的分支后其余跳过，代码块用缩进界定。Python 的条件不要求是 bool：任何对象都会被转成真假，假值包括 False、None、0、0.0、空字符串与空容器。for 遍历的是可迭代对象而非「按计数器循环」，要按次数就用 range；range(stop) 不含 stop 是最常见的入门陷阱。break 才算「打断」循环，循环的 else 只在没有被 break 时执行。',
    flow: [
      '用 if / elif / else 给分数分级，感受条件自上而下命中即止。',
      '用 []、0、"" 与 [0]、"0" 对比，核对哪些是真值、哪些是假值。',
      '用 range(1, 5) 与 range(1, 6) 对比，确认 range 不含 stop。',
      '用 for / while 搭配 break 与 else，验证「没被 break 才执行 else」。',
    ],
    notes: [
      '判断容器非空直接写 if items: 即可，不必写 if len(items) > 0。',
      'range(start, stop, step) 不含 stop；step 可为负，务必核对 off-by-one。',
      'while 循环体内必须有能让条件最终变假的操作，否则就是死循环。',
      '循环的 else 与条件真假无关，只与「是否被 break」有关。',
    ],
    problem: '解决「条件与循环的边界为何总与直觉差一位，以及循环 else 到底何时执行」的问题。',
    demo: null,
    demoComponent: PY04ControlFlow,
    code: PY04Code,
    language: 'python',
  },
  {
    id: 'PY_5',
    title: '列表、元组与序列操作',
    navTitle: '列表与元组',
    category: '数据结构',
    path: '/python/py-5/lists-tuples',
    summary: '掌握列表的索引切片、就地方法与排序，以及元组的不可变、解包，和共享引用带来的典型陷阱。',
    principle: '列表是可变有序序列，支持索引、切片与切片赋值，方法分「就地修改」与「返回新对象」两类：sort / append / reverse 就地修改并返回 None，sorted 返回新列表。排序通过 key 定制规则且是稳定的。元组不可变、可哈希、能解包，适合固定结构（坐标、函数多返回值）。最贵的教训来自共享引用：[[0] * 3] * 3 的三行其实是同一个子列表，可变默认参数也会跨调用共享。',
    flow: [
      '用索引与切片读写列表，观察切片赋值会就地替换且长度可不同。',
      '用 append / extend / insert / pop / remove 增删元素，确认就地方法的返回值。',
      '用 sorted(items, key=...) 与 lst.sort() 对比「新建」与「就地」两种排序。',
      '用 [[0] * 3 for _ in range(3)] 建二维结构，验证各行独立而非共享。',
    ],
    notes: [
      'lst.sort() 返回 None，写 lst = lst.sort() 会把列表变成 None。',
      '切片 lst[:] 与 copy() 都是浅拷贝，嵌套层仍共享；要彻底独立需 deepcopy。',
      '元组不可改元素、不能增删，但可哈希、可解包，a, b = b, a 用它可以一步交换。',
      '凡「就地修改」的方法（append、sort、reverse）都返回 None。',
    ],
    problem: '解决「列表方法返回什么、排序为何要分两个入口，以及共享引用为何让数据悄悄串味」的问题。',
    demo: null,
    demoComponent: PY05ListsTuples,
    code: PY05Code,
    language: 'python',
  },
  {
    id: 'PY_6',
    title: '字典与集合',
    navTitle: '字典与集合',
    category: '数据结构',
    path: '/python/py-6/dict-sets',
    summary: '掌握字典的键值映射与取值差异，集合的去重与数学运算，以及「可哈希」这一共同约束。',
    principle: '字典把键映射到值，取值分两种：d[key] 缺键抛 KeyError，d.get(key, default) 缺键给默认值；in 判断的是键，3.7 起字典保持插入顺序，setdefault 常用于分组。集合唯一且无序，成员判断平均接近常数时间，支持 | / & / - / ^ 与 frozenset 不可变版本。字典的键与集合的元素都必须可哈希——即在生命周期内不可变且哈希值稳定，因此列表、字典、集合都不能当键。',
    flow: [
      '用 d[key] 与 d.get(key, default) 分别处理「键一定在」与「键不确定在」两种场景。',
      '用 d.items() 遍历键值对，用 setdefault 完成「按 k 分组」的累积。',
      '用 | / & / - / ^ 做并、交、差、对称差，并对比 frozenset 的不可变特性。',
      '用 {[1, 2]: "x"} 触发 TypeError，理解可哈希与不可变的绑定关系。',
    ],
    notes: [
      'd[key] 访问可能不存在的键会抛 KeyError，不确定时用 get。',
      'in 判断的是键不是值；集合无序，不保证任何顺序。',
      '空集合要写 set()，{} 是空字典。',
      '元组只有内部元素全可哈希时才可哈希；frozenset 可哈希而 set 不可。',
    ],
    problem: '解决「取值该用下标还是 get、以及为什么可变类型不能当字典键或集合元素」的问题。',
    demo: null,
    demoComponent: PY06DictSets,
    code: PY06Code,
    language: 'python',
  },
  {
    id: 'PY_7',
    title: '推导式与迭代协议',
    navTitle: '推导式',
    category: '数据结构',
    path: '/python/py-7/comprehensions',
    summary: '掌握列表、字典、集合推导式与生成器表达式，并理解它们共同依赖的迭代协议。',
    principle: '推导式把「建空容器 + for + 条件 + 追加」的模板压缩成一行：列表用方括号、字典用「键: 值」的逗号花括号、集合用单表达式的花括号，末尾 if 做过滤，多层 for 表达嵌套。换成圆括号得到生成器表达式，惰性求值、省内存，但只能遍历一次。它之所以能工作，是因为迭代协议：对象实现 __iter__ 返回迭代器，迭代器实现 __next__ 逐个产出，耗尽时抛 StopIteration。',
    flow: [
      '用 [x * x for x in data if x % 2 == 0] 对照手写 for 循环，体会样板被压缩。',
      '用 {w: len(w) for w in words} 与 {x % 3 for x in range(6)} 分别写字典与集合推导。',
      '用 (x * x for x in data) 生成器表达式，反复 next() 观察惰性产出与一次性耗尽。',
      '用 it = iter(seq) 与 next(it) 手动走迭代协议，确认 StopIteration 的时机。',
    ],
    notes: [
      '推导式总是新建容器，不会就地修改原对象。',
      '生成器表达式只能遍历一次，走过就没了，需要复用时先 list() 物化。',
      '多层 for 或复杂条件会断崖式降低可读性，此时应退回普通 for 循环。',
      '空集合要写 set()，{} 是空字典，别把集合推导写成字典。',
    ],
    problem: '解决「如何用一行写完容器转换、以及生成器为何只能取一次」的问题。',
    demo: null,
    demoComponent: PY07Comprehensions,
    code: PY07Code,
    language: 'python',
  },
  {
    id: 'PY_8',
    title: '函数、参数与作用域',
    navTitle: '函数与作用域',
    category: '函数与迭代',
    path: '/python/py-8/functions',
    summary: '掌握返回值规则、位置/默认/关键字/变参四层参数写法、调用处解包，以及 LEGB 作用域查找。',
    principle: '函数没执行到 return 就返回 None，return a, b 其实是返回一个元组再被解包。参数从左到右可叠位置参数、默认参数、关键字参数与 *args/**kwargs，调用处的 * 则是反向拆开容器成一份实参清单。函数体里的名字按 LEGB（Local → Enclosing → Global → Builtins）查找，写回外层需用 global / nonlocal。可变默认参数只在定义时创建一次、被所有调用共享，是新手最常踩的坑。',
    flow: [
      '用 return 与不写 return 对比，确认无 return 时函数返回 None。',
      '用 def f(a, b=1, *args, **kwargs) 依次叠加四层参数，并在调用处用 *items、**options 反向解包。',
      '用嵌套函数演示 LEGB 查找，再用 global / nonlocal 把结果写回外层。',
      '用 def f(x, box=[]) 连续调用两次，复现共享默认列表的累积现象。',
    ],
    notes: [
      '默认参数必须排在不带默认值的位置参数之后，否则语法报错。',
      '可变对象（[]、{}、set()）不要直接当默认值，应写成 None 再在函数体内初始化。',
      '*args / **kwargs 里的名字只是习惯，真正起作用的是星号。',
      '函数是一等对象——可赋值、可作参数、可作返回值，这是闭包与装饰器的起点。',
    ],
    problem: '解决「参数该如何设计、返回值为何有时是 None，以及默认值为何会跨调用累积」的问题。',
    demo: null,
    demoComponent: PY08Functions,
    code: PY08Code,
    language: 'python',
  },
  {
    id: 'PY_9',
    title: '闭包与装饰器',
    navTitle: '装饰器',
    category: '函数与迭代',
    path: '/python/py-9/decorators',
    summary: '从「函数是一等对象」与闭包出发，理解装饰器的本质、functools.wraps 与带参数的装饰器。',
    principle: '装饰器建立在两件事上：函数是一等对象（能被当参数传入、当返回值送出），以及闭包（内层函数连同它引用的外层变量被一起保存下来）。@deco 只是 f = deco(f) 的语法糖，装饰器在被装饰函数定义时就执行一次，用返回值顶替原名字，之后调用到的其实是被包好的新函数。带参数的装饰器要再加一层嵌套吃配置，用 functools.wraps 保住原函数元信息；多个装饰器叠加时从下往上包裹。',
    flow: [
      '用 @log_decorator 装饰函数，观察定义时装饰器就已执行、名字被替换。',
      '在装饰器内层函数里引用外层变量，验证闭包在外层返回后仍能读到它。',
      '用 @functools.wraps(func) 修复被覆盖的函数名与文档字符串。',
      '写 @repeat(2) 这样的带参装饰器，理清「配置 → 装饰器 → wrapper」三层结构。',
    ],
    notes: [
      '装饰器不写 functools.wraps 会丢失原函数的名字与文档字符串。',
      '多个装饰器叠加时，书写在上面的最后包裹、最内层先进入。',
      '闭包捕获的是变量本身而非当时的快照，循环中创建闭包要留意绑定时机。',
      '日志、计时、缓存（lru_cache）、鉴权这类横切关注点最适合交给装饰器。',
    ],
    problem: '解决「如何在不改动函数体的前提下，给一批函数统一加上日志、计时或缓存」的问题。',
    demo: null,
    demoComponent: PY09Decorators,
    code: PY09Code,
    language: 'python',
  },
  {
    id: 'PY_10',
    title: '迭代器与生成器',
    navTitle: '生成器',
    category: '函数与迭代',
    path: '/python/py-10/generators',
    summary: '区分可迭代对象与迭代器，用 yield 写出惰性求值的生成器，并掌握 yield from 与一次性限制。',
    principle: '可迭代对象实现 __iter__ 交出一个迭代器，迭代器实现 __next__ 逐个产出并在耗尽时抛 StopIteration；for 不过是反复 next() 直到该异常。含 yield 的函数会返回生成器对象，它每次取值时才计算下一个元素并暂停，连局部变量状态都保留——这正是惰性求值，让无限序列与大数据流得以从容处理。yield from 与生成器表达式是更省笔墨的写法。生成器只能遍历一次，耗尽后不会复位。',
    flow: [
      '用 iter(seq) 与 next(it) 手动走一遍迭代协议，确认 StopIteration 的出现。',
      '用含 yield 的函数建立生成器，连续 next() 观察「算一半、给一个、接着算」。',
      '用 yield from 转发另一个可迭代对象，用生成器表达式写更紧凑的惰性版本。',
      '把生成器迭代到耗尽，再尝试 next() 与第二次 for，验证它只能走一趟。',
    ],
    notes: [
      '生成器只能遍历一次，需要重复使用时重新调用生成器函数或先 list() 物化。',
      '生成器表达式与列表推导外形相似，区别在于一个是惰性、一个立刻建出整个列表。',
      '生成器适合「一路用过去」的流式处理，不适合需要下标或 len() 的场景。',
      'yield from 比手写 for ... yield 更短也更清晰。',
    ],
    problem: '解决「数据量巨大甚至无限时，如何不把全部元素先造进内存再处理」的问题。',
    demo: null,
    demoComponent: PY10Generators,
    code: PY10Code,
    language: 'python',
  },
  {
    id: 'PY_11',
    title: '类与对象',
    navTitle: '类与对象',
    category: '面向对象',
    path: '/python/py-11/classes',
    summary: '掌握 class、__init__ 与 self，分清实例属性与类属性，以及 @classmethod / @staticmethod 的用途。',
    principle: 'class 把数据与行为捆在一起，__init__ 在创建对象时自动调用、self 指向当前对象。写在 self 上的是实例属性、每个对象各自一份；直接写在类体里的是类属性、被所有实例共享。属性查找先实例的 __dict__、再类、再继承链，因此「读共享、写独占」——在实例上对同名属性赋值会新建实例属性、盖住类属性。@classmethod 第一个参数是 cls 常用于替代构造器，@staticmethod 是挂在类命名空间下的普通函数。',
    flow: [
      '用 class Course 与 __init__ 建立对象，确认 self 由解释器自动传入、不用手写。',
      '用 self.x = ... 写实例属性、在类体里写类属性，对比改动后各自的影响范围。',
      '在实例上给同名类属性赋值，验证它其实新建了实例属性、与类属性脱钩。',
      '用 @classmethod 写 from_dict 替代构造器、用 @staticmethod 放与对象无关的工具方法。',
    ],
    notes: [
      '忘记给方法写 self 会导致调用时参数对不上而报错。',
      '可变的类属性（如 tags = []）会被所有实例共享，每实例独有的东西应在 __init__ 里创建。',
      '属性查找先实例后类再继承链，实例赋值只会盖住而不会改到类属性。',
      '需要访问或创建实例时用 classmethod，纯归类工具用 staticmethod。',
    ],
    problem: '解决「同样是写在类里的名字，为什么有的被实例共享、有的各存一份」的问题。',
    demo: null,
    demoComponent: PY11Classes,
    code: PY11Code,
    language: 'python',
  },
  {
    id: 'PY_12',
    title: '继承、多态与魔法方法',
    navTitle: '继承与多态',
    category: '面向对象',
    path: '/python/py-12/inheritance',
    summary: '掌握继承与 super()、方法解析顺序 MRO、多态与鸭子类型，以及常用魔法方法的作用。',
    principle: '继承把共性上提到父类、差异留在子类，子类可重写方法；super() 用来在重写时复用父类原版再补差异。一个类可多继承，属性查找按方法解析顺序（MRO）依次向上，用 __mro__ 可查看链路。多态让同一句调用由不同对象各自响应，Python 靠鸭子类型实现——只看对象有没有需要的方法，不看它的类是谁。魔术方法（__str__、__repr__、__eq__、__len__、__add__ 等）由解释器在特定时机自动调用，让自定义对象贴合语言习惯；但继承应只用在真正的「是一种」关系上，其余优先组合。',
    flow: [
      '用 class Dog(Animal) 建立继承，在子类重写 speak 并用 super().speak() 复用父类行为。',
      '用 SomeClass.__mro__ 查看多继承下的查找顺序。',
      '用一个循环对一组不同对象喊同一个方法，体会多态与鸭子类型。',
      '重写 __str__ / __repr__ / __len__ / __eq__，观察 print、len()、== 的行为变化。',
    ],
    notes: [
      'super() 让重写能复用父类逻辑，避免把父类代码再抄一遍。',
      '多继承的查找顺序由 MRO 决定，遇到怪行为可用 __mro__ 去解释。',
      'Python 不检查类型、只检查方法，方法名或签名不匹配要到运行时才暴露。',
      '仅为复用几行代码而造继承会把无关的类捆死，非「is-a」关系应改用组合。',
    ],
    problem: '解决「如何复用共有逻辑、同一句调用为何能落到不同对象，以及自定义对象如何融入语言习惯」的问题。',
    demo: null,
    demoComponent: PY12Inheritance,
    code: PY12Code,
    language: 'python',
  },
  {
    id: 'PY_13',
    title: '数据类与类型注解',
    navTitle: '数据类与注解',
    category: '面向对象',
    path: '/python/py-13/dataclasses',
    summary: '用 @dataclass 消除手写的 __init__ / __repr__ / __eq__ 样板，掌握默认值、工厂与 frozen。',
    principle: '@dataclass 自动生成 __init__、__repr__、__eq__，字段通过带类型注解的类属性声明，字段顺序即 __init__ 的参数顺序。默认值要遵守「有默认值的字段须排在没有默认值的字段之后」；默认值若是可变对象，必须用 field(default_factory=...) 让每次构造当场新建一份，避免像函数默认参数那样被共享。frozen=True 提供不可变语义，构造后赋值会抛 FrozenInstanceError，也让对象可哈希。注解本身在运行期不做强制校验，价值在于配合编辑器与静态检查工具。',
    flow: [
      '把字段写成 name: str 这样的带注解类属性，加 @dataclass，对比手写类的篇幅。',
      '给字段设默认值，核对「默认值字段须在后」的顺序规则。',
      '把可变字段的默认值从 [] 改成 field(default_factory=list)，验证各实例各自独立。',
      '给装饰器加 frozen=True，尝试赋值观察 FrozenInstanceError。',
    ],
    notes: [
      '可变字段默认值必须用 field(default_factory=...) 提供。',
      '不写注解的类属性不会被当作字段，因此不会进 __init__。',
      'frozen=True 的对象不可改，可哈希、可当字典键，也便于并发共享。',
      '数据类擅长表达「以装数据为主」的对象，复杂行为繁多的类仍适合手写。',
    ],
    problem: '解决「重复的字段样板如何消除、以及数据对象如何保持不可变与可比较」的问题。',
    demo: null,
    demoComponent: PY13Dataclasses,
    code: PY13Code,
    language: 'python',
  },
  {
    id: 'PY_14',
    title: '异常处理与错误设计',
    navTitle: '异常处理',
    category: '异常与模块',
    path: '/python/py-14/exceptions',
    summary: '掌握 try/except/else/finally 的执行规则、异常类型匹配、raise 与自定义异常，以及 EAFP 风格。',
    principle: 'try 圈住正常流程，except 只接匹配的异常（类型相同或为其子类才匹配），else 只在没有异常时执行，finally 无论是否发生异常都执行——这正是它能在异常未被处理时仍完成清理的原因。except 匹配的是类型，子类必须排在父类之前，否则宽泛的分支会先接走一切。用 raise 主动抛出，用自定义异常表达业务错误，用 raise ... from 保住异常链。捕获范围要小而具体，别用裸 except 或 pass 吞掉错误；出错概率低时用 EAFP 让主流程更干净。',
    flow: [
      '用 try/except/else/finally 演练无异常、抛 ValueError、抛 KeyError 三种走向。',
      '用 except (ValueError, TypeError) 与逐个 except 对比匹配范围与顺序。',
      '用 raise ValueError(...) 主动抛出，用自定义异常类区分业务错误，用 raise ... from 保留原始原因。',
      '用 LBYL（先判断）与 EAFP（先执行再捕获）各写一遍同逻辑，对比代码结构。',
    ],
    notes: [
      'finally 一定执行，包括异常未被接住、正向上抛时。',
      '子类 except 必须排在父类之前，否则永远轮不到。',
      '别用裸 except 或 except Exception: pass，会把 KeyboardInterrupt 或真正的缺陷一并吞掉。',
      '自定义异常应继承 Exception，而不是笼统的 BaseException。',
    ],
    problem: '解决「错误该捕获还是该抛出、异常分支如何排布，以及清理代码为什么必须执行」的问题。',
    demo: null,
    demoComponent: PY14Exceptions,
    code: PY14Code,
    language: 'python',
  },
  {
    id: 'PY_15',
    title: '模块、包与导入机制',
    navTitle: '模块与包',
    category: '异常与模块',
    path: '/python/py-15/modules',
    summary: '从「模块是对象」出发，掌握 import 的各种写法、包与 __init__.py、绝对/相对导入与导入陷阱。',
    principle: '一个 .py 文件就是一个模块对象，import 只是把名字绑定到那个对象上。拆成目录后，带 __init__.py 的目录才成为包，可按层级导入；__init__.py 会在包被导入时执行，并可用 __all__ 约束 import * 的范围。绝对导入写完整路径、放之四海皆准，相对导入用点号、只能在包内使用——直接运行含相对导入的模块会抛 ImportError。解释器按 sys.path 顺序搜索模块，因此自建文件不要与标准库重名，也要提防导入副作用与循环导入。',
    flow: [
      '用 import math、from math import sqrt、import math as m 对比绑定的名字。',
      '用 if __name__ == "__main__": 把「入口脚本」与「可复用模块」分开。',
      '给目录加上 __init__.py 立成包，用绝对导入与相对导入各写一条。',
      '构造循环导入（a 引 b、b 引 a）复现问题，再用延迟导入或拆公共依赖修复。',
    ],
    notes: [
      '同一模块只在首次导入时执行一次，之后直接复用 sys.modules 里的缓存。',
      '相对导入依赖已知的包上下文，脱离包直接运行会抛 ImportError。',
      '导入会自上而下执行模块顶层代码，副作用大的动作应收进函数并用 __main__ 守住。',
      '自建文件名不要与标准库重名，否则可能抢走标准库模块。',
    ],
    problem: '解决「代码拆成多文件后谁引用谁、以及换一种运行方式为何导入就失败」的问题。',
    demo: null,
    demoComponent: PY15Modules,
    code: PY15Code,
    language: 'python',
  },
  {
    id: 'PY_16',
    title: '虚拟环境与依赖管理',
    navTitle: '虚拟环境',
    category: '异常与模块',
    path: '/python/py-16/environments',
    summary: '用虚拟环境隔离项目依赖，掌握创建与激活、requirements.txt 与 pyproject.toml 的分工。',
    principle: '直接在系统 Python 上 pip install 会把依赖装进全局环境，导致多项目版本冲突、污染系统解释器、换机器无法复现。虚拟环境为每个项目建一份专属的、独立的 site-packages，用 python -m venv .venv 创建、激活后 python 与 pip 才指向它。依赖表达分两种：requirements.txt 冻结精确版本用于复现，pyproject.toml 声明版本范围表达意图，再配锁文件固定这次解析的结果。底线是业务依赖一律装进项目环境，不碰系统 Python。',
    flow: [
      '用 python -m venv .venv 创建环境，按平台激活并确认提示符出现 (.venv)。',
      '在激活状态下 pip install requests，确认包装进项目而非系统环境。',
      '用 pip freeze > requirements.txt 冻结精确版本，再用 pip install -r 还原。',
      '在 pyproject.toml 里声明版本范围与可选依赖，理解「声明范围」与「锁定结果」的区别。',
    ],
    notes: [
      '没激活时敲 pip install 装的是系统 Python，这是「装了却没生效」的常见原因。',
      '不要往系统 Python（尤其 Linux 的系统解释器）里装业务依赖。',
      'requirements.txt 记精确版本便于复现，pyproject.toml 写范围便于表达意图。',
      'pyenv 管版本、venv 管隔离、pip 管安装，uv/poetry/pdm 把三者打包成一站式。',
    ],
    problem: '解决「同一份代码在别人机器上缺包、以及多项目依赖版本互相顶掉」的问题。',
    demo: null,
    demoComponent: PY16Environments,
    code: PY16Code,
    language: 'python',
  },
  {
    id: 'PY_17',
    title: '文件读写与路径操作',
    navTitle: '文件与路径',
    category: '标准库',
    path: '/python/py-17/file-io',
    summary: '掌握文件打开模式、显式编码、with 上下文管理器、大文件读取，以及 pathlib 路径操作。',
    principle: '模式决定打开文件那一刻做什么：r 只读、w 一打开就清空文件、a 追加保留原内容、r+ 可读可写且不清空。文本文件必须显式写 encoding="utf-8"，否则默认编码随平台变化会导致乱码或 UnicodeDecodeError。用 with 圈住资源生命周期，离开代码块时自动关闭，异常时也照样执行。读大文件不要 read()，直接迭代文件对象逐行读取，内存占用恒定。路径操作交给 pathlib.Path，用 / 拼路径、用 .suffix/.parent 拆解、用 .exists()/.glob() 判断与匹配。',
    flow: [
      '用 r / w / a / r+ 分别打开同一文件，对比「是否清空、指针在哪」。',
      '用 with open("data.txt", "r", encoding="utf-8") as f 读取，确认退出即自动关闭。',
      '用一个假的大文件场景，对比 read() 与 for line in f: 的内存差别。',
      '用 Path("data") / "2024" / "log.txt" 拼接并读取 .name / .suffix / .exists()。',
    ],
    notes: [
      'w 模式在打开瞬间就清空文件，与是否真正写入无关，想保留旧内容用 a。',
      '文本文件永远显式指定 encoding="utf-8"，别赌平台默认值。',
      '大文件用逐行迭代而不是 read() 或 readlines()，避免整份读进内存。',
      '用 with 打开文件，免得漏写 close() 或异常时丢数据。',
    ],
    problem: '解决「文件内容莫名消失、读写出现乱码，以及大文件读取吃爆内存」的问题。',
    demo: null,
    demoComponent: PY17FileIO,
    code: PY17Code,
    language: 'python',
  },
  {
    id: 'PY_18',
    title: '日期时间、正则与 JSON',
    navTitle: '标准库',
    category: '标准库',
    path: '/python/py-18/stdlib',
    summary: '用 datetime 做时间对象与算术、用 re 匹配与替换文本、用 json 在对象与文本间互转。',
    principle: '时间是对象不是字符串：strftime 把对象格式化成字符串、strptime 按格式串把字符串解析成对象，两者方向相反；datetime 相减得到 timedelta，timedelta 又能反过来加到日期上，自动处理跨月跨年与闰年。不带时区的朴素对象不知道自己属于哪个时区，跨时区换算前用 zoneinfo 明确归属。正则常用 search/findall/sub/compile，分组用圆括号，group(0) 是整段匹配。JSON 用 dumps/loads 互转，注意 ensure_ascii 影响中文、indent 影响美化，元组与 datetime 不能直接序列化。',
    flow: [
      '用 strptime 解析时间字符串、用 strftime 格式化输出，核对格式串逐字符对齐。',
      '用 datetime + timedelta(days=7) 做日期加减，对比字符串拼接的错误结果。',
      '用 re.search / findall / sub / compile 处理文本，并用分组拆出子串。',
      '用 json.dumps(obj, ensure_ascii=False, indent=2) 与 json.loads(text) 完成往返。',
    ],
    notes: [
      'strftime 是格式化（对象→字符串），strptime 是解析（字符串→对象），别记反。',
      '朴素 datetime 不带时区，跨时区换算前先用 zoneinfo 补上 tzinfo。',
      '正则模式用 r"" 原始字符串，避免反斜杠被二次转义；循环里用 compile 预编译。',
      'JSON 没有元组和 datetime，直接序列化会抛 TypeError，需先转成字符串或列表。',
    ],
    problem: '解决「时间为何不能用字符串算、文本如何按模式提取，以及对象与 JSON 如何稳定互转」的问题。',
    demo: null,
    demoComponent: PY18Stdlib,
    code: PY18Code,
    language: 'python',
  },
  {
    id: 'PY_19',
    title: '并发编程：线程与进程',
    navTitle: '并发编程',
    category: '进阶能力',
    path: '/python/py-19/concurrency',
    summary: '理解 GIL 的影响，按瓶颈选择 threading 或 multiprocessing，并用 concurrent.futures 统一并发。',
    principle: 'CPython 的全局解释器锁（GIL）保证同一时刻只有一个线程执行字节码，因此纯 Python 计算无法靠多线程加速；但线程执行阻塞 I/O 时会释放 GIL，所以 I/O 密集任务用 threading 仍能显著提速，CPU 密集任务则应改用 multiprocessing 绕开 GIL、吃满多核。进程不共享内存，数据要序列化后传递，开销可观。concurrent.futures 用 ThreadPoolExecutor / ProcessPoolExecutor 统一两种池的接口，map 按输入顺序返回、submit 拿 Future、as_completed 让先完成的先产出；共享状态必须用 Lock 保护。',
    flow: [
      '对同一批任务分别串行与多线程执行，观察总耗时随瓶颈（I/O vs CPU）的不同变化。',
      '用 threading.Thread 启动线程并以 join() 等待，用 Lock 保护共享计数器。',
      '用 ProcessPoolExecutor 跑 CPU 密集任务，对比线程版本确认加速来源。',
      '用 executor.map 与 as_completed 两种方式收集结果，体会顺序返回与先到先处理。',
    ],
    notes: [
      'GIL 限制纯计算并行，不阻止 I/O 等待重叠，判断依据是瓶颈在「等」还是「算」。',
      '进程间传参要序列化（pickle），传大对象或频繁通信会明显变慢。',
      '进程数超过 CPU 核数只会增加调度与序列化成本。',
      '共享状态必须加锁，read-modify-write 不是原子操作；能靠消息传递就别共享。',
    ],
    problem: '解决「加了线程为什么没变快、以及 I/O 密集与 CPU 密集各该用什么并发方案」的问题。',
    demo: null,
    demoComponent: PY19Concurrency,
    code: PY19Code,
    language: 'python',
  },
  {
    id: 'PY_20',
    title: '异步编程与 asyncio',
    navTitle: '异步编程',
    category: '进阶能力',
    path: '/python/py-20/asyncio',
    summary: '用 async def 与 await 写协程，理解事件循环调度、gather/create_task 并发与 wait_for 超时。',
    principle: '协程用 async def 定义，可以被暂停与恢复；await 在等待点把控制权交给事件循环，让它去调度别的协程——暂停的是这个协程而非整个线程。asyncio.run 负责创建事件循环并跑完入口协程。asyncio.gather 一次性并发多个协程并按传入顺序返回结果，create_task 先启动后等待；只创建协程对象而不 await 或包成 task 并不会执行它。异步的优势来自等待期间不浪费线程，但前提是任务确为 I/O 等待；在协程里调用同步阻塞函数会把整个事件循环卡死。wait_for 为等待设上限，超时即取消。',
    flow: [
      '用 async def 定义协程、用 await asyncio.sleep 模拟 I/O，观察三个等待如何重叠成 1 秒。',
      '用 asyncio.run(main()) 作为脚本入口，启动事件循环。',
      '用 gather 一次性并发、用 create_task 先启动后 await，对比两种并发写法。',
      '用 asyncio.wait_for(coro, timeout) 给外部调用设上限，观察超时取消。',
    ],
    notes: [
      '协程函数调用后只是创建了协程对象，必须 await 或包成 task 才会执行，否则会收到未 await 的警告。',
      '切勿在协程里调用 time.sleep、同步 requests.get、open 等阻塞函数，会卡死整个事件循环。',
      '异步只对 I/O 等待有效，纯计算任务改用多进程或线程池。',
      '给所有外部调用都加上 wait_for 超时，是异步程序的必备防御。',
    ],
    problem: '解决「大量并发 I/O 请求如何用单线程高效处理，以及为何有时 await 了却卡住整个程序」的问题。',
    demo: null,
    demoComponent: PY20Asyncio,
    code: PY20Code,
    language: 'python',
  },
]

import type { Component } from 'vue'
import type { Lesson } from '../lessons'
import { restoreCodeSource } from '../code-restore'
import CPP01Demo from '../../demos/CPP01ProgramStructureArticle.vue'
import CPP02Demo from '../../demos/CPP02VariablesTypesArticle.vue'
import CPP03Demo from '../../demos/CPP03OperatorsExpressionsArticle.vue'
import CPP04Demo from '../../demos/CPP04ControlFlowArticle.vue'
import CPP05Demo from '../../demos/CPP05FunctionsArticle.vue'
import CPP06Demo from '../../demos/CPP06ArraysStringsArticle.vue'
import CPP07Demo from '../../demos/CPP07PointersReferencesArticle.vue'
import CPP08Demo from '../../demos/CPP08DynamicMemoryArticle.vue'
import CPP09Demo from '../../demos/CPP09ClassesObjectsArticle.vue'
import CPP10Demo from '../../demos/CPP10CtorDtorArticle.vue'
import CPP11Demo from '../../demos/CPP11CopyControlArticle.vue'
import CPP12Demo from '../../demos/CPP21MoveSemanticsArticle.vue'
import CPP13Demo from '../../demos/CPP12InheritanceArticle.vue'
import CPP14Demo from '../../demos/CPP13PolymorphismArticle.vue'
import CPP15Demo from '../../demos/CPP14OperatorOverloadingArticle.vue'
import CPP16Demo from '../../demos/CPP15TemplatesBasicsArticle.vue'
import CPP17Demo from '../../demos/CPP16StlSequenceContainersArticle.vue'
import CPP18Demo from '../../demos/CPP17StlAssociativeContainersArticle.vue'
import CPP19Demo from '../../demos/CPP18IteratorsAlgorithmsArticle.vue'
import CPP20Demo from '../../demos/CPP19LambdaExpressionsArticle.vue'
import CPP21Demo from '../../demos/CPP20SmartPointersArticle.vue'
import CPP22Demo from '../../demos/CPP26ModernCppCoreArticle.vue'
import CPP23Demo from '../../demos/CPP23ExceptionHandlingArticle.vue'
import CPP24Demo from '../../demos/CPP24FileIOArticle.vue'
import CPP25Demo from '../../demos/CPP25ConcurrencyArticle.vue'
// 该分类专属的演示样式，随分类数据一起按需加载
import '../../styles/category-cpp.css'

const vueCodeModules = import.meta.glob<string>('../../demos/*.vue', { query: '?raw', import: 'default' })
const jsxCodeModules = import.meta.glob<string>('../../demos/react-jsx/*.jsx', { query: '?raw', import: 'default' })
const stateCodeModules = import.meta.glob<string>('../../demos/state-react/*.js', { query: '?raw', import: 'default' })
const jsCodeModules = import.meta.glob<string>('../../demos/js-code/*.js', { query: '?raw', import: 'default' })
const tsCodeModules = import.meta.glob<string>('../../demos/ts-code/*.ts', { query: '?raw', import: 'default' })
const styleCodeModules = import.meta.glob<string>('../../demos/style-code/*', { query: '?raw', import: 'default' })
const cppCodeModules = import.meta.glob<string>('../../demos/cpp-code/*', { query: '?raw', import: 'default' })

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
            : path.startsWith('cpp-code/')
              ? cppCodeModules
            : vueCodeModules
  const loader = modules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到内容源码：${path}`)
  return () => loader().then(restoreCodeSource)
}

const CPP1Code = createCodeLoader('cpp-code/CPP1Code.cpp.txt')
const CPP2Code = createCodeLoader('cpp-code/CPP2Code.cpp.txt')
const CPP3Code = createCodeLoader('cpp-code/CPP3Code.cpp.txt')
const CPP4Code = createCodeLoader('cpp-code/CPP4Code.cpp.txt')
const CPP5Code = createCodeLoader('cpp-code/CPP5Code.cpp.txt')
const CPP6Code = createCodeLoader('cpp-code/CPP6Code.cpp.txt')
const CPP7Code = createCodeLoader('cpp-code/CPP7Code.cpp.txt')
const CPP8Code = createCodeLoader('cpp-code/CPP8Code.cpp.txt')
const CPP9Code = createCodeLoader('cpp-code/CPP9Code.cpp.txt')
const CPP10Code = createCodeLoader('cpp-code/CPP10Code.cpp.txt')
const CPP11Code = createCodeLoader('cpp-code/CPP11Code.cpp.txt')
const CPP12Code = createCodeLoader('cpp-code/CPP12Code.cpp.txt')
const CPP13Code = createCodeLoader('cpp-code/CPP13Code.cpp.txt')
const CPP14Code = createCodeLoader('cpp-code/CPP14Code.cpp.txt')
const CPP15Code = createCodeLoader('cpp-code/CPP15Code.cpp.txt')
const CPP16Code = createCodeLoader('cpp-code/CPP16Code.cpp.txt')
const CPP17Code = createCodeLoader('cpp-code/CPP17Code.cpp.txt')
const CPP18Code = createCodeLoader('cpp-code/CPP18Code.cpp.txt')
const CPP19Code = createCodeLoader('cpp-code/CPP19Code.cpp.txt')
const CPP20Code = createCodeLoader('cpp-code/CPP20Code.cpp.txt')
const CPP21Code = createCodeLoader('cpp-code/CPP21Code.cpp.txt')
const CPP22Code = createCodeLoader('cpp-code/CPP22Code.cpp.txt')
const CPP23Code = createCodeLoader('cpp-code/CPP23Code.cpp.txt')
const CPP24Code = createCodeLoader('cpp-code/CPP24Code.cpp.txt')
const CPP25Code = createCodeLoader('cpp-code/CPP25Code.cpp.txt')

export const lessons: Lesson[] = [
{
    id: 'CPP_1',
    title: '程序结构、编译流程与第一个 C++ 程序',
    navTitle: '程序结构',
    category: '基础入门',
    path: '/cpp/cpp-1/program-structure',
    summary: '理解 C++ 程序的基本结构、编译链接流程，以及从源代码到可执行文件的完整过程。',
    principle: 'C++ 程序从 main 函数开始执行。一个完整的 C++ 程序通常包含：预处理指令（#include）、函数定义、变量声明和语句。编译流程分为四个阶段：预处理（展开宏、处理 #include）、编译（生成汇编代码）、汇编（生成目标文件 .o/.obj）、链接（合并目标文件和库，生成可执行文件）。理解这一流程有助于诊断编译错误和链接错误。',
    flow: [
      '编写源代码（.cpp 文件），包含必要的头文件（#include <iostream>）。',
      '预处理阶段展开头文件和处理宏定义。',
      '编译阶段将 C++ 代码转换为汇编代码，进行语法检查和类型检查。',
      '汇编阶段将汇编代码转换为机器码，生成目标文件。',
      '链接阶段合并所有目标文件和库文件，解析外部符号引用，生成最终可执行文件。',
    ],
    notes: [
      'main 函数是程序的入口点，操作系统调用 main 开始执行程序。',
      '编译错误在编译阶段发现（语法错误、类型错误）；链接错误在链接阶段发现（未定义引用、重复定义）。',
      '使用 g++ -E 查看预处理结果，g++ -S 查看汇编代码，g++ -c 只编译不链接。',
      '分离编译（将程序分为多个 .cpp 文件）可以缩短编译时间，便于团队协作。',
      '头文件（.h/.hpp）通常包含声明，源文件（.cpp）包含实现，防止代码重复。',
    ],
    problem: '解决"C++ 程序是如何从源代码变成可执行文件的，以及如何理解编译和链接错误"的问题。',
    demo: null,
    demoComponent: CPP01Demo,
    code: CPP1Code,
    language: 'cpp',
  },
{
    id: 'CPP_2',
    title: '变量、基本类型与输入输出',
    navTitle: '变量与类型',
    category: '基础入门',
    path: '/cpp/cpp-2/variables-types',
    summary: '掌握 C++ 基本内置类型的取值范围、变量声明与初始化方式，以及标准输入输出的基本用法。',
    principle: 'C++ 是静态类型语言，每个变量在使用前必须有明确的类型。基本内置类型分为四类：整数类型（short、int、long、long long 及各自的无符号版本）、浮点类型（float、double、long double）、字符类型（char、wchar_t、char16_t、char32_t）和布尔类型（bool）。C++11 引入统一初始化（花括号），会在编译期拒绝窄化转换。理解各类型的宽度与取值范围、有符号与无符号的差异，是写出无溢出代码的前提。std::cin / std::cout 提供类型安全的流式输入输出。',
    flow: [
      '按取值范围与是否需要负数选择整数类型，默认首选 int（与机器字长匹配，性能最好）。',
      '用统一初始化（int x{5};）或直接初始化（int x = 5;）声明变量，避免未初始化即使用。',
      '区分变量的作用域（全局、局部、块）与生命周期，就近声明以限制可见范围。',
      '用 const 与 constexpr 表达不可修改的常量，让编译器帮助检查。',
      '通过 std::cin / std::cout 读写数据，理解流式输入的类型匹配与失败状态。',
    ],
    notes: [
      'int 通常最适合整数运算；long long 保证至少 64 位；short 很少有必要。',
      '统一初始化会在编译期检查窄化转换（如 int x{3.14}; 报错），圆括号或赋值形式则不会。',
      'char 是否有符号由实现定义，处理小整数时应明确写 signed char 或 unsigned char。',
      '有符号与无符号混用时，有符号会转换为无符号，导致 -1 < 0u 判断为 false 这类陷阱。',
      'std::cin >> x 遇到不匹配的输入会置失败状态，需用 std::cin.fail() 检查并清理缓冲区。',
    ],
    problem: '解决"如何选择合适的数据类型、正确初始化变量，以及安全地进行输入输出"的问题。',
    demo: null,
    demoComponent: CPP02Demo,
    code: CPP2Code,
    language: 'cpp',
  },
{
    id: 'CPP_3',
    title: '运算符、表达式与类型转换',
    navTitle: '运算符',
    category: '基础入门',
    path: '/cpp/cpp-3/operators-expressions',
    summary: '理解 C++ 各类运算符的优先级、结合律、求值顺序，以及整数提升和算术转换规则。',
    principle: 'C++ 运算符分为算术、关系、逻辑、位、赋值、条件、逗号、成员访问等类别，各自有优先级与结合律，复杂表达式应显式加括号。关于求值顺序，C++17 仅对赋值、复合赋值、&&、||、?:、逗号运算符规定了左操作数先于右操作数求值，其余多数运算符的子表达式顺序仍未指定，因此同一表达式中若一处修改了另一处将要读取的对象（如 i = i++），行为未定义。整数提升把小整数类型提升为 int；算术转换再按类型等级把两个操作数统一到共同类型。显式类型转换推荐 static_cast 等具名转换。',
    flow: [
      '熟悉运算符优先级表，用括号明确复杂表达式的意图，不依赖记忆。',
      '理解 && 与 || 的短路求值：左操作数已决定结果时不求值右操作数。',
      '区分前缀 ++i（返回新值）与后缀 i++（返回旧值），迭代器场景优先前缀。',
      '掌握整数提升与算术转换，预测表达式中每个中间结果的类型。',
      '避免未定义行为：不要在同一表达式中多次修改同一变量。',
    ],
    notes: [
      '优先级由高到低大致为：:: > 成员访问 > 后缀自增减 > 前缀自增减与一元 > 算术 > 关系 > 位 > 逻辑 > 条件 > 赋值 > 逗号。',
      'C++17 明确了赋值、&&、||、?:、逗号运算符的求值顺序，其余仍应避免依赖顺序。',
      '整数提升解释了为什么两个 char 相加得到 int：小类型先提升到 int 再运算。',
      '移位运算符的右操作数必须非负且小于左操作数的位宽，否则行为未定义。',
      '比较浮点数不宜直接用 ==，应判断差值是否小于一个公差（如 std::abs(a - b) < 1e-9）。',
    ],
    problem: '解决"如何理解复杂表达式的求值过程、避免运算符优先级陷阱和未定义行为"的问题。',
    demo: null,
    demoComponent: CPP03Demo,
    code: CPP3Code,
    language: 'cpp',
  },
{
    id: 'CPP_4',
    title: '控制流：条件分支与循环',
    navTitle: '控制流',
    category: '基础入门',
    path: '/cpp/cpp-4/control-flow',
    summary: '掌握条件判断、循环结构和跳转语句，以及 C++11 引入的范围 for 循环。',
    principle: 'C++ 提供多种控制流语句：if/else 处理条件分支；switch 基于整型常量做多路分支（注意 case 穿透，通常需 break）；while 与 do-while 实现条件循环，后者至少执行一次；for 把初始化、条件、更新集中在一处；C++11 的范围 for 可遍历任何提供 begin()/end() 的对象，更安全简洁。跳转语句包括 break（跳出循环或 switch）、continue（跳过本次迭代）、return（返回函数结果）。C++17 允许在 if/switch 的条件位置声明并初始化变量，把变量作用域限制在分支内部。',
    flow: [
      '用 if/else if/else 处理互斥条件；浮点数比较改用公差而非等号。',
      '用 switch 处理基于整型常量的多路分支，逐 case 加 break，故意穿透时用 [[fallthrough]] 标注。',
      '已知迭代次数用 for，条件驱动用 while，至少执行一次用 do-while。',
      '用范围 for 遍历容器：需要修改元素用 auto&，只读用 const auto&。',
      '用 C++17 的条件内初始化（if (auto it = m.find(k); it != m.end())）缩小变量作用域。',
    ],
    notes: [
      'switch 的 case 标签必须是整型常量表达式，不能是字符串或浮点数。',
      '范围 for 遍历过程中不要增删容器元素，否则迭代器失效，应改用传统 for 或 while。',
      'for (;;) 是无限循环，需在循环体内用 break 或 return 退出。',
      '范围 for 默认按值拷贝元素，大对象务必写引用以避免无谓拷贝。',
      '把循环内不随迭代变化的计算提到循环外，可显著减少重复开销。',
    ],
    problem: '解决"如何选择合适的条件与循环结构、处理分支穿透和遍历容器"的问题。',
    demo: null,
    demoComponent: CPP04Demo,
    code: CPP4Code,
    language: 'cpp',
  },
{
    id: 'CPP_5',
    title: '函数：参数传递、重载与递归',
    navTitle: '函数',
    category: '函数',
    path: '/cpp/cpp-5/functions',
    summary: '掌握函数定义、参数传递方式、函数重载与递归，以及函数指针的基本用法。',
    principle: '函数把一段逻辑封装成可复用的单元，由返回类型、函数名、参数列表和函数体组成。参数传递有三种基本方式：值传递（拷贝实参，函数内修改不影响外部）、引用传递（直接操作实参，写 auto& 或 T&）、const 引用传递（避免拷贝又禁止修改，是只读大对象的首选）。函数重载允许同名函数依据参数列表（个数或类型）区分，编译器按重载决议选择最匹配的版本。递归是函数调用自身，必须包含终止条件，否则导致栈溢出。',
    flow: [
      '按是否需要修改实参、是否需要避免拷贝，在值传递、引用传递、const 引用之间选择。',
      '为常用参数提供默认实参，注意默认值只能在声明或定义中给一次。',
      '用同名函数重载表达语义相同但参数不同的操作，避免参数类型隐式转换带来的歧义。',
      '编写递归时先写终止条件，再写向终止条件收敛的递归步骤。',
      '需要把函数作为参数或数据时使用函数指针或 std::function。',
    ],
    notes: [
      '只读的大对象一律用 const 引用传递，避免整块拷贝。',
      '函数重载靠参数列表区分，返回类型不同不能构成重载。',
      '默认实参从最右侧开始提供，调用时只能从左到右省略。',
      '递归深度受调用栈大小限制，深度不确定时应改为迭代。',
      '内联（inline）建议编译器内联展开小函数，可减少调用开销，但不保证一定展开。',
    ],
    problem: '解决"如何选择合适的参数传递方式、正确重载函数，以及安全地实现递归"的问题。',
    demo: null,
    demoComponent: CPP05Demo,
    code: CPP5Code,
    language: 'cpp',
  },
{
    id: 'CPP_6',
    title: '数组、C 风格字符串与 std::string',
    navTitle: '数组与字符串',
    category: '复合类型',
    path: '/cpp/cpp-6/arrays-strings',
    summary: '掌握内置数组、C 风格字符串的用法与局限，以及 std::string 和 std::array 的现代替代方案。',
    principle: '内置数组是类型相同元素的连续存储，声明为 T arr[N]，元素个数 N 必须是编译期常量。数组名在多数表达式中会「退化」为指向首元素的指针，因此无法直接获得长度，越界访问也不会被编译器检查。C 风格字符串是以 0（空字符 \'\\0\'）结尾的 char 数组，所有处理函数都依赖这个结尾标记。std::string 封装了长度与自动管理的内存，提供拼接、查找、子串等操作；std::array 与 std::vector 则在保留定长或动态增长语义的同时避免了裸数组的长度丢失问题。',
    flow: [
      '需要固定小规模、长度已知的序列时可用内置数组，但优先考虑 std::array。',
      '使用数组时始终单独记录长度或改用范围 for，避免依赖 sizeof 之外的猜测。',
      '处理 C 风格字符串时确保结尾有 \'\\0\'，防止越界读取。',
      '日常字符串处理优先用 std::string，用 c_str() 在需要时才转为 C 风格字符串。',
      '需要动态增长的序列用 std::vector，需要定长且带边界信息的数组用 std::array。',
    ],
    notes: [
      '数组名退化后不能再取 sizeof 得到元素个数，sizeof(arr) 只在未退化的同一作用域内有效。',
      '内置数组不检查下标越界，写出界是未定义行为；std::array 提供 at() 做越界检查。',
      'C 风格字符串的 \'\\0\' 是结束标记，不计入可见字符但占用存储。',
      'std::string 的 size() 返回不含结束符的字符数，与 C 风格字符串的 strlen 语义一致。',
      'std::string 支持比较、拼接和迭代器遍历，尽量避免在 C++ 中手写字符数组。',
    ],
    problem: '解决"如何管理定长与动态序列、正确处理字符串边界，以及在内置数组与标准库容器间取舍"的问题。',
    demo: null,
    demoComponent: CPP06Demo,
    code: CPP6Code,
    language: 'cpp',
  },
{
    id: 'CPP_7',
    title: '指针与引用：地址、解引用与别名',
    navTitle: '指针与引用',
    category: '复合类型',
    path: '/cpp/cpp-7/pointers-references',
    summary: '理解指针的地址与解引用语义、引用的别名本质，以及两者的取舍与常见陷阱。',
    principle: '指针保存的是地址：&x 取变量地址，*p 解引用访问所指对象，nullptr 表示空指针。指针支持算术运算，与数组退化后的首地址天然配合。引用是已存在对象的别名，定义时必须绑定且之后不可改绑，对引用的一切操作都作用于原对象。指针可为空、可改指向、可做算术，但需要显式解引用且易引入悬垂与野指针；引用更安全简洁，适合作为参数与返回值。理解 const 在指针声明中的位置（T* const 与 const T*）是读代码的必修课。',
    flow: [
      '需要「可空、可改指向」时用指针，需要「始终指向同一对象」时用引用。',
      '初始化指针时立即赋 nullptr 或有效地址，不留未初始化的悬垂隐患。',
      '用 nullptr 而非 NULL 或 0 表示空指针，避免与整数 0 的重载歧义。',
      '作为参数和返回值时优先用引用或 const 引用，减少解引用与空值判断。',
      '区分 const T*（指向常量）、T* const（常量指针）与 const T* const 三种写法。',
    ],
    notes: [
      '指针未初始化即使用属于未定义行为，野指针往往表现为随机崩溃。',
      '所指对象生命周期结束后指针变为悬垂指针，解引用它同样是未定义行为。',
      '引用一旦绑定不可更改，想换目标只能改指针。',
      '指针算术只对同一数组内的元素有意义，越出范围则未定义。',
      'const T* 可接受非 const 对象地址，反向赋值则不允许，这是 const 正确性的一环。',
    ],
    problem: '解决"如何正确使用指针与引用、避免悬垂与野指针，以及按 const 语义读懂声明"的问题。',
    demo: null,
    demoComponent: CPP07Demo,
    code: CPP7Code,
    language: 'cpp',
  },
{
    id: 'CPP_8',
    title: '动态内存管理：new/delete 与内存布局',
    navTitle: '动态内存',
    category: '内存管理',
    path: '/cpp/cpp-8/dynamic-memory',
    summary: '理解栈、堆与全局区的内存布局，掌握 new/delete 的配对使用与常见内存错误。',
    principle: '程序的内存大致分为：栈（局部变量与函数调用信息，自动分配释放，空间小但快）、堆（new/malloc 申请，手动释放，空间大）、全局/静态区（全局变量与静态变量）。动态内存用 new 申请、delete 释放；数组用 new[] 申请、delete[] 释放，两者必须配对，混用是未定义行为。忘记释放导致内存泄漏；释放后继续使用或重复释放是更危险的问题。RAII 的核心思想就是把资源生命周期绑定到对象上，用析构函数自动释放，这正是智能指针的基础。',
    flow: [
      '评估对象是否需要超出作用域存活，只有确有必要时才使用动态分配。',
      'new 与 delete、new[] 与 delete[] 严格配对，不要混用。',
      '释放后立即把指针置为 nullptr，防止误用悬垂指针。',
      '优先用标准容器或智能指针替代裸 new/delete，让释放自动化。',
      '怀疑内存问题时用 AddressSanitizer 等工具定位泄漏与越界。',
    ],
    notes: [
      '栈空间有限，递归过深或存放超大对象会导致栈溢出。',
      'new 失败会抛出 std::bad_alloc；new(std::nothrow) 则返回空指针。',
      '对同一个指针重复 delete 是未定义行为，置 nullptr 后的 delete 则安全。',
      '动态数组的每个元素都会被构造，delete[] 会逐个析构，不可用 delete 代替。',
      'RAII 思想：把「申请—使用—释放」收进一个类，让析构函数负责释放，异常也不会漏。',
    ],
    problem: '解决"如何安全地进行动态内存分配与释放、避免泄漏和悬垂，以及理解 RAII 的动机"的问题。',
    demo: null,
    demoComponent: CPP08Demo,
    code: CPP8Code,
    language: 'cpp',
  },
{
    id: 'CPP_9',
    title: '类与对象：封装、访问控制与 this 指针',
    navTitle: '类与对象',
    category: '面向对象',
    path: '/cpp/cpp-9/classes-objects',
    summary: '掌握类的定义、成员与访问控制、this 指针以及 const 成员函数等封装机制。',
    principle: '类把数据（成员变量）与操作数据的函数（成员函数）封装成一个整体，通过访问控制符 public、private、protected 决定外部可见性。封装的意义在于：对外只暴露必要的接口，内部实现可以自由改动而不影响使用者。成员函数内部可以通过 this 指针访问当前对象，从而区分同名成员与参数。把不修改对象状态的成员函数声明为 const，既是接口契约，也让 const 对象能正常调用。struct 与 class 的唯一差别是默认访问级别不同（public 与 private）。',
    flow: [
      '把成员变量设为 private，只通过 public 成员函数访问，保护内部不变式。',
      '用 this 指针区分成员变量与同名参数，或返回对象自身以支持链式调用。',
      '把不修改状态的成员函数声明为 const，使接口语义清晰且兼容 const 对象。',
      '用静态成员表达属于类而非某个实例的数据或行为。',
      '谨慎使用友元：它破坏封装，只在运算符重载等确有需要时开放。',
    ],
    notes: [
      '成员变量默认在 class 中是 private，在 struct 中是 public，其余完全相同。',
      'const 成员函数不能修改成员变量，除非该成员声明为 mutable。',
      'this 是指向当前对象的指针，静态成员函数没有 this。',
      '封装的目标是维护不变式：所有对内部的修改都应经过成员函数。',
      '友元能访问私有成员，但会削弱封装，使用需有明确理由。',
    ],
    problem: '解决"如何用类封装数据与行为、通过访问控制保护内部状态，以及正确使用 this 与 const 成员函数"的问题。',
    demo: null,
    demoComponent: CPP09Demo,
    code: CPP9Code,
    language: 'cpp',
  },
{
    id: 'CPP_10',
    title: '构造函数、析构函数与对象生命周期',
    navTitle: '构造与析构',
    category: '面向对象',
    path: '/cpp/cpp-10/ctor-dtor',
    summary: '掌握各类构造函数、初始化列表、析构函数与成员/对象的初始化析构顺序。',
    principle: '构造函数在对象创建时初始化其状态，形式包括默认构造、带参构造、拷贝构造和委托构造。初始化列表是初始化的正规途径：它在进入函数体之前完成成员初始化，且顺序由成员在类中的声明顺序决定，而非列表书写顺序。explicit 阻止单参构造函数被用于隐式转换。析构函数在对象销毁时执行清理，负责释放该对象持有的资源。构造与析构的顺序有严格规则：成员按声明顺序构造、按相反顺序析构；对象数组中先构造的先析构。',
    flow: [
      '优先使用初始化列表初始化成员，尤其在成员为引用或 const 时（它们必须初始化）。',
      '认清成员初始化顺序取决于声明顺序，不取决于初始化列表的书写顺序。',
      '为出现单参构造的函数加 explicit，避免意外的隐式转换。',
      '在析构函数中释放该对象管理的资源，并保证不抛异常。',
      '组合多个对象时依赖构造/析构顺序规则，避免使用尚未构造或已析构的成员。',
    ],
    notes: [
      '引用成员和 const 成员只能在初始化列表中初始化，不能在函数体里赋值。',
      '初始化列表顺序与声明顺序不一致时会引发难以察觉的 bug，应保持两者一致。',
      '默认构造并非自动生成：一旦定义了任何构造函数，编译器就不再合成默认构造。',
      '析构函数中抛异常会导致程序终止，清理动作应设计为不抛异常。',
      '析构顺序与构造顺序相反，成员先于所属对象析构，先构造的对象后析构。',
    ],
    problem: '解决"如何正确初始化与清理对象、理解初始化与析构顺序，以及避免构造析构相关的坑"的问题。',
    demo: null,
    demoComponent: CPP10Demo,
    code: CPP10Code,
    language: 'cpp',
  },
{
    id: 'CPP_11',
    title: '拷贝控制：拷贝构造、拷贝赋值与 Rule of Three/Five',
    navTitle: '拷贝控制',
    category: '面向对象',
    path: '/cpp/cpp-11/copy-control',
    summary: '理解浅拷贝与深拷贝的差异，掌握拷贝构造、拷贝赋值与 Rule of Three/Five。',
    principle: '当对象持有指针等资源时，编译器默认生成的是「浅拷贝」——只复制指针值，两个对象共享同一块内存，析构时就会重复释放。正确做法是「深拷贝」：拷贝构造与拷贝赋值自行分配并复制资源。拷贝赋值还需处理自赋值（先判断 this 与 &other 是否相同）。Rule of Three 指出：若需要自定义析构、拷贝构造、拷贝赋值三者之一，通常三者都需要；Rule of Five 在其上加入移动构造与移动赋值。用 = default 请求编译器合成、用 = delete 禁用拷贝，都是清晰的意图表达。',
    flow: [
      '判断类是否持有裸资源（指针、句柄），持有则必须自定义拷贝语义。',
      '拷贝构造中为新对象分配独立资源并复制内容，实现深拷贝。',
      '拷贝赋值中先处理自赋值，再释放旧资源、复制新资源，最后返回 *this。',
      '按 Rule of Three/Five 保持析构与拷贝、移动操作的一致性。',
      '不需要拷贝时用 = delete 明确禁用，或改用智能指针管理资源。',
    ],
    notes: [
      '浅拷贝配裸指针是「重复释放」的经典来源，务必改成深拷贝或改用智能指针。',
      '拷贝赋值要紧盯自赋值：a = a 时若不检查会先把自身资源释放掉。',
      '拷贝构造的参数用 const 引用，避免无限递归与不必要的拷贝。',
      'Rule of Five：定义了拷贝操作的类，通常也应定义移动操作以保留性能。',
      '现代 C++ 更推荐用智能指针承担资源所有权，让类自身变为可平凡拷贝的。',
    ],
    problem: '解决"如何为持有资源的类定义正确的拷贝语义、避免重复释放，以及应用 Rule of Three/Five"的问题。',
    demo: null,
    demoComponent: CPP11Demo,
    code: CPP11Code,
    language: 'cpp',
  },
{
    id: 'CPP_12',
    title: '移动语义与右值引用',
    navTitle: '移动语义',
    category: '面向对象',
    path: '/cpp/cpp-12/move-semantics',
    summary: '理解左值与右值、右值引用与 std::move，以及移动构造和移动赋值带来的性能提升。',
    principle: '左值是有名字、可取地址、可长期存在的对象；右值是临时对象或不具名的值。右值引用 T&& 只能绑定右值，用来标识「可以被安全搬走」的对象。移动构造与移动赋值不复制资源，而是把源对象的内部指针等「偷」过来，并把源置为空状态，从而把原本的深拷贝降级为指针转移。std::move 本身不移动任何东西，它只是把实参静态转换为右值引用，使重载决议选中移动版本。返回值优化（RVO/NRVO）让编译器直接在调用处构造对象，连移动都省掉。',
    flow: [
      '识别表达式是左值还是右值：具名变量多为左值，临时结果多为右值。',
      '为持有资源的类定义移动构造与移动赋值，从源对象窃取资源并把源置空。',
      '在明确不再需要某个对象时用 std::move 触发移动，且之后不再使用它。',
      '给移动操作加 noexcept，使容器在扩容等场景中放心选用移动而非拷贝。',
      '依赖编译器的返回值优化，不要为了「省一次拷贝」而过度使用 std::move。',
    ],
    notes: [
      'std::move 只是一次类型转换，被移动后的对象处于「有效但未指定」状态，不要再依赖其值。',
      '移动操作若未声明 noexcept，标准容器在需要强异常保证时会退回到拷贝。',
      '对 const 对象使用 std::move 得到的仍是 const 右值引用，实际会退化为拷贝。',
      '返回值优化优先于移动：直接 return 局部对象即可，无需写成 return std::move(x)。',
      '移动语义的本质是把昂贵资源的所有权转移，而不是复制数据。',
    ],
    problem: '解决"如何区分左值右值、正确实现移动语义，以及利用 std::move 与 RVO 提升性能"的问题。',
    demo: null,
    demoComponent: CPP12Demo,
    code: CPP12Code,
    language: 'cpp',
  },
{
    id: 'CPP_13',
    title: '继承与派生类：基类、访问控制与切片',
    navTitle: '继承',
    category: '面向对象',
    path: '/cpp/cpp-13/inheritance',
    summary: '掌握继承语法、继承方式对访问级别的影响、构造析构顺序与对象切片问题。',
    principle: '继承表达「is-a」关系：派生类复用基类的成员并加以扩展。继承方式（public、protected、private）决定基类成员在派生类中的可见级别，其中 public 继承保留接口语义，是最常用的方式。构造与析构顺序为：先构造基类、再构造派生类成员、最后派生类本身；析构时完全相反。名字隐藏发生在派生类定义了与基类同名的成员时，基类版本被遮蔽，需要 using 声明才能重新引入。对象切片是把派生类对象按值赋给基类对象，派生部分被丢弃，是值语义继承的固有代价。',
    flow: [
      '确认派生类与基类确为 is-a 关系，再决定使用继承而非组合。',
      '默认使用 public 继承，保护基类接口的对外语义。',
      '理解基类先构造、派生后构造，析构顺序相反的时间线。',
      '派生类需要暴露基类被隐藏的重载时，用 using Base::func 引入。',
      '避免按值传递多态对象导致切片，改用引用或指针。',
    ],
    notes: [
      'private 继承表达「用基类实现」而非 is-a，多数场景组合是更好的选择。',
      '基类若可能被多态使用，其析构函数应声明为 virtual（见多态一章）。',
      '派生类成员的名字会隐藏基类所有同名重载，即便参数不同。',
      '对象切片只会复制基类部分，派生类新增成员被丢弃，且无法再恢复。',
      '多重继承会带来菱形问题，必要时用虚基类共享唯一基类子对象。',
    ],
    problem: '解决"如何正确建立继承体系、理解访问控制与构造析构顺序，以及避免对象切片"的问题。',
    demo: null,
    demoComponent: CPP13Demo,
    code: CPP13Code,
    language: 'cpp',
  },
{
    id: 'CPP_14',
    title: '多态与虚函数：动态绑定与虚函数表',
    navTitle: '多态',
    category: '面向对象',
    path: '/cpp/cpp-14/polymorphism',
    summary: '理解虚函数与动态绑定机制、虚函数表，以及抽象类与虚析构函数的必要性。',
    principle: '多态让同一调用在运行期根据对象的实际类型分派到不同实现。做法是把基类函数声明为 virtual，派生类用 override 覆盖；通过基类指针或引用调用时，编译器生成运行期查表的间接调用（动态绑定），而不是按静态类型写死。其实现依赖虚函数表：每个含虚函数的对象持有指向该表的指针，表中按槽位存放各虚函数的实际地址。含纯虚函数的类成为抽象类，不能实例化，用于定义接口。基类析构函数必须是 virtual，否则通过基类指针删除派生对象时，派生部分的析构不会执行。',
    flow: [
      '把需要被多态覆盖的函数声明为 virtual，派生类实现时写 override 让编译器校验。',
      '用基类引用或指针持有派生对象，通过它们调用虚函数以获得动态绑定。',
      '把只有接口没有实现的函数声明为纯虚函数，构成抽象基类。',
      '只要类可能被多态删除，就把析构函数声明为 virtual。',
      '禁止进一步继承时用 final 标注类或虚函数，表达封闭意图。',
    ],
    notes: [
      '以值传递多态对象会发生切片，虚函数随之失效，必须传引用或指针。',
      '构造与析构期间虚函数不体现多态：此时调用的是当前层次的版本。',
      '每个含虚函数的对象多一个虚表指针，这是多态的空间代价。',
      '虚析构保证 delete 基类指针时，整个派生对象被完整析构。',
      '纯虚函数可以有定义，但仍使类保持抽象。',
    ],
    problem: '解决"如何通过虚函数实现多态、理解动态绑定的代价，以及正确处理抽象类与虚析构"的问题。',
    demo: null,
    demoComponent: CPP14Demo,
    code: CPP14Code,
    language: 'cpp',
  },
{
    id: 'CPP_15',
    title: '运算符重载：让自定义类型更自然',
    navTitle: '运算符重载',
    category: '面向对象',
    path: '/cpp/cpp-15/operator-overloading',
    summary: '掌握运算符重载的规则与常见形式，让自定义类型获得与内置类型一致的写法。',
    principle: '运算符重载让自定义类型也能用 +、==、<、<< 等符号表达运算，使代码更贴近数学与直觉。可重载的运算符有限，::、. 、?:、sizeof 等不可重载。多数二元运算符既可写成成员函数，也可写成非成员函数（常配合友元访问私有成员）；流输出 << 必须写成非成员，因为左操作数是 ostream。重载应保持运算符的常规语义（如 == 的传递性、+ 的对称性），返回值与 const 正确性要贴合语义：比较运算符返回 bool，复合赋值返回自身引用，比较运算符建议非成员以支持两侧隐式转换。',
    flow: [
      '只为语义自然、确实需要的运算符提供重载，不要为了炫技滥用。',
      '算术与比较运算符通常写成非成员（必要时设为友元），保持对称性。',
      '复合赋值与自增自减写成成员，返回 *this 以支持链式使用。',
      '流输出 << 写成非成员，返回 ostream& 以支持连续输出。',
      '区分前缀 ++ 与后缀 ++：前缀无参返回引用，后缀带一个 int 占位参数返回旧值。',
    ],
    notes: [
      '运算符的优先级与结合律不能被重载改变，只能改变参与运算的类型。',
      '至少有一个操作数是用户自定义类型，才能定义该运算符。',
      '赋值 =、下标 []、函数调用 ()、成员访问 -> 必须是成员函数。',
      '== 与 < 等比较运算符按值返回 bool，+ 等按值返回新对象。',
      '重载应遵守直觉：a + b 不该修改 a，operator== 应满足自反与对称。',
    ],
    problem: '解决"如何为自定义类型重载运算符、选择成员或非成员形式，以及保持语义一致"的问题。',
    demo: null,
    demoComponent: CPP15Demo,
    code: CPP15Code,
    language: 'cpp',
  },
{
    id: 'CPP_16',
    title: '函数模板与类模板：泛型编程基础',
    navTitle: '模板基础',
    category: '模板与泛型',
    path: '/cpp/cpp-16/templates-basics',
    summary: '掌握函数模板与类模板的定义、类型推导、特化以及非类型与默认模板参数。',
    principle: '模板把类型参数化，用同一份代码适配多种类型，是 C++ 泛型编程的基础。函数模板的类型参数由调用实参推导，无需显式写出；当推导失败或需要指定时可用显式模板实参。类模板在实例化时才为具体类型生成代码，其成员函数也只有被使用时才实例化。模板特化与偏特化为特定类型提供专门实现；非类型模板参数允许把整数、指针等编译期常量作为参数；默认模板参数让常用类型开箱即用。模板的代价是编译期实例化导致的代码膨胀。',
    flow: [
      '把算法中与具体类型无关的部分抽象成函数模板，让编译器按实参推导类型。',
      '需要多个类型参数时按使用顺序声明，并把可推导的参数放在不必指定的位置。',
      '用类模板封装与类型相关的数据结构，实例化时再绑定具体类型。',
      '为特殊类型（如指针、bool）提供特化或偏特化以获得正确行为。',
      '用非类型模板参数与默认模板参数减少调用处的样板代码。',
    ],
    notes: [
      '模板定义通常放在头文件中，否则实例化时可能找不到定义。',
      '模板会按实参类型生成独立代码，过度使用会增大可执行文件体积。',
      '函数模板不能被偏特化，只能用重载或类模板特化达到类似效果。',
      '非类型模板参数必须是编译期常量，如整数、枚举或指针。',
      '模板错误信息往往冗长，可用概念（C++20）或 static_assert 提前给出清晰约束。',
    ],
    problem: '解决"如何用模板编写与类型无关的通用代码、处理类型推导与特化，以及控制模板副作用"的问题。',
    demo: null,
    demoComponent: CPP16Demo,
    code: CPP16Code,
    language: 'cpp',
  },
{
    id: 'CPP_17',
    title: 'STL 容器（一）：vector、deque、list、array',
    navTitle: '顺序容器',
    category: 'STL',
    path: '/cpp/cpp-17/stl-sequence-containers',
    summary: '掌握顺序容器 vector、deque、list、array 的特点、常用操作与选型依据。',
    principle: '顺序容器按位置组织元素。vector 是动态数组，尾部增删高效，中间插入代价高，扩容时会把全部元素搬迁到新内存。deque 是双端队列，两端增删都高效，内部由分段连续空间组织。list 是双向链表，任意位置插入删除 O(1)，但不支持随机访问，且每个元素有额外指针开销。array 是定长数组的封装，大小编译期固定，无动态分配。emplace_back 直接在容器尾部就地构造元素，push_back 则先构造再拷贝或移动，前者减少一次临时对象。插入删除会引起迭代器失效，需按容器规则重新获取。',
    flow: [
      '默认首选 vector，除非确有频繁的头尾插删需求。',
      '需要两端高效增删时用 deque；需要任意位置高频插删且可接受非连续存储时用 list。',
      '大小固定且已知时用 array，享受零动态分配与栈上存储。',
      '用 emplace_back 就地构造元素，减少临时对象与拷贝。',
      '在插入删除后重新获取迭代器，避免使用已失效的迭代器。',
    ],
    notes: [
      'vector 扩容会重新分配内存并使所有迭代器、指针、引用失效。',
      'reserve 可预留容量，避免多次扩容带来的搬迁。',
      'list 不支持随机访问，不能用 [i]，遍历只能靠迭代器。',
      'deque 在中间插入删除仍然昂贵，其优势仅在两端。',
      '容量（capacity）与大小（size）不同：容量是已分配空间，大小是元素个数。',
    ],
    problem: '解决"如何在顺序容器之间选型、正确使用就地构造，以及规避迭代器失效"的问题。',
    demo: null,
    demoComponent: CPP17Demo,
    code: CPP17Code,
    language: 'cpp',
  },
{
    id: 'CPP_18',
    title: 'STL 容器（二）：map、set 与无序容器',
    navTitle: '关联容器',
    category: 'STL',
    path: '/cpp/cpp-18/stl-associative-containers',
    summary: '掌握有序关联容器 map/set 与哈希容器 unordered_map/unordered_set 的特性与取舍。',
    principle: '关联容器按键组织元素。map 与 set 底层通常是红黑树，元素按键有序，查找、插入、删除均为对数时间，支持范围查询与按序遍历。multimap 与 multiset 允许重复键。unordered_map 与 unordered_set 基于哈希表，平均查找接近常数时间，但元素无序，且依赖键的哈希与相等比较。map 的 operator[] 在键不存在时会插入一个默认构造的值，这与「只查不改」的意图不符，只读查找应使用 find 或 at。自定义类型作为键时需要提供比较（有序容器）或哈希与相等（无序容器）。',
    flow: [
      '需要按键有序遍历或范围查询时选 map/set，只关心快速查找时选无序容器。',
      '只读查找用 find 或 at，需要默认插入语义时才用 operator[]。',
      '用 insert 或 emplace 插入元素，emplace 支持就地构造。',
      '自定义类型作键时，为有序容器提供比较器，为无序容器提供哈希与相等。',
      '用 count 或 find 判断键是否存在，避免 operator[] 意外插入。',
    ],
    notes: [
      'map 的 operator[] 会静默插入默认值，污染容器大小，是常见误用。',
      'set 的键即值，插入时用 insert 返回的 pair 判断是否已存在。',
      '无序容器在哈希质量不佳时最坏退化为线性，哈希函数应尽量均匀。',
      '有序容器遍历天然有序，无序容器遍历顺序不可预期。',
      'both map 与 unordered_map 的键都不可修改，值可以修改。',
    ],
    problem: '解决"如何在有序与无序关联容器间选型、避免 operator[] 的插入陷阱，以及为自定义键提供比较与哈希"的问题。',
    demo: null,
    demoComponent: CPP18Demo,
    code: CPP18Code,
    language: 'cpp',
  },
{
    id: 'CPP_19',
    title: 'STL 迭代器与算法库',
    navTitle: '迭代器与算法',
    category: 'STL',
    path: '/cpp/cpp-19/iterators-algorithms',
    summary: '掌握迭代器的分类与用法，以及标准算法库如何在迭代器区间上工作。',
    principle: '迭代器把「遍历」抽象成统一的接口，使算法与容器解耦。按能力分为输入、输出、前向、双向、随机访问五类；不同算法要求不同类别，例如 sort 要求随机访问迭代器。所有标准算法都以一对迭代器表示的半开区间 [first, last) 为输入，做到「算法只依赖迭代器，不依赖容器」。algorithm 头文件提供排序、查找、计数、变换等，numeric 头文件提供累加、内积等数值算法。谓词与 Lambda 让算法可被定制，是算法库威力的关键。',
    flow: [
      '用 begin()/end() 或范围 for 取得区间，理解 end 指向末元素之后。',
      '按容器与操作选择合适算法，注意算法对迭代器类别的要求。',
      '用 sort、find、count、transform 等经典型算法替代手写循环。',
      '把比较或变换逻辑写成 Lambda 或函数对象，作为谓词传给算法。',
      '在改变容器结构后重新取得迭代器，避免失效访问。',
    ],
    notes: [
      '区间是半开的：end 不指向任何元素，不能解引用。',
      '并非所有容器都提供随机访问迭代器，sort 不能直接用于 list。',
      'list 自带成员版的 sort，因为其迭代器不满足随机访问要求。',
      '算法不会改变容器大小，插入删除要用容器的成员函数或特定适配器。',
      'numeric 中的 accumulate 可在 Lambda 中自定义累加方式，别只用于求和。',
    ],
    problem: '解决"如何用迭代器区间驱动标准算法、按迭代器类别选算法，以及用 Lambda 定制算法行为"的问题。',
    demo: null,
    demoComponent: CPP19Demo,
    code: CPP19Code,
    language: 'cpp',
  },
{
    id: 'CPP_20',
    title: 'Lambda 表达式与捕获',
    navTitle: 'Lambda',
    category: '现代 C++',
    path: '/cpp/cpp-20/lambda-expressions',
    summary: '掌握 Lambda 的语法、捕获列表的多种形式、mutable 与泛型 Lambda 的用法。',
    principle: 'Lambda 是就地定义、可携带上下文的匿名函数对象，语法为 [捕获](参数){ 函数体 }。捕获列表决定函数体能访问哪些外部变量以及以值还是引用方式：按值捕获得到副本，按引用捕获共享原对象，[=] 与 [&] 分别默认按值和按引用捕获。[this] 捕获当前对象的指针，*this 则在 C++17 起按值捕获整个对象。mutable 允许修改按值捕获的副本。泛型 Lambda 用 auto 参数，等价于一个可调用多种类型的模板。按引用捕获要特别警惕被捕获对象的生命周期短于 Lambda。',
    flow: [
      '把只在一处使用的小逻辑写成 Lambda，避免为它单独命名一个函数。',
      '按用途选择捕获方式：需要独立副本用值捕获，需要共享状态用引用捕获。',
      '明确列出需要捕获的变量，避免滥用 [=]、[&] 导致意外捕获。',
      '需要修改按值捕获的副本时加 mutable 关键字。',
      '用 auto 参数编写泛型 Lambda，让同一段逻辑适配多种类型。',
    ],
    notes: [
      '按引用捕获的对象若先于 Lambda 销毁，调用时即访问悬垂引用。',
      '[=] 在成员函数中实际捕获 this 指针，而非拷贝整个对象。',
      'C++17 起可用 [*this] 按值捕获整个对象副本，避免悬垂。',
      'mutable 只影响按值捕获副本的可修改性，不影响引用捕获。',
      'Lambda 的类型是编译器生成的唯一匿名类型，要存储它需用 auto 或 std::function。',
    ],
    problem: '解决"如何用 Lambda 就地封装逻辑、正确选择捕获方式，以及规避捕获引入的生命周期陷阱"的问题。',
    demo: null,
    demoComponent: CPP20Demo,
    code: CPP20Code,
    language: 'cpp',
  },
{
    id: 'CPP_21',
    title: '智能指针与 RAII',
    navTitle: '智能指针',
    category: '现代 C++',
    path: '/cpp/cpp-21/smart-pointers',
    summary: '理解 RAII 资源管理思想，掌握 unique_ptr、shared_ptr、weak_ptr 的用法与适用场景。',
    principle: 'RAII 把资源获取放进构造函数、释放放进析构函数，让资源生命周期自动跟随对象，从根本上消除忘记释放与异常路径泄漏。智能指针是 RAII 的标准实现：unique_ptr 独占所有权，不可拷贝、只能移动，开销几乎与裸指针相同，是默认首选。shared_ptr 通过引用计数共享所有权，最后一个持有者析构时释放资源，但计数与循环引用会带来开销与泄漏风险。weak_ptr 观察 shared_ptr 管理的对象而不增加计数，用于打破循环引用。make_unique 与 make_shared 负责安全地创建。',
    flow: [
      '需要独占所有权时用 unique_ptr，用 std::move 转移所有权。',
      '确需多方共享同一对象时才用 shared_ptr，并优先 make_shared 创建。',
      '发现 shared_ptr 之间形成环时，把其中一侧改为 weak_ptr。',
      '用 *ptr 与 ptr-> 访问被管理对象，用 get() 取裸指针以便与旧接口对接。',
      '把自定义清理逻辑通过删除器交给智能指针，实现统一的资源管理。',
    ],
    notes: [
      'unique_ptr 不可拷贝但可移动，作为参数按值传入即表示转移所有权。',
      'shared_ptr 的控制块与对象分开存储，引用计数的增减是原子操作，有开销。',
      '两个 shared_ptr 互相持有会形成循环，引用计数永不归零而泄漏，需用 weak_ptr 打破。',
      'weak_ptr 使用前必须 lock() 提升为 shared_ptr，并检查是否为空。',
      '不要用同一个裸指针同时初始化多个 shared_ptr，会导致重复释放。',
    ],
    problem: '解决"如何用 RAII 与智能指针自动管理资源、选择合适的所有权模型，以及避免循环引用泄漏"的问题。',
    demo: null,
    demoComponent: CPP21Demo,
    code: CPP21Code,
    language: 'cpp',
  },
{
    id: 'CPP_22',
    title: '现代 C++ 核心特性：auto、范围 for、nullptr 与结构化绑定',
    navTitle: '现代特性',
    category: '现代 C++',
    path: '/cpp/cpp-22/modern-cpp-core',
    summary: '掌握 auto 与 decltype、范围 for、nullptr、结构化绑定、constexpr、enum class 等现代特性。',
    principle: '现代 C++（C++11 起）用一批新特性减少了样板代码与隐患。auto 让编译器从初始化表达式推导类型，配合范围 for 与迭代器极大简化遍历代码；decltype 则保留表达式的引用与 const 限定。nullptr 是独立的空指针字面量，取代 NULL 与 0，消除了重载歧义。结构化绑定（C++17）把 pair、tuple 或聚合对象的成员一次解构到具名变量。constexpr 把计算尽量前移到编译期。enum class 提供有作用域、强类型的枚举。using 别名比 typedef 更易读，也支持别名模板。',
    flow: [
      '在类型可由初始化式明确推断、或类型名冗长时使用 auto。',
      '需要保留表达式完整类型（含引用与 const）时使用 decltype。',
      '用范围 for 替代基于下标的循环，需要修改元素时用引用。',
      '一律用 nullptr 表示空指针，淘汰 NULL 与 0。',
      '用结构化绑定一次性解包多元返回或聚合对象，提升可读性。',
    ],
    notes: [
      'auto 会丢弃顶层 const 与引用，需要保留时应显式写 const auto&。',
      'auto 只能从初始化式推导，未初始化的 auto 变量无法成立。',
      'nullptr 有独立类型 std::nullptr_t，能安全转换为任意指针类型。',
      '结构化绑定默认按值拷贝，需要修改原对象时对绑定使用引用。',
      'enum class 不隐式转换为整数，避免了不同枚举之间的意外混用。',
    ],
    problem: '解决"如何用现代 C++ 特性简化代码、提升类型安全，以及避免 auto、nullptr 等特性的误用"的问题。',
    demo: null,
    demoComponent: CPP22Demo,
    code: CPP22Code,
    language: 'cpp',
  },
{
    id: 'CPP_23',
    title: '异常处理与异常安全',
    navTitle: '异常处理',
    category: '错误处理',
    path: '/cpp/cpp-23/exception-handling',
    summary: '掌握 try/catch/throw、栈展开机制、noexcept 语义以及异常安全与 RAII 的配合。',
    principle: '异常把「错误发生」与「错误处理」在代码位置上分开：throw 抛出异常对象，沿调用栈向上传播，直到遇到能处理它的 catch。传播过程中会执行栈展开——局部对象按逆序析构，这正是 RAII 能在异常路径上依然释放资源的原理。catch 应按具体到宽泛的顺序排列，用引用捕获以避免切片；catch(...) 可兜底但无法取得异常信息。noexcept 承诺函数不抛异常，使移动操作与容器优化得以放心使用；函数若违反承诺，程序会直接终止。异常安全关注操作失败后对象处于何种状态。',
    flow: [
      '在能识别错误、却无法处理它的地方 throw，在能处理的地方 catch。',
      'catch 子句按从具体类型到基类、最后的 catch(...) 顺序排列。',
      '用引用捕获异常对象，避免切片并减少拷贝。',
      '把资源释放交给 RAII（智能指针、容器），使其在栈展开时自动执行。',
      '为移动构造、移动赋值以及明确不会抛异常的函数标注 noexcept。',
    ],
    notes: [
      '析构函数默认隐式 noexcept，其中抛出的异常会直接终止程序。',
      '异常对象在栈展开时仍存活，catch 到的引用在其作用域内有效。',
      'noexcept 是接口承诺，破坏承诺会导致 std::terminate 而非普通异常。',
      '标准库自带异常层次以 std::exception 为根，可直接捕获并调用 what()。',
      '异常安全常分三档：基本保证、强保证（提交或回滚）、不抛保证。',
    ],
    problem: '解决"如何用异常表达并传播错误、在栈展开中安全释放资源，以及达到合理等级的异常安全"的问题。',
    demo: null,
    demoComponent: CPP23Demo,
    code: CPP23Code,
    language: 'cpp',
  },
{
    id: 'CPP_24',
    title: '文件 I/O 与字符串流',
    navTitle: '文件 I/O',
    category: 'I/O 库',
    path: '/cpp/cpp-24/file-io',
    summary: '掌握文件流的读写、打开模式、状态检查，以及字符串流在格式化与解析中的用法。',
    principle: 'C++ 用同一套流式接口处理控制台、文件与内存中的数据。fstream 头文件提供 ifstream（读）、ofstream（写）和可读可写的 fstream；打开时用模式标志（ios::in、ios::out、ios::app、ios::binary 等）控制行为。流的状态由 good、fail、eof、bad 四个标志刻画，读写后应检查状态而不是假设成功。文件通过 RAII 在流对象析构时自动关闭。stringstream 把流接到内存字符串上，是格式化数字、拼接文本与解析结构化字符串的利器，避免手写字符串拼接与解析。',
    flow: [
      '按用途选择 ifstream、ofstream 或 fstream，构造或 open 时给出文件路径。',
      '用模式标志控制打开行为，如追加用 app、二进制用 binary。',
      '读写后检查流状态（如 !file.is_open()、getline 的返回值），及时处理失败。',
      '用 getline 按行读取文本，注意它与 >> 混用时的空白与换行差异。',
      '用 stringstream 在内存中完成数字与文本的相互转换、拼接与解析。',
    ],
    notes: [
      '文件流对象析构时自动关闭文件，无需手动 close，这正是 RAII 的应用。',
      '用 >> 读取失败（如类型不匹配）会置 fail 状态，需清理后才能继续。',
      'getline 与 operator>> 混用时，>> 留下的换行符会被 getline 读成空行。',
      '二进制模式要配合 read/write 与 reinterpret_cast 处理字节，注意字节序。',
      'stringstream 可配合 std::hex、std::setw 等操纵器做格式化输出。',
    ],
    problem: '解决"如何读写文件、按状态判断 I/O 成败，以及用字符串流完成格式化与解析"的问题。',
    demo: null,
    demoComponent: CPP24Demo,
    code: CPP24Code,
    language: 'cpp',
  },
{
    id: 'CPP_25',
    title: '并发编程：std::thread、mutex 与 async',
    navTitle: '并发编程',
    category: '并发与多线程',
    path: '/cpp/cpp-25/concurrency',
    summary: '掌握线程的创建与汇合、互斥量与锁、数据竞争，以及 async 与 future 的异步取值方式。',
    principle: '并发让多个任务在重叠的时间段内推进，以利用多核并提升响应性。std::thread 创建线程，必须显式 join（等待结束）或 detach（分离），线程对象析构前若仍未决定，程序会终止。多个线程访问共享可变数据会产生数据竞争，需用 mutex 保护临界区；lock_guard 与 unique_lock 以 RAII 方式自动加锁解锁，后者还支持延迟加锁与条件变量配合。std::atomic 在无需复合操作时提供更轻量的同步。condition_variable 用来在线程间做「等待某条件成立」的协调。std::async 与 future/promise 让异步任务的结果可通过 future 取值，并支持异常传播。',
    flow: [
      '用 std::thread 启动任务，务必在析构前决定 join 还是 detach。',
      '识别被多线程共享的可变数据，用 mutex 或 atomic 加以保护。',
      '用 lock_guard（简单场景）或 unique_lock（需要灵活加解锁）管理互斥量。',
      '需要等待条件时用 condition_variable 配合 unique_lock 与谓词循环。',
      '需要异步结果时用 std::async 启动并保存 future，再通过 get 取值。',
    ],
    notes: [
      'thread 对象在仍可 join 时析构会调用 std::terminate，务必显式 join 或 detach。',
      '忘解锁会导致死锁，lock_guard 的 RAII 语义可避免这类遗漏。',
      '多个 mutex 需按固定顺序加锁，或用 std::scoped_lock 一次性锁定以避免死锁。',
      'condition_variable 必须在谓词循环中等待，防止虚假唤醒。',
      'future 的 get() 只会成功返回一次，且会重新抛出任务中未处理的异常。',
    ],
    problem: '解决"如何创建与管理线程、用互斥量避免数据竞争，以及用 async 与 future 获取异步结果"的问题。',
    demo: null,
    demoComponent: CPP25Demo,
    code: CPP25Code,
    language: 'cpp',
  }
]

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

const CPP01Demo = createDemo('CPP01ProgramStructure')
const CPP02Demo = createDemo('CPP02VariablesTypes')
const CPP03Demo = createDemo('CPP03OperatorsExpressions')
const CPP04Demo = createDemo('CPP04ControlFlow')
const CPP05Demo = createDemo('CPP05Functions')
const CPP06Demo = createDemo('CPP06ArraysStrings')
const CPP07Demo = createDemo('CPP07PointersReferences')
const CPP08Demo = createDemo('CPP08DynamicMemory')
const CPP09Demo = createDemo('CPP09ClassesObjects')
const CPP10Demo = createDemo('CPP10CtorDtor')
const CPP11Demo = createDemo('CPP11CopyControl')
const CPP12Demo = createDemo('CPP12Inheritance')
const CPP13Demo = createDemo('CPP13Polymorphism')
const CPP14Demo = createDemo('CPP14OperatorOverloading')
const CPP15Demo = createDemo('CPP15TemplatesBasics')
const CPP16Demo = createDemo('CPP16StlSequenceContainers')
const CPP17Demo = createDemo('CPP17StlAssociativeContainers')
const CPP18Demo = createDemo('CPP18IteratorsAlgorithms')
const CPP19Demo = createDemo('CPP19LambdaExpressions')
const CPP20Demo = createDemo('CPP20SmartPointers')
const CPP21Demo = createDemo('CPP21MoveSemantics')
const CPP22Demo = createDemo('CPP22RAII')
const CPP23Demo = createDemo('CPP23ExceptionHandling')
const CPP24Demo = createDemo('CPP24FileIO')
const CPP25Demo = createDemo('CPP25Concurrency')
const CPP26Demo = createDemo('CPP26ModernCppCore')
const CPP27Demo = createDemo('CPP27CompileTimeComputation')
const CPP28Demo = createDemo('CPP28Modules')
const CPP29Demo = createDemo('CPP29DesignPatterns')
const CPP30Demo = createDemo('CPP30CodingStandards')


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
    demo: CPP01Demo,
    code: () => Promise.resolve(`#include <iostream>\n\n// 第一个 C++ 程序\nint main() {\n    std::cout << "Hello, C++!" << std::endl;\n    return 0;\n}`),
    language: 'cpp',
  },
{
    id: 'CPP_2',
    title: '变量、基本类型与类型转换',
    navTitle: '变量与类型',
    category: '基础入门',
    path: '/cpp/cpp-2/variables-types',
    summary: '掌握 C++ 的基本内置类型、变量声明初始化、作用域规则以及隐式与显式类型转换。',
    principle: 'C++ 是静态类型语言，每个变量必须有明确的类型。基本内置类型包括：整数类型（short、int、long、long long，以及无符号版本）、浮点类型（float、double、long double）、字符类型（char、wchar_t、char16_t、char32_t）、布尔类型（bool）。变量声明可以为其指定初始值，C++11 引入统一初始化（用花括号）可以防止窄化转换。类型转换分为隐式转换（自动发生，可能导致精度丢失）和显式转换（使用 static_cast、dynamic_cast、const_cast、reinterpret_cast 或 C 风格转换）。',
    flow: [
      '选择合适的基本类型声明变量，考虑数值范围和是否需要负数。',
      '使用统一初始化（int x{5};）或直接初始化（int x = 5;）。',
      '理解变量的作用域（全局、局部、块作用域）和生命周期。',
      '需要类型转换时，优先使用 C++ 风格的类型转换运算符。',
      '注意有符号和无符号类型混用时的隐式转换规则，避免意外行为。',
    ],
    notes: [
      'int 通常是最适合的整数类型（与机器字长匹配，性能最好）；short 很少必要；long long 保证至少 64 位。',
      '统一初始化（花括号）会在编译期检查窄化转换（如 int x{3.14}; 会报错），而圆括号或赋值形式不会。',
      'char 是有符号还是无符号由实现定义，处理小整数时明确指定 signed char 或 unsigned char。',
      '避免有符号和无符号整数混用，比较运算中无符号会转换为无符号，导致 -1 < 0u 为 false。',
      'C++17 起，变量可以在 if 或 switch 语句内声明（if (int x = foo(); x > 0) {...}），限制变量作用域。',
    ],
    problem: '解决"如何选择合适的数据类型、理解变量作用域，以及安全地进行类型转换"的问题。',
    demo: CPP02Demo,
    code: () => Promise.resolve(`#include <iostream>\n#include <limits>\n\nint main() {\n    int n = 100;\n    double d = 3.14159;\n    char c = 'A';\n    bool b = true;\n\n    // 统一初始化\n    int x{5};\n    // int bad{3.14};  // 编译错误！\n\n    // 类型转换\n    double pi = 3.14159;\n    int intPi = static_cast<int>(pi);\n\n    return 0;\n}`),
    language: 'cpp',
  },
{
    id: 'CPP_3',
    title: '运算符、表达式与类型提升',
    navTitle: '运算符',
    category: '基础入门',
    path: '/cpp/cpp-3/operators-expressions',
    summary: '理解 C++ 各类运算符的优先级、结合律、求值顺序，以及整数提升和算术转换规则。',
    principle: 'C++ 运算符分为算术运算符、关系运算符、逻辑运算符、位运算符、赋值运算符、条件运算符、逗号运算符、成员访问运算符等。运算符有优先级和结合律，复杂表达式应使用括号明确意图。C++ 规定了大部分运算符的求值顺序（C++17 起），但未规定的场景下避免在同一表达式中多次修改同一变量。整数提升规则：小整数类型（bool、char、short）在表达式中被提升为 int（如果 int 能容纳原类型的所有值）或 unsigned int。算术转换：二元运算符的两个操作数被转换为共同类型，通常涉及整型提升后按类型等级转换。',
    flow: [
      '熟悉运算符优先级表，对复杂表达式使用括号明确意图。',
      '理解短路求值（&& 和 || 不会评估右操作数，如果左操作数已决定结果）。',
      '注意前缀（++i）和后缀（i++）递增运算符的语义差异和性能差异（对于迭代器尤为重要）。',
      '理解整数提升和算术转换规则，预测表达式的类型和值。',
      '避免未定义行为：不要在同一表达式中多次修改同一变量（如 i = i++）。',
    ],
    notes: [
      '运算符优先级：::（最高）> () [] -> . > ++ --（后缀）> ++ --（前缀）! ~ + - * & > 算术 > 关系 > 位 > 逻辑 > 条件 > 赋值 > 逗号（最低）。',
      'C++17 规定了求值顺序：赋值运算符、&&、||、?:、逗号运算符的左操作数先于右操作数求值。',
      '整数提升：小类型先提升为 int/unsigned int，然后再进行算术转换。这解释了为什么 char 相加结果是 int。',
      '位移运算符（<< >>）的操作数必须是整数类型，右操作数必须是非负且小于左操作数位数。',
      '逗号运算符顺序求值，整个表达式为最右侧表达式的值和类型，常用于 for 循环的多个初始化或更新。',
    ],
    problem: '解决"如何理解复杂表达式的求值过程、避免运算符优先级陷阱和未定义行为"的问题。',
    demo: CPP03Demo,
    code: () => Promise.resolve(`#include <iostream>\n\nint main() {\n    int a = 10, b = 3;\n    std::cout << a + b << std::endl;\n    std::cout << a / b << std::endl;\n    std::cout << a % b << std::endl;\n\n    int x = 0;\n    if (a > b && ++x) { }\n    std::cout << x << std::endl;\n\n    return 0;\n}`),
    language: 'cpp',
  },
{
    id: 'CPP_4',
    title: '控制流：if/switch/while/for/范围 for',
    navTitle: '控制流',
    category: '基础入门',
    path: '/cpp/cpp-4/control-flow',
    summary: '掌握条件判断、循环结构和跳转语句，以及 C++11 引入的范围 for 循环。',
    principle: 'C++ 提供多种控制流语句：if/else 进行条件分支；switch 基于整数类型进行多路分支（注意 case 穿透，通常需要 break）；while 和 do-while 实现条件循环；for 循环将初始化、条件和更新集中在一处；C++11 引入的范围 for（for (auto& x : container)）可以遍历任何提供 begin()/end() 的对象，更安全简洁。跳转语句包括 break（跳出循环或 switch）、continue（跳过本次迭代）、return（返回函数结果）、goto（不推荐使用）。',
    flow: [
      '使用 if/else if/else 处理条件分支，注意浮点数比较应使用公差（fabs(a-b) < EPSILON）。',
      'switch 语句适用于基于整数常量的多路分支，每个 case 末尾加 break，或使用 [[fallthrough]] 标记故意穿透。',
      'for 循环适合已知迭代次数的场景；while 适合条件驱动的场景；do-while 至少执行一次。',
      '使用 C++11 范围 for 遍历容器，需要修改元素时用引用（auto&），只读时用 const auto&。',
      '避免在循环内频繁创建和销毁大对象，将不变的计算移出循环。',
    ],
    notes: [
      'switch 的 case 标签必须是整型常量表达式，不能是两个字符串或浮点数。',
      '范围 for 遍历过程中不能安全地增加或删除容器元素（会使迭代器失效），如果需要修改容器大小，使用传统 for 或 while。',
      'for (;;) 是无限循环，需要在循环体内用 break 或 return 跳出。',
      'C++17 允许在 if 和 switch 中初始化变量（if (auto it = m.find(k); it != m.end()) {...}），好用！',
      '初始化列表作为条件（while (auto x = getOptional())）可以在条件中声明变量并判断，限制作用域。',
    ],
    problem: '解决"如何选择合适的控制流语句、避免常见陷阱（如 switch 穿透、迭代器失效）"的问题。',
    demo: CPP04Demo,
    code: () => Promise.resolve(`#include <iostream>\n#include <vector>\n\nint main() {\n    int score = 85;\n    if (score >= 90) {\n        std::cout << "优秀";\n    } else if (score >= 60) {\n        std::cout << "及格";\n    }\n\n    std::vector<int> nums = {1, 2, 3, 4, 5};\n    for (int num : nums) {\n        std::cout << num << " ";\n    }\n\n    return 0;\n}`),
    language: 'cpp',
  },
{
    id: 'CPP_5',
    title: '函数：定义、参数传递、重载与递归',
    navTitle: '函数',
    category: '函数',
    path: '/cpp/cpp-5/functions',
    summary: '深入理解 C++ 函数的参数传递方式（值、引用、指针）、重载决议、默认参数和递归实现。',
    principle: 'C++ 函数参数传递有三种方式：按值传递（复制实参，函数内修改不影响原值，适合小对象）、按引用传递（避免复制，可修改原值，适合大对象或需要修改实参的场景）、按指针传递（类似引用但可以为 nullptr，语义上表示可选参数）。函数重载允许同名函数有不同的参数列表（不能通过返回类型区分）。默认参数从右向左提供，调用时从左到右匹配。递归函数必须有一个趋向终止条件的递归基，否则导致栈溢出。',
    flow: [
      '设计函数接口时，小对象（如 int、double）按值传递；需要修改实参或对象较大时用引用或 const 引用。',
      '使用函数重载提供相似功能的不同版本，注意二义性问题。',
      '默认参数在声明中指定（通常在头文件），调用时可省略尾部实参。',
      '递归函数先写递归基（终止条件），再写递归步骤，确保每次递归调用都趋向递归基。',
      'C++11 引入尾返回类型语法（auto foo() -> int），便于返回类型依赖于参数类型的场景。',
    ],
    notes: [
      'const 引用可以绑定到临时对象（右值），因此按 const 引用传递既避免复制又能接受字面量。',
      '函数重载的决议考虑隐式转换，可能导致意外的匹配，使用 explicit 或删除重载（= delete）可以避免。',
      '不要返回局部变量的引用或指针（悬垂引用/指针），返回值为对象时会调用移动构造或复制构造。',
      '递归深度受栈空间限制，深度递归考虑改为迭代或用尾递归优化（编译器不一定支持）。',
      'C++17 引入 constexpr if，可以在编译期根据条件丢弃分支，常用于模板代码。',
    ],
    problem: '解决"如何选择参数传递方式、设计清晰的函数接口，以及理解重载决议和递归实现"的问题。',
    demo: CPP05Demo,
    code: () => Promise.resolve(`#include <iostream>\n#include <string>\n\nvoid byValue(int x) { x = 100; }\nvoid byReference(int& x) { x = 100; }\n\nint main() {\n    int x = 5;\n    byValue(x);\n    std::cout << x << std::endl;\n\n    byReference(x);\n    std::cout << x << std::endl;\n\n    return 0;\n}`),
    language: 'cpp',
  },
{
    id: 'CPP_6',
    title: '数组、C 风格字符串与 std::string',
    navTitle: '数组与字符串',
    category: '复合类型',
    path: '/cpp/cpp-6/arrays-strings',
    summary: '理解内置数组的特性与局限，掌握 C 风格字符串的操作，以及 std::string 的现代用法。',
    principle: 'C++ 提供三种主要的字符串/数组处理方式：内置数组（如 char s[10]、int a[5]）是连续内存块，大小固定，不记录自身长度，容易越界；C 风格字符串是以空字符（\\0）结尾的 char 数组，操作依赖 <cstring> 函数（strlen、strcpy、strcat 等），不安全；std::string（C++98 起）是安全的字符串类，自动管理内存，提供丰富的成员函数（find、substr、append 等），支持移动语义（C++11）和 SSO（短字符串优化）。现代 C++ 应优先使用 std::string 和 std::array/std::vector，避免原生数组。',
    flow: [
      '定义数组时指定元素类型和数量，可以使用初始化列表，省略维度让编译器推导。',
      '数组名在多数语境下会退化为指向首元素的指针（数组到指针的退化），导致丢失大小信息。',
      '使用 <cstring> 函数操作 C 风格字符串时，确保目标缓冲区足够大，避免缓冲区溢出。',
      '优先使用 std::string 处理字符串，使用 std::array（固定大小）或 std::vector（动态大小）替代内置数组。',
      'std::string 的 c_str() 方法返回 const char*，用于需要 C 风格字符串的 API。',
    ],
    notes: [
      '内置数组不会检查下标越界，访问越界元素是未定义行为，使用 std::array::at() 或范围 for 可避免。',
      'C 风格字符串函数（strcpy、strcat）不检查目标缓冲区大小，应使用 strncpy、strncat 或更好的 std::string。',
      'std::string 支持 operator+ 拼接、operator== 比较，比 C 风格字符串直观且安全。',
      'C++11 起，std::string 不要求以空字符结尾（但 c_str() 返回以空字符结尾的指针），修改内部缓冲区可能导致未定义行为。',
      '字符串字面量是 const char[N] 类型，可以隐式转换为 const char*，但不能转换为 char*（C++11 起，需要 const_cast 或弃用转换）。',
    ],
    problem: '解决"如何安全地处理字符串和数组、避免缓冲区溢出和数组退化问题"的问题。',
    demo: CPP06Demo,
    code: () => Promise.resolve(`#include <iostream>\n#include <string>\n\nint main() {\n    std::string s1 = "Hello";\n    std::string s2 = "World";\n    std::string s3 = s1 + ", " + s2 + "!";\n    std::cout << s3 << std::endl;\n\n    int arr[5] = {1, 2, 3};\n    std::cout << arr[0] << std::endl;\n\n    return 0;\n}`),
    language: 'cpp',
  },
{
    id: 'CPP_7',
    title: '指针与引用：地址、解引用与别名',
    navTitle: '指针与引用',
    category: '复合类型',
    path: '/cpp/cpp-7/pointers-references',
    summary: '深入理解指针的算术运算、引用与指针的区别，以及 nullptr 和 void* 的正确使用。',
    principle: '指针是存储内存地址的变量，可以指向任何对象类型（包括函数）。指针支持解引用（*p 访问指向的对象）、成员访问（p->member）、指针算术（p+1 指向下一个同类型对象）、关系运算。引用是对象的别名，必须在定义时初始化，之后不能重新绑定到其他对象，没有空引用（理论上）。指针可以为 nullptr，表示不指向任何对象；引用必须绑定到有效对象。指针可以重新指向其他对象。选择使用指针还是引用：需要重新指向或表示"无值"时用指针；需要别名且保证非空时用引用。',
    flow: [
      '声明指针时使用 Type* p 语法（注意：int* p, q; 只有 p 是指针，q 是 int；推荐写成 int *p, q; 或分行声明）。',
      '解引用指针前必须检查是否为 nullptr，避免未定义行为。',
      '使用引用作为函数参数，表示函数需要操作原对象且不需要表示"无值"。',
      '使用指针作为函数参数，表示参数可选（可以为 nullptr）或函数可能需要修改指针本身（传递指针的指针或指针的引用）。',
      'void* 可以指向任何类型的对象，但不能直接解引用，需要先转换为具体类型指针。',
    ],
    notes: [
      '指针算术：p + n 不是简单地址加 n，而是加 n * sizeof(指向的类型)，这是数组下标访问的基础。',
      '指针比较：两个指针指向同一数组的元素时，比较运算符有意义（指向后一个元素的指针更大）；指向不同对象的指针比较是未定义行为（C++14 前）或实现定义（C++14 起，但结果不一定有意义）。',
      '引用不是对象，没有地址，不能定义引用的引用（但可以定义引用的指针，如 int& *p = &r; 是错误的，正确是 int* p = &r）。',
      '顶层 const 和底层 const：int* const p（指针是 const，不能改指向） vs const int* p（指向的对象是 const，不能改值）。',
      'C++11 引入 nullptr 替代 NULL（0 或 (void*)0），nullptr 可以隐式转换为任何指针类型，但不能转换为 int，解决了 NULL 的二义性问题。',
    ],
    problem: '解决"指针和引用有什么区别、如何选择、以及理解指针算术和 const 正确用法"的问题。',
    demo: CPP07Demo,
    code: () => Promise.resolve(`#include <iostream>\n\nint main() {\n    int x = 42;\n    int* p = &x;\n    std::cout << *p << std::endl;\n    *p = 100;\n    std::cout << x << std::endl;\n\n    int& r = x;\n    r = 10;\n    std::cout << x << std::endl;\n\n    int* np = nullptr;\n    if (np != nullptr) { }\n\n    return 0;\n}`),
    language: 'cpp',
  },
{
    id: 'CPP_8',
    title: '动态内存管理：new/delete 与常见陷阱',
    navTitle: '动态内存',
    category: '内存管理',
    path: '/cpp/cpp-8/dynamic-memory',
    summary: '理解 C++ 的手动内存管理机制，掌握 new/delete 的正确用法，以及内存泄漏、悬垂指针等常见问题的防范。',
    principle: 'C++ 允许程序在运行时从堆（自由存储区）动态分配内存。new 表达式分配内存并构造对象，返回指向该对象的指针；delete 表达式销毁对象并释放内存。使用 new[] 分配数组，必须用 delete[] 释放（匹配非常重要）。动态内存的常见问题：内存泄漏（分配后忘记释放）、悬垂指针（释放后继续使用）、重复释放（同一指针释放两次）、分配与释放不匹配（new/delete[] 混用）。现代 C++ 应优先使用智能指针（unique_ptr、shared_ptr）或容器（vector、string），避免手动管理内存。',
    flow: [
      '需要动态大小的对象或需要在多个所有者之间共享对象时，使用 new 分配内存。',
      '始终确保 new 和 delete、new[] 和 delete[] 匹配使用。',
      '将 delete 后的指针设为 nullptr，避免悬垂指针（但不能防止其他指向同一内存的指针成为悬垂指针）。',
      '优先使用 std::unique_ptr 管理独占所有权的动态对象，用 std::shared_ptr 管理共享所有权的对象。',
      '如果需要大型连续内存，考虑 std::vector 或 std::array，它们自动管理内存。',
    ],
    notes: [
      'new 失败时默认抛出 std::bad_alloc 异常，可以用 new (std::nothrow) 使其返回 nullptr 而不抛异常。',
      'delete 空指针（nullptr）是安全的（什么也不做），因此指针初始化为 nullptr 后，delete 不会出错。',
      '内存泄漏的检测工具：Valgrind（Linux）、Dr. Memory（Windows）、AddressSanitizer（编译期插桩）。',
      'C++11 起，建议使用智能指针替代原始指针管理动态内存，几乎可以消除内存泄漏和悬垂指针问题。',
      'placement new 可以在已分配的内存上构造对象（如内存池、嵌入式系统），需要手动调用析构函数，然后用 operator delete 释放内存（如果不使用 placement new 的话）。',
    ],
    problem: '解决"如何安全地管理动态内存、避免内存泄漏和悬垂指针，以及何时应该使用智能指针"的问题。',
    demo: CPP08Demo,
    code: () => Promise.resolve(`#include <iostream>

int main() {
    int* p = new int(42);
    std::cout << *p << std::endl;
    delete p;
    p = nullptr;

    int* arr = new int[5]{1, 2, 3, 4, 5};
    for (int i = 0; i < 5; i++) {
        std::cout << arr[i] << " ";
    }
    delete[] arr;

    return 0;
}`),
    language: 'cpp',
  },
{
    id: 'CPP_9',
    title: '类与对象：封装、访问控制与 this 指针',
    navTitle: '类与对象',
    category: '面向对象',
    path: '/cpp/cpp-9/classes-objects',
    summary: '理解 C++ 类的定义、对象创建、访问控制（public/protected/private）以及 this 指针的作用。',
    principle: '类是 C++ 面向对象编程的核心，是自定义类型的蓝图。类将数据和操作数据的函数绑定在一起，实现封装。类成员可以有三种访问权限：public（任何代码可以访问）、protected（类和派生类可以访问）、private（只有类成员和友元可以访问）。每个非静态成员函数都有一个隐式的 this 指针，指向调用该函数的对象。类可以定义构造函数（初始化对象）、析构函数（清理资源）、拷贝构造函数、拷贝赋值运算符、移动构造函数、移动赋值运算符（后四个合称"特殊成员函数"）。',
    flow: [
      '定义类时，将数据成员设为 private，通过 public 成员函数（getter/setter）提供受控访问。',
      '理解 this 指针：在成员函数内部，this 指向调用该函数的对象，可以用于返回对象自身（支持链式调用）。',
      '使用 struct 定义类时，默认访问权限是 public；使用 class 定义时，默认是 private。',
      'const 成员函数（如 int getX() const）承诺不修改对象状态，只能调用其他 const 成员函数。',
      '在类定义外定义成员函数时，需要使用 类名::成员名 的限定语法。',
    ],
    notes: [
      '封装的好处：隐藏实现细节，便于修改内部实现而不影响使用者；控制对数据的访问，维护不变量（如保证年龄不为负）。',
      'this 指针的类型是 类名* const（指向类的非常量指针的常量指针），在 const 成员函数中是 const 类名* const。',
      '返回 *this 的成员函数（如 setX(int x) { this->x = x; return *this; }）可以支持链式调用（obj.setX(1).setY(2)）。',
      '类可以声明友元函数（friend）或友元类，友元可以访问类的 private 成员，但友元关系不传递、不继承。',
      'C++11 引入 in-class 初始化器，可以在类定义内为非静态数据成员提供默认初始值。',
    ],
    problem: '解决"如何用类实现封装、理解访问控制的作用，以及正确使用 this 指针和 const 成员函数"的问题。',
    demo: CPP09Demo,
    code: () => Promise.resolve(`#include <iostream>
#include <string>

class Person {
private:
    std::string name;
    int age;

public:
    Person(const std::string& n, int a) : name(n), age(a) {}

    void introduce() const {
        std::cout << "我叫 " << name << "，今年 " << age << " 岁。" << std::endl;
    }
};

int main() {
    Person p("栗子", 3);
    p.introduce();
    return 0;
}`),
    language: 'cpp',
  },
{
    id: 'CPP_10',
    title: '构造函数、析构函数与对象生命周期',
    navTitle: '构造与析构',
    category: '面向对象',
    path: '/cpp/cpp-10/ctor-dtor',
    summary: '深入理解构造函数（默认、带参、拷贝、移动）和析构函数，以及对象创建、销毁的完整生命周期。',
    principle: '构造函数负责初始化对象，析构函数负责清理资源。构造函数与类同名，无返回类型，可以有参数（支持重载）；析构函数名为 ~类名()，无参数无返回类型，不能重载。对象生命周期：自动对象（局部变量）在定义时构造，离开作用域时析构；动态对象在 new 时构造，delete 时析构；全局/静态对象在 main 前构造，main 返回后析构（构造顺序：同一编译单元内按定义顺序；不同编译单元间未指定）。如果类未定义构造函数/析构函数，编译器会生成默认版本（可能逐成员初始化/销毁）。',
    flow: [
      '定义类时，如果需要非默认初始化，定义带参数的构造函数；如果类管理资源（如动态内存、文件句柄），定义析构函数。',
      '使用初始化列表（: member1(val1), member2(val2)）而非在函数体内赋值，效率更高且可以初始化 const 成员和引用成员。',
      '理解特殊成员函数的"五大"：默认构造、析构、拷贝构造、拷贝赋值、移动构造、移动赋值（C++11 起）。',
      '如果类需要自定义析构函数，通常也需要自定义拷贝/移动操作（"三/五法则"）。',
      '使用 = default 要求编译器生成默认版本；使用 = delete 删除特殊成员函数或普通成员函数。',
    ],
    notes: [
      '初始化列表中的初始化顺序由成员在类中声明的顺序决定，而非初始化列表中的顺序，避免依赖不同顺序导致的问题。',
      '拷贝构造函数：用同类型的另一个对象初始化新对象时调用（Class a = b; 或 f(Class a) 传参时）；如果不定义，编译器生成逐成员拷贝的版本（浅拷贝）。',
      '析构函数可以是 virtual 的（且通常应该是，如果类会被继承），virtual 析构函数确保通过基类指针删除派生类对象时调用正确的析构函数。',
      'C++11 引入委托构造函数（一个构造函数可以调用同类的其他构造函数），减少重复代码。',
      'constexpr 构造函数可以创建编译期常量对象，构造函数体必须为空（C++14 起可以有用例），初始化列表中的表达式必须是常量表达式。',
    ],
    problem: '解决"如何控制对象的初始化和清理、理解对象生命周期，以及正确实现特殊成员函数"的问题。',
    demo: CPP10Demo,
    code: () => Promise.resolve(`#include <iostream>
#include <string>

class Student {
private:
    std::string* name;

public:
    Student(const std::string& n) {
        name = new std::string(n);
    }

    // 拷贝构造函数（深拷贝）
    Student(const Student& other) {
        name = new std::string(*other.name);
    }

    // 拷贝赋值运算符
    Student& operator=(const Student& other) {
        if (this != &other) {
            delete name;
            name = new std::string(*other.name);
        }
        return *this;
    }

    ~Student() {
        delete name;
    }
};

int main() {
    Student s1("小明");
    Student s2 = s1;
    return 0;
}`),
    language: 'cpp',
  },
{
    id: 'CPP_11',
    title: '拷贝控制：拷贝构造、拷贝赋值与 Rule of Three/Five',
    navTitle: '拷贝控制',
    category: '面向对象',
    path: '/cpp/cpp-11/copy-control',
    summary: '掌握拷贝构造函数、拷贝赋值运算符的正确实现，以及 Rule of Three/Five 的指导原则。',
    principle: '当一个类管理资源（如动态内存、文件句柄、网络连接）时，编译器生成的默认拷贝操作（逐成员拷贝）通常是错误的（浅拷贝），会导致双重释放或访问已释放内存。需要自定义拷贝构造函数和拷贝赋值运算符（深拷贝）。Rule of Three：如果需要自定义析构函数、拷贝构造函数或拷贝赋值运算符中的任何一个，那么通常需要自定义所有三个。C++11 扩展为 Rule of Five，加上移动构造函数和移动赋值运算符。实现拷贝赋值运算符时，注意处理自赋值（if (this != &rhs)），并返回 *this 以支持链式赋值。',
    flow: [
      '如果类管理资源，定义析构函数释放资源，定义拷贝构造函数深拷贝资源，定义拷贝赋值运算符先释放旧资源再深拷贝新资源。',
      '拷贝赋值运算符的实现模式：检查自赋值，释放旧资源，分配新资源，复制数据，返回 *this。',
      '使用 copy-and-swap 惯用法可以简化拷贝赋值运算符的实现，并自动处理自赋值和异常安全。',
      '如果不希望类被拷贝，将拷贝构造函数和拷贝赋值运算符声明为 = delete。',
      'C++11 起，定义移动构造函数和移动赋值运算符，支持资源转移（高效），并用 noexcept 标记它们（标准库容器需要）。',
    ],
    notes: [
      '浅拷贝复制指针值（两个对象指向同一资源）；深拷贝复制指针指向的内容（两个对象各有自己的资源副本）。管理资源的类几乎都需要深拷贝。',
      '自赋值（a = a;）看起来不可能，但可能是间接的（*p = *q; 其中 p 和 q 指向同一对象），必须在拷贝赋值运算符中处理。',
      'copy-and-swap 惯用法：定义一个 swap 成员函数（交换所有成员），然后拷贝赋值运算符的参数是按值传递（调用拷贝构造），然后调用 swap。自动处理自赋值和异常安全。',
      'Rule of Zero：如果类的所有成员都是 RAII 类型（如智能指针、容器、string），那么不需要自定义任何特殊成员函数，编译器生成的版本就是正确的。这是最理想的情况。',
      'C++11 引入 = default 和 = delete，可以显式控制特殊成员函数的生成。= default 要求编译器生成默认版本；= delete 阻止生成或调用。',
    ],
    problem: '解决"如何正确处理含有资源的类的拷贝行为、避免浅拷贝陷阱，以及遵循 Rule of Three/Five"的问题。',
    demo: CPP11Demo,
    code: () => Promise.resolve(`#include <iostream>
#include <cstring>

class String {
private:
    char* data;
    size_t length;

public:
    // 构造函数
    String(const char* str) {
        length = std::strlen(str);
        data = new char[length + 1];
        std::strcpy(data, str);
    }

    // 拷贝构造函数（深拷贝）
    String(const String& other) {
        length = other.length;
        data = new char[length + 1];
        std::strcpy(data, other.data);
    }

    // 拷贝赋值运算符
    String& operator=(const String& other) {
        if (this != &other) {
            delete[] data;
            length = other.length;
            data = new char[length + 1];
            std::strcpy(data, other.data);
        }
        return *this;
    }

    ~String() {
        delete[] data;
    }
};

int main() {
    String s1("Hello");
    String s2 = s1;
    return 0;
}`),
    language: 'cpp',
  },
{
    id: 'CPP_12',
    title: '继承与派生类：基类、访问控制与切片',
    navTitle: '继承',
    category: '面向对象',
    path: '/cpp/cpp-12/inheritance',
    summary: '理解 C++ 的公有、保护、私有继承，以及派生类对象的内存布局、切片问题和构造析构顺序。',
    principle: '继承允许基于已有类创建新类，实现代码复用和多态基础。C++ 支持三种继承方式：公有继承（is-a 关系，派生类可以替代基类）、保护继承（主要用于继承层次内部）、私有继承（实现继承，不暴露接口）。派生类继承基类的成员（构造函数、析构函数、赋值运算符除外），可以添加新成员或重写虚函数。构造顺序：基类构造 → 派生类成员构造 → 派生类构造体；析构顺序相反。对象切片：将派生类对象赋值给基类对象时，派生类部分被"切掉"，只保留基类部分（通常是不希望的，应使用指针或引用）。',
    flow: [
      '使用公有继承表示 is-a 关系（如 Dog 是 Animal），派生类对象可以在需要基类对象的地方使用（通过指针或引用）。',
      '派生类构造函数使用初始化列表调用基类构造函数（: Base(arg1, arg2)），如果不显式调用，基类的默认构造函数会被调用。',
      '避免在基类中使用非虚函数（期望派生类重写但不声明为 virtual），这会导致通过基类指针/引用调用时调用基类版本而非派生类版本。',
      '将基类的析构函数声明为 virtual，确保通过基类指针删除派生类对象时调用正确的析构函数。',
      '避免对象切片：使用基类指针或引用，而非基类对象，来保存派生类对象。',
    ],
    notes: [
      'C++11 引入 override 关键字，显式标记派生类中重写虚函数的成员函数，编译器会检查是否真的重写了基类的虚函数（防止签名不匹配导致的隐藏而非重写）。',
      'C++11 引入 final 关键字，可以修饰类（禁止继承）或虚函数（禁止重写）。',
      '保护继承（protected）和私有继承（private）不常用，前者在派生类的派生类中仍可访问基类 public/protected 成员；后者完全隐藏继承层次。',
      'using 声明可以将基类的 protected 成员引入派生类的作用域，使其在派生类中可访问（如 using Base::someProtectedMethod;）。',
      '多重继承（一个类继承多个基类）在 C++ 中是允许的，但可能导致菱形继承问题（虚继承可以解决，但应谨慎使用）。',
    ],
    problem: '解决"如何正确使用继承实现代码复用和多态、理解切片问题，以及避免构造析构中的常见错误"的问题。',
    demo: CPP12Demo,
    code: () => Promise.resolve(`#include <iostream>
#include <string>

// 基类
class Animal {
public:
    virtual void speak() const {
        std::cout << "动物发出声音。" << std::endl;
    }
    virtual ~Animal() {}
};

// 派生类
class Dog : public Animal {
public:
    void speak() const override {
        std::cout << "汪汪！" << std::endl;
    }
};

int main() {
    Dog dog;
    dog.speak();

    // 多态
    Animal* animal = new Dog();
    animal->speak();
    delete animal;

    return 0;
}`),
    language: 'cpp',
  },
{
    id: 'CPP_13',
    title: '多态与虚函数：动态绑定与虚函数表',
    navTitle: '多态',
    category: '面向对象',
    path: '/cpp/cpp-13/polymorphism',
    summary: '深入理解运行时多态的机制（虚函数表）、如何使用虚函数实现动态绑定，以及纯虚函数和抽象类。',
    principle: '多态允许通过基类的指针或引用调用派生类中重写的成员函数，在运行时根据对象的实际类型决定调用哪个函数（动态绑定）。实现机制：包含虚函数的类有一个虚函数表（vtable），每个对象有一个指向 vtable 的指针（vptr）；调用虚函数时，通过 vptr 找到 vtable，再从 vtable 中找到正确的函数地址。纯虚函数（= 0）使类成为抽象类，不能实例化，派生类必须重写所有纯虚函数才能实例化。虚函数可以有默认实现，纯虚函数通常没有实现（但可以有实现，派生类可以用 基类::纯虚函数 调用）。',
    flow: [
      '在基类中用 virtual 关键字声明函数，在派生类中使用 override 关键字重写（C++11）。',
      '通过基类的指针或引用调用虚函数，运行时调用派生类的重写版本。',
      '如果类有虚函数，将析构函数声明为 virtual（即使它是默认的），以确保正确清理派生类资源。',
      '使用纯虚函数定义接口（抽象类），强制派生类提供特定实现。',
      '理解虚函数调用的性能开销（一次间接调用，可能影响分支预测），在对性能极度敏感的代码中小心使用。',
    ],
    notes: [
      '虚函数表（vtable）在编译期生成，每个包含虚函数的类有一个 vtable；每个对象在构造时设置 vptr 指向相应类的 vtable。',
      '构造函数中调用虚函数不会触发动态绑定（因为派生类部分尚未构造），调用的是当前类的版本。',
      '析构函数中调用虚函数也不会触发动态绑定（因为派生类部分已经析构），调用的是当前类的版本。',
      '虚函数不能是 static 的（static 函数没有 this 指针，无法访问 vptr），也不能是模板函数（模板函数在编译期实例化，虚函数在运行期决议，冲突）。',
      'C++11 引入 final 关键字可以阻止派生类重写特定虚函数（如 virtual void f() final;），这有助于优化（去虚化）和文档说明。',
    ],
    problem: '解决"如何实现运行时多态、理解虚函数表的机制，以及正确使用纯虚函数定义接口"的问题。',
    demo: CPP13Demo,
    code: () => Promise.resolve(`#include <iostream>
#include <memory>

// 抽象基类
class Shape {
public:
    virtual double area() const = 0;  // 纯虚函数
    virtual ~Shape() {}
};

class Circle : public Shape {
private:
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() const override {
        return 3.14159 * radius * radius;
    }
};

int main() {
    std::unique_ptr<Shape> shape = std::make_unique<Circle>(5.0);
    std::cout << "面积：" << shape->area() << std::endl;
    return 0;
}`),
    language: 'cpp',
  },
{
    id: 'CPP_14',
    title: '运算符重载：让自定义类型更自然',
    navTitle: '运算符重载',
    category: '面向对象',
    path: '/cpp/cpp-14/operator-overloading',
    summary: '掌握 C++ 运算符重载的规则和惯用法，为自定义类型提供直观的运算符接口。',
    principle: 'C++ 允许为自定义类型重载大多数运算符，使自定义类型的对象可以像内置类型一样使用运算符。运算符重载函数可以是成员函数（左侧操作数是 this 指向的对象）或全局函数（通常需要访问类的 private 成员，因此可以声明为 friend）。不能重载的运算符：::（作用域解析）、.*（成员指针访问）、.（成员访问）、?:（条件）。重载运算符时应保持直观语义：operator+ 应返回新对象（不修改操作数）；operator+= 应返回引用（修改左操作数）；operator== 和 operator!= 应成对实现；operator< 用于排序时应定义严格弱序。',
    flow: [
      '确定要重载的运算符，选择实现为成员函数还是全局函数（需要对称性的运算符如 ==、<、+ 通常实现为全局 friend 函数）。',
      '遵循运算符的常规语义：比较运算符返回 bool；算术运算符返回新对象；复合赋值运算符返回引用；下标运算符返回引用。',
      '成对实现：== 和 !=，< 和 >，<= 和 >=，通常可以用 == 实现 !=，用 < 实现 > 等。',
      '输入输出运算符 >> 和 << 必须实现为全局函数（因为左操作数是 istream/ostream，不是自定义类型）。',
      '下标运算符 operator[] 应提供两个版本：非 const 版本返回普通引用，const 版本返回 const 引用。',
    ],
    notes: [
      '递增/递减运算符有前缀和后缀版本：前缀版本返回引用（++obj），后缀版本返回旧状态的副本（obj++，用 int 参数区分：T operator++(int)）。',
      '函数调用运算符 operator() 使对象可以像函数一样被调用（函数对象/仿函数），标准库算法大量使用这种技术。',
      '解引用运算符 operator* 和箭头运算符 operator-> 用于智能指针和迭代器的实现，使自定义类型具有指针语义。',
      '转换运算符（operator 类型()）定义从自定义类型到其他类型的转换，应谨慎使用（可能导致意外的隐式转换），C++11 可以用 explicit 修饰转换运算符。',
      '赋值运算符 operator= 必须定义为成员函数（不能定义为全局函数），如果不定义，编译器生成逐成员赋值的版本。',
    ],
    problem: '解决"如何为自定义类型提供直观的运算符接口、遵循运算符重载的惯用法和语义规则"的问题。',
    demo: CPP14Demo,
    code: () => Promise.resolve(`#include <iostream>
#include <string>

class Vector {
private:
    double x, y;

public:
    Vector(double x, double y) : x(x), y(y) {}

    // 运算符重载：+
    Vector operator+(const Vector& other) const {
        return Vector(x + other.x, y + other.y);
    }

    // 运算符重载：<<（输出）
    friend std::ostream& operator<<(std::ostream& os, const Vector& v) {
        os << "(" << v.x << ", " << v.y << ")";
        return os;
    }
};

int main() {
    Vector v1(1, 2), v2(3, 4);
    std::cout << "v1 + v2 = " << v1 + v2 << std::endl;
    return 0;
}`),
    language: 'cpp',
  },
{
    id: 'CPP_15',
    title: '函数模板与类模板：泛型编程基础',
    navTitle: '模板基础',
    category: '模板与泛型',
    path: '/cpp/cpp-15/templates-basics',
    summary: '理解函数模板和类模板的语法、类型推导规则，以及模板在编译期的实例化机制。',
    principle: '模板是 C++ 泛型编程的核心，允许编写与类型无关的代码。函数模板用 template <typename T> 或 template <class T> 声明，编译器根据函数实参推导模板参数类型，生成具体的函数实例。类模板需要在使用时显式指定模板参数（类模板的成员函数只有被使用时才实例化）。模板代码通常放在头文件中（因为编译器需要看到完整定义才能实例化）。模板特化允许为特定类型提供特殊实现：全特化（所有模板参数都指定）和偏特化（部分模板参数指定，类模板可以，函数模板不行）。',
    flow: [
      '定义函数模板时，将类型无关的算法抽象为模板参数，让编译器生成所需类型的函数。',
      '类模板在定义对象时必须显式指定模板参数（如 vector<int>），类模板的成员函数定义需要加上模板参数列表。',
      '理解模板类型推导规则：对于函数模板，实参可以是值、引用、指针、const，编译器会推导最合适的类型。',
      '使用 trailing return type（auto func(Args... args) -> decltype(expr)）或 C++14 的返回类型推导（auto func(...) { ... }）处理返回类型依赖模板参数的场景。',
      '将模板定义放在头文件中，避免链接错误（模板定义通常不分离到 .cpp 文件）。',
    ],
    notes: [
      'typename 和 class 在模板参数列表中可以互换，但在模板内部，如果引用依赖于模板参数的类型成员，需要用 typename 前缀（如 typename T::value_type）。',
      '函数模板可以被重载，也可以与普通函数重载，重载决议优先考虑普通函数，其次考虑函数模板实例化后的版本。',
      '类模板的成员函数只有在被使用时才实例化，这允许即使某些成员函数对特定模板参数类型不合法，只要不使用这些成员函数，该类模板实例化仍然是合法的（SFINAE 的基础）。',
      'C++11 引入别名模板（template <typename T> using Vec = vector<T>;），可以简化复杂类型名的书写。',
      '变长模板（variadic templates，C++11）允许模板接受任意数量和类型的参数，是元组（tuple）、函数包装器（bind、thread）和完美转发的基础。',
    ],
    problem: '解决"如何编写类型无关的通用代码、理解模板实例化机制，以及正确使用模板特化"的问题。',
    demo: CPP15Demo,
    code: () => Promise.resolve(`#include <iostream>
#include <string>

// 函数模板
template <typename T>
T max(T a, T b) {
    return a > b ? a : b;
}

// 类模板
template <typename T>
class Pair {
private:
    T first, second;
public:
    Pair(T a, T b) : first(a), second(b) {}
    T getFirst() const { return first; }
};

int main() {
    std::cout << max(3, 7) << std::endl;
    std::cout << max(3.14, 2.71) << std::endl;

    Pair<int> intPair(10, 20);
    std::cout << intPair.getFirst() << std::endl;
    return 0;
}`),
    language: 'cpp',
  },
{
    id: 'CPP_16',
    title: 'STL 容器（一）：vector、deque、list、forward_list',
    navTitle: '顺序容器',
    category: 'STL',
    path: '/cpp/cpp-16/stl-sequence-containers',
    summary: '掌握 STL 顺序容器的特性、适用场景和常用操作，理解各容器的底层实现与性能权衡。',
    principle: 'STL（标准模板库）提供丰富的容器、算法和迭代器。顺序容器按位置存储元素：vector 是动态数组，支持随机访问，尾部插入/删除高效，中间插入/删除需要移动元素；deque（双端队列）支持首尾高效插入/删除，也支持随机访问，但性能略低于 vector；list（双向链表）不支持随机访问，任何位置的插入/删除都高效，但每个元素需要额外存储两个指针；forward_list（单向链表，C++11）是 list 的空间优化版本，只能单向遍历。选择容器时考虑：是否需要随机访问？插入/删除在什么位置？是否关心内存局部性？',
    flow: [
      '默认选择 vector，除非有明确的理由选择其他容器（vector 的内存局部性好，缓存友好，随机访问 O(1)）。',
      '需要在头部频繁插入/删除时用 deque（deque 的分页存储可能导致内存碎片，但头部插入是 O(1)）。',
      '需要在中间频繁插入/删除且不需要随机访问时用 list（链表插入/删除 O(1)，但每个元素额外开销大，缓存不友好）。',
      '使用容器时注意迭代器失效规则：vector 插入可能导致重新分配（使所有迭代器、指针、引用失效）；list 插入不会使迭代器失效，删除只使指向被删元素的迭代器失效。',
      '使用 range constructor 或 assign 方法高效填充容器，使用 emplace_back（C++11）替代 push_back 避免不必要的拷贝/移动。',
    ],
    notes: [
      'vector 的 capacity() 返回已分配内存可容纳的元素数，size() 返回实际元素数；reserve(n) 预分配内存避免多次重新分配；shrink_to_fit()（C++11）请求释放多余内存（不保证）。',
      'list 和 forward_list 有特有的成员函数（如 splice、merge、sort、reverse、unique），比通用算法更高效（O(n) 而非 O(n log n)）。',
      'C++11 起，所有容器都提供移动构造和移动赋值，且 insert/emplace 操作支持移动语义，提高性能。',
      '迭代器类别：vector/deque 提供随机访问迭代器；list 提供双向迭代器；forward_list 提供前向迭代器。算法要求的迭代器类别必须被满足。',
      'array（C++11）是固定大小的数组容器，比内置数组更安全（提供 at() 边界检查、size()、迭代器等），适用于编译期已知大小的数组。',
    ],
    problem: '解决"如何根据需求选择合适的 STL 顺序容器、理解各容器的性能特性和迭代器失效规则"的问题。',
    demo: CPP16Demo,
    code: () => Promise.resolve(`#include <iostream>
#include <vector>
#include <deque>
#include <list>

int main() {
    std::vector<int> vec = {1, 2, 3};
    vec.push_back(4);

    std::deque<int> dq;
    dq.push_front(0);
    dq.push_back(2);

    std::list<int> lst = {1, 2, 3};
    lst.push_front(0);
    lst.push_back(4);

    return 0;
}`),
    language: 'cpp',
  },
{
    id: 'CPP_17',
    title: 'STL 容器（二）：map、set、unordered_map、unordered_set',
    navTitle: '关联容器',
    category: 'STL',
    path: '/cpp/cpp-17/stl-associative-containers',
    summary: '掌握有序关联容器（map/set）和无序关联容器（unordered_map/unordered_set）的特性与用法。',
    principle: '关联容器按关键字存储和访问元素。有序关联容器（map、set、multimap、multiset）基于红黑树实现，元素按键的顺序存储，查找、插入、删除 O(log n)；map 存储键值对（key-value），set 只存储键。无序关联容器（unordered_map、unordered_set 等，C++11）基于哈希表实现，平均 O(1) 查找、插入、删除，最坏 O(n)（哈希冲突严重）。选择：需要有序遍历或有序范围查询用 map/set；只关心查找速度且可以提供良好哈希函数用 unordered_map/unordered_set。',
    flow: [
      '使用 map 存储键值对，通过 operator[] 或 at() 访问元素（operator[] 在键不存在时会插入默认值，at() 会抛异常）。',
      '使用 set 存储唯一键集合，通过 insert 插入元素，find 查找元素（返回迭代器，未找到返回 end()）。',
      '对于 unordered_ 容器，提供高质量的哈希函数很重要，避免使用容易导致冲突的哈希函数。',
      '遍历 map/set 时，元素按关键字升序排列（默认 less<Key>）；遍历 unordered_ 容器时，元素顺序是未指定的（取决于哈希函数和桶布局）。',
      '使用 lower_bound/upper_bound（有序容器）进行范围查询，使用 equal_range 获取匹配某个键的整个范围。',
    ],
    notes: [
      'map 的 operator[] 在键不存在时会插入一个值初始化的元素（对于 int 是 0，对于 string 是空串），这可能导致意外插入；如果只是想读取，用 at() 或 find()。',
      'C++17 引入 node handles（extract 函数），允许在不重新分配内存的情况下将元素从一个关联容器移动到另一个（只要比较类型兼容），也允许修改键（先 extract，修改 key，再 insert）。',
      'unordered_ 容器的负载因子（size/bucket_count）影响性能，rehash(n) 强制使桶数至少为 n，reserve(n) 使容器准备好容纳 n 个元素而不重新哈希。',
      '自定义类型作为 map/set 的键时，需要提供小于运算符或自定义比较器；作为 unordered_ 的键时，需要提供哈希函数和相等比较函数。',
      'multimap 和 multiset 允许重复键，count(key) 返回键出现的次数，lower_bound/upper_bound 或 equal_range 用于获取所有相同键的元素。',
    ],
    problem: '解决"如何选择合适的关联容器、理解有序与无序容器的性能差异，以及正确自定义键类型"的问题。',
    demo: CPP17Demo,
    code: () => Promise.resolve(`#include <iostream>
#include <map>
#include <string>

int main() {
    std::map<std::string, int> ages;
    ages["Alice"] = 25;
    ages["Bob"] = 30;

    for (const auto& [name, age] : ages) {
        std::cout << name << ": " << age << std::endl;
    }

    return 0;
}`),
    language: 'cpp',
  },
{
    id: 'CPP_18',
    title: 'STL 迭代器与算法：sort、find、count、transform',
    navTitle: '迭代器与算法',
    category: 'STL',
    path: '/cpp/cpp-18/iterators-algorithms',
    summary: '理解 STL 迭代器概念和类别，掌握常用算法（排序、查找、变换、累加）的用法与性能。',
    principle: 'STL 算法通过迭代器操作容器，实现算法与数据结构的分离（泛型编程的典范）。迭代器是连接容器和算法的桥梁，有五种迭代器类别：输入迭代器（只读、单向）、输出迭代器（只写、单向）、前向迭代器（读写、单向）、双向迭代器（读写、双向）、随机访问迭代器（读写、任意跳转）。算法按要求的迭代器类别分组：只读算法（find、count、accumulate）要求输入迭代器；读写算法（copy、transform）要求前向迭代器；排序算法要求随机访问迭代器。C++20 引入 ranges（范围库），提供管道风格的算法调用和惰性求值。',
    flow: [
      '使用迭代器表示元素范围 [first, last)（前闭后开区间），大多数算法接受两个迭代器表示操作范围。',
      '常用只读算法：find（查找）、count（计数）、accumulate（累加，在 <numeric> 中）、all_of/any_of/none_of（C++11，条件判断）。',
      '常用写算法：copy（复制）、transform（变换）、fill（填充）、replace（替换）、unique（去重，需要先排序）。',
      '排序算法：sort（快速排序，不保证稳定）、stable_sort（归并排序，稳定）、partial_sort（部分排序）、nth_element（找第 n 小元素）。',
      'C++20 使用 ranges 版本算法，可以直接对容器调用（如 ranges::sort(vec)），不需要显式传递 begin()/end()，还支持投影（project）。',
    ],
    notes: [
      '算法不检查迭代器有效性，也不检查范围是否合理，传递错误迭代器会导致未定义行为。',
      '使用 back_inserter、front_inserter、inserter 迭代器适配器可以将算法的结果插入容器，避免预先分配足够空间。',
      'remove-erase 惯用法：algorithm 的 remove 并不真正删除元素（它把要保留的元素移到前面，返回新的逻辑终点），需要配合容器的 erase 成员函数真正删除（vec.erase(remove(vec.begin(), vec.end(), val), vec.end())）。',
      'lambda 表达式（C++11）经常作为算法的谓词（predicate）参数，使代码更简洁（如 sort(v.begin(), v.end(), [](int a, int b) { return a > b; })）。',
      'C++17 起，许多算法有并行版本（在 <execution> 中），可以指定执行策略（seq、par、par_unseq）利用多核性能（如 sort(execution::par, v.begin(), v.end())）。',
    ],
    problem: '解决"如何使用 STL 算法高效处理容器元素、理解迭代器类别要求，以及掌握 remove-erase 惯用法"的问题。',
    demo: CPP18Demo,
    code: () => Promise.resolve(`#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9, 3};

    // 查找
    auto it = std::find(nums.begin(), nums.end(), 8);

    // 排序
    std::sort(nums.begin(), nums.end());

    // 累加
    int sum = std::accumulate(nums.begin(), nums.end(), 0);

    return 0;
}`),
    language: 'cpp',
  },
{
    id: 'CPP_19',
    title: 'Lambda 表达式：匿名函数与捕获',
    navTitle: 'Lambda',
    category: '现代 C++',
    path: '/cpp/cpp-19/lambda-expressions',
    summary: '深入理解 C++11 引入的 lambda 表达式的语法、捕获列表、mutable、返回类型以及在算法和并发中的应用。',
    principle: 'Lambda 表达式（匿名函数）可以在需要函数对象的地方定义内联函数，避免定义命名函数或函数对象的样板代码。Lambda 语法：[capture](params) -> ret { body }。捕获列表指定 lambda 可以使用哪些外部变量以及如何捕获（值捕获 [x] 或引用捕获 [&x]；[=] 值捕获所有自动存储期变量；[&] 引用捕获所有自动存储期变量）。默认情况下，值捕获的变量在 lambda 内是 const 的（不能修改），除非 lambda 标记为 mutable。C++14 允许泛型 lambda（参数用 auto）；C++14 允许初始化捕获（[x = expr] 可以用 move 捕获）；C++20 允许模板 lambda（[tpl = [](auto x) { ... }]）。',
    flow: [
      '在算法调用中直接使用 lambda 作为谓词或操作函数，使代码更紧凑（如 find_if(v.begin(), v.end(), [](int x) { return x > 10; })）。',
      '理解值捕获和引用捕获的语义：值捕获捕获的是 lambda 创建时变量的副本；引用捕获捕获的是变量的引用（要确保变量生命周期长于 lambda）。',
      '默认捕获（[=] 或 [&]）应谨慎使用，因为它会捕获所有自动变量，可能导致意外的生命周期问题或性能问题（捕获大对象）。',
      '如果 lambda 需要修改值捕获的变量，添加 mutable 关键字（但修改的是副本，不影响外部变量）。',
      'C++14 的初始化捕获（[vec = std::move(oldVec)]() { ... }）可以高效地将唯一所有权转移给 lambda。',
    ],
    notes: [
      'lambda 表达式是编译器生成的匿名函数对象的语法糖，每个 lambda 都有唯一的类型（可以用 auto 存储，或用 std::function 包装）。',
      '引用捕获的变量，如果在 lambda 调用前变量已销毁，则 lambda 内访问是未定义行为（常见的悬垂引用问题）。',
      'C++20 引入模板 lambda，可以在 lambda 参数列表中使用 template <typename T> 语法，或使用 abbreviated function template 语法（auto）。',
      'lambda 可以作为返回值（需要保证捕获的变量仍然有效，通常值捕获或初始化捕获移动的对象是安全的）。',
      'C++23 引入 lambda 的显式模板参数列表（[]{<typename T> requires std::integral<T>(T x) { ... } }），以及允许在 lambda 内使用 static 变量和线程局部变量。',
    ],
    problem: '解决"如何在 C++ 中定义内联匿名函数、理解捕获列表的各种方式，以及避免 lambda 中的生命周期陷阱"的问题。',
    demo: CPP19Demo,
    code: () => Promise.resolve(`#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5};

    // 基本 lambda
    auto print = []() {
        std::cout << "Hello from lambda!" << std::endl;
    };
    print();

    // 带参数的 lambda
    auto add = [](int a, int b) {
        return a + b;
    };
    std::cout << "3 + 5 = " << add(3, 5) << std::endl;

    // 值捕获
    int factor = 2;
    auto multiply = [factor](int x) {
        return x * factor;
    };

    return 0;
}`),
    language: 'cpp',
  },
{
    id: 'CPP_20',
    title: '智能指针：unique_ptr、shared_ptr、weak_ptr',
    navTitle: '智能指针',
    category: '现代 C++',
    path: '/cpp/cpp-20/smart-pointers',
    summary: '掌握 C++11 智能指针的用法，理解独占所有权、共享所有权和弱引用的语义及适用场景。',
    principle: '智能指针是 RAII 理念在动态内存管理中的应用，自动释放所管理的对象。unique_ptr 体现独占所有权：同一时刻只能有一个 unique_ptr 指向对象，不能拷贝（只能移动），效率等同于原始指针（无额外开销）。shared_ptr 体现共享所有权：多个 shared_ptr 可以指向同一对象，使用引用计数管理对象生命周期，最后一个 shared_ptr 销毁时释放对象。weak_ptr 是 shared_ptr 的弱引用，不增加引用计数，用于打破循环引用（如双向链表、父子对象互相引用）。优先使用 unique_ptr（小、快），只在需要共享所有权时用 shared_ptr。',
    flow: [
      '使用 std::make_unique<T>(args)（C++14）或 std::unique_ptr<T>(new T(args)) 创建 unique_ptr。',
      '使用 std::make_shared<T>(args)（C++11）创建 shared_ptr，make_shared 一次性分配对象内存和控制块内存，性能更好。',
      'unique_ptr 作为函数返回值时不需要显式 move（编译器会优化），作为函数参数时如果需要转移所有权用 std::move。',
      '避免用同一个原始指针构造多个 shared_ptr（会导致双重释放），始终用 make_shared 或从已有 shared_ptr/unique_ptr 构造。',
      '循环引用场景（如 A 持有 shared_ptr<B>，B 持有 shared_ptr<A>）用 weak_ptr 打破：将其中一个改为 weak_ptr，需要时用 lock() 提升为 shared_ptr。',
    ],
    notes: [
      'unique_ptr 可以自定义删除器（如文件句柄、网络连接），删除器是类型的一部分（模板第二个参数），因此 unique_ptr<T, D1> 和 unique_ptr<T, D2> 是不同的类型。',
      'shared_ptr 的引用计数操作是原子的，线程安全（但指向的对象本身不是线程安全的，需要同步）。',
      'weak_ptr::lock() 返回 shared_ptr，如果对象还活着则返回非空 shared_ptr，否则返回空 shared_ptr；这避免了访问已释放对象的问题。',
      '不要将 this 原始指针构造 shared_ptr（会导致多个独立控制块），应继承 std::enable_shared_from_this<T>，然后用 shared_from_this() 获取正确的 shared_ptr。',
      'C++19（实际是 C++11 起）建议：I. 优先使用栈对象；II. 需要堆对象时用 unique_ptr；III. 需要共享所有权时用 shared_ptr；IV. 几乎不要使用原始指针管理资源（只用于非拥有引用）。',
    ],
    problem: '解决"如何安全地管理动态内存、理解智能指针的所有权语义，以及避免内存泄漏和双重释放"的问题。',
    demo: CPP20Demo,
    code: () => Promise.resolve(`#include <iostream>
#include <memory>

int main() {
    // unique_ptr：独占所有权
    std::unique_ptr<int> up = std::make_unique<int>(42);

    // shared_ptr：共享所有权
    std::shared_ptr<int> sp1 = std::make_shared<int>(100);
    {
        std::shared_ptr<int> sp2 = sp1;  // 引用计数 +1
    }  // sp2 析构，引用计数 -1

    // weak_ptr：弱引用
    std::weak_ptr<int> wp = sp1;  // 不增加引用计数
    if (auto sp3 = wp.lock()) {  // 提升为 shared_ptr
        std::cout << *sp3 << std::endl;
    }

    return 0;
}`),
    language: 'cpp',
  },
{
    id: 'CPP_21',
    title: '移动语义与右值引用：性能优化的关键',
    navTitle: '移动语义',
    category: '现代 C++',
    path: '/cpp/cpp-21/move-semantics',
    summary: '深入理解右值引用、移动构造函数、std::move 和完美转发，掌握如何利用移动语义提升性能。',
    principle: '移动语义（C++11）允许将资源（如动态内存、文件句柄）从一个对象"移动"到另一个对象，而非复制，从而提高性能。右值引用（T&&）可以绑定到右值（临时对象），用于实现移动操作。std::move 不改变任何东西，只是将左值无条件转换为右值引用（告诉编译器：这个对象不再需要，可以移动它的资源）。移动构造函数（T(T&& other) noexcept）和移动赋值运算符（T& operator=(T&& other) noexcept）"偷走" other 的资源，然后将 other 置于有效但不确定的状态（通常是空状态）。完美转发（std::forward<T>）在泛型代码中保持实参的值类别（左值/右值）。',
    flow: [
      '为管理资源的类定义移动构造函数和移动赋值运算符（通常应标记为 noexcept，标准库容器在重新分配时要求移动构造是 noexcept 的，否则会使用拷贝）。',
      '使用 std::move 将左值转换为右值引用，触发移动而不是拷贝（如 vec2 = std::move(vec1); 之后 vec1 为空）。',
      '注意：被移动后的对象仍然有效（可以销毁、赋值、但值不确定），不要假设它还有原来的值。',
      '函数返回局部对象时，编译器会尝试返回值优化（RVO/NRVO）或移动（如果不能 RVO），通常不需要显式 std::move 返回值（反而可能阻止 RVO）。',
      '在模板代码中使用 std::forward<T> 完美转发参数的值类别（如果实参是右值，转发后仍是右值；如果是左值，转发后仍是左值）。',
    ],
    notes: [
      '右值引用（T&&）和通用引用（也叫转发引用，在模板参数推导中 T&& 可能是左值引用或右值引用）是不同的概念，后者出现在模板参数或 auto&& 中。',
      'std::move 和 std::forward 都是编译期操作，不产生运行时代码（它们只是类型转换）。',
      '移动构造/赋值应标记为 noexcept：如果移动构造可能抛异常，标准库容器在重新分配时会使用拷贝（保证强异常安全），导致性能下降。',
      'Rule of Five：如果类需要自定义析构函数、拷贝构造、拷贝赋值、移动构造、移动赋值中的任何一个，通常需要自定义所有五个（但 Rule of Zero 更好：如果所有成员都是 RAII 类型，就不需要自定义任何特殊成员函数）。',
      'C++17 保证返回值优化（RVO）在某些情况下是强制的（当返回表达式是纯右值时），确保不会发生不必要的拷贝或移动。',
    ],
    problem: '解决"如何利用移动语义避免不必要的拷贝、理解右值引用和通用引用的区别，以及正确实现移动操作"的问题。',
    demo: CPP21Demo,
    code: () => Promise.resolve(`#include <iostream>
#include <string>
#include <vector>

int main() {
    // 移动语义：资源转移而非拷贝
    std::string str1 = "Hello, World!";
    std::string str2 = std::move(str1);  // 移动构造

    std::cout << "str2: " << str2 << std::endl;
    std::cout << "str1: " << str1 << std::endl;  // 空（被移动后）

    // 移动赋值
    std::vector<int> vec1 = {1, 2, 3, 4, 5};
    std::vector<int> vec2;
    vec2 = std::move(vec1);  // 移动赋值

    return 0;
}`),
    language: 'cpp',
  },
{
    id: 'CPP_22',
    title: 'RAII 原则：资源获取即初始化',
    navTitle: 'RAII',
    category: '现代 C++',
    path: '/cpp/cpp-22/raii',
    summary: '理解 RAII（资源获取即初始化）这一 C++ 核心惯用法，掌握如何用对象生命周期管理资源。',
    principle: 'RAII（Resource Acquisition Is Initialization）是 C++ 管理资源的核心惯用法：将资源（内存、文件句柄、锁、网络连接等）的生存期绑定到对象生存期——在构造函数中获取资源，在析构函数中释放资源。这样，无论函数如何退出（正常返回、抛异常），资源都会被正确释放（因为局部对象的析构函数总是被调用）。RAII 类的例子：智能指针（管理内存）、std::lock_guard（管理锁）、std::fstream（管理文件）、std::vector（管理动态数组）。RAII 几乎消除了资源泄漏的可能，是 C++ 比手动资源管理更安全的关键。',
    flow: [
      '需要管理资源的类，遵循 RAII：在构造函数中获取资源（如果获取失败抛异常），在析构函数中释放资源。',
      '使用标准库的 RAII 类型：std::unique_ptr/shared_ptr（内存）、std::lock_guard/unique_lock（互斥锁）、std::ifstream/ofstream（文件）、std::thread 的 join 或 detach 应在 RAII 包装中。',
      '避免在析构函数中抛异常（会导致程序终止，如果析构函数因异常而退出，且同时有另一个异常在处理中），释放资源的操作不应失败。',
      '将需要配对的获取/释放操作封装到一个 RAII 类中，使代码自动异常安全。',
      '理解栈展开（stack unwinding）：当异常被抛出时，所有已构造的局部对象按其析构顺序被销毁，RAII 对象在此过程中释放资源。',
    ],
    notes: [
      'RAII 不限于内存管理，任何需要在使用完后清理的资源都应用 RAII 包装：数据库连接、socket、图形 API 对象等。',
      '在泛型代码中，确保资源获取在构造函数中（如果构造函数可能失败，应抛异常，而不是返回一个需要检查的状态），这样资源获取和对象构造是原子的。',
      'std::lock_guard 是 RAII 的经典例子：构造时锁住互斥量，析构时解锁，即使代码抛异常也能保证解锁，避免死锁。',
      'C++11 起，标准库提供了多个 RAII 类型：智能指针、锁守卫、文件流、线程对象（需要显式 join 或 detach，否则析构时 terminate）等。',
      '实现 RAII 类时，遵循 Rule of Five（或 Rule of Zero），确保拷贝/移动操作正确管理资源（通常 RAII 类应是不可拷贝的，使用 unique_ptr 类似的移动语义）。',
    ],
    problem: '解决"如何用对象生命周期自动管理资源、实现异常安全的代码，以及理解 RAII 在各种资源类型中的应用"的问题。',
    demo: CPP22Demo,
    code: () => Promise.resolve(`#include <iostream>
#include <fstream>

// RAII 类示例：文件句柄
class FileHandle {
private:
    std::fstream file;

public:
    FileHandle(const char* filename) {
        file.open(filename, std::ios::out);
    }

    ~FileHandle() {
        if (file.is_open()) {
            file.close();
        }
    }
};

int main() {
    try {
        FileHandle file("test.txt");
        // 函数结束时自动析构，文件被关闭
    } catch (const std::exception& e) {
        std::cout << "错误: " << e.what() << std::endl;
    }

    return 0;
}`),
    language: 'cpp',
  },
{
    id: 'CPP_23',
    title: '异常处理：try/catch/throw 与异常安全',
    navTitle: '异常处理',
    category: '错误处理',
    path: '/cpp/cpp-23/exception-handling',
    summary: '掌握 C++ 异常处理机制，理解异常安全保证的级别，以及如何在代码中正确使用异常。',
    principle: 'C++ 异常处理用于报告和处理错误。throw 表达式抛出一个异常（可以是任何类型，但通常是 std::exception 的派生类）；try 块包含可能抛出异常的代码；catch 块捕获并处理异常。异常处理的优点：将正常逻辑和错误处理分离；自动栈展开确保资源被释放（配合 RAII）；可以跨函数传递错误。异常安全保证分为三个级别：基本承诺（异常抛出后程序处于有效状态，不泄漏资源）；强承诺（操作要么完全成功，要么完全失败，程序状态不变，像没调用过一样）；不抛异常承诺（函数永远不会抛异常，应标记为 noexcept）。构造函数抛异常是报告对象构造失败的唯一合理方式；析构函数不应抛异常。',
    flow: [
      '使用 try/catch 块捕获和处理异常，catch 块按出现顺序匹配（因此应将派生类异常放在基类异常之前捕获）。',
      '抛出标准异常类型（如 std::runtime_error、std::invalid_argument），或自定义继承自 std::exception 的异常类。',
      '在函数中如果保证不抛异常，使用 noexcept 关键字声明（帮助编译器优化，调用 std::terminate 而不是栈展开如果真的抛了异常）。',
      '使用 RAII 确保异常安全：即使中间抛异常，局部对象析构函数也会释放资源。',
      '理解异常规范（C++11 起，noexcept 是函数类型的一部分，影响重载决议和移动操作）。',
    ],
    notes: [
      'catch(...) 捕获所有异常，通常用于清理后重新抛出（throw; 不带表达式，重新抛出当前异常）或记录日志后终止程序。',
      '异常处理的性能：如果异常不抛出，几乎没有开销（现代实现使用零开销原则：只有抛出时才付出代价）；但过度使用异常可能影响代码大小和分支预测。',
      '不要在析构函数中抛异常：如果析构函数抛异常且同时另一个异常在栈展开中，程序会调用 std::terminate 终止。如果需要报告错误，应在析构函数中捕获异常并吞掉（不推荐）或记录日志。',
      'C++11 起，dynamic_exception_specification（throw(type1, type2)）被废弃，改用 noexcept 和 noexcept(expression)。',
      '标准库异常层次：std::exception 是基类，派生类包括 std::bad_alloc（new 失败）、std::bad_cast（dynamic_cast 失败）、std::runtime_error（运行时错误）、std::logic_error（逻辑错误，如无效参数）等。',
    ],
    problem: '解决"如何正确使用异常处理错误、理解异常安全保证级别，以及确保代码在异常存在时仍然正确"的问题。',
    demo: CPP23Demo,
    code: () => Promise.resolve(`#include <iostream>
#include <stdexcept>
#include <fstream>

// 自定义异常类
class MyException : public std::runtime_error {
public:
    MyException(const std::string& msg) : std::runtime_error(msg) {}
};

void processFile(const std::string& filename) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        throw MyException("无法打开文件: " + filename);
    }
}

int main() {
    try {
        processFile("nonexistent.txt");
    } catch (const MyException& e) {
        std::cout << "捕获自定义异常: " << e.what() << std::endl;
    } catch (const std::exception& e) {
        std::cout << "捕获标准异常: " << e.what() << std::endl;
    }

    return 0;
}`),
    language: 'cpp',
  },
{
    id: 'CPP_24',
    title: '文件 I/O：ifstream、ofstream 与字符串流',
    navTitle: '文件 I/O',
    category: 'I/O 库',
    path: '/cpp/cpp-24/file-io',
    summary: '掌握 C++ 文件输入输出流的使用，以及字符串流（stringstream）在文本处理和类型转换中的应用。',
    principle: 'C++ 的 I/O 库基于流（stream）抽象。ifstream（输入文件流）从文件读取数据；ofstream（输出文件流）向文件写入数据；fstream（文件流）同时支持读写。这些类在 <fstream> 中定义，是 RAII 类型（打开文件在构造时，关闭文件在析构时）。文件打开模式：in（读）、out（写）、app（追加）、ate（打开后定位到末尾）、trunc（截断，默认对 out 模式）、binary（二进制模式）。字符串流（<sstream>）：istringstream（从字符串读取）、ostringstream（向字符串写入）、stringstream（读写字符串），常用于文本解析和类型转换（替代 sprintf/sscanf 或 string 拼接）。',
    flow: [
      '使用 ifstream 打开文件读取，检查文件是否成功打开（if (fs.is_open()) 或隐式 bool 转换），读取使用 >>（格式化读取，跳过空白）或 getline（读取一行）。',
      '使用 ofstream 打开文件写入，默认模式是截断（清空文件），使用 app 模式追加。',
      '使用二进制模式（binary）读写非文本文件（如图片、音频），用 read/write 成员函数，配合 reinterpret_cast<const char*>。',
      '使用 stringstream 进行文本解析：将字符串倒入 stringstream，然后像 cin 一样提取数据（istringstream iss(str); int x; iss >> x;）。',
      '使用 ostringstream 进行类型转换或格式化输出：将数值转换为字符串（ostringstream oss; oss << 42; string s = oss.str();），比 to_string 更灵活（可以指定格式）。',
    ],
    notes: [
      '流的状态：good()（一切正常）、eof()（到达文件尾）、fail()（格式化读取失败，如期望数字但遇到字母）、bad()（严重错误，如磁盘故障）。',
      '>> 运算符读取时会跳过前导空白，读取直到遇到空白；如果要读取整行（可能包含空格），用 getline(fs, str)。',
      '文件流对象不能拷贝（删除拷贝构造和拷贝赋值），但可以移动（C++11 起，用 std::move 转移所有权）。',
      '使用 RAII：文件流在析构时自动关闭文件，不需要显式调用 close()（但显式调用可以提前关闭并检查是否成功）。',
      'C++17 起，文件流支持 open 接受 std::filesystem::path（在 <filesystem> 中），更好地支持 Unicode 文件名。',
    ],
    problem: '解决"如何在 C++ 中进行文件读写、使用字符串流进行文本解析和类型转换，以及理解流的状态和错误处理"的问题。',
    demo: CPP24Demo,
    code: () => Promise.resolve(`#include <iostream>
#include <fstream>
#include <sstream>

int main() {
    // 写入文件
    std::ofstream outFile("example.txt");
    outFile << "Hello, C++!" << std::endl;
    outFile.close();

    // 读取文件
    std::ifstream inFile("example.txt");
    std::string line;
    while (std::getline(inFile, line)) {
        std::cout << "读取: " << line << std::endl;
    }

    // 字符串流
    std::string data = "42 3.14 Hello";
    std::istringstream iss(data);
    int num;
    double pi;
    std::string word;
    iss >> num >> pi >> word;
    std::cout << num << ", " << pi << ", " << word << std::endl;

    return 0;
}`),
    language: 'cpp',
  },
{
    id: 'CPP_25',
    title: '并发编程：std::thread、mutex、lock 与 async',
    navTitle: '并发编程',
    category: '并发与多线程',
    path: '/cpp/cpp-25/concurrency',
    summary: '理解 C++11 引入的并发支持，掌握线程创建、互斥锁、条件变量和异步任务的基本用法。',
    principle: 'C++11 在语言中直接支持多线程并发（之前依赖平台特定 API 如 pthread 或 Windows API）。std::thread 表示线程，构造时传入函数和参数即启动线程；需要显式 join（等待线程完成）或 detach（分离线程，后台运行），否则线程对象析构时会调用 std::terminate。互斥锁（std::mutex）保护共享数据，lock_guard 和 unique_lock 是 RAII 锁包装，确保自动解锁。条件变量（std::condition_variable）用于线程间通信（一个线程等待某个条件，另一个线程通知条件已满足）。std::async 启动异步任务，返回 std::future，可以获取任务结果（支持异常传播）。',
    flow: [
      '创建线程：std::thread t(func, args...);，确保在线程对象销毁前调用 t.join() 或 t.detach()（推荐 join，除非确实需要分离）。',
      '使用互斥锁保护共享数据：在访问共享数据前 lock，访问后 unlock，使用 lock_guard 自动管理（构造时 lock，析构时 unlock）。',
      '避免死锁：如果需要在同一线程中锁多个互斥锁，使用 std::lock（可以同时锁多个互斥锁，使用避免死锁的算法）配合 lock_guard（传入 std::adopt_lock 表示已经锁住）。',
      '使用条件变量等待条件：while (!condition) cv.wait(lock);（必须用 while 循环防止虚假唤醒），另一个线程修改条件后调用 cv.notify_one() 或 cv.notify_all()。',
      '使用 std::async 启动异步任务：auto fut = std::async(std::launch::async, func, args...); auto result = fut.get();（get 会等待任务完成并获取结果，如果任务抛异常，异常会在 get 时重新抛出）。',
    ],
    notes: [
      '线程间共享数据需要同步，否则会导致数据竞争（data race，未定义行为）。用互斥锁、原子操作或其他同步原语保护共享数据。',
      'std::lock_guard 是简单的 RAII 锁包装，不能在作用域内手动 unlock；std::unique_lock 更灵活，可以手动 lock/unlock，适用于条件变量和 std::lock。',
      '条件变量的虚假唤醒：即使没有调用 notify，等待的线程也可能被唤醒（系统原因），因此等待条件变量时必须在循环中检查条件（while (!pred) wait(lock); 或使用 wait(lock, pred) 重载）。',
      'std::future 的 get() 只能调用一次（之后 future 变为无效），如果需要多次获取结果，用 std::shared_future。',
      'C++20 引入信号量（std::counting_semaphore、std::binary_semaphore）、闩（std::latch）、屏障（std::barrier），丰富了并发原语。',
    ],
    problem: '解决"如何在 C++ 中创建和管理线程、保护共享数据避免数据竞争，以及使用条件变量进行线程间通信"的问题。',
    demo: CPP25Demo,
    code: () => Promise.resolve(`#include <iostream>
#include <thread>
#include <mutex>
#include <vector>
#include <future>

int main() {
    // 创建线程
    std::thread t1([]() {
        std::cout << "线程 1 正在执行" << std::endl;
    });
    t1.join();

    // 使用 async 异步任务
    std::future<int> result = std::async([]() {
        return 42;
    });
    std::cout << "结果：" << result.get() << std::endl;

    return 0;
}`),
    language: 'cpp',
  },
{
    id: 'CPP_26',
    title: '现代 C++ 核心特性：auto、范围 for、初始化列表、nullptr',
    navTitle: '现代特性',
    category: '现代 C++',
    path: '/cpp/cpp-26/modern-cpp-core',
    summary: '掌握 C++11/14/17 引入的核心便利特性，编写更简洁、安全、表达力更强的现代 C++ 代码。',
    principle: 'C++11 及后续标准引入了大量提升开发体验的特性。auto 关键字让编译器推导变量类型，减少冗长类型名，也能保证用正确类型初始化（如 auto i = v.size(); 避免 signed/unsigned 比较）。范围 for 循环（for (auto& x : container)）安全简洁地遍历容器。统一初始化（用花括号 {}）可以防止窄化转换，且可以初始化任何对象（包括容器、动态分配数组等）。nullptr 替代 NULL，是类型安全的空指针常量。nullptr_t 是 nullptr 的类型。这些特性不仅提升代码可读性，还能在编译期捕获更多错误。',
    flow: [
      '使用 auto 减少显式类型名，特别是迭代器、lambda、模板类型等复杂类型（如 auto it = m.find(k); 而非 std::map<K,V>::iterator it = ...;）。',
      '使用范围 for 遍历容器，需要修改元素时用引用（for (auto& x : vec) x *= 2;），只读时用 const 引用（for (const auto& s : strs) ...）。',
      '使用统一初始化（花括号）初始化对象，它可以：\
        1. 防止窄化转换（int i{3.14}; 编译错误）；\
        2. 初始化容器（vector<int> v{1,2,3};）；\
        3. 初始化动态数组（int* p = new int[3]{1,2,3}; C++11起）。',
      '用 nullptr 替代 NULL 或 0 表示空指针，避免函数重载时的二义性（NULL 通常是 0 或 (void*)0）。',
      '使用类型别名（using）替代 typedef，语法更清晰且支持模板别名（template <typename T> using Vec = vector<T>;）。',
    ],
    notes: [
      'auto 会去掉顶层 const 和引用（auto x = i; 中 x 是 int，即使 i 是 const int&），如果需要保留，要显式写明（auto& x = i; 中 x 是 const int&）。',
      '范围 for 循环底层使用 begin() 和 end()（可以是成员函数或自由函数），因此可以用于任何提供 begin/end 的对象（包括数组、初始化列表、标准容器）。',
      '统一初始化的一个陷阱：如果存在构造函数接受 std::initializer_list，优先匹配该构造函数（可能导致意外行为，如 vector<int> v(10, 20) 是 10 个元素值 20；vector<int> v{10, 20} 是两个元素 10 和 20）。',
      'C++14 允许用 auto 声明函数返回类型（return 语句必须全返回相同类型，编译器推导）；C++14 还允许 lambda 参数用 auto（泛型 lambda）。',
      'C++17 引入结构化绑定（auto [a, b] = pair; 或 auto& [key, value] = *map_it;），可以简洁地解构元组、pair、结构体。',
    ],
    problem: '解决"如何编写简洁、安全、现代化的 C++ 代码，充分利用 C++11/14/17 的语言特性提升开发效率"的问题。',
    demo: CPP26Demo,
    code: () => Promise.resolve(`#include <iostream>
#include <vector>
#include <map>

int main() {
    // auto 类型推导
    auto x = 42;
    auto name = "栗子";

    // 范围 for
    std::vector<int> nums = {1, 2, 3, 4, 5};
    for (auto& num : nums) {
        num *= 2;
    }

    // 结构化绑定（C++17）
    std::map<std::string, int> scores{{"Alice", 95}, {"Bob", 87}};
    for (const auto& [name, score] : scores) {
        std::cout << name << ": " << score << std::endl;
    }

    return 0;
}`),
    language: 'cpp',
  },
{
    id: 'CPP_27',
    title: '编译期计算：constexpr、consteval、constinit',
    navTitle: '编译期计算',
    category: '现代 C++',
    path: '/cpp/cpp-27/compile-time-computation',
    summary: '理解 C++ 编译期计算机制，掌握 constexpr、consteval、constinit 的用法与限制，将计算从运行期移到编译期。',
    principle: '编译期计算可以提升运行时性能（计算在编译期完成，运行时直接使用结果）并增强类型安全。constexpr（C++11 引入，C++14/17/20 放宽限制）声明变量或函数可以在编译期求值；constexpr 函数在一定条件（传入编译期常量参数）下会在编译期求值，否则在运行期求值。consteval（C++20）声明函数必须在编译期求值（立即函数）。constinit（C++20）声明变量必须在编译期初始化（但变量本身可以是运行期可修改的）。编译期计算的限制：C++11 中 constexpr 函数体只能包含 return 语句和其他 constexpr 函数调用；C++14 起 constexpr 函数可以包含变量声明、循环、条件等（几乎和普通函数一样）。',
    flow: [
      '将可以在编译期计算的函数声明为 constexpr（如数学函数、数组大小计算），让编译器在编译期计算（如果参数是编译期常量）。',
      '使用 constexpr 变量定义编译期常量（如 constexpr int N = 1024;），可以用于数组大小、模板参数等非类型模板参数。',
      'C++20 中，如果确保函数必须在编译期求值（如元编程、代码生成），使用 consteval 而非 constexpr。',
      '使用 constinit 确保静态变量或全局变量在编译期初始化，避免静态初始化顺序问题（Static Initialization Order Fiasco）。',
      'C++20 引入 std::bit_cast（需要 constexpr）可以在编译期进行位级别的类型转换（如将 float 的位表示解释为 int）。',
    ],
    notes: [
      'constexpr 变量是 const 的，且必须用编译期常量表达式初始化；constexpr 函数被编译期常量参数调用时在编译期求值，被运行期值调用时在运行期求值。',
      'C++14 起 constexpr 函数可以包含局部变量、循环、条件、switch、goto（但不能包含 goto 跨变量定义）、try/catch（但不能抛异常）。',
      'consteval 函数（立即函数）比 constexpr 更严格：它必须在编译期求值，任何导致它在运行期求值的情况都是编译错误（用于元编程、反射等必须在编译期完成的操作）。',
      'constexpr 构造函数可以创建编译期常量对象，compile-time 数据结构（如编译期计算的查找表）可以用 constexpr 构造函数和 constexpr 成员函数构建。',
      'C++20 起，std::vector 和 std::string 的部分操作是 constexpr 的（在编译期可以构造 vector、string 等，但有限制），这使得编译期计算能力大大增强。',
    ],

    demo: CPP27Demo,
    code: () => Promise.resolve(`#include <iostream>\n\nconstexpr int factorial(int n) {\n    return (n <= 1) ? 1 : n * factorial(n - 1);\n}\n\nconsteval int alwaysCompileTime(int x) {\n    return x * 2;\n}\n\nint main() {\n    constexpr int result = factorial(10);\n    std::cout << "10! = " << result << std::endl;\n    \n    int x = 21;\n    int y = alwaysCompileTime(x);\n    std::cout << "alwaysCompileTime(21) = " << y << std::endl;\n    \n    return 0;\n}`),
    language: 'cpp',
    problem: '解决"如何将计算从运行期移到编译期、理解 constexpr/consteval/constinit 的适用场景与限制，以及利用编译期计算提升性能"的问题。',
  },
{
    id: 'CPP_28',
    title: 'C++20 模块：替代头文件的新方式',
    navTitle: '模块',
    category: '现代 C++',
    path: '/cpp/cpp-28/modules',
    summary: '了解 C++20 引入的模块系统，理解它如何解决头文件的问题（宏泄漏、包含顺序依赖、编译速度慢），以及基本用法。',
    principle: '传统 C++ 使用头文件（.h）和源文件（.cpp）分离声明和实现，预处理器 #include 将头文件内容文本替换到源文件中，导致宏泄漏、包含顺序敏感、重复包含（需要 include guard 或 #pragma once）、编译速度慢（每个翻译单元都要重新解析头文件）。模块（C++20）提供了一种现代的、封装更好的代码组织方式：模块接口文件（.ixx 或 .cppm）用 export module M; 声明模块，用 export 标记要导出的声明；模块实现文件可以是在模块接口文件中直接提供定义，或是单独的模块实现分区。import M; 导入模块，只导入导出的名称，宏不会泄漏，编译速度更快（模块只解析一次）。',
    flow: [
      '定义模块接口：创建 .cppm 文件，用 export module M; 声明模块，用 export 标记要导出的函数、类、变量。',
      '模块实现可以在模块接口文件中直接提供（适合小模块），也可以分出去（用 module M:part; 和 export module M; 组合分区）。',
      '使用 import M; 导入模块，模块名可以是标准库模块（如 import std; 或 import std.io; C++23 起）。',
      '理解模块和头文件的互操作：可以 #include 头文件到模块实现中（但头文件的宏不会影响模块的使用者）；也可以创建模块接口用 import 包装头文件（header units，import "header.h";）。',
      '模块的隐私性：未导出的声明在模块内部可见，但模块使用者不可见，提供了更好的封装（相比头文件，头文件几乎所有声明都在头文件中暴露）。',
    ],
    notes: [
      '模块目前（C++20/23）的编译器支持仍有限：MSVC 支持较好；GCC 从 11 开始支持（需要 -fmodules-ts 和模块映射）；Clang 支持进行中。实际项目迁移到模块可能需要一段时间。',
      '模块避免了宏泄漏（#define 在模块实现中定义不会影响导入模块的代码），但也意味着不能用宏来影响模块接口（这是好事，提高了封装性）。',
      '模块可以重新导出导入的模块（import A; export import A;），用于组织大型模块层次。',
      '头文件仍然会存在很长时间（与 C 的互操作、与不支持模块的编译器兼容），但新项目可以优先考虑模块。',
      '模块和 ABI：模块可能改变名称修饰（name mangling），导致不同编译器或不同版本之间的模块不兼容，标准库模块（import std;）有助于缓解此问题。',
    ],
    demo: CPP28Demo,
    code: () => Promise.resolve(`// math.cppm - 模块接口\nexport module math;\n\nexport int add(int a, int b) {\n    return a + b;\n}\n\nexport int multiply(int a, int b) {\n    return a * b;\n}\n\n// main.cpp - 使用模块\nimport math;\nimport <iostream>;\n\nint main() {\n    std::cout << "3 + 4 = " << add(3, 4) << std::endl;\n    std::cout << "3 * 4 = " << multiply(3, 4) << std::endl;\n    return 0;\n}`),
    language: 'cpp',
    problem: '解决"如何理解 C++20 模块系统、它与传统头文件相比的优势，以及如何在项目中使用模块"的问题。',
  },
{
    id: 'CPP_29',
    title: '常用设计模式在 C++ 中的实现',
    navTitle: '设计模式',
    category: '工程实践',
    path: '/cpp/cpp-29/design-patterns',
    summary: '了解如何在 C++ 中实现常用的设计模式（单例、工厂、观察者、策略等），以及 C++ 特性如何简化模式实现。',
    principle: '设计模式是面向对象设计中常见问题的典型解决方案。C++ 的特性（模板、RAII、智能指针、移动语义）可以简化许多设计模式的实现。单例模式（Singleton）：确保类只有一个实例，提供全局访问点；C++11 起，函数局部 static 变量是线程安全的初始化（Meyer\'s Singleton）。工厂模式（Factory）：将对象创建延迟到派生类，可以使用模板或函数返回 unique_ptr<Base>。观察者模式（Observer）：对象状态变化时通知依赖者；可以用 std::function 和 std::vector 简化实现（无需定义 Observer 接口）。策略模式（Strategy）：定义算法族，封装每个算法，使它们可以互换；可以用函数指针、std::function 或模板实现，比继承更灵活。',
    flow: [
      '实现单例模式：将构造函数私有，提供静态成员函数返回引用（static Singleton& instance() { static Singleton s; return s; }，C++11 线程安全）。',
      '实现工厂模式：定义产品接口（抽象基类），具体工厂创建具体产品；使用 unique_ptr<Base> 返回，调用者不需要关心删除。',
      '实现观察者模式：主题（Subject）维护观察者列表（vector<function<void(Args...)>>），提供 attach/detach/notify 方法；观察者只需提供可调用对象，不再需要继承 Observer 接口（C++ 更灵活）。',
      '实现策略模式：用 typedef 或 using 定义策略函数类型，类持有该类型的成员变量；或用模板参数指定策略（编译期策略选择，零开销）。',
      '使用 RAII 和智能指针管理模式中动态分配的资源（如工厂创建的对象、观察者列表中的资源等）。',
    ],
    notes: [
      'Meyer\'s Singleton（函数局部 static）是推荐的单例实现：简洁、线程安全（C++11 保证局部 static 初始化是线程安全的）、懒初始化。',
      '模板方法模式（Template Method）：在基类中定义算法骨架，将一些步骤延迟到派生类；C++ 的非虚接口（NVI）惯用法是模板方法的一种实现（公有非虚函数调用保护的虚函数）。',
      '访问者模式（Visitor）：将算法与对象结构分离；C++ 的双重分派（accept(Visitor& v) 调用 v.visit(*this)）是经典实现，但 C++17 的 std::variant 和 std::visit 提供了更类型安全且无需继承的替代方案。',
      '原型模式（Prototype）：通过克隆创建对象；C++ 可以用虚克隆函数（virtual unique_ptr<Base> clone() const = 0;）实现，派生类返回 unique_ptr<Derived>。',
      '现代 C++ 中，许多模式可以用 lambda 和 std::function 简化（如策略、命令、观察者），不再需要严格的接口继承，代码更灵活。',
    ],
    demo: CPP29Demo,
    code: () => Promise.resolve(`#include <iostream>\n#include <memory>\n#include <vector>\n#include <functional>\n\n// 单例模式\nclass Singleton {\nprivate:\n    Singleton() = default;\npublic:\n    static Singleton& instance() {\n        static Singleton s;\n        return s;\n    }\n    void hello() { std::cout << "Hello from Singleton" << std::endl; }\n};\n\n// 观察者模式\nclass Subject {\n    std::vector<std::function<void(int)>> observers;\npublic:\n    void attach(std::function<void(int)> obs) { observers.push_back(obs); }\n    void notify(int value) {\n        for (auto& obs : observers) obs(value);\n    }\n};\n\nint main() {\n    Singleton::instance().hello();\n    \n    Subject sub;\n    sub.attach([](int x) { std::cout << "Observer 1: " << x << std::endl; });\n    sub.attach([](int x) { std::cout << "Observer 2: " << x << std::endl; });\n    sub.notify(42);\n    \n    return 0;\n}`),
    language: 'cpp',
    problem: '解决"如何在 C++ 中实现常用设计模式、利用现代 C++ 特性简化模式实现，以及选择适合问题的设计模式"的问题。',
  },
{
    id: 'CPP_30',
    title: 'C++ 编码规范与工程最佳实践',
    navTitle: '编码规范',
    category: '工程实践',
    path: '/cpp/cpp-30/coding-standards',
    summary: '掌握现代 C++ 编码规范、常见陷阱规避，以及构建、测试、持续集成等工程实践要点。',
    principle: '良好的编码规范和工程实践可以提高代码质量、可读性和可维护性。C++ 有一些著名的编码规范：C++ Core Guidelines（C++ 之父 Bjarne Stroustrup 和 Herb Sutter 主导，涵盖类型安全、接口设计、资源管理、并发等）、Google C++ Style Guide、MISRA C++（汽车工业）。核心原则：使用 RAII 和智能指针管理资源（避免裸 new/delete）；优先使用标准库（不要重复造轮子）；使用 const 正确（帮助编译器优化，自文档化）；避免使用宏（用 constexpr、enum、template 替代）；理解对象生命周期和所有权；使用工具（静态分析、sanitizers、clange-tidy）捕获错误。构建系统：CMake 是现代 C++ 事实标准；包管理：vcpkg、Conan；测试：Google Test、Catch2。',
    flow: [
      '遵循 C++ Core Guidelines 的核心建议：R.1（管理资源用 RAII）、F.15（按 const 引用传递，按值返回）、C.21（如果定义了析构函数，也要定义拷贝/移动操作）等。',
      '使用静态分析工具：clang-tidy（基于 LLVM/Clang，可检查现代 C++ 规范、性能、正确性）、Cppcheck（开源静态分析）、PVS-Studio（商业）。',
      '使用 sanitizers 检测运行期错误：AddressSanitizer（内存错误）、UndefinedBehaviorSanitizer（未定义行为）、ThreadSanitizer（数据竞争）。',
      '采用现代构建系统：CMake（跨平台、广泛使用），编写 CMakeLists.txt 管理依赖、编译选项、测试。',
      '使用持续集成（CI）：GitHub Actions、GitLab CI 等，自动运行构建、测试、静态分析、sanitizers。',
    ],
    notes: [
      'C++ Core Guidelines 有工具支持（Guideline Support Library，GSL），提供了 gsl::owner<T*>（标记拥有所有权的指针）、gsl::span（替代指针+大小）、gsl::not_null（标记不可能为 null 的指针）等，帮助强制规范。',
      'C++ 中有一些众所周知的陷阱：数组退化、悬挂指针/引用、浅拷贝、未初始化变量、有符号/无符号混用、宏副作用、多重继承的菱形问题、异常安全问题等，了解并避免它们。',
      'C++ 社区推崇零开销抽象（zero-overhead abstraction）：用户手写的代码不会比精心优化的底层代码慢；不使用的特性不会带来开销。模板和内联是实现零开销抽象的重要工具。',
      'C++ 演进迅速：C++11（重大更新）、C++14（小更新）、C++17（重大更新：结构化绑定、if constexpr、折叠表达式、文件系统库）、C++20（重大更新：模块、概念、协程、范围库）、C++23（小更新）。保持学习新标准。',
      '跨平台 C++ 开发注意事项：字节序（用 <bit> 中的 endian）、字符编码（用 u8"" 字符串字面量、std::u8string、std::filesystem::path 的 unicode 支持）、编译器特定扩展（尽量使用标准特性，用预定义宏处理差异）。',
    ],
    demo: CPP30Demo,
    code: () => Promise.resolve(`#include <iostream>\n#include <memory>\n#include <vector>\n\n// 好的做法：使用 RAII 和智能指针\nclass Resource {\n    std::unique_ptr<int[]> data;\npublic:\n    Resource() : data(std::make_unique<int[]>(100)) {}\n    void use() { data[0] = 42; }\n};\n\n// 不好的做法：裸指针\nvoid badPractice() {\n    int* p = new int[100];\n    // 如果这里抛异常，内存泄漏\n    delete[] p;\n}\n\nint main() {\n    Resource r;  // 自动管理内存\n    r.use();\n    \n    // 使用 const 正确\n    const std::vector<int> vec = {1, 2, 3};\n    // vec.push_back(4);  // 编译错误：vec 是 const\n    \n    return 0;\n}`),
    language: 'cpp',
    problem: '解决"如何编写高质量、可维护的 C++ 代码、避免常见陷阱，以及建立现代 C++ 工程的构建、测试和持续集成流程"的问题。',
  }
]

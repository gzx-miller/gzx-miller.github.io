const n=`// ═══════════════════════════════════════════
// 1. 内置数组与下标
// ═══════════════════════════════════════════

#include <iostream>

int main() {
    int arr[5] = {1, 2, 3};                 // 未列出的元素被补 0
    std::cout << arr[0] << std::endl;       // 结果：1
    std::cout << arr[4] << std::endl;       // 结果：0，默认补零
    // arr[10] = 5;                         // 越界访问：未定义行为，不报错

    int n = sizeof(arr) / sizeof(arr[0]);   // 结果：5，在数组本身所在的作用域内
    return 0;
}

// ═══════════════════════════════════════════
// 2. 数组退化为指针
// ═══════════════════════════════════════════

#include <cstddef>

void printAll(int a[], std::size_t n) {     // int a[] 等价于 int* a
    std::cout << sizeof(a) << std::endl;    // 结果：指针大小，不是数组总大小
    for (std::size_t i = 0; i < n; ++i) {   // 长度必须由调用方额外传入
        std::cout << a[i] << " ";
    }
}

int main() {
    int arr[3] = {10, 20, 30};
    printAll(arr, 3);                        // 结果：10 20 30
    return 0;
}

// ═══════════════════════════════════════════
// 3. C 风格字符串与 '\\0'
// ═══════════════════════════════════════════

#include <cstring>

int main() {
    char greeting[] = "Hello";              // 实际占 6 字节，末尾含 '\\0'
    std::cout << greeting << std::endl;     // 结果：Hello
    std::cout << strlen(greeting) << std::endl;  // 结果：5，只数到 '\\0' 前
    std::cout << sizeof(greeting) << std::endl;  // 结果：6，含终止符
    return 0;
}

// ═══════════════════════════════════════════
// 4. std::string 常用操作
// ═══════════════════════════════════════════

#include <string>

int main() {
    std::string s1 = "Hello";
    std::string s2 = "World";
    std::string s3 = s1 + ", " + s2 + "!";  // 结果：Hello, World!
    std::cout << s3.size() << std::endl;    // 结果：13
    std::cout << s3.substr(0, 5) << std::endl;   // 结果：Hello
    std::cout << s3.find("World") << std::endl;  // 结果：7，World 起始下标
    std::cout << s3.find("xyz") << std::endl;    // 结果：npos，未找到
    std::cout << s3.at(1) << std::endl;     // 结果：e，at 会检查越界
    return 0;
}

// ═══════════════════════════════════════════
// 5. string 与 char* 互转
// ═══════════════════════════════════════════

int main() {
    std::string s = "Hello";
    const char* cstr = s.c_str();           // string 转只读 C 风格字符串
    std::cout << cstr << std::endl;         // 结果：Hello
    // 注意：s 被修改或销毁后，cstr 可能悬垂

    const char* raw = "World";
    std::string fromRaw = raw;              // C 风格字符串转 string，自动拷贝
    std::cout << fromRaw << std::endl;      // 结果：World
    return 0;
}

// ═══════════════════════════════════════════
// 6. std::array 与 std::vector 的取舍、遍历
// ═══════════════════════════════════════════

#include <array>
#include <vector>

int main() {
    std::array<int, 3> fixed{1, 2, 3};      // 长度编译期确定，不可变
    std::vector<int> dynamic{1, 2, 3};
    dynamic.push_back(4);                   // 结果：长度从 3 变为 4，运行期可变

    for (const auto& x : fixed) {           // 只读引用遍历，避免拷贝
        std::cout << x << " ";              // 结果：1 2 3
    }
    for (auto& x : dynamic) {               // 可写引用遍历
        x *= 2;                             // 结果：dynamic 变为 2 4 6 8
    }
    return 0;
}
`;export{n as default};

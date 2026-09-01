import{d as e,b as s,e as a,f as d,a0 as i,o,I as l}from"./DutfXOOr.js";const n={class:"demo-card"},r=`#include <iostream>
#include <fstream>
#include <sstream>
#include <string>

int main() {
    // 写入文件
    std::ofstream outFile("example.txt");
    if (outFile.is_open()) {
        outFile << "Hello, C++!" << std::endl;
        outFile << "第二行内容" << std::endl;
        outFile.close();
    }

    // 读取文件（逐行）
    std::ifstream inFile("example.txt");
    if (inFile.is_open()) {
        std::string line;
        while (std::getline(inFile, line)) {
            std::cout << "读取: " << line << std::endl;
        }
        inFile.close();
    }

    // 字符串流（内存中的 I/O）
    std::string data = "42 3.14 Hello";
    std::istringstream iss(data);
    int num;
    double pi;
    std::string word;
    iss >> num >> pi >> word;
    std::cout << num << ", " << pi << ", " << word << std::endl;

    return 0;
}`,c=e({__name:"CPP24FileIO",setup(p){return(u,t)=>(o(),s("div",n,[t[0]||(t[0]=a("h3",null,"🌰 文件 I/O：ifstream、ofstream 与字符串流",-1)),a("pre",{class:"code-block"},[a("code",null,d(r))]),t[1]||(t[1]=i('<div class="tips-box" data-v-7340b95a><p data-v-7340b95a><strong data-v-7340b95a>文件流模式：</strong></p><ul data-v-7340b95a><li data-v-7340b95a><code data-v-7340b95a>std::ios::in</code>：读取模式</li><li data-v-7340b95a><code data-v-7340b95a>std::ios::out</code>：写入模式（默认截断）</li><li data-v-7340b95a><code data-v-7340b95a>std::ios::app</code>：追加模式</li><li data-v-7340b95a><code data-v-7340b95a>std::ios::binary</code>：二进制模式</li></ul><p data-v-7340b95a><strong data-v-7340b95a>字符串流用途：</strong></p><ul data-v-7340b95a><li data-v-7340b95a><code data-v-7340b95a>std::istringstream</code>：解析字符串（替代 sscanf）</li><li data-v-7340b95a><code data-v-7340b95a>std::ostringstream</code>：格式化输出到字符串（替代 sprintf）</li></ul></div>',1))]))}}),m=l(c,[["__scopeId","data-v-7340b95a"]]);export{m as default};

import{d as s,b as d,e,f as a,a0 as i,o,F as l}from"./CfJSWYGO.js";const n={class:"demo-card"},f=`#include <iostream>
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
}`,r=s({__name:"CPP24FileIO",setup(c){return(p,t)=>(o(),d("div",n,[t[0]||(t[0]=e("h3",null,"🌰 文件 I/O：ifstream、ofstream 与字符串流",-1)),e("pre",{class:"code-block"},[e("code",null,a(f))]),t[1]||(t[1]=i('<div class="tips-box" data-v-ff80179b><p data-v-ff80179b><strong data-v-ff80179b>文件流模式：</strong></p><ul data-v-ff80179b><li data-v-ff80179b><code data-v-ff80179b>std::ios::in</code>：读取模式</li><li data-v-ff80179b><code data-v-ff80179b>std::ios::out</code>：写入模式（默认截断）</li><li data-v-ff80179b><code data-v-ff80179b>std::ios::app</code>：追加模式</li><li data-v-ff80179b><code data-v-ff80179b>std::ios::binary</code>：二进制模式</li></ul><p data-v-ff80179b><strong data-v-ff80179b>字符串流用途：</strong></p><ul data-v-ff80179b><li data-v-ff80179b><code data-v-ff80179b>std::istringstream</code>：解析字符串（替代 sscanf）</li><li data-v-ff80179b><code data-v-ff80179b>std::ostringstream</code>：格式化输出到字符串（替代 sprintf）</li></ul></div>',1))]))}}),b=l(r,[["__scopeId","data-v-ff80179b"]]);export{b as default};

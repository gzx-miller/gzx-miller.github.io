// 工具链、编译与部署：从源码到线上
// 1. 源码（C/Rust/AssemblyScript 或手写 WAT）→ 编译器输出 .wasm
//    wabt:     wat2wasm add.wat -o add.wasm
//    emscripten: emcc main.c -o main.js (含 .wasm)
//    rustc:    rustc --target wasm32-unknown-unknown main.rs

// 2. 流式加载：边下载边编译（生产推荐，MIME 需为 application/wasm）
const response = await fetch('/add.wasm')
const { instance } = await WebAssembly.instantiateStreaming(response)

// 3. 调用导出函数
console.log(instance.exports.add(2, 3)) // 5

// 4. Module 可缓存复用：compile 得到不可变 Module，多次实例化零编译
const module = await WebAssembly.compile(bytes)
const inst = await WebAssembly.instantiate(module, importObject)

// 部署注意：MIME application/wasm；使用线程特性需 COOP/COEP 跨源隔离

;; 最小的 Wasm 模块：add(a, b) = a + b
;; 一个模块由若干"段"组成：类型段、函数段、导出段、代码段等
(module
  ;; 函数签名：(i32, i32) -> i32
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add
  )
  ;; 导出段：把内部函数以 "add" 暴露给宿主 JS
  (export "add" (func $add))
)

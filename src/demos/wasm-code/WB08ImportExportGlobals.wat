;; 导入导出与全局变量：Wasm 通过导入段声明对宿主的依赖
;; 通过导出段把函数、内存、表格、全局变量暴露出去
(module
  ;; 导入：声明对宿主 env.log 的依赖，实例化时由 JS 注入实现
  (import "env" "log" (func $log (param i32)))

  ;; 全局变量：可变（mut）需显式声明，初始 0
  (global $count (mut i32) (i32.const 0))

  (func $get (result i32)
    global.get $count
  )
  (func $inc
    global.get $count
    i32.const 1
    i32.add
    global.set $count
  )
  (func $dec
    global.get $count
    i32.const 1
    i32.sub
    global.set $count
  )
  (func $emit
    global.get $count
    call $log     ;; 调用宿主导入的函数（同步）
  )

  (export "count" (global $count))
  (export "get" (func $get))
  (export "inc" (func $inc))
  (export "dec" (func $dec))
  (export "emit" (func $emit))
)

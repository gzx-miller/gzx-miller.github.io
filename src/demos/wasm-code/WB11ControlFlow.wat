;; 控制流：if/else 结构化分支 + 递归调用
;; Wasm 只有 block / loop / if/else 三种结构化控制流
(module
  ;; 递归斐波那契：if 判断基线条件，else 递归求和
  (func $fib (param $n i32) (result i32)
    (if (result i32)
      (i32.lt_s (local.get $n) (i32.const 2))  ;; n < 2 为递归基线
      (then
        (local.get $n))
      (else
        (i32.add
          (call $fib (i32.sub (local.get $n) (i32.const 1)))
          (call $fib (i32.sub (local.get $n) (i32.const 2))))))
  )

  (export "fib" (func $fib))
)
;; 注意：没有 goto，跳转被限定在结构化块内；深递归可能栈溢出

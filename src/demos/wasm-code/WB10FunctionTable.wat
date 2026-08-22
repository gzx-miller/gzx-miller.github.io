;; 函数表与 call_indirect：按索引在运行时动态调用函数，并校验签名
(module
  ;; 函数表：按索引存放函数引用，最小 4 项
  (table 4 funcref)

  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add)
  (func $sub (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.sub)
  (func $mul (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.mul)
  (func $div (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.div_s)

  ;; 元素段：把 4 个函数填入表索引 0..3
  (elem (i32.const 0) $add $sub $mul $div)

  ;; dispatch(op, a, b)：按 op 索引调用，call_indirect 会校验签名
  (func $dispatch (param $op i32) (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    local.get $op
    call_indirect (param i32 i32) (result i32)
  )

  (export "table" (table 0))
  (export "dispatch" (func $dispatch))
  (export "add" (func $add))
  (export "sub" (func $sub))
  (export "mul" (func $mul))
  (export "div" (func $div))
)

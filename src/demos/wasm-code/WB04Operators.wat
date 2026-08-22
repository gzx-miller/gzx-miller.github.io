;; 运算指令集：Wasm 指令操作一个显式栈
;; local.get 压栈，运算符从栈顶弹操作数、压回结果
(module
  (func $mul (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.mul)             ;; 0x6c
  (func $div (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.div_s)           ;; 0x6d 整除，商向零取整
  (func $xor (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.xor)             ;; 0x73 异或
  (func $shl (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.shl)             ;; 0x74 左移，移位数需小于 32
  (func $fadd (param $a f32) (param $b f32) (result f32)
    local.get $a
    local.get $b
    f32.add)             ;; 0x92 浮点指令独立命名空间

  (export "mul" (func $mul))
  (export "div" (func $div))
  (export "xor" (func $xor))
  (export "shl" (func $shl))
  (export "fadd" (func $fadd))
)

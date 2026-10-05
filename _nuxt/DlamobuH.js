const n=`;; WebAssembly 只有四种数值类型：i32 / i64 / f32 / f64
;; 函数签名、局部变量、内存读写都必须声明类型
(module
  ;; i32 函数：整数运算
  (func $mul (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.mul
  )
  ;; f32 函数：单精度浮点运算
  (func $fadd (param $a f32) (param $b f32) (result f32)
    local.get $a
    local.get $b
    f32.add
  )

  (export "mul" (func $mul))
  (export "fadd" (func $fadd))
)
;; 注意：i64 作为参数/返回值时 JS 必须用 BigInt 传输；
;; f32 是单精度，存在舍入误差，价格计算建议用 f64。
`;export{n as default};

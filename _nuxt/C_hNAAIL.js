const a=`;; SIMD 向量指令：v128 打包 4 个 i32，一条指令同时处理多个通道
(module
  (memory (export "memory") 1)

  ;; vadd(dest, a, b)：加载两组 128 位向量并相加，结果写回 dest
  (func $vadd (param $dest i32) (param $a i32) (param $b i32)
    local.get $dest
    local.get $a
    v128.load        ;; 加载向量 A（4 个 i32）
    local.get $b
    v128.load        ;; 加载向量 B（4 个 i32）
    i32x4.add        ;; 一次完成 4 路加法
    v128.store       ;; 结果写回内存
  )

  (export "vadd" (func $vadd))
)

;; 常用指令：i32x4.add / f32x4.mul / v128.load / v128.store
;; SIMD 是数据并行，配合多线程可叠加加速；不支持时抛 CompileError
`;export{a as default};

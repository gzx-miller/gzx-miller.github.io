const m=`;; 共享内存与原子操作
;; 共享内存由宿主创建并导入，页面需启用 COOP/COEP 跨源隔离
(module
  ;; 导入 1 页（64KiB）共享内存；shared 不能省略 max，min=max 表示固定大小
  (import "env" "memory" (memory 1 1 shared))
  (export "memory" (memory 0))

  ;; atomicAdd(addr)：原子地把该位置加一，返回操作前的旧值
  (func $atomicAdd (param $addr i32) (result i32)
    local.get $addr
    i32.const 1
    i32.atomic.rmw.add
  )

  (export "atomicAdd" (func $atomicAdd))
)

;; 常用原子指令：i32.atomic.load / store / i32.atomic.rmw.add / sub，
;; 以及 memory.atomic.wait32 / notify
;; 普通读写会"丢更新"，原子指令保证读-改-写一气呵成
`;export{m as default};

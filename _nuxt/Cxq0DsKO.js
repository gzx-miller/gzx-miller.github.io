const d=`;; 共享内存与原子操作
;; 共享内存需在模块声明 shared，页面启用 COOP/COEP 跨源隔离
(module
  ;; min=max=1 页（64KiB），且 shared：buffer 是 SharedArrayBuffer
  (memory (export "memory") 1 1 shared)

  ;; atomicAdd(addr)：原子地把该位置加一，返回操作前的旧值
  (func $atomicAdd (param $addr i32) (result i32)
    local.get $addr
    i32.const 1
    i32.atomic.rmw.add
  )

  (export "atomicAdd" (func $atomicAdd))
)

;; 常用原子指令：atomic.load / store / add / sub / wait / notify
;; 普通读写会"丢更新"，原子指令保证读-改-写一气呵成
`;export{d as default};

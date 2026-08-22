;; 线性内存：一块连续字节数组，地址从 0 编号
;; 1 页 = 64KiB；JS 与 Wasm 通过 memory.buffer 共享同一块存储
(module
  (memory (export "memory") 1)

  ;; store8(off, val)：写一个字节
  (func $store8 (param $off i32) (param $val i32)
    local.get $off
    local.get $val
    i32.store8
  )

  ;; load8(off)：读一个字节
  (func $load8 (param $off i32) (result i32)
    local.get $off
    i32.load8_u
  )

  ;; sum(ptr, n)：从 ptr 累加 n 个 i32
  (func $sum (param $ptr i32) (param $n i32) (result i32)
    (local $end i32)
    (local $acc i32)
    ;; end = ptr + n * 4（i32 对齐到 4 字节）
    local.get $ptr
    local.get $n
    i32.const 4
    i32.mul
    i32.add
    local.set $end
    i32.const 0
    local.set $acc
    block $done
      loop $loop
        local.get $ptr
        local.get $end
        i32.ge_u
        br_if $done
        local.get $acc
        local.get $ptr
        i32.load offset=0
        i32.add
        local.set $acc
        local.get $ptr
        i32.const 4
        i32.add
        local.set $ptr
        br $loop
      end
    end
    local.get $acc
  )

  (export "store8" (func $store8))
  (export "load8" (func $load8))
  (export "sum" (func $sum))
)

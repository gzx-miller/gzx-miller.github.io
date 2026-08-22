;; 内存中的数据结构：数组
;; Wasm 没有数组类型，用"起始地址 + 元素个数"表达
;; 元素按固定步长连续排列，i32 对齐到 4 字节
(module
  (memory (export "memory") 1)

  ;; sum(ptr, n)：把 ptr 起始的 n 个 i32（价格）累加
  ;; 第 i 个元素地址 = ptr + i * 4
  (func $sum (param $ptr i32) (param $n i32) (result i32)
    (local $end i32)
    (local $acc i32)
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

  (export "sum" (func $sum))
)

;; JS 侧用 DataView 按小端读写 int32：
;;   const view = new DataView(instance.exports.memory.buffer)
;;   view.setInt32(8 + i * 4, prices[i], true)
;;   const total = instance.exports.sum(8, prices.length)

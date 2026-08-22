;; 函数定义与局部变量：参数与局部变量共享"函数局部索引空间"
;; local.get/set 按索引访问；局部变量在函数栈帧上分配，调用后回收
(module
  (memory (export "memory") 1)

  ;; sum(ptr, n)：购物车结算，把 ptr 起始的 n 个价格累加
  (func $sum (param $ptr i32) (param $n i32) (result i32)
    (local $end i32)  ;; 局部变量 0：结束地址
    (local $acc i32)  ;; 局部变量 1：累加器
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
    local.get $acc   ;; 函数结束时栈顶值作为返回值
  )

  (export "sum" (func $sum))
)

;; 字符串互操作：Wasm 没有字符串类型
;; 用"内存地址 + \0 结束符"表达 C 风格字符串
(module
  (memory (export "memory") 1)

  ;; strlen(ptr)：从指针数到 \0 返回长度
  (func $strlen (param $ptr i32) (result i32)
    (local $len i32)
    block $done
      loop $loop
        local.get $ptr
        local.get $len
        i32.add
        i32.load8_u
        i32.eqz
        br_if $done
        local.get $len
        i32.const 1
        i32.add
        local.set $len
        br $loop
      end
    end
    local.get $len
  )

  ;; toupper(ptr)：把小写字母原地转大写
  (func $toupper (param $ptr i32)
    block $done
      loop $loop
        local.get $ptr
        i32.load8_u
        i32.eqz
        br_if $done
        local.get $ptr
        i32.load8_u
        i32.const 0x61       ;; 'a'
        i32.ge_u
        local.get $ptr
        i32.load8_u
        i32.const 0x7a       ;; 'z'
        i32.le_u
        i32.and
        if
          local.get $ptr
          local.get $ptr
          i32.load8_u
          i32.const 0x20     ;; 大小写差 32
          i32.sub
          i32.store8
        end
        local.get $ptr
        i32.const 1
        i32.add
        local.set $ptr
        br $loop
      end
    end
  )

  (export "strlen" (func $strlen))
  (export "toupper" (func $toupper))
)

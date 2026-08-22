;; WAT 文本格式与二进制一一对应，wat2wasm 可编译成 .wasm
;; 每条指令都有固定操作码：local.get=0x20, i32.add=0x6a, end=0x0b
(module
  ;; 类型段：(i32, i32) -> i32
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a  ;; 20 00 取第 0 个参数入栈
    local.get $b  ;; 20 01 取第 1 个参数入栈
    i32.add       ;; 6a   弹出栈顶两数相加，结果入栈
  )               ;; 0b   end 函数体结束
  (export "add" (func $add)) ;; 07 ... 导出段
)

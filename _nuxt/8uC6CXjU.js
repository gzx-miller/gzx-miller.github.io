const n=`;; 异常处理：tag 定义异常类型，throw 抛出携带 payload 的异常
(module
  ;; 声明异常类型 tag：负载为一个 i32
  (tag $e (param i32))

  ;; div(a, b)：b 为 0 时抛出 tag 并携带负载 100
  (func $div (param $a i32) (param $b i32) (result i32)
    local.get $b
    i32.eqz
    if
      i32.const 100
      throw $e
    end
    local.get $a
    local.get $b
    i32.div_s
  )

  (export "div" (func $div))
  (export "e" (tag $e))
)

;; JS 侧捕获 WebAssembly.Exception：
;;   try { instance.exports.div(10, 0) }
;;   catch (e) { e.is(tag) && e.getArg(tag, 0) }
`;export{n as default};

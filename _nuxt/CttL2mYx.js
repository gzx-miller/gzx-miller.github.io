const e=`;; 引用类型：externref / funcref
;; externref 允许 Wasm 持有并传回一个 JS 对象的引用而不复制数据
(module
  ;; identity(obj)：原样返回传入的 externref 引用
  (func $identity (param $obj externref) (result externref)
    local.get $obj
  )

  (export "identity" (func $identity))
)

;; JS 侧：instance.exports.identity(obj) === obj（同一引用，未拷贝）
;; funcref 只用于函数引用（函数表），WasmGC 提案进一步允许直接操作结构体
`;export{e as default};

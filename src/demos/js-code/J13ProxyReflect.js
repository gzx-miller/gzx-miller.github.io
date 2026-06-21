// Proxy 与 Reflect

// ── 基础 Proxy：拦截 get/set ──
const user = { name: '小松鼠', age: 3 }
const proxy = new Proxy(user, {
  get(target, prop, receiver) {
    console.log(`读取 ${prop}`)
    return Reflect.get(target, prop, receiver)
  },
  set(target, prop, value, receiver) {
    console.log(`写入 ${prop} = ${value}`)
    return Reflect.set(target, prop, value, receiver)
  },
})
proxy.name        // 触发 get
proxy.age = 4     // 触发 set

// ── 其他常用 trap ──
const handler = {
  has(target, prop) {
    return prop in target   // 拦截 'prop' in proxy
  },
  deleteProperty(target, prop) {
    return Reflect.deleteProperty(target, prop) // 拦截 delete
  },
}

// ── 响应式代理模式（Vue 3 核心原理） ──
function reactive(obj) {
  const deps = new Map()
  return new Proxy(obj, {
    get(target, prop) {
      // 收集依赖（简化示意）
      if (!deps.has(prop)) deps.set(prop, new Set())
      return Reflect.get(target, prop)
    },
    set(target, prop, value) {
      const result = Reflect.set(target, prop, value)
      // 触发更新通知
      console.log(`${prop} 已更新为 ${value}`)
      return result
    },
  })
}

// ── 数组 Proxy：拦截 push / length 等 ──
const arr = new Proxy([], {
  set(target, prop, value) {
    if (prop !== 'length') console.log(`数组索引 ${prop} 写入 ${value}`)
    return Reflect.set(target, prop, value)
  },
})
arr.push('课程A', '课程B')  // 触发索引写入

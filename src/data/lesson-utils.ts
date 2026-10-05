import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import { restoreCodeSource } from './code-restore'

const demoModules = import.meta.glob<Component>('../demos/*.vue', { import: 'default' })
const vueCodeModules = import.meta.glob<string>('../demos/*.vue', { query: '?raw', import: 'default' })
const jsxCodeModules = import.meta.glob<string>('../demos/react-jsx/*.jsx', { query: '?raw', import: 'default' })
const stateCodeModules = import.meta.glob<string>('../demos/state-react/*.js', { query: '?raw', import: 'default' })
const jsCodeModules = import.meta.glob<string>('../demos/js-code/*.js', { query: '?raw', import: 'default' })
const tsCodeModules = import.meta.glob<string>('../demos/ts-code/*.ts', { query: '?raw', import: 'default' })
const styleCodeModules = import.meta.glob<string>('../demos/style-code/*', { query: '?raw', import: 'default' })

export function createDemo(name: string) {
  const loader = demoModules[`../demos/${name}.vue`]

  if (!loader) {
    throw new Error(`未找到内容组件：${name}`)
  }

  return defineAsyncComponent(async () => {
    // 注意：这里**不再**注入 Element Plus / Vue Flow 的官方样式。
    // 分类样式统一由「分类数据模块」自己引入（见 lessons/element-plus.ts、
    // lessons/vue-flow.ts 顶部的样式 import），与 category-*.css 同一套机制。
    // 早先的 `if (name.startsWith('E')) await import('../element-plus/styles')`
    // 分支是历史遗留：除 C++ 外的分类都已改用静态 demoComponent，这个分支
    // 从未命中，反而掩盖了"官方样式其实没被加载"的事实。
    return loader()
  })
}

export function createCodeLoader(path: string) {
  const modules = path.startsWith('react-jsx/')
    ? jsxCodeModules
    : path.startsWith('state-react/')
      ? stateCodeModules
      : path.startsWith('js-code/')
        ? jsCodeModules
        : path.startsWith('ts-code/')
          ? tsCodeModules
          : path.startsWith('style-code/')
            ? styleCodeModules
            : vueCodeModules
  const loader = modules[`../demos/${path}`]

  if (!loader) {
    throw new Error(`未找到内容源码：${path}`)
  }

  return () => loader().then(restoreCodeSource)
}

import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'

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
    if (name.startsWith('E')) await import('../element-plus/styles')
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

  return loader
}

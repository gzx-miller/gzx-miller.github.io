const e=`// 声明合并与模块扩展

// ── 接口合并（同名接口自动合并属性） ──
interface AppConfig {
  apiBase: string
  timeout: number
}

// 同文件中再次声明，TypeScript 自动合并
interface AppConfig {
  theme: 'light' | 'dark'
  locale: string
}

// config 拥有所有四个属性
const config: AppConfig = {
  apiBase: '/api/v1',
  timeout: 3000,
  theme: 'light',
  locale: 'zh-CN',
}

// ── 命名空间合并 ──
// 命名空间可以和类 / 函数 / 枚举合并，为它们添加额外成员
namespace Validation {
  export function isValidEmail(email: string): boolean {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)
  }
}

namespace Validation {
  export function isValidPhone(phone: string): boolean {
    return /^1[3-9]\\d{9}$/.test(phone)
  }
}

// 两个命名空间合并后同时拥有 isValidEmail 和 isValidPhone
console.log(Validation.isValidEmail('test@example.com'))  // true

// ── 模块扩展（declare module） ──
// 在 .d.ts 文件中扩展第三方模块的类型
//
// declare module 'axios' {
//   interface AxiosResponse<T = any> {
//     // 为所有响应添加自定义字段
//     serverTime: number
//     requestId: string
//   }
// }
//
// declare module 'vue-router' {
//   interface RouteMeta {
//     // 扩展路由元信息类型
//     requiresAuth?: boolean
//     title?: string
//     roles?: string[]
//   }
// }

// ── 声明文件（.d.ts） ──
// 纯类型文件，不含运行时代码，用于描述 JS 库的类型
//
// env.d.ts 示例：
// interface ImportMetaEnv {
//   readonly VITE_API_BASE: string
//   readonly VITE_APP_TITLE: string
// }

// ── 全局增强（declare global） ──
// declare global 只能在模块文件（有 import/export 的文件）中使用
// 在非模块的 .ts 文件中，顶层接口声明本身就在作用域内
export {}  // 使当前文件变为模块

declare global {
  interface Window {
    __APP_VERSION__: string
    __INITIAL_STATE__: Record<string, unknown>
  }

  // 扩展 HTMLElement，添加自定义 dataset 属性
  interface HTMLElement {
    dataset: DOMStringMap & {
      courseId?: string
      lessonIndex?: string
    }
  }
}

// 使用时无需类型断言
// window.__APP_VERSION__ = '2.0.0'

// ── 环境声明 ──
// declare 关键字告诉编译器"这个变量在运行时存在，但不在当前文件中定义"
declare const __DEV__: boolean
declare function loadScript(url: string): Promise<void>

console.log(config.apiBase)  // /api/v1
`;export{e as default};

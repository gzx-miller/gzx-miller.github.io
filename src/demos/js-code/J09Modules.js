// 动态 import()：按需加载模块，返回 Promise
async function loadChart() {
  // 首屏不下载图表代码，用户触发时才加载
  const module = await import('./charts.js')
  module.render()
}

// 静态 import 在构建时确定依赖，无法条件加载
// import { render } from './charts.js'

// 动态 import 适用于：
// - 路由级代码分割
// - 按需加载大型库（图表、编辑器）
// - 条件导入（根据运行时环境选择模块）

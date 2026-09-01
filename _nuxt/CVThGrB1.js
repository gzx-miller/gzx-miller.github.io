import{d as m,b as t,e,F as l,E as a,r as u,o as n,f as i,I as c}from"./DutfXOOr.js";const p={class:"demo-container"},_={class:"tips-grid"},f=m({__name:"E13Performance",setup(v){const d=u([{title:"启动优化",items:["延迟加载非关键模块","使用骨架屏","避免在主进程中执行同步 I/O"]},{title:"内存优化",items:["限制渲染进程数量","及时释放引用","使用 Web Workers 处理计算"]},{title:"渲染优化",items:["虚拟滚动长列表","节流防抖事件","使用 CSS 硬件加速"]}]);return(k,s)=>(n(),t("div",p,[s[0]||(s[0]=e("h2",null,"🌰 性能优化",-1)),s[1]||(s[1]=e("p",{class:"desc"},"优化 Electron 应用启动速度、内存占用和渲染性能。",-1)),e("div",_,[(n(!0),t(l,null,a(d.value,r=>(n(),t("div",{key:r.title,class:"tip-card"},[e("h3",null,i(r.title),1),e("ul",null,[(n(!0),t(l,null,a(r.items,o=>(n(),t("li",{key:o},i(o),1))),128))])]))),128))]),s[2]||(s[2]=e("div",{class:"code-block"},[e("h3",null,"启动优化示例"),e("pre",null,`// 延迟加载
app.whenReady().then(() => {
  createWindow()
  // 延迟加载耗时模块
  setTimeout(() => {
    require('heavy-module')
  }, 3000)
})

// 监控内存
setInterval(() => {
  const mem = process.memoryUsage()
  console.log('RSS:', Math.round(mem.rss / 1024 / 1024), 'MB')
}, 30000)`)],-1))]))}}),g=c(f,[["__scopeId","data-v-899730b0"]]);export{g as default};

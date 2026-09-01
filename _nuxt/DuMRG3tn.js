import{d as u,b as e,e as o,F as d,E as m,A as g,f as p,r as y,ag as v,o as l,ao as b,I as x}from"./DutfXOOr.js";const k={class:"demo-card"},K={class:"demo-section"},N={class:"button-row"},C={class:"notify-log"},P={key:0,class:"empty"},w=`// notificationPlugin.ts
import type { App, InjectionKey } from 'vue'

export const NotifyKey: InjectionKey<(msg: string) => void> =
  Symbol('notify')

export default {
  install(app: App, options?: { prefix?: string }) {
    const prefix = options?.prefix ?? '[通知]'

    // 注册全局组件
    app.component('GlobalNotify', NotifyComponent)

    // 通过 provide 注入方法
    app.provide(NotifyKey, (msg: string) => {
      showToast(prefix + ' ' + msg)
    })
  }
}

// 使用：app.use(notificationPlugin, { prefix: '🌰' })`,_=u({__name:"K24PluginDev",setup($){const r=y([]),a=Symbol("notify");b(a,t=>{r.value.unshift(`[通知] ${t} (${new Date().toLocaleTimeString()})`)});const c=v(a);function s(t){c({success:"课程创建成功！",warning:"积分即将用完",error:"网络请求失败",info:"新版本已发布"}[t]??t)}return(t,n)=>(l(),e("div",k,[n[6]||(n[6]=o("h3",null,"插件开发",-1)),o("div",K,[n[4]||(n[4]=o("h4",null,"插件能力演示",-1)),o("div",N,[o("button",{class:"btn success",onClick:n[0]||(n[0]=i=>s("success"))},"成功通知"),o("button",{class:"btn warning",onClick:n[1]||(n[1]=i=>s("warning"))},"警告通知"),o("button",{class:"btn error",onClick:n[2]||(n[2]=i=>s("error"))},"错误通知"),o("button",{class:"btn info",onClick:n[3]||(n[3]=i=>s("info"))},"信息通知")]),o("div",C,[(l(!0),e(d,null,m(r.value.slice(0,5),(i,f)=>(l(),e("div",{key:f,class:"log-item"},p(i),1))),128)),r.value.length===0?(l(),e("div",P,"点击按钮发送通知")):g("",!0)])]),o("div",{class:"code-section"},[n[5]||(n[5]=o("h4",null,"插件定义代码",-1)),o("pre",{class:"code-block"},p(w))]),n[7]||(n[7]=o("div",{class:"usage-section"},[o("h4",null,"使用方式"),o("pre",{class:"code-block"},`// main.ts
import notificationPlugin from './plugins/notificationPlugin'
app.use(notificationPlugin, { prefix: '🌰' })

// 组件中使用
import { inject } from 'vue'
import { NotifyKey } from './plugins/notificationPlugin'
const notify = inject(NotifyKey)!
notify('课程已更新')`)],-1))]))}}),D=x(_,[["__scopeId","data-v-157c1b7a"]]);export{D as default};

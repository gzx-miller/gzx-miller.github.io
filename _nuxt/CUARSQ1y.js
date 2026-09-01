import{d as r,b as t,e,F as i,E as l,a0 as c,r as u,o as n,M as f,f as o,I as p}from"./DutfXOOr.js";const v={class:"demo-container"},b={class:"security-check"},m={class:"icon"},g={class:"check-info"},_=r({__name:"E12Security",setup(y){const d=u([{name:"nodeIntegration: false",passed:!0,desc:"渲染进程不能直接使用 Node.js API"},{name:"contextIsolation: true",passed:!0,desc:"预加载脚本与渲染进程上下文隔离"},{name:"webSecurity: true",passed:!0,desc:"不允许跨域请求和禁用安全特性"},{name:"CSP 已配置",passed:!1,desc:"Content-Security-Policy 限制资源加载"},{name:"依赖无已知漏洞",passed:!1,desc:"定期运行 npm audit"},{name:"不允许加载远程代码",passed:!0,desc:"避免从远程 URL 加载脚本"}]);return(S,a)=>(n(),t("div",v,[a[1]||(a[1]=e("h2",null,"🌰 安全最佳实践",-1)),a[2]||(a[2]=e("p",{class:"desc"},"Electron 安全核心原则：最小权限、上下文隔离、内容安全策略。",-1)),e("div",b,[a[0]||(a[0]=e("h3",null,"安全检查清单",-1)),(n(!0),t(i,null,l(d.value,s=>(n(),t("div",{key:s.name,class:f(["check-item",{passed:s.passed,failed:!s.passed}])},[e("span",m,o(s.passed?"✅":"❌"),1),e("div",g,[e("strong",null,o(s.name),1),e("p",null,o(s.desc),1)])],2))),128))]),a[3]||(a[3]=c(`<div class="code-block" data-v-b2a5efa7><h3 data-v-b2a5efa7>安全配置示例</h3><pre data-v-b2a5efa7>// 主进程 - 正确的 BrowserWindow 配置
new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,      // ✅ 必须关闭
    contextIsolation: true,       // ✅ 必须开启
    webSecurity: true,            // ✅ 必须开启
    preload: path.join(__dirname, &#39;preload.js&#39;)
  }
})

// HTML - CSP 配置（必须放在 &lt;head&gt; 最顶部）
&lt;meta http-equiv=&quot;Content-Security-Policy&quot;
      content=&quot;default-src &#39;self&#39;;
               script-src &#39;self&#39;;
               style-src &#39;self&#39; &#39;unsafe-inline&#39;;
               img-src &#39;self&#39; data:;&quot;&gt;</pre></div><div class="tips" data-v-b2a5efa7><h3 data-v-b2a5efa7>安全原则</h3><ul data-v-b2a5efa7><li data-v-b2a5efa7><strong data-v-b2a5efa7>最小权限</strong>: 只给渲染进程需要的 API</li><li data-v-b2a5efa7><strong data-v-b2a5efa7>上下文隔离</strong>: 防止渲染进程访问 Node.js</li><li data-v-b2a5efa7><strong data-v-b2a5efa7>CSP</strong>: 防止 XSS 攻击升级为 RCE</li><li data-v-b2a5efa7><strong data-v-b2a5efa7>依赖审计</strong>: 定期检查依赖漏洞</li><li data-v-b2a5efa7><strong data-v-b2a5efa7>代码签名</strong>: 确保应用完整性</li></ul></div>`,2))]))}}),w=p(_,[["__scopeId","data-v-b2a5efa7"]]);export{w as default};

import{d as i,b as o,e as a,M as p,f as d,F as v,E as g,A as b,a0 as m,r as l,o as s,I as h}from"./DutfXOOr.js";const f={class:"demo-container"},U={class:"status-panel"},_={class:"event-log"},k={key:0,class:"hint"},w=i({__name:"E10AutoUpdate",setup(x){const n=l("idle"),e=l([]);function u(){e.value=[],n.value="checking",e.value.push("checking-for-update"),setTimeout(()=>{n.value="available",e.value.push("update-available: v2.0.0")},1e3),setTimeout(()=>{n.value="downloading",e.value.push("download-progress: 45%")},2e3),setTimeout(()=>{n.value="downloaded",e.value.push("update-downloaded"),e.value.push("提示用户重启应用完成更新")},3500)}return(A,t)=>(s(),o("div",f,[t[1]||(t[1]=a("h2",null,"🌰 自动更新",-1)),t[2]||(t[2]=a("p",{class:"desc"},"使用 autoUpdater 实现应用自动更新，掌握更新事件处理。",-1)),a("button",{class:"btn",onClick:u},"检查更新"),a("div",U,[a("div",{class:p(["status",n.value])}," 状态: "+d(n.value),3)]),a("div",_,[t[0]||(t[0]=a("h3",null,"更新事件",-1)),(s(!0),o(v,null,g(e.value,(c,r)=>(s(),o("div",{key:r,class:"event"},d(c),1))),128)),e.value.length===0?(s(),o("p",k,'点击"检查更新"查看更新流程')):b("",!0)]),t[3]||(t[3]=m(`<div class="code-block" data-v-c1485c9b><h3 data-v-c1485c9b>autoUpdater 事件</h3><pre data-v-c1485c9b>// 主进程
const { autoUpdater } = require(&#39;electron-updater&#39;)

autoUpdater.setFeedURL(&#39;https://update.example.com&#39;)

autoUpdater.on(&#39;checking-for-update&#39;, () =&gt; {
  console.log(&#39;正在检查更新...&#39;)
})

autoUpdater.on(&#39;update-available&#39;, (info) =&gt; {
  console.log(&#39;发现新版本:&#39;, info.version)
})

autoUpdater.on(&#39;download-progress&#39;, (progress) =&gt; {
  console.log(&#39;下载进度:&#39;, progress.percent)
})

autoUpdater.on(&#39;update-downloaded&#39;, () =&gt; {
  // 提示用户重启
  dialog.showMessageBox({
    type: &#39;info&#39;,
    title: &#39;更新就绪&#39;,
    message: &#39;新版本已下载，重启后生效&#39;,
    buttons: [&#39;重启&#39;, &#39;稍后&#39;]
  }).then(result =&gt; {
    if (result.response === 0) {
      autoUpdater.quitAndInstall()
    }
  })
})</pre></div><div class="tips" data-v-c1485c9b><h3 data-v-c1485c9b>更新服务器配置</h3><ul data-v-c1485c9b><li data-v-c1485c9b><strong data-v-c1485c9b>macOS</strong>: 需要代码签名和公证</li><li data-v-c1485c9b><strong data-v-c1485c9b>Windows</strong>: 需要 Authenticode 签名</li><li data-v-c1485c9b><strong data-v-c1485c9b>Linux</strong>: 使用 AppImage 或 deb/rpm</li><li data-v-c1485c9b><strong data-v-c1485c9b>推荐</strong>: 使用 electron-builder 的 electron-updater</li></ul></div>`,2))]))}}),E=h(w,[["__scopeId","data-v-c1485c9b"]]);export{E as default};

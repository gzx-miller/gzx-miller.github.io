import{d as r,b as p,e,I as l,aW as d,v as i,f as u,a0 as c,r as s,o as v,F as b}from"./CfJSWYGO.js";const m={class:"demo-container"},q={class:"platform-selector"},g={class:"config-panel"},x={class:"code-block"},f=r({__name:"E11Packaging",setup(k){const a=s("win"),o=s({appId:"com.example.app",productName:"My Electron App",directories:{output:"dist"}});return(y,t)=>(v(),p("div",m,[t[7]||(t[7]=e("h2",null,"🌰 打包与分发",-1)),t[8]||(t[8]=e("p",{class:"desc"},"使用 electron-builder 打包跨平台应用。",-1)),e("div",q,[e("label",null,[l(e("input",{type:"radio","onUpdate:modelValue":t[0]||(t[0]=n=>a.value=n),value:"mac"},null,512),[[d,a.value]]),t[3]||(t[3]=i(" macOS",-1))]),e("label",null,[l(e("input",{type:"radio","onUpdate:modelValue":t[1]||(t[1]=n=>a.value=n),value:"win"},null,512),[[d,a.value]]),t[4]||(t[4]=i(" Windows",-1))]),e("label",null,[l(e("input",{type:"radio","onUpdate:modelValue":t[2]||(t[2]=n=>a.value=n),value:"linux"},null,512),[[d,a.value]]),t[5]||(t[5]=i(" Linux",-1))])]),e("div",g,[t[6]||(t[6]=e("h3",null,"electron-builder 配置",-1)),e("pre",x,`{
  "appId": "`+u(o.value.appId)+`",
  "productName": "`+u(o.value.productName)+`",
  "directories": {
    "output": "`+u(o.value.directories.output)+`"
  },
  "mac": {
    "category": "public.app-category.productivity",
    "icon": "build/icon.icns",
    "hardenedRuntime": true,
    "gatekeeperAssess": false
  },
  "win": {
    "target": "nsis",
    "icon": "build/icon.ico",
    "publisherName": "Example Inc."
  },
  "linux": {
    "target": ["AppImage", "deb", "rpm"],
    "category": "Utility"
  }
}`,1)]),t[9]||(t[9]=c(`<div class="tips" data-v-bd0ec8a8><h3 data-v-bd0ec8a8>打包要点</h3><ul data-v-bd0ec8a8><li data-v-bd0ec8a8><strong data-v-bd0ec8a8>macOS</strong>: 需要在 macOS 机器上打包，需要开发者证书和公证</li><li data-v-bd0ec8a8><strong data-v-bd0ec8a8>Windows</strong>: 需要代码签名证书（Authenticode），推荐使用 NSIS 安装包</li><li data-v-bd0ec8a8><strong data-v-bd0ec8a8>Linux</strong>: 推荐同时提供 AppImage、deb、rpm 三种格式</li><li data-v-bd0ec8a8><strong data-v-bd0ec8a8>CI/CD</strong>: 使用 GitHub Actions 或 Jenkins 自动化打包流程</li></ul></div><div class="code-block" data-v-bd0ec8a8><h3 data-v-bd0ec8a8>package.json 配置</h3><pre data-v-bd0ec8a8>{
  &quot;scripts&quot;: {
    &quot;pack&quot;: &quot;electron-builder --dir&quot;,
    &quot;dist&quot;: &quot;electron-builder&quot;,
    &quot;dist:mac&quot;: &quot;electron-builder --mac&quot;,
    &quot;dist:win&quot;: &quot;electron-builder --win&quot;,
    &quot;dist:linux&quot;: &quot;electron-builder --linux&quot;
  },
  &quot;build&quot;: {
    &quot;extends&quot;: null,
    // 上面配置...
  }
}</pre></div>`,2))]))}}),w=b(f,[["__scopeId","data-v-bd0ec8a8"]]);export{w as default};

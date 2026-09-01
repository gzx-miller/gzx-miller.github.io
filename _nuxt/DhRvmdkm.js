import{d as r,b as p,e as a,K as l,aW as i,v as u,f as d,a0 as b,r as s,o as c,I as v}from"./DutfXOOr.js";const m={class:"demo-container"},q={class:"platform-selector"},g={class:"config-panel"},x={class:"code-block"},f=r({__name:"E11Packaging",setup(k){const n=s("win"),o=s({appId:"com.example.app",productName:"My Electron App",directories:{output:"dist"}});return(y,t)=>(c(),p("div",m,[t[7]||(t[7]=a("h2",null,"🌰 打包与分发",-1)),t[8]||(t[8]=a("p",{class:"desc"},"使用 electron-builder 打包跨平台应用。",-1)),a("div",q,[a("label",null,[l(a("input",{type:"radio","onUpdate:modelValue":t[0]||(t[0]=e=>n.value=e),value:"mac"},null,512),[[i,n.value]]),t[3]||(t[3]=u(" macOS",-1))]),a("label",null,[l(a("input",{type:"radio","onUpdate:modelValue":t[1]||(t[1]=e=>n.value=e),value:"win"},null,512),[[i,n.value]]),t[4]||(t[4]=u(" Windows",-1))]),a("label",null,[l(a("input",{type:"radio","onUpdate:modelValue":t[2]||(t[2]=e=>n.value=e),value:"linux"},null,512),[[i,n.value]]),t[5]||(t[5]=u(" Linux",-1))])]),a("div",g,[t[6]||(t[6]=a("h3",null,"electron-builder 配置",-1)),a("pre",x,`{
  "appId": "`+d(o.value.appId)+`",
  "productName": "`+d(o.value.productName)+`",
  "directories": {
    "output": "`+d(o.value.directories.output)+`"
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
}`,1)]),t[9]||(t[9]=b(`<div class="tips" data-v-81bb8a96><h3 data-v-81bb8a96>打包要点</h3><ul data-v-81bb8a96><li data-v-81bb8a96><strong data-v-81bb8a96>macOS</strong>: 需要在 macOS 机器上打包，需要开发者证书和公证</li><li data-v-81bb8a96><strong data-v-81bb8a96>Windows</strong>: 需要代码签名证书（Authenticode），推荐使用 NSIS 安装包</li><li data-v-81bb8a96><strong data-v-81bb8a96>Linux</strong>: 推荐同时提供 AppImage、deb、rpm 三种格式</li><li data-v-81bb8a96><strong data-v-81bb8a96>CI/CD</strong>: 使用 GitHub Actions 或 Jenkins 自动化打包流程</li></ul></div><div class="code-block" data-v-81bb8a96><h3 data-v-81bb8a96>package.json 配置</h3><pre data-v-81bb8a96>{
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
}</pre></div>`,2))]))}}),w=v(f,[["__scopeId","data-v-81bb8a96"]]);export{w as default};

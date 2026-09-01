import{d as f,b as e,e as n,F as d,E as i,f as u,A as c,a0 as _,r as m,o as a,M as C,v as g,I as k}from"./DutfXOOr.js";const M={class:"demo-container"},h={class:"menu-demo"},y={class:"menu-bar"},N={class:"menu-label"},I={class:"submenu"},x=["onClick"],O={key:0,class:"result"},S=f({__name:"E06NativeMenu",setup(E){const v=m([{label:"文件",submenu:["新建","打开","保存","---","退出"]},{label:"编辑",submenu:["撤销","重做","---","复制","粘贴"]},{label:"视图",submenu:["刷新","全屏","开发者工具"]},{label:"帮助",submenu:["关于"]}]),l=m("");function p(o){o!=="---"&&(l.value=o)}return(o,t)=>(a(),e("div",M,[t[0]||(t[0]=n("h2",null,"🌰 原生菜单",-1)),t[1]||(t[1]=n("p",{class:"desc"},"使用 Menu 和 MenuItem 构建跨平台原生菜单，掌握 role 系统和快捷键。",-1)),n("div",h,[n("div",y,[(a(!0),e(d,null,i(v.value,r=>(a(),e("div",{key:r.label,class:"menu-item"},[n("span",N,u(r.label),1),n("div",I,[(a(!0),e(d,null,i(r.submenu,(s,b)=>(a(),e("div",{key:b,class:C(["submenu-item",{separator:s==="---"}]),onClick:V=>p(s)},[s!=="---"?(a(),e(d,{key:0},[g(u(s),1)],64)):c("",!0)],10,x))),128))])]))),128))])]),l.value?(a(),e("div",O," 点击了: "+u(l.value),1)):c("",!0),t[2]||(t[2]=_(`<div class="code-block" data-v-f6d287a9><h3 data-v-f6d287a9>Menu 代码示例</h3><pre data-v-f6d287a9>const menu = Menu.buildFromTemplate([
  {
    label: &#39;文件&#39;,
    submenu: [
      { label: &#39;新建&#39;, accelerator: &#39;CmdOrCtrl+N&#39;, role: &#39;newWindow&#39; },
      { label: &#39;保存&#39;, accelerator: &#39;CmdOrCtrl+S&#39;, click: () =&gt; save() },
      { type: &#39;separator&#39; },
      { label: &#39;退出&#39;, accelerator: &#39;CmdOrCtrl+Q&#39;, role: &#39;quit&#39; }
    ]
  },
  {
    label: &#39;编辑&#39;,
    submenu: [
      { role: &#39;undo&#39; },  // 自动本地化为&quot;撤销&quot;
      { role: &#39;redo&#39; },
      { type: &#39;separator&#39; },
      { role: &#39;copy&#39; },
      { role: &#39;paste&#39; }
    ]
  }
])
Menu.setApplicationMenu(menu)</pre></div><div class="tips" data-v-f6d287a9><h3 data-v-f6d287a9>关键要点</h3><ul data-v-f6d287a9><li data-v-f6d287a9><strong data-v-f6d287a9>role</strong> 属性会自动本地化并绑定标准行为，优先使用</li><li data-v-f6d287a9><strong data-v-f6d287a9>accelerator</strong> 使用跨平台格式：CmdOrCtrl、Alt、Shift、Plus</li><li data-v-f6d287a9><strong data-v-f6d287a9>macOS</strong> 菜单栏与应用绑定，Windows/Linux 与窗口绑定</li><li data-v-f6d287a9><strong data-v-f6d287a9>上下文菜单</strong> 使用 Menu.popup() 在右键时显示</li></ul></div>`,2))]))}}),w=k(S,[["__scopeId","data-v-f6d287a9"]]);export{w as default};

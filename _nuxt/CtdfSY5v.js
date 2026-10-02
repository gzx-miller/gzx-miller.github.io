import{d as _,b as e,e as n,K as u,L as i,f as d,A as c,a0 as C,r as m,o as t,M as g,v as f,F as k}from"./CfJSWYGO.js";const M={class:"demo-container"},h={class:"menu-demo"},y={class:"menu-bar"},N={class:"menu-label"},x={class:"submenu"},I=["onClick"],O={key:0,class:"result"},S=_({__name:"E06NativeMenu",setup(V){const v=m([{label:"文件",submenu:["新建","打开","保存","---","退出"]},{label:"编辑",submenu:["撤销","重做","---","复制","粘贴"]},{label:"视图",submenu:["刷新","全屏","开发者工具"]},{label:"帮助",submenu:["关于"]}]),l=m("");function p(o){o!=="---"&&(l.value=o)}return(o,a)=>(t(),e("div",M,[a[0]||(a[0]=n("h2",null,"🌰 原生菜单",-1)),a[1]||(a[1]=n("p",{class:"desc"},"使用 Menu 和 MenuItem 构建跨平台原生菜单，掌握 role 系统和快捷键。",-1)),n("div",h,[n("div",y,[(t(!0),e(u,null,i(v.value,r=>(t(),e("div",{key:r.label,class:"menu-item"},[n("span",N,d(r.label),1),n("div",x,[(t(!0),e(u,null,i(r.submenu,(s,b)=>(t(),e("div",{key:b,class:g(["submenu-item",{separator:s==="---"}]),onClick:q=>p(s)},[s!=="---"?(t(),e(u,{key:0},[f(d(s),1)],64)):c("",!0)],10,I))),128))])]))),128))])]),l.value?(t(),e("div",O," 点击了: "+d(l.value),1)):c("",!0),a[2]||(a[2]=C(`<div class="code-block" data-v-09093e22><h3 data-v-09093e22>Menu 代码示例</h3><pre data-v-09093e22>const menu = Menu.buildFromTemplate([
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
Menu.setApplicationMenu(menu)</pre></div><div class="tips" data-v-09093e22><h3 data-v-09093e22>关键要点</h3><ul data-v-09093e22><li data-v-09093e22><strong data-v-09093e22>role</strong> 属性会自动本地化并绑定标准行为，优先使用</li><li data-v-09093e22><strong data-v-09093e22>accelerator</strong> 使用跨平台格式：CmdOrCtrl、Alt、Shift、Plus</li><li data-v-09093e22><strong data-v-09093e22>macOS</strong> 菜单栏与应用绑定，Windows/Linux 与窗口绑定</li><li data-v-09093e22><strong data-v-09093e22>上下文菜单</strong> 使用 Menu.popup() 在右键时显示</li></ul></div>`,2))]))}}),A=k(S,[["__scopeId","data-v-09093e22"]]);export{A as default};

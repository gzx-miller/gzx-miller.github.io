import{d as a,b as o,e,v as t,F as c,E as p,o as i,f as u,I as r}from"./DutfXOOr.js";const d={class:"v03"},m={class:"list"},v=a({__name:"V03Plugins",setup(g){const l=[{name:"@vitejs/plugin-vue",desc:"Vue 3 支持（SFC 编译、HMR）"},{name:"@vitejs/plugin-vue-jsx",desc:"Vue JSX / TSX 支持"},{name:"@vitejs/plugin-react",desc:"React 支持（自动 JSX 转换、Fast Refresh）"},{name:"unplugin-vue-components",desc:"Vue 组件自动按需引入"},{name:"unplugin-auto-import",desc:"API 自动按需引入（ref、computed 等）"},{name:"vite-plugin-pwa",desc:"PWA 支持（离线缓存、Service Worker）"}];return(f,n)=>(i(),o("div",d,[n[0]||(n[0]=e("p",{class:"intro"},[t("Vite 插件兼容 Rollup 插件接口，在 "),e("code",null,"vite.config.ts"),t(" 的 "),e("code",null,"plugins"),t(" 数组中注册。")],-1)),e("ul",m,[(i(),o(c,null,p(l,s=>e("li",{key:s.name},[e("code",null,u(s.name),1),e("span",null,u(s.desc),1)])),64))]),n[1]||(n[1]=e("pre",{class:"code-block"},[e("code",null,`// vite.config.ts
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({ /* 配置 */ }),
  ],
})`)],-1))]))}}),V=r(v,[["__scopeId","data-v-1984cf5f"]]);export{V as default};

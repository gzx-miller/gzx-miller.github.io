import{d as i,b as l,e as s,F as n,E as d,f as r,r as p,o as c,M as u,I as f}from"./DutfXOOr.js";const m={class:"v12"},_={class:"tabs"},v=["onClick"],S={class:"code-block"},y=i({__name:"V12CSS",setup(C){const t=p("postcss"),o={postcss:`// vite.config.ts
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
})

// 或使用 postcss.config.js
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,preprocessor:`// Vite 内置支持 Sass、Less、Stylus
// 安装对应预处理器即可
// npm install -D sass

// 在 Vue SFC 中使用
<style lang="scss">
$primary: #1890ff;
.btn { color: $primary; }
</style>

// 全局注入（vite.config.ts）
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: \`@use "@/styles/variables" as *;\`,
      },
    },
  },
})`,modules:`// CSS Modules（Vue SFC 默认启用）
<style module>
.red { color: red; }
</style>

<template>
  <div :class="$style.red">红色文字</div>
</template>

// 自定义模块名
<style module="classes">
.red { color: red; }
</style>
<template>
  <div :class="classes.red">红色文字</div>
</template>`};return(g,a)=>(c(),l("div",m,[a[0]||(a[0]=s("p",{class:"intro"},"Vite 内置支持 PostCSS、Sass/Less/Stylus 预处理器和 CSS Modules。",-1)),s("div",_,[(c(),l(n,null,d(o,(x,e)=>s("button",{key:e,class:u({active:t.value===e}),onClick:b=>t.value=e},r(e),11,v)),64))]),s("pre",S,[s("code",null,r(o[t.value]),1)])]))}}),F=f(y,[["__scopeId","data-v-6539c30f"]]);export{F as default};

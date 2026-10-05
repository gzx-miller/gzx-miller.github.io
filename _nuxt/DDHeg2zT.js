const n=`// vite.config.ts - CSS 相关配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  css: {
    // PostCSS 配置（也可以用 postcss.config.js）
    postcss: {
      plugins: [
        // 自动添加浏览器前缀
        require('autoprefixer'),
        // CSS 嵌套
        require('postcss-nested'),
        // 自定义插件
        require('tailwindcss')
      ]
    },
    
    // CSS Modules 配置
    modules: {
      // 生成的类名格式
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      // 是否使用 camelCase
      localsConvention: 'camelCase'
    },
    
    // 预处理器配置
    preprocessorOptions: {
      scss: {
        // 全局注入的变量和 mixin
        additionalData: \`
          @import "@/styles/variables.scss";
          @import "@/styles/mixins.scss";
        \`,
        // 其他 sass 选项
        api: 'modern-compiler'
      },
      less: {
        // Less 全局变量
        modifyVars: {
          'primary-color': '#1890ff'
        },
        javascriptEnabled: true
      }
    }
  }
})

// ====================
// PostCSS 配置文件 (postcss.config.js)
// ====================

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}

// ====================
// CSS Modules 使用示例
// ====================

// src/styles/Button.module.css
// .button {
//   padding: 8px 16px;
//   border-radius: 4px;
// }
// 
// .primary {
//   background-color: #1890ff;
//   color: white;
// }

// 在组件中使用
import styles from './Button.module.css'

export default {
  template: \`
    <button :class="[styles.button, styles.primary]">
      点击我
    </button>
  \`
}

// 生成的类名: Button__button___abc123 Button__primary___def456

// ====================
// Vue SFC 中的 CSS Modules
// ====================

// <style module>
// .red {
//   color: red;
// }
// </style>
// 
// <template>
//   <p :class="$style.red">这是红色文字</p>
// </template>

// ====================
// CSS 预处理器使用示例
// ====================

// 安装: npm install -D sass
// 然后在 Vue SFC 中直接使用:
// <style lang="scss">
// $primary-color: #1890ff;
// 
// .button {
//   background: $primary-color;
//   
//   &:hover {
//     opacity: 0.8;
//   }
// }
// </style>`;export{n as default};

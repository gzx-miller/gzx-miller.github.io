const n=`<script setup lang="ts">
import { ref } from 'vue'

const activeStep = ref(0)

const steps = [
  { title: 'createApp', desc: '创建独立的应用实例，隔离全局配置', code: "import { createApp } from 'vue'\\nimport App from './App.vue'\\n\\nconst app = createApp(App)" },
  { title: '注册插件', desc: 'Router、Pinia 等跨页面能力在此接入', code: "import router from './router'\\nimport { createPinia } from 'pinia'\\n\\napp.use(router)\\napp.use(createPinia())" },
  { title: '挂载', desc: '把 Vue 接管到 #app 挂载点', code: "app.mount('#app')" },
]

function next() {
  activeStep.value = (activeStep.value + 1) % steps.length
}

const sfcStructure = \`<span style="color:#8a8a3a">&lt;!-- App.vue 单文件组件 --&gt;</span>
&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
const count = ref(0)
&lt;/script&gt;

&lt;template&gt;
  &lt;button @click="count++"&gt;{{ count }}&lt;/button&gt;
&lt;/template&gt;

&lt;style scoped&gt;
button { color: #e85d04; }
&lt;/style&gt;\`

const fullEntry = \`<span style="color:#8a8a3a">// main.ts — 完整入口</span>
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

<span style="color:#7c7c99">// 注册插件（顺序：先依赖，后业务）</span>
app.use(createPinia())
app.use(router)

<span style="color:#7c7c99">// 全局错误处理</span>
app.config.errorHandler = (err) => {
  console.error('Vue 错误：', err)
}

<span style="color:#7c7c99">// 挂载到 DOM</span>
app.mount('#app')\`
<\/script>

<template>
  <div class="demo-card">
    <h3>应用创建、入口挂载、SFC 结构</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>启动三步曲（点击下一步）</h4>
        <div class="step-card" v-for="(s, i) in steps" :key="i"
          :class="{ active: activeStep === i }"
          @click="activeStep = i">
          <span class="step-num">{{ i + 1 }}</span>
          <strong>{{ s.title }}</strong>
          <p><small>{{ s.desc }}</small></p>
        </div>
        <button class="btn" @click="next">下一步 →</button>
      </div>

      <div style="flex:1;">
        <h4>当前步骤代码</h4>
        <pre class="mini-code">{{ steps[activeStep].code }}</pre>
      </div>
    </div>

    <h4>完整入口文件</h4>
    <pre class="mini-code" v-html="fullEntry"></pre>

    <h4>单文件组件 (SFC) 结构</h4>
    <pre class="mini-code" v-html="sfcStructure"></pre>

    <div class="tips-box">
      <p><strong>要点：</strong></p>
      <ul>
        <li><code>createApp</code> 创建独立实例，多个应用互不干扰</li>
        <li><code>app.use()</code> 注册插件，必须在 <code>mount</code> 之前</li>
        <li>入口只放装配逻辑，不放业务流程</li>
        <li>SFC 把 template/script/style 放同一文件，是 Vue 的最小组件单元</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.step-card { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid transparent; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; }
.step-card.active { border-left-color: #e85d04; background: #fff3e0; }
.step-num { display: inline-block; width: 22px; height: 22px; line-height: 22px; text-align: center; background: #e85d04; color: #fff; border-radius: 50%; font-size: 12px; margin-right: 8px; }
.btn { background: #e85d04; color: #fff; border: none; padding: 6px 16px; border-radius: 4px; cursor: pointer; font-size: 13px; margin-top: 4px; }
.tips-box { background: #f0f7ff; padding: 10px; border-radius: 6px; border-left: 3px solid #0891b2; margin-top: 8px; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
small { color: #8a6d42; }
ul { padding-left: 18px; font-size: 12px; }
</style>
`;export{n as default};

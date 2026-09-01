const e=`<script setup lang="ts">
import { ref, computed } from 'vue'

// 用模板字面量类型约束事件名
type BaseEvent = 'click' | 'focus' | 'submit' | 'change'
type OnEvent = \`on\${Capitalize<BaseEvent>}\`  // 'onClick' | 'onFocus' | 'onSubmit' | 'onChange'

// CSS 类名构建器
type Prefix = 'btn' | 'card' | 'nav'
type State = 'hover' | 'active' | 'disabled'
type CssClass = \`\${Prefix}-\${State}\`  // 'btn-hover' | 'btn-active' | ... | 'nav-disabled'

const eventName = ref<OnEvent>('onClick')
const cssClass = ref<CssClass>('btn-hover')
const events: OnEvent[] = ['onClick', 'onFocus', 'onSubmit', 'onChange']
const classes: CssClass[] = ['btn-hover', 'card-active', 'nav-disabled']

const eventValid = computed(() => events.includes(eventName.value as OnEvent))
<\/script>

<template>
  <div class="demo-card">
    <h4>事件名与 CSS 类名构建器</h4>
    <label>
      选择事件：
      <select v-model="eventName">
        <option v-for="e in events" :key="e" :value="e">{{ e }}</option>
      </select>
    </label>
    <label>
      选择样式类：
      <select v-model="cssClass">
        <option v-for="c in classes" :key="c" :value="c">{{ c }}</option>
      </select>
    </label>
    <p>当前事件：{{ eventName }} · 样式：{{ cssClass }}</p>
    <small>模板字面量类型 \`\${A}\${B}\` 在类型层面拼接字符串，配合 Capitalize 等内置工具约束命名规范</small>
  </div>
</template>
`;export{e as default};

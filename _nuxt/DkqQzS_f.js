const n=`<script setup lang="ts">
import { ref } from 'vue'
const active = ref('cascade')
<\/script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">层叠与继承</h3>
    <p class="demo-desc">理解 CSS 层叠优先级（!important → 内联 → #id → .class → 元素）与属性继承规则。</p>

    <div class="controls">
      <button :class="['btn', { active: active === 'cascade' }]" @click="active='cascade'">层叠优先级</button>
      <button :class="['btn', { active: active === 'important' }]" @click="active='important'">!important</button>
      <button :class="['btn', { active: active === 'inherit' }]" @click="active='inherit'">继承</button>
      <button :class="['btn', { active: active === 'initial' }]" @click="active='initial'">initial / unset</button>
    </div>

    <div v-if="active === 'cascade'" class="cascade-demo">
      <div class="spec-box" id="spec-demo">
        <span class="spec-text">文本颜色由谁决定？</span>
      </div>
      <div class="spec-rules">
        <div class="rule">元素选择器 <code>span { color: blue }</code> → 优先级 0-0-0-1</div>
        <div class="rule">类选择器 <code>.spec-text { color: green }</code> → 优先级 0-0-1-0</div>
        <div class="rule">ID 选择器 <code>#spec-demo .spec-text { color: red }</code> → 优先级 0-1-1-0</div>
        <div class="rule winner">✅ 最终生效：红色（优先级最高）</div>
      </div>
    </div>

    <div v-if="active === 'important'" class="important-demo">
      <div class="box-a">A：color: blue</div>
      <div class="box-b">B：color: red !important</div>
      <div class="note">!important 会覆盖普通声明，但应尽量避免使用。</div>
    </div>

    <div v-if="active === 'inherit'" class="inherit-demo">
      <div class="parent-inherit" style="color: #e8590c; font-size: 18px;">
        父元素（color 可继承）
        <div class="child-inherit">子元素（自动继承 color）</div>
        <div class="child-no-inherit" style="color: initial;">子元素（显式重置）</div>
      </div>
      <div class="inherit-table">
        <div class="it-row header"><span>属性</span><span>是否继承</span></div>
        <div class="it-row"><span>color, font-*</span><span>✅ 继承</span></div>
        <div class="it-row"><span>margin, padding, border</span><span>❌ 不继承</span></div>
        <div class="it-row"><span>inherit</span><span>强制继承</span></div>
        <div class="it-row"><span>initial</span><span>重置为初始值</span></div>
      </div>
    </div>

    <div v-if="active === 'initial'" class="initial-demo">
      <div class="demo-row"><span class="label">正常链接</span><a href="#none">链接</a></div>
      <div class="demo-row"><span class="label">color: unset</span><a href="#none" class="unset-link">链接</a></div>
      <div class="note">unset = 可继承则 inherit，不可继承则 initial。</div>
    </div>
  </div>
</template>

<style scoped>
.demo-container { font-family: system-ui, sans-serif; --primary: #e8590c; --primary-light: #fff4e6; --border: #ffd8a8; }
.demo-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
.demo-desc { font-size: 13px; color: #868e96; margin-bottom: 16px; }
.controls { display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }
.btn { padding: 6px 12px; border: 1px solid var(--border); border-radius: 6px; background: #fff; cursor: pointer; font-size: 12px; }
.btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }

.cascade-demo { margin-bottom: 16px; }
.spec-box { padding: 12px; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 12px; }
.spec-text { font-weight: 600; }
.spec-rules { font-size: 12px; line-height: 1.8; }
.rule { padding: 2px 0; }
.rule code { background: var(--primary-light); padding: 1px 4px; border-radius: 3px; font-size: 11px; }
.winner { color: var(--primary); font-weight: 700; margin-top: 4px; }

.box-a { color: blue; padding: 8px; border: 1px solid #acc; border-radius: 6px; margin-bottom: 4px; }
.box-b { color: red !important; padding: 8px; border: 1px solid #acc; border-radius: 6px; }
.note { font-size: 12px; color: #868e96; margin-top: 8px; padding: 6px 10px; background: var(--primary-light); border-radius: 6px; }

.parent-inherit { padding: 12px; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 12px; }
.child-inherit { padding: 4px 0; font-weight: 600; }
.child-no-inherit { padding: 4px 0; }

.inherit-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 12px; margin-top: 12px; }
.it-row { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid var(--border); }
.it-row:last-child { border-bottom: none; }
.it-row > span { padding: 5px 10px; }
.it-row.header { background: var(--primary); color: #fff; font-weight: 600; }

.demo-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 13px; }
.unset-link { color: unset; }
</style>
`;export{n as default};

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'placeholder' | 'extend' | 'compare'>('placeholder')
const buttonType = ref<'primary' | 'secondary' | 'danger' | 'success'>('primary')

const buttonStyles = {
  primary: { bg: '#e85d04', border: '#e85d04', hover: '#c45125', text: '#fff' },
  secondary: { bg: '#fff', border: '#e0a06a', hover: '#fff3df', text: '#8b4513' },
  danger: { bg: '#dc2626', border: '#dc2626', hover: '#b91c1c', text: '#fff' },
  success: { bg: '#16a34a', border: '#16a34a', hover: '#15803d', text: '#fff' }
}

const currentStyle = buttonStyles[buttonType.value as keyof typeof buttonStyles]

const placeholderCode = `<span style="color:#7c7c99">// 定义占位符选择器 — 以 % 开头</span>
%button-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

%card-base {
  padding: 16px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

<span style="color:#7c7c99">// 占位符本身不产生 CSS 输出</span>
<span style="color:#8a8a3a">// 只有被 @extend 引用时才会生成样式</span>`

const extendCode = `<span style="color:#7c7c99">// 使用 @extend 继承占位符</span>
.btn-primary {
  @extend %button-base;
  background: #e85d04;
  color: #fff;
  
  &:hover { background: #c45125; }
}

.btn-secondary {
  @extend %button-base;
  background: #fff;
  color: #8b4513;
  border-color: #e0a06a;
  
  &:hover { background: #fff3df; }
}

.btn-danger {
  @extend %button-base;
  background: #dc2626;
  color: #fff;
}

<span style="color:#7c7c99">// 编译后的 CSS — 合并选择器</span>
.btn-primary, .btn-secondary, .btn-danger {
  display: inline-flex;
  align-items: center;
  ...
}
.btn-primary { background: #e85d04; ... }
.btn-secondary { background: #fff; ... }`

const compareCode = `<span style="color:#7c7c99">// Mixin 方式 — 每次 include 都复制</span>
@mixin button-base {
  display: inline-flex; padding: 8px 20px; ...
}
.btn-a { @include button-base; }
.btn-b { @include button-base; }

<span style="color:#7c7c99">// 编译结果：重复代码</span>
.btn-a { display: inline-flex; padding: 8px 20px; ... }
.btn-b { display: inline-flex; padding: 8px 20px; ... }

---

<span style="color:#7c7c99">// Placeholder 方式 — 选择器合并</span>
%button-base { display: inline-flex; padding: 8px 20px; ... }
.btn-a { @extend %button-base; }
.btn-b { @extend %button-base; }

<span style="color:#7c7c99">// 编译结果：共享代码</span>
.btn-a, .btn-b { display: inline-flex; padding: 8px 20px; ... }

---

<span style="color:#7c7c99">// 选择场景</span>
• 需要传参 → Mixin
• 纯静态复用 → Placeholder
• 交叉组合多 → Mixin
• 选择器越少越好 → Placeholder`
</script>

<template>
  <div class="demo-card sass-demo">
    <h3>占位符选择器与 @extend 进阶</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'placeholder' }" @click="activeTab = 'placeholder'">占位符定义</button>
      <button class="tab-btn" :class="{ active: activeTab === 'extend' }" @click="activeTab = 'extend'">@extend 使用</button>
      <button class="tab-btn" :class="{ active: activeTab === 'compare' }" @click="activeTab = 'compare'">Mixin vs 占位符</button>
    </div>

    <div v-if="activeTab === 'placeholder'">
      <h4>代码示例</h4>
      <pre class="mini-code" v-html="placeholderCode"></pre>
      <div class="tips-box">
        <p><strong>占位符特点：</strong></p>
        <ul>
          <li>以 <code>%</code> 开头命名，如 <code>%button-base</code></li>
          <li>定义本身不产生任何 CSS 输出</li>
          <li>只有被 <code>@extend</code> 引用时才会生成样式</li>
          <li>用于封装纯静态、可复用的样式块</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'extend'">
      <h4>实时预览：按钮变体</h4>
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
        <button v-for="(style, key) in buttonStyles" :key="key"
          class="demo-btn"
          :style="{
            background: buttonType === key ? style.bg : style.text ? style.bg : 'transparent',
            borderColor: style.border,
            color: buttonType === key ? '#fff' : (style.text || style.border)
          }"
          @click="buttonType = key as any">
          {{ key === 'primary' ? '主按钮' : key === 'secondary' ? '次按钮' : key === 'danger' ? '危险按钮' : '成功按钮' }}
        </button>
      </div>
      <div class="preview-box">
        <p>当前选中：<strong>{{ buttonType === 'primary' ? '主按钮' : buttonType === 'secondary' ? '次按钮' : buttonType === 'danger' ? '危险按钮' : '成功按钮' }}</strong></p>
        <p class="hint">所有按钮共享 <code>%button-base</code> 基础样式，通过 @extend 继承</p>
      </div>
      <pre class="mini-code" v-html="extendCode" style="margin-top:12px;"></pre>
    </div>

    <div v-if="activeTab === 'compare'">
      <h4>对比分析</h4>
      <pre class="mini-code" v-html="compareCode"></pre>
      <div class="tips-box">
        <p><strong>何时使用 @extend / Placeholder：</strong></p>
        <ul>
          <li>样式完全相同、不需要参数 → 占位符更高效</li>
          <li>需要减少最终 CSS 文件体积 → 占位符合并选择器</li>
          <li>需要动态传参、条件逻辑 → 使用 Mixin</li>
          <li>注意：@extend 会改变选择器顺序，小心级联问题</li>
        </ul>
      </div>
    </div>

    <div class="tips-box" style="margin-top:12px;">
      <p><strong>进阶提示：</strong><code>@extend</code> 可以继承普通类、ID 选择器，但推荐只用占位符（%），语义更清晰。避免在嵌套选择器中使用 @extend，可能产生意想不到的复杂选择器组合。</p>
    </div>
  </div>
</template>

<style scoped>
.sass-demo label { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; }
.demo-btn { padding: 8px 20px; border: 2px solid; border-radius: 6px; cursor: pointer; font-size: 13px; transition: all 0.2s; }
.demo-btn:hover { opacity: 0.85; transform: translateY(-1px); }
.preview-box { padding: 16px; background: #fffaf1; border-radius: 8px; border-left: 4px solid #e85d04; }
.preview-box p { margin: 4px 0; font-size: 13px; }
.preview-box .hint { color: #805f4d; font-size: 12px; }
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #fff5e6; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
ul { padding-left: 18px; font-size: 12px; margin: 6px 0; }
h4 { margin: 12px 0 8px 0; font-size: 14px; color: #8b4513; }
</style>

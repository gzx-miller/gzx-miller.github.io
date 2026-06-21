<script setup lang="ts">
import { computed, ref } from 'vue'

const activeTab = ref<'vars' | 'nest' | 'mixin'>('vars')

const accent = ref('#c45125')
const radius = ref(12)

const varCode = `<span style="color:#7c7c99">// _variables.scss — 编译期变量</span>
$accent: #c45125;
$radius: 12px;
$spacing: 16px;

<span style="color:#7c7c99">// 使用</span>
.course {
  color: $accent;
  border-radius: $radius;
  padding: $spacing;
}

<span style="color:#7c7c99">// Sass 变量 vs CSS 变量</span>
$accent: #c45125;           <span style="color:#8a8a3a">// 编译期，不可运行时改</span>
:root { --accent: #c45125; } <span style="color:#8a8a3a">// 运行时，可 JS 动态改</span>`

const nestCode = `<span style="color:#7c7c99">// ✅ 浅层嵌套（推荐）</span>
.course {
  border-radius: $radius;
  
  &__title { font-size: 1.25rem; }
  &__desc  { color: #805f4d; }
  
  &:hover { box-shadow: 0 8px 24px rgba(0,0,0,.1); }
}

<span style="color:#7c7c99">// ❌ 过深嵌套（不推荐）</span>
.page {
  .main {
    .list {
      .item {
        .title { color: red; }  <span style="color:#e85d04">// 5 层！特异性爆炸</span>
      }
    }
  }
}`

const mixinCode = `<span style="color:#7c7c99">// 定义 Mixin — 可复用的样式块</span>
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin card($radius: 8px, $shadow: true) {
  border-radius: $radius;
  background: #fff;
  @if $shadow {
    box-shadow: 0 4px 12px rgba(0,0,0,.08);
  }
}

<span style="color:#7c7c99">// 使用</span>
.modal { @include flex-center; }
.product { @include card(12px); }
.banner { @include card(16px, false); }

<span style="color:#7c7c99">// 函数 — 返回单个值</span>
@function spacing($n) { @return $n * 8px; }
.list { gap: spacing(2); }  <span style="color:#8a8a3a">// 16px</span>`

const cardStyle = computed(() => ({
  '--accent': accent.value,
  '--radius': `${radius.value}px`,
}))
</script>

<template>
  <div class="demo-card sass-demo">
    <h3>Sass 变量、嵌套与 Mixin</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'vars' }" @click="activeTab = 'vars'">变量</button>
      <button class="tab-btn" :class="{ active: activeTab === 'nest' }" @click="activeTab = 'nest'">嵌套</button>
      <button class="tab-btn" :class="{ active: activeTab === 'mixin' }" @click="activeTab = 'mixin'">Mixin/函数</button>
    </div>

    <div style="display:flex;gap:16px;">
      <div style="flex:1;">
        <div v-if="activeTab === 'vars'">
          <h4>实时预览</h4>
          <label>主题色 <input v-model="accent" type="color" /></label>
          <label>圆角 <input v-model.number="radius" type="range" min="0" max="24" /></label>
          <article class="course" :style="cardStyle">
            <strong>Sass 基础</strong>
            <p>变量集中表达复用值，修改一处全局生效。</p>
            <button>加入课程</button>
          </article>
          <pre class="mini-code" v-html="varCode" style="margin-top:10px;"></pre>
        </div>

        <div v-if="activeTab === 'nest'">
          <pre class="mini-code" v-html="nestCode"></pre>
          <div class="tips-box">
            <p><strong>嵌套规则：</strong></p>
            <ul>
              <li><code>&</code> 表示父选择器，常用于 BEM 命名</li>
              <li>嵌套不超过 3 层，否则特异性和耦合过高</li>
              <li>伪类、伪元素和修饰符用 <code>&:hover</code> <code>&__title</code></li>
            </ul>
          </div>
        </div>

        <div v-if="activeTab === 'mixin'">
          <pre class="mini-code" v-html="mixinCode"></pre>
          <div class="tips-box">
            <p><strong>Mixin vs 函数 vs 占位符：</strong></p>
            <ul>
              <li><strong>@mixin</strong>：复用样式块，可传参（<code>@include</code>）</li>
              <li><strong>@function</strong>：返回单个值（计算逻辑）</li>
              <li><strong>%placeholder</strong>：类似 mixin 但用 <code>@extend</code>，不产生重复 CSS</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="tips-box" style="margin-top:10px;">
      <p><strong>关键区别：</strong>Sass 变量在<strong>编译期</strong>固定（改了需重新构建）；CSS 变量在<strong>运行时</strong>可改（JS 可动态设置，适合主题切换）。</p>
    </div>
  </div>
</template>

<style scoped>
.sass-demo label { display: inline-flex; align-items: center; gap: 6px; margin-right: 16px; font-size: 13px; }
.sass-demo input[type="color"] { width: 40px; height: 28px; border: none; border-radius: 4px; cursor: pointer; }
.sass-demo input[type="range"] { width: 100px; }
.course { margin: 10px 0; padding: 16px; border-left: 4px solid var(--accent); border-radius: var(--radius); background: linear-gradient(135deg, #fffaf1, #fff3df); }
.course p { color: #805f4d; margin: 4px 0; }
.course button { color: var(--accent); border: 1px solid var(--accent); background: transparent; padding: 4px 12px; border-radius: 6px; cursor: pointer; }
.course button:hover { background: var(--accent); color: #fff; }
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #f0f7ff; padding: 10px; border-radius: 6px; border-left: 3px solid #0891b2; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
ul { padding-left: 18px; font-size: 12px; }
</style>

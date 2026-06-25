<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'basic' | 'media' | 'advanced'>('basic')
const cardVariant = ref<'default' | 'highlight' | 'compact'>('default')

const basicCode = `<span style="color:#7c7c99">// @content 基本用法 — 向 Mixin 注入内容块</span>
@mixin card {
  padding: 16px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
  
  @content; <span style="color:#8a8a3a">// 内容块插入位置</span>
}

<span style="color:#7c7c99">// 使用 — 在 @include 的 {} 中写额外样式</span>
.product-card {
  @include card {
    border: 2px solid #e85d04;
    .price { color: #e85d04; font-size: 20px; }
  }
}

.user-card {
  @include card {
    display: flex;
    gap: 12px;
    .avatar { width: 48px; height: 48px; border-radius: 50%; }
  }
}

<span style="color:#7c7c99">// 编译结果</span>
.product-card {
  padding: 16px; border-radius: 12px; background: #fff; ...
  border: 2px solid #e85d04;
}
.product-card .price { color: #e85d04; font-size: 20px; }

.user-card {
  padding: 16px; border-radius: 12px; background: #fff; ...
  display: flex; gap: 12px;
}`

const mediaCode = `<span style="color:#7c7c99">// 经典应用：媒体查询 Mixin</span>
@mixin respond-to($breakpoint) {
  @if $breakpoint == mobile {
    @media (max-width: 480px) { @content; }
  } @else if $breakpoint == tablet {
    @media (max-width: 768px) { @content; }
  } @else if $breakpoint == desktop {
    @media (min-width: 1024px) { @content; }
  }
}

<span style="color:#7c7c99">// 使用</span>
.sidebar {
  width: 300px;
  
  @include respond-to(tablet) {
    width: 100%;
    position: fixed;
    bottom: 0;
  }
  
  @include respond-to(mobile) {
    display: none;
  }
}

<span style="color:#7c7c99">// 编译结果</span>
.sidebar { width: 300px; }

@media (max-width: 768px) {
  .sidebar { width: 100%; position: fixed; bottom: 0; }
}

@media (max-width: 480px) {
  .sidebar { display: none; }
}`

const advancedCode = `<span style="color:#7c7c99">// 高级用法：内容块 + 参数传递（Sass 3.5+）</span>
@mixin theme($mode) {
  @if $mode == dark {
    background: #1a1a2e;
    color: #e0e0e0;
    @content (dark);
  } @else {
    background: #fff;
    color: #333;
    @content (light);
  }
}

<span style="color:#7c7c99">// 使用时接收参数</span>
.card {
  @include theme(dark) using ($mode) {
    border-color: if($mode == dark, #333, #ddd);
    .title { color: if($mode == dark, #f4a261, #e85d04); }
  }
}

<span style="color:#7c7c99">// 另一个例子：hover wrapper</span>
@mixin hover-effect {
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,.15);
    @content;
  }
}

.btn {
  @include hover-effect {
    background: darken(#e85d04, 10%);
  }
}`
</script>

<template>
  <div class="demo-card sass-demo">
    <h3>@content 与 Mixin 内容块</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">基础用法</button>
      <button class="tab-btn" :class="{ active: activeTab === 'media' }" @click="activeTab = 'media'">媒体查询</button>
      <button class="tab-btn" :class="{ active: activeTab === 'advanced' }" @click="activeTab = 'advanced'">高级用法</button>
    </div>

    <div style="display:flex;gap:16px;align-items:flex-start;">
      <div style="flex:1;">
        <div v-if="activeTab === 'basic'">
          <h4>实时预览：卡片变体</h4>
          <div style="display:flex;gap:8px;margin-bottom:12px;">
            <button v-for="v in ['default', 'highlight', 'compact']" :key="v" class="var-btn"
              :class="{ active: cardVariant === v }"
              @click="cardVariant = v as any">
              {{ v === 'default' ? '默认卡片' : v === 'highlight' ? '高亮卡片' : '紧凑卡片' }}
            </button>
          </div>
          <div class="demo-card-preview" :class="cardVariant">
            <div class="card-title">秋日森林小屋</div>
            <div class="card-desc">探索秋日森林的宁静与温暖，感受自然的馈赠。</div>
            <div class="card-price" v-if="cardVariant === 'highlight'">¥299/晚</div>
          </div>
          <pre class="mini-code" v-html="basicCode" style="margin-top:12px;"></pre>
        </div>

        <div v-if="activeTab === 'media'">
          <h4>媒体查询 Mixin</h4>
          <div class="responsive-demo">
            <div class="sidebar-preview">
              <span>侧边栏</span>
              <small>拖动窗口查看响应式效果</small>
            </div>
            <div class="main-preview">
              <span>主内容区</span>
            </div>
          </div>
          <pre class="mini-code" v-html="mediaCode" style="margin-top:12px;"></pre>
        </div>

        <div v-if="activeTab === 'advanced'">
          <h4>高级用法</h4>
          <pre class="mini-code" v-html="advancedCode"></pre>
        </div>
      </div>
    </div>

    <div class="tips-box" style="margin-top:12px;">
      <p><strong>@content 的核心价值：</strong></p>
      <ul>
        <li>让 Mixin 不仅是「样式片段」，更是「结构模板」</li>
        <li>封装媒体查询、伪类、选择器上下文等重复结构</li>
        <li>与 <code>using ($param)</code> 配合可向内容块传递参数</li>
        <li>构建主题系统、响应式框架、交互状态库的利器</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.sass-demo label { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; }
.var-btn { padding: 6px 14px; border: 1px solid #e0a06a; border-radius: 6px; background: #fff; cursor: pointer; font-size: 12px; color: #8b4513; }
.var-btn.active { background: #e85d04; color: #fff; border-color: #e85d04; }
.demo-card-preview { padding: 16px; border-radius: 12px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.08); transition: all 0.3s; }
.demo-card-preview.highlight { border: 2px solid #e85d04; background: linear-gradient(135deg, #fffaf1, #fff3df); }
.demo-card-preview.compact { padding: 10px; }
.card-title { font-size: 16px; font-weight: 600; color: #8b4513; margin-bottom: 6px; }
.card-desc { font-size: 13px; color: #805f4d; }
.card-price { margin-top: 8px; font-size: 20px; font-weight: 700; color: #e85d04; }
.responsive-demo { display: flex; gap: 12px; }
.sidebar-preview { width: 120px; padding: 16px; background: #fff3df; border-radius: 8px; display: flex; flex-direction: column; gap: 4px; }
.sidebar-preview span { font-size: 13px; font-weight: 600; color: #8b4513; }
.sidebar-preview small { font-size: 11px; color: #a08060; }
.main-preview { flex: 1; padding: 16px; background: #fffaf1; border-radius: 8px; }
.main-preview span { font-size: 13px; font-weight: 600; color: #8b4513; }
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #fff5e6; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
ul { padding-left: 18px; font-size: 12px; margin: 6px 0; }
h4 { margin: 12px 0 8px 0; font-size: 14px; color: #8b4513; }
</style>

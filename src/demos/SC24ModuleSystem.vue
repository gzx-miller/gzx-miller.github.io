<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'use' | 'forward' | 'import'>('use')
const importStyle = ref<'use' | 'forward' | 'import'>('use')

const useCode = `<span style="color:#7c7c99">// @use — 现代模块导入（推荐）</span>

<span style="color:#7c7c99">// _variables.scss</span>
$primary: #e85d04;
$secondary: #f4a261;
$radius: 8px;

<span style="color:#7c7c99">// 使用 @use 导入 — 默认带命名空间</span>
@use 'variables';

.btn {
  background: variables.$primary;
  border-radius: variables.$radius;
}

<span style="color:#7c7c99">// 重命名命名空间</span>
@use 'variables' as vars;

.btn {
  color: vars.$secondary;
}

<span style="color:#7c7c99">// 导入到全局（不推荐，但实用）</span>
@use 'variables' as *;

.btn {
  background: $primary;  <span style="color:#8a8a3a">// 直接使用</span>
}

<span style="color:#7c7c99">// 配置模块 — 带 !default 的变量可被覆盖</span>
@use 'variables' with (
  $primary: #c45125,
  $radius: 12px
);`

const forwardCode = `<span style="color:#7c7c99">// @forward — 转发模块（库作者必备）</span>

<span style="color:#7c7c99">// 场景：index.scss 作为统一入口</span>

<span style="color:#8a8a3a">// _variables.scss</span>
$primary: #e85d04;
$radius: 8px;

<span style="color:#8a8a3a">// _mixins.scss</span>
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

<span style="color:#8a8a3a">// _functions.scss</span>
@function rem($px) {
  @return $px / 16px * 1rem;
}

<span style="color:#7c7c99">// index.scss — 统一定义公共 API</span>
@forward 'variables';
@forward 'mixins';
@forward 'functions';

<span style="color:#7c7c99">// 使用者只需要导入一个文件</span>
@use 'foundation';

.btn {
  background: foundation.$primary;
  @include foundation.flex-center;
  padding: foundation.rem(16px);
}

<span style="color:#7c7c99">// 控制转发内容 — hide / show</span>
@forward 'variables' hide $internal-color;
@forward 'mixins' show flex-center, card;

<span style="color:#7c7c99">// 转发时加前缀</span>
@forward 'colors' as color-*;
<span style="color:#8a8a3a">// 使用: color.$primary → 不对，是加前缀到成员名</span>`

const importCode = `<span style="color:#7c7c99">// @import — 旧方式（已弃用，但仍常见）</span>

<span style="color:#7c7c99">// 传统写法</span>
@import 'variables';
@import 'mixins';
@import 'reset';

.btn {
  background: $primary;  <span style="color:#8a8a3a">// 全局污染，不知道从哪来</span>
}

<span style="color:#7c7c99">// @import 的问题：</span>
<span style="color:#e85d04">✗</span> 所有变量/mixin 全局污染
<span style="color:#e85d04">✗</span> 多次导入可能重复输出
<span style="color:#e85d04">✗</span> 没有命名空间，命名冲突风险大
<span style="color:#e85d04">✗</span> 难以追踪依赖来源
<span style="color:#e85d04">✗</span> 无法配置模块参数

<span style="color:#7c7c99">// 迁移建议：</span>
1. 新项目直接用 @use / @forward
2. 旧项目逐步迁移，先从底层模块开始
3. 使用 sass-migrator 工具自动迁移
4. 保留 @import 仅用于 CSS 文件

<span style="color:#7c7c99">// 对比总结</span>
| 特性        | @import | @use |
|------------|---------|------|
| 命名空间   | ❌ 全局   | ✅ 有  |
| 可配置     | ❌      | ✅ with |
| 单次加载   | ❌ 易重复 | ✅ 模块级 |
| 私有成员   | ❌      | ✅ -前缀 |
| 推荐程度   | ⚠️ 弃用   | ✅ 推荐 |`

const fileTree = [
  { name: 'styles/', type: 'folder', indent: 0 },
  { name: 'abstracts/', type: 'folder', indent: 1 },
  { name: '_variables.scss', type: 'file', indent: 2, desc: '$primary, $radius...' },
  { name: '_mixins.scss', type: 'file', indent: 2, desc: '@mixin flex-center...' },
  { name: '_functions.scss', type: 'file', indent: 2, desc: '@function rem()...' },
  { name: '_index.scss', type: 'file', indent: 2, desc: '@forward 统一入口' },
  { name: 'components/', type: 'folder', indent: 1 },
  { name: '_button.scss', type: 'file', indent: 2, desc: '@use ../abstracts' },
  { name: '_card.scss', type: 'file', indent: 2, desc: '@use ../abstracts' },
  { name: 'app.scss', type: 'file', indent: 0, desc: '主入口，@use 各模块' }
]
</script>

<template>
  <div class="demo-card sass-demo">
    <h3>现代模块系统与 @use / @forward</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'use' }" @click="activeTab = 'use'">@use 导入</button>
      <button class="tab-btn" :class="{ active: activeTab === 'forward' }" @click="activeTab = 'forward'">@forward 转发</button>
      <button class="tab-btn" :class="{ active: activeTab === 'import' }" @click="activeTab === 'import'">@import 对比</button>
    </div>

    <div style="display:flex;gap:16px;align-items:flex-start;">
      <div style="flex:1;">
        <div v-if="activeTab === 'use'">
          <h4>@use — 现代模块导入</h4>
          <pre class="mini-code" v-html="useCode"></pre>
        </div>
        <div v-if="activeTab === 'forward'">
          <h4>@forward — 模块转发</h4>
          <pre class="mini-code" v-html="forwardCode"></pre>
        </div>
        <div v-if="activeTab === 'import'">
          <h4>@import — 旧方式对比</h4>
          <pre class="mini-code" v-html="importCode"></pre>
        </div>
      </div>

      <div class="file-tree" style="width:260px;">
        <div class="tree-title">项目结构</div>
        <div class="tree-body">
          <div v-for="(item, i) in fileTree" :key="i" class="tree-item" :style="{ paddingLeft: item.indent * 16 + 8 + 'px' }">
            <span class="tree-icon">{{ item.type === 'folder' ? '📁' : '📄' }}</span>
            <span class="tree-name">{{ item.name }}</span>
            <small v-if="item.desc" class="tree-desc">{{ item.desc }}</small>
          </div>
        </div>
        <div class="tree-footer">
          <div style="display:flex;gap:6px;margin-bottom:8px;">
            <button class="mini-btn" :class="{ active: importStyle === 'use' }" @click="importStyle = 'use'">@use</button>
            <button class="mini-btn" :class="{ active: importStyle === 'forward' }" @click="importStyle = 'forward'">@forward</button>
            <button class="mini-btn" :class="{ active: importStyle === 'import' }" @click="importStyle = 'import'">@import</button>
          </div>
          <p class="tree-hint">
            <strong v-if="importStyle === 'use'">@use:</strong> 消费模块，带命名空间
          </p>
          <p class="tree-hint">
            <strong v-if="importStyle === 'forward'">@forward:</strong> 定义公共 API，库用
          </p>
          <p class="tree-hint">
            <strong v-if="importStyle === 'import'">@import:</strong> 全局污染，已弃用
          </p>
        </div>
      </div>
    </div>

    <div class="tips-box" style="margin-top:12px;">
      <p><strong>最佳实践：</strong></p>
      <ul>
        <li>库/设计系统：入口文件用 <code>@forward</code> 定义公共 API，隐藏内部实现</li>
        <li>业务代码：用 <code>@use</code> 消费模块，享受命名空间和可配置性</li>
        <li>私有成员：以 <code>-</code> 或 <code>_</code> 开头命名，不会被 @forward 导出</li>
        <li>配置变量：在被导入模块中用 <code>!default</code> 声明，用 <code>with (...)</code> 覆盖</li>
        <li>新项目：完全避免 <code>@import</code>，直接使用现代模块系统</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.sass-demo label { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; }
.file-tree { border: 1px solid #e0a06a; border-radius: 8px; overflow: hidden; background: #fffaf1; }
.tree-title { padding: 10px 12px; background: #fff3df; color: #8b4513; font-size: 13px; font-weight: 600; border-bottom: 1px solid #f4d9b8; }
.tree-body { padding: 8px 0; max-height: 280px; overflow-y: auto; }
.tree-item { padding: 4px 8px; display: flex; align-items: center; gap: 6px; font-size: 12px; }
.tree-icon { font-size: 14px; }
.tree-name { color: #8b4513; font-family: monospace; }
.tree-desc { color: #a08060; font-size: 10px; margin-left: auto; }
.tree-footer { padding: 10px 12px; background: #fff3df; border-top: 1px solid #f4d9b8; }
.mini-btn { padding: 4px 10px; border: 1px solid #e0a06a; border-radius: 4px; background: #fff; color: #8b4513; font-size: 11px; cursor: pointer; }
.mini-btn.active { background: #e85d04; color: #fff; border-color: #e85d04; }
.tree-hint { font-size: 11px; color: #805f4d; margin: 4px 0 0 0; }
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #fff5e6; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
ul { padding-left: 18px; font-size: 12px; margin: 6px 0; }
h4 { margin: 12px 0 8px 0; font-size: 14px; color: #8b4513; }
</style>

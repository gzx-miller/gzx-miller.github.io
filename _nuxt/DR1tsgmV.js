const n=`<script setup lang="ts">
import { ref } from 'vue'

const activeSelector = ref('universal')
const selectedItems = ref<string[]>([])

const selectors = [
  { id: 'universal', label: '通配选择器 *', desc: '匹配所有元素，优先级最低' },
  { id: 'type', label: '类型选择器 div', desc: '匹配指定标签名的所有元素' },
  { id: 'class', label: '类选择器 .active', desc: '匹配 class 包含指定值的元素' },
  { id: 'id', label: 'ID 选择器 #header', desc: '匹配 id 等于指定值的元素' },
  { id: 'attribute', label: '属性选择器 [type="text"]', desc: '匹配拥有指定属性的元素' },
  { id: 'pseudo-class', label: '伪类 :hover', desc: '匹配处于特定状态的元素' },
  { id: 'pseudo-element', label: '伪元素 ::before', desc: '匹配元素的某个部分' },
  { id: 'combinator', label: '组合器 .list > li', desc: '通过关系匹配元素' },
]

function toggleItem(item: string) {
  const idx = selectedItems.value.indexOf(item)
  if (idx >= 0) selectedItems.value.splice(idx, 1)
  else selectedItems.value.push(item)
}
<\/script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">CSS 选择器详解</h3>
    <p class="demo-desc">用课程标签筛选理解不同选择器的匹配规则与优先级。</p>

    <div class="selector-list">
      <button
        v-for="s in selectors"
        :key="s.id"
        :class="['selector-btn', { active: activeSelector === s.id }]"
        @click="activeSelector = s.id"
      >
        {{ s.label }}
      </button>
    </div>

    <div class="selector-demo-area">
      <div class="demo-box" data-selector="universal">
        <span class="label">通配 *</span>
        <p class="text">段落文本</p>
        <a class="link" href="#none">链接</a>
      </div>

      <div class="demo-box" data-selector="type">
        <div class="block">div 块</div>
        <span class="inline">span 内联</span>
        <p class="paragraph">p 段落</p>
      </div>

      <div class="demo-box" data-selector="class">
        <div class="card">普通卡片</div>
        <div class="card active">激活卡片</div>
        <div class="card disabled">禁用卡片</div>
      </div>

      <div class="demo-box" data-selector="id">
        <header id="page-header">页头 #header</header>
        <main id="page-main">主内容 #main</main>
      </div>

      <div class="demo-box" data-selector="attribute">
        <input type="text" placeholder="文本输入框" />
        <input type="email" placeholder="邮箱输入框" />
        <input type="password" placeholder="密码输入框" />
        <a href="#" title="提示链接">带 title 的链接</a>
      </div>

      <div class="demo-box" data-selector="pseudo-class">
        <button class="action-btn">悬停我</button>
        <input class="text-input" placeholder="聚焦我" />
        <ul class="item-list">
          <li v-for="i in [1, 2, 3, 4, 5]" :key="i" @click="toggleItem(String(i))"
            :class="{ selected: selectedItems.includes(String(i)) }">
            项目 {{ i }}
          </li>
        </ul>
      </div>

      <div class="demo-box" data-selector="pseudo-element">
        <div class="highlight-text">伪元素可在元素前后插入内容</div>
        <p class="first-letter-demo">首字放大效果，像报纸排版一样。</p>
      </div>

      <div class="demo-box" data-selector="combinator">
        <ul class="parent-list">
          <li>直接子元素
            <ul>
              <li>后代元素（不直系）</li>
            </ul>
          </li>
          <li>另一个直接子元素</li>
        </ul>
        <div class="sibling-demo">相邻兄弟 +</div>
        <div class="sibling-demo general-sibling">通用兄弟 ~</div>
        <div class="sibling-demo">不受影响</div>
      </div>
    </div>

    <div class="selector-info">
      <strong>{{ selectors.find(s => s.id === activeSelector)?.label }}</strong>
      <span>{{ selectors.find(s => s.id === activeSelector)?.desc }}</span>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  font-family: system-ui, sans-serif;
  --primary: #e8590c;
  --primary-light: #fff4e6;
  --border: #ffd8a8;
  --text: #333;
  --muted: #868e96;
}

.demo-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text);
}

.demo-desc {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 16px;
}

/* ===== 通配选择器 * ===== */
[data-selector="universal"] :where(*) {
  box-sizing: border-box;
}
[data-selector="universal"] .demo-box :deep(p),
[data-selector="universal"] .demo-box :deep(span),
[data-selector="universal"] .demo-box :deep(a) {
  outline: 2px dashed var(--primary);
  outline-offset: 2px;
}

/* ===== 类型选择器 ===== */
[data-selector="type"] :deep(div) {
  background: var(--primary-light);
  border: 1px solid var(--border);
  padding: 4px 8px;
  margin: 4px 0;
  border-radius: 4px;
}
[data-selector="type"] :deep(span) {
  color: var(--primary);
  font-weight: 600;
}
[data-selector="type"] :deep(p) {
  border-left: 3px solid var(--primary);
  padding-left: 8px;
}

/* ===== 类选择器 ===== */
[data-selector="class"] :deep(.active) {
  background: var(--primary) !important;
  color: #fff !important;
  border-color: var(--primary) !important;
}
[data-selector="class"] :deep(.disabled) {
  opacity: 0.4;
  pointer-events: none;
}

/* ===== ID 选择器 ===== */
[data-selector="id"] :deep(#page-header) {
  background: linear-gradient(135deg, var(--primary), #d9480f);
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 600;
}
[data-selector="id"] :deep(#page-main) {
  border: 2px solid var(--primary);
  padding: 8px 12px;
  border-radius: 6px;
  margin-top: 8px;
}

/* ===== 属性选择器 ===== */
[data-selector="attribute"] :deep([type="email"]) {
  border: 2px solid #1971c2;
}
[data-selector="attribute"] :deep([title]) {
  text-decoration: underline wavy #e8590c;
}

/* ===== 伪类 ===== */
[data-selector="pseudo-class"] :deep(.action-btn:hover) {
  background: var(--primary);
  color: #fff;
}
[data-selector="pseudo-class"] :deep(.text-input:focus) {
  outline: 2px solid var(--primary);
}
[data-selector="pseudo-class"] :deep(.item-list li:nth-child(odd)) {
  background: var(--primary-light);
}
[data-selector="pseudo-class"] :deep(.item-list li.selected) {
  background: var(--primary);
  color: #fff;
}

/* ===== 伪元素 ===== */
[data-selector="pseudo-element"] :deep(.highlight-text::before) {
  content: "★ ";
  color: var(--primary);
}
[data-selector="pseudo-element"] :deep(.first-letter-demo::first-letter) {
  font-size: 2em;
  font-weight: 700;
  float: left;
  line-height: 1;
  margin-right: 4px;
  color: var(--primary);
}

/* ===== 组合器 ===== */
[data-selector="combinator"] :deep(.parent-list > li) {
  background: var(--primary-light);
  padding: 4px 8px;
  border-radius: 4px;
  margin: 2px 0;
}
[data-selector="combinator"] :deep(.sibling-demo + .sibling-demo) {
  border-left: 3px solid var(--primary);
  padding-left: 8px;
}
[data-selector="combinator"] :deep(.sibling-demo.general-sibling ~ .sibling-demo) {
  background: var(--primary-light);
}

/* ===== 通用布局 ===== */
.selector-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.selector-btn {
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}
.selector-btn:hover {
  background: var(--primary-light);
}
.selector-btn.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.selector-demo-area {
  min-height: 200px;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  background: #fff;
  margin-bottom: 12px;
}

.demo-box {
  display: none;
}
.demo-box[data-selector="universal"],
.demo-box[data-selector="type"],
.demo-box[data-selector="class"],
.demo-box[data-selector="id"],
.demo-box[data-selector="attribute"],
.demo-box[data-selector="pseudo-class"],
.demo-box[data-selector="pseudo-element"],
.demo-box[data-selector="combinator"] {
  display: block;
}

.card {
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  margin: 4px 0;
  background: #fff;
  transition: all 0.2s;
}

.action-btn {
  padding: 6px 16px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.text-input {
  padding: 6px 10px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  width: 100%;
  margin-top: 8px;
}

.item-list {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
}
.item-list li {
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  margin: 2px 0;
  transition: background 0.2s;
}

.selector-info {
  background: var(--primary-light);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 13px;
  display: flex;
  gap: 8px;
  align-items: baseline;
}
.selector-info strong {
  color: var(--primary);
  white-space: nowrap;
}
</style>
`;export{n as default};

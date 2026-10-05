const n=`<script setup lang="ts">
// ---- 子组件：评分选择器 ----
// 组件 v-model 的核心：modelValue prop + update:modelValue emit
const props = defineProps<{
  modelValue: number      // v-model 绑定的值
  title: string           // v-model:title 绑定的值
  titleModifiers?: { trim?: boolean }  // v-model:title 的修饰符
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'update:title': [value: string]
}>()

const stars = [1, 2, 3, 4, 5]

function selectRating(n: number) {
  emit('update:modelValue', n)
}

function handleTitleInput(e: Event) {
  let val = (e.target as HTMLInputElement).value
  // modelModifiers 允许组件内部处理修饰符逻辑
  if (props.titleModifiers?.trim) {
    val = val.trim()
  }
  emit('update:title', val)
}
<\/script>

<template>
  <div class="demo-card">
    <h3>自定义 v-model</h3>

    <!-- 使用自定义组件的 v-model -->
    <div class="usage-section">
      <h4>父组件使用</h4>
      <pre class="code-block">&lt;RatingSelector
  v-model="rating"          &lt;!-- 默认 modelValue --&gt;
  v-model:title.trim="name" &lt;!-- 命名 model + 修饰符 --&gt;
/&gt;</pre>
    </div>

    <!-- 子组件实现 -->
    <div class="demo-section">
      <h4>评分选择器（子组件）</h4>
      <div class="rating-row">
        <span
          v-for="n in stars"
          :key="n"
          class="star"
          :class="{ active: n <= modelValue }"
          @click="selectRating(n)"
        >★</span>
        <span class="rating-value">{{ modelValue }} 分</span>
      </div>
      <div class="title-row">
        <label>标题 <input :value="title" @input="handleTitleInput" placeholder="输入标题" /></label>
        <span class="modifier-hint">.trim 修饰符已启用</span>
      </div>
    </div>

    <!-- 关键代码说明 -->
    <div class="key-points">
      <h4>关键代码</h4>
      <pre class="code-block">// 子组件定义
const props = defineProps&lt;{
  modelValue: number           // v-model 默认绑定
  title: string                // v-model:title 命名绑定
  titleModifiers?: { trim?: boolean }  // 修饰符对象
}&gt;()

const emit = defineEmits&lt;{
  'update:modelValue': [value: number]  // 默认更新事件
  'update:title': [value: string]       // 命名更新事件
}&gt;()</pre>
    </div>
  </div>
</template>

<style scoped>
.usage-section { margin-bottom: 16px; }
.demo-section { background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
h4 { margin: 0 0 10px; color: #8b5e3c; font-size: 14px; }
.rating-row { display: flex; align-items: center; gap: 4px; margin-bottom: 12px; }
.star { font-size: 28px; color: #e8c9a0; cursor: pointer; transition: color 0.15s; }
.star.active { color: #c8703c; }
.star:hover { color: #d4884a; }
.rating-value { margin-left: 12px; font-size: 16px; font-weight: bold; color: #c8703c; }
.title-row { display: flex; align-items: center; gap: 8px; }
.title-row label { display: flex; align-items: center; gap: 6px; font-size: 14px; color: #5a3e2b; }
.title-row input { padding: 6px 10px; border: 1px solid #d4a574; border-radius: 4px; }
.modifier-hint { font-size: 12px; color: #6b9e78; font-style: italic; }
.code-block { background: #fff; border: 1px solid #e8c9a0; border-radius: 6px; padding: 12px; font-size: 12px; line-height: 1.6; white-space: pre-wrap; color: #5a3e2b; margin: 8px 0; }
.key-points { background: #f0f7f2; border: 1px solid #a8d5b8; border-radius: 8px; padding: 12px; }
</style>
`;export{n as default};

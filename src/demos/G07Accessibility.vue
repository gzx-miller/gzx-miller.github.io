<script setup lang="ts">
import { computed, reactive } from 'vue'

const audit = reactive({ label: true, keyboard: false, contrast: true, status: false })
const score = computed(() => Object.values(audit).filter(Boolean).length)
</script>

<template>
  <div class="demo-card">
    <fieldset>
      <legend>报名表无障碍检查</legend>
      <label><input v-model="audit.label" type="checkbox" /> 表单控件有标签</label>
      <label><input v-model="audit.keyboard" type="checkbox" /> 键盘可完成操作</label>
      <label><input v-model="audit.contrast" type="checkbox" /> 颜色对比度达标</label>
      <label><input v-model="audit.status" type="checkbox" /> 状态变化可被朗读</label>
    </fieldset>
    <p>完成 {{ score }} / 4 项</p>
  </div>
</template>

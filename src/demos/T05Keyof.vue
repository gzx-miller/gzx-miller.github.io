<script setup lang="ts">
import { reactive, ref } from 'vue'

interface Preferences { theme: string; density: string; language: string }
type PreferenceKey = keyof Preferences

const preferences = reactive<Preferences>({ theme: '秋日', density: '舒适', language: '中文' })
const activeKey = ref<PreferenceKey>('theme')
const keys: PreferenceKey[] = ['theme', 'density', 'language']

function readSetting(key: PreferenceKey) {
  return preferences[key]
}
</script>

<template>
  <div class="demo-card">
    <div class="button-row"><button v-for="key in keys" :key="key" @click="activeKey = key">{{ key }}</button></div>
    <p>当前配置：<strong>{{ readSetting(activeKey) }}</strong></p>
  </div>
</template>

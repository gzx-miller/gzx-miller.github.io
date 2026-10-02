const n=`<script setup lang="ts">
import { computed, ref } from 'vue'

const platforms = ['MP-WEIXIN', 'H5', 'APP-PLUS'] as const
const platform = ref<'MP-WEIXIN' | 'H5' | 'APP-PLUS'>('MP-WEIXIN')

const labels: Record<string, string> = {
  'MP-WEIXIN': '微信小程序',
  H5: 'H5 网页',
  'APP-PLUS': '原生 App',
}

const showShare = computed(() => platform.value === 'MP-WEIXIN')
const showSave = computed(() => platform.value !== 'H5')
<\/script>

<template>
  <div class="demo-card">
    <div class="row">
      <button
        v-for="p in platforms"
        :key="p"
        type="button"
        :class="{ on: platform === p }"
        @click="platform = p"
      >
        {{ labels[p] }}
      </button>
    </div>

    <div class="screen">
      <div class="badge">当前运行平台：{{ labels[platform] }}</div>

      <div v-if="showShare" class="slot share">🔗 分享给好友（仅 #ifdef MP-WEIXIN）</div>
      <div v-if="showSave" class="slot save">🖼️ 保存海报到相册（#ifndef H5）</div>
      <div v-if="!showShare && !showSave" class="slot none">H5 端两者都不渲染</div>
    </div>

    <p class="hint">
      条件编译在编译期裁剪分支，运行时不产生任何判断开销。
    </p>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.row button {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--muted);
}
.row button.on {
  border-color: var(--accent);
  background: var(--accent);
  color: #fff;
}
.screen {
  display: grid;
  gap: 10px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface);
  padding: 18px;
}
.badge {
  color: var(--text);
  font-weight: 700;
}
.slot {
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 14px;
}
.share {
  background: rgba(123, 181, 86, 0.16);
  color: var(--forest);
}
.save {
  background: rgba(246, 193, 90, 0.2);
  color: var(--chestnut);
}
.none {
  background: var(--surface-soft);
  color: var(--muted);
}
.hint {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}
</style>`;export{n as default};

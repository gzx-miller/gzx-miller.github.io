<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

const banners = [
  { title: 'Vue3 组合式 API', tone: '#d94b26' },
  { title: 'Pinia 状态管理', tone: '#f08a24' },
  { title: 'uni-app 跨端', tone: '#4b6d33' },
]
const idx = ref(0)
const autoplay = ref(true)
let timer: ReturnType<typeof setInterval> | undefined

function start() {
  stop()
  timer = setInterval(next, 2000)
}
function stop() {
  if (timer) clearInterval(timer)
  timer = undefined
}
function next() {
  idx.value = (idx.value + 1) % banners.length
}
function prev() {
  idx.value = (idx.value - 1 + banners.length) % banners.length
}
function toggleAuto() {
  autoplay.value = !autoplay.value
  autoplay.value ? start() : stop()
}
start()
onBeforeUnmount(stop)

const courses = ref(['数组去重', '深拷贝', '防抖节流', 'Promise 时序'])
function loadMore() {
  const more = ['事件循环', '原型链', '闭包']
  courses.value.push(...more.splice(0, Math.min(more.length, 2)))
  if (courses.value.length > 8) courses.value = courses.value.slice(0, 8)
}
</script>

<template>
  <div class="demo-card">
    <div class="swiper">
      <div class="track" :style="{ transform: `translateX(-${idx * 100}%)` }">
        <div
          v-for="b in banners"
          :key="b.title"
          class="slide"
          :style="{ background: b.tone }"
        >
          {{ b.title }}
        </div>
      </div>
      <button type="button" class="nav l" @click="prev">‹</button>
      <button type="button" class="nav r" @click="next">›</button>
      <div class="dots">
        <span v-for="(_, i) in banners" :key="i" :class="{ on: i === idx }" />
      </div>
    </div>

    <div class="controls">
      <button type="button" @click="toggleAuto">{{ autoplay ? '暂停自动播放' : '开启自动播放' }}</button>
    </div>

    <div class="scroll">
      <div v-for="c in courses" :key="c" class="row">{{ c }}</div>
    </div>
    <button type="button" @click="loadMore">触底加载更多（scroll-view）</button>
  </div>
</template>

<style scoped>
.swiper {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  aspect-ratio: 16 / 7;
}
.track {
  display: flex;
  height: 100%;
  transition: transform 0.4s ease;
}
.slide {
  flex: 0 0 100%;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
}
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.28);
  color: #fff;
  width: 32px;
  height: 32px;
  padding: 0;
  font-size: 20px;
  line-height: 1;
}
.nav.l {
  left: 10px;
}
.nav.r {
  right: 10px;
}
.dots {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}
.dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
}
.dots span.on {
  background: #fff;
}
.controls {
  display: flex;
  gap: 10px;
}
.scroll {
  max-height: 140px;
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 4px;
}
.row {
  border-radius: 6px;
  padding: 8px 12px;
  color: var(--text);
  font-size: 14px;
}
.row:nth-child(odd) {
  background: var(--surface-soft);
}
</style>
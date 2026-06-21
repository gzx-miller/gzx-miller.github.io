<script setup>
import { ref } from 'vue'

class Course {
  constructor(title, hours) { this.title = title; this.hours = hours }
  summary() { return `${this.title} · ${this.hours} 小时` }
}

class LiveCourse extends Course {
  summary() { return `直播课：${super.summary()}` }
}

const course = new LiveCourse('异步编程', 6)
const output = ref(course.summary())
</script>

<template><div class="demo-card"><p>{{ output }}</p><small>class 是原型继承的语法封装；实例方法共享在 prototype 上。</small></div></template>

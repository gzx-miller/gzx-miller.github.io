<script setup lang="ts">
import { ref } from 'vue'
import { ElSkeleton, ElSkeletonItem, ElButton, ElTag } from 'element-plus'

const loading = ref(true)

interface Course {
  title: string
  teacher: string
  students: number
  tag: string
}

const course: Course = {
  title: 'Vue3 组合式 API 实战',
  teacher: '李老师',
  students: 326,
  tag: '热门',
}

async function reload() {
  loading.value = true
  await new Promise(r => setTimeout(r, 1500))
  loading.value = false
}
</script>

<template>
  <div class="demo-card">
    <p class="demo-kicker">加载态与骨架屏</p>
    <h3>课程卡片加载状态</h3>

    <div class="button-row" style="margin-bottom: 16px">
      <ElButton :type="loading ? '' : 'primary'" @click="reload">
        {{ loading ? '加载中…' : '重新加载' }}
      </ElButton>
    </div>

    <!-- 骨架态：自定义模板 -->
    <ElSkeleton :loading="loading" animated :count="1">
      <template #template>
        <div style="display: flex; gap: 16px; align-items: flex-start">
          <ElSkeletonItem variant="circle" style="width: 64px; height: 64px" />
          <div style="flex: 1">
            <ElSkeletonItem variant="h3" style="width: 60%; margin-bottom: 12px" />
            <ElSkeletonItem variant="text" style="width: 80%; margin-bottom: 8px" />
            <ElSkeletonItem variant="text" style="width: 40%" />
          </div>
        </div>
      </template>

      <!-- 加载完成：真实内容 -->
      <template #default>
        <div style="display: flex; gap: 16px; align-items: flex-start">
          <div
            style="width: 64px; height: 64px; border-radius: 50%; background: #f5e6d3;
                   display: flex; align-items: center; justify-content: center; font-size: 1.8em"
          >
            🌰
          </div>
          <div>
            <h4 style="margin: 0 0 6px">{{ course.title }}</h4>
            <p style="margin: 0 0 4px; color: #666">讲师：{{ course.teacher }} · {{ course.students }} 人已学</p>
            <ElTag type="warning" size="small">{{ course.tag }}</ElTag>
          </div>
        </div>
      </template>
    </ElSkeleton>
  </div>
</template>

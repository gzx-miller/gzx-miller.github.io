<script setup lang="ts">
import { ref } from 'vue'
import { ElPopover, ElButton, ElInput } from 'element-plus'

const searchKeyword = ref('')

const courseList = [
  'Vue3 组合式 API 入门',
  'TypeScript 类型编程',
  'Element Plus 组件精讲',
  'Pinia 状态管理',
  'Vite 构建优化',
]
</script>

<template>
  <div class="demo-card">
    <h3>气泡卡片 Popover</h3>

    <h4>基础用法</h4>
    <div class="button-row">
      <ElPopover
        placement="top"
        title="标题"
        :width="200"
        trigger="hover"
      >
        <template #reference>
          <ElButton>悬浮上方</ElButton>
        </template>
        <p>这是一段内容，鼠标移出会自动关闭。</p>
      </ElPopover>

      <ElPopover
        placement="bottom"
        title="快捷操作"
        :width="160"
        trigger="click"
      >
        <template #reference>
          <ElButton type="primary">点击下方</ElButton>
        </template>
        <div class="action-list">
          <ElButton size="small" link>新建课程</ElButton>
          <ElButton size="small" link>编辑资料</ElButton>
          <ElButton size="small" link type="danger">退出登录</ElButton>
        </div>
      </ElPopover>

      <ElPopover
        placement="right"
        title="功能说明"
        :width="220"
        trigger="focus"
      >
        <template #reference>
          <ElInput
            v-model="searchKeyword"
            placeholder="聚焦此处"
          />
        </template>
        <p>输入关键词后，系统会自动从课程库中搜索相关内容。</p>
      </ElPopover>
    </div>

    <h4>嵌套内容</h4>
    <ElPopover
      placement="bottom-start"
      :width="240"
      trigger="click"
    >
      <template #reference>
        <ElButton>课程列表</ElButton>
      </template>
      <template #default>
        <div class="course-list">
          <p class="list-title">推荐课程</p>
          <div
            v-for="course in courseList"
            :key="course"
            class="course-item"
          >
            {{ course }}
          </div>
        </div>
      </template>
    </ElPopover>
  </div>
</template>


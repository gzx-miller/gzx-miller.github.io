<script setup lang="ts">
import { ref } from 'vue'
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton, ElMessage, ElIcon } from 'element-plus'
import { Edit, Share, Star, ArrowDown, Check } from '@element-plus/icons-vue'

const activeCourse = ref('Vue3 组合式 API 入门')

const courses = [
  { id: 1, name: 'Vue3 组合式 API 入门' },
  { id: 2, name: 'TypeScript 类型编程' },
  { id: 3, name: 'Element Plus 组件精讲' },
]

function handleCommand(command: string) {
  ElMessage.info(`已选择操作：${command}`)
}

function selectCourse(courseName: string) {
  activeCourse.value = courseName
  ElMessage.success(`已切换到：${courseName}`)
}
</script>

<template>
  <div class="demo-card">
    <h3>下拉菜单 Dropdown</h3>

    <h4>基础下拉</h4>
    <div class="button-row">
      <ElDropdown @command="handleCommand">
        <ElButton type="primary">
          操作菜单 <ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
        </ElButton>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem command="edit" :icon="Edit">编辑</ElDropdownItem>
            <ElDropdownItem command="share" :icon="Share">分享</ElDropdownItem>
            <ElDropdownItem command="star" :icon="Star">收藏</ElDropdownItem>
            <ElDropdownItem command="delete" divided disabled>删除</ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>

      <ElDropdown size="small">
        <ElButton type="success" size="small">
          小尺寸
        </ElButton>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem>选项一</ElDropdownItem>
            <ElDropdownItem>选项二</ElDropdownItem>
            <ElDropdownItem>选项三</ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>

      <ElDropdown split-button type="warning" @click="ElMessage.success('点击了默认按钮')">
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem>每日任务</ElDropdownItem>
            <ElDropdownItem>积分商城</ElDropdownItem>
            <ElDropdownItem>意见反馈</ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </div>

    <h4>课程切换</h4>
    <div class="course-selector">
      <span class="label">当前课程：</span>
      <ElDropdown @command="selectCourse">
        <span class="current-course">
          {{ activeCourse }}
          <ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
        </span>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem
              v-for="course in courses"
              :key="course.id"
              :command="course.name"
              :disabled="course.name === activeCourse"
            >
              {{ course.name }}
              <ElIcon v-if="course.name === activeCourse" class="el-icon--right"><Check /></ElIcon>
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </div>
  </div>
</template>


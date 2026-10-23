const n=`<script setup lang="ts">
import { ref } from 'vue'
import { ElTabs, ElTabPane, ElButton, ElTag, ElMessage } from 'element-plus'

const activeTab = ref('course')

const courses = [
  { id: 1, name: 'Vue3 组合式 API 入门', lessons: 12, progress: 80 },
  { id: 2, name: 'TypeScript 类型编程', lessons: 18, progress: 45 },
  { id: 3, name: 'Element Plus 组件精讲', lessons: 24, progress: 20 },
]

const notices = [
  { id: 1, title: '《Vue3 实战》课程即将开课', date: '2025-01-15' },
  { id: 2, title: '积分商城新上线，快去兑换吧', date: '2025-01-14' },
  { id: 3, title: 'Element Plus 2.14.0 正式发布', date: '2025-01-12' },
]

function handleTabClick(tab: any) {
  ElMessage.info(\`切换到：\${tab.props.label}\`)
}

function formatProgress(progress: number) {
  return \`\${progress}%\`
}
<\/script>

<template>
  <div class="demo-card">
    <h3>标签页 Tabs</h3>

    <h4>基础用法</h4>
    <ElTabs v-model="activeTab" @tab-click="handleTabClick">
      <ElTabPane label="课程" name="course">
        <div class="pane-content">
          <div
            v-for="course in courses"
            :key="course.id"
            class="course-item"
          >
            <div class="course-info">
              <strong>{{ course.name }}</strong>
              <span class="lessons">{{ course.lessons }} 课时</span>
            </div>
            <div class="course-progress">
              <ElTag type="success" size="small">{{ formatProgress(course.progress) }}</ElTag>
            </div>
          </div>
        </div>
      </ElTabPane>

      <ElTabPane label="通知" name="notice">
        <div class="pane-content">
          <div
            v-for="notice in notices"
            :key="notice.id"
            class="notice-item"
          >
            <span class="notice-title">{{ notice.title }}</span>
            <span class="notice-date">{{ notice.date }}</span>
          </div>
        </div>
      </ElTabPane>

      <ElTabPane label="设置" name="settings">
        <div class="pane-content settings-pane">
          <div class="setting-item">
            <span>消息通知</span>
            <ElButton size="small" type="primary">开启</ElButton>
          </div>
          <div class="setting-item">
            <span>邮件订阅</span>
            <ElButton size="small">关闭</ElButton>
          </div>
          <div class="setting-item">
            <span>隐私设置</span>
            <ElButton size="small">管理</ElButton>
          </div>
        </div>
      </ElTabPane>

      <ElTabPane label="禁用" name="disabled" disabled>
        <div class="pane-content">
          <p>这里是禁用标签页的内容</p>
        </div>
      </ElTabPane>
    </ElTabs>

    <h4>卡片样式</h4>
    <ElTabs type="card">
      <ElTabPane label="标签一">内容一</ElTabPane>
      <ElTabPane label="标签二">内容二</ElTabPane>
      <ElTabPane label="标签三">内容三</ElTabPane>
    </ElTabs>
  </div>
</template>

`;export{n as default};

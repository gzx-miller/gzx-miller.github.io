const e=`<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElButton, ElDescriptions, ElDescriptionsItem, ElDrawer, ElInput, ElMessage, ElTag } from 'element-plus'

const drawerVisible = ref(false)
const saving = ref(false)
const course = reactive({
  title: 'Vue3 组合式 API 实战',
  teacher: '李老师',
  students: 128,
  status: '招生中',
  note: '周二、周四晚直播，适合有 Vue2 基础的学习者。',
})

function openDrawer() {
  drawerVisible.value = true
}

async function saveCourse() {
  saving.value = true
  await new Promise((resolve) => setTimeout(resolve, 500))
  saving.value = false
  drawerVisible.value = false
  ElMessage.success('课程备注已保存')
}
<\/script>

<template>
  <div class="demo-card drawer-demo">
    <div>
      <p class="demo-kicker">不中断列表上下文</p>
      <h3>课程详情抽屉</h3>
    </div>

    <ElDescriptions :column="1" border>
      <ElDescriptionsItem label="课程">{{ course.title }}</ElDescriptionsItem>
      <ElDescriptionsItem label="讲师">{{ course.teacher }}</ElDescriptionsItem>
      <ElDescriptionsItem label="状态">
        <ElTag type="success">{{ course.status }}</ElTag>
      </ElDescriptionsItem>
    </ElDescriptions>

    <ElButton type="primary" @click="openDrawer">查看并编辑详情</ElButton>

    <ElDrawer
      v-model="drawerVisible"
      title="课程详情"
      size="min(420px, 90%)"
      destroy-on-close
    >
      <div class="drawer-content">
        <ElDescriptions :column="1">
          <ElDescriptionsItem label="课程">{{ course.title }}</ElDescriptionsItem>
          <ElDescriptionsItem label="当前学员">{{ course.students }} 人</ElDescriptionsItem>
        </ElDescriptions>

        <label>
          运营备注
          <ElInput v-model="course.note" type="textarea" :rows="5" />
        </label>

        <div class="drawer-actions">
          <ElButton @click="drawerVisible = false">取消</ElButton>
          <ElButton type="primary" :loading="saving" @click="saveCourse">保存</ElButton>
        </div>
      </div>
    </ElDrawer>
  </div>
</template>

`;export{e as default};

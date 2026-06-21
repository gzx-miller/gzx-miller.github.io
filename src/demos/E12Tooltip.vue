<script setup lang="ts">
import { ElTooltip, ElButton } from 'element-plus'

const tooltipCode = `// ElTooltip 关键属性
<ElTooltip
  content="提示内容"     // 文本内容
  placement="top"        // 方向：top/bottom/left/right
  trigger="hover"        // 触发：hover/click
  :hide-after="2000"     // 自动隐藏延迟
>
  <ElButton>触发元素</ElButton>
</ElTooltip>

// 富内容使用 #content 插槽
<ElTooltip placement="top">
  <template #content>
    <div>多行<br/>提示内容</div>
  </template>
  <ElButton>富内容提示</ElButton>
</ElTooltip>`
</script>

<template>
  <div class="demo-card">
    <h3>工具提示 Tooltip</h3>

    <h4>不同方向</h4>
    <div class="direction-row">
      <ElTooltip content="上方提示：课程评分 4.8" placement="top">
        <ElButton>上方</ElButton>
      </ElTooltip>
      <ElTooltip content="右侧提示：已报名 128 人" placement="right">
        <ElButton type="primary">右侧</ElButton>
      </ElTooltip>
      <ElTooltip content="下方提示：课程时长 12 课时" placement="bottom">
        <ElButton type="success">下方</ElButton>
      </ElTooltip>
      <ElTooltip content="左侧提示：讲师认证" placement="left">
        <ElButton type="warning">左侧</ElButton>
      </ElTooltip>
    </div>

    <h4>点击触发 & 富内容</h4>
    <div class="trigger-row">
      <ElTooltip content="点击后显示的提示信息" trigger="click">
        <ElButton type="info">点击触发</ElButton>
      </ElTooltip>
      <ElTooltip placement="top">
        <template #content>
          <div class="rich-tip">
            <strong>课程详情</strong>
            <p>讲师：李老师</p>
            <p>评分：4.8 / 5.0</p>
            <p>学员：128 人</p>
          </div>
        </template>
        <ElButton type="primary">富内容提示</ElButton>
      </ElTooltip>
    </div>

    <div class="code-section">
      <h4>关键代码</h4>
      <pre class="code-block">{{ tooltipCode }}</pre>
    </div>
  </div>
</template>


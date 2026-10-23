const n=`<script setup>
import { ref } from 'vue'

const rawUser = ref({
  name: '小松鼠',
  profile: { bio: '爱收集栗子' },
  // address 故意缺失，测试可选链
})

const display = ref('')

function showCity() {
  const city = rawUser.value.address?.city ?? '未设置城市'
  display.value = \`城市：\${city}\`
}
function showBio() {
  const bio = rawUser.value.profile?.bio ?? '暂无简介'
  display.value = \`简介：\${bio}\`
}
function showAvatar() {
  const url = rawUser.value.profile?.avatar?.url ?? 'default.png'
  display.value = \`头像：\${url}\`
}

// 逻辑赋值演示
const config = ref({})
function applyDefaults() {
  config.value.title ||= '默认标题'
  config.value.theme ??= '秋日暖色'
  config.value.count &&= config.value.count * 2
  display.value = \`配置：标题=\${config.value.title}，主题=\${config.value.theme}，计数=\${config.value.count}\`
}
<\/script>

<template><div class="demo-card"><div class="button-row"><button @click="showCity">查看城市</button><button @click="showBio">查看简介</button><button @click="showAvatar">查看头像</button><button @click="applyDefaults">应用默认配置</button></div><p>{{ display }}</p><small>??. 安全访问深层属性，?? 仅在 null/undefined 时取默认值。</small></div></template>
`;export{n as default};

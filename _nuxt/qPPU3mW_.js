const e=`<script setup lang="ts">
import { computed, reactive } from 'vue'

interface MemberProfile {
  name: string
  level: '普通' | '银卡' | '金卡'
  points: number
}

const member = reactive<MemberProfile>({ name: '小栗', level: '银卡', points: 860 })
const nextLevel = computed(() => Math.max(0, 1000 - member.points))
<\/script>

<template>
  <div class="demo-card">
    <label>会员名<input v-model="member.name" /></label>
    <label>成长值<input v-model.number="member.points" type="number" min="0" /></label>
    <p>{{ member.name }} · {{ member.level }}会员，还差 {{ nextLevel }} 分升级。</p>
  </div>
</template>
`;export{e as default};

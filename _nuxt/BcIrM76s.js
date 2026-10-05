const e=`<script setup lang="ts">
import { computed, reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  agree: false,
})

const canSubmit = computed(() => form.name.trim().length >= 2 && form.email.includes('@') && form.agree)
<\/script>

<template>
  <form class="demo-card" @submit.prevent>
    <h3>活动报名表</h3>
    <input v-model.trim="form.name" placeholder="姓名，至少 2 个字符" />
    <input v-model.trim="form.email" placeholder="邮箱" />
    <label><input v-model="form.agree" type="checkbox" /> 同意接收课程通知</label>
    <button :disabled="!canSubmit">提交报名</button>
    <p>{{ canSubmit ? '表单可以提交' : '请补全信息' }}</p>
  </form>
</template>
`;export{e as default};

const e=`<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElCheckbox, ElCheckboxGroup, ElDatePicker, ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()
const form = reactive({
  username: '',
  email: '',
  role: '',
  skills: [] as string[],
  date: '',
  agree: false,
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 12, message: '用户名长度 3-12 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  agree: [{ validator: (_, value, callback) => {
    value ? callback() : callback(new Error('请同意用户协议'))
  }, trigger: 'change' }],
}

const skillsOptions = ['Vue3', 'TypeScript', 'Element Plus', 'Vite', 'Pinia']

function submitForm() {
  formRef.value?.validate((valid) => {
    if (valid) {
      ElMessage.success('表单提交成功！')
    } else {
      ElMessage.error('请检查表单填写')
    }
  })
}

function resetForm() {
  formRef.value?.resetFields()
}
<\/script>

<template>
  <div class="demo-card">
    <h3>用户注册表单</h3>
    <ElForm
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="90px"
      class="demo-form"
    >
      <ElFormItem label="用户名" prop="username">
        <ElInput v-model="form.username" placeholder="请输入用户名" clearable />
      </ElFormItem>

      <ElFormItem label="邮箱" prop="email">
        <ElInput v-model="form.email" placeholder="请输入邮箱" clearable />
      </ElFormItem>

      <ElFormItem label="角色" prop="role">
        <ElSelect v-model="form.role" placeholder="请选择角色">
          <ElOption label="前端开发" value="frontend" />
          <ElOption label="后端开发" value="backend" />
          <ElOption label="全栈开发" value="fullstack" />
          <ElOption label="产品经理" value="pm" />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="擅长技能">
        <ElCheckboxGroup v-model="form.skills">
          <ElCheckbox v-for="skill in skillsOptions" :key="skill" :value="skill">
            {{ skill }}
          </ElCheckbox>
        </ElCheckboxGroup>
      </ElFormItem>

      <ElFormItem label="注册日期" prop="date">
        <ElDatePicker
          v-model="form.date"
          type="date"
          placeholder="选择日期"
        />
      </ElFormItem>

      <ElFormItem prop="agree">
        <ElCheckbox v-model="form.agree">
          我已阅读并同意 <a href="#" @click.prevent>《用户协议》</a>
        </ElCheckbox>
      </ElFormItem>

      <ElFormItem>
        <ElButton type="primary" @click="submitForm">提交注册</ElButton>
        <ElButton @click="resetForm">重置表单</ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</template>

`;export{e as default};

<script setup lang="ts">
import { computed, ref } from 'vue'

interface FieldError {
  field: string
  value: string
  rules: string[]
}

const form = ref({ name: '', email: '', age: '' as string, courseId: '' })
const submitted = ref(false)

// 模拟 class-validator 的规则集
const rules = {
  name: [
    { test: (v: string) => v.trim().length > 0, message: '姓名不能为空' },
    { test: (v: string) => v.trim().length <= 20, message: '姓名最长 20 个字符' },
  ],
  email: [
    { test: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: '邮箱格式不正确' },
  ],
  age: [
    { test: (v: string) => v !== '' && Number.isInteger(Number(v)), message: '年龄必须是整数' },
    { test: (v: string) => Number(v) >= 18, message: '年龄不能小于 18' },
    { test: (v: string) => Number(v) <= 99, message: '年龄不能大于 99' },
  ],
  courseId: [
    { test: (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v), message: '课程 ID 必须是 UUID v4' },
  ],
} as const

const errors = computed<FieldError[]>(() => {
  if (!submitted.value) return []
  const list: FieldError[] = []
  for (const key of ['name', 'email', 'age', 'courseId'] as const) {
    const failed = rules[key].filter((rule) => !rule.test(form.value[key]))
    if (failed.length) {
      list.push({ field: key, value: form.value[key], rules: failed.map((r) => r.message) })
    }
  }
  return list
})

const isValid = computed(() => errors.value.length === 0)

function submit() {
  submitted.value = true
}

function reset() {
  submitted.value = false
  form.value = { name: '', email: '', age: '', courseId: '' }
}
</script>

<template>
  <div class="demo-card">
    <h3>🌰 课程报名表单 · ValidationPipe 校验</h3>
    <p style="color: var(--muted); margin-bottom: 12px">
      填写并提交表单，模拟 <code>ValidationPipe</code> 按 DTO 规则逐字段校验（试试留空姓名、填非法邮箱或年龄 12）：
    </p>

    <div class="form-grid">
      <label>姓名
        <input v-model="form.name" type="text" placeholder="如：张小栗" />
      </label>
      <label>邮箱
        <input v-model="form.email" type="text" placeholder="name@example.com" />
      </label>
      <label>年龄
        <input v-model="form.age" type="number" placeholder="18 - 99" />
      </label>
      <label>课程 ID（UUID v4）
        <input v-model="form.courseId" type="text" placeholder="8f14e45f-ea04-4c86-9d1a-..." />
      </label>
    </div>

    <div style="display: flex; gap: 8px; margin: 12px 0">
      <button class="tab-btn active" @click="submit">提交（触发校验）</button>
      <button class="tab-btn" @click="reset">重置</button>
    </div>

    <div v-if="submitted" class="result-box" :class="isValid ? 'ok' : 'fail'">
      <p v-if="isValid" class="result-title">✅ 校验通过</p>
      <p v-else class="result-title">❌ 校验失败（HTTP 400）</p>
      <pre v-if="!isValid" class="result-json">{
  "statusCode": 400,
  "message": [
    <template v-for="(err, i) in errors" :key="err.field">{
      "field": "{{ err.field }}",
      "value": "{{ err.value }}",
      "errors": [<span v-for="(msg, j) in err.rules" :key="j">"{{ msg }}"<span v-if="j < err.rules.length - 1">, </span></span>]
    }<span v-if="i < errors.length - 1">,</span>
    </template>
  ],
  "error": "Bad Request"
}</pre>
      <p v-else class="result-ok">请求已进入控制器，参数已通过白名单校验。</p>
    </div>

    <p class="note">
      <strong>DTO 规则（class-validator）：</strong>
      <code>@IsNotEmpty</code> · <code>@MaxLength(20)</code> · <code>@IsEmail</code> ·
      <code>@IsInt</code> · <code>@Min(18)</code> · <code>@Max(99)</code> · <code>@IsUUID('4')</code>
    </p>
  </div>
</template>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
}

.form-grid input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1.5px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-size: 13px;
}

.form-grid input:focus {
  outline: none;
  border-color: var(--accent);
}

.result-box {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--border);
}

.result-box.ok {
  border-color: var(--forest);
  background: color-mix(in srgb, var(--forest) 10%, var(--bg));
}

.result-box.fail {
  border-color: var(--leaf-red);
  background: color-mix(in srgb, var(--leaf-red) 8%, var(--bg));
}

.result-title {
  margin: 0 0 8px;
  font-weight: 700;
  font-size: 14px;
}

.result-box.fail .result-title { color: var(--leaf-red); }
.result-box.ok .result-title { color: var(--forest); }

.result-json {
  margin: 0;
  padding: 10px;
  border-radius: 8px;
  background: var(--surface-soft);
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--text);
}

.result-ok {
  margin: 0;
  font-size: 13px;
  color: var(--forest);
}

.note {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--muted);
}
</style>

const e=`<script setup lang="ts">
import { ref, computed } from 'vue'

// 命名空间：可用于组织全局类型，同名命名空间自动合并
namespace CourseApp {
  export interface Course {
    id: number
    title: string
    level: 'beginner' | 'advanced'
  }
  export function formatCourse(c: Course): string {
    return \`\${c.title}（\${c.level === 'beginner' ? '入门' : '进阶'}）\`
  }
}

// 命名空间合并：同名自动合并成员
namespace CourseApp {
  export interface Student {
    name: string
    enrolled: Course[]
  }
}

// 全局类型模式：用 type/interface + 模块导出替代 namespace
type Role = 'admin' | 'teacher' | 'student'
interface User {
  id: number
  name: string
  role: Role
}

const view = ref<'namespace' | 'module'>('namespace')

const nsCode = \`namespace CourseApp {
  export interface Course { id: number; title: string }
  export function format(c: Course): string { ... }
}
// 合并：同名命名空间自动追加成员
namespace CourseApp {
  export interface Student { name: string }
}
// 使用：CourseApp.format(course)\`

const modCode = \`// course.ts — ES 模块方式
export interface Course { id: number; title: string }
export function format(c: Course): string { ... }

// student.ts
import type { Course } from './course'
export interface Student { name: string; enrolled: Course[] }

// 使用：import { format } from './course'\`

const activeCode = computed(() => view.value === 'namespace' ? nsCode : modCode)

const demoCourse: CourseApp.Course = { id: 1, title: 'Vue3 基础', level: 'beginner' }
const demoUser: User = { id: 1, name: '小明', role: 'student' }
const result = ref('')

function runNamespace() {
  result.value = CourseApp.formatCourse(demoCourse)
}

function runModule() {
  result.value = \`用户 \${demoUser.name}，角色：\${demoUser.role}\`
}
<\/script>

<template>
  <div class="demo-card">
    <h4>命名空间与全局类型</h4>

    <div class="button-row">
      <button :class="{ active: view === 'namespace' }" @click="view = 'namespace'">namespace 方式</button>
      <button :class="{ active: view === 'module' }" @click="view = 'module'">ES 模块方式</button>
    </div>

    <pre class="code-block">{{ activeCode }}</pre>

    <div class="button-row">
      <button @click="runNamespace">运行 namespace 示例</button>
      <button @click="runModule">运行模块示例</button>
    </div>
    <p v-if="result">{{ result }}</p>

    <small>namespace 适合同文件内组织全局类型并支持合并；跨文件场景优先使用 ES 模块，tree-shaking 友好</small>
  </div>
</template>
`;export{e as default};

const e=`<script setup lang="ts">
import { ref, computed } from 'vue'

type ImportSource = 'vue' | 'nuxt' | 'component' | 'composable' | 'util'

const selected = ref<ImportSource>('vue')

const importMap: Record<ImportSource, { title: string; items: { name: string; desc: string }[] }> = {
  vue: {
    title: 'Vue 自动导入',
    items: [
      { name: 'ref', desc: '创建响应式引用' },
      { name: 'reactive', desc: '创建响应式对象' },
      { name: 'computed', desc: '创建计算属性' },
      { name: 'watch', desc: '侦听器' },
      { name: 'watchEffect', desc: '立即执行侦听器' },
      { name: 'onMounted', desc: '挂载后生命周期' },
      { name: 'onUnmounted', desc: '卸载前生命周期' },
      { name: 'nextTick', desc: '等待 DOM 更新' },
      { name: 'toRef / toRefs', desc: '转换响应式引用' },
    ],
  },
  nuxt: {
    title: 'Nuxt 自动导入',
    items: [
      { name: 'useFetch', desc: '数据获取（自动 key）' },
      { name: 'useAsyncData', desc: '异步数据管理' },
      { name: 'useState', desc: '跨组件共享状态' },
      { name: 'useHead', desc: '管理页面 head' },
      { name: 'useRoute', desc: '获取当前路由信息' },
      { name: 'useRouter', desc: '获取路由器实例' },
      { name: 'navigateTo', desc: '编程式导航' },
      { name: 'useRuntimeConfig', desc: '读取运行时配置' },
      { name: 'useAppConfig', desc: '读取应用配置' },
    ],
  },
  component: {
    title: '组件自动导入',
    items: [
      { name: 'components/MyButton.vue', desc: '模板中直接用 <MyButton />' },
      { name: 'components/UserCard.vue', desc: '模板中直接用 <UserCard />' },
      { name: 'components/base/Input.vue', desc: '前缀命名 <BaseInput />' },
      { name: 'components/admin/Table.vue', desc: '路径前缀 <AdminTable />' },
    ],
  },
  composable: {
    title: 'Composables 自动导入',
    items: [
      { name: 'composables/useCart.ts', desc: '导出 useCart，全局可用' },
      { name: 'composables/useAuth.ts', desc: '导出 useAuth，全局可用' },
      { name: 'composables/useTheme.ts', desc: '导出 useTheme，全局可用' },
    ],
  },
  util: {
    title: '工具函数自动导入',
    items: [
      { name: 'utils/format.ts', desc: '导出 formatDate，全局可用' },
      { name: 'utils/validate.ts', desc: '导出 isValidEmail，全局可用' },
      { name: 'utils/helper.ts', desc: '导出 debounce，全局可用' },
    ],
  },
}

const current = computed(() => importMap[selected.value])
<\/script>

<template>
  <div class="demo-card">
    <h3>自动导入：无需手动 import</h3>

    <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;">
      <button v-for="(val, key) in importMap" :key="key"
              :class="{ active: selected === key }"
              @click="selected = key as ImportSource">
        {{ val.title }}
      </button>
    </div>

    <table style="width:100%;">
      <thead><tr><th>名称</th><th>说明</th></tr></thead>
      <tbody>
        <tr v-for="item in current.items" :key="item.name">
          <td><code>{{ item.name }}</code></td>
          <td>{{ item.desc }}</td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top:10px;padding:10px;background:#fff8f0;border-radius:6px;font-size:13px;">
      💡 自动导入的原理：Nuxt 在构建时扫描约定目录，生成 <code>.nuxt/imports.d.ts</code> 和 <code>.nuxt/components.d.ts</code> 类型声明，编辑器能正确提示且无需手动 import。
    </div>
  </div>
</template>

<style scoped>
.active { background: #e85d04; color: #fff; }
table { border-collapse: collapse; }
th, td { padding: 6px 10px; border: 1px solid #ddd; text-align: left; font-size: 13px; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
</style>
`;export{e as default};

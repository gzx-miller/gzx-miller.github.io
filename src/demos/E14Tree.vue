<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { ElInput, ElTree, ElTag, type TreeInstance, type TreeNodeData } from 'element-plus'

interface PermissionNode {
  id: number
  label: string
  children?: PermissionNode[]
}

const treeRef = ref<TreeInstance>()
const keyword = ref('')
const checkedKeys = ref<number[]>([11, 21])

const permissions: PermissionNode[] = [
  {
    id: 1,
    label: '课程管理',
    children: [
      { id: 11, label: '查看课程' },
      { id: 12, label: '编辑课程' },
      { id: 13, label: '发布课程' },
    ],
  },
  {
    id: 2,
    label: '学员管理',
    children: [
      { id: 21, label: '查看学员' },
      { id: 22, label: '导出名单' },
    ],
  },
  {
    id: 3,
    label: '系统设置',
    children: [
      { id: 31, label: '角色配置' },
      { id: 32, label: '审计日志' },
    ],
  },
]

const selectedCount = computed(() => checkedKeys.value.length)

watch(keyword, (value) => {
  treeRef.value?.filter(value)
})

function filterNode(value: string, data: TreeNodeData) {
  return !value || String(data.label).includes(value)
}

async function selectOperatorPreset() {
  checkedKeys.value = [11, 12, 21]
  await nextTick()
  treeRef.value?.setCheckedKeys(checkedKeys.value)
}

function handleCheck() {
  checkedKeys.value = treeRef.value?.getCheckedKeys(true) as number[]
}
</script>

<template>
  <div class="demo-card tree-demo">
    <div class="tree-heading">
      <div>
        <p class="demo-kicker">角色权限配置</p>
        <h3>运营专员权限</h3>
      </div>
      <ElTag type="warning">已选 {{ selectedCount }} 项</ElTag>
    </div>

    <ElInput v-model="keyword" clearable placeholder="搜索权限名称" />

    <ElTree
      ref="treeRef"
      :data="permissions"
      node-key="id"
      show-checkbox
      default-expand-all
      :default-checked-keys="checkedKeys"
      :filter-node-method="filterNode"
      @check="handleCheck"
    />

    <button @click="selectOperatorPreset">应用运营专员预设</button>
  </div>
</template>


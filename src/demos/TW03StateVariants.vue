<script setup lang="ts">
import { ref } from 'vue'
const agreed = ref(false)
const focused = ref(false)
</script>

<template>
  <div class="demo-card tw-demo">
    <div class="group-card">
      <span>小组报名</span><strong>Vue 性能工作坊</strong><button>查看名额</button>
    </div>
    <label class="peer-row"><input v-model="agreed" type="checkbox">我已阅读报名须知 <span>{{ agreed ? '✓ 可以提交' : '请先勾选' }}</span></label>
    <input class="focus-input" placeholder="聚焦查看 ring 效果" @focus="focused = true" @blur="focused = false">
    <div class="variants"><code>hover:bg-orange-700</code><code>group-hover:text-orange-700</code><code>peer-checked:visible</code><code>{{ focused ? 'focus:ring-2 ✓' : 'focus:ring-2' }}</code></div>
    <small>变体是条件前缀：交互状态、父级 group 和同级 peer 都能组合，但 DOM 关系必须满足选择器语义。</small>
  </div>
</template>

<style scoped>
.group-card{display:flex;align-items:center;gap:.7rem;padding:1rem;border-radius:.8rem;background:#fff6e8}.group-card span{font-size:.75rem;color:#98705b}.group-card button{margin-left:auto}.group-card:hover strong{color:#c24e20}.peer-row{display:flex;align-items:center;gap:.5rem;margin:.8rem 0}.peer-row span{margin-left:auto;color:#b34b22}.focus-input{width:100%;box-sizing:border-box;padding:.6rem;border:1px solid #d7aa7b;border-radius:.5rem}.focus-input:focus{outline:2px solid #e46d35;outline-offset:2px}.variants{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.8rem}.variants code{font-size:.75rem;color:#7d3b23}
</style>

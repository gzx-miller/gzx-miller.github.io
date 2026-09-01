const n=`<script setup lang="ts">
import { defineComponent, h, ref, useAttrs } from 'vue'

const SmartAction = defineComponent({
  name: 'SmartAction',
  inheritAttrs: false,
  setup(_, { slots }) {
    const attrs = useAttrs()

    return () =>
      h(
        'button',
        {
          ...attrs,
          class: ['smart-action', attrs.class],
        },
        [h('span', { 'aria-hidden': 'true' }, '🌰'), slots.default?.()],
      )
  },
})

const disabled = ref(false)
const actionCount = ref(0)
<\/script>

<template>
  <div class="demo-card attrs-demo">
    <div>
      <p class="demo-kicker">包装组件不丢能力</p>
      <h3>课程发布操作</h3>
    </div>

    <SmartAction
      class="publish-action"
      data-track="publish-course"
      aria-label="发布当前课程"
      :disabled="disabled"
      @click="actionCount += 1"
    >
      发布课程
    </SmartAction>

    <label class="toggle-row">
      <input v-model="disabled" type="checkbox" />
      禁止发布
    </label>

    <div class="attrs-result">
      <span>父组件点击事件</span>
      <strong>已触发 {{ actionCount }} 次</strong>
    </div>

    <p>
      class、disabled、aria-label、data-* 和点击事件都通过 $attrs 落到内部真实按钮。
    </p>
  </div>
</template>

<style scoped>
.attrs-demo {
  display: grid;
  gap: 14px;
}

.attrs-demo h3,
.attrs-demo p {
  margin: 0;
}

.demo-kicker {
  color: #8f2f18;
  font-size: 12px;
  font-weight: 700;
}

:deep(.smart-action) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: fit-content;
}

:deep(.publish-action) {
  background: #4b6d33;
  border-color: #4b6d33;
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #7c563f;
  font-size: 13px;
}

.toggle-row input {
  width: auto;
}

.attrs-result {
  display: flex;
  justify-content: space-between;
  border: 1px solid #efc48d;
  border-radius: 7px;
  background: #fffaf2;
  padding: 12px;
}

.attrs-result strong {
  color: #8f2f18;
}

.attrs-demo > p {
  color: #7c563f;
  font-size: 13px;
  line-height: 1.6;
}
</style>
`;export{n as default};

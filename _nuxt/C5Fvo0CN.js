const n=`<script setup lang="ts">
import { defineComponent, h } from 'vue'

const products = [
  { id: 1, name: 'Vue3 实战课', price: 129 },
  { id: 2, name: 'TypeScript 小册', price: 69 },
]

const CourseCard = defineComponent({
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () =>
      h('article', { class: 'mini-card' }, [
        h('header', [slots.header?.({ product: props.product })]),
        h('main', [slots.default?.()]),
        h('footer', [slots.footer?.({ product: props.product })]),
      ])
  },
})
<\/script>

<template>
  <div class="demo-card">
    <h3>课程套餐</h3>
    <CourseCard v-for="product in products" :key="product.id" :product="product">
      <template #header="{ product: course }">
        <strong>{{ course.name }}</strong>
        <span>具名插槽</span>
      </template>

      <p>默认插槽展示课程说明，由使用组件的一方决定。</p>

      <template #footer="{ product: course }"> ￥{{ course.price }} </template>
    </CourseCard>
  </div>
</template>
`;export{n as default};

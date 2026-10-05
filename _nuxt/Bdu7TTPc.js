const e=`<template>
  <view class="card">
    <!-- view：块级容器，替代 div -->
    <view class="head">
      <!-- image：图片，需显式设置尺寸，mode 控制裁剪等比 -->
      <image class="cover" src="/static/cover.png" mode="aspectFill" />
      <!-- text：行内文本，可嵌套、可 selectable 选中复制 -->
      <text class="name" selectable>Vue3 组合式 API 实战</text>
    </view>

    <!-- input：输入框，type 控制键盘类型 -->
    <input class="field" type="text" v-model="mobile" placeholder="输入手机号" />

    <!-- button：按钮，size / type / loading 控制形态 -->
    <button size="mini" type="primary" :loading="submitting" @tap="join">立即报名</button>
  </view>
</template>

<script>
export default {
  data() {
    return { mobile: '', submitting: false }
  },
  methods: {
    join() {
      uni.showToast({ title: '报名成功', icon: 'success' })
    },
  },
}
<\/script>`;export{e as default};

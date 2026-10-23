const n=`<script>
export default {
  data() {
    return {
      // #ifdef MP-WEIXIN
      platform: '微信小程序',
      // #endif

      // #ifdef H5
      platform: 'H5 网页',
      // #endif

      // #ifdef APP-PLUS
      platform: '原生 App',
      // #endif
    }
  },
}
<\/script>

<template>
  <view class="course">
    <text>{{ platform }}</text>

    <!-- #ifdef MP-WEIXIN -->
    <button open-type="share" @tap="onShare">分享给好友</button>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <button @tap="savePoster">保存海报到相册</button>
    <!-- #endif -->
  </view>
</template>`;export{n as default};

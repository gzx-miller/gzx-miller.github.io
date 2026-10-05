const s=`<script setup lang="ts">
import { ref } from 'vue'
const entry = ref('app.scss')
<\/script>
<template><div class="demo-card sass-demo"><label>构建入口 <select v-model="entry"><option>app.scss</option><option>admin.scss</option></select></label><div class="tree"><code>styles/</code><span>├─ abstracts/ _tokens.scss _mixins.scss</span><span>├─ components/ _button.scss _card.scss</span><span>├─ pages/ _{{ entry === 'app.scss' ? 'home' : 'admin' }}.scss</span><strong>└─ {{ entry }}</strong></div><code>@forward → 公共 API　@use → 消费模块　sass {{ entry }} dist/{{ entry.replace('.scss','.css') }}</code><small>入口文件只编排模块；库作者用 @forward 定义公共 API。构建应启用 source map、压缩与弃用警告，持续清理旧 @import。</small></div></template>
<style scoped>label{display:flex;gap:.6rem}.tree{display:grid;gap:.3rem;margin:1rem 0;padding:1rem;border-radius:.7rem;background:#2c231f;color:#ffe5c4}.tree span{padding-left:1rem}.tree strong{padding-left:1rem;color:#ffad72}.sass-demo>code{font-size:.73rem;overflow-wrap:anywhere}</style>
`;export{s as default};

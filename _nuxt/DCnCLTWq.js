const n=`<script setup lang="ts">
import { ref, computed } from 'vue'
// uni-app 页面生命周期以组合式 API 形式从 '@dcloudio/uni-app' 导入
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'

interface Course {
  id: number
  title: string
}

const courses = ref<Course[]>([])
const keyword = ref('')
const filtered = computed(() =>
  courses.value.filter((c) => c.title.includes(keyword.value))
)

// onLoad 回调参数是路由 options
onLoad((options) => {
  console.log('路由参数', options?.id)
  courses.value = [
    { id: 1, title: 'Vue3 组合式 API' },
    { id: 2, title: 'uni-app 跨端开发' },
  ]
})

onShow(() => {
  console.log('页面显示，可刷新数据')
})

onUnload(() => {
  console.log('页面销毁，清理资源')
})
<\/script>`;export{n as default};

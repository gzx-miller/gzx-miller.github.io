const n=`<script setup lang="ts">
import { computed, ref } from 'vue'

type Course = { name: string; hours: number }

const courses = ref<Course[]>([
  { name: 'Python 入门', hours: 12 },
  { name: 'Vue3 实战', hours: 20 },
  { name: '数据结构', hours: 16 },
])

const picked = ref(0)
const school = ref('小松鼠学院')
const sharedTags = ref<string[]>(['基础'])

const activeTab = ref<'instance' | 'class'>('instance')

function addHour() {
  courses.value = courses.value.map((course, index) =>
    index === picked.value ? { ...course, hours: course.hours + 1 } : course,
  )
}

function addTag() {
  sharedTags.value = [...sharedTags.value, \`标签\${sharedTags.value.length + 1}\`]
}

const hourHint = computed(() => \`已给「\${courses.value[picked.value].name}」加了 1 学时，其余课程不受影响。\`)
<\/script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>实例属性与类属性</h4>

      <div class="tab-bar">
        <button class="tab-btn" :class="{ active: activeTab === 'instance' }" @click="activeTab = 'instance'">实例属性</button>
        <button class="tab-btn" :class="{ active: activeTab === 'class' }" @click="activeTab = 'class'">类属性</button>
      </div>

      <div v-if="activeTab === 'instance'">
        <p class="hint">每个对象各自持有一份实例属性，改它只影响自己。</p>

        <pre class="mini-code">class Course:
    def __init__(self, name, hours):
        self.name = name      # 实例属性：每个对象一份
        self.hours = hours

python = Course('Python 入门', 12)
vue = Course('Vue3 实战', 20)</pre>

        <div class="tab-bar" style="margin-top: 10px;">
          <button
            v-for="(course, index) in courses"
            :key="course.name"
            class="mini-btn"
            :class="{ active: picked === index }"
            @click="picked = index"
          >
            {{ course.name }}
          </button>
        </div>

        <table style="margin-top: 12px;">
          <thead><tr><th>实例</th><th>self.name（实例属性）</th><th>self.hours（实例属性）</th></tr></thead>
          <tbody>
            <tr v-for="(course, index) in courses" :key="course.name" :class="{ dimmed: index !== picked }">
              <td><code>{{ course.name }}</code></td>
              <td>{{ course.name }}</td>
              <td>{{ course.hours }}</td>
            </tr>
          </tbody>
        </table>

        <button class="mini-btn" style="margin-top: 10px;" @click="addHour">给选中课程 +1 学时</button>
        <div class="tips-box">{{ hourHint }}</div>
      </div>

      <div v-else>
        <p class="hint">类属性属于类本身，被所有实例共享。</p>

        <pre class="mini-code">class Course:
    school = '小松鼠学院'      # 类属性：写到类体里，全体共享
    tags = []                  # 可变类属性会被所有实例共享

    def __init__(self, name):
        self.name = name</pre>

        <div class="row" style="margin-top: 10px;">
          <label>school 类属性：</label>
          <input type="text" v-model="school" />
        </div>

        <table style="margin-top: 12px;">
          <thead><tr><th>实例</th><th>访问 school</th><th>len(tags)</th></tr></thead>
          <tbody>
            <tr v-for="course in courses" :key="course.name">
              <td><code>{{ course.name }}</code></td>
              <td>{{ school }}</td>
              <td>{{ sharedTags.length }}</td>
            </tr>
          </tbody>
        </table>

        <button class="mini-btn" style="margin-top: 10px;" @click="addTag">往共享的类属性 tags 追加一项</button>
        <div class="detail-box">
          共享 tags 当前内容：<code>[{{ sharedTags.join(', ') }}]</code>
          <span class="badge warning" v-if="sharedTags.length > 1">全体实例都受影响</span>
        </div>
        <div class="tips-box">
          改 <code>school</code> 时所有实例显示一致，因为它来自类；<code>tags</code> 若是可变的类属性，
          任一实例 <code>append</code> 都会改变共享的那一份。需要每个实例独有时，应在 <code>__init__</code> 里创建它。
        </div>
      </div>
    </div>
  </div>
</template>
`;export{n as default};

const n=`<script setup lang="ts">
import { computed, ref } from 'vue'

type Line = { text: string; type: string }

const inheritSteps: Line[] = [
  { text: "Animal('动物').speak() → 「...」", type: '' },
  { text: "Dog('旺财').speak() → 先 super().speak() 得到「...」，再补上「汪汪」", type: 'success' },
  { text: "Cat('咪咪').speak() → 重写为「喵~」", type: 'success' },
  { text: "统一循环 for a in animals: a.speak() —— 同一句调用，各自响应", type: 'warning' },
  { text: "结果：... / ...汪汪 / 喵~，调用方无需知道具体类型", type: '' },
]

const activeTab = ref<'inherit' | 'magic'>('inherit')
const step = ref(0)

const revealed = computed(() => inheritSteps.slice(0, step.value))
const done = computed(() => step.value >= inheritSteps.length)

function nextStep() {
  if (step.value < inheritSteps.length) step.value += 1
}

function reset() {
  step.value = 0
}

const magicKey = ref('__str__')
const magic: Record<string, { code: string; result: string; note: string }> = {
  __str__: { code: 'print(course)', result: 'Python 入门 (12h)', note: 'str() 面向使用者，print 输出时调用。' },
  __repr__: { code: 'repr(course)', result: "Course('Python 入门', 12)", note: 'repr() 面向开发者，调试与交互式环境里使用。' },
  __len__: { code: 'len(course)', result: '12', note: '把对象当作容器，len() 取到学时数。' },
  __eq__: { code: "course == Course('Python 入门', 12)", result: 'True', note: '重写后按内容相等，而不是按是否是同一个对象。' },
}
const currentMagic = computed(() => magic[magicKey.value])
<\/script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>继承、多态与魔法方法</h4>

      <div class="tab-bar">
        <button class="tab-btn" :class="{ active: activeTab === 'inherit' }" @click="activeTab = 'inherit'">继承与多态</button>
        <button class="tab-btn" :class="{ active: activeTab === 'magic' }" @click="activeTab = 'magic'">魔法方法</button>
      </div>

      <div v-if="activeTab === 'inherit'">
        <pre class="mini-code">class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return super().speak() + "汪汪"   # 先借父类的行为，再补充

class Cat(Animal):
    def speak(self):
        return "喵~"

for a in (Animal(), Dog(), Cat()):
    print(a.speak())</pre>

        <div class="row" style="margin-top: 10px;">
          <button class="mini-btn" @click="nextStep" :disabled="done">下一步</button>
          <button class="mini-btn" @click="reset">重置</button>
          <span class="badge" :class="done ? 'success' : ''">
            {{ done ? '执行完成' : \`第 \${step} / \${inheritSteps.length} 步\` }}
          </span>
        </div>

        <div class="log-panel" style="margin-top: 10px;">
          <p v-for="(line, index) in revealed" :key="index" class="log-line" :class="line.type">{{ line.text }}</p>
          <p v-if="!revealed.length" class="hint">点击「下一步」，看同一条 <code>a.speak()</code> 如何在三个对象上表现不同。</p>
        </div>
      </div>

      <div v-else>
        <p class="hint">切换不同的魔法方法，看同一个对象在 <code>print</code> / <code>repr</code> / <code>len</code> / <code>==</code> 下的表现。</p>
        <div class="tab-bar" style="margin-top: 10px;">
          <button
            v-for="key in ['__str__', '__repr__', '__len__', '__eq__']"
            :key="key"
            class="mini-btn"
            :class="{ active: magicKey === key }"
            @click="magicKey = key"
          >
            {{ key }}
          </button>
        </div>

        <pre class="mini-code">{{ currentMagic.code }}   # → {{ currentMagic.result }}</pre>

        <div class="detail-box">
          <code>{{ currentMagic.code }}</code> 的结果是
          <span class="badge success">{{ currentMagic.result }}</span>
        </div>
        <div class="tips-box">{{ currentMagic.note }}</div>
      </div>
    </div>
  </div>
</template>
`;export{n as default};

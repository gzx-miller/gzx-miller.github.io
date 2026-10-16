<script setup lang="ts">
import { computed, ref } from 'vue'

const titleInput = ref('Python 入门')
const useDefault = ref(false)
const frozen = ref(false)

const effectiveTitle = computed(() => (useDefault.value ? '未命名' : titleInput.value.trim() || '未命名'))
const plainRepr = computed(() => `Course('${effectiveTitle.value}', 12)`)
const dataclassRepr = computed(() => `Course(title='${effectiveTitle.value}', hours=12)`)
</script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>手写类 与 @dataclass 对照</h4>

      <div class="row" style="flex-wrap: wrap;">
        <label>title 值：</label>
        <input type="text" v-model="titleInput" :disabled="useDefault" />
        <button class="mini-btn" :class="{ active: useDefault }" @click="useDefault = !useDefault">
          {{ useDefault ? '使用默认值' : '自定义值' }}
        </button>
        <button class="mini-btn" :class="{ active: frozen }" @click="frozen = !frozen">
          frozen: {{ frozen ? '开' : '关' }}
        </button>
      </div>

      <div class="grid-2" style="margin-top: 12px;">
        <div class="demo-panel">
          <h4>手写普通类</h4>
          <pre class="mini-code">class Course:
    def __init__(self, title, hours=12):
        self.title = title
        self.hours = hours

    def __repr__(self):
        return f"Course({self.title!r}, {self.hours})"</pre>
          <div class="detail-box">
            <code>repr(course)</code> → <code>{{ plainRepr }}</code>
          </div>
          <p class="hint" style="margin-top: 8px;">每个方法都得亲手写，字段一多就容易漏、容易写错。</p>
        </div>

        <div class="demo-panel">
          <h4>@dataclass 自动生成</h4>
          <pre class="mini-code">from dataclasses import dataclass

@dataclass
class Course:
    title: str = '未命名'
    hours: int = 12</pre>
          <div class="detail-box">
            <code>repr(course)</code> → <code>{{ dataclassRepr }}</code>
          </div>
          <div class="detail-box" v-if="frozen">
            <code>course.title = 'x'</code>
            <span class="badge error">FrozenInstanceError：不可变对象不能赋值</span>
          </div>
          <p class="hint" style="margin-top: 8px;">
            <code>__init__</code>、<code>__repr__</code>、<code>__eq__</code> 由装饰器自动生成，
            默认值也按字段声明写在类体里。
          </p>
        </div>
      </div>

      <div class="tips-box">
        <strong>提示：</strong>可变默认值不能直接写成 <code>tags: list = []</code>，要用
        <code>field(default_factory=list)</code>，让每个实例各自新建一份，避免共享同一个列表。
      </div>
    </div>
  </div>
</template>

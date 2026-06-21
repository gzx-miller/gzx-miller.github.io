<script setup>
import { ref, reactive } from 'vue'

const log = ref('')
const config = reactive({ maxStudents: 50, price: 299, title: 'Vue3 进阶' })

// Object.freeze：冻结整个对象
function freezeConfig() {
  const frozen = Object.freeze({ ...config })
  frozen.price = 0          // 静默失败
  frozen.newProp = 'test'   // 静默失败
  log.value = `冻结后修改 price → ${frozen.price}（未变），isFrozen：${Object.isFrozen(frozen)}`
}

// defineProperty：精确控制单个属性
function defineProp() {
  const obj = {}
  Object.defineProperty(obj, 'readOnly', {
    value: '不可修改', writable: false, enumerable: true, configurable: false,
  })
  Object.defineProperty(obj, 'hidden', {
    value: '枚举不到', enumerable: false,
  })
  obj.readOnly = '尝试修改'
  log.value = `readOnly：${obj.readOnly}，keys：[${Object.keys(obj)}]（hidden 不在其中）`
}

// getter/setter
function getterSetter() {
  const course = {
    _price: 299,
    get price() { return `¥${this._price}` },
    set price(v) { this._price = Math.max(0, v) },
  }
  course.price = -100
  log.value = `设置 -100 后被拦截 → ${course.price}（最低为 ¥0）`
}
</script>

<template><div class="demo-card">
  <div class="button-row">
    <button @click="freezeConfig">冻结配置</button>
    <button @click="defineProp">定义属性</button>
    <button @click="getterSetter">访问器属性</button>
  </div>
  <p>{{ log || '点击按钮查看结果' }}</p>
  <small>Object.freeze/seal 控制对象可变性；defineProperty 精确描述属性的读写、枚举、配置能力。</small>
</div></template>

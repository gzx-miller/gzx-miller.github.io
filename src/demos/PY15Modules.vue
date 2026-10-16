<script setup lang="ts">
import { computed, ref } from 'vue'

type StyleKey = 'import' | 'from' | 'as' | 'relative'

const styles: Array<{ key: StyleKey; label: string; code: string; binds: string; output: string }> = [
  {
    key: 'import',
    label: 'import 模块',
    code: 'import math\nprint(math.sqrt(16))\nprint(math.pi)',
    binds: '名字 math 绑定到整个模块对象，用 math.xxx 取成员',
    output: '4.0\n3.141592653589793',
  },
  {
    key: 'from',
    label: 'from 模块 import 名字',
    code: 'from math import sqrt\nprint(sqrt(16))    # 直接用，不必带模块前缀',
    binds: '名字 sqrt 直接绑定到那个函数，模块名不进命名空间',
    output: '4.0',
  },
  {
    key: 'as',
    label: 'import 模块 as 别名',
    code: 'import math as m\nprint(m.sqrt(16))\nimport numpy as np   # 社区惯例简写',
    binds: '名字 m 绑定到同一个模块，长模块名可缩成短别名',
    output: '4.0',
  },
  {
    key: 'relative',
    label: '相对导入',
    code: 'from .utils import slugify\nfrom ..models import User   # 上一级包',
    binds: '点号数量表示向上跨越几层包，只能在包内部使用',
    output: '仅在包内运行时有效',
  },
]

const picked = ref(0)
const current = computed(() => styles[picked.value])

const tree = `myapp/
├── __init__.py          # 有它才是包（包内可留空）
├── main.py              # python -m myapp.main 入口
├── utils/
│   ├── __init__.py      # 可在此写 __all__ = ["slugify"]
│   └── slugify.py
└── models/
    ├── __init__.py
    └── user.py`
</script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>导入方式对照与包的目录结构</h4>

      <p class="hint">点下面的按钮切换四种导入写法，看代码、绑定结果与输出的差别。</p>
      <div class="tab-bar" style="margin-top: 10px;">
        <button
          v-for="(item, index) in styles"
          :key="item.key"
          class="mini-btn"
          :class="{ active: picked === index }"
          @click="picked = index"
        >
          {{ item.label }}
        </button>
      </div>

      <pre class="mini-code">{{ current.code }}</pre>
      <div class="detail-box">
        <strong>输出：</strong>
        <pre class="mini-code" style="margin-top: 6px;">{{ current.output }}</pre>
      </div>
      <div class="tips-box">{{ current.binds }}</div>

      <h4 style="margin-top: 16px;">包的目录结构</h4>
      <pre class="mini-code">{{ tree }}</pre>
      <div class="tips-box">
        目录里有 <code>__init__.py</code>，这个文件夹才被当作<strong>包</strong>；<code>from .utils import slugify</code> 里的
        <code>.</code> 指当前包，<code>..</code> 指上一层包，因此相对导入只能在包内部使用。
      </div>
    </div>
  </div>
</template>

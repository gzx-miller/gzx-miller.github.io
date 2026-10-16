<script setup lang="ts">
import { computed, ref } from 'vue'

type Platform = 'windows' | 'unix'

const platform = ref<Platform>('windows')
const step = ref(0)

const baseSteps = [
  { title: '创建虚拟环境', win: 'python -m venv .venv', unix: 'python3 -m venv .venv', note: '在项目目录里生成 .venv，独立于系统 Python' },
  { title: '激活虚拟环境', win: '.venv\\Scripts\\activate', unix: 'source .venv/bin/activate', note: '激活后命令行提示符前会出现 (.venv)' },
  { title: '安装依赖', win: 'pip install requests', unix: 'pip install requests', note: '此时 pip 指向虚拟环境，只影响本项目' },
  { title: '冻结依赖清单', win: 'pip freeze > requirements.txt', unix: 'pip freeze > requirements.txt', note: '把当前实际版本写进清单，便于他人复现' },
  { title: '退出虚拟环境', win: 'deactivate', unix: 'deactivate', note: '回到系统环境，依赖不受影响' },
]

const steps = computed(() => baseSteps.map(item => ({
  ...item,
  command: platform.value === 'windows' ? item.win : item.unix,
})))

const current = computed(() => steps.value[step.value])

function next() {
  if (step.value < steps.value.length - 1) step.value += 1
}

function prev() {
  if (step.value > 0) step.value -= 1
}

const requirements = `# requirements.txt —— pip freeze 生成的精确版本
requests==2.31.0
flask==3.0.0
urllib3==2.1.0`

const pyproject = `# pyproject.toml —— 声明意图与版本范围
[project]
name = "myapp"
dependencies = [
  "requests>=2.31",
  "flask~=3.0",
]

[project.optional-dependencies]
dev = ["pytest>=8"]`
</script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>虚拟环境流程与依赖清单对照</h4>

      <div class="row">
        <label>平台：</label>
        <select v-model="platform">
          <option value="windows">Windows</option>
          <option value="unix">macOS / Linux</option>
        </select>
        <button class="mini-btn" @click="prev" :disabled="step === 0">上一步</button>
        <button class="mini-btn" @click="next" :disabled="step === steps.length - 1">下一步</button>
      </div>

      <div class="tab-bar" style="margin-top: 12px;">
        <span
          v-for="(item, index) in steps"
          :key="item.title"
          class="badge"
          :class="index === step ? 'success' : ''"
        >{{ index + 1 }}. {{ item.title }}</span>
      </div>

      <div class="log-panel">
        <p class="log-line success">当前步骤：{{ current.title }}</p>
        <p class="log-line"><code>$ {{ current.command }}</code></p>
        <p class="log-line">{{ current.note }}</p>
      </div>
      <div class="tips-box">
        激活前 <code>pip</code> 装的是系统 Python，激活后同一个命令才装进 <code>.venv</code>。换平台只需改激活命令，其余步骤一致。
      </div>

      <h4 style="margin-top: 16px;">依赖清单：requirements.txt 与 pyproject.toml</h4>
      <div class="grid-2">
        <pre class="mini-code">{{ requirements }}</pre>
        <pre class="mini-code">{{ pyproject }}</pre>
      </div>
      <div class="tips-box">
        <code>requirements.txt</code> 记的是<strong>冻结后的精确版本</strong>（可复现），<code>pyproject.toml</code> 写的是<strong>允许的版本范围</strong>（更灵活）；二者常配合使用。
      </div>
    </div>
  </div>
</template>

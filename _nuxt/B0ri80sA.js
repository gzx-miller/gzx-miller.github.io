const t=`<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElButton, ElStep, ElSteps } from 'element-plus'

const activeStep = ref(0)
const steps = ['提交报名', '资料审核', '确认名额', '开始学习']

const currentStatus = computed(() =>
  activeStep.value === steps.length ? '报名流程已完成' : \`当前：\${steps[activeStep.value]}\`,
)

function nextStep() {
  activeStep.value = Math.min(activeStep.value + 1, steps.length)
}

function resetSteps() {
  activeStep.value = 0
}
<\/script>

<template>
  <div class="demo-card steps-demo">
    <div>
      <p class="demo-kicker">报名状态追踪</p>
      <h3>训练营入学流程</h3>
    </div>

    <ElSteps :active="activeStep" finish-status="success" align-center>
      <ElStep v-for="step in steps" :key="step" :title="step" />
    </ElSteps>

    <div class="step-status">{{ currentStatus }}</div>

    <div class="button-row">
      <ElButton type="primary" :disabled="activeStep === steps.length" @click="nextStep">
        推进下一步
      </ElButton>
      <ElButton @click="resetSteps">重新开始</ElButton>
    </div>
  </div>
</template>

`;export{t as default};

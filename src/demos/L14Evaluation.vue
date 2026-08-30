<script setup lang="ts">
import { computed, ref } from 'vue'

interface EvalCase {
  question: string
  answer: string
  criteria: { name: string; description: string; autoScore: number }[]
}

const cases: EvalCase[] = [
  {
    question: 'Vue3 的 ref 和 reactive 有什么区别？',
    answer: 'ref 适合基本类型，需要 .value 访问；reactive 适合对象类型，可直接访问属性。ref 在模板中自动解包，reactive 不能替换整个对象。',
    criteria: [
      { name: '相关性', description: '回答是否与问题直接相关', autoScore: 0.95 },
      { name: '准确性', description: '技术描述是否正确', autoScore: 0.90 },
      { name: '完整性', description: '是否覆盖关键要点', autoScore: 0.75 },
    ],
  },
  {
    question: '如何用 Pinia 替换 Vuex？',
    answer: 'Pinia 去除了 mutations，直接在 actions 中修改状态。每个 Store 独立定义，不需要嵌套模块。',
    criteria: [
      { name: '相关性', description: '回答是否与问题直接相关', autoScore: 0.90 },
      { name: '准确性', description: '技术描述是否正确', autoScore: 0.85 },
      { name: '完整性', description: '是否覆盖关键要点', autoScore: 0.55 },
    ],
  },
]

const activeCase = ref(0)
const currentCase = computed(() => cases[activeCase.value])

// 用户评分
const userScores = ref<Record<string, number>>({})

function setUserScore(criteriaName: string, score: number) {
  userScores.value[criteriaName] = score
}

function getScoreColor(score: number): string {
  if (score >= 0.8) return '#6b9e78'
  if (score >= 0.6) return '#d4a574'
  return '#c8503c'
}

const evalCode = `// LLM-as-Judge 评估模式
import { ChatOpenAI } from '@langchain/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { z } from 'zod'

const evaluator = ChatOpenAI({ modelName: 'gpt-4o-mini' })

const evalSchema = z.object({
  relevance: z.number().min(0).max(1),
  accuracy: z.number().min(0).max(1),
  completeness: z.number().min(0).max(1),
  reasoning: z.string(),
})

const parser = StructuredOutputParser.fromZodSchema(evalSchema)

// 评估提示词
const evalPrompt = \`评估以下回答的质量：
问题：{question}
回答：{answer}

请从相关性、准确性和完整性三个维度打分。
{format_instructions}\``
</script>

<template>
  <div class="demo-card">
    <h3>输出质量评估</h3>

    <div class="case-tabs">
      <button v-for="(_, i) in cases" :key="i" :class="{ active: activeCase === i }" @click="activeCase = i; userScores = {}">
        内容 {{ i + 1 }}
      </button>
    </div>

    <div class="eval-layout">
      <div class="qa-panel">
        <div class="question-box">
          <span class="label">问题</span>
          <p>{{ currentCase.question }}</p>
        </div>
        <div class="answer-box">
          <span class="label">LLM 回答</span>
          <p>{{ currentCase.answer }}</p>
        </div>
      </div>

      <div class="eval-panel">
        <h4>评估维度</h4>
        <div v-for="criteria in currentCase.criteria" :key="criteria.name" class="criteria-item">
          <div class="criteria-header">
            <strong>{{ criteria.name }}</strong>
            <span class="criteria-desc">{{ criteria.description }}</span>
          </div>
          <div class="score-row">
            <div class="auto-score">
              <span class="score-label">自动评分</span>
              <span class="score-value" :style="{ color: getScoreColor(criteria.autoScore) }">{{ (criteria.autoScore * 100).toFixed(0) }}%</span>
            </div>
            <div class="user-score">
              <span class="score-label">人工评分</span>
              <div class="score-buttons">
                <button v-for="s in [0.2, 0.4, 0.6, 0.8, 1.0]" :key="s" class="score-btn" :class="{ selected: userScores[criteria.name] === s }" @click="setUserScore(criteria.name, s)">
                  {{ (s * 100).toFixed(0) }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="code-section">
      <h4>LLM-as-Judge 评估代码</h4>
      <pre class="code-block">{{ evalCode }}</pre>
    </div>
  </div>
</template>

<style scoped>
.case-tabs { display: flex; gap: 8px; margin-bottom: 12px; }
.case-tabs button { padding: 6px 14px; border: 1px solid #d4a574; border-radius: 4px; background: #fef9f3; cursor: pointer; font-size: 13px; }
.case-tabs button.active { background: #c8703c; color: #fff; border-color: #c8703c; }
.eval-layout { display: flex; gap: 16px; margin-bottom: 12px; }
.qa-panel { flex: 1; }
.question-box, .answer-box { padding: 12px; border-radius: 6px; margin-bottom: 8px; }
.question-box { background: #fde8d0; border-left: 3px solid #c8703c; }
.answer-box { background: #f0f7f2; border-left: 3px solid #6b9e78; }
.label { font-size: 11px; font-weight: bold; color: #8b5e3c; text-transform: uppercase; }
.question-box p, .answer-box p { margin: 4px 0 0; font-size: 13px; line-height: 1.6; color: #5a3e2b; }
.eval-panel { flex: 1; background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 12px; }
.eval-panel h4 { margin: 0 0 10px; color: #8b5e3c; font-size: 14px; }
.criteria-item { margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f5ebe0; }
.criteria-header { margin-bottom: 6px; }
.criteria-header strong { font-size: 13px; color: #5a3e2b; }
.criteria-desc { font-size: 11px; color: #a0623a; margin-left: 6px; }
.score-row { display: flex; gap: 16px; align-items: center; }
.auto-score, .user-score { display: flex; align-items: center; gap: 6px; }
.score-label { font-size: 11px; color: #8b5e3c; }
.score-value { font-size: 16px; font-weight: bold; }
.score-buttons { display: flex; gap: 4px; }
.score-btn { width: 32px; height: 24px; border: 1px solid #d4a574; border-radius: 3px; background: #fff; cursor: pointer; font-size: 11px; color: #5a3e2b; }
.score-btn.selected { background: #c8703c; color: #fff; border-color: #c8703c; }
.code-section { background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 12px; }
.code-section h4 { margin: 0 0 8px; color: #8b5e3c; font-size: 14px; }
.code-block { margin: 0; font-size: 12px; line-height: 1.6; white-space: pre-wrap; color: #5a3e2b; }
</style>

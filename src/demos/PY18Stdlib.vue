<script setup lang="ts">
import { computed, ref } from 'vue'

const activeTab = ref<'datetime' | 're' | 'json'>('datetime')

// ── datetime ─────────────────────────────────────
const dateInput = ref('2024-06-01 08:30')
const fmt = ref('strftime')

function parseDate(text: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?$/.exec(text.trim())
  if (!m) return null
  const [, y, mo, d, h = '0', mi = '0'] = m
  return new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi))
}

const weekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']

const dt = computed(() => {
  const base = parseDate(dateInput.value)
  if (!base) return null
  const plus7 = new Date(base.getTime() + 7 * 24 * 3600 * 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  const fmtOut = (x: Date, style: string) =>
    style === 'strftime'
      ? `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`
      : `${x.getFullYear()}年${pad(x.getMonth() + 1)}月${pad(x.getDate())}日 ${pad(x.getHours())}:${pad(x.getMinutes())}`
  return {
    parsed: `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())} ${pad(base.getHours())}:${pad(base.getMinutes())}`,
    weekday: weekdays[(base.getDay() + 6) % 7],
    plus7: fmtOut(plus7, fmt.value),
    formatted: fmtOut(base, fmt.value),
  }
})

// ── re ───────────────────────────────────────────
const sampleText = '联系 alice@example.com 或 bob@test.com，电话 13800138000'
const patterns = [
  { label: '\\d+', note: '匹配连续数字', group: false },
  { label: '([\\w.]+)@([\\w.]+)', note: '捕获用户名与域名两个分组', group: true },
  { label: '\\s+', note: '匹配空白字符', group: false },
]
const patternKey = ref(0)

const matches = computed(() => {
  const p = patterns[patternKey.value]
  try {
    const re = new RegExp(p.label, 'g')
    return [...sampleText.matchAll(re)].slice(0, 8).map(m => ({ full: m[0], groups: m.slice(1) }))
  } catch {
    return []
  }
})

const subResult = computed(() => {
  try {
    const re = new RegExp(patterns[patternKey.value].label, 'g')
    return sampleText.replace(re, '『』')
  } catch {
    return sampleText
  }
})

// ── json ─────────────────────────────────────────
const ensureAscii = ref(true)
const indent2 = ref(true)

const payload = { name: '小松鼠', skills: ['python', 'vue'], age: 3 }

function escapeNonAscii(text: string): string {
  return text.replace(/[^\x00-\x7F]/g, ch => '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0'))
}

const rawJson = computed(() => JSON.stringify(payload, null, indent2.value ? 2 : 0))
const dumped = computed(() => (ensureAscii.value ? escapeNonAscii(rawJson.value) : rawJson.value))
const loadsBack = computed(() => JSON.stringify(JSON.parse(rawJson.value)))
</script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>日期时间、正则与 JSON</h4>

      <div class="tab-bar">
        <button class="tab-btn" :class="{ active: activeTab === 'datetime' }" @click="activeTab = 'datetime'">datetime</button>
        <button class="tab-btn" :class="{ active: activeTab === 're' }" @click="activeTab = 're'">re</button>
        <button class="tab-btn" :class="{ active: activeTab === 'json' }" @click="activeTab = 'json'">json</button>
      </div>

      <div v-if="activeTab === 'datetime'">
        <div class="row">
          <input type="text" v-model="dateInput" style="flex: 1;" />
          <select v-model="fmt">
            <option value="strftime">%Y-%m-%d</option>
            <option value="cn">%Y年%m月%d日 %H:%M</option>
          </select>
        </div>
        <div v-if="dt" class="detail-box" style="margin-top: 12px;">
          <p><code>strptime(输入)</code> → <code>{{ dt.parsed }}</code></p>
          <p><code>strftime({{ fmt }})</code> → <code>{{ dt.formatted }}</code></p>
          <p><code>日期.weekday</code> → {{ dt.weekday }}</p>
          <p><code>(日期 + timedelta(days=7))</code> → <code>{{ dt.plus7 }}</code></p>
        </div>
        <div v-else class="tips-box">输入格式应形如 <code>2024-06-01 08:30</code>。</div>
      </div>

      <div v-else-if="activeTab === 're'">
        <p class="hint">选择正则，观察在同一段文本上的匹配与替换。</p>
        <div class="tab-bar" style="margin-top: 10px;">
          <button
            v-for="(p, index) in patterns"
            :key="p.label"
            class="mini-btn"
            :class="{ active: patternKey === index }"
            @click="patternKey = index"
          >re.{{ p.group ? 'match' : 'findall' }}(r'{{ p.label }}')</button>
        </div>
        <pre class="mini-code">文本 = {{ sampleText }}</pre>
        <table style="margin-top: 12px;">
          <thead><tr><th>匹配到</th><th v-if="patterns[patternKey].group">分组</th></tr></thead>
          <tbody>
            <tr v-for="(m, i) in matches" :key="i">
              <td><code>{{ m.full }}</code></td>
              <td v-if="patterns[patternKey].group"><code>{{ m.groups.join(' | ') }}</code></td>
            </tr>
            <tr v-if="matches.length === 0"><td colspan="2" class="hint">没有匹配</td></tr>
          </tbody>
        </table>
        <div class="tips-box">
          <code>{{ patterns[patternKey].note }}</code>；用 <code>re.sub</code> 替换后得到：<code>{{ subResult }}</code>
        </div>
      </div>

      <div v-else>
        <div class="row">
          <button class="mini-btn" :class="{ active: ensureAscii }" @click="ensureAscii = !ensureAscii">ensure_ascii: {{ ensureAscii }}</button>
          <button class="mini-btn" :class="{ active: indent2 }" @click="indent2 = !indent2">indent: {{ indent2 ? 2 : 'None' }}</button>
        </div>
        <pre class="mini-code" style="margin-top: 12px;">json.dumps(obj) →
{{ dumped }}</pre>
        <div class="tips-box">
          <code>loads()</code> 把字符串还原为对象：<code>{{ loadsBack }}</code>。中文在 <code>ensure_ascii=False</code> 时保持原样，为 <code>True</code> 时被转义成 <code>\uXXXX</code>。
        </div>
      </div>
    </div>
  </div>
</template>

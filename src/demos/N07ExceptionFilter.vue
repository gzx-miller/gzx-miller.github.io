<script setup lang="ts">
import { ref } from 'vue'

type ExceptionKind = 'not-found' | 'bad-request' | 'internal'

const activeKind = ref<ExceptionKind>('not-found')

const exceptions: Record<ExceptionKind, { label: string; thrown: string; status: number; message: string }> = {
  'not-found': {
    label: 'NotFoundException',
    thrown: "throw new NotFoundException('课程 42 不存在')",
    status: 404,
    message: '课程 42 不存在',
  },
  'bad-request': {
    label: 'BadRequestException',
    thrown: "throw new BadRequestException(['年龄不能小于 18', '邮箱格式不正确'])",
    status: 400,
    message: '年龄不能小于 18',
  },
  internal: {
    label: '未知异常（兜底）',
    thrown: "throw new Error('数据库连接超时')",
    status: 500,
    message: 'Internal server error',
  },
}

const responseJson = ref('')

function trigger() {
  const item = exceptions[activeKind.value]
  const messages = item.label === 'bad-request' ? ['年龄不能小于 18', '邮箱格式不正确'] : [item.message]
  responseJson.value = JSON.stringify(
    {
      code: item.status,
      message: messages.length === 1 ? messages[0] : messages,
      path: '/courses/42',
      timestamp: new Date().toISOString(),
    },
    null,
    2,
  )
}
</script>

<template>
  <div class="demo-card">
    <h3>🌰 统一异常响应 · ExceptionFilter</h3>
    <p style="color: var(--muted); margin-bottom: 12px">
      业务代码抛出语义化异常，全局过滤器统一转换为 JSON 响应：
    </p>

    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px">
      <button
        v-for="(item, key) in exceptions"
        :key="key"
        class="tab-btn"
        :class="{ active: activeKind === key }"
        @click="activeKind = key; responseJson = ''"
      >
        {{ item.label }}（{{ item.status }}）
      </button>
    </div>

    <p class="thrown-line"><code>{{ exceptions[activeKind].thrown }}</code></p>

    <div style="display: flex; gap: 8px; margin-bottom: 10px">
      <button class="tab-btn active" @click="trigger">触发异常 → 查看统一响应</button>
    </div>

    <pre v-if="responseJson" class="code-block"><code>{{ responseJson }}</code></pre>

    <table>
      <thead>
        <tr><th>异常类型</th><th>HTTP 状态</th><th>过滤器处理</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><code>NotFoundException</code></td><td>404</td><td>读取 getStatus() 与 message</td>
        </tr>
        <tr>
          <td><code>BadRequestException</code></td><td>400</td><td>message 可为错误数组（校验场景）</td>
        </tr>
        <tr>
          <td><code>Error</code>（未包装）</td><td>500</td><td>兜底为 Internal server error</td>
        </tr>
      </tbody>
    </table>

    <p class="note">
      <strong>@Catch()：</strong>空参数捕获所有异常；<code>@Catch(HttpException)</code> 只捕获 HTTP 异常。
      业务层只抛语义异常，格式统一交给过滤器。
    </p>
  </div>
</template>

<style scoped>
.thrown-line {
  padding: 8px 12px;
  border-radius: 10px;
  background: var(--surface-soft);
  font-size: 13px;
  color: var(--text);
  margin: 0 0 12px;
  word-break: break-all;
}

.note {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--muted);
}
</style>

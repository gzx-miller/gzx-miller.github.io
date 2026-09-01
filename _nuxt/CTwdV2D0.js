const n=`<script setup lang="ts">
import { ref } from 'vue'

const username = ref('squirrel')
const password = ref('')
const token = ref('')
const userInfo = ref('')
const authMessage = ref('')
const guardLog = ref<string[]>([])

// 模拟 JWT：header.payload.signature 三段，payload 用 base64 编码（真实场景为 HMAC 签名）
function fakeSign(payload: Record<string, unknown>) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + 60_000 }))
  const sig = btoa(\`sig:\${JSON.stringify(payload)}\`) // 仅演示，真实为签名算法
  return \`\${header}.\${body}.\${sig}\`
}

function login() {
  if (!username.value.trim()) {
    authMessage.value = '登录失败：用户名不能为空'
    token.value = ''
    return
  }
  token.value = fakeSign({ sub: '42', name: username.value, role: 'student' })
  userInfo.value = ''
  authMessage.value = \`登录成功，已签发 JWT（有效期 60 秒）\`
  guardLog.value = []
}

function parsePayload(jwt: string) {
  try {
    const body = jwt.split('.')[1] ?? ''
    return JSON.parse(atob(body))
  } catch {
    return null
  }
}

function accessProfile() {
  guardLog.value = []
  if (!token.value) {
    guardLog.value.push('❌ JwtAuthGuard：未找到 Authorization 头 → 401 Unauthorized')
    authMessage.value = '401 Unauthorized：缺少访问凭证'
    userInfo.value = ''
    return
  }
  const [header = '', body = ''] = token.value.split('.')
  const payload = parsePayload(token.value)
  if (!payload || Date.now() > payload.exp) {
    guardLog.value.push('❌ JwtAuthGuard：验签/过期校验失败 → 401 Unauthorized')
    authMessage.value = '401 Unauthorized：凭证无效或已过期'
    userInfo.value = ''
    return
  }
  guardLog.value.push(\`✅ 提取到 token（header=\${header.slice(0, 12)}…）\`)
  guardLog.value.push(\`✅ verifyAsync 验签通过，解析 payload：\${JSON.stringify(payload)}\`)
  guardLog.value.push(\`✅ request.user = \${JSON.stringify(payload)} → 请求放行\`)
  userInfo.value = JSON.stringify(payload, null, 2)
  authMessage.value = '200 OK：已进入受保护接口 /auth/profile'
}

function logout() {
  token.value = ''
  userInfo.value = ''
  authMessage.value = '已退出登录，token 已清除'
  guardLog.value = []
}
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 登录签发 JWT · JwtAuthGuard 校验链路</h3>
    <p style="color: var(--muted); margin-bottom: 12px">
      演示 <code>POST /auth/login</code> 签发 token，再访问受保护接口 <code>GET /auth/profile</code> 时守卫的校验过程：
    </p>

    <div class="login-box">
      <div class="login-row">
        <label>用户名
          <input v-model="username" type="text" placeholder="student" />
        </label>
        <label>密码
          <input v-model="password" type="password" placeholder="任意密码（演示用）" />
        </label>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap">
        <button class="tab-btn active" @click="login">登录（签发 JWT）</button>
        <button class="tab-btn" @click="accessProfile">访问 /auth/profile</button>
        <button class="tab-btn" @click="logout">退出</button>
      </div>
    </div>

    <p v-if="authMessage" class="auth-msg" :class="{ ok: authMessage.startsWith('200') || authMessage.startsWith('登录成功') }">
      {{ authMessage }}
    </p>

    <div v-if="token" class="token-box">
      <p class="token-label">Authorization: Bearer <code>{{ token }}</code></p>
    </div>

    <div v-if="guardLog.length" class="guard-log">
      <p v-for="(log, i) in guardLog" :key="i" class="guard-line">{{ log }}</p>
    </div>

    <pre v-if="userInfo" class="code-block"><code>{{ userInfo }}</code></pre>

    <p class="note">
      <strong>守卫位置：</strong>中间件之后、管道之前。返回 <code>true</code> 放行；
      抛 <code>UnauthorizedException</code> 返回 401。
    </p>
  </div>
</template>

<style scoped>
.login-box {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg);
}

.login-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.login-row label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
}

.login-row input {
  padding: 7px 10px;
  border-radius: 8px;
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 13px;
}

.login-row input:focus {
  outline: none;
  border-color: var(--accent);
}

.auth-msg {
  margin: 12px 0 0;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  background: color-mix(in srgb, var(--leaf-red) 10%, var(--bg));
  color: var(--leaf-red);
}

.auth-msg.ok {
  background: color-mix(in srgb, var(--forest) 10%, var(--bg));
  color: var(--forest);
}

.token-box {
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 10px;
  background: var(--surface-soft);
  font-size: 12px;
  color: var(--muted);
  word-break: break-all;
}

.token-label code {
  color: var(--accent-strong);
}

.guard-log {
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px dashed var(--border);
  font-size: 13px;
}

.guard-line {
  margin: 4px 0;
  color: var(--text);
}

.note {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--muted);
}
</style>
`;export{n as default};

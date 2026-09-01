const e=`<script setup lang="ts">
import { ref } from 'vue'

const methods = [
  { method: 'GET', desc: '读取数据', cache: '可缓存', color: '#65a30d' },
  { method: 'POST', desc: '创建数据', cache: '不缓存', color: '#0891b2' },
  { method: 'PUT', desc: '更新数据', cache: '不缓存', color: '#d97706' },
  { method: 'DELETE', desc: '删除数据', cache: '不缓存', color: '#e85d04' },
  { method: 'PATCH', desc: '部分更新', cache: '不缓存', color: '#ca8a04' },
]

const codeExample = \`<span style="color:#8a8a3a">// app/api/users/route.ts</span>
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

<span style="color:#7c7c99">// GET /api/users</span>
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  const users = await db.user.findMany({
    where: q ? { name: { contains: q } } : {}
  })
  return NextResponse.json(users)
}

<span style="color:#7c7c99">// POST /api/users</span>
export async function POST(request: Request) {
  const body = await request.json()
  const user = await db.user.create({ data: body })
  return NextResponse.json(user, { status: 201 })
}

<span style="color:#8a8a3a">// app/api/users/[id]/route.ts</span>
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await db.user.findUnique({ where: { id: params.id } })
  if (!user) return NextResponse.json({ error: '未找到' }, { status: 404 })
  return NextResponse.json(user)
}\`

const features = [
  '文件名固定为 route.ts / route.js',
  '每个导出的 HTTP 方法对应一个处理函数',
  '运行在 Node.js 或 Edge Runtime',
  '可配合缓存：export const dynamic / revalidate',
  '适合做 Webhook、第三方 API 代理',
]
<\/script>

<template>
  <div class="demo-card">
    <h3>Route Handlers：API 路由</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>HTTP 方法映射</h4>
        <table>
          <thead><tr><th>方法</th><th>用途</th><th>缓存</th></tr></thead>
          <tbody>
            <tr v-for="m in methods" :key="m.method">
              <td><span class="method-tag" :style="{ background: m.color }">{{ m.method }}</span></td>
              <td>{{ m.desc }}</td>
              <td><small>{{ m.cache }}</small></td>
            </tr>
          </tbody>
        </table>

        <h4 style="margin-top:12px;">核心特性</h4>
        <ul>
          <li v-for="(f, i) in features" :key="i"><small>{{ f }}</small></li>
        </ul>
      </div>

      <div style="flex:1;">
        <h4>代码示例</h4>
        <pre class="mini-code" v-html="codeExample"></pre>
        <div class="detail-box">
          <p><strong>路径：</strong>app/api/users/route.ts → /api/users</p>
          <p><strong>动态：</strong>app/api/users/[id]/route.ts → /api/users/:id</p>
          <p><strong>区别：</strong>Server Action 是表单提交，Route Handler 是 REST API。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.detail-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.method-tag { color: #fff; padding: 2px 8px; border-radius: 3px; font-size: 11px; font-weight: bold; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 5px 8px; border: 1px solid #ddd; text-align: left; }
th { background: #fff3e0; }
small { color: #8a6d42; }
ul { font-size: 12px; padding-left: 16px; }
</style>
`;export{e as default};

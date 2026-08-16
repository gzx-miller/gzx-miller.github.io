<script setup lang="ts">
import { computed, ref } from 'vue'

interface RouteInfo {
  method: string
  path: string
  signature: string
  params: { name: string; from: string; transform: string }[]
  example: string
  returns: string
}

const routes: RouteInfo[] = [
  {
    method: 'GET',
    path: '/courses?tag=vue3',
    signature: 'findAll(@Query(\'tag\') tag?: string)',
    params: [
      { name: 'tag', from: '@Query', transform: '可选查询参数，值为 vue3' },
    ],
    example: 'GET /courses?tag=vue3',
    returns: 'Course[] —— 按标签过滤后的课程列表',
  },
  {
    method: 'GET',
    path: '/courses/:id',
    signature: 'findOne(@Param(\'id\', ParseIntPipe) id: number)',
    params: [
      { name: 'id', from: '@Param', transform: '路径参数，ParseIntPipe 将 \'42\' 转为 number 42' },
    ],
    example: 'GET /courses/42',
    returns: 'Course —— 单个课程；不存在则抛 NotFoundException',
  },
  {
    method: 'POST',
    path: '/courses',
    signature: 'create(@Body() dto: CreateCourseDto)',
    params: [
      { name: 'body', from: '@Body', transform: '请求体 JSON，自动绑定到 DTO' },
    ],
    example: 'POST /courses  { "title": "NestJS 实战", "capacity": 30 }',
    returns: 'Course —— 创建后的课程（含自增 id）',
  },
  {
    method: 'PATCH',
    path: '/courses/:id',
    signature: 'update(@Param(\'id\') id: string, @Body() dto: UpdateCourseDto)',
    params: [
      { name: 'id', from: '@Param', transform: '路径参数（字符串）' },
      { name: 'body', from: '@Body', transform: '部分字段更新，DTO 字段全部可选' },
    ],
    example: 'PATCH /courses/42  { "capacity": 50 }',
    returns: 'Course —— 更新后的课程',
  },
  {
    method: 'DELETE',
    path: '/courses/:id',
    signature: 'remove(@Param(\'id\') id: string)',
    params: [
      { name: 'id', from: '@Param', transform: '路径参数（字符串）' },
    ],
    example: 'DELETE /courses/42',
    returns: 'void —— 删除成功返回 200/204',
  },
]

const activeIndex = ref(0)
const active = computed(() => routes[activeIndex.value]!)
</script>

<template>
  <div class="demo-card">
    <h3>🌰 课程 API 路由表</h3>
    <p style="color: var(--muted); margin-bottom: 12px">
      选择一个路由，查看它匹配的处理器签名、参数装饰器与返回结果：
    </p>

    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px">
      <button
        v-for="(route, i) in routes"
        :key="route.path"
        class="tab-btn"
        :class="{ active: i === activeIndex }"
        @click="activeIndex = i"
      >
        <span class="method-badge" :class="route.method.toLowerCase()">{{ route.method }}</span>
        {{ route.path.split('?')[0] }}
      </button>
    </div>

    <div class="route-card">
      <p class="route-line"><span class="method-badge" :class="active.method.toLowerCase()">{{ active.method }}</span> <code>{{ active.example }}</code></p>
      <table>
        <tbody>
          <tr>
            <th>处理器</th>
            <td><code>{{ active.signature }}</code></td>
          </tr>
          <tr v-for="param in active.params" :key="param.name">
            <th>{{ param.name }}</th>
            <td><code>{{ param.from }}</code> · {{ param.transform }}</td>
          </tr>
          <tr>
            <th>返回</th>
            <td>{{ active.returns }}</td>
          </tr>
        </tbody>
      </table>
      <p class="route-tip">
        <strong>绑定规则：</strong>路径参数用 <code>@Param</code>，查询字符串用 <code>@Query</code>，
        请求体用 <code>@Body</code> —— 控制器只做参数绑定，业务逻辑交给 Service。
      </p>
    </div>
  </div>
</template>

<style scoped>
.route-card {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg);
}

.route-line {
  margin: 0 0 10px;
  font-size: 13px;
}

.method-badge {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}

.method-badge.get { background: var(--forest); }
.method-badge.post { background: var(--leaf-orange); }
.method-badge.patch { background: var(--leaf-gold); color: var(--chestnut); }
.method-badge.delete { background: var(--leaf-red); }

.route-tip {
  margin: 10px 0 0;
  padding-top: 10px;
  border-top: 1px dashed var(--border);
  font-size: 13px;
  color: var(--muted);
}

.route-tip strong {
  color: var(--accent-strong);
}
</style>

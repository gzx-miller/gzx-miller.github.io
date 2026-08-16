<script setup lang="ts">
import { ref } from 'vue'

type ModuleId = 'app' | 'course' | 'database' | 'user'

const activeModule = ref<ModuleId>('app')

const modules: Record<ModuleId, { name: string; desc: string; imports: string[]; controllers: string[]; providers: string[]; exports: string[] }> = {
  app: {
    name: 'AppModule（根模块）',
    desc: '应用装配入口：引入业务模块并注册全局控制器与服务。',
    imports: ['CourseModule', 'UserModule'],
    controllers: ['AppController'],
    providers: ['AppService'],
    exports: [],
  },
  course: {
    name: 'CourseModule（课程模块）',
    desc: '课程业务边界：路由、服务与数据访问聚合在同一个模块内。',
    imports: ['DatabaseModule'],
    controllers: ['CourseController'],
    providers: ['CourseService'],
    exports: ['CourseService'],
  },
  database: {
    name: 'DatabaseModule（数据库模块）',
    desc: '全局数据层：连接池与仓储被导出，供所有业务模块复用。',
    imports: [],
    controllers: [],
    providers: ['DatabaseConnection', 'CourseRepository'],
    exports: ['DatabaseConnection', 'CourseRepository'],
  },
  user: {
    name: 'UserModule（用户模块）',
    desc: '用户与鉴权：imports CourseModule 后可直接注入其导出的服务。',
    imports: ['CourseModule'],
    controllers: ['UserController'],
    providers: ['UserService'],
    exports: [],
  },
}

const injectDemo = [
  { line: '// 构造器注入：Nest 从 DI 容器中解析 CourseRepository 并自动注入', kind: 'comment' },
  { line: '@Injectable()', kind: 'decorator' },
  { line: 'export class CourseService {', kind: 'keyword' },
  { line: "  constructor(private readonly courseRepo: CourseRepository) {}", kind: 'code' },
  { line: '', kind: 'blank' },
  { line: '  findAll() {', kind: 'code' },
  { line: "    return this.courseRepo.find()", kind: 'code' },
  { line: '  }', kind: 'code' },
  { line: '}', kind: 'keyword' },
]
</script>

<template>
  <div class="demo-card">
    <h3>🌰 模块装配与依赖注入</h3>
    <p style="color: var(--muted); margin-bottom: 12px">
      点击下方模块，查看它的 <code>imports / controllers / providers / exports</code> 四张清单：
    </p>

    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px">
      <button
        v-for="(item, key) in modules"
        :key="key"
        class="tab-btn"
        :class="{ active: activeModule === key }"
        @click="activeModule = key"
      >
        {{ item.name }}
      </button>
    </div>

    <div class="module-card">
      <p class="module-desc">{{ modules[activeModule].desc }}</p>
      <table>
        <tbody>
          <tr>
            <th>imports</th>
            <td>
              <span v-if="modules[activeModule].imports.length === 0" class="muted-text">—</span>
              <code v-for="item in modules[activeModule].imports" :key="item" class="chip">{{ item }}</code>
            </td>
          </tr>
          <tr>
            <th>controllers</th>
            <td>
              <span v-if="modules[activeModule].controllers.length === 0" class="muted-text">—</span>
              <code v-for="item in modules[activeModule].controllers" :key="item" class="chip">{{ item }}</code>
            </td>
          </tr>
          <tr>
            <th>providers</th>
            <td>
              <span v-if="modules[activeModule].providers.length === 0" class="muted-text">—</span>
              <code v-for="item in modules[activeModule].providers" :key="item" class="chip">{{ item }}</code>
            </td>
          </tr>
          <tr>
            <th>exports</th>
            <td>
              <span v-if="modules[activeModule].exports.length === 0" class="muted-text">—（不对外暴露）</span>
              <code v-for="item in modules[activeModule].exports" :key="item" class="chip chip-export">{{ item }}</code>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="module-tip">
        <strong>关键点：</strong>
        {{ activeModule === 'app' ? '根模块不做业务，只负责组装。' : activeModule === 'course' ? 'CourseService 既在本模块可用，又被导出供 UserModule 注入。' : activeModule === 'database' ? '数据层导出仓储，业务模块 imports 后即可注入，无需重复配置连接。' : 'UserModule imports CourseModule 后，就能把 CourseService 注入到 UserService。' }}
      </p>
    </div>

    <h4 style="margin: 16px 0 8px">🔧 依赖注入的本质：构造器注入</h4>
    <pre class="code-block"><code><span
      v-for="(line, i) in injectDemo"
      :key="i"
      :class="line.kind"
    >{{ line.line }}{{ i < injectDemo.length - 1 ? '\n' : '' }}</span></code></pre>
  </div>
</template>

<style scoped>
.module-card {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg);
}

.module-desc {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--text);
}

.muted-text {
  color: var(--muted);
  font-size: 13px;
}

.chip {
  display: inline-block;
  margin: 2px 4px 2px 0;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  background: var(--surface-soft);
  color: var(--text);
}

.chip-export {
  background: color-mix(in srgb, var(--leaf-gold) 30%, transparent);
  color: var(--accent-strong);
}

.module-tip {
  margin: 10px 0 0;
  padding-top: 10px;
  border-top: 1px dashed var(--border);
  font-size: 13px;
  color: var(--muted);
}

.module-tip strong {
  color: var(--accent-strong);
}

:deep(.decorator) { color: var(--leaf-red); }
:deep(.keyword) { color: var(--accent-strong); font-weight: 600; }
:deep(.comment) { color: var(--muted); }
</style>

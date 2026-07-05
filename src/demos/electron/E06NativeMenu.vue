<script setup lang="ts">
import { ref } from 'vue'

const menuItems = ref([
  { label: '文件', submenu: ['新建', '打开', '保存', '---', '退出'] },
  { label: '编辑', submenu: ['撤销', '重做', '---', '复制', '粘贴'] },
  { label: '视图', submenu: ['刷新', '全屏', '开发者工具'] },
  { label: '帮助', submenu: ['关于'] }
])

const selectedItem = ref('')

function selectItem(item: string) {
  if (item === '---') return
  selectedItem.value = item
}
</script>

<template>
  <div class="demo-container">
    <h2>🌰 原生菜单</h2>
    <p class="desc">使用 Menu 和 MenuItem 构建跨平台原生菜单，掌握 role 系统和快捷键。</p>

    <div class="menu-demo">
      <div class="menu-bar">
        <div v-for="menu in menuItems" :key="menu.label" class="menu-item">
          <span class="menu-label">{{ menu.label }}</span>
          <div class="submenu">
            <div v-for="(item, idx) in menu.submenu" :key="idx" class="submenu-item" :class="{ separator: item === '---' }" @click="selectItem(item)">
              <template v-if="item !== '---'">{{ item }}</template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="result" v-if="selectedItem">
      点击了: {{ selectedItem }}
    </div>

    <div class="code-block">
      <h3>Menu 代码示例</h3>
      <pre>
const menu = Menu.buildFromTemplate([
  {
    label: '文件',
    submenu: [
      { label: '新建', accelerator: 'CmdOrCtrl+N', role: 'newWindow' },
      { label: '保存', accelerator: 'CmdOrCtrl+S', click: () => save() },
      { type: 'separator' },
      { label: '退出', accelerator: 'CmdOrCtrl+Q', role: 'quit' }
    ]
  },
  {
    label: '编辑',
    submenu: [
      { role: 'undo' },  // 自动本地化为"撤销"
      { role: 'redo' },
      { type: 'separator' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  }
])
Menu.setApplicationMenu(menu)</pre>
    </div>

    <div class="tips">
      <h3>关键要点</h3>
      <ul>
        <li><strong>role</strong> 属性会自动本地化并绑定标准行为，优先使用</li>
        <li><strong>accelerator</strong> 使用跨平台格式：CmdOrCtrl、Alt、Shift、Plus</li>
        <li><strong>macOS</strong> 菜单栏与应用绑定，Windows/Linux 与窗口绑定</li>
        <li><strong>上下文菜单</strong> 使用 Menu.popup() 在右键时显示</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo-container { padding: 24px; max-width: 900px; margin: 0 auto; }
.desc { color: #666; margin-bottom: 20px; }
.menu-demo { margin-bottom: 20px; }
.menu-bar { display: flex; background: #f5f5f5; padding: 8px; border-radius: 8px; gap: 4px; }
.menu-item { position: relative; padding: 8px 16px; cursor: pointer; border-radius: 4px; }
.menu-item:hover { background: #e0e0e0; }
.menu-label { font-size: 14px; }
.submenu { display: none; position: absolute; top: 100%; left: 0; background: white; border: 1px solid #ddd; border-radius: 8px; min-width: 200px; padding: 8px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 100; }
.menu-item:hover .submenu { display: block; }
.submenu-item { padding: 8px 16px; font-size: 13px; cursor: pointer; }
.submenu-item:hover { background: #f5f5f5; }
.submenu-item.separator { height: 1px; background: #e0e0e0; padding: 0; margin: 4px 0; }
.result { background: #e8f5e9; padding: 12px; border-radius: 8px; margin-bottom: 20px; }
.code-block { background: #f9f9f9; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
.code-block pre { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; }
.tips { background: #fff3e0; padding: 20px; border-radius: 12px; }
.tips ul { margin: 0; padding-left: 20px; }
.tips li { margin-bottom: 8px; line-height: 1.6; }
</style>

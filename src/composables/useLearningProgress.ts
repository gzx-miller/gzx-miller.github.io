import { getCurrentInstance, onMounted, ref } from 'vue'

/**
 * 本地学习进度：记录用户已浏览过的课程路径，供首页分类卡片展示
 * 「已探索 X / 共 Y」。仅依赖 localStorage，纯客户端，SSG 无副作用。
 */
const STORAGE_KEY = 'learning-progress-v1'

const visitedPaths = ref<Set<string>>(new Set())

let loaded = false

function load() {
  if (typeof window === 'undefined' || loaded) return
  loaded = true
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      visitedPaths.value = new Set(JSON.parse(raw) as string[])
    }
  } catch {
    // 忽略异常：存储不可用时静默降级为无进度
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...visitedPaths.value]))
  } catch {
    // 忽略写失败（隐私模式 / 存储已满）
  }
}

export function useLearningProgress() {
  // 在组件实例内挂载时预载进度；测试或非组件场景下由首次读写惰性触发
  if (getCurrentInstance()) {
    onMounted(load)
  }

  /** 标记某课程路径为已探索 */
  function markVisited(path: string) {
    if (!path) return
    load()
    if (visitedPaths.value.has(path)) return
    visitedPaths.value.add(path)
    persist()
  }

  /** 某课程是否已探索 */
  function isVisited(path: string): boolean {
    load()
    return visitedPaths.value.has(path)
  }

  /** 当前已探索的课程数量 */
  function visitedCount(): number {
    load()
    return visitedPaths.value.size
  }

  return { visitedPaths, markVisited, isVisited, visitedCount }
}
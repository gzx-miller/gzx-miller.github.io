export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme-preference'

function getSystemPreference(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredPreference(): Theme | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEY) as Theme | null
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', theme)
}

// 模块级守卫：确保客户端监听只注册一次
let clientInitialized = false

export function useTheme() {
  // 服务端无 localStorage，默认 light；客户端挂载后会同步真实偏好
  const theme = useState<Theme>('theme', () => 'light')

  function setTheme(newTheme: Theme) {
    theme.value = newTheme
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, newTheme)
      applyTheme(newTheme)
    }
  }

  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  const isDark = computed(() => theme.value === 'dark')

  // 客户端挂载后：用真实偏好（localStorage / 系统偏好）同步状态并应用
  if (import.meta.client && !clientInitialized) {
    clientInitialized = true

    onMounted(() => {
      const stored = getStoredPreference()
      const realTheme = stored ?? getSystemPreference()
      theme.value = realTheme
      applyTheme(realTheme)
    })

    applyTheme(theme.value)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      if (!getStoredPreference()) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    })
  }

  return { theme, isDark, setTheme, toggleTheme }
}

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

export function useTheme() {
  const theme = useState<Theme>('theme', () => {
    return getStoredPreference() ?? getSystemPreference()
  })

  function setTheme(newTheme: Theme) {
    theme.value = newTheme
    localStorage.setItem(STORAGE_KEY, newTheme)
    applyTheme(newTheme)
  }

  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  const isDark = computed(() => theme.value === 'dark')

  // 初始化 & 监听系统主题变化
  if (import.meta.client) {
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

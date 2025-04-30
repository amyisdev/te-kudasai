import { createContext, useContext, useEffect, useState } from 'react'

type ColorScheme = 'neutral' | 'pastel' | 'pink'
type ThemeMode = 'light' | 'dark' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultColorScheme?: ColorScheme
  defaultThemeMode?: ThemeMode
}

type ThemeProviderState = {
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
  themeMode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void
}

const initialState: ThemeProviderState = {
  colorScheme: 'neutral',
  setColorScheme: () => null,
  themeMode: 'system',
  setThemeMode: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultColorScheme = 'neutral',
  defaultThemeMode = 'system',
  ...props
}: ThemeProviderProps) {
  const getInitial = () => {
    const colorScheme = (localStorage.getItem('color-scheme') as ColorScheme | null) || defaultColorScheme
    const themeMode = (localStorage.getItem('theme-mode') as ThemeMode | null) || defaultThemeMode
    return { colorScheme, themeMode }
  }

  const initial = getInitial()
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(initial.colorScheme)
  const [themeMode, setThemeModeState] = useState<ThemeMode>(initial.themeMode)

  // Persist both values
  useEffect(() => {
    localStorage.setItem('color-scheme', colorScheme)
    localStorage.setItem('theme-mode', themeMode)
  }, [colorScheme, themeMode])

  // HTML class logic
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark', 'theme-pastel', 'theme-neutral', 'theme-pink')
    root.classList.add(`theme-${colorScheme}`)

    let mode: 'light' | 'dark' = 'light'
    if (themeMode === 'system') {
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      mode = themeMode
    }
    root.classList.add(mode)

    // Listen for system changes if in system mode
    let mql: MediaQueryList | null = null
    const handle = (e: MediaQueryListEvent) => {
      if (themeMode === 'system') {
        root.classList.remove('light', 'dark')
        root.classList.add(e.matches ? 'dark' : 'light')
      }
    }

    if (themeMode === 'system') {
      mql = window.matchMedia('(prefers-color-scheme: dark)')
      mql.addEventListener('change', handle)
    }

    return () => {
      if (mql) mql.removeEventListener('change', handle)
    }
  }, [colorScheme, themeMode])

  const value = {
    colorScheme,
    setColorScheme: (scheme: ColorScheme) => setColorSchemeState(scheme),
    themeMode,
    setThemeMode: (mode: ThemeMode) => setThemeModeState(mode),
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}

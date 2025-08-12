'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'istampit-theme'
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(defaultTheme === 'dark' ? 'dark' : 'light')
  const [mounted, setMounted] = useState(false)

  // Initialize theme from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey) as Theme
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        setTheme(stored)
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error)
    }
    setMounted(true)
  }, [storageKey])

  // Update resolvedTheme when theme changes
  useEffect(() => {
    if (!mounted) return

    const updateResolvedTheme = () => {
      let resolved: 'light' | 'dark' = 'light'

      if (theme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      } else {
        resolved = theme
      }

      setResolvedTheme(resolved)

      // Update DOM
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(resolved)

      // Update meta theme-color
      const metaTheme = document.querySelector('meta[name="theme-color"]')
      if (metaTheme) {
        metaTheme.setAttribute('content', resolved === 'dark' ? '#020617' : '#f8fafc')
      }
    }

    updateResolvedTheme()

    // Listen for system theme changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', updateResolvedTheme)
      return () => mediaQuery.removeEventListener('change', updateResolvedTheme)
    }
  }, [theme, mounted])

  // Save theme to localStorage
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    try {
      localStorage.setItem(storageKey, newTheme)
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
        resolvedTheme,
        mounted
      }}
    >
      <div data-theme-ready={mounted ? 'true' : 'false'} className={!mounted ? 'opacity-0 transition-opacity duration-150' : 'opacity-100'}>
        {children}
      </div>
      {!mounted && (
        <script
          // inline hydration-safe script to sync initial theme ASAP
          dangerouslySetInnerHTML={{
            __html: `(() => {try {const key='${storageKey}';const stored=localStorage.getItem(key);const sys=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';const t = (stored&&['light','dark'].includes(stored)?stored:stored==='system'?sys:'${defaultTheme}'==='system'?sys:'${defaultTheme}');document.documentElement.classList.add(t==='dark'?'dark':'light');} catch(e) {}})();`
          }}
        />
      )}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Theme toggle hook with animations
export const useThemeToggle = () => {
  const { theme, setTheme, resolvedTheme, mounted } = useTheme()

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light'

    // Add transition animation
    document.documentElement.style.setProperty('view-transition-name', 'theme-transition')

    // Cast document to an extended type to safely access optional API
    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => void
    }

    if (typeof doc.startViewTransition === 'function') {
      // Use View Transitions API if supported
      doc.startViewTransition(() => {
        setTheme(newTheme)
      })
    } else {
      // Fallback animation
      document.documentElement.style.transition = 'all 0.3s ease'
      setTheme(newTheme)
      setTimeout(() => {
        document.documentElement.style.transition = ''
      }, 300)
    }
  }

  const setSystemTheme = () => setTheme('system')

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️'
      case 'dark':
        return '🌙'
      case 'system':
        return '💻'
      default:
        return '☀️'
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light Theme'
      case 'dark':
        return 'Dark Theme'
      case 'system':
        return 'System Theme'
      default:
        return 'Light Theme'
    }
  }

  return {
    theme,
    resolvedTheme,
    toggleTheme,
    setTheme,
    setSystemTheme,
    getThemeIcon,
    getThemeLabel,
    mounted
  }
}

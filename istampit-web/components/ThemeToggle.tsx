'use client'

import React from 'react'
import { useThemeToggle } from './ThemeProvider'

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function ThemeToggle({
  variant = 'button',
  size = 'md',
  showLabel = false,
  className = ''
}: ThemeToggleProps) {
  const { theme, resolvedTheme, toggleTheme, setTheme, getThemeIcon, getThemeLabel } = useThemeToggle()

  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-2.5',
    lg: 'p-3 text-lg'
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative group ${className}`}>
        <button
          className={`${sizeClasses[size]} rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
          title={getThemeLabel()}
          aria-label="Toggle theme"
        >
          <span className="text-lg">{getThemeIcon()}</span>
          {showLabel && <span className="ml-2 text-sm font-medium">{getThemeLabel()}</span>}
        </button>

        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-medium border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-1">
            <button
              onClick={() => setTheme('light')}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                theme === 'light'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-3">☀️</span>
              Light Theme
              {theme === 'light' && <span className="ml-auto text-primary-500">✓</span>}
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-3">🌙</span>
              Dark Theme
              {theme === 'dark' && <span className="ml-auto text-primary-500">✓</span>}
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                theme === 'system'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-3">💻</span>
              System Theme
              {theme === 'system' && <span className="ml-auto text-primary-500">✓</span>}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className={`${sizeClasses[size]} rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${className}`}
      title={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} theme`}
      aria-label="Toggle theme"
    >
      <span className="flex items-center">
        <span className="text-lg">{resolvedTheme === 'light' ? '🌙' : '☀️'}</span>
        {showLabel && (
          <span className="ml-2 text-sm font-medium">
            {resolvedTheme === 'light' ? 'Dark' : 'Light'}
          </span>
        )}
      </span>
    </button>
  )
}

// Animated theme toggle with smooth transitions
export function AnimatedThemeToggle({ className = '', size = 'md' }: { className?: string, size?: 'sm' | 'md' | 'lg' }) {
  const { resolvedTheme, toggleTheme } = useThemeToggle()

  const sizeClasses = {
    sm: 'w-12 h-6',
    md: 'w-14 h-7',
    lg: 'w-16 h-8'
  }

  const thumbSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  }

  return (
    <button
      onClick={toggleTheme}
      className={`${sizeClasses[size]} relative inline-flex items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
        resolvedTheme === 'dark'
          ? 'bg-gray-700'
          : 'bg-gray-200'
      } ${className}`}
      aria-label="Toggle theme"
      title={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} theme`}
    >
      <span
        className={`${thumbSizes[size]} transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out flex items-center justify-center ${
          resolvedTheme === 'dark'
            ? size === 'sm' ? 'translate-x-6' : size === 'md' ? 'translate-x-7' : 'translate-x-8'
            : 'translate-x-0.5'
        }`}
      >
        <span className="text-xs">
          {resolvedTheme === 'light' ? '☀️' : '🌙'}
        </span>
      </span>
    </button>
  )
}

export default ThemeToggle

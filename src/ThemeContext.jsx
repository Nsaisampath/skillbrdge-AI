import { createContext, useState, useEffect, useContext } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // Load from localStorage or default to true (dark mode)
    const saved = localStorage.getItem('theme')
    return saved ? JSON.parse(saved) : true
  })

  useEffect(() => {
    // Save to localStorage whenever theme changes
    localStorage.setItem('theme', JSON.stringify(isDark))
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

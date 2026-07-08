import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'customer-app-theme'

function getInitialTheme(): ThemeMode {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

function Header() {
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  function handleThemeToggle() {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <header className="app-header">
      <h1 className="app-title">Customer Manager</h1>
      <nav className="app-nav" aria-label="Main navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? 'app-nav-link app-nav-link-active' : 'app-nav-link'
          }
        >
          Customers
        </NavLink>
        <NavLink
          to="/add"
          className={({ isActive }) =>
            isActive ? 'app-nav-link app-nav-link-active' : 'app-nav-link'
          }
        >
          Add Customer
        </NavLink>
        <button
          type="button"
          className="app-nav-link app-theme-toggle"
          onClick={handleThemeToggle}
          aria-label="Toggle dark mode"
          aria-pressed={theme === 'dark'}
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </nav>
    </header>
  )
}

export default Header

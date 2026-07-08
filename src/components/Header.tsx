import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

// Supported theme modes for the UI toggle.
type ThemeMode = 'light' | 'dark'

// localStorage key used to persist the selected theme.
const THEME_STORAGE_KEY = 'customer-app-theme'

// Determines the initial theme on load.
// Priority:
// 1) saved localStorage preference
// 2) system dark-mode preference
// 3) fallback to light mode
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

// App header containing title, navigation links, and theme toggle.
function Header() {
  // Theme state initialized once from persisted/system preference.
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme())

  // Applies theme to the root element and persists it whenever it changes.
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  // Switches between light and dark modes.
  function handleThemeToggle() {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  // Render header title, route navigation, and theme toggle control.
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

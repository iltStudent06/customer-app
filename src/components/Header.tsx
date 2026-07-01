import { NavLink } from 'react-router-dom'

function Header() {
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
      </nav>
    </header>
  )
}

export default Header

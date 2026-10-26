import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

const navItems = [
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
];

export function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <p className="panel-label">Admin</p>
        <nav className="admin-sidebar__nav" aria-label="Admin sections">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? 'admin-nav-link admin-nav-link--active' : 'admin-nav-link'}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <span className="admin-sidebar__user" title={user?.email}>{user?.name}</span>
          <NavLink className="admin-nav-link" to="/">← Back to POS</NavLink>
          <button className="admin-nav-link admin-sidebar__logout" type="button" onClick={logout}>Log out</button>
        </div>
      </aside>
      <div className="admin-content"><Outlet /></div>
    </div>
  );
}

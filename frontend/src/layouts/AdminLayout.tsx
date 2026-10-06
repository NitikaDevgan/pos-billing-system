import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/products', label: 'Products' },
];

export function AdminLayout() {
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
        <NavLink className="admin-nav-link admin-sidebar__back" to="/">← Back to POS</NavLink>
      </aside>
      <div className="admin-content"><Outlet /></div>
    </div>
  );
}

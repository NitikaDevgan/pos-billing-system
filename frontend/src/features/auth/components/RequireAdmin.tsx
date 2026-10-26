import type { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Button } from '../../../components/Button/Button';
import { useAuth } from '../AuthContext';

/**
 * Hides admin screens from anyone who isn't a logged-in admin.
 * This is a UX guard only — the backend enforces the same rule on every write.
 */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { status, user, logout } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <p className="auth-status">Checking access…</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (user.role !== 'ADMIN') {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <p className="panel-label">Access denied</p>
          <h1>Admins only</h1>
          <p>You're signed in as {user.email}, which doesn't have permission to manage the menu.</p>
          <div className="admin-form__actions">
            <Link className="button button--secondary" to="/">Back to POS</Link>
            <Button onClick={logout}>Sign in as admin</Button>
          </div>
        </div>
      </section>
    );
  }
  return children;
}

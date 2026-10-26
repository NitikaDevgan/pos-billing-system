import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Button/Button';
import { Input } from '../../../components/Input/Input';
import { getErrorMessage } from '../../../services/apiClient';
import { useAuth } from '../AuthContext';

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  if (user?.role === 'ADMIN') return <Navigate to={redirectTo} replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password) return setError('Enter your email and password.');
    setIsSubmitting(true);
    setError(undefined);
    try {
      const loggedInUser = await login({ email: email.trim(), password });
      navigate(loggedInUser.role === 'ADMIN' ? redirectTo : '/', { replace: true });
    } catch (loginError) {
      setError(getErrorMessage(loginError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card admin-form" onSubmit={handleSubmit} noValidate>
        <div>
          <p className="panel-label">Admin</p>
          <h1>Sign in</h1>
        </div>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <Input label="Email" type="email" autoComplete="username" autoFocus value={email} onChange={(event) => setEmail(event.target.value)} />
        <Input label="Password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <div className="admin-form__actions">
          <Link className="button button--secondary" to="/">Back to POS</Link>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</Button>
        </div>
      </form>
    </section>
  );
}

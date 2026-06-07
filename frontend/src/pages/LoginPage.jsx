import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../contexts/AuthContext.jsx';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function LoginPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');

    if (mode === 'signup' && form.password !== form.confirmPassword) {
      setStatus('Passwords do not match.');
      return;
    }

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      await api.post(endpoint, {
        email: form.email,
        password: form.password,
        fullName: form.fullName,
      });
      await refreshUser();
      navigate('/');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to authenticate.');
    }
  };

  return (
    <section className="login-page">
      <div className="login-panel auth-panel">
        <div className="auth-header">
          <div>
            <p className="eyebrow">QuirkWrite</p>
            <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
            <p className="subtext">Sign in to manage your blog studio or create a new editor account.</p>
          </div>
          <div className="auth-switch">
            <button
              className={`button small ${mode === 'login' ? 'primary' : 'secondary'}`}
              type="button"
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              className={`button small ${mode === 'signup' ? 'primary' : 'secondary'}`}
              type="button"
              onClick={() => setMode('signup')}
            >
              Sign up
            </button>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label>
              Full name
              <input
                required
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </label>
          )}

          <label>
            Email address
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              required
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter a secure password"
            />
          </label>

          {mode === 'signup' && (
            <label>
              Confirm password
              <input
                required
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
              />
            </label>
          )}

          <button type="submit" className="button primary auth-submit">
            {mode === 'login' ? 'Login' : 'Create account'}
          </button>

          {status && <div className="form-status">{status}</div>}
        </form>

        <div className="divider">or</div>

        <button className="button secondary google-button" onClick={() => (window.location.href = '/api/auth/google')}>
          Continue with Google
        </button>

        <p className="auth-note">Your account is protected with secure authentication for safe blog management.</p>
      </div>
    </section>
  );
}

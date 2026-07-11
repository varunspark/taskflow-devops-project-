import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', fullName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.username, form.email, form.password, form.fullName);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>TaskFlow</h1>
        <p className="subtitle">Create your account</p>

        {error && <div className="error-banner">{error}</div>}

        <label>Full Name</label>
        <input value={form.fullName} onChange={update('fullName')} />

        <label>Username</label>
        <input value={form.username} onChange={update('username')} required minLength={3} />

        <label>Email</label>
        <input type="email" value={form.email} onChange={update('email')} required />

        <label>Password</label>
        <input type="password" value={form.password} onChange={update('password')} required minLength={6} />

        <button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>

        <p className="switch-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}

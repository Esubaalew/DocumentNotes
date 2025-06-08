import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const API_URL = 'http://localhost:5105'; // Backend API URL

function Login({ onLoginSuccess }) {
  const { addToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(data?.message || 'Login failed. Please check your credentials.');
      }
      
      // Create user object with username
      const userData = { username };
      
      // Notify successful login
      addToast('Login successful! Welcome back.', 'success');
      
      onLoginSuccess(data.token, userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="login-header">
          <img src="/document-notes-icon.svg" alt="DocumentMind Logo" className="logo-login" style={{ width: '50px', height: 'auto' }} />
          <h1>DocumentMind</h1>
          <p>Smart Document Notes</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Welcome Back!</h2>
          <p className="subtitle">Please login to access your notes.</p>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>
          <button type="submit" className="button button-primary button-full-width" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
        <p className="footer-text">Don't have an account? Contact support.</p>
      </div>
    </div>
  );
}

export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosConfig from '../api/axiosConfig';
import { BookOpen, LogIn } from 'lucide-react';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosConfig.post('/auth/login', {
        username,
        password
      });
      const tokenString = response.data;
      
      if (tokenString) {
        localStorage.setItem('token', typeof tokenString === 'string' ? tokenString : JSON.stringify(tokenString));
        localStorage.setItem('user', JSON.stringify({ username }));
        navigate('/');
      } else {
        setError('Login failed: Invalid credentials');
      }

    } catch (err) {
      setError(err?.response?.data || 'An error occurred during login. Check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card animate-fade-in card">
        <div className="login-header">
          <div className="login-icon">
            <BookOpen size={40} />
          </div>
          <h2>Welcome to EduMana</h2>
          <p className="text-muted">Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="login-error btn-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label className="input-label" htmlFor="username">Username</label>
            <input 
              id="username"
              type="text" 
              className="input-field" 
              placeholder="admin / user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary login-btn mt-md"
            disabled={loading}
          >
            {loading ? 'Signing in...' : (
              <>
                <span>Sign In</span>
                <LogIn size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

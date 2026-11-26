
import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert('Please enter both username and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await API.post('token/', {
        username: username.trim(),
        password: password,
      });

      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);

      window.dispatchEvent(new Event('authChanged'));

      const profileResponse = await API.get('accounts/profile/');
      const role = profileResponse.data.role;

      alert('Login successful!');

      if (role === 'ORGANIZATION') {
        navigate('/organization-dashboard');
      } else if (role === 'VOLUNTEER') {
        navigate('/volunteer-dashboard');
      } else {
        navigate('/member-dashboard');
      }

    } catch (error) {
      console.error(error.response?.data);

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      alert('Login failed. Please try again.');

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      {/* Left Side */}
      <div className="login-visual">
        <div className="login-visual-overlay"></div>

        <div className="login-visual-content">
          {/* <div className="login-brand">
            ♥ Community Connect
          </div> */}

          <div className="login-welcome">
            <h1>Together, We Can Make a Difference.</h1>

            <p>
              Every helping hand matters.
              Connect with people, share kindness
              and build a stronger community.
            </p>

            <div className="login-quote">
              "Alone we can do so little;
              together we can do so much."
            </div>
          </div>

          <div className="login-visual-footer">
  <span className="footer-heart">♥</span> Small acts. Big impact.
</div>
        </div>
      </div>

      {/* Right Side */}
      <div className="login-form-side">
        <div className="login-form-container">

          <div className="login-mobile-brand">
            ♥ Community Connect
          </div>

          <span className="login-subtitle">WELCOME BACK</span>

          <h2>Sign In</h2>

          <p className="login-description">
            We're happy to have you back!
            Please enter your details.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="login-field">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                minLength="4"
                required
              />
            </div>

            <div className="login-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login to Your Account →'}
            </button>

          </form>

          <div className="login-register">
            Don't have an account?
            <Link to="/register"> Create Account</Link>
          </div>

          <div className="login-bottom-text">
            Made with ♥ for a better community
          </div>

        </div>
      </div>

    </div>
  );
}

export default Login;

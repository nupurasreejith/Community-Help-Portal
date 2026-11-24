
import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

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

    // Fetch logged-in user's profile
    const profileResponse = await API.get('accounts/profile/');
    const role = profileResponse.data.role;

    alert('Login successful!');

    // Redirect based on account role
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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow p-4">

            <h2 className="text-center text-success mb-4">
              Welcome Back!
            </h2>

            <form onSubmit={handleSubmit}>

              {/* Username */}
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  minLength="4"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;


import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import './Register.css';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'MEMBER',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Password and Confirm Password do not match!');
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        username: formData.username.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        password: formData.password,
      };

      const response = await API.post(
        'accounts/register/',
        registrationData
      );

      console.log(response.data);

      alert('Registration successful! You can now login.');
      navigate('/login');

    } catch (error) {
      console.error(error.response?.data);

      alert(
        JSON.stringify(
          error.response?.data || 'Registration failed. Please try again.'
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page register-page">

      {/* Left Side */}
      <div className="login-visual">
        <div className="login-visual-overlay"></div>

        <div className="login-visual-content">
          <div className="login-brand">
            ♥ Community Connect
          </div>

          <div className="login-welcome">
            <h1>Be a Part of Something Beautiful.</h1>

            <p>
              Join a community that believes in kindness,
              compassion and helping one another.
              Together, we can create meaningful change.
            </p>

            <div className="login-quote">
              "The smallest act of kindness is worth more
              than the grandest intention."
            </div>
          </div>

          <div className="login-visual-footer">
            <span className="footer-heart">♥</span> Small acts. Big impact.
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="login-form-side register-form-side">

        <div className="register-form-container">

          <div className="register-mobile-brand">
            ♥ Community Connect
          </div>

          <span className="login-subtitle">JOIN OUR COMMUNITY</span>

          <h2>Create Account</h2>

          <p className="login-description">
            Start your journey with Community Connect.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="register-field">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                minLength="4"
                maxLength="20"
                pattern="[A-Za-z0-9_]{4,20}"
                title="Username must contain 4-20 letters, numbers or underscores."
                placeholder="Enter username"
                required
              />
            </div>

            <div className="register-name-row">
              <div className="register-field">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  pattern="[A-Za-z]+([ '-][A-Za-z]+)*"
                  title="Enter a valid first name."
                  placeholder="First name"
                  required
                />
              </div>

              <div className="register-field">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  pattern="[A-Za-z]+([ '-][A-Za-z]+)*"
                  title="Enter a valid last name."
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div className="register-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="register-field">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="[6-9][0-9]{9}"
                maxLength="10"
                title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9."
                placeholder="Enter 10-digit mobile number"
                required
              />
            </div>

            <div className="register-field">
              <label>Account Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="MEMBER">Community Member</option>
                <option value="VOLUNTEER">Volunteer</option>
                <option value="ORGANIZATION">Organization</option>
              </select>
            </div>

            <div className="register-field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength="8"
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}"
                title="Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
                placeholder="Create a password"
                required
              />
              <small>
                8+ characters with uppercase, lowercase, number and special character.
              </small>
            </div>

            <div className="register-field">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength="8"
                placeholder="Re-enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Create My Account →'}
            </button>

          </form>

          <div className="login-register">
            Already have an account?
            <Link to="/login"> Login</Link>
          </div>

          <div className="login-bottom-text">
            Made with ♥ for a better community
          </div>

        </div>
      </div>

    </div>
  );
}

export default Register;

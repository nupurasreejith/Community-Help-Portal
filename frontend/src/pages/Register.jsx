
import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">

            <h2 className="text-center text-success mb-4">
              Create Your Account
            </h2>

            <form onSubmit={handleSubmit}>

              {/* Username */}
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
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

              {/* First Name and Last Name */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    className="form-control"
                    value={formData.first_name}
                    onChange={handleChange}
                    pattern="[A-Za-z]+([ '-][A-Za-z]+)*"
                    title="Enter a valid first name."
                    placeholder="First name"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    className="form-control"
                    value={formData.last_name}
                    onChange={handleChange}
                    pattern="[A-Za-z]+([ '-][A-Za-z]+)*"
                    title="Enter a valid last name."
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="[6-9][0-9]{9}"
                  maxLength="10"
                  title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9."
                  placeholder="Enter 10-digit mobile number"
                  required
                />
              </div>

              {/* Account Type */}
              <div className="mb-3">
                <label className="form-label">Account Type</label>
                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="MEMBER">Community Member</option>
                  <option value="VOLUNTEER">Volunteer</option>
                  <option value="ORGANIZATION">Organization</option>
                </select>
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="8"
                  pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}"
                  title="Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
                  placeholder="Create a password"
                  required
                />
                <small className="text-muted">
                  Minimum 8 characters with uppercase, lowercase, number and special character.
                </small>
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength="8"
                  placeholder="Re-enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

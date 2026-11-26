
import React, { useState } from 'react';
import API from '../services/api';
import './CreateHelpRequest.css';

function CreateRequest() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'FOOD',
    location: '',
  });

  const [message, setMessage] = useState('');

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await API.post('help-requests/', formData);
      setMessage('Help request submitted successfully!');

      setFormData({
        title: '',
        description: '',
        category: 'FOOD',
        location: '',
      });
    } catch (error) {
      console.error(error.response?.data);
      setMessage('Unable to submit request. Please login again.');
    }
  }

  return (
    <div className="create-request-page">
      <div className="request-visual">
        <div className="request-visual-content">
          <div className="request-brand">♥ Community Connect</div>

          <div className="request-welcome">
            <span className="request-tag">YOU ARE NOT ALONE</span>
            <h1>Every Request Is A Step Towards Hope.</h1>
            <p>
              Asking for help is a sign of strength.
              Let our community come together to support you.
            </p>
          </div>

          <div className="request-visual-footer">
            ♥ Together, we make a difference.
          </div>
        </div>
      </div>

      <div className="request-form-side">
        <div className="request-form-container">
          <span className="request-form-label">COMMUNITY SUPPORT</span>

          <h2>Create a Help Request</h2>
          <p className="request-description">
            Share what you need. Someone in our community may be able to help.
          </p>

          {message && (
            <div className="request-message">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="request-field">
              <label>Request Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="What kind of help do you need?"
                required
              />
            </div>

            <div className="request-field">
              <label>Description</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain your situation and how someone can help..."
                required
              />
            </div>

            <div className="request-field">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="FOOD">Food</option>
                <option value="EDUCATION">Education</option>
                <option value="CLOTHING">Clothing</option>
                <option value="MEDICAL">Medical</option>
                <option value="DAILY_NEEDS">Daily Needs</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="request-field">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your location"
                required
              />
            </div>

            <button type="submit" className="request-submit-btn">
              Submit Request <span>→</span>
            </button>
          </form>

          <p className="request-bottom-text">
            Small acts of kindness can change lives. 💜
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateRequest;

import React, { useState } from 'react';
import API from '../services/api';

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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card shadow p-4">
            <h2 className="text-success text-center mb-4">
              Create a Help Request
            </h2>

            {message && <div className="alert alert-info">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Request Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-select"
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

              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter your location"
                  required
                />
              </div>

              <button type="submit" className="btn btn-success w-100">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRequest;
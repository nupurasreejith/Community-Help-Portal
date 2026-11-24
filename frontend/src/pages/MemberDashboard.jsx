
import React, { useEffect, useState } from 'react';
import API from '../services/api';

function MemberDashboard() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('accounts/profile/')
      .then((response) => {
        setProfile(response.data);
      })
      .catch((error) => {
        console.error(error);
        setError('Unable to load profile. Please login again.');
      });
  }, []);

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-success">Member Dashboard</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {profile ? (
        <div className="card shadow-sm p-4 mt-4">
          <h4>Welcome, {profile.first_name || profile.username}!</h4>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone || 'Not added'}</p>
          <p><strong>Account Type:</strong> {profile.role}</p>
        </div>
      ) : (
        !error && <p className="mt-4">Loading profile...</p>
      )}

      <div className="row mt-4">

        {/* My Help Requests */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm p-4 h-100">
            <h4>My Help Requests</h4>
            <p>Create and track your help requests.</p>
            <a href="/my-requests" className="btn btn-success">
              View Requests
            </a>
            <a href="/create-request" className="btn btn-outline-success mt-2">
              Create New Request
            </a>
          </div>
        </div>

        {/* Community Sharing */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm p-4 h-100">
            <h4>Community Sharing</h4>
            <p>Find useful items shared by your community.</p>
            <a href="/community-sharing" className="btn btn-success">
              Explore Items
            </a>
          </div>
        </div>

        {/* Community Events */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm p-4 h-100">
            <h4>Community Events</h4>
            <p>Discover and participate in local activities.</p>
            <a href="/community-events" className="btn btn-success">
              View Events
            </a>
          </div>
        </div>

        {/* My Event Registrations */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm p-4 h-100">
            <h4>My Event Registrations</h4>
            <p>View the events you have registered for and cancel registrations if needed.</p>
            <a href="/my-event-registrations" className="btn btn-outline-success">
              View My Registrations
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MemberDashboard;

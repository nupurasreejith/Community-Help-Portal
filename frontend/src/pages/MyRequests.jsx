
import React, { useEffect, useRef, useState } from 'react';
import API from '../services/api';
import './MyRequests.css';

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);

  const previousStatuses = useRef({});

  async function loadRequests(showNotification = false) {
    try {
      const response = await API.get('help-requests/');

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      if (showNotification) {
        data.forEach((request) => {
          const previousStatus = previousStatuses.current[request.id];

          if (
            previousStatus === 'PENDING' &&
            request.status === 'ACCEPTED'
          ) {
            setMessage(
              `Good news! ${request.volunteer_username || 'A volunteer'} has accepted your request: ${request.title}`
            );
          }
        });
      }

      const updatedStatuses = {};

      data.forEach((request) => {
        updatedStatuses[request.id] = request.status;
      });

      previousStatuses.current = updatedStatuses;
      setRequests(data);
      setError('');
    } catch (error) {
      console.error(error);
      setError('Unable to load your requests.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();

    const interval = setInterval(() => {
      loadRequests(true);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  async function markCompleted(requestId) {
    setCompletingId(requestId);
    setError('');
    setMessage('');

    try {
      await API.post(`help-requests/${requestId}/complete/`);

      setMessage('Your help request has been marked as completed!');
      await loadRequests();
    } catch (error) {
      console.error(error.response?.data);

      setError(
        error.response?.data?.error ||
        'Unable to complete the request. Please try again.'
      );
    } finally {
      setCompletingId(null);
    }
  }

  function getStatusBadge(status) {
    switch (status) {
      case 'ACCEPTED':
        return 'accepted';
      case 'IN_PROGRESS':
        return 'in-progress';
      case 'COMPLETED':
        return 'completed';
      case 'CANCELLED':
        return 'cancelled';
      default:
        return 'pending';
    }
  }

  function getStatusDescription(status) {
    switch (status) {
      case 'ACCEPTED':
        return 'A volunteer has accepted your request.';
      case 'IN_PROGRESS':
        return 'Your request is currently being handled.';
      case 'COMPLETED':
        return 'This request has been successfully completed.';
      case 'CANCELLED':
        return 'This request has been cancelled.';
      default:
        return 'Your request is waiting for a volunteer.';
    }
  }

  return (
    <div className="my-requests-page">

      {/* Welcome Banner */}
      <section className="my-requests-hero">
        <div className="my-requests-hero-content">
          <span className="my-requests-hero-tag">
            COMMUNITY CONNECT
          </span>

          <h1>Your Requests, Your Progress</h1>

          <p>
            Stay updated on your help requests and follow
            every step towards getting the support you need.
          </p>
        </div>

        <div className="my-requests-hero-icon">
          💜
        </div>
      </section>

      <main className="my-requests-content">

        {/* Page Heading */}
        <div className="my-requests-heading">
          <div>
            <span className="requests-eyebrow">
              YOUR ACTIVITY
            </span>
            <h2>My Help Requests</h2>
            <p>Track your requests and their latest updates.</p>
          </div>

          <a href="/create-request" className="new-request-btn">
            <span>+</span> Create New Request
          </a>
        </div>

        {/* Messages */}
        {message && (
          <div className="requests-message success">
            <span>✓</span>
            <strong>{message}</strong>
            <button
              type="button"
              onClick={() => setMessage('')}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="requests-message error">
            <span>!</span>
            <strong>{error}</strong>
            <button
              type="button"
              onClick={() => setError('')}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="requests-empty-state">
            <div className="requests-empty-icon">⏳</div>
            <h3>Loading your requests...</h3>
            <p>Please wait a moment.</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && requests.length === 0 && (
          <div className="requests-empty-state">
            <div className="requests-empty-icon">🌷</div>
            <h3>No help requests yet</h3>
            <p>
              Whenever you need support, your requests will
              appear here.
            </p>

            <a href="/create-request" className="empty-create-btn">
              Create Your First Request
            </a>
          </div>
        )}

        {/* Request Cards */}
        {!loading && requests.length > 0 && (
          <div className="my-requests-grid">
            {requests.map((request) => (
              <article className="my-request-card" key={request.id}>

                <div className="my-request-card-top">
                  <span className="my-request-category">
                    {request.category?.replace(/_/g, ' ')}
                  </span>

                  <span className="my-request-id">
                    REQUEST #{request.id}
                  </span>
                </div>

                <h3>{request.title}</h3>

                <p className="my-request-description">
                  {request.description}
                </p>

                <div className="my-request-details">
                  <div>
                    <span>📍</span>
                    <p>{request.location}</p>
                  </div>

                  <div>
                    <span>📂</span>
                    <p>{request.category?.replace(/_/g, ' ')}</p>
                  </div>
                </div>

                <div className="my-request-status-area">
                  <div className="status-heading">
                    <span>REQUEST STATUS</span>

                    <span className={`request-status-badge ${getStatusBadge(request.status)}`}>
                      {request.status?.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="status-description">
                    {getStatusDescription(request.status)}
                  </p>
                </div>

                {request.volunteer_username && (
                  <div className="accepted-volunteer">
                    <div className="volunteer-avatar">🤝</div>
                    <div>
                      <span>YOUR VOLUNTEER</span>
                      <strong>{request.volunteer_username}</strong>
                    </div>
                  </div>
                )}

                {(request.status === 'ACCEPTED' ||
                  request.status === 'IN_PROGRESS') && (
                  <button
                    type="button"
                    className="complete-request-btn"
                    onClick={() => markCompleted(request.id)}
                    disabled={completingId === request.id}
                  >
                    {completingId === request.id
                      ? 'Updating...'
                      : '✓ Mark as Completed'}
                  </button>
                )}

                {request.status === 'COMPLETED' && (
                  <div className="request-completed-message">
                    <span>✓</span>
                    This request has been completed!
                  </div>
                )}

              </article>
            ))}
          </div>
        )}

        {/* Bottom Message */}
        <div className="my-requests-footer">
          <span>💜</span>
          <p>
            Every request matters. We're here to help you
            stay connected with your community.
          </p>
        </div>

      </main>
    </div>
  );
}

export default MyRequests;

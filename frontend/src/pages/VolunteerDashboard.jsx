
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './VolunteerDashboard.css';

function VolunteerDashboard() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    loadAvailability();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 250);

    return () => clearInterval(timer);
  }, []);

  async function loadAvailability() {
    try {
      const response = await API.get('volunteers/availability/');
      setIsAvailable(response.data.is_available);
    } catch {
      setMessage('Unable to load availability status.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (loading || !isAvailable) {
      setRequests([]);
      return;
    }

    let interval;

    async function fetchRequests() {
      try {
        const response = await API.get('help-requests/volunteer/');
        setRequests(response.data);
      } catch {
        setMessage('Unable to load help requests.');
      }
    }

    fetchRequests();
    interval = setInterval(fetchRequests, 2000);

    return () => clearInterval(interval);
  }, [loading, isAvailable]);

  async function toggleAvailability() {
    const newStatus = !isAvailable;
    setUpdating(true);

    try {
      await API.patch('volunteers/availability/', {
        is_available: newStatus,
      });

      setIsAvailable(newStatus);
      setMessage(
        newStatus
          ? 'You are now available to help!'
          : 'You are now unavailable.'
      );
    } catch {
      setMessage('Unable to update availability.');
    } finally {
      setUpdating(false);
    }
  }

  async function acceptRequest(id) {
    try {
      await API.post(`help-requests/${id}/accept/`);
      setMessage('Help request accepted successfully!');
      setRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (error) {
      setMessage(
        error.response?.data?.error || 'Unable to accept this request.'
      );
    }
  }

  async function rejectRequest(id) {
    try {
      await API.post(`help-requests/${id}/reject/`);
      setMessage('Request rejected. Moving to the next volunteer.');
      setRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (error) {
      setMessage(
        error.response?.data?.error || 'Unable to reject this request.'
      );
    }
  }

  function getRemainingSeconds(expiryTime) {
    return Math.max(
      0,
      Math.ceil(
        (new Date(expiryTime).getTime() - currentTime) / 1000
      )
    );
  }

  return (
    <div className="volunteer-dashboard">

      {/* Welcome Banner */}
      <section className="volunteer-hero">
        <div className="volunteer-hero-content">
          <span className="volunteer-hero-tag">
            COMMUNITY CONNECT
          </span>

          <h1>Your Kindness Makes a Difference</h1>

          <p>
            Every helping hand brings hope. Be there for someone
            who needs you today.
          </p>
        </div>

        <div className="volunteer-hero-decoration">
          💜
        </div>
      </section>

      <main className="volunteer-dashboard-content">

        {/* Availability Card */}
        <section className="volunteer-availability-card">
          <div className="availability-info">
            <span className="availability-small-title">
              YOUR VOLUNTEER STATUS
            </span>

            <h2>Ready to make a difference?</h2>

            <p>
              Turn on your availability to receive nearby
              community help requests.
            </p>
          </div>

          <div className="availability-control">
            <span
              className={`volunteer-status-pill ${
                isAvailable ? 'available' : 'unavailable'
              }`}
            >
              <span className="status-dot"></span>
              {isAvailable ? 'Available' : 'Unavailable'}
            </span>

            <button
              type="button"
              className={`availability-toggle ${
                isAvailable ? 'available' : 'unavailable'
              }`}
              onClick={toggleAvailability}
              disabled={loading || updating}
              aria-label="Toggle volunteer availability"
            >
              <span className="toggle-knob"></span>
            </button>

            <span className="toggle-label">
              {updating
                ? 'Updating...'
                : isAvailable
                ? 'Turn off availability'
                : 'Turn on availability'}
            </span>
          </div>
        </section>

        {/* Feedback Message */}
        {message && (
          <div className="volunteer-message">
            <span>{message}</span>
            <button
              type="button"
              onClick={() => setMessage('')}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* Help Requests */}
        <section className="volunteer-requests-section">
          <div className="requests-heading">
            <div>
              <span className="section-eyebrow">
                LEND A HELPING HAND
              </span>
              <h2>Available Help Requests</h2>
              <p>
                Requests waiting for someone like you.
              </p>
            </div>

            <div className="request-count">
              {requests.length} {requests.length === 1 ? 'Request' : 'Requests'}
            </div>
          </div>

          {!isAvailable && (
            <div className="volunteer-unavailable-notice">
              <span className="notice-icon">💜</span>
              <div>
                <h3>You are currently unavailable</h3>
                <p>
                  Turn on your availability to start receiving
                  help requests.
                </p>
              </div>
            </div>
          )}

          {isAvailable && (
            <>
              {loading ? (
                <div className="request-empty-state">
                  <div className="empty-state-icon">⏳</div>
                  <h3>Loading requests...</h3>
                  <p>Please wait a moment.</p>
                </div>
              ) : requests.length === 0 ? (
                <div className="request-empty-state">
                  <div className="empty-state-icon">🌷</div>
                  <h3>No requests at the moment</h3>
                  <p>
                    You're ready to help! New requests will appear here.
                  </p>
                </div>
              ) : (
                <div className="request-grid">
                  {requests.map((request) => {
                    const remainingSeconds = getRemainingSeconds(
                      request.offer_expires_at
                    );

                    return (
                      <article
                        className="volunteer-request-card"
                        key={request.id}
                      >
                        <div className="request-card-top">
                          <span className="request-category">
                            {request.category?.replace(/_/g, ' ')}
                          </span>

                          <span className="request-id">
                            REQUEST #{request.id}
                          </span>
                        </div>

                        <h3>{request.title}</h3>

                        <p className="request-description">
                          {request.description}
                        </p>

                        <div className="request-details">
                          <div className="request-detail">
                            <span className="detail-icon">📍</span>
                            <span>{request.location}</span>
                          </div>

                          <div className="request-detail">
                            <span className="detail-icon">👤</span>
                            <span>
                              Requested by: {request.member_name || 'Community Member'}
                            </span>
                          </div>
                        </div>

                        {request.offer_expires_at && (
                          <div
                            className={`request-countdown ${
                              remainingSeconds === 0 ? 'countdown-expired' : ''
                            }`}
                          >
                            {remainingSeconds > 0 ? (
                              <>
                                <span>⏱</span>
                                Offer valid for
                                <strong className="countdown-number">
                                  {remainingSeconds}s
                                </strong>
                              </>
                            ) : (
                              <span>Offer time has expired</span>
                            )}
                          </div>
                        )}

                        <div className="request-actions">
                          <button
                            type="button"
                            className="accept-btn"
                            onClick={() => acceptRequest(request.id)}
                            disabled={remainingSeconds === 0}
                          >
                            Accept Request
                          </button>

                          <button
                            type="button"
                            className="reject-btn"
                            onClick={() => rejectRequest(request.id)}
                          >
                            Reject
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>

        {/* Community Events */}
        <section className="volunteer-events-card">
          <div className="events-icon">🌍</div>

          <div className="events-content">
            <span className="section-eyebrow">
              BE PART OF SOMETHING BIGGER
            </span>

            <h2>Explore Community Events</h2>

            <p>
              Discover events, join meaningful activities and
              connect with people who care.
            </p>

            <div className="events-actions">
              <a href="/community-events" className="events-btn primary">
                Explore Events
              </a>

              <a
                href="/my-event-registrations"
                className="events-btn secondary"
              >
                My Registrations
              </a>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default VolunteerDashboard;

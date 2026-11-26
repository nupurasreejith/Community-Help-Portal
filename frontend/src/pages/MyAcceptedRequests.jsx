
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './MyAcceptedRequests.css';

function MyAcceptedRequests() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('help-requests/volunteer/my-requests/')
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.error(error);
        setMessage('Unable to load accepted requests.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="accepted-requests-page">
      <section className="accepted-requests-hero">
        <div className="accepted-requests-hero-content">
          <span className="accepted-requests-tag">YOUR VOLUNTEER JOURNEY</span>
          <h1>My Accepted Requests</h1>
          <p>
            Every request you accept is an opportunity to make someone's
            day a little better.
          </p>
        </div>
        <div className="accepted-requests-hero-icon">💜</div>
      </section>

      <main className="accepted-requests-content">
        <div className="accepted-requests-heading">
          <div>
            <h2>Your Contributions</h2>
            <p>Requests you have accepted and are helping with.</p>
          </div>
          <div className="accepted-requests-count">
            <strong>{requests.length}</strong>
            <span>Accepted</span>
          </div>
        </div>

        {message && (
          <div className="accepted-requests-error">{message}</div>
        )}

        {loading ? (
          <div className="accepted-requests-empty">
            <span>⏳</span>
            <h3>Loading your requests...</h3>
          </div>
        ) : !message && requests.length === 0 ? (
          <div className="accepted-requests-empty">
            <span>🤝</span>
            <h3>No accepted requests yet</h3>
            <p>
              When you accept a help request, it will appear here.
            </p>
          </div>
        ) : (
          <div className="accepted-requests-grid">
            {requests.map((request) => (
              <article className="accepted-request-card" key={request.id}>
                <div className="accepted-request-card-top">
                  <span className="accepted-request-category">
                    {request.category}
                  </span>
                  <span
                    className={`accepted-request-status ${request.status
                      .toLowerCase()
                      .replace(/_/g, '-')}`}
                  >
                    {request.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <h3>{request.title}</h3>
                <p className="accepted-request-description">
                  {request.description}
                </p>

                <div className="accepted-request-details">
                  <div>
                    <span>📍</span>
                    <p>
                      <strong>Location</strong>
                      {request.location || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <span>🤝</span>
                    <p>
                      <strong>Status</strong>
                      {request.status.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyAcceptedRequests;

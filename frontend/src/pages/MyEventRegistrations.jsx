
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './MyEventRegistrations.css';

function MyEventRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await API.get('events/my-registrations/');

      setRegistrations(
        Array.isArray(response.data)
          ? response.data
          : response.data.results || []
      );
    } catch (error) {
      console.error(error);
      setError('Unable to load your event registrations.');
    } finally {
      setLoading(false);
    }
  };

  const cancelRegistration = async (registrationId) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this registration?'
    );

    if (!confirmCancel) return;

    try {
      setError('');
      setMessage('');
      setCancellingId(registrationId);

      await API.delete(
        `events/registrations/${registrationId}/cancel/`
      );

      setMessage('Registration cancelled successfully!');
      await fetchRegistrations();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.detail ||
        'Unable to cancel registration.'
      );
    } finally {
      setCancellingId(null);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return '';

    return image.startsWith('http')
      ? image
      : `http://127.0.0.1:8000${image}`;
  };

  return (
    <div className="my-event-registrations">

      {/* Hero Section */}
      <section className="registrations-hero">
        <div className="registrations-hero-content">
          <span className="registrations-tag">
            YOUR COMMUNITY JOURNEY
          </span>

          <h1>My Event Registrations</h1>

          <p>
            Every event is an opportunity to connect, contribute,
            and make beautiful memories together.
          </p>
        </div>

        <div className="registrations-hero-decoration">
          <span>♡</span>
          <span>✦</span>
          <span>♡</span>
        </div>
      </section>

      {/* Main Content */}
      <main className="registrations-content">

        {message && (
          <div className="registrations-message">
            <span>✓</span> {message}
          </div>
        )}

        {error && (
          <div className="registrations-error">
            {error}
          </div>
        )}

        <div className="registrations-section-heading">
          <div>
            <span className="registrations-section-label">
              YOUR PARTICIPATION
            </span>

            <h2>Events You've Joined</h2>

            <p>
              Keep track of the community events you're part of.
            </p>
          </div>

          {!loading && (
            <span className="registrations-count">
              {registrations.length}{' '}
              {registrations.length === 1 ? 'Registration' : 'Registrations'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="registrations-loader">
            <div className="registrations-spinner"></div>
            <p>Loading your registrations...</p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="registrations-empty">
            <div className="registrations-empty-icon">♡</div>

            <h3>No Registrations Yet</h3>

            <p>
              You haven't registered for any community events yet.
              Explore upcoming events and become part of something wonderful!
            </p>
          </div>
        ) : (
          <div className="registrations-grid">

            {registrations.map((registration) => {
              const event = registration.event_details;

              return (
                <article
                  className="registration-card"
                  key={registration.id}
                >

                  <div className="registration-image-wrapper">
                    {event?.poster ? (
                      <img
                        src={getImageUrl(event.poster)}
                        alt={event.title}
                        className="registration-image"
                      />
                    ) : (
                      <div className="registration-image-placeholder">
                        <span>♡</span>
                        <p>Community Event</p>
                      </div>
                    )}

                    <span className="registration-type">
                      {registration.registration_type}
                    </span>
                  </div>

                  <div className="registration-card-body">

                    <h3 className="registration-title">
                      {event?.title || `Event #${registration.event}`}
                    </h3>

                    {event ? (
                      <>
                        <p className="registration-description">
                          {event.description}
                        </p>

                        <div className="registration-details">

                          <div className="registration-detail">
                            <span>📅</span>
                            <div>
                              <small>Event Date</small>
                              <strong>{event.event_date}</strong>
                            </div>
                          </div>

                          <div className="registration-detail">
                            <span>🕒</span>
                            <div>
                              <small>Event Time</small>
                              <strong>
                                {event.start_time} - {event.end_time}
                              </strong>
                            </div>
                          </div>

                          <div className="registration-detail">
                            <span>📍</span>
                            <div>
                              <small>Venue</small>
                              <strong>{event.venue}</strong>
                            </div>
                          </div>

                        </div>
                      </>
                    ) : (
                      <p className="registration-description">
                        Event details are not available.
                      </p>
                    )}

                    <div className="registration-date">
                      <span>Registered on</span>
                      <strong>
                        {new Date(
                          registration.registered_at
                        ).toLocaleDateString()}
                      </strong>
                    </div>

                    <button
                      className="registration-cancel-btn"
                      onClick={() => cancelRegistration(registration.id)}
                      disabled={cancellingId === registration.id}
                    >
                      {cancellingId === registration.id
                        ? 'Cancelling...'
                        : 'Cancel Registration'}
                    </button>

                  </div>
                </article>
              );
            })}

          </div>
        )}

        <div className="registrations-footer">
          <span>♡</span>
          <p>Thank you for being part of positive change!</p>
        </div>

      </main>
    </div>
  );
}

export default MyEventRegistrations;

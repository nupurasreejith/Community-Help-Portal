
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './CommunityEvents.css';

function CommunityEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [registeringId, setRegisteringId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await API.get('events/');
      setEvents(
        Array.isArray(response.data)
          ? response.data
          : response.data.results || []
      );
    } catch (error) {
      console.error(error);
      setError('Unable to load community events.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    setMessage('');
    setError('');
    setRegisteringId(eventId);

    try {
      await API.post(`events/${eventId}/register/`, {});
      setMessage('Successfully registered for the event!');
      await fetchEvents();
    } catch (error) {
      console.error(error.response?.data);

      const responseData = error.response?.data;
      const errorMessage =
        responseData?.detail ||
        responseData?.error ||
        Object.values(responseData || {}).flat().join(' ') ||
        'Unable to register. Please try again.';

      setError(errorMessage);
    } finally {
      setRegisteringId(null);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return '';

    return image.startsWith('http')
      ? image
      : `http://127.0.0.1:8000${image}`;
  };

  return (
    <div className="community-events-page">

      {/* Hero Section */}
      <section className="events-hero">
        <div className="events-hero-content">
          <span className="events-tag">TOGETHER WE CAN MAKE A DIFFERENCE</span>

          <h1>Community Events</h1>

          <p>
            Discover meaningful events, connect with people, and
            become part of something wonderful.
          </p>
        </div>

        <div className="events-hero-decoration">
          <span>♡</span>
          <span>✦</span>
          <span>♡</span>
        </div>
      </section>

      {/* Events Content */}
      <main className="events-content">

        {message && (
          <div className="events-message">
            <span>✓</span> {message}
          </div>
        )}

        {error && (
          <div className="events-error">
            {error}
          </div>
        )}

        <div className="events-section-heading">
          <div>
            <span className="events-section-label">BE A PART OF SOMETHING GOOD</span>
            <h2>Explore Upcoming Events</h2>
            <p>Every small action can create a positive change.</p>
          </div>

          {!loading && (
            <span className="events-count">
              {events.length} {events.length === 1 ? 'Event' : 'Events'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="events-loader">
            <div className="events-spinner"></div>
            <p>Finding community events for you...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="events-empty-state">
            <div className="events-empty-icon">♡</div>
            <h3>No Events Available Yet</h3>
            <p>
              There are no upcoming community events at the moment.
              Please check back soon!
            </p>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <article className="event-card" key={event.id}>

                <div className="event-image-wrapper">
                  {event.poster ? (
                    <img
                      src={getImageUrl(event.poster)}
                      alt={event.title}
                      className="event-image"
                    />
                  ) : (
                    <div className="event-image-placeholder">
                      <span>♡</span>
                      <p>Community Event</p>
                    </div>
                  )}

                  <span className="event-category">
                    {event.category}
                  </span>
                </div>

                <div className="event-card-body">
                  <h3 className="event-title">{event.title}</h3>

                  <p className="event-description">
                    {event.description}
                  </p>

                  <div className="event-details">
                    <div className="event-detail">
                      <span className="event-detail-icon">📅</span>
                      <span>{event.date}</span>
                    </div>

                    <div className="event-detail">
                      <span className="event-detail-icon">🕒</span>
                      <span>
                        {event.start_time} - {event.end_time}
                      </span>
                    </div>

                    <div className="event-detail">
                      <span className="event-detail-icon">📍</span>
                      <span>{event.venue}</span>
                    </div>

                    <div className="event-detail">
                      <span className="event-detail-icon">👤</span>
                      <span>
                        Organized by {event.organizer_username}
                      </span>
                    </div>

                    <div className="event-detail">
                      <span className="event-detail-icon">☎</span>
                      <span>{event.contact_details}</span>
                    </div>
                  </div>

                  <div className="event-counts">
                    <div className="event-count-item">
                      <span>👥</span>
                      <div>
                        <strong>{event.member_count || 0}</strong>
                        <small>
                          / {event.max_participants} Members
                        </small>
                      </div>
                    </div>

                    <div className="event-count-item">
                      <span>💜</span>
                      <div>
                        <strong>{event.volunteer_count || 0}</strong>
                        <small>
                          / {event.max_volunteers} Volunteers
                        </small>
                      </div>
                    </div>
                  </div>

                  <button
                    className="event-register-btn"
                    onClick={() => handleRegister(event.id)}
                    disabled={registeringId === event.id}
                  >
                    {registeringId === event.id
                      ? 'Registering...'
                      : 'Register for Event'}
                    <span>→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="events-footer">
          <span>♡</span>
          <p>Small acts of kindness bring communities together.</p>
        </div>

      </main>
    </div>
  );
}

export default CommunityEvents;

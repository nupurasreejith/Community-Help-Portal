
import React, { useEffect, useState } from 'react';
import API from '../services/api';

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
      fetchEvents();
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
    <div className="container py-5">

      <div className="mb-4">
        <h2 className="fw-bold text-success">
          Community Events
        </h2>
        <p className="text-muted">
          Discover events, connect with your community
          and participate in meaningful activities.
        </p>
      </div>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading community events...</p>
      ) : events.length === 0 ? (
        <div className="alert alert-info">
          No upcoming events are available right now.
          Please check again later!
        </div>
      ) : (

        <div className="row g-4">

          {events.map((event) => (

            <div
              className="col-md-6 col-lg-4"
              key={event.id}
            >

              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">

                {event.poster && (
                  <img
                    src={getImageUrl(event.poster)}
                    alt={event.title}
                    style={{
                      height: '220px',
                      objectFit: 'cover',
                    }}
                  />
                )}

                <div className="card-body d-flex flex-column">

                  <span className="badge bg-success align-self-start mb-2">
                    {event.category}
                  </span>

                  <h5 className="fw-bold">
                    {event.title}
                  </h5>

                  <p className="text-muted">
                    {event.description}
                  </p>

                  <hr />

                  <p className="small mb-2">
                    <strong>Date:</strong> {event.event_date}
                  </p>

                  <p className="small mb-2">
                    <strong>Time:</strong> {event.start_time} - {event.end_time}
                  </p>

                  <p className="small mb-2">
                    <strong>Venue:</strong> {event.venue}
                  </p>

                  <p className="small mb-2">
                    <strong>Organized by:</strong> {event.organization_username}
                  </p>

                  <p className="small mb-3">
                    <strong>Contact:</strong> {event.contact_details}
                  </p>

                  <div className="d-flex justify-content-between mb-3">
                    <span className="badge bg-info text-dark">
                      Members: {event.member_count}
                      {event.max_participants
                        ? ` / ${event.max_participants}`
                        : ''}
                    </span>

                    <span className="badge bg-primary">
                      Volunteers: {event.volunteer_count}
                      {event.max_volunteers
                        ? ` / ${event.max_volunteers}`
                        : ''}
                    </span>
                  </div>

                  <button
                    className="btn btn-success mt-auto"
                    onClick={() => handleRegister(event.id)}
                    disabled={registeringId === event.id}
                  >
                    {registeringId === event.id
                      ? 'Registering...'
                      : 'Register for Event'}
                  </button>

                </div>
              </div>
            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default CommunityEvents;

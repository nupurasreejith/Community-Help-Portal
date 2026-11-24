
import React, { useEffect, useState } from 'react';
import API from '../services/api';

function MyEventRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

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

      await API.delete(
        `events/registrations/${registrationId}/cancel/`
      );

      setMessage('Registration cancelled successfully!');
      fetchRegistrations();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.detail ||
        'Unable to cancel registration.'
      );
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

      <h2 className="fw-bold text-success">
        My Event Registrations
      </h2>

      <p className="text-muted mb-4">
        Keep track of the community events you have joined.
      </p>

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {loading ? (
        <p>Loading your registrations...</p>
      ) : registrations.length === 0 ? (
        <div className="alert alert-info">
          You haven't registered for any events yet.
          Explore community events to get started!
        </div>
      ) : (

        <div className="row g-4">

          {registrations.map((registration) => {
            const event = registration.event_details;

            return (
              <div className="col-md-6 col-lg-4" key={registration.id}>
                <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">

                  {event?.poster && (
                    <img
                      src={getImageUrl(event.poster)}
                      alt={event.title}
                      style={{
                        height: '200px',
                        objectFit: 'cover',
                      }}
                    />
                  )}

                  <div className="card-body">

                    <span className="badge bg-success mb-2">
                      {registration.registration_type}
                    </span>

                    <h5 className="fw-bold">
                      {event?.title || `Event #${registration.event}`}
                    </h5>

                    {event ? (
                      <>
                        <p className="small text-muted">
                          {event.description}
                        </p>

                        <p className="small mb-1">
                          <strong>Date:</strong> {event.event_date}
                        </p>

                        <p className="small mb-1">
                          <strong>Time:</strong> {event.start_time} - {event.end_time}
                        </p>

                        <p className="small mb-3">
                          <strong>Venue:</strong> {event.venue}
                        </p>
                      </>
                    ) : (
                      <p className="small text-muted">
                        Event details are not available.
                      </p>
                    )}

                    <p className="small text-muted">
                      Registered on: {new Date(registration.registered_at).toLocaleDateString()}
                    </p>

                    <button
                      className="btn btn-outline-danger w-100"
                      onClick={() => cancelRegistration(registration.id)}
                    >
                      Cancel Registration
                    </button>

                  </div>
                </div>
              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default MyEventRegistrations;

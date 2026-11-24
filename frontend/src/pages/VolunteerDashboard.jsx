
import React, { useEffect, useState } from 'react';
import API from '../services/api';

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
    } catch (error) {
      console.error(error);
      setMessage('Unable to load volunteer availability.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (loading || !isAvailable) {
      setRequests([]);
      return;
    }

    async function loadRequests() {
      try {
        const response = await API.get('help-requests/volunteer/');
        setRequests(response.data);
      } catch (error) {
        console.error(error);
        setMessage('Unable to load pending requests.');
      }
    }

    loadRequests();
    const interval = setInterval(loadRequests, 2000);

    return () => clearInterval(interval);
  }, [isAvailable, loading]);

  async function toggleAvailability() {
    const newStatus = !isAvailable;
    setUpdating(true);

    try {
      await API.patch('volunteers/availability/', {
        is_available: newStatus
      });

      setIsAvailable(newStatus);
      setMessage(
        newStatus
          ? 'You are now Available for help requests!'
          : 'You are now Unavailable for help requests.'
      );
    } catch (error) {
      console.error(error.response?.data);
      setMessage('Unable to update your availability.');
    } finally {
      setUpdating(false);
    }
  }

  async function acceptRequest(id) {
    try {
      await API.post(`help-requests/${id}/accept/`);
      setMessage('Request accepted successfully!');

      setRequests((previous) =>
        previous.filter((request) => request.id !== id)
      );
    } catch (error) {
      console.error(error.response?.data);
      setMessage('Unable to accept this request.');
    }
  }

  async function rejectRequest(id) {
    try {
      await API.post(`help-requests/${id}/reject/`);
      setMessage('Request rejected. Moving to the next volunteer.');

      setRequests((previous) =>
        previous.filter((request) => request.id !== id)
      );
    } catch (error) {
      console.error(error.response?.data);
      setMessage('Unable to reject this request.');
    }
  }

  function getRemainingSeconds(expiryTime) {
    if (!expiryTime) return 0;

    const remaining = Math.ceil(
      (new Date(expiryTime).getTime() - currentTime) / 1000
    );

    return Math.max(0, remaining);
  }

  return (
    <div className="container py-5">
      <h2 className="text-success fw-bold">Volunteer Dashboard</h2>

      <p className="text-muted">
        Find people who need help and make a difference!
      </p>

      {/* Availability Section */}
      <div className="card shadow-sm border-0 p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h5 className="fw-bold mb-2">Your Availability</h5>

            {loading ? (
              <span className="text-muted">Loading status...</span>
            ) : (
              <span className={`badge fs-6 ${
                isAvailable ? 'bg-success' : 'bg-danger'
              }`}>
                {isAvailable ? '● Available' : '● Unavailable'}
              </span>
            )}

            <p className="text-muted mt-2 mb-0">
              {isAvailable
                ? 'You can receive new help requests.'
                : 'You will not receive new help requests.'}
            </p>
          </div>

          <div className={`availability-toggle ${
            isAvailable ? 'available' : 'unavailable'
          }`}>
            <span className="toggle-label">
              {isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
            </span>

            <button
              type="button"
              className="toggle-button"
              onClick={toggleAvailability}
              disabled={loading || updating}
              aria-label="Toggle volunteer availability"
            >
              <span className="toggle-knob">
                {updating ? '...' : isAvailable ? '✓' : '×'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className="alert alert-info">{message}</div>
      )}

      <h4 className="mt-4 mb-3">Available Help Requests</h4>

      {!loading && !isAvailable && (
        <div className="alert alert-warning">
          You are currently unavailable. Change your status to Available
          to receive help requests.
        </div>
      )}

      <div className="row">
        {loading && <p>Loading requests...</p>}

        {!loading && isAvailable && requests.length === 0 && (
          <p>No available requests to display.</p>
        )}

        {isAvailable && requests.map((request) => {
          const remainingSeconds = getRemainingSeconds(
            request.offer_expires_at
          );

          return (
            <div className="col-md-6 mb-4" key={request.id}>
              <div className="card shadow-sm p-4 h-100">
                <h5>{request.title}</h5>
                <p>{request.description}</p>
                <p><strong>Category:</strong> {request.category}</p>
                <p><strong>Location:</strong> {request.location}</p>
                <p><strong>Requested by:</strong> {request.user}</p>

                <div className="alert alert-warning text-center mt-2">
                  <strong>This request is valid till:</strong>
                  <h2 className="fw-bold text-danger my-2">
                    {remainingSeconds} seconds
                  </h2>
                  <small>
                    {remainingSeconds === 0
                      ? 'Offer expired. Waiting for the next offer...'
                      : 'Please accept or reject before time runs out.'}
                  </small>
                </div>

                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn btn-success flex-fill"
                    onClick={() => acceptRequest(request.id)}
                    disabled={remainingSeconds === 0}
                  >
                    ✓ Accept
                  </button>

                  <button
                    className="btn btn-outline-danger flex-fill"
                    onClick={() => rejectRequest(request.id)}
                    disabled={remainingSeconds === 0}
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Community Events Section */}
      <hr className="my-5" />

      <div className="card shadow-sm border-0 p-4">
        <h4 className="fw-bold text-success">Community Events</h4>
        <p className="text-muted">
          Discover community activities such as blood donation camps,
          educational workshops and volunteering events.
        </p>

        <div className="d-flex flex-wrap gap-2">
          <a href="/community-events" className="btn btn-success">
            Browse Events
          </a>

          <a
            href="/my-event-registrations"
            className="btn btn-outline-success"
          >
            My Event Registrations
          </a>
        </div>
      </div>
    </div>
  );
}

export default VolunteerDashboard;

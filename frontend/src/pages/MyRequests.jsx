
import React, { useEffect, useRef, useState } from 'react';
import API from '../services/api';

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
        return 'bg-primary';
      case 'IN_PROGRESS':
        return 'bg-warning text-dark';
      case 'COMPLETED':
        return 'bg-success';
      case 'CANCELLED':
        return 'bg-secondary';
      default:
        return 'bg-info text-dark';
    }
  }

  return (
    <div className="container py-5">
      <h2 className="text-success fw-bold mb-4">
        My Help Requests
      </h2>

      {message && (
        <div className="alert alert-success">
          <strong>{message}</strong>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {loading && <p>Loading your requests...</p>}

      {!loading && requests.length === 0 && (
        <p>No help requests found.</p>
      )}

      <div className="row">
        {requests.map((request) => (
          <div className="col-md-6 mb-4" key={request.id}>
            <div className="card shadow-sm p-4 h-100">

              <h5>{request.title}</h5>

              <p>{request.description}</p>

              <p>
                <strong>Category:</strong> {request.category}
              </p>

              <p>
                <strong>Location:</strong> {request.location}
              </p>

              <p>
                <strong>Status:</strong>{' '}
                <span className={`badge ${getStatusBadge(request.status)}`}>
                  {request.status}
                </span>
              </p>

              {request.volunteer_username && (
                <div className="alert alert-info">
                  <strong>Accepted Volunteer:</strong>{' '}
                  {request.volunteer_username}
                </div>
              )}

              {(request.status === 'ACCEPTED' ||
                request.status === 'IN_PROGRESS') && (
                <button
                  className="btn btn-success mt-2"
                  onClick={() => markCompleted(request.id)}
                  disabled={completingId === request.id}
                >
                  {completingId === request.id
                    ? 'Updating...'
                    : '✓ Mark as Completed'}
                </button>
              )}

              {request.status === 'COMPLETED' && (
                <div className="alert alert-success mt-2 mb-0">
                  ✓ This request has been completed!
                </div>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyRequests;

import React, { useEffect, useState } from 'react';
import API from '../services/api';

function MyAcceptedRequests() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('help-requests/volunteer/my-requests/')
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.error(error);
        setMessage('Unable to load accepted requests.');
      });
  }, []);

  return (
    <div className="container py-5">
      <h2 className="text-success fw-bold">My Accepted Requests</h2>

      {message && <div className="alert alert-danger">{message}</div>}

      {requests.length === 0 && !message && (
        <p className="mt-4">Loading accepted requests...</p>
      )}

      {requests.map((request) => (
        <div className="card shadow-sm p-4 mt-3" key={request.id}>
          <h5>{request.title}</h5>
          <p>{request.description}</p>
          <p><strong>Category:</strong> {request.category}</p>
          <p><strong>Location:</strong> {request.location}</p>
          <p><strong>Status:</strong> {request.status}</p>
        </div>
      ))}
    </div>
  );
}

export default MyAcceptedRequests;
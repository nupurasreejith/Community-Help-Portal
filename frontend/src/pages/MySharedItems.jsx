
import React, { useEffect, useState } from 'react';
import API from '../services/api';

function MySharedItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [interests, setInterests] = useState({});
  const [expandedItem, setExpandedItem] = useState(null);
  const [selectingId, setSelectingId] = useState(null);

  useEffect(() => {
    fetchMyItems();
  }, []);

  async function fetchMyItems() {
    try {
      const response = await API.get('items/my-items/');
      setItems(response.data);
    } catch {
      setMessage('Unable to load your shared items.');
    } finally {
      setLoading(false);
    }
  }

  function getImageUrl(image) {
    if (!image) return '';

    return image.startsWith('http')
      ? image
      : `http://127.0.0.1:8000${image}`;
  }

  async function handleViewInterests(itemId) {
    if (expandedItem === itemId) {
      setExpandedItem(null);
      return;
    }

    try {
      const response = await API.get(`items/${itemId}/interests/`);

      setInterests((previous) => ({
        ...previous,
        [itemId]: response.data,
      }));

      setExpandedItem(itemId);
    } catch {
      setMessage('Unable to load interested members.');
    }
  }

  async function handleSelectRecipient(itemId, memberId, username) {
    const confirmed = window.confirm(
      `Are you sure you want to give this item to ${username}? Other interested members will not be selected.`
    );

    if (!confirmed) return;

    setSelectingId(itemId);
    setMessage('');

    try {
      const response = await API.post(
        `items/${itemId}/select-recipient/`,
        { member_id: memberId }
      );

      setMessage(response.data.message);
      await fetchMyItems();
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
        'Unable to select the recipient.'
      );
    } finally {
      setSelectingId(null);
    }
  }

  async function handleDelete(itemId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this listing?'
    );

    if (!confirmed) return;

    try {
      await API.delete(`items/${itemId}/`);

      setItems((previous) =>
        previous.filter((item) => item.id !== itemId)
      );

      setMessage('Item listing deleted successfully.');
    } catch {
      setMessage('Unable to delete this listing.');
    }
  }

  return (
    <div className="container py-5">

      <div className="text-center mb-5">
        <h1 className="fw-bold" style={{ color: '#51458c' }}>
          My Shared Items 💜
        </h1>

        <p className="text-muted">
          Manage your listings and choose who receives your shared items.
        </p>
      </div>

      {message && (
        <div className="alert alert-info text-center">
          {message}
          <button
            className="btn-close float-end"
            onClick={() => setMessage('')}
          ></button>
        </div>
      )}

      {loading && (
        <p className="text-center">Loading your items...</p>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-5">
          <h5>You haven't shared anything yet!</h5>
          <p className="text-muted">
            Visit Community Sharing to post your first item.
          </p>
        </div>
      )}

      <div className="row g-4">
        {items.map((item) => (
          <div className="col-md-6 col-lg-4" key={item.id}>
            <div className="card h-100 shadow-sm border-0">

              <img
                src={getImageUrl(item.image)}
                className="card-img-top"
                alt={item.title}
                style={{
                  height: '220px',
                  objectFit: 'cover',
                }}
              />

              <div className="card-body d-flex flex-column">

                <h5 className="fw-bold">{item.title}</h5>

                <p className="text-muted">{item.description}</p>

                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={
                      item.status === 'AVAILABLE'
                        ? 'badge bg-success'
                        : 'badge bg-secondary'
                    }
                  >
                    {item.status === 'AVAILABLE'
                      ? 'Available'
                      : 'Given Away'}
                  </span>
                </p>

                <p className="text-muted">
                  ❤️ {item.interest_count} interested
                </p>

                {item.status === 'GIVEN_AWAY' && (
                  <div className="alert alert-success">
                    <strong>Selected recipient:</strong>
                    <br />
                    {item.selected_recipient_username}
                  </div>
                )}

                {item.status === 'AVAILABLE' && (
                  <button
                    className="btn btn-outline-primary mb-2"
                    onClick={() => handleViewInterests(item.id)}
                  >
                    {expandedItem === item.id
                      ? 'Hide Interested Members'
                      : 'View Interested Members'}
                  </button>
                )}

                <button
                  className="btn btn-outline-danger mt-auto"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete Listing
                </button>

                {expandedItem === item.id &&
                  item.status === 'AVAILABLE' && (
                    <div className="mt-3 p-3 bg-light rounded">

                      <h6 className="fw-bold">
                        Interested Members
                      </h6>

                      {interests[item.id]?.length > 0 ? (
                        interests[item.id].map((interest) => (
                          <div
                            key={interest.id}
                            className="border-bottom py-3"
                          >
                            <strong>
                              {interest.member_username}
                            </strong>

                            <p className="small text-muted mb-2">
                              Interested in this item
                            </p>

                            <button
                              className="btn btn-success btn-sm"
                              disabled={selectingId === item.id}
                              onClick={() =>
                                handleSelectRecipient(
                                  item.id,
                                  interest.member,
                                  interest.member_username
                                )
                              }
                            >
                              {selectingId === item.id
                                ? 'Selecting...'
                                : 'Give Item to This Member'}
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted small">
                          Nobody has expressed interest yet.
                        </p>
                      )}

                    </div>
                  )}

              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default MySharedItems;

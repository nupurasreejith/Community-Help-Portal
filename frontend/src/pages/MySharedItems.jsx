
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './MySharedItems.css';

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

      setInterests(previous => ({
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

      setItems(previous =>
        previous.filter(item => item.id !== itemId)
      );

      setMessage('Item listing deleted successfully.');
    } catch {
      setMessage('Unable to delete this listing.');
    }
  }

  return (
    <div className="my-shared-page">

      <section className="my-shared-hero">
        <div className="my-shared-hero-content">
          <span className="my-shared-tag">YOUR KINDNESS, YOUR IMPACT</span>
          <h1>My Shared Items 💜</h1>
          <p>
            Every item you share creates an opportunity to help.
            Manage your listings and choose who receives your gifts.
          </p>
        </div>
        <div className="my-shared-hero-decoration">🎁</div>
      </section>

      <main className="my-shared-content">

        {message && (
          <div className="my-shared-message">
            <span>{message}</span>
            <button onClick={() => setMessage('')}>×</button>
          </div>
        )}

        <div className="my-shared-heading">
          <div>
            <span className="my-shared-tag">YOUR LISTINGS</span>
            <h2>Items You've Shared</h2>
            <p>Keep track of the things you've given to the community.</p>
          </div>

          <span className="my-shared-count">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {loading && (
          <div className="my-shared-empty">
            <div className="my-shared-loader"></div>
            <p>Loading your shared items...</p>
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="my-shared-empty">
            <span>🎁</span>
            <h3>You haven't shared anything yet!</h3>
            <p>
              Visit Community Sharing to post your first item
              and make someone's day.
            </p>
            <a href="/community-sharing" className="my-shared-link">
              Explore Community Sharing
            </a>
          </div>
        )}

        <div className="my-shared-grid">
          {items.map(item => (
            <article className="my-shared-card" key={item.id}>

              <div className="my-shared-image">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.title}
                />

                <span
                  className={`my-shared-status ${
                    item.status === 'AVAILABLE'
                      ? 'status-available'
                      : 'status-given'
                  }`}
                >
                  {item.status === 'AVAILABLE'
                    ? 'Available'
                    : 'Given Away'}
                </span>
              </div>

              <div className="my-shared-card-body">
                <h3>{item.title}</h3>

                <p className="my-shared-description">
                  {item.description}
                </p>

                <div className="my-shared-interest">
                  ❤️ {item.interest_count} interested
                </div>

                {item.status === 'GIVEN_AWAY' && (
                  <div className="my-shared-recipient">
                    <span>🎉</span>
                    <div>
                      <small>Selected recipient</small>
                      <strong>
                        {item.selected_recipient_username}
                      </strong>
                    </div>
                  </div>
                )}

                {item.status === 'AVAILABLE' && (
                  <button
                    className="my-shared-view-btn"
                    onClick={() => handleViewInterests(item.id)}
                  >
                    {expandedItem === item.id
                      ? 'Hide Interested Members'
                      : 'View Interested Members'}
                  </button>
                )}

                <button
                  className="my-shared-delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  🗑 Delete Listing
                </button>

                {expandedItem === item.id &&
                  item.status === 'AVAILABLE' && (
                    <div className="my-shared-interests-panel">
                      <h4>Interested Members</h4>

                      {interests[item.id]?.length > 0 ? (
                        interests[item.id].map(interest => (
                          <div
                            className="my-shared-interest-member"
                            key={interest.id}
                          >
                            <div className="my-shared-member-info">
                              <span className="my-shared-avatar">
                                {interest.member_username
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>

                              <div>
                                <strong>
                                  {interest.member_username}
                                </strong>
                                <small>Interested in this item</small>
                              </div>
                            </div>

                            <button
                              className="my-shared-select-btn"
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
                                : 'Select Recipient'}
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="my-shared-no-interest">
                          Nobody has expressed interest yet.
                        </p>
                      )}
                    </div>
                  )}

              </div>
            </article>
          ))}
        </div>

        <div className="my-shared-footer">
          <span>💜</span>
          <p>Your generosity makes our community a better place.</p>
        </div>

      </main>
    </div>
  );
}

export default MySharedItems;


import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './CommunitySharing.css';

function CommunitySharing() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [interestedItems, setInterestedItems] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const response = await API.get('items/');
      setItems(response.data);
      setError('');
    } catch {
      setError('Unable to load shared items. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === 'image' && files && files[0]) {
      const file = files[0];

      if (!file.type.startsWith('image/')) {
        setMessage('Please select an image file only.');
        e.target.value = '';
        setFormData(previous => ({ ...previous, image: null }));
        return;
      }

      setMessage('');
      setFormData(previous => ({ ...previous, image: file }));
      return;
    }

    setFormData(previous => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.image) {
      setMessage('Please select an item photo.');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('image', formData.image);

    setSubmitting(true);
    setMessage('');

    try {
      await API.post('items/', data);

      setMessage('Your item has been shared successfully! 🎉');

      setFormData({
        title: '',
        description: '',
        image: null,
      });

      e.target.reset();
      setShowForm(false);
      await fetchItems();
    } catch (err) {
      setMessage(
        err.response?.data?.detail ||
        'Unable to share your item. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleNeedItem(itemId) {
    try {
      const response = await API.post(`items/${itemId}/need/`);

      setInterestedItems(previous =>
        previous.includes(itemId)
          ? previous
          : [...previous, itemId]
      );

      setMessage(response.data.message);
      await fetchItems();
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Unable to express interest. Please try again.'
      );
    }
  }

  function getImageUrl(image) {
    if (!image) return '';

    return image.startsWith('http')
      ? image
      : `http://127.0.0.1:8000${image}`;
  }

  return (
    <div className="community-sharing-page">

      <section className="sharing-hero">
        <div className="sharing-hero-content">
          <span className="sharing-tag">GIVE • SHARE • CARE</span>
          <h1>Sharing Makes Our Community Stronger 💜</h1>
          <p>
            Your unused things could become someone's greatest help.
            Share something today and spread kindness!
          </p>

          <button
            className="sharing-main-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Close Form' : '+ Share an Item'}
          </button>
        </div>
        <div className="sharing-hero-decoration">💜</div>
      </section>

      <main className="sharing-content">

        {message && (
          <div className="sharing-message">
            <span>{message}</span>
            <button onClick={() => setMessage('')}>×</button>
          </div>
        )}

        {showForm && (
          <section className="sharing-form-card">
            <div className="sharing-form-heading">
              <span className="sharing-form-icon">🎁</span>
              <div>
                <h2>Share Something Special</h2>
                <p>Give your unused item a new purpose.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="sharing-form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Example: School bag"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sharing-form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  rows="4"
                  placeholder="Tell others about your item..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sharing-form-group">
                <label>Item Photo</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  required
                />
                <small>Please upload an image file only.</small>
              </div>

              <button
                type="submit"
                className="sharing-submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Sharing...' : 'Share with Community 💜'}
              </button>
            </form>
          </section>
        )}

        <div className="sharing-section-heading">
          <div>
            <span className="sharing-tag">COMMUNITY MARKETPLACE</span>
            <h2>Available Items</h2>
            <p>Discover things shared by people in your community.</p>
          </div>
          <span className="sharing-item-count">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {loading && (
          <div className="sharing-empty-state">
            <div className="sharing-loader"></div>
            <p>Finding shared items...</p>
          </div>
        )}

        {error && (
          <div className="sharing-error">{error}</div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="sharing-empty-state">
            <span>🎁</span>
            <h3>No items shared yet!</h3>
            <p>
              Be the first to share something and make someone's day.
            </p>
          </div>
        )}

        <div className="sharing-items-grid">
          {items.map(item => (
            <article className="sharing-item-card" key={item.id}>
              <div className="sharing-image-wrapper">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.title}
                />
                <span className="sharing-image-label">
                  {item.status === 'GIVEN_AWAY' ? 'Given Away' : 'Available'}
                </span>
              </div>

              <div className="sharing-item-body">
                <h3>{item.title}</h3>
                <p className="sharing-item-description">
                  {item.description}
                </p>

                <div className="sharing-owner">
                  <span>👤</span>
                  <span>Shared by <strong>{item.owner_username}</strong></span>
                </div>

                <div className="sharing-interest">
                  ❤️ {item.interest_count} interested
                </div>

                {item.status === 'GIVEN_AWAY' ? (
                  <div className="sharing-selected-message">
                    🎉 The owner has selected you to receive this item!
                  </div>
                ) : (
                  <button
                    className="sharing-need-btn"
                    disabled={interestedItems.includes(item.id)}
                    onClick={() => handleNeedItem(item.id)}
                  >
                    {interestedItems.includes(item.id)
                      ? 'Interest Sent ✓'
                      : 'I Need This ❤️'}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="sharing-footer">
          <span>💜</span>
          <p>A little sharing can make a big difference.</p>
        </div>

      </main>
    </div>
  );
}

export default CommunitySharing;

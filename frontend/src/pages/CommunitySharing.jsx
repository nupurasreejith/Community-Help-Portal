
import React, { useEffect, useState } from 'react';
import API from '../services/api';

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

      setInterestedItems((previous) =>
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
    <div className="container py-5">

      <div className="text-center mb-5">
        <h1 className="fw-bold" style={{ color: '#51458c' }}>
          Community Sharing 💜
        </h1>

        <p className="text-muted">
          Share what you no longer need. Help someone who needs it!
        </p>

        <button
          className="btn text-white mt-3"
          style={{ backgroundColor: '#51458c' }}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Close Form' : '+ Share an Item'}
        </button>
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

      {showForm && (
        <div className="card shadow-sm border-0 mb-5">
          <div className="card-body p-4">

            <h4 className="fw-bold mb-4" style={{ color: '#51458c' }}>
              Share Something with the Community
            </h4>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">Item Name</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Example: School bag"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  placeholder="Describe the item..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Item Photo</label>
                <input
                  type="file"
                  name="image"
                  className="form-control"
                  accept="image/*"
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn text-white"
                style={{ backgroundColor: '#51458c' }}
                disabled={submitting}
              >
                {submitting ? 'Sharing...' : 'Post Item'}
              </button>

            </form>
          </div>
        </div>
      )}

      <h3 className="fw-bold mb-4">Available Items</h3>

      {loading && (
        <p className="text-center">Loading items...</p>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="text-center py-5">
          <h5>No items shared yet!</h5>
          <p className="text-muted">
            Be the first person to share something with the community.
          </p>
        </div>
      )}

      <div className="row g-4">

        {items.map((item) => (
          <div className="col-md-4" key={item.id}>

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

                <p className="text-muted">
                  {item.description}
                </p>

                <p className="small mb-2">
                  Shared by: <strong>{item.owner_username}</strong>
                </p>

                <p className="small text-muted">
                  ❤️ {item.interest_count} interested
                </p>

                {item.status === 'GIVEN_AWAY' ? (

                  <div className="alert alert-success mt-auto mb-0">
                    🎉 The owner has selected you to receive this item!
                  </div>

                ) : (

                  <button
                    className="btn text-white mt-auto"
                    style={{ backgroundColor: '#51458c' }}
                    disabled={interestedItems.includes(item.id)}
                    onClick={() => handleNeedItem(item.id)}
                  >
                    {interestedItems.includes(item.id)
                      ? 'Interest Sent ✓'
                      : 'I Need This ❤️'}
                  </button>

                )}

              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default CommunitySharing;

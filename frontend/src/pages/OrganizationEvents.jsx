
import React, { useEffect, useState } from 'react';
import API from '../services/api';

function OrganizationEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  const initialForm = {
    title: '',
    description: '',
    category: 'HEALTH',
    event_date: '',
    start_time: '',
    end_time: '',
    venue: '',
    contact_details: '',
    max_participants: '',
    max_volunteers: '',
    poster: null,
  };

  const [form, setForm] = useState(initialForm);

  const categories = [
    { value: 'HEALTH', label: 'Health' },
    { value: 'EDUCATION', label: 'Education' },
    { value: 'FOOD', label: 'Food Distribution' },
    { value: 'ENVIRONMENT', label: 'Environment' },
    { value: 'DONATION', label: 'Donation Drive' },
    { value: 'COMMUNITY', label: 'Community Activity' },
    { value: 'OTHER', label: 'Other' },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await API.get('events/my-events/');
      setEvents(response.data);
    } catch (error) {
    console.error(error);
        setError('Unable to load your events.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (name === 'poster' && files && files[0]) {
    const file = files[0];

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file for the event poster.');
      e.target.value = '';
      setForm(previous => ({ ...previous, poster: null }));
      return;
    }

    setError('');
    setForm(previous => ({ ...previous, poster: file }));
    return;
  }

  setForm(previous => ({
    ...previous,
    [name]: value,
  }));
};

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!editingId && !form.poster) {
      setError('Please upload an event poster.');
      return;
    }

    if (form.end_time <= form.start_time) {
      setError('End time must be later than start time.');
      return;
    }

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    try {
      setSaving(true);

      if (editingId) {
        await API.patch(`events/${editingId}/`, formData);
        setMessage('Event updated successfully!');
      } else {
        await API.post('events/', formData);
        setMessage('Event published successfully!');
      }

      resetForm();
      fetchEvents();

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        'Unable to save the event. Please check the details.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event.id);

    setForm({
      title: event.title,
      description: event.description,
      category: event.category,
      event_date: event.event_date,
      start_time: event.start_time,
      end_time: event.end_time,
      venue: event.venue,
      contact_details: event.contact_details,
      max_participants: event.max_participants ?? '',
      max_volunteers: event.max_volunteers ?? '',
      poster: null,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getImageUrl = (image) => {
    if (!image) return '';
    return image.startsWith('http')
      ? image
      : `http://127.0.0.1:8000${image}`;
  };

  const viewRegistrations = async (event) => {
  try {
    setError('');
    setSelectedEvent(event);

    const response = await API.get(
      `events/${event.id}/registrations/`
    );

    setRegistrations(response.data);
  } catch (error) {
    setSelectedEvent(null);
    console.error(error);
    setError('Unable to load event registrations.');
  }
};

  return (
    <div className="container py-5">

      <div className="mb-4">
        <h2 className="fw-bold">Organization Events</h2>
        <p className="text-muted">
          Create community events and manage registrations.
        </p>
      </div>

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* EVENT FORM */}

      <div className="card border-0 shadow-sm rounded-4 mb-5">
        <div className="card-body p-4">

          <h4 className="fw-bold mb-4">
            {editingId ? 'Edit Event' : 'Create a New Event'}
          </h4>

          <form onSubmit={handleSubmit}>

            <div className="row g-3">

              <div className="col-md-6">
                <label className="form-label">Event Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={form.title}
                  onChange={handleChange}
                  maxLength={200}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Event Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((category) => (
                    <option
                      key={category.value}
                      value={category.value}
                    >
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Event Date</label>
                <input
                  type="date"
                  name="event_date"
                  className="form-control"
                  min={new Date().toLocaleDateString('en-CA')}
                  value={form.event_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  name="start_time"
                  className="form-control"
                  value={form.start_time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  name="end_time"
                  className="form-control"
                  value={form.end_time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Venue</label>
                <input
                  type="text"
                  name="venue"
                  className="form-control"
                  value={form.venue}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Contact Details</label>
                <input
                  type="text"
                  name="contact_details"
                  className="form-control"
                  value={form.contact_details}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Maximum Participants (Optional)
                </label>
                <input
                  type="number"
                  name="max_participants"
                  className="form-control"
                  min="1"
                  value={form.max_participants}
                  onChange={handleChange}
                  placeholder="No limit"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Maximum Volunteers (Optional)
                </label>
                <input
                  type="number"
                  name="max_volunteers"
                  className="form-control"
                  min="1"
                  value={form.max_volunteers}
                  onChange={handleChange}
                  placeholder="No limit"
                />
              </div>

              <div className="col-12">
                <label className="form-label">
                  Event Poster
                </label>
                <input
                  type="file"
                  name="poster"
                  className="form-control"
                  accept="image/*"
                  onChange={handleChange}
                  required={!editingId}
                />
                {editingId && (
                  <small className="text-muted">
                    Leave empty to keep the existing poster.
                  </small>
                )}
              </div>

            </div>

            <div className="d-flex gap-2 mt-4">

              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : editingId
                    ? 'Update Event'
                    : 'Publish Event'}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}

            </div>

          </form>
        </div>
      </div>

      {/* ORGANIZATION EVENTS */}

      <h4 className="fw-bold mb-4">My Published Events</h4>

      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <div className="alert alert-info">
          You haven't published any events yet.
        </div>
      ) : (

        <div className="row g-4">

          {events.map((event) => (

            <div className="col-md-6 col-lg-4" key={event.id}>

              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">

                {event.poster && (
                  <img
                    src={getImageUrl(event.poster)}
                    alt={event.title}
                    style={{
                      height: '210px',
                      objectFit: 'cover',
                    }}
                  />
                )}

                <div className="card-body">

                  <span className="badge bg-primary mb-2">
                    {event.category}
                  </span>

                  <h5 className="fw-bold">{event.title}</h5>

                  <p className="text-muted small">
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

                  <div className="d-flex justify-content-between mb-3">

                    <span className="badge bg-info text-dark">
                      Members: {event.member_count}
                    </span>

                    <span className="badge bg-success">
                      Volunteers: {event.volunteer_count}
                    </span>

                  </div>

                  <button
                    className="btn btn-outline-primary btn-sm w-100 mb-2"
                    onClick={() => viewRegistrations(event)}
                  >
                    View Registrations
                  </button>

                  <button
                    className="btn btn-outline-secondary btn-sm w-100"
                    onClick={() => handleEdit(event)}
                  >
                    Edit Event
                  </button>

                </div>
              </div>
            </div>

          ))}

        </div>
      )}

      {/* REGISTRATION DETAILS */}

      {selectedEvent && (

        <div className="card border-0 shadow-sm rounded-4 mt-5">

          <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold">
                Registrations: {selectedEvent.title}
              </h4>

              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>
            </div>

            <h5 className="text-primary">
              Registered Members
            </h5>

            {registrations.filter(
              (r) => r.registration_type === 'MEMBER'
            ).length === 0 ? (
              <p className="text-muted">No members registered yet.</p>
            ) : (
              registrations
                .filter((r) => r.registration_type === 'MEMBER')
                .map((r) => (
                  <div key={r.id} className="border rounded p-3 mb-2">
                    {r.username}
                  </div>
                ))
            )}

            <hr />

            <h5 className="text-success">
              Registered Volunteers
            </h5>

            {registrations.filter(
              (r) => r.registration_type === 'VOLUNTEER'
            ).length === 0 ? (
              <p className="text-muted">No volunteers registered yet.</p>
            ) : (
              registrations
                .filter((r) => r.registration_type === 'VOLUNTEER')
                .map((r) => (
                  <div key={r.id} className="border rounded p-3 mb-2">
                    {r.username}
                  </div>
                ))
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default OrganizationEvents;

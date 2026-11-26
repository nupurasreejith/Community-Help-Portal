
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './OrganizationEvents.css';

function OrganizationEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);

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
      setRegistrations([]);
      setRegistrationsLoading(true);

      const response = await API.get(
        `events/${event.id}/registrations/`
      );

      setRegistrations(response.data);
    } catch (error) {
      setSelectedEvent(null);
      console.error(error);
      setError('Unable to load event registrations.');
    } finally {
      setRegistrationsLoading(false);
    }
  };

  const formatCategory = (category) => {
    return categories.find(item => item.value === category)?.label || category;
  };

  return (
    <div className="organization-events-page">

      {/* HERO */}
      <section className="org-events-hero">
        <div className="org-events-hero-content">
          <span className="org-events-tag">ORGANIZATION WORKSPACE</span>
          <h1>Let's Create Something Meaningful.</h1>
          <p>
            Plan community events, bring people together and turn
            your ideas into real-world impact.
          </p>
          {/* <button
            type="button"
            className="org-events-hero-btn"
            onClick={() => {
              resetForm();
              document.getElementById('org-event-form')?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
          >
            Create New Event <span>＋</span>
          </button> */}
        </div>

        <div className="org-events-hero-art">
          <div className="org-events-art-circle">🎉</div>
          <span className="org-events-art-icon art-calendar">📅</span>
          <span className="org-events-art-icon art-heart">💜</span>
          <span className="org-events-art-icon art-people">👥</span>
        </div>
      </section>

      <main className="org-events-content">

        {/* MESSAGES */}
        {message && (
          <div className="org-events-success">
            <span>✓</span> {message}
            <button onClick={() => setMessage('')}>×</button>
          </div>
        )}

        {error && (
          <div className="org-events-error">
            <span>!</span> {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* FORM SECTION */}
        <section className="org-event-form-section" id="org-event-form">
          <div className="org-section-heading">
            <div>
              <span>EVENT PLANNER</span>
              <h2>{editingId ? 'Update Your Event' : 'Create a New Event'}</h2>
              <p>
                Fill in the details below to share your event with the community.
              </p>
            </div>
            <div className="org-section-heading-icon">📝</div>
          </div>

          <form onSubmit={handleSubmit} className="org-event-form">

            <div className="org-form-section-title">
              <span>01</span>
              <div>
                <h3>Basic Information</h3>
                <p>Tell everyone what your event is about.</p>
              </div>
            </div>

            <div className="org-form-grid">
              <div className="org-form-field">
                <label>Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  maxLength={200}
                  placeholder="Enter your event title"
                  required
                />
              </div>

              <div className="org-form-field">
                <label>Event Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="org-form-field full-width">
                <label>Event Description *</label>
                <textarea
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your event and what participants can expect..."
                  required
                />
              </div>
            </div>

            <div className="org-form-divider" />

            <div className="org-form-section-title">
              <span>02</span>
              <div>
                <h3>Date & Location</h3>
                <p>Let participants know when and where it happens.</p>
              </div>
            </div>

            <div className="org-form-grid">
              <div className="org-form-field">
                <label>Event Date *</label>
                <input
                  type="date"
                  name="event_date"
                  min={new Date().toLocaleDateString('en-CA')}
                  value={form.event_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="org-form-field">
                <label>Venue *</label>
                <input
                  type="text"
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  placeholder="Enter event venue"
                  required
                />
              </div>

              <div className="org-form-field">
                <label>Start Time *</label>
                <input
                  type="time"
                  name="start_time"
                  value={form.start_time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="org-form-field">
                <label>End Time *</label>
                <input
                  type="time"
                  name="end_time"
                  value={form.end_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="org-form-divider" />

            <div className="org-form-section-title">
              <span>03</span>
              <div>
                <h3>Registrations & Contact</h3>
                <p>Set optional limits and provide contact information.</p>
              </div>
            </div>

            <div className="org-form-grid">
              <div className="org-form-field">
                <label>Contact Details *</label>
                <input
                  type="text"
                  name="contact_details"
                  value={form.contact_details}
                  onChange={handleChange}
                  placeholder="Phone number or email"
                  required
                />
              </div>

              <div className="org-form-field">
                <label>Maximum Participants</label>
                <input
                  type="number"
                  name="max_participants"
                  min="1"
                  value={form.max_participants}
                  onChange={handleChange}
                  placeholder="No limit"
                />
              </div>

              <div className="org-form-field">
                <label>Maximum Volunteers</label>
                <input
                  type="number"
                  name="max_volunteers"
                  min="1"
                  value={form.max_volunteers}
                  onChange={handleChange}
                  placeholder="No limit"
                />
              </div>
            </div>

            <div className="org-form-divider" />

            <div className="org-form-section-title">
              <span>04</span>
              <div>
                <h3>Event Poster</h3>
                <p>Upload an image to make your event stand out.</p>
              </div>
            </div>

            <div className="org-poster-upload">
              <div className="org-poster-icon">🖼️</div>
              <div className="org-poster-text">
                <label htmlFor="org-event-poster">
                  {form.poster ? form.poster.name : 'Choose Event Poster'}
                </label>
                <p>
                  {editingId
                    ? 'Leave empty to keep the existing poster.'
                    : 'Upload an image file for your event.'}
                </p>
              </div>
              <input
                id="org-event-poster"
                type="file"
                name="poster"
                accept="image/*"
                onChange={handleChange}
                required={!editingId}
              />
            </div>

            <div className="org-form-actions">
              <button
                type="submit"
                className="org-publish-btn"
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : editingId
                    ? 'Update Event'
                    : 'Publish Event'}
                <span>→</span>
              </button>

              {editingId && (
                <button
                  type="button"
                  className="org-cancel-btn"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}
            </div>

          </form>
        </section>

        {/* PUBLISHED EVENTS */}
        <section className="org-published-section">
          <div className="org-section-heading">
            <div>
              <span>YOUR ACTIVITIES</span>
              <h2>My Published Events</h2>
              <p>Keep track of the events organized by your organization.</p>
            </div>

            <div className="org-event-count">
              <strong>{events.length}</strong>
              <span>Events</span>
            </div>
          </div>

          {loading ? (
            <div className="org-events-empty">
              <span>⏳</span>
              <h3>Loading your events...</h3>
            </div>
          ) : events.length === 0 ? (
            <div className="org-events-empty">
              <span>📅</span>
              <h3>No events published yet</h3>
              <p>
                Your community journey starts with your first event.
              </p>
              <button
                type="button"
                onClick={() => document.getElementById('org-event-form')?.scrollIntoView({
                  behavior: 'smooth',
                })}
              >
                Create Your First Event
              </button>
            </div>
          ) : (
            <div className="org-events-grid">
              {events.map(event => (
                <article className="org-event-card" key={event.id}>
                  {event.poster ? (
                    <img
                      className="org-event-poster"
                      src={getImageUrl(event.poster)}
                      alt={event.title}
                    />
                  ) : (
                    <div className="org-event-poster-placeholder">📅</div>
                  )}

                  <div className="org-event-card-body">
                    <span className="org-event-category">
                      {formatCategory(event.category)}
                    </span>

                    <h3>{event.title}</h3>

                    <p className="org-event-description">
                      {event.description}
                    </p>

                    <div className="org-event-meta">
                      <p><span>📅</span> {event.event_date}</p>
                      <p><span>🕒</span> {event.start_time} - {event.end_time}</p>
                      <p><span>📍</span> {event.venue}</p>
                    </div>

                    <div className="org-event-registration-counts">
                      <div>
                        <strong>{event.member_count ?? 0}</strong>
                        <span>Members</span>
                      </div>
                      <div>
                        <strong>{event.volunteer_count ?? 0}</strong>
                        <span>Volunteers</span>
                      </div>
                    </div>

                    <div className="org-event-card-actions">
                      <button
                        type="button"
                        className="org-view-registrations-btn"
                        onClick={() => viewRegistrations(event)}
                      >
                        View Registrations
                      </button>

                      <button
                        type="button"
                        className="org-edit-event-btn"
                        onClick={() => handleEdit(event)}
                      >
                        Edit Event
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* REGISTRATIONS */}
        {selectedEvent && (
          <section className="org-registrations-section">
            <div className="org-registrations-header">
              <div>
                <span>EVENT PARTICIPANTS</span>
                <h2>{selectedEvent.title}</h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedEvent(null);
                  setRegistrations([]);
                }}
              >
                Close ×
              </button>
            </div>

            {registrationsLoading ? (
              <p className="org-registration-empty">Loading registrations...</p>
            ) : (
              <div className="org-registration-columns">
                <div className="org-registration-group">
                  <h3>👥 Registered Members</h3>

                  {registrations.filter(
                    r => r.registration_type === 'MEMBER'
                  ).length === 0 ? (
                    <p className="org-registration-empty">
                      No members registered yet.
                    </p>
                  ) : (
                    registrations
                      .filter(r => r.registration_type === 'MEMBER')
                      .map(r => (
                        <div className="org-registration-person" key={r.id}>
                          <span>👤</span>
                          {r.username}
                        </div>
                      ))
                  )}
                </div>

                <div className="org-registration-group">
                  <h3>💜 Registered Volunteers</h3>

                  {registrations.filter(
                    r => r.registration_type === 'VOLUNTEER'
                  ).length === 0 ? (
                    <p className="org-registration-empty">
                      No volunteers registered yet.
                    </p>
                  ) : (
                    registrations
                      .filter(r => r.registration_type === 'VOLUNTEER')
                      .map(r => (
                        <div className="org-registration-person" key={r.id}>
                          <span>🤝</span>
                          {r.username}
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </section>
        )}

      </main>
    </div>
  );
}

export default OrganizationEvents;

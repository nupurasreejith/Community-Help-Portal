
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './MemberDashboard.css';

function MemberDashboard() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('accounts/profile/')
      .then((response) => {
        setProfile(response.data);
      })
      .catch((error) => {
        console.error(error);
        setError('Unable to load profile. Please login again.');
      });
  }, []);

  const dashboardCards = [
    {
      icon: '🤝',
      title: 'My Help Requests',
      description: 'Create and track your help requests.',
      link: '/my-requests',
      button: 'View Requests',
      style: 'purple',
    },
    {
      icon: '💜',
      title: 'Create Help Request',
      description: 'Reach out to your community when you need support.',
      link: '/create-request',
      button: 'Create Request',
      style: 'pink',
    },
    {
      icon: '🎁',
      title: 'Community Sharing',
      description: 'Discover useful items shared by your community.',
      link: '/community-sharing',
      button: 'Explore Items',
      style: 'orange',
    },
    {
      icon: '🌍',
      title: 'Community Events',
      description: 'Discover and participate in meaningful activities.',
      link: '/community-events',
      button: 'View Events',
      style: 'blue',
    },
    {
      icon: '📅',
      title: 'My Event Registrations',
      description: 'Manage the events you have registered for.',
      link: '/my-event-registrations',
      button: 'My Registrations',
      style: 'green',
    },
  ];

  return (
    <div className="member-dashboard">

      {/* Welcome Banner */}
      <section className="member-hero">
        <div className="member-hero-content">
          <span className="member-hero-tag">
            COMMUNITY CONNECT
          </span>

          <h1>
            Welcome to Your Community
            {profile?.first_name ? `, ${profile.first_name}` : ''}!
          </h1>

          <p>
            A place where kindness connects people.
            Explore, participate and make a difference.
          </p>
        </div>

        <div className="member-hero-decoration">
          <span>💜</span>
          <span>🤝</span>
          <span>🌷</span>
        </div>
      </section>

      <main className="member-dashboard-content">

        {/* Error Message */}
        {error && (
          <div className="member-error-message">
            {error}
          </div>
        )}

        {/* Profile Section */}
        <section className="member-profile-section">
          <div className="member-section-heading">
            <div>
              <span className="member-eyebrow">YOUR ACCOUNT</span>
              <h2>Your Profile</h2>
            </div>

            <span className="profile-status">
              ● Member Account
            </span>
          </div>

          {profile ? (
            <div className="member-profile-card">
              <div className="profile-avatar">
                {(profile.first_name || profile.username || 'M')
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="profile-main-info">
                <h3>
                  {profile.first_name || profile.username}
                  {profile.last_name ? ` ${profile.last_name}` : ''}
                </h3>

                <p className="profile-welcome-text">
                  Welcome back! Here's your account information.
                </p>

                <div className="profile-details-grid">
                  <div className="profile-detail">
                    <span>USERNAME</span>
                    <strong>{profile.username}</strong>
                  </div>

                  <div className="profile-detail">
                    <span>EMAIL ADDRESS</span>
                    <strong>{profile.email || 'Not added'}</strong>
                  </div>

                  <div className="profile-detail">
                    <span>PHONE NUMBER</span>
                    <strong>{profile.phone || 'Not added'}</strong>
                  </div>

                  <div className="profile-detail">
                    <span>ACCOUNT TYPE</span>
                    <strong>{profile.role}</strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            !error && (
              <div className="member-profile-loading">
                <span>⏳</span>
                Loading your profile...
              </div>
            )
          )}
        </section>

        {/* Dashboard Features */}
        <section className="member-features-section">
          <div className="member-section-heading">
            <div>
              <span className="member-eyebrow">WHAT WOULD YOU LIKE TO DO?</span>
              <h2>Your Community Space</h2>
              <p>Everything you need, all in one place.</p>
            </div>
          </div>

          <div className="member-features-grid">
            {dashboardCards.map((card, index) => (
              <article
                className={`member-feature-card ${card.style}`}
                key={card.title}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon">
                  {card.icon}
                </div>

                <h3>{card.title}</h3>

                <p>{card.description}</p>

                <a href={card.link} className="feature-button">
                  {card.button}
                  <span>→</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* Bottom Message */}
        <section className="member-bottom-message">
          <span>💜</span>
          <div>
            <h3>Small Acts. Big Impact.</h3>
            <p>
              Together, we can build a caring and supportive community.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}

export default MemberDashboard;

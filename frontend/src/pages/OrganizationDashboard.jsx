
import React from 'react';
import './OrganizationDashboard.css';

function OrganizationDashboard() {
  return (
    <div className="organization-dashboard">

      <section className="organization-hero">
        <div className="organization-hero-content">
          <span className="organization-tag">
            COMMUNITY CONNECT
          </span>

          <h1>Make Your Community Stronger.</h1>

          <p>
            Every great change begins with people coming together.
            Create meaningful events and bring your community closer.
          </p>

          {/* <a href="/organization-events" className="organization-hero-btn">
            Explore Event Management →
          </a> */}
        </div>

        <div className="organization-hero-visual">
          <div className="organization-visual-circle">
            <span>🤝</span>
          </div>
          <div className="organization-floating-icon icon-one">📅</div>
          <div className="organization-floating-icon icon-two">💜</div>
          <div className="organization-floating-icon icon-three">🎉</div>
        </div>
      </section>

      <main className="organization-content">

        <div className="organization-section-heading">
          <span>YOUR WORKSPACE</span>
          <h2>Bring Your Ideas to Life</h2>
          <p>
            One place to plan events, connect people and create impact.
          </p>
        </div>

        <section className="organization-event-feature">
          <div className="organization-feature-icon">📋</div>

          <div className="organization-feature-content">
            <span>EVENT MANAGEMENT</span>
            <h3>Manage Your Community Events</h3>
            <p>
              Organize blood donation camps, educational programmes,
              food drives and other community activities. Create events,
              upload posters and manage member and volunteer registrations.
            </p>

            <a href="/organization-events">
              Create & Manage Events <span>→</span>
            </a>
          </div>

          <div className="organization-feature-decoration">
            📆
          </div>
        </section>

        <section className="organization-steps">
          <div className="organization-step">
            <div className="organization-step-icon">✏️</div>
            <h4>01. Create an Event</h4>
            <p>Share your event details, venue, date and poster.</p>
          </div>

          <div className="organization-step">
            <div className="organization-step-icon">👥</div>
            <h4>02. Manage Registrations</h4>
            <p>Connect with members and volunteers joining your event.</p>
          </div>

          <div className="organization-step">
            <div className="organization-step-icon">💜</div>
            <h4>03. Make an Impact</h4>
            <p>Bring people together to make a positive difference.</p>
          </div>
        </section>

        <section className="organization-bottom-banner">
          <div>
            <h3>Small Actions. Greater Impact.</h3>
            <p>
              Your next community initiative could change someone's life.
            </p>
          </div>
          <span>🌷</span>
        </section>

      </main>
    </div>
  );
}

export default OrganizationDashboard;

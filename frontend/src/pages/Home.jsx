
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-overlay"></div>

        {/* Animated floating circles */}
        <div className="hero-decoration decoration-one"></div>
        <div className="hero-decoration decoration-two"></div>
        <div className="hero-decoration decoration-three"></div>

        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-badge">
              Together for a better tomorrow
            </span>

            <h1>
              Stronger Together.
              <span> Better Together.</span>
            </h1>

            <p>
              A little kindness can create a big difference.
              Connect with people, offer help, share resources
              and build a stronger community.
            </p>

            <div className="hero-buttons">
              <Link to="/register" className="home-btn">
                Join Our Community →
              </Link>

              <Link to="/login" className="home-btn-outline">
                Login
              </Link>
            </div>

            <div className="hero-caption">
              ♥ Helping hands create stronger communities.
            </div>
          </div>
        </div>

        <div className="hero-scroll">
          <span>Discover more</span>
          <div className="scroll-line"></div>
        </div>
      </section>

{/* Community Shortcut Panel */}
<section className="home-shortcuts">
  <div className="container">
    <div className="shortcut-grid">

      <Link to="/create-request" className="shortcut-item">
        <span className="shortcut-icon">💜</span>
        <h5>Get Help</h5>
        <p>For Your Needs</p>
      </Link>

      <Link to="/volunteer-dashboard" className="shortcut-item">
        <span className="shortcut-icon">🤝</span>
        <h5>Volunteer</h5>
        <p>Share Your Time</p>
      </Link>

      <Link to="/community-sharing" className="shortcut-item">
        <span className="shortcut-icon">🎁</span>
        <h5>Share Items</h5>
        <p>Give & Receive</p>
      </Link>

      <Link to="/community-events" className="shortcut-item">
        <span className="shortcut-icon">📅</span>
        <h5>Join Events</h5>
        <p>Stay Connected</p>
      </Link>

    </div>
  </div>
</section>


      
{/* Impact Section */}
<section className="impact-section">
  <div className="container text-center">
    <span className="impact-label">OUR PURPOSE</span>
    <h2>
      Every Helping Hand
      <span> Matters.</span>
    </h2>
    <p>
      We believe that a stronger community begins
      when people come together, care for one another
      and turn kindness into action.
    </p>
    <div className="impact-heart">♥</div>
  </div>
</section>


      
{/* How It Works */}
<section className="home-section how-section">
  <div className="container">
    <div className="section-heading">
      <span>GET STARTED</span>
      <h2>How Community Connect Works</h2>
      <p>Three simple steps to make a difference.</p>
    </div>

    <div className="row g-4 justify-content-center">

      <div className="col-md-4">
        <div className="step-card">
          <div className="step-number">01</div>
          <h4>Create an Account</h4>
          <p>Join as a member, volunteer or organization.</p>
        </div>
      </div>

      <div className="col-md-4">
        <div className="step-card">
          <div className="step-number">02</div>
          <h4>Connect with Others</h4>
          <p>Request help, volunteer or share resources.</p>
        </div>
      </div>

      <div className="col-md-4">
        <div className="step-card">
          <div className="step-number">03</div>
          <h4>Make an Impact</h4>
          <p>Work together and create positive change.</p>
        </div>
      </div>

    </div>
  </div>
</section>


      
{/* Call to Action */}
<section className="home-cta">
  <div className="container text-center">
    <h2>Be Someone's Reason to Smile 💜</h2>
    <p>Your small contribution could change someone's day.</p>
    <Link to="/register" className="cta-button">
      Become a Part of Us →
    </Link>
  </div>
</section>


      {/* Footer */}
      <footer className="home-footer">
        <h5>Community Connect</h5>
        <p>Connecting people through kindness and support.</p>
        <small>© 2026 Community Connect. All rights reserved.</small>
      </footer>

    </div>
  );
}

export default Home;

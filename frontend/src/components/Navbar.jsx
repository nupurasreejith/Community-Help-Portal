
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

const isHomePage = location.pathname === '/';
const isLoginPage = location.pathname === '/login';
const isRegisterPage = location.pathname === '/register';

const isTransparentPage =
    isHomePage || isLoginPage || isRegisterPage; 

  useEffect(() => {
    function loadUser() {
      if (localStorage.getItem('accessToken')) {
        API.get('accounts/profile/')
          .then((response) => {
            setUser(response.data);
          })
          .catch(() => {
            setUser(null);
          });
      } else {
        setUser(null);
      }
    }

    loadUser();

    window.addEventListener('authChanged', loadUser);

    return () => {
      window.removeEventListener('authChanged', loadUser);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    setUser(null);
    window.dispatchEvent(new Event('authChanged'));

    navigate('/');
  }

  return (
    <nav className={`navbar navbar-expand-lg ${
  isTransparentPage ? 'home-navbar' : 'navbar-dark other-navbar'
}`}>
      <div className="container">

        <Link className="navbar-brand fw-bold" to="/">
          <span className="brand-symbol">♥</span>
          <span>Community Connect</span>
        </Link>

        <div className="navbar-nav ms-auto align-items-center">

          <Link className="nav-link" to="/">
            Home
          </Link>

          {!user && (
            <>
              <Link className="nav-link" to="/login">
                Login
              </Link>

              <Link
                className={`nav-link ${isHomePage ? 'nav-register' : ''}`}
                to="/register"
              >
                Register
              </Link>
            </>
          )}

          {user?.role === 'MEMBER' && (
            <>
              <Link className="nav-link" to="/member-dashboard">
                My Dashboard
              </Link>

              <Link className="nav-link" to="/community-sharing">
                Community Sharing
              </Link>

              <Link className="nav-link" to="/my-shared-items">
                My Shared Items
              </Link>
            </>
          )}

          {user?.role === 'VOLUNTEER' && (
            <>
              <Link className="nav-link" to="/volunteer-dashboard">
                Volunteer Dashboard
              </Link>

              <Link className="nav-link" to="/my-accepted-requests">
                Accepted Requests
              </Link>
            </>
          )}

          {user?.role === 'ORGANIZATION' && (
            <Link className="nav-link" to="/organization-dashboard">
              Organization Dashboard
            </Link>
          )}

          {user && (
            <button
              className="btn btn-outline-light ms-3"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;

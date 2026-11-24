
import React from 'react';

function OrganizationDashboard() {
  return (
    <div className="container py-5">
      <h2 className="fw-bold text-success">
        Organization Dashboard
      </h2>

      <p className="text-muted">
        Manage your community activities and events.
      </p>

      <div className="row mt-4">
        <div className="col-md-6 col-lg-4 mb-3">
          <div className="card shadow-sm p-4 h-100">
            <h4>Manage Events</h4>
            <p>
              Create events, upload posters and manage
              member and volunteer registrations.
            </p>

            <a
              href="/organization-events"
              className="btn btn-success"
            >
              Manage Events
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizationDashboard;

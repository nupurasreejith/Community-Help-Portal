import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MemberDashboard from './pages/MemberDashboard';
import CreateRequest from './pages/CreateRequest';
import MyRequests from './pages/MyRequests';
import VolunteerDashboard from './pages/VolunteerDashboard';
import MyAcceptedRequests from './pages/MyAcceptedRequests';
import CommunitySharing from './pages/CommunitySharing';
import MySharedItems from './pages/MySharedItems';
import OrganizationEvents from './pages/OrganizationEvents';
import OrganizationDashboard from './pages/OrganizationDashboard';
import CommunityEvents from './pages/CommunityEvents';
import MyEventRegistrations from './pages/MyEventRegistrations';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <>
      <Navbar />
      <Chatbot />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/member-dashboard" element={<MemberDashboard />} />
        <Route path="/create-request" element={<CreateRequest />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
        <Route path="/my-accepted-requests" element={<MyAcceptedRequests />} />
        <Route path="/community-sharing" element={<CommunitySharing />} />
        <Route path="/my-shared-items" element={<MySharedItems />} />
        <Route path="/organization-events" element={<OrganizationEvents />} />
        <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
        <Route path="/community-events" element={<CommunityEvents />} />
        <Route path="/my-event-registrations" element={<MyEventRegistrations />} />
      </Routes>
    </>
  );
}

export default App;

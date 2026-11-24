# Community Help Portal

A web-based platform designed to connect people who need help with volunteers and organizations willing to support their community.

## Features

- **User Authentication:** Secure registration and login with role-based access.
- **Help Requests:** Members can create and track help requests.
- **Smart Volunteer Matching:** Automatically dispatches help requests to available volunteers.
- **Community Sharing:** Share unwanted items and connect with people who need them.
- **Community Events:** Organizations can create events, and members and volunteers can register.
- **AI Chatbot:** Helps users navigate the portal and access its features.

## Technologies Used

### Frontend
- React.js
- JavaScript
- HTML
- CSS
- Bootstrap
- Vite

### Backend
- Python
- Django
- Django REST Framework
- MySQL

### Other Tools
- Git and GitHub
- JSON Web Tokens (JWT)

## Project Structure

```text
CommunityHelpPortal/
├── backend/
│   ├── accounts/
│   ├── chatbot/
│   ├── events/
│   ├── help_requests/
│   ├── item_sharing/
│   ├── volunteers/
│   ├── config/
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nupurasreejith/Community-Help-Portal.git
cd Community-Help-Portal
```

### 2. Backend Setup

```bash
cd backend
python -m venv my_env
my_env\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` folder and configure:

```env
SECRET_KEY=your_django_secret_key
DB_PASSWORD=your_mysql_password
```

Configure your MySQL database in Django settings, then run:

```bash
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Purpose

The goal of Community Help Portal is to encourage community participation by making it easier for people to request help, volunteer, share resources, and participate in social initiatives.

---

Developed as a full-stack web development project.
# ClinicQueue

ClinicQueue is a full-stack clinic appointment and queue management system. It gives patients a simple way to find doctors and request appointments, gives doctors tools to manage profiles and appointment queues, and gives admins a control area for doctor approvals and profile verification.

The project is organized as two separate applications:

- `frontend/` - React and Vite single-page application for patients, doctors, and admins.
- `backend/` - Node.js, Express, and MongoDB REST API that handles authentication, authorization, appointments, dashboards, and approval workflows.

## Project Overview

ClinicQueue supports three main user roles.

- Patients can register, log in, browse available doctors, view doctor details, request appointments, and track appointment status.
- Doctors can register, wait for admin approval, complete their professional profile, request profile updates, approve or reject appointment requests, complete visits, and view appointment history.
- Admins can monitor platform activity, approve or reject doctor registrations, and review doctor profile update requests.

Authentication is handled by the backend using JWTs stored in an HTTP-only cookie. The frontend sends requests with credentials enabled, and protected routes are separated by user role.

## Main Features

- Patient and doctor registration
- Doctor registration approval by admin
- Cookie-based JWT login and logout
- Role-based frontend routing
- Role-based backend API protection
- Doctor profile creation and admin verification flow
- Doctor profile update request flow
- Patient appointment request flow
- Doctor appointment approval, rejection, queue token assignment, and completion
- Patient, doctor, and admin dashboards
- Responsive healthcare-focused UI

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React icons

### Backend

- Node.js 22
- Express 5
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- cookie-parser
- cors
- helmet
- morgan
- dotenv

## Project Structure

```text
ClinicQueue/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── README.md
└── README.md
```

## Quick Start

Install and run the backend:

```bash
cd backend
npm install
npm run dev
```

Install and run the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend API base URL in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

The backend expects configuration in `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
COOKIE_MAX_AGE=604800000
CLIENT_URL=http://localhost:5173
```

## Documentation

- Read [frontend/README.md](frontend/README.md) for detailed frontend architecture, routes, pages, components, and API integration.
- Read [backend/README.md](backend/README.md) for detailed backend architecture, models, middleware, routes, request rules, and workflows.

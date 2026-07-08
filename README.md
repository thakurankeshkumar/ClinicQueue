# ClinicQueue

ClinicQueue is a full-stack clinic appointment management system with a React frontend and a Node.js/Express backend. It supports patient, doctor, and admin workflows with cookie-based authentication, role-based access, and a doctor approval flow.

## What This Project Does

- Patient registration and login
- Doctor registration with admin approval
- JWT authentication stored in an HTTP-only cookie
- Role-based routing for patient, doctor, and admin users
- Doctor profile creation and profile update approval flow
- Appointment request, approval, rejection, and completion flow
- Separate dashboards for patient, doctor, and admin users
- Frontend API integration with Axios and protected routes

## Tech Stack

### Backend

- Node.js
- Express.js 5
- MongoDB
- Mongoose
- JWT
- bcryptjs
- cookie-parser
- cors
- helmet
- morgan
- dotenv

### Frontend

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- react-hook-form
- zod
- sonner
- Zustand

## Project Structure

- `backend/` contains the Express API, database connection, auth middleware, controllers, models, and routes.
- `frontend/` contains the React UI, route guards, API clients, pages, layouts, and auth context.
- The root `README.md` gives the overall project overview and backend API summary.

## Frontend Overview

The frontend is a role-aware single-page app with these major routes:

- Public: landing page, login, register
- Patient: doctor list, doctor details, dashboard, my appointments
- Doctor: profile, dashboard, appointment requests, appointment history
- Admin: dashboard, pending doctors, profile requests

The app uses a shared Axios instance with `withCredentials: true` so browser cookies are sent with protected requests.

## Backend Overview

The backend exposes REST APIs under `/api/v1` and uses cookie-based auth for protected routes.

### Authentication flow

- Patients and doctors can register through `/api/v1/auth/register/patient` and `/api/v1/auth/register/doctor`.
- Login happens through `/api/v1/auth/login`.
- The backend sets an HTTP-only `accessToken` cookie.
- `/api/v1/auth/profile` returns the current authenticated user.
- `/api/v1/auth/logout` clears the auth cookie.

### Role rules

- `patient` users can browse doctors, book appointments, and view their own appointment history.
- `doctor` users can manage their profile, approve or reject appointments, and complete visits.
- `admin` users can approve doctors and review doctor profile update requests.

## Backend Setup

### Install dependencies

```bash
cd backend
npm install
```

### Environment variables

Create `backend/.env` with:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
COOKIE_MAX_AGE=604800000
CLIENT_URL=http://localhost:5173
```

`CLIENT_URL` should match the frontend origin so CORS works with cookies.

### Run the backend

```bash
npm run dev
```

## Frontend Setup

### Install dependencies

```bash
cd frontend
npm install
```

### Environment variables

Create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### Run the frontend

```bash
npm run dev
```

## Authentication and CORS

- Authentication is cookie-based, not token-in-local-storage based.
- Frontend requests must use `withCredentials: true`.
- The backend enables CORS with credentials and allows the configured `CLIENT_URL`.
- Protected endpoints require a valid `accessToken` cookie.
- Role-protected routes return access denied responses when the role does not match.

## API Base Paths

- `/api/v1/auth`
- `/api/v1/admin`
- `/api/v1/doctor`
- `/api/v1/patient`
- `/api/v1/appointment`

## Core Data Models

### User

- `name`
- `email`
- `password`
- `gender`
- `role` as `admin`, `doctor`, or `patient`
- `accountStatus` as `pending`, `approved`, or `rejected`

### Doctor

- `userId`
- `email`
- `phoneNumber`
- `specialization`
- `qualification`
- `experience`
- `consultationFee`
- `availableDays`
- `isAvailable`
- `isProfileComplete`
- `isProfileVerified`

### Appointment

- `patientId`
- `doctorId`
- `preferredDate`
- `appointmentDate`
- `appointmentTime`
- `duration`
- `tokenNumber`
- `reasonForVisit`
- `rejectionReason`
- `status`
- `completedAt`
- `rejectedAt`

### DoctorUpdateRequest

- `doctorId`
- `requestedBy`
- `phoneNumber`
- `specialization`
- `qualification`
- `experience`
- `consultationFee`
- `availableDays`
- `status`

## Main Backend Features

### Auth

- Patient and doctor registration
- Login with HTTP-only cookies
- Auth profile retrieval
- Logout

### Admin

- Dashboard counts
- Pending doctor approvals
- Approve or reject doctor registrations
- Review and approve or reject doctor profile update requests

### Doctor

- Create profile
- View profile
- Request profile updates
- Dashboard metrics
- Pending appointment requests
- Approve, reject, and complete appointments

### Patient

- View dashboard metrics
- Browse available doctors
- View doctor details
- View personal appointment list
- Book appointments

## Notes

- Doctor accounts are created with `accountStatus: pending` and must be approved before login.
- Patient accounts are created as approved by default.
- Doctor profile verification is tracked separately from account approval.
- Patient booking depends on doctors being available and having a complete profile.
- There is no cancel appointment route at the moment, even though the appointment schema includes a `cancelled` status.

## Developer

Developed by Ankesh Kumar.
# ClinicQueue Frontend

This folder contains the React frontend for ClinicQueue. It is a role-based single-page application built with Vite, React Router, Axios, Tailwind CSS, and a small authentication context.

The frontend is responsible for the user interface, route protection, dashboard layouts, form interactions, and communication with the backend REST API.

## Frontend Responsibilities

- Show the public landing page, login page, and registration page.
- Register patients immediately and register doctors into an admin approval flow.
- Restore authenticated sessions by calling the backend profile endpoint.
- Protect dashboard pages based on the authenticated user's role.
- Redirect logged-in users away from public auth pages to the correct dashboard.
- Provide separate workspaces for patients, doctors, and admins.
- Send authenticated API requests with browser cookies using Axios `withCredentials`.
- Display loading states, success states, error messages, and empty states.
- Keep the UI responsive across desktop and mobile screens.

## Tech Stack

- React 19 for UI rendering.
- Vite for local development and production builds.
- React Router DOM for client-side routing and redirects.
- Axios for API calls.
- Tailwind CSS 4 through the Vite plugin for styling.
- Lucide React for icons.
- React context for auth state.
- ESLint for JavaScript and React checks.

The package also includes `react-hook-form`, `zod`, `@hookform/resolvers`, `sonner`, and `zustand`. The current code mainly uses local React state and context for forms and authentication.

## Folder Structure

```text
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── axios.js
│   │   ├── doctor.js
│   │   └── patient.js
│   ├── components/
│   │   ├── FullScreenLoader.jsx
│   │   ├── PageTitle.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   ├── context/
│   │   └── auth/
│   │       ├── AuthContext.js
│   │       ├── AuthProvider.jsx
│   │       └── useAuth.js
│   ├── layouts/
│   │   └── DashboardLayout.jsx
│   ├── pages/
│   │   ├── admin/
│   │   ├── doctor/
│   │   ├── patient/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Application Entry Point

The app starts in `src/main.jsx`.

`main.jsx` renders the React application into `#root` and wraps it with:

- `StrictMode`
- `BrowserRouter`
- `AuthProvider`

This means every page has access to React Router navigation and authentication context.

## Routing

Routes are declared in `src/App.jsx`. Page components are loaded with `React.lazy`, and the route tree is wrapped in `Suspense` with `FullScreenLoader` as the fallback.

### Public Routes

```text
/          Landing page
/login     Login page
/register  Registration page
```

Public pages are wrapped with `PublicRoute`. If a user is already authenticated, `PublicRoute` redirects them to the correct dashboard:

- patient -> `/patient/dashboard`
- doctor -> `/doctor/dashboard`
- admin -> `/admin/dashboard`

### Patient Routes

```text
/patient/dashboard       Patient dashboard
/patient/doctors         Available doctors list
/patient/doctors/:id     Doctor details and appointment request form
/patient/appointments    Patient appointment history/status list
```

These routes are wrapped with `ProtectedRoute` and only allow the `patient` role.

### Doctor Routes

```text
/doctor/dashboard      Doctor dashboard
/doctor/profile        Doctor profile creation/update page
/doctor/appointments   Appointment requests and active queue page
/doctor/history        Completed and rejected appointment history
```

These routes are wrapped with `ProtectedRoute` and only allow the `doctor` role.

### Admin Routes

```text
/admin/dashboard          Admin dashboard
/admin/doctors            Pending doctor registrations
/admin/profile-requests   Pending doctor profile update requests
```

These routes are wrapped with `ProtectedRoute` and only allow the `admin` role.

## Authentication Flow

Authentication state is managed by `src/context/auth/AuthProvider.jsx`.

On first render, `AuthProvider` calls `getProfile()` from `src/api/auth.js`. That request goes to:

```text
GET /auth/profile
```

Because the Axios client uses `withCredentials: true`, the browser includes the HTTP-only `accessToken` cookie set by the backend. If the cookie is valid, the backend returns the current user and the frontend stores it in context.

The auth context exposes:

- `user` - the current user object or `null`.
- `setUser` - used after login/logout.
- `loading` - true while the profile request is running.
- `isAuthenticated` - true when a user exists.

The frontend does not store JWTs in local storage or session storage. The backend cookie is the source of the session.

## Route Guards

### ProtectedRoute

`src/components/ProtectedRoute.jsx` checks:

1. If auth is still loading, it displays `FullScreenLoader`.
2. If no user exists, it redirects to `/`.
3. If the user's role is not allowed, it redirects them to their own dashboard.
4. If the role is allowed, it renders the requested page.

### PublicRoute

`src/components/PublicRoute.jsx` checks:

1. If auth is still loading, it displays `FullScreenLoader`.
2. If a user exists, it redirects them to their role dashboard.
3. If no user exists, it renders the public page.

## API Layer

All API calls use `src/api/axios.js`.

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
```

The backend API base path should include `/api/v1`, for example:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### Auth API

Defined in `src/api/auth.js`.

```text
POST /auth/login
POST /auth/register/patient
POST /auth/register/doctor
POST /auth/logout
GET  /auth/profile
```

Used by:

- `LoginPage.jsx`
- `RegisterPage.jsx`
- `AuthProvider.jsx`
- `DashboardLayout.jsx`

### Patient API

Defined in `src/api/patient.js`.

```text
GET  /patient/dashboard
GET  /patient/doctors
GET  /patient/doctors/:id
POST /appointment
GET  /patient/my-appointments
```

Used by patient pages to load dashboard numbers, list doctors, load doctor details, book appointments, and show appointment history.

### Doctor API

Defined in `src/api/doctor.js`.

```text
GET   /doctor/dashboard
GET   /doctor/profile
POST  /doctor/profile
PATCH /doctor/profile
GET   /appointment
PATCH /appointment/:id/approve
PATCH /appointment/:id/reject
PATCH /appointment/:id/complete
```

Used by doctor pages to manage profile information, appointment requests, queue items, and appointment history.

### Admin API

Defined in `src/api/admin.js`.

```text
GET   /admin/dashboard
GET   /admin/doctors/pending
PATCH /admin/doctors/:id/approve
PATCH /admin/doctors/:id/reject
GET   /admin/profile-update-requests
PATCH /admin/profile-update-requests/:id/approve
PATCH /admin/profile-update-requests/:id/reject
```

Used by admin pages to load dashboard metrics, approve/reject doctors, and process doctor profile update requests.

## Shared UI Components

### DashboardLayout

`src/layouts/DashboardLayout.jsx` provides the common authenticated workspace shell.

It handles:

- Top header.
- Desktop sidebar navigation.
- Mobile drawer navigation.
- Active menu item detection.
- Logout confirmation dialog.
- Calling the logout endpoint.
- Clearing auth context after logout.
- Redirecting to `/` after logout.

Each role page passes a title, role label, menu items, and child content into this layout.

### FullScreenLoader

`src/components/FullScreenLoader.jsx` displays a full-screen loading overlay. It is used during:

- Suspense/lazy route loading.
- Initial auth verification.
- Login.
- Registration.

### PageTitle

`src/components/PageTitle.jsx` updates `document.title` based on the active route.

### ProtectedRoute and PublicRoute

These are the frontend access-control components described above.

## Public Pages

### LandingPage

`src/pages/LandingPage.jsx` is the marketing and entry page. It includes:

- Animated intro screen.
- Navigation to login/register.
- Feature sections.
- Workflow sections.
- Responsive layout.

It is only visible to unauthenticated users because it is wrapped by `PublicRoute`.

### LoginPage

`src/pages/LoginPage.jsx` contains the login form.

The form collects:

- `email`
- `password`

On successful login:

1. The backend sets the HTTP-only auth cookie.
2. The response user is saved into auth context.
3. The user is redirected by role:
   - patient -> `/patient/dashboard`
   - doctor -> `/doctor/dashboard`
   - admin -> `/admin/dashboard`

Errors from the backend are shown in the form.

### RegisterPage

`src/pages/RegisterPage.jsx` supports patient and doctor registration from one screen.

The form collects:

- `name`
- `email`
- `password`
- `gender`
- selected role: `patient` or `doctor`

Patient registration calls:

```text
POST /auth/register/patient
```

Doctor registration calls:

```text
POST /auth/register/doctor
```

Patient accounts are approved immediately by the backend. Doctor accounts are created as pending and cannot log in until an admin approves them.

## Patient Pages

### Patient Dashboard

`src/pages/patient/Dashboard.jsx` loads `GET /patient/dashboard`.

It displays:

- Upcoming approved appointments.
- Pending appointment requests.
- Completed appointments.
- Rejected appointments.
- Recent appointments.

Recent appointments include doctor information, reason for visit, appointment date/time, token number, status, and rejection reason when available.

### Doctors List

`src/pages/patient/Doctors.jsx` loads `GET /patient/doctors`.

It displays doctors returned by the backend and includes a client-side search field. The list uses doctor profile data such as:

- doctor name and gender from the linked user.
- specialization.
- qualification.
- experience.
- consultation fee.
- available days.
- profile verification status.

### Doctor Details

`src/pages/patient/DoctorDetails.jsx` loads `GET /patient/doctors/:id`.

It displays doctor details and contains the appointment request form.

The appointment request form sends:

```js
{
  doctorId,
  preferredDate,
  reasonForVisit
}
```

to:

```text
POST /appointment
```

The page shows backend validation errors and success messages.

### My Appointments

`src/pages/patient/MyAppointments.jsx` loads `GET /patient/my-appointments`.

It displays all appointments for the logged-in patient and groups/summarizes status counts for:

- pending
- approved
- completed
- rejected

Appointment cards display doctor details, appointment timing, token number, reason for visit, status, and rejection reason when present.

## Doctor Pages

### Doctor Dashboard

`src/pages/doctor/Dashboard.jsx` loads `GET /doctor/dashboard`.

It displays:

- Today's approved appointments.
- Pending appointment requests.
- Completed appointments today.
- Upcoming approved appointments.
- Recent appointments.

The backend also returns `allAppointments`, which is used by the appointment history page.

### Doctor Profile

`src/pages/doctor/Profile.jsx` handles both initial profile completion and later profile update requests.

It loads:

```text
GET /doctor/profile
```

If no profile exists, the doctor can create one with:

```text
POST /doctor/profile
```

If a profile already exists, changes are submitted with:

```text
PATCH /doctor/profile
```

The form fields are:

- phone number.
- specialization.
- qualification.
- experience.
- consultation fee.
- available days.

The backend validates the profile and either creates the profile or creates/updates a pending profile update request for admin review.

### Appointment Requests

`src/pages/doctor/AppointmentRequests.jsx` loads `GET /appointment`.

It shows pending and approved appointments for the logged-in doctor.

Doctors can approve a pending appointment by sending:

```js
{
  appointmentDate,
  appointmentTime,
  duration
}
```

to:

```text
PATCH /appointment/:id/approve
```

Doctors can reject a pending appointment by sending:

```js
{
  rejectionReason
}
```

to:

```text
PATCH /appointment/:id/reject
```

Doctors can complete an approved appointment with:

```text
PATCH /appointment/:id/complete
```

Approved appointments are sorted by token number to create a simple queue view.

### Appointment History

`src/pages/doctor/AppointmentHistory.jsx` uses `GET /doctor/dashboard` and reads the `allAppointments` array.

It filters the list to show:

- completed appointments.
- rejected appointments.

The page displays patient details, visit reason, preferred date, appointment schedule, token number, completion time, rejection time, and rejection reason where available.

## Admin Pages

### Admin Dashboard

`src/pages/admin/Dashboard.jsx` loads `GET /admin/dashboard`.

It displays:

- total doctors.
- total patients.
- pending doctor registrations.
- pending doctor profile update requests.
- today's approved appointments.
- today's completed appointments.
- derived completion rate.

### Pending Doctors

`src/pages/admin/PendingDoctors.jsx` loads `GET /admin/doctors/pending`.

Admins can:

- approve a doctor with `PATCH /admin/doctors/:id/approve`.
- reject a doctor with `PATCH /admin/doctors/:id/reject`.

After a successful action, the page removes the processed doctor from the visible pending list.

### Profile Requests

`src/pages/admin/ProfileRequests.jsx` loads `GET /admin/profile-update-requests`.

Admins can:

- approve a profile update with `PATCH /admin/profile-update-requests/:id/approve`.
- reject a profile update with `PATCH /admin/profile-update-requests/:id/reject`.

The page is built around reviewing requested doctor profile changes and includes expanded profile details for decision-making.

## Styling

The project uses Tailwind CSS through `@tailwindcss/vite`.

Global CSS lives in `src/index.css`. It imports Tailwind and defines custom keyframe animations used by:

- the landing intro.
- queue progress visuals.
- dashboard modal animations.
- mobile drawer transitions.
- full-screen loaders.

The visual style is a modern clinic dashboard theme with:

- light slate backgrounds.
- white dashboard panels.
- blue and teal accents.
- status colors for pending, approved, completed, and rejected states.
- responsive grids and mobile navigation.

## Data and State Management

The frontend mostly uses local component state:

- form inputs.
- loading states.
- success/error alerts.
- currently selected appointment action.
- expanded admin cards.
- mobile navigation state.

Global state is limited to authentication data in `AuthProvider`.

This keeps the state model simple because most data is fetched directly from the backend page by page.

## Expected Backend Contract

The frontend expects the backend to:

- expose API routes under `/api/v1`.
- use an HTTP-only cookie named `accessToken`.
- allow CORS credentials from the frontend origin.
- return a user object from `/auth/profile`.
- return meaningful `message` fields for failed requests.
- enforce role permissions on protected endpoints.

The frontend sends cookies automatically because Axios is configured with `withCredentials: true`.

## Common Development Notes

- If login succeeds but protected pages still redirect, check that `VITE_API_URL` points to the backend `/api/v1` path and that backend CORS `CLIENT_URL` matches the frontend origin.
- If cookies are not saved in production, check backend `NODE_ENV`, cookie `secure`, and `sameSite` behavior.
- If a doctor cannot log in, the backend may still have the doctor's `accountStatus` set to `pending` or `rejected`.
- If no doctors appear for patients, the backend only returns doctors whose profile is complete and available.

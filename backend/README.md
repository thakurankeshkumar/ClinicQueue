# ClinicQueue Backend

This folder contains the backend REST API for ClinicQueue. It is built with Node.js, Express, MongoDB, Mongoose, JWT authentication, and HTTP-only cookies.

The backend owns authentication, role-based authorization, account approval, doctor profile verification, appointment state changes, dashboard metrics, and all persistent data.

## Backend Responsibilities

- Start the Express application and connect to MongoDB.
- Load environment variables from `.env`.
- Apply security, CORS, body parsing, cookie parsing, and logging middleware.
- Register REST API routes under `/api/v1`.
- Register patients and doctors.
- Prevent pending/rejected doctors from logging in.
- Issue JWTs in HTTP-only cookies after login.
- Authenticate protected requests from the `accessToken` cookie.
- Authorize protected endpoints by user role.
- Let admins approve/reject doctor registrations.
- Let doctors create profiles and request profile updates.
- Let admins approve/reject doctor profile update requests.
- Let patients browse available doctors and request appointments.
- Let doctors approve, reject, complete, and review appointments.
- Return dashboard metrics for patients, doctors, and admins.

## Tech Stack

- Node.js 22
- Express 5
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- cookie-parser
- cors
- helmet
- morgan
- dotenv
- nodemon for development

## Folder Structure

```text
backend/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── appointment.controller.js
│   │   ├── auth.controller.js
│   │   ├── doctor.controller.js
│   │   └── patient.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   ├── models/
│   │   ├── Appointment.js
│   │   ├── Doctor.js
│   │   ├── DoctorUpdateRequest.js
│   │   └── User.js
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── appointment.routes.js
│   │   ├── auth.routes.js
│   │   ├── doctor.routes.js
│   │   └── patient.routes.js
│   ├── app.js
│   └── server.js
├── package.json
└── README.md
```

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
COOKIE_MAX_AGE=604800000
CLIENT_URL=http://localhost:5173
```

Start the development server:

```bash
npm run dev
```

Start the production server:

```bash
npm start
```

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `PORT` | Port used by the Express server. Defaults to `5000` in `env.js`. |
| `NODE_ENV` | Controls production cookie settings. Defaults to `development`. |
| `MONGO_URI` | MongoDB connection string. Required for database connection. |
| `JWT_SECRET` | Secret used to sign and verify JWT access tokens. |
| `JWT_EXPIRES_IN` | JWT expiry value passed to `jsonwebtoken`, such as `7d`. |
| `COOKIE_MAX_AGE` | Cookie lifetime in milliseconds. Converted with `Number()`. |
| `CLIENT_URL` | Frontend origin allowed by CORS, for example `http://localhost:5173`. |

## Application Boot Flow

### `src/server.js`

`server.js` imports the Express app, environment config, and database connector. It:

1. Reads `PORT` from `env`.
2. Calls `connectDB()`.
3. Starts `app.listen(PORT)` only after the database connection succeeds.
4. Logs the running port and environment.

### `src/config/db.js`

`connectDB()` uses Mongoose to connect to `env.MONGO_URI`.

If the connection fails, the process exits with status code `1`.

### `src/config/env.js`

Loads `.env` with `dotenv.config()` and exports a centralized `env` object used across the backend.

## Express App Configuration

`src/app.js` creates the Express app and applies middleware in this order:

1. `app.set("trust proxy", 1)`
2. `helmet()` for security headers.
3. `cors({ origin: env.CLIENT_URL, credentials: true })`
4. `express.json()`
5. `express.urlencoded({ extended: true })`
6. `cookieParser()`
7. `morgan("dev")`
8. health check route at `GET /`
9. API route modules under `/api/v1`

The health check returns:

```json
{
  "success": true,
  "message": "ClinicQueue Backend API is running"
}
```

## API Base Paths

All feature routes are mounted in `app.js`.

```text
/api/v1/auth
/api/v1/admin
/api/v1/doctor
/api/v1/appointment
/api/v1/patient
```

The frontend should use:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Authentication Design

ClinicQueue uses JWT authentication stored in an HTTP-only cookie named `accessToken`.

The token payload contains:

```js
{
  id: user._id,
  role: user.role
}
```

Cookie options during login:

```js
{
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: Number(env.COOKIE_MAX_AGE)
}
```

This means:

- JavaScript in the browser cannot read the token.
- The frontend must send requests with credentials enabled.
- In production, cookies are marked secure and use `sameSite: "none"`.
- In development, cookies use `sameSite: "lax"` and do not require HTTPS.

## Middleware

### `authenticateUser`

Defined in `src/middlewares/auth.middleware.js`.

It:

1. Reads `req.cookies.accessToken`.
2. Rejects the request with `401` if the cookie is missing.
3. Verifies the token with `env.JWT_SECRET`.
4. Finds the user by decoded `id`.
5. Removes the password using `.select("-password")`.
6. Attaches the user to `req.user`.
7. Calls `next()`.

Failure responses:

- missing token -> `Unauthorized. Please login.`
- user not found -> `User not found.`
- invalid/expired token -> `Invalid or expired token.`

### `authorizeRoles`

Defined in `src/middlewares/role.middleware.js`.

It accepts one or more allowed roles:

```js
authorizeRoles("admin")
authorizeRoles("doctor")
authorizeRoles("patient")
```

If `req.user.role` is not included, it returns:

```json
{
  "success": false,
  "message": "Access denied."
}
```

with HTTP status `403`.

## Data Models

### User

Defined in `src/models/User.js`.

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `name` | String | Required, trimmed. |
| `email` | String | Required, unique, lowercase, trimmed. |
| `password` | String | Required, stored as a bcrypt hash. |
| `gender` | String | Required enum: `male`, `female`, `other`. |
| `role` | String | Required enum: `admin`, `doctor`, `patient`. |
| `accountStatus` | String | Enum: `pending`, `approved`, `rejected`. |

The schema uses timestamps.

Role/account defaults are set in controllers:

- patient registration creates `role: "patient"` and `accountStatus: "approved"`.
- doctor registration creates `role: "doctor"` and `accountStatus: "pending"`.

### Doctor

Defined in `src/models/Doctor.js`.

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `userId` | ObjectId -> User | Required and unique. |
| `email` | String | Required, lowercase, trimmed. Copied from user. |
| `phoneNumber` | String | Required, Indian mobile pattern `^[6-9]\d{9}$`. |
| `specialization` | String | Required, trimmed. |
| `qualification` | String | Required, trimmed. |
| `experience` | Number | Required, minimum `0`. |
| `consultationFee` | Number | Required, minimum `0`. Controller requires greater than `0`. |
| `availableDays` | String[] | Required day names. |
| `isAvailable` | Boolean | Defaults to `true`. |
| `isProfileComplete` | Boolean | Defaults to `false`. |
| `isProfileVerified` | Boolean | Defaults to `false`. |

The schema uses timestamps.

### Appointment

Defined in `src/models/Appointment.js`.

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `patientId` | ObjectId -> User | Required. |
| `doctorId` | ObjectId -> Doctor | Required. |
| `preferredDate` | Date | Required date requested by patient. |
| `appointmentDate` | Date | Set by doctor when approving. |
| `appointmentTime` | String | Set by doctor when approving. Expected `HH:mm`. |
| `duration` | Number | Minimum `1`. Set by doctor. |
| `tokenNumber` | Number | Minimum `1`. Generated from appointment time. |
| `reasonForVisit` | String | Required, trimmed. |
| `rejectionReason` | String | Trimmed, set when rejected. |
| `status` | String | `pending`, `approved`, `rejected`, `completed`, `cancelled`; defaults to `pending`. |
| `completedAt` | Date | Set when completed. |
| `approvedAt` | Date | Set when approved. |
| `rejectedAt` | Date | Set when rejected. |

The schema uses timestamps.

### DoctorUpdateRequest

Defined in `src/models/DoctorUpdateRequest.js`.

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `doctorId` | ObjectId -> Doctor | Required. |
| `requestedBy` | ObjectId -> User | Required doctor user ID. |
| `phoneNumber` | String | Required, trimmed. |
| `specialization` | String | Required, trimmed. |
| `qualification` | String | Required, trimmed. |
| `experience` | Number | Required, minimum `0`. |
| `consultationFee` | Number | Required, minimum `0`. |
| `availableDays` | String[] | Required. |
| `status` | String | `pending`, `approved`, `rejected`; defaults to `pending`. |

The schema uses timestamps.

Processed profile update requests are deleted after approval or rejection.

## Auth Routes

Base path:

```text
/api/v1/auth
```

### Register Patient

```text
POST /register/patient
```

Request body:

```json
{
  "name": "Patient Name",
  "email": "patient@example.com",
  "password": "password123",
  "gender": "male"
}
```

Validation:

- `name`, `email`, `password`, and `gender` are required.
- email must match a basic email regex.
- email must not already exist.

Behavior:

- hashes the password with bcrypt using salt rounds `10`.
- creates a user with `role: "patient"`.
- sets `accountStatus: "approved"`.

Success response:

```json
{
  "success": true,
  "message": "Patient registered successfully."
}
```

### Register Doctor

```text
POST /register/doctor
```

Request body:

```json
{
  "name": "Doctor Name",
  "email": "doctor@example.com",
  "password": "password123",
  "gender": "female"
}
```

Validation is the same as patient registration.

Behavior:

- hashes the password.
- creates a user with `role: "doctor"`.
- sets `accountStatus: "pending"`.
- doctor cannot log in until approved by an admin.

Success response:

```json
{
  "success": true,
  "message": "Doctor registered successfully. Wait for Approval."
}
```

### Login

```text
POST /login
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Validation:

- email and password are required.
- email must match a basic email regex.
- user must exist.
- password must match the bcrypt hash.
- doctors with `pending` or `rejected` status cannot log in.

Behavior:

- creates a JWT.
- stores it in the `accessToken` cookie.
- returns minimal user information.

Success response:

```json
{
  "success": true,
  "message": "Login Successful.",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "patient"
  }
}
```

### Logout

```text
POST /logout
```

Behavior:

- clears the `accessToken` cookie.

Success response:

```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

### Get Profile

```text
GET /profile
```

Protected by:

```js
authenticateUser
```

Behavior:

- returns the currently authenticated user from `req.user`.
- password is excluded by the auth middleware.

Success response:

```json
{
  "success": true,
  "user": {}
}
```

## Admin Routes

Base path:

```text
/api/v1/admin
```

All admin routes use:

```js
authenticateUser
authorizeRoles("admin")
```

### Admin Dashboard

```text
GET /dashboard
```

Returns counts for:

- total doctors.
- total patients.
- pending doctor registrations.
- pending doctor profile update requests.
- today's approved appointments.
- today's completed appointments.

The controller calculates today's range from local server time using start and end of day.

Response shape:

```json
{
  "success": true,
  "totalDoctors": 0,
  "totalPatients": 0,
  "pendingDoctors": 0,
  "pendingProfileRequests": 0,
  "todayAppointments": 0,
  "completedAppointmentsToday": 0
}
```

### Get Pending Doctors

```text
GET /doctors/pending
```

Returns users where:

```js
{
  role: "doctor",
  accountStatus: "pending"
}
```

Passwords are excluded.

Response includes:

- `count`
- `doctors`

### Approve Doctor

```text
PATCH /doctors/:id/approve
```

Behavior:

- finds the user by `id`.
- returns `404` if not found.
- returns `400` if the selected user is not a doctor.
- sets `accountStatus` to `approved`.

### Reject Doctor

```text
PATCH /doctors/:id/reject
```

Behavior:

- finds the user by `id`.
- returns `404` if not found.
- returns `400` if the selected user is not a doctor.
- sets `accountStatus` to `rejected`.

The current controller does not require a rejection reason, even though the frontend API function accepts a `data` argument.

### Get Pending Profile Update Requests

```text
GET /profile-update-requests
```

Returns requests where:

```js
{
  status: "pending"
}
```

The response populates:

- `doctorId`
- nested `doctorId.userId` with `name` and `email`

Response includes:

- `count`
- `requests`

### Approve Doctor Profile Update

```text
PATCH /profile-update-requests/:id/approve
```

Behavior:

1. Finds the `DoctorUpdateRequest`.
2. Finds the related `Doctor`.
3. Copies requested fields onto the doctor profile:
   - phone number
   - specialization
   - qualification
   - experience
   - consultation fee
   - available days
4. Sets `doctor.isProfileVerified = true`.
5. Saves the doctor.
6. Deletes the processed update request.

### Reject Doctor Profile Update

```text
PATCH /profile-update-requests/:id/reject
```

Behavior:

- finds the update request.
- deletes it after rejection.

The current controller does not store a rejection reason.

## Doctor Routes

Base path:

```text
/api/v1/doctor
```

All doctor routes use:

```js
authenticateUser
authorizeRoles("doctor")
```

### Complete Doctor Profile

```text
POST /profile
```

Request body:

```json
{
  "phoneNumber": "9876543210",
  "specialization": "Cardiology",
  "qualification": "MBBS, MD",
  "experience": 8,
  "consultationFee": 500,
  "availableDays": ["Monday", "Wednesday", "Friday"]
}
```

Validation:

- all fields are required.
- phone number must match `^[6-9]\d{9}$`.
- available days must be a non-empty array.
- available days must be valid day names:
  - Monday
  - Tuesday
  - Wednesday
  - Thursday
  - Friday
  - Saturday
  - Sunday
- duplicate available days are rejected.
- experience must be an integer greater than or equal to `0`.
- consultation fee must be an integer greater than `0`.
- doctor profile must not already exist for the logged-in user.

Behavior:

- creates a `Doctor` document linked to `req.user._id`.
- copies the doctor's email from `req.user.email`.
- sets `isAvailable: true`.
- sets `isProfileComplete: true`.
- sets `isProfileVerified: false`.

The profile waits for admin verification after creation.

### Get Doctor Profile

```text
GET /profile
```

Behavior:

- finds the doctor profile for the logged-in doctor user.
- returns `404` if no profile exists.
- checks if a pending profile update request exists.

Response includes:

```json
{
  "success": true,
  "message": "Doctor profile retrieved successfully.",
  "doctor": {},
  "hasPendingRequest": false
}
```

### Request Doctor Profile Update

```text
PATCH /profile
```

Request body uses the same fields as profile creation.

Validation:

- all fields are required.
- phone number must match `^[6-9]\d{9}$`.
- experience must be an integer greater than or equal to `0`.
- consultation fee must be an integer greater than `0`.
- available days are normalized to title case.
- available days must be valid.
- duplicate days are rejected.
- doctor profile must exist.
- submitted data must be different from the current doctor profile.

Behavior:

- if a pending update request already exists, it updates that request.
- if submitted data matches the existing pending request, it returns `No changes detected.`
- if no pending request exists, it creates a new `DoctorUpdateRequest`.

Important detail:

- profile update requests do not directly modify the doctor profile.
- an admin must approve the request before changes are copied to the `Doctor` document.

### Doctor Dashboard

```text
GET /dashboard
```

Behavior:

- finds the logged-in doctor's `Doctor` profile.
- returns `404` if the doctor profile does not exist.
- calculates today's start and end timestamps.
- returns dashboard counts and appointment lists.

Response includes:

- `todayAppointments` - approved appointments scheduled for today.
- `pendingRequests` - pending appointment requests.
- `completedToday` - completed appointments with `completedAt` today.
- `upcomingAppointments` - approved appointments after today.
- `recentAppointments` - latest 5 appointments.
- `allAppointments` - all appointments for history views.

Recent and all appointment lists populate patient details with:

- name
- gender
- email

## Appointment Routes

Base path:

```text
/api/v1/appointment
```

Appointment routes are split by role:

- patients can create appointments.
- doctors can list, approve, reject, and complete appointments.

### Create Appointment

```text
POST /
```

Protected by:

```js
authenticateUser
authorizeRoles("patient")
```

Request body:

```json
{
  "doctorId": "doctor-profile-id",
  "preferredDate": "2026-08-15",
  "reasonForVisit": "Recurring headache and dizziness"
}
```

Validation:

- `doctorId`, `preferredDate`, and `reasonForVisit` are required.
- preferred date cannot be in the past.
- doctor must exist.
- doctor profile must be complete.
- doctor must be available.
- patient cannot have another pending request with the same doctor.
- patient cannot have an approved appointment with the same doctor on the same date.
- reason for visit must be at least 10 characters.

Behavior:

- creates an appointment with:
  - logged-in user as `patientId`.
  - selected doctor profile as `doctorId`.
  - selected date as `preferredDate`.
  - `status: "pending"` by default.

### Get Doctor Appointments

```text
GET /
```

Protected by:

```js
authenticateUser
authorizeRoles("doctor")
```

Behavior:

- finds the logged-in doctor's profile.
- returns appointments for that doctor where status is `pending` or `approved`.
- populates patient details.
- sorts by `createdAt` ascending.

Response includes:

- `count`
- `appointments`

### Approve Appointment

```text
PATCH /:id/approve
```

Protected by:

```js
authenticateUser
authorizeRoles("doctor")
```

Request body:

```json
{
  "appointmentDate": "2026-08-15",
  "appointmentTime": "10:30",
  "duration": 30
}
```

Validation:

- appointment date, appointment time, and duration are required.
- duration must be an integer greater than `0`.
- appointment date must be valid.
- appointment date cannot be in the past.
- appointment time must match `HH:mm` 24-hour format.
- logged-in doctor must own the appointment.
- only `pending` appointments can be approved.
- appointment date cannot be earlier than the patient's preferred date.
- another approved/completed appointment cannot already exist for the same doctor, same day, and same time.

Behavior:

- generates `tokenNumber` from the appointment time by removing the colon.
  - `10:30` becomes `1030`.
  - `09:05` becomes `905`.
- sets appointment date, time, duration, token number, status, and approval timestamp.
- populates patient details before returning the appointment.

### Reject Appointment

```text
PATCH /:id/reject
```

Protected by:

```js
authenticateUser
authorizeRoles("doctor")
```

Request body:

```json
{
  "rejectionReason": "Doctor is unavailable on the requested day."
}
```

Validation:

- rejection reason is required.
- logged-in doctor must own the appointment.
- only `pending` appointments can be rejected.

Behavior:

- sets status to `rejected`.
- stores the trimmed rejection reason.
- sets `rejectedAt`.

### Complete Appointment

```text
PATCH /:id/complete
```

Protected by:

```js
authenticateUser
authorizeRoles("doctor")
```

Validation:

- appointment must exist.
- logged-in doctor must own the appointment.
- only `approved` appointments can be completed.
- future appointments cannot be completed.

Behavior:

- sets status to `completed`.
- sets `completedAt`.

## Patient Routes

Base path:

```text
/api/v1/patient
```

All patient routes use:

```js
authenticateUser
authorizeRoles("patient")
```

### Patient Dashboard

```text
GET /dashboard
```

Returns:

- `upcomingAppointments` - approved appointments after today.
- `pendingAppointments` - pending appointment requests.
- `completedAppointments` - completed appointments.
- `rejectedAppointments` - rejected appointments.
- `recentAppointments` - latest 5 patient appointments.

Recent appointments populate doctor profile and nested doctor user name.

### My Appointments

```text
GET /my-appointments
```

Behavior:

- returns all appointments where `patientId` is the logged-in user.
- excludes `__v`.
- populates doctor details:
  - specialization.
  - profile verification status.
  - nested user name.
- sorts by `createdAt` descending.

Response includes:

- `count`
- `appointments`

### Available Doctors

```text
GET /doctors
```

Behavior:

- returns doctor profiles where:
  - `isAvailable: true`
  - `isProfileComplete: true`
- populates doctor user details:
  - name
  - gender
- selects profile fields needed for browsing:
  - specialization
  - qualification
  - experience
  - consultation fee
  - available days
  - profile verification status

Current implementation does not require `isProfileVerified: true` in the query, so complete and available profiles are returned even if the verification flag is false.

### Doctor Details

```text
GET /doctors/:id
```

Validation:

- `id` must be a valid MongoDB ObjectId.

Behavior:

- finds one doctor profile by `_id`.
- requires `isAvailable: true`.
- requires `isProfileComplete: true`.
- populates doctor user name and gender.
- returns `404` when no matching doctor exists.

## Main Workflows

### Patient Signup and Booking

1. Patient registers through `/auth/register/patient`.
2. Backend creates an approved patient account.
3. Patient logs in through `/auth/login`.
4. Backend stores the JWT in the `accessToken` cookie.
5. Patient browses doctors through `/patient/doctors`.
6. Patient opens a doctor profile through `/patient/doctors/:id`.
7. Patient submits an appointment request through `/appointment`.
8. Appointment is created with `status: "pending"`.
9. Patient tracks status through `/patient/my-appointments` or `/patient/dashboard`.

### Doctor Signup and Profile Verification

1. Doctor registers through `/auth/register/doctor`.
2. Backend creates the doctor user with `accountStatus: "pending"`.
3. Admin approves doctor through `/admin/doctors/:id/approve`.
4. Doctor can now log in.
5. Doctor completes profile through `/doctor/profile`.
6. Profile is created with `isProfileComplete: true` and `isProfileVerified: false`.
7. Admin can later approve profile update requests. Initial profile creation itself is marked as awaiting verification by the response message, but the current admin profile request route only processes `DoctorUpdateRequest` documents.

### Doctor Profile Update

1. Doctor submits changed profile fields through `PATCH /doctor/profile`.
2. Backend compares the submitted data with the current profile.
3. If data changed, backend creates or updates a pending `DoctorUpdateRequest`.
4. Admin reviews pending requests through `/admin/profile-update-requests`.
5. Admin approves the request.
6. Backend copies requested fields to the `Doctor` profile.
7. Backend sets `isProfileVerified: true`.
8. Backend deletes the processed request.

### Appointment Queue

1. Patient creates an appointment request.
2. Doctor lists pending and approved appointments through `GET /appointment`.
3. Doctor approves a pending request with date, time, and duration.
4. Backend generates a queue token from the appointment time.
5. Approved appointments appear as queue items in the frontend.
6. Doctor completes an approved appointment after the appointment date is today or earlier.
7. Completed and rejected appointments appear in history.

## Status Values

### User `accountStatus`

```text
pending
approved
rejected
```

Patients are created as `approved`.

Doctors are created as `pending` and require admin approval before login.

### Appointment `status`

```text
pending
approved
rejected
completed
cancelled
```

The current controllers create and handle:

- `pending`
- `approved`
- `rejected`
- `completed`

`cancelled` exists in the schema enum but does not currently have a route.

### DoctorUpdateRequest `status`

```text
pending
approved
rejected
```

The current implementation deletes processed requests instead of keeping approved/rejected request documents.

## Validation Summary

### Email

Auth controllers use:

```js
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

### Phone Number

Doctor profile controllers use:

```js
/^[6-9]\d{9}$/
```

### Appointment Time

Appointment approval uses:

```js
/^([01]\d|2[0-3]):([0-5]\d)$/
```

### Available Days

Allowed values:

```text
Monday
Tuesday
Wednesday
Thursday
Friday
Saturday
Sunday
```

Profile creation requires exact day names. Profile update normalizes submitted days to title case before validation.

## Error Response Style

Most failures follow this shape:

```json
{
  "success": false,
  "message": "Error message."
}
```

Common HTTP statuses:

- `400` for validation errors and invalid actions.
- `401` for missing/invalid authentication.
- `403` for role access denial or unauthorized ownership.
- `404` for missing resources.
- `500` for unhandled server errors.

## Security and CORS Notes

- `helmet` is enabled for security headers.
- CORS allows only `env.CLIENT_URL`.
- CORS credentials are enabled.
- JWTs are sent in an HTTP-only cookie.
- Protected routes read the cookie through `cookie-parser`.
- Role checks happen on the backend even though the frontend also protects routes.

## Development Notes

- There is currently no real test suite; `npm test` exits with an error placeholder.
- Admin users are supported by the schema and routes, but there is no public admin registration endpoint in this backend.
- The frontend API client must include credentials for protected requests.
- The backend must run on an origin that matches `CLIENT_URL` CORS settings.
- MongoDB must be available before the server can start successfully.

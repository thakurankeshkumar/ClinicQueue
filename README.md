# ClinicQueue Backend

ClinicQueue is a role-based clinic appointment backend built with Node.js, Express, and MongoDB. The backend is complete and ready for a frontend to consume via cookie-based authentication.

## What this backend does

- Patient and doctor registration
- JWT login with HTTP-only cookies
- Role-based access for admin, doctor, and patient
- Doctor profile creation and admin review flow
- Appointment request, approval, rejection, and completion flow
- Dashboards for admin, doctor, and patient

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- cookie-parser
- cors
- helmet
- morgan
- dotenv

## Project Status

### Completed

- Backend API is implemented
- Authentication and authorization are implemented
- Doctor approval flow is implemented
- Doctor profile update request flow is implemented
- Appointment booking and doctor-side management are implemented
- Admin, doctor, and patient dashboards are implemented

### Not included yet

- Frontend UI
- Search and filtering
- Pagination
- Email notifications
- Advanced queue management

## Local Setup

### Install dependencies

```bash
cd backend
npm install
```

### Environment variables

Create a `.env` file in `backend/` with:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
COOKIE_MAX_AGE=604800000
```

### Run the server

```bash
npm run dev
```

The server starts on `http://localhost:5000` by default.

## Authentication Rules

- Authentication uses JWT stored in an HTTP-only cookie named `accessToken`.
- Frontend requests must send cookies using `withCredentials: true` in Axios or `credentials: 'include'` in fetch.
- Protected endpoints require a valid cookie.
- Role-protected endpoints return `403 Access denied.` when the role does not match.

## Common Response Format

Most endpoints return JSON in one of these shapes:

```json
{
      "success": true,
      "message": "..."
}
```

```json
{
      "success": true,
      "count": 2,
      "appointments": []
}
```

```json
{
      "success": true,
      "user": {}
}
```

Common error format:

```json
{
      "success": false,
      "message": "..."
}
```

## Base API Paths

- `/api/v1/auth`
- `/api/v1/admin`
- `/api/v1/doctor`
- `/api/v1/patient`
- `/api/v1/appointment`

## Data Models

### User

- `name` string
- `email` string
- `password` string
- `gender` one of `male`, `female`, `other`
- `role` one of `admin`, `doctor`, `patient`
- `accountStatus` one of `pending`, `approved`, `rejected`

### Doctor

- `userId` ObjectId ref `User`
- `email` string
- `phoneNumber` string
- `specialization` string
- `qualification` string
- `experience` number
- `consultationFee` number
- `availableDays` string array
- `isAvailable` boolean
- `isProfileComplete` boolean
- `isProfileVerified` boolean

### Appointment

- `patientId` ObjectId ref `User`
- `doctorId` ObjectId ref `Doctor`
- `preferredDate` date
- `appointmentDate` date
- `appointmentTime` string in `HH:mm`
- `duration` number
- `tokenNumber` number
- `reasonForVisit` string
- `rejectionReason` string
- `status` one of `pending`, `approved`, `rejected`, `completed`, `cancelled`
- `completedAt` date
- `rejectedAt` date

### DoctorUpdateRequest

- `doctorId` ObjectId ref `Doctor`
- `requestedBy` ObjectId ref `User`
- `phoneNumber` string
- `specialization` string
- `qualification` string
- `experience` number
- `consultationFee` number
- `availableDays` string array
- `status` one of `pending`, `approved`, `rejected`

## API Reference

### Authentication

#### POST `/api/v1/auth/register/patient`

Registers a patient account.

Request body:

```json
{
      "name": "Aman Sharma",
      "email": "aman@example.com",
      "password": "password123",
      "gender": "male"
}
```

Validation:

- All fields are required
- Email must be valid
- Gender must match the schema enum

Success response:

```json
{
      "success": true,
      "message": "Patient registered successfully."
}
```

#### POST `/api/v1/auth/register/doctor`

Registers a doctor account with pending admin approval.

Request body:

```json
{
      "name": "Dr. Priya",
      "email": "priya@example.com",
      "password": "password123",
      "gender": "female"
}
```

Validation:

- All fields are required
- Email must be valid
- Gender must match the schema enum

Success response:

```json
{
      "success": true,
      "message": "Doctor registered successfully. Wait for Approval."
}
```

#### POST `/api/v1/auth/login`

Logs in a user and sets the `accessToken` cookie.

Request body:

```json
{
      "email": "patient@example.com",
      "password": "password123"
}
```

Validation and rules:

- Email and password are required
- Email must be valid
- Doctor accounts with `pending` status cannot log in
- Doctor accounts with `rejected` status cannot log in

Success response:

```json
{
      "success": true,
      "message": "Login Successful.",
      "user": {
            "id": "...",
            "name": "...",
            "email": "...",
            "role": "patient"
      }
}
```

Side effect:

- Sets HTTP-only cookie `accessToken`

#### POST `/api/v1/auth/logout`

Clears the auth cookie.

Success response:

```json
{
      "success": true,
      "message": "Logged out successfully."
}
```

#### GET `/api/v1/auth/profile`

Returns the authenticated user object.

Auth:

- Required

Success response:

```json
{
      "success": true,
      "user": {
            "_id": "...",
            "name": "...",
            "email": "...",
            "gender": "male",
            "role": "patient",
            "accountStatus": "approved"
      }
}
```

### Admin

All admin routes require:

- Authenticated user
- Role `admin`

#### GET `/api/v1/admin/dashboard`

Returns admin summary counts.

Success response:

```json
{
      "success": true,
      "totalDoctors": 10,
      "totalPatients": 32,
      "pendingDoctors": 2,
      "pendingProfileRequests": 4,
      "todayAppointments": 6,
      "completedAppointmentsToday": 3
}
```

#### GET `/api/v1/admin/doctors/pending`

Returns all doctor registration requests still waiting for approval.

Success response:

```json
{
      "success": true,
      "message": "Doctors GET successfully",
      "count": 2,
      "doctors": []
}
```

`doctors` contains user documents without passwords.

#### PATCH `/api/v1/admin/doctors/:id/approve`

Approves a doctor registration request.

Path params:

- `id` = user id

Success response:

```json
{
      "success": true,
      "message": "Doctor approved successfully."
}
```

#### PATCH `/api/v1/admin/doctors/:id/reject`

Rejects a doctor registration request.

Path params:

- `id` = user id

Success response:

```json
{
      "success": true,
      "message": "Doctor rejected successfully."
}
```

#### GET `/api/v1/admin/profile-update-requests`

Returns pending doctor profile update requests.

Success response:

```json
{
      "success": true,
      "count": 1,
      "requests": []
}
```

Each request is a `DoctorUpdateRequest` document populated with `doctorId` and its `userId` name/email.

#### PATCH `/api/v1/admin/profile-update-requests/:id/approve`

Applies a doctor profile update request to the doctor profile and marks the doctor as verified.

Path params:

- `id` = profile update request id

Success response:

```json
{
      "success": true,
      "message": "Doctor profile updated successfully."
}
```

#### PATCH `/api/v1/admin/profile-update-requests/:id/reject`

Deletes the pending profile update request without applying it.

Path params:

- `id` = profile update request id

Success response:

```json
{
      "success": true,
      "message": "Profile update request rejected successfully."
}
```

### Doctor

All doctor routes require:

- Authenticated user
- Role `doctor`

#### POST `/api/v1/doctor/profile`

Creates the doctor profile.

Request body:

```json
{
      "phoneNumber": "9876543210",
      "specialization": "Cardiology",
      "qualification": "MBBS, MD",
      "experience": 5,
      "consultationFee": 800,
      "availableDays": ["Monday", "Wednesday", "Friday"]
}
```

Validation:

- All fields are required
- `phoneNumber` must be a valid 10-digit Indian mobile number
- `experience` must be an integer `>= 0`
- `consultationFee` must be an integer `> 0`
- `availableDays` must be a non-empty array of weekday names
- Duplicate days are not allowed

Success response:

```json
{
      "success": true,
      "message": "Doctor profile created successfully. Your profile is awaiting admin verification."
}
```

#### GET `/api/v1/doctor/profile`

Returns the logged-in doctor profile.

Success response:

```json
{
      "success": true,
      "message": "Doctor profile retrieved successfully.",
      "doctor": {}
}
```

If no profile exists:

```json
{
      "success": false,
      "message": "Doctor profile not found."
}
```

#### PATCH `/api/v1/doctor/profile`

Creates or updates a pending profile update request.

Request body:

```json
{
      "phoneNumber": "9876543210",
      "specialization": "Cardiology",
      "qualification": "MBBS, MD",
      "experience": 6,
      "consultationFee": 900,
      "availableDays": ["Monday", "Thursday", "Saturday"]
}
```

Validation:

- Same required fields as profile creation
- Available days are normalized to capitalized weekday names
- Duplicate values are rejected
- If the request matches the current profile or an existing pending request, it returns `No changes detected.`

Success response when a new request is created:

```json
{
      "success": true,
      "message": "Doctor profile update request submitted successfully."
}
```

Success response when an existing pending request is updated:

```json
{
      "success": true,
      "message": "Pending profile update request updated successfully."
}
```

#### GET `/api/v1/doctor/dashboard`

Returns doctor dashboard metrics.

Success response:

```json
{
      "success": true,
      "todayAppointments": 3,
      "pendingRequests": 2,
      "completedToday": 1,
      "upcomingAppointments": 5,
      "recentAppointments": []
}
```

`recentAppointments` is a populated list with patient info and appointment details.

### Patient

All patient routes require:

- Authenticated user
- Role `patient`

#### GET `/api/v1/patient/dashboard`

Returns patient dashboard metrics.

Success response:

```json
{
      "success": true,
      "upcomingAppointments": 2,
      "pendingAppointments": 1,
      "completedAppointments": 4,
      "rejectedAppointments": 1,
      "recentAppointments": []
}
```

`recentAppointments` contains appointment documents populated with doctor and doctor user details.

#### GET `/api/v1/patient/my-appointments`

Returns all appointments for the logged-in patient.

Success response:

```json
{
      "success": true,
      "count": 3,
      "appointments": []
}
```

Each appointment is populated with:

- `doctorId`
- `doctorId.userId.name`
- `doctorId.specialization`
- `doctorId.isProfileVerified`

#### GET `/api/v1/patient/doctors`

Returns available doctors for booking.

Success response:

```json
{
      "success": true,
      "doctors": []
}
```

Only doctors with `isAvailable: true` and `isProfileComplete: true` are returned.

#### GET `/api/v1/patient/doctors/:id`

Returns a single doctor profile for patient viewing.

Path params:

- `id` = doctor document id

Validation:

- Must be a valid MongoDB ObjectId

Success response:

```json
{
      "success": true,
      "doctor": {}
}
```

### Appointment

#### POST `/api/v1/appointment`

Creates a new appointment request from a patient.

Auth:

- Required
- Role `patient`

Request body:

```json
{
      "doctorId": "...",
      "preferredDate": "2026-07-10",
      "reasonForVisit": "Fever and chest discomfort for the last two days"
}
```

Validation:

- `doctorId`, `preferredDate`, and `reasonForVisit` are required
- `preferredDate` cannot be in the past
- Doctor must exist
- Doctor profile must be complete
- Doctor must be available
- Duplicate pending appointment with the same doctor is blocked
- Duplicate approved appointment on the same date is blocked
- `reasonForVisit` must be at least 10 characters

Success response:

```json
{
      "success": true,
      "message": "Appointment request submitted successfully."
}
```

#### GET `/api/v1/appointment`

Returns pending appointments for the logged-in doctor.

Auth:

- Required
- Role `doctor`

Success response:

```json
{
      "success": true,
      "count": 2,
      "appointments": []
}
```

Appointments are populated with patient `name`, `gender`, and `email`.

#### PATCH `/api/v1/appointment/:id/approve`

Approves a pending appointment.

Auth:

- Required
- Role `doctor`

Path params:

- `id` = appointment id

Request body:

```json
{
      "appointmentDate": "2026-07-12",
      "appointmentTime": "10:30",
      "duration": 15
}
```

Validation:

- All fields are required
- `duration` must be an integer greater than zero
- `appointmentDate` must be valid and not in the past
- `appointmentTime` must be in `HH:mm` format
- The appointment must belong to the logged-in doctor
- Only pending appointments can be approved
- Appointment date cannot be earlier than the patient's preferred date
- Duplicate approved appointment at the same date and time is blocked

Behavior:

- Sets `status` to `approved`
- Stores `appointmentDate`, `appointmentTime`, `duration`
- Generates `tokenNumber` from the time by removing `:`

Success response:

```json
{
      "success": true,
      "message": "Appointment approved successfully."
}
```

#### PATCH `/api/v1/appointment/:id/reject`

Rejects a pending appointment.

Auth:

- Required
- Role `doctor`

Request body:

```json
{
      "rejectionReason": "Doctor is unavailable on that date"
}
```

Validation:

- `rejectionReason` is required
- Appointment must belong to the logged-in doctor
- Only pending appointments can be rejected

Behavior:

- Sets `status` to `rejected`
- Stores `rejectionReason`
- Stores `rejectedAt`

Success response:

```json
{
      "success": true,
      "message": "Appointment rejected successfully."
}
```

#### PATCH `/api/v1/appointment/:id/complete`

Marks an approved appointment as completed.

Auth:

- Required
- Role `doctor`

Path params:

- `id` = appointment id

Validation:

- Appointment must belong to the logged-in doctor
- Only approved appointments can be completed
- Future appointments cannot be completed

Behavior:

- Sets `status` to `completed`
- Stores `completedAt`

Success response:

```json
{
      "success": true,
      "message": "Appointment completed successfully."
}
```

## Frontend Integration Notes

- Use cookie-based auth for every protected request.
- Do not send the JWT manually in headers; the backend reads it from the `accessToken` cookie.
- Login and logout should be handled as session actions, not token-in-state actions.
- Patient doctor browsing uses `/api/v1/patient/doctors` and `/api/v1/patient/doctors/:id`.
- Doctor appointments are split into pending request handling and appointment completion flows.
- The frontend should treat `pending`, `approved`, `rejected`, and `completed` as the live appointment statuses.
- The frontend should use `HH:mm` for appointment approval time input.
- The frontend should use integers for `experience`, `consultationFee`, and `duration`.

## Notes on Current Behavior

- Doctor accounts are created with `accountStatus: pending` and must be approved by an admin before login.
- Patient accounts are created with `accountStatus: approved`.
- Doctor profile verification is tracked separately using `isProfileVerified`.
- Patient doctor listing and booking currently depend on `isAvailable` and `isProfileComplete`.
- There is no route for cancelling an appointment, even though the schema includes `cancelled` as a possible status.

## Developer

Developed by Ankesh Kumar.
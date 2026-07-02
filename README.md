# 🏥 ClinicQueue Backend

A secure and scalable backend for **ClinicQueue**, a clinic management system built with **Node.js, Express.js, and MongoDB**.

ClinicQueue is designed to simplify clinic appointment management by providing secure authentication, doctor verification, appointment booking, and approval workflows with role-based access control.

---

# 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- bcryptjs
- Cookie Parser
- CORS
- dotenv

---

# 📁 Project Structure

```text
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# ✨ Features Implemented

## 🔐 Authentication

- Patient Registration
- Doctor Registration
- User Login
- JWT Authentication
- HTTP-Only Cookie Authentication
- Protected Profile API

---

## 🛡 Authorization

- Authentication Middleware
- Role-Based Authorization Middleware
- Protected APIs for Admin, Doctor and Patient

---

## 👨‍⚕️ Doctor Registration Workflow

- Doctor Registration
- Doctor Account Pending Approval
- Admin View Pending Doctors
- Admin Approve Doctor
- Admin Reject Doctor
- Only Approved Doctors Can Login

---

## 🩺 Doctor Profile Management

Doctors can:

- Complete Profile
- View Profile
- Submit Profile Update Request

Admin can:

- View Pending Profile Update Requests
- Approve Profile Updates
- Reject Profile Updates

Doctors become available for appointments only after completing their profile.

---

## 📅 Appointment Management

### Patient

- Book Appointment
- View Own Appointments

### Doctor

- View Pending Appointment Requests
- Approve Appointment

Appointment approval includes:

- Appointment Date
- Appointment Time
- Consultation Duration

---

# 👥 User Roles

## 👤 Patient

- Register
- Login
- Book Appointment
- View Own Appointments

---

## 👨‍⚕️ Doctor

- Register
- Wait for Admin Approval
- Login
- Complete Profile
- Update Profile
- View Pending Appointment Requests
- Approve Appointment Requests

---

## 👑 Admin

- Login
- View Pending Doctors
- Approve Doctors
- Reject Doctors
- View Doctor Profile Update Requests
- Approve Profile Updates
- Reject Profile Updates

---

# 🔄 Application Workflow

```text
Patient
Register
    │
    ▼
Login
    │
    ▼
Book Appointment
    │
    ▼
Pending Approval
    │
    ▼
Doctor Approval
    │
    ▼
Appointment Confirmed


Doctor
Register
    │
    ▼
Pending Approval
    │
    ▼
Admin Approval
    │
    ▼
Login
    │
    ▼
Complete Profile
    │
    ▼
Receive Appointment Requests
    │
    ▼
Approve Appointment


Admin
Login
    │
    ▼
Approve Doctors
    │
    ▼
Approve Doctor Profile
    │
    ▼
Manage System
```

---

# 🔐 Authentication Flow

Authentication is implemented using **JWT** stored in **HTTP-Only Cookies**.

Every protected request follows this workflow:

```text
Client Request
      │
      ▼
Authentication Middleware
      │
      ▼
JWT Verification
      │
      ▼
User Verification
      │
      ▼
Role Authorization
      │
      ▼
Protected Controller
```

---

# 📌 Available APIs

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/v1/auth/register/patient` |
| POST | `/api/v1/auth/register/doctor` |
| POST | `/api/v1/auth/login` |
| POST | `/api/v1/auth/logout` |
| GET | `/api/v1/auth/profile` |

---

## Admin

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/admin/doctors/pending` |
| PATCH | `/api/v1/admin/doctors/:id/approve` |
| PATCH | `/api/v1/admin/doctors/:id/reject` |
| GET | `/api/v1/admin/profile-update-requests` |
| PATCH | `/api/v1/admin/profile-update-requests/:id/approve` |
| PATCH | `/api/v1/admin/profile-update-requests/:id/reject` |

---

## Doctor

| Method | Endpoint |
|---------|----------|
| POST | `/api/v1/doctor/profile` |
| GET | `/api/v1/doctor/profile` |
| PATCH | `/api/v1/doctor/profile` |

---

## Appointment

| Method | Endpoint |
|---------|----------|
| POST | `/api/v1/appointments` |
| GET | `/api/v1/appointments/my` |
| GET | `/api/v1/appointments` |
| PATCH | `/api/v1/appointments/:id/approve` |

---

# 📦 Current Database Models

- User
- Doctor
- DoctorUpdateRequest
- Appointment

---

# 🚧 Upcoming Features

- Queue Token Generation
- Appointment Rejection
- Appointment Completion
- Appointment Time Conflict Detection
- Doctor Dashboard
- Patient Dashboard
- Admin Dashboard
- Reports & Analytics
- Notifications
- Frontend Development

---

# 🎯 Current Project Status

### ✅ Completed

- Project Setup
- MongoDB Configuration
- Authentication
- Authorization
- Doctor Registration Workflow
- Doctor Profile Management
- Doctor Profile Approval Workflow
- Appointment Booking
- Appointment Approval

---

### 🚀 In Progress

- Queue Management System

---

# 👨‍💻 Developer

Developed by **Ankesh Kumar**
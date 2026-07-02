# 🏥 ClinicQueue Backend

A secure, scalable, and role-based backend for **ClinicQueue**, a clinic appointment and queue management system built with **Node.js, Express.js, and MongoDB**.

ClinicQueue simplifies clinic operations by enabling secure authentication, doctor verification, appointment booking, doctor profile management, appointment workflows, and dashboard analytics for different user roles.

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
- User Logout
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
- Pending Admin Approval
- Doctor Approval
- Doctor Rejection
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

Doctors become available for appointment booking only after completing their profile.

---

## 📅 Appointment Management

### Patient

- Book Appointment
- View Own Appointments
- View Dashboard

### Doctor

- View Pending Appointment Requests
- Approve Appointment
- Reject Appointment
- Complete Appointment
- View Dashboard

Appointment approval includes:

- Appointment Date
- Appointment Time
- Consultation Duration
- Queue Token Generation

---

## 👑 Admin Dashboard

Admin can monitor:

- Total Doctors
- Total Patients
- Pending Doctor Approvals
- Pending Profile Update Requests
- Today's Appointments
- Completed Appointments Today

---

# 👥 User Roles

## 👤 Patient

- Register
- Login
- Logout
- View Profile
- Book Appointment
- View Own Appointments
- View Dashboard

---

## 👨‍⚕️ Doctor

- Register
- Wait for Admin Approval
- Login
- Logout
- Complete Profile
- Update Profile
- View Pending Appointment Requests
- Approve Appointment Requests
- Reject Appointment Requests
- Complete Appointment
- View Dashboard

---

## 👑 Admin

- Login
- Logout
- View Dashboard
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
                           │
                     Register / Login
                           │
                           ▼
                  Book Appointment
                           │
                           ▼
                  Pending Appointment
                           │
                           ▼
                         Doctor
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
      Approve Appointment      Reject Appointment
              │                         │
              ▼                         ▼
     Appointment Confirmed      Appointment Rejected
              │
              ▼
     Complete Appointment



                        Doctor
                           │
                        Register
                           │
                           ▼
                 Pending Admin Approval
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
             Submit Profile Verification
                           │
                           ▼
                Admin Profile Approval
                           │
                           ▼
            Available For Appointment Booking



                         Admin
                           │
                          Login
                           │
                           ▼
              Manage Doctors & Profiles
                           │
                           ▼
               Monitor System Dashboard
```

---

# 🔐 Authentication Flow

Authentication is implemented using **JWT (JSON Web Token)** stored inside **HTTP-Only Cookies**.

Every protected request follows this flow:

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
| GET | `/api/v1/admin/dashboard` |
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
| GET | `/api/v1/doctor/dashboard` |
| POST | `/api/v1/doctor/profile` |
| GET | `/api/v1/doctor/profile` |
| PATCH | `/api/v1/doctor/profile` |

---

## Patient

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/patient/dashboard` |

---

## Appointment

| Method | Endpoint |
|---------|----------|
| POST | `/api/v1/appointment` |
| GET | `/api/v1/appointment` |
| GET | `/api/v1/appointment/my` |
| PATCH | `/api/v1/appointment/:id/approve` |
| PATCH | `/api/v1/appointment/:id/reject` |
| PATCH | `/api/v1/appointment/:id/complete` |

---

# 📦 Database Models

- User
- Doctor
- DoctorUpdateRequest
- Appointment

---

# 📊 Dashboards

## 👨‍⚕️ Doctor Dashboard

- Today's Appointments
- Pending Appointment Requests
- Completed Appointments Today
- Upcoming Appointments
- Recent Appointments

---

## 👤 Patient Dashboard

- Upcoming Appointments
- Pending Appointments
- Completed Appointments
- Rejected Appointments
- Recent Appointments

---

## 👑 Admin Dashboard

- Total Doctors
- Total Patients
- Pending Doctor Approvals
- Pending Profile Update Requests
- Today's Appointments
- Completed Appointments Today

---

# 🎯 Current Project Status

## ✅ Completed

- Project Setup
- MongoDB Configuration
- Authentication
- Authorization
- Doctor Registration Workflow
- Doctor Approval Workflow
- Doctor Profile Management
- Doctor Profile Verification Workflow
- Appointment Booking
- Appointment Approval
- Appointment Rejection
- Appointment Completion
- Doctor Dashboard
- Patient Dashboard
- Admin Dashboard

---

## 🚧 Upcoming Features

- Appointment Time Conflict Detection
- Advanced Queue Management
- Search & Filtering
- Pagination
- Reports & Analytics
- Email Notifications
- Frontend Development

---

# 👨‍💻 Developer

Developed with ❤️ by **Ankesh Kumar**
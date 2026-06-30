# 🏥 ClinicQueue Backend

A secure and scalable backend for **ClinicQueue**, a clinic management system built with **Node.js, Express.js, and MongoDB**. This project is being developed as part of the **Advanced Backend Development with Node.js, Express, and MongoDB** course.

The backend follows a modular architecture and currently provides **authentication, authorization, doctor approval workflow, and role-based access control**.

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

# 📁 Current Project Structure

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

# ✅ Features Completed

## Authentication

- Patient Registration
- Doctor Registration
- User Login
- JWT Authentication
- HTTP-Only Cookie Authentication
- Protected Profile API

## Authorization

- Authentication Middleware
- Role-Based Authorization Middleware
- Admin Protected Routes

## Doctor Approval Workflow

- Doctor registers with **Pending** status.
- Admin can view all pending doctors.
- Admin can approve a doctor.
- Admin can reject a doctor.
- Only approved doctors can log in.

---

# 👥 User Roles

## 👤 Patient

- Register
- Login
- Access Protected Routes

## 👨‍⚕️ Doctor

- Register
- Wait for Admin Approval
- Login Only After Approval

## 👑 Admin

- Login
- View Pending Doctors
- Approve Doctors
- Reject Doctors
- Access Admin Protected Routes

---

# 🔄 Authentication Flow

```text
Patient
Register
    │
    ▼
Approved
    │
    ▼
Login

Doctor
Register
    │
    ▼
Pending
    │
    ▼
Admin Approval
    │
    ▼
Login

Admin
Created Manually
    │
    ▼
Login
```

---

# 🔐 Protected Routes

| Method | Endpoint | Access |
|---------|----------|--------|
| GET | `/api/v1/auth/profile` | Authenticated Users |
| GET | `/api/v1/admin/doctors/pending` | Admin |
| PATCH | `/api/v1/admin/doctors/:id/approve` | Admin |
| PATCH | `/api/v1/admin/doctors/:id/reject` | Admin |

---

# 🔑 Authentication

Authentication is implemented using **JWT (JSON Web Token)** stored inside **HTTP-Only Cookies**.

Every protected route follows this flow:

```text
Request
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
Protected Route
```

---

# 📌 Current Backend Workflow

```text
Patient
   │
Register
   │
Login
   │
Access Protected APIs


Doctor
   │
Register
   │
Pending Approval
   │
Admin Approval
   │
Login
   │
Access Protected APIs


Admin
   │
Login
   │
Manage Doctors
   │
Approve / Reject Doctors
```

---

# 🗺️ Project Roadmap

## ✅ Completed

- Backend Setup
- Express Server Configuration
- MongoDB Connection
- User Authentication
- JWT Authentication
- HTTP-Only Cookie Authentication
- Role-Based Authorization
- Doctor Approval Workflow

## 🚧 Upcoming Modules

- Doctor Management
- Patient Management
- Appointment Booking
- Queue Management
- Dashboard APIs
- Frontend Integration

---

# 👨‍💻 Developer

**Ankesh**
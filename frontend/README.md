# 🏥 ClinicQueue Frontend

A modern React-based frontend for **ClinicQueue – Medical Appointment & Queue Management System**.

ClinicQueue is a role-based web application that streamlines the appointment booking process between **Patients**, **Doctors**, and **Administrators**. This frontend provides an intuitive user interface for managing appointments, doctor verification, and queue management.

---

## 🚀 Features

### 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Role-based Access Control

---

## 👨‍⚕️ Patient Module

- View Verified Doctors
- Browse Doctor Profiles
- Request Appointments
- Track Appointment Status
- View Appointment History

---

## 🩺 Doctor Module

- Dashboard Overview
- Complete Professional Profile
- Request Profile Updates
- Manage Appointment Requests
- Approve / Reject Appointments
- Queue Management using Token Numbers
- Complete Patient Appointments
- View Appointment History

---

## 👨‍💼 Admin Module

- Dashboard Overview
- Approve / Reject Doctor Registrations
- Review Doctor Profile Update Requests
- Compare Current vs Requested Profile Information
- Verify Doctor Profiles

---

# 🛠️ Tech Stack

- React
- React Router DOM
- Axios
- Tailwind CSS
- Vite
- Context API

---

# 📁 Project Structure

```text
src
│
├── api
│   ├── admin.js
│   ├── auth.js
│   ├── axios.js
│   ├── doctor.js
│   └── patient.js
│
├── assets
│
├── components
│
├── context
│
├── layouts
│
├── pages
│   ├── admin
│   ├── auth
│   ├── doctor
│   └── patient
│
├── routes
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone <repository-url>
```

Move into the project directory

```bash
cd clinicqueue-frontend
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

The application will start at

```text
http://localhost:5173
```

---

# 🌍 Environment Variables

Create a `.env` file in the project root.

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Replace the URL according to your backend server.

---

# 👥 User Roles

## Patient

- Browse verified doctors
- Request appointments
- View appointment status
- View appointment history

---

## Doctor

- Complete professional profile
- Update profile
- Manage appointment requests
- Manage appointment queue
- Complete appointments
- View appointment history

---

## Administrator

- Approve doctor registrations
- Verify doctor profiles
- Review profile update requests
- Monitor clinic activities

---

# 🔄 Application Workflow

```text
Doctor Registration
        │
        ▼
Admin Reviews Registration
        │
        ▼
Doctor Approved
        │
        ▼
Doctor Completes Profile
        │
        ▼
Admin Verifies Profile
        │
        ▼
Doctor Becomes Visible to Patients
        │
        ▼
Patient Requests Appointment
        │
        ▼
Doctor Reviews Request
        │
        ▼
Approve / Reject
        │
        ▼
Approved Appointment Enters Queue
        │
        ▼
Doctor Completes Appointment
        │
        ▼
Appointment History
```

---

# 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop
- Laptop
- Tablet
- Mobile Devices

---

# ✨ Current Features

- ✅ Authentication System
- ✅ Role-Based Dashboards
- ✅ Doctor Registration Approval
- ✅ Doctor Profile Verification
- ✅ Appointment Booking
- ✅ Appointment Approval / Rejection
- ✅ Queue Management
- ✅ Appointment Completion
- ✅ Appointment History
- ✅ Responsive User Interface

---

# 🔮 Future Enhancements

- UI/UX Improvements
- Advanced Search & Filters
- Email Notifications
- SMS Notifications
- Real-time Queue Updates
- Appointment Reminders
- Analytics Dashboard
- Dark Mode

---

# 🔗 Backend

This frontend communicates with the **ClinicQueue Backend REST API**.

Make sure the backend server is running before starting the frontend.

---

# 📄 License

This project was developed for educational purposes as part of the **Advanced Backend Development with Node.js, Express.js and MongoDB** course.

---

## 👨‍💻 Author

**Ankesh Kumar**

Computer Science Engineering Student

ClinicQueue – Medical Appointment & Queue Management System
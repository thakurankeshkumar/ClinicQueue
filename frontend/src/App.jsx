import { Routes, Route } from "react-router-dom";
// Landing Page Import 
import LandingPage from "./pages/LandingPage";
// Authentication Routes 
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
// Patient Routes 
import Doctors from "./pages/patient/Doctors";
import PatientDashboard from "./pages/patient/Dashboard";
import DoctorDetails from "./pages/patient/DoctorDetails";
import MyAppointments from "./pages/patient/MyAppointments";
// Doctor Routes 
import Profile from "./pages/doctor/Profile";
import DoctorDashboard from "./pages/doctor/Dashboard";
import AppointmentRequests from "./pages/doctor/AppointmentRequests";
import AppointmentHistory from "./pages/doctor/AppointmentHistory";
// Admin Routes 
import AdminDashboard from "./pages/admin/Dashboard";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Patient Routes  */}
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
      <Route path="/patient/doctors" element={<Doctors />} />
      <Route path="/patient/doctors/:id" element={<DoctorDetails />} />
      <Route path="/patient/appointments" element={<MyAppointments />} />
      {/* Doctor Routes  */}
      <Route path="/doctor/profile" element={<Profile />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/history" element={<AppointmentHistory />} />
      <Route path="/doctor/appointments" element={<AppointmentRequests />} />
      {/* Admin Routes  */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
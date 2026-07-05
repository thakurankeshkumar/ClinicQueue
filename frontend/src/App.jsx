import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute"
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
import PendingDoctors from "./pages/admin/PendingDoctors";
import ProfileRequests from "./pages/admin/ProfileRequests";


function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      {/* Patient Routes  */}
      <Route path="/patient/doctors" element={<ProtectedRoute allowedRoles={["patient"]}><Doctors /></ProtectedRoute>} />
      <Route path="/patient/doctors/:id" element={<ProtectedRoute allowedRoles={["patient"]}><DoctorDetails /></ProtectedRoute>} />
      <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={["patient"]}><PatientDashboard /></ProtectedRoute>} />
      <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={["patient"]}><MyAppointments /></ProtectedRoute>} />
      {/* Doctor Routes  */}
      <Route path="/doctor/profile" element={<ProtectedRoute allowedRoles={["doctor"]}><Profile /></ProtectedRoute>} />
      <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/history" element={<ProtectedRoute allowedRoles={["doctor"]}><AppointmentHistory /></ProtectedRoute>} />
      <Route path="/doctor/appointments" element={<ProtectedRoute allowedRoles={["doctor"]}><AppointmentRequests /></ProtectedRoute>} />
      {/* Admin Routes  */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/doctors" element={<ProtectedRoute allowedRoles={["admin"]}><PendingDoctors /></ProtectedRoute>} />
      <Route path="/admin/profile-requests" element={<ProtectedRoute allowedRoles={["admin"]}><ProfileRequests /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PatientDashboard from "./pages/patient/Dashboard";
import DoctorDashboard from "./pages/doctor/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import MyAppointments from "./pages/patient/MyAppointments";
import Doctors from "./pages/patient/Doctors";
import DoctorDetails from "./pages/patient/DoctorDetails";

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
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      {/* Admin Routes  */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
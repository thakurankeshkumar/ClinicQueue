import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute"
import FullScreenLoader from "./components/FullScreenLoader";
import PageTitle from "./components/PageTitle";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));

const Doctors = lazy(() => import("./pages/patient/Doctors"));
const PatientDashboard = lazy(() => import("./pages/patient/Dashboard"));
const DoctorDetails = lazy(() => import("./pages/patient/DoctorDetails"));
const MyAppointments = lazy(() => import("./pages/patient/MyAppointments"));

const Profile = lazy(() => import("./pages/doctor/Profile"));
const DoctorDashboard = lazy(() => import("./pages/doctor/Dashboard"));
const AppointmentRequests = lazy(() => import("./pages/doctor/AppointmentRequests"));
const AppointmentHistory = lazy(() => import("./pages/doctor/AppointmentHistory"));

const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const PendingDoctors = lazy(() => import("./pages/admin/PendingDoctors"));
const ProfileRequests = lazy(() => import("./pages/admin/ProfileRequests"));


function App() {
  return (
    <Suspense fallback={<FullScreenLoader title="Loading ClinicQueue" subtitle="Opening the right workspace for you." />}>
      <PageTitle />
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
    </Suspense>
  );
}

export default App;

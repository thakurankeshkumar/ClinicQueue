import api from "./axios";

export const getDoctorDashboard = () => api.get("/doctor/dashboard");

export const getDoctorProfile = () => api.get("/doctor/profile");

export const completeDoctorProfile = (data) => api.post("/doctor/profile", data);

export const updateDoctorProfile = (data) => api.patch("/doctor/profile", data);

export const getDoctorAppointments = () => api.get("/appointment");

export const approveAppointment = (id, data) => api.patch(`/appointment/${id}/approve`, data);

export const rejectAppointment = (id, data) => api.patch(`/appointment/${id}/reject`, data);

export const completeAppointment = (id) => api.patch(`/appointment/${id}/complete`);
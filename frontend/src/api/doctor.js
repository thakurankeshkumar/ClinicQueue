import api from "./axios";

export const getDoctorProfile = () => api.get("/doctor/profile");

export const updateDoctorProfile = (data) => api.patch("/doctor/profile", data);

export const getAppointmentRequests = () => api.get("/appointment");

export const approveAppointment = (id, data) => api.patch(`/appointment/${id}/approve`, data);

export const rejectAppointment = (id, data) => api.patch(`/appointment/${id}/reject`, data);

export const getAppointmentHistory = () => api.get("/appointment/history");
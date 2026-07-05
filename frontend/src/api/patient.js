import api from "./axios";

export const getPatientDashboard = () => api.get("/patient/dashboard");

export const getDoctors = () => api.get("/patient/doctors");

export const getDoctor = (id) => api.get(`/patient/doctors/${id}`);

export const bookAppointment = (data) => api.post("/appointment", data);

export const getMyAppointments = () => api.get("/patient/my-appointments");
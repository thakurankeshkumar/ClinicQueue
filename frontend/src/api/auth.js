import api from "./axios";

export const loginUser = (data) => api.post("/auth/login", data);

export const registerPatient = (data) => api.post("/auth/register/patient", data);

export const registerDoctor = (data) => api.post("/auth/register/doctor", data);

export const logoutUser = () => api.post("/auth/logout");

export const getProfile = () => api.get("/auth/profile");
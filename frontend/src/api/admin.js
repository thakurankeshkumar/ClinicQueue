import api from "./axios";

export const getPendingDoctors = () => api.get("/admin/doctors/pending");

export const approveDoctor = (id) => api.patch(`/admin/doctors/${id}/approve`);

export const rejectDoctor = (id, data) => api.patch(`/admin/doctors/${id}/reject`, data);

export const getProfileRequests = () => api.get("/admin/profile-update-requests");

export const approveProfileRequest = (id) => api.patch(`/admin/profile-update-requests/${id}/approve`);

export const rejectProfileRequest = (id, data) => api.patch(`/admin/profile-update-requests/${id}/reject`, data);
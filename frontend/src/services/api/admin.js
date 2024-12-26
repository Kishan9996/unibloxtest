import { authApi, api } from "./api";
export const adminLogin = (credentials) =>
  authApi.post("/auth/admin/login", credentials);

export const adminDiscountCodes = () => api.get("/admin/discount/list");

export const adminUserDetails = () => api.get("/admin/list-users");

export const approveDiscountCode = (data) =>
  api.post(`/discount/approve`, data);

export const deleteDiscountCodes = (id) =>
  api.delete(`/admin/discount/delete/${id}`);

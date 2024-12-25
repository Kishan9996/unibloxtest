import { authApi } from "./api";
export const adminLogin = (credentials) => authApi.post("/auth/admin/login", credentials);

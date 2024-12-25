import { authApi } from "./api";

export const signup = (userData) => authApi.post("/auth/sign-up", userData);
export const login = (credentials) => authApi.post("/auth/login", credentials);

import { api } from "./api";
const moduleBaseUrl = "/product";
export const fetchProducts = () => api.get(`${moduleBaseUrl}/list`);

import { api } from "./api";
const moduleBaseUrl = "/discount";
export const fetchDiscountCodes = () => api.get(`${moduleBaseUrl}/list`);

export const applyForDiscountCode = () => api.get(`${moduleBaseUrl}/apply`);

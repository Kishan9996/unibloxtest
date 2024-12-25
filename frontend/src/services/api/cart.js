import { api } from "./api";
const moduleBaseUrl = "/cart";
export const fetchCartItems = () => api.get(`${moduleBaseUrl}/cart-items`);

export const addToCart = () => api.get(`${moduleBaseUrl}/cart-items`);

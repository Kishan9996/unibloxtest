import { api } from "./api";
const moduleBaseUrl = "/cart";
export const fetchCartItems = () => api.get(`${moduleBaseUrl}/cart-items`);

export const addToCartApi = (data) => api.post(`${moduleBaseUrl}/add`, data);
export const removeCartItemaApi = (data) => api.post(`${moduleBaseUrl}/remove-item`, data);

export const clearCartItemsApi = (cartId) => api.get(`${moduleBaseUrl}/clear-cart/${cartId}`);


export const placeOrderCheckout = (data) => api.post(`${moduleBaseUrl}/checkout`,data);

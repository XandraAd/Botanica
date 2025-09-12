// frontend/src/store/constants.js

// API base (with /api for routes)
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Root base (no /api, for static files like /uploads)
export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export const DECOR_URL = `${API_URL}/decor`;


// Endpoints
export const USERS_URL = `${API_URL}/users`;
export const CATEGORY_URL = `${API_URL}/categories`;
export const COLLECTION_URL = `${API_URL}/collections`;
export const PRODUCT_URL = `${API_URL}/products`;
export const UPLOAD_URL = `${API_URL}/upload`;
export const ORDERS_URL = `${API_URL}/orders`;
export const PAYPAL_URL = `${API_URL}/config/paypal`;

// apiSlice.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ 
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.userInfo?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`); // capital A (convention)
      
      console.log("Token set in headers:", token);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'User', 'Order', 'Categories','Collections'], // ✅ added Categories
  endpoints: (builder) => ({}),
});

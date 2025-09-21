// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice.js';
import cartReducer from '../slices/cartSlice.js';
import { apiSlice } from '../slices/apiSlice.js'; // Import the base API slice
import decorReducer from '../slices/decorSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    decor: decorReducer, 
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: import.meta.env.NODE_ENV !== 'production',
      serializableCheck: import.meta.env.NODE_ENV !== 'production',
    }).concat(apiSlice.middleware),
});

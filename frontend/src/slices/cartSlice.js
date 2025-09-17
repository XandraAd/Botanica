import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/cart";

// Fetch cart for user
export const fetchCart = createAsyncThunk("cart/fetch", async (userId) => {
  const { data } = await axios.get(`${API_URL}/${userId}`);
  return data.cartItems;
});

// Add item
export const addToCartApi = createAsyncThunk(
  "cart/add",
  async ({ userId, item }) => {
    const { data } = await axios.post(`${API_URL}/${userId}`, item);
    return data.cartItems;
  }
);

// Update qty
export const updateCartItemQuantityApi = createAsyncThunk(
  "cart/updateQty",
  async ({ userId, _id, size, quantity }) => {
    const { data } = await axios.put(`${API_URL}/${userId}`, {
      _id,
      size,
      quantity,
    });
    return data.cartItems;
  }
);

// Remove item
export const removeFromCartApi = createAsyncThunk(
  "cart/remove",
  async ({ userId, _id, size }) => {
    const { data } = await axios.delete(`${API_URL}/${userId}`, {
      data: { _id, size },
    });
    return data.cartItems;
  }
);

// Clear cart - FIXED VERSION
export const clearCart = createAsyncThunk(
  "cart/clear",
  async (userId) => {
    const { data } = await axios.delete(`${API_URL}/clear/${userId}`);
    return data.cartItems; // Should return empty array
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: { cartItems: [], loading: false, error: null },
  reducers: {
    // Optional: Add a local clear cart reducer for immediate UI update
    clearCartLocal: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Add to cart
      .addCase(addToCartApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartApi.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(addToCartApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Update quantity
      .addCase(updateCartItemQuantityApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantityApi.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(updateCartItemQuantityApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Remove item
      .addCase(removeFromCartApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartApi.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(removeFromCartApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Clear cart - ADD THESE CASES
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload; // Should be empty array
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;

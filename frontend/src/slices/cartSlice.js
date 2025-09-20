import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { API_URL as BASE_API_URL } from "../store/constants"; 
const API_URL = `${BASE_API_URL}/cart`;


// ---------- API THUNKS (for logged-in users) ----------
export const fetchCart = createAsyncThunk("cart/fetch", async (userId) => {
  const { data } = await axios.get(`${API_URL}/${userId}`, { withCredentials: true });
  return data.cartItems;
});

export const addToCartApi = createAsyncThunk(
  "cart/add",
  async ({ userId, item }) => {
    const { data } = await axios.post(`${API_URL}/${userId}`, item, { withCredentials: true });
    return data.cartItems;
  }
);

export const updateCartItemQuantityApi = createAsyncThunk(
  "cart/updateQty",
  async ({ userId, _id, size, quantity }) => {
    const { data } = await axios.put(
      `${API_URL}/${userId}`,
      { _id, size, quantity },
      { withCredentials: true }
    );
    return data.cartItems;
  }
);

export const removeFromCartApi = createAsyncThunk(
  "cart/remove",
  async ({ userId, _id, size }) => {
    const { data } = await axios.delete(`${API_URL}/${userId}`, {
      data: { _id, size },
      withCredentials: true,
    });
    return data.cartItems;
  }
);

export const clearCart = createAsyncThunk("cart/clear", async (userId) => {
  const { data } = await axios.delete(`${API_URL}/clear/${userId}`, { withCredentials: true });
  return data.cartItems; // []
});

// ---------- LOCAL CART HELPERS (for guests) ----------
const loadLocalCart = () => {
  try {
    return localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];
  } catch {
    return [];
  }
};

const saveLocalCart = (cartItems) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

// ---------- SLICE ----------
const cartSlice = createSlice({
  name: "cart",
  initialState: { cartItems: loadLocalCart(), loading: false, error: null },
  reducers: {
    addToCartLocal: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find(
        (x) => x._id === item._id && x.size === item.size
      );

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id && x.size === existItem.size ? item : x
        );
      } else {
        state.cartItems.push(item);
      }

      saveLocalCart(state.cartItems);
    },
    removeFromCartLocal: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (x) => !(x._id === action.payload._id && x.size === action.payload.size)
      );
      saveLocalCart(state.cartItems);
    },
    clearCartLocal: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      saveLocalCart(state.cartItems);
    },
  },
  extraReducers: (builder) => {
    builder
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

      .addCase(addToCartApi.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      .addCase(updateCartItemQuantityApi.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      .addCase(removeFromCartApi.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      });
  },
});

export const {
  addToCartLocal,
  removeFromCartLocal,
  clearCartLocal,
  setCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;

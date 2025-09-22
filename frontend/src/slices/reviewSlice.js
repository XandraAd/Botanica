// src/slices/reviewSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../store/constants";

// ✅ POST review API call
export const createReview = createAsyncThunk(
  "reviews/createReview",
  async ({ productId, rating, comment }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.userInfo?.token;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // send JWT
        },
      };

      const { data } = await axios.post(
        `${BASE_URL}/api/products/${productId}/reviews`,
        { rating, comment },
        config
      );

      return { productId, review: data }; // return productId so we know where to insert
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Review failed"
      );
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;

// src/slices/decorSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../store/constants";

// Fetch all decor items
export const fetchDecor = createAsyncThunk("decor/fetchDecor", async () => {
  const { data } = await axios.get(`${API_URL}/decor`, { withCredentials: true });
  return data;
});

// Add a new decor
export const addDecor = createAsyncThunk("decor/addDecor", async (decor) => {
  const { data } = await axios.post(`${API_URL}/decor`, decor, { withCredentials: true });
  return data;
});

// Delete decor
export const deleteDecor = createAsyncThunk("decor/deleteDecor", async (id) => {
  await axios.delete(`${API_URL}/decor/${id}`, { withCredentials: true });
  return id;
});

const decorSlice = createSlice({
  name: "decor",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchDecor.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDecor.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDecor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add
      .addCase(addDecor.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Delete
      .addCase(deleteDecor.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default decorSlice.reducer;

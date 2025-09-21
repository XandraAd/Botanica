import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../store/constants";

const DECOR_URL = `${API_URL}/decor`;

// ----------------------
// Thunks
// ----------------------

// Fetch all decor items
export const fetchDecor = createAsyncThunk(
  "decor/fetchDecor",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(DECOR_URL, { withCredentials: true });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Add new decor
export const addDecor = createAsyncThunk(
  "decor/addDecor",
  async (decorData, thunkAPI) => {
    try {
      const { data } = await axios.post(DECOR_URL, decorData, { withCredentials: true });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete decor
export const deleteDecor = createAsyncThunk(
  "decor/deleteDecor",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${DECOR_URL}/${id}`, { withCredentials: true });
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ----------------------
// Slice
// ----------------------
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
      // Fetch decor
      .addCase(fetchDecor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDecor.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDecor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add decor
      .addCase(addDecor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDecor.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addDecor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete decor
      .addCase(deleteDecor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDecor.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteDecor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default decorSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../store/constants";

// Thunks
export const fetchDecor = createAsyncThunk("decor/fetch", async (_, thunkAPI) => {
  try {
    const { data } = await axios.get(`${API_URL}/decor`, { withCredentials: true });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch decor");
  }
});

export const addDecor = createAsyncThunk("decor/add", async (decor, thunkAPI) => {
  try {
    const { data } = await axios.post(`${API_URL}/decor`, decor, { withCredentials: true });
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to add decor");
  }
});

export const deleteDecor = createAsyncThunk("decor/delete", async (id, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}/decor/${id}`, { withCredentials: true });
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to delete decor");
  }
});

// Slice
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
      .addCase(fetchDecor.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchDecor.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Add
      .addCase(addDecor.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addDecor.fulfilled, (state, action) => { state.loading = false; state.items.push(action.payload); })
      .addCase(addDecor.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Delete
      .addCase(deleteDecor.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteDecor.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(d => d._id !== action.payload);
      })
      .addCase(deleteDecor.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default decorSlice.reducer;

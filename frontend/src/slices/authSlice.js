import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

// ----------------------
// Thunks
// ----------------------

// Register
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}`, userData, {
        withCredentials: true,
      });
      const userInfo = response.data;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      return userInfo;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth`, userData, {
        withCredentials: true,
      });
      const userInfo = response.data;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      return userInfo;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      localStorage.removeItem('userInfo');
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

// ----------------------
// Helpers
// ----------------------
const safeParse = (item) => {
  try {
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

// ----------------------
// Initial state
// ----------------------
const initialState = {
  userInfo: safeParse(localStorage.getItem('userInfo')),
  loading: false,
  error: null,
};

// ----------------------
// Slice
// ----------------------
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUserFromStorage: (state) => {
      const storedUser = safeParse(localStorage.getItem('userInfo'));
      state.userInfo = storedUser || null;
    },
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.userInfo = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Only export what actually exists
export const { clearError, setUserFromStorage, setCredentials } = authSlice.actions;
export default authSlice.reducer;

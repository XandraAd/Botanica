// slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../store/constants";


const USERS_URL = `${API_URL}/users`;

// ----------------------
// Thunks
// ----------------------

// Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const { data } = await axios.post(`${USERS_URL}`, userData, {
        withCredentials: true,
      });
      const userInfo = { 
        _id: data._id, 
        name: data.name, 
        email: data.email, 
        isAdmin: data.isAdmin ,
        token:data.token,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      return userInfo;
    } catch (error) {
      // If registration fails due to auth error, clear user info
      if (error.response?.status === 401) {
        localStorage.removeItem("userInfo");
      }
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await axios.post(`${USERS_URL}/auth`, credentials, {
        withCredentials: true,
      });
      
      const userInfo = { 
        _id: data._id, 
        name: data.name, 
        email: data.email, 
        isAdmin: data.isAdmin,
        token:data.token,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      
      return userInfo;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await axios.post(`${USERS_URL}/logout`, {}, { withCredentials: true });
      localStorage.removeItem("userInfo");
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);

// Get Current User (profile)
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, thunkAPI) => {
     const state = thunkAPI.getState();
    const token = state.auth.userInfo?.token || JSON.parse(localStorage.getItem("userInfo"))?.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const { data } = await axios.get(`${USERS_URL}/profile`, {
        withCredentials: true,
      });
      const userInfo = { 
        _id: data._id, 
        name: data.name, 
        email: data.email, 
        isAdmin: data.isAdmin,
        token,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      return userInfo;
    } catch (error) {
      // Clear user info on auth failure
      if (error.response?.status === 401) {
        localStorage.removeItem("userInfo");
      }
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

// ----------------------
// Helpers
// ----------------------
const safeParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

// ----------------------
// Slice
// ----------------------

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: safeParse(localStorage.getItem("userInfo")) ||null,
    loading: false,
    error: null,
  },
  reducers: {
    setUserFromStorage: (state) => {
      state.userInfo = safeParse(localStorage.getItem("userInfo"));
    },
    clearError: (state) => {
      state.error = null;
    },
   
    forceLogout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
      setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
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
        // Clear user info on auth failure
        if (action.payload?.includes('401') || action.payload?.includes('auth')) {
          state.userInfo = null;
        }
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.userInfo = null;
            localStorage.removeItem("userInfo");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userInfo = null; // This clears the state on auth failure
      });
  },
});

export const { setUserFromStorage, clearError, forceLogout,setCredentials } = authSlice.actions;
export default authSlice.reducer;
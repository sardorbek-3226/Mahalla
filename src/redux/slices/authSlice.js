import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/services/authService';
import { tokenStore } from '@/api/axiosInstance';
import { ENV } from '@/config/env';

// Note: only the user object is persisted (cookies hold the real tokens).
const initialState = {
  user: null,
  isAuthenticated: false,
  status: 'idle', // idle | loading | succeeded | failed
  bootstrapped: false, // has the initial /auth/me check run?
  error: null,
};

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const data = await authService.login(payload);
    return data.user ?? data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Kirishda xatolik');
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const data = await authService.register(payload);
    return data.user ?? data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Ro‘yxatdan o‘tishda xatolik');
  }
});

// Runs once on app start to restore the session from the stored access token.
export const fetchCurrentUser = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    // Real backend is Bearer-token based: with no stored token, /auth/me is
    // guaranteed to 401, so skip the request entirely instead of firing one
    // on every guest page load.
    if (!ENV.MOCK_AUTH && !tokenStore.access) {
      return rejectWithValue(null);
    }
    try {
      const data = await authService.me();
      return data.user ?? data;
    } catch {
      // Invalid/expired session — drop any stale tokens so requests don't keep
      // sending a bad Authorization header.
      tokenStore.clear();
      return rejectWithValue(null);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authService.logout();
  } catch {
    // Even if the request fails, clear local state.
  }
  return true;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      tokenStore.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.bootstrapped = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.bootstrapped = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
      });

    // Shared pending/fulfilled/rejected for login & register
    [login, register].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.user = action.payload;
          state.isAuthenticated = true;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    });
  },
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;

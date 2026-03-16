import { createSlice } from "@reduxjs/toolkit";


const getUserFromStorage = () => {
  try {
    const path = window.location.pathname;
    if (path.startsWith("/admin")) {
      const adminUser = localStorage.getItem("admin_user");
      return adminUser ? JSON.parse(adminUser) : null;
    } else {
      const customerUser = localStorage.getItem("customer_user");
      return customerUser ? JSON.parse(customerUser) : null;
    }
  } catch {
    return null;
  }
};
const getTokenFromStorage = () => {
  const path = window.location.pathname;
  if (path.startsWith("/admin")) {
    return localStorage.getItem("admin_token") || null;
  } else {
    return localStorage.getItem("customer_token") || null;
  }
};
const initialState = {
  user: getUserFromStorage(),
  
  token: getTokenFromStorage(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;

      const role = action.payload.user?.role;
      const key = (role === "ADMIN" || role === "SUPER_ADMIN") ? "admin" : "customer";
      localStorage.setItem(`${key}_token`, action.payload.token);
      localStorage.setItem(`${key}_user`, JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // logout: (state) => {

    //   state.user = null;
    //   state.token = null;
    //   state.error = null;
    //   state.isLoading = false;

    //   const role = state.user?.role;
    //   const key = (role === "ADMIN" || role === "SUPER_ADMIN") ? "admin" : "customer";
    //   localStorage.removeItem(`${key}_token`);
    //   localStorage.removeItem(`${key}_user`);
    // },
    logout: (state) => {
      const role = state.user?.role;
      const key = (role === "ADMIN" || role === "SUPER_ADMIN") ? "admin" : "customer";
      localStorage.removeItem(`${key}_token`);
      localStorage.removeItem(`${key}_user`);
      state.user = null;
      state.token = null;
      state.error = null;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
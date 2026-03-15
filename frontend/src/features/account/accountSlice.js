import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accounts: [],
  selectedAccount: null,
  isLoading: false,
  error: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccounts: (state, action) => {
      state.accounts = action.payload;
    },
    setSelectedAccount: (state, action) => {
      state.selectedAccount = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setAccounts,
  setSelectedAccount,
  setLoading,
  setError,
  clearError,
} = accountSlice.actions;

export default accountSlice.reducer;
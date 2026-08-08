import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User, Address } from "@prisma/client";

interface UserState {
  user: User | null;
  addresses: Address[];
  addressLoading: boolean;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  addresses: [],
  addressLoading: true,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
      state.error = null;
    },
    setAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
      state.addressLoading = false;
    },
    addAddress: (state, action: PayloadAction<Address>) => {
      state.addresses.push(action.payload);
    },
    updateAddress: (state, action: PayloadAction<Address>) => {
      const index = state.addresses.findIndex(
        (addr) => addr.id === action.payload.id,
      );
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.filter(
        (addr) => addr.id !== action.payload,
      );
    },
    setDefaultAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.map((address) => ({
        ...address,
        isDefault: address.id === action.payload,
      }));
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUserError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.addresses = [];
      state.isAuthenticated = false;
    },
  },
});

export const {
  setUser,
  setAddresses,
  addAddress,
  updateAddress,
  removeAddress,
  setDefaultAddress,
  setUserLoading,
  setUserError,
  logoutUser,
} = userSlice.actions;

export default userSlice.reducer;

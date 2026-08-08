import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ToastMessage {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
}

interface UiState {
  toasts: ToastMessage[];
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  theme: "light" | "dark" | "system";
  isLoading: boolean;
}

const initialState: UiState = {
  toasts: [],
  isMobileMenuOpen: false,
  isSearchOpen: false,
  theme: "system",
  isLoading: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<ToastMessage, "id">>) => {
      const newToast = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.toasts.push(newToast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload,
      );
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
    openMobileMenu: (state) => {
      state.isMobileMenuOpen = true;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    openSearch: (state) => {
      state.isSearchOpen = true;
    },
    closeSearch: (state) => {
      state.isSearchOpen = false;
    },
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    setTheme: (state, action: PayloadAction<UiState["theme"]>) => {
      state.theme = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  addToast,
  removeToast,
  clearToasts,
  openMobileMenu,
  closeMobileMenu,
  toggleMobileMenu,
  openSearch,
  closeSearch,
  toggleSearch,
  setTheme,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;

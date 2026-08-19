import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  category?: string;
  sku?: string;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  isOpen: boolean;
}

const initialState: WishlistState = {
  items: [],
  isOpen: false,
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlistDrawer: (state) => {
      state.isOpen = !state.isOpen;
    },
    openWishlist: (state) => {
      state.isOpen = true;
    },
    closeWishlist: (state) => {
      state.isOpen = false;
    },
    addToWishlist: (state, action: PayloadAction<Omit<WishlistItem, "addedAt">>) => {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.push({
          ...action.payload,
          addedAt: new Date().toISOString(),
        });
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    toggleWishlistItem: (state, action: PayloadAction<Omit<WishlistItem, "addedAt">>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push({
          ...action.payload,
          addedAt: new Date().toISOString(),
        });
      }
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  toggleWishlistDrawer,
  openWishlist,
  closeWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlistItem,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

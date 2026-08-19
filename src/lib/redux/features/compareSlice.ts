import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CompareProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  category?: string;
  sku?: string;
  specifications?: Record<string, any>;
  description?: string;
}

interface CompareState {
  items: CompareProduct[];
}

const initialState: CompareState = {
  items: [],
};

export const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    addToCompare: (state, action: PayloadAction<CompareProduct>) => {
      // Max 4 items in comparison matrix
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (!exists && state.items.length < 4) {
        state.items.push(action.payload);
      }
    },
    removeFromCompare: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    toggleCompareItem: (state, action: PayloadAction<CompareProduct>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else if (state.items.length < 4) {
        state.items.push(action.payload);
      }
    },
    clearCompare: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCompare,
  removeFromCompare,
  toggleCompareItem,
  clearCompare,
} = compareSlice.actions;

export default compareSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product, Category } from "@prisma/client";

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  bestsellerProducts: Product[];
  currentProduct: Product | null;
  categories: Category[];
  loading: boolean;
  error: string | null;
  filters: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: "price_asc" | "price_desc" | "newest" | "popularity";
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  bestsellerProducts: [],
  currentProduct: null,
  categories: [],
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
  },
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.loading = false;
    },
    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload;
    },
    setBestsellerProducts: (state, action: PayloadAction<Product[]>) => {
      state.bestsellerProducts = action.payload;
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
      state.loading = false;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setProductLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProductError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<ProductState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to page 1 when changing filters
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.page = 1;
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<ProductState["pagination"]>>,
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
});

export const {
  setProducts,
  setFeaturedProducts,
  setBestsellerProducts,
  setCurrentProduct,
  setCategories,
  setProductLoading,
  setProductError,
  setFilters,
  clearFilters,
  setPagination,
} = productSlice.actions;

export default productSlice.reducer;

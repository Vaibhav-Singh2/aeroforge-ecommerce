import { describe, it, expect } from "vitest";
import productReducer, {
  setProducts,
  setFeaturedProducts,
  setBestsellerProducts,
  setFilters,
  clearFilters,
  setPagination,
  setProductLoading,
  setProductError,
} from "@/lib/redux/features/productSlice";

const mockProducts: any[] = [
  { id: "prod-1", name: "Drone A", price: 25000, isFeature: true, isBestseller: false },
  { id: "prod-2", name: "Drone B", price: 45000, isFeature: false, isBestseller: true },
];

describe("Product Redux Slice", () => {
  const initialState = {
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

  it("should return the initial state", () => {
    expect(productReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should set products and clear loading", () => {
    const state = productReducer(
      { ...initialState, loading: true },
      setProducts(mockProducts),
    );
    expect(state.products).toHaveLength(2);
    expect(state.loading).toBe(false);
  });

  it("should set featured and bestseller products", () => {
    let state = productReducer(initialState, setFeaturedProducts([mockProducts[0]]));
    expect(state.featuredProducts).toHaveLength(1);

    state = productReducer(state, setBestsellerProducts([mockProducts[1]]));
    expect(state.bestsellerProducts).toHaveLength(1);
  });

  it("should update filters and reset pagination to page 1", () => {
    const startState = {
      ...initialState,
      pagination: { page: 3, limit: 12, total: 36 },
    };
    const state = productReducer(
      startState,
      setFilters({ search: "carbon", minPrice: 1000 }),
    );
    expect(state.filters.search).toBe("carbon");
    expect(state.filters.minPrice).toBe(1000);
    expect(state.pagination.page).toBe(1);
  });

  it("should clear all filters", () => {
    const startState = {
      ...initialState,
      filters: { search: "fpv", maxPrice: 50000 },
      pagination: { page: 4, limit: 12, total: 48 },
    };
    const state = productReducer(startState, clearFilters());
    expect(state.filters).toEqual({});
    expect(state.pagination.page).toBe(1);
  });

  it("should update pagination fields", () => {
    const state = productReducer(
      initialState,
      setPagination({ page: 2, total: 50 }),
    );
    expect(state.pagination.page).toBe(2);
    expect(state.pagination.total).toBe(50);
    expect(state.pagination.limit).toBe(12);
  });

  it("should handle loading and error states", () => {
    let state = productReducer(initialState, setProductLoading(true));
    expect(state.loading).toBe(true);

    state = productReducer(state, setProductError("Network timeout"));
    expect(state.error).toBe("Network timeout");
    expect(state.loading).toBe(false);
  });
});

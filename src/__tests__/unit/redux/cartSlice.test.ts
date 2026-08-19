import { describe, it, expect } from "vitest";
import cartReducer, {
  openCart,
  closeCart,
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
  clearCart,
  setCartItems,
  setCartLoading,
  setCartError,
  CartItem,
} from "@/lib/redux/features/cartSlice";

const mockProduct: any = {
  id: "prod-1",
  name: "AeroForge X-500 Carbon Pro",
  slug: "aeroforge-x500",
  price: 44999,
  sku: "AFL-X500",
  images: ["/test.jpg"],
  status: "ACTIVE",
  trackQuantity: true,
  quantity: 10,
  categoryId: "cat-1",
  isFeature: true,
  isBestseller: true,
  tags: ["fpv"],
  createdAt: new Date(),
  updatedAt: new Date(),
  weight: 385,
  specifications: null,
  compatibleParts: [],
};

const mockItem: CartItem = {
  id: "item-1",
  productId: "prod-1",
  variantId: null,
  quantity: 1,
  product: mockProduct,
};

describe("Cart Redux Slice", () => {
  const initialState = {
    items: [],
    isOpen: false,
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(cartReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle openCart and closeCart", () => {
    let state = cartReducer(initialState, openCart());
    expect(state.isOpen).toBe(true);

    state = cartReducer(state, closeCart());
    expect(state.isOpen).toBe(false);
  });

  it("should add a new item to an empty cart", () => {
    const state = cartReducer(initialState, addCartItem(mockItem));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].productId).toBe("prod-1");
    expect(state.items[0].quantity).toBe(1);
  });

  it("should increment quantity when adding the same product and variant", () => {
    const startState = {
      ...initialState,
      items: [mockItem],
    };
    const state = cartReducer(startState, addCartItem({ ...mockItem, quantity: 2 }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it("should update quantity of an existing item", () => {
    const startState = {
      ...initialState,
      items: [mockItem],
    };
    const state = cartReducer(
      startState,
      updateCartItemQuantity({ id: "item-1", quantity: 5 }),
    );
    expect(state.items[0].quantity).toBe(5);
  });

  it("should remove an item by id", () => {
    const startState = {
      ...initialState,
      items: [mockItem],
    };
    const state = cartReducer(startState, removeCartItem("item-1"));
    expect(state.items).toHaveLength(0);
  });

  it("should clear the entire cart", () => {
    const startState = {
      ...initialState,
      items: [mockItem, { ...mockItem, id: "item-2", productId: "prod-2" }],
    };
    const state = cartReducer(startState, clearCart());
    expect(state.items).toHaveLength(0);
  });

  it("should set cart loading and error states correctly", () => {
    let state = cartReducer(initialState, setCartLoading(true));
    expect(state.loading).toBe(true);

    state = cartReducer(state, setCartError("Failed to sync cart"));
    expect(state.error).toBe("Failed to sync cart");
    expect(state.loading).toBe(false);
  });

  it("should replace cart items via setCartItems", () => {
    const newItems = [mockItem, { ...mockItem, id: "item-2", quantity: 3 }];
    const state = cartReducer(initialState, setCartItems(newItems));
    expect(state.items).toHaveLength(2);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});

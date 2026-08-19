import { describe, it, expect } from "vitest";
import uiReducer, {
  openMobileMenu,
  closeMobileMenu,
  toggleMobileMenu,
  openSearch,
  closeSearch,
  toggleSearch,
  setTheme,
  addToast,
  removeToast,
  clearToasts,
} from "@/lib/redux/features/uiSlice";

describe("UI Redux Slice", () => {
  const initialState = {
    toasts: [],
    isMobileMenuOpen: false,
    isSearchOpen: false,
    theme: "system" as const,
    isLoading: false,
  };

  it("should return the initial state", () => {
    expect(uiReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle mobile menu transitions", () => {
    let state = uiReducer(initialState, openMobileMenu());
    expect(state.isMobileMenuOpen).toBe(true);

    state = uiReducer(state, closeMobileMenu());
    expect(state.isMobileMenuOpen).toBe(false);

    state = uiReducer(state, toggleMobileMenu());
    expect(state.isMobileMenuOpen).toBe(true);

    state = uiReducer(state, toggleMobileMenu());
    expect(state.isMobileMenuOpen).toBe(false);
  });

  it("should handle search modal transitions", () => {
    let state = uiReducer(initialState, openSearch());
    expect(state.isSearchOpen).toBe(true);

    state = uiReducer(state, closeSearch());
    expect(state.isSearchOpen).toBe(false);

    state = uiReducer(state, toggleSearch());
    expect(state.isSearchOpen).toBe(true);
  });

  it("should set theme", () => {
    const state = uiReducer(initialState, setTheme("dark"));
    expect(state.theme).toBe("dark");
  });

  it("should manage toast notifications", () => {
    let state = uiReducer(
      initialState,
      addToast({
        type: "success",
        title: "Added to cart",
        message: "Item was added successfully",
      }),
    );
    expect(state.toasts).toHaveLength(1);
    expect(state.toasts[0].title).toBe("Added to cart");

    const toastId = state.toasts[0].id;
    state = uiReducer(state, removeToast(toastId));
    expect(state.toasts).toHaveLength(0);
  });

  it("should clear all toasts", () => {
    let state = uiReducer(
      initialState,
      addToast({ type: "info", title: "1", message: "A" }),
    );
    state = uiReducer(
      state,
      addToast({ type: "warning", title: "2", message: "B" }),
    );
    expect(state.toasts).toHaveLength(2);

    state = uiReducer(state, clearToasts());
    expect(state.toasts).toHaveLength(0);
  });
});

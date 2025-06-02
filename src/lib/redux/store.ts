import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cartSlice";
import userReducer from "./features/userSlice";
import productReducer from "./features/productSlice";
import uiReducer from "./features/uiSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      user: userReducer,
      product: productReducer,
      ui: uiReducer,
    },
    // Adding middleware to handle serialization issues with MongoDB ObjectId
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["user/setAddresses", "product/fetchProductSuccess"],
          ignoredPaths: ["user.addresses", "product.currentProduct"],
        },
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

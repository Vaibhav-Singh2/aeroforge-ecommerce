"use client";

import { useContext, useSyncExternalStore } from "react";
import type { RootState, AppDispatch } from "./store";
import { ReduxStoreContext } from "./provider";

export const useAppDispatch = (): AppDispatch => {
  const store = useContext(ReduxStoreContext);

  if (!store) {
    throw new Error("useAppDispatch must be used within ReduxProvider");
  }

  return store.dispatch;
};

export const useAppSelector = <Selected>(
  selector: (state: RootState) => Selected,
): Selected => {
  const store = useContext(ReduxStoreContext);

  if (!store) {
    throw new Error("useAppSelector must be used within ReduxProvider");
  }

  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()),
  );
};

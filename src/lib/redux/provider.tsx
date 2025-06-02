"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { useUser } from "@clerk/nextjs";
import { makeStore } from "@/lib/redux/store";
import { setUser, setAddresses } from "@/lib/redux/features/userSlice";
import { getUserAddresses } from "@/lib/actions/user-actions";

const store = makeStore();

function StoreInitializer() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        // Set user data in Redux store
        store.dispatch(
          setUser({
            id: user.id,
            clerkUserId: user.id,
            name:
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              user.username ||
              "",
            email: user.emailAddresses[0]?.emailAddress || "",
            imageUrl: user.imageUrl || null,
            phone: user.phoneNumbers[0]?.phoneNumber || null,
            createdAt: user.createdAt || new Date(),
            updatedAt: new Date(),
          }),
        );

        // Fetch user addresses
        const fetchAddresses = async () => {
          try {
            const addresses = await getUserAddresses();
            store.dispatch(setAddresses(addresses));
          } catch (error) {
            console.error("Failed to fetch addresses:", error);
          }
        };

        fetchAddresses();
      }
    }
  }, [user, isLoaded]);

  return null;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StoreInitializer />
      {children}
    </Provider>
  );
}

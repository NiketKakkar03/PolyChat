"use client";

import { Provider } from "react-redux";
import { ClerkProvider } from "@clerk/nextjs";
import store from "@/services/store"; // Adjust the path to your store file

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <ClerkProvider>{children}</ClerkProvider>
    </Provider>
  );
};

export default Providers;
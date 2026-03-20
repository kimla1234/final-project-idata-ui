import StoreProvider from "@/app/StoreProvider";
import Login from "@/components/Auth/login/Login";
import React from "react";

export default function page() {
  return (
    <StoreProvider>
      <Login />
    </StoreProvider>
  );
}

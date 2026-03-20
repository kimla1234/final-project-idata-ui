import StoreProvider from "@/app/StoreProvider";
import Login from "@/components/Auth/login/Login";

import React, { Suspense } from "react";

export default function page() {
  return (
    <StoreProvider>
      <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    }>
      <Login />
    </Suspense>
    </StoreProvider>
  );
}

import { Register } from "@/components/Auth/register/Register";
import React, { Suspense } from "react";

export default function page() {
  return (
 
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    }>
     <Register />
    </Suspense>
  );
}

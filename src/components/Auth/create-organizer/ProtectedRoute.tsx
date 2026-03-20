"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useSelector((state: RootState) => state.auth.token);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only redirect if we are sure the component is mounted 
    // and the token is actually missing
    if (mounted && !token) {
      router.replace(`/login?redirect=${pathname}`);
    }
  }, [mounted, token, router, pathname]);

  // Prevent flicker by showing nothing until we confirm auth
  if (!mounted || !token) {
    return <div className="flex h-screen items-center justify-center">Verifying session...</div>;
  }

  return <>{children}</>;
}
"use client";


import { useGetUserQuery } from "@/redux/service/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useGetUserQuery();

  useEffect(() => {
    if (!isLoading) {
      // បើ error (អត់មាន login) ឬ user មិនមែនជា ORGANIZER
      if (isError || (user && !user.roles.includes("USER"))) {
        console.log("Access Denied: Redirecting...");
        router.push("/"); 
      }
    }
  }, [user, isLoading, isError, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        
      </div>
    );
  }

  // បើជា ORGANIZER ទើបឱ្យឃើញ content
  return user?.roles.includes("USER") ? <>{children}</> : null;
}
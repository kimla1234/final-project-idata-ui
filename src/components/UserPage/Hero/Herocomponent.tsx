"use client";

import React from "react";
import { MoveRight } from "lucide-react"; 
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux"; 
import { selectAuthentication } from "@/redux/feature/auth/authSlice";


function Herocomponent() {
  const router = useRouter();
  
  
  const isAuthenticated = useSelector(selectAuthentication);

  const handleCTA = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isAuthenticated) {
      
      router.push("/dashboard");
    } else {

      router.push("/login");
    }
  };

  return (
    <section className="relative flex h-[50vh] w-full items-center justify-center bg-[url('/seamey/background.png')] bg-cover bg-center bg-no-repeat px-4 ">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1e293b] sm:text-4xl md:text-5xl lg:text-5xl">
          Empowering Connectivity, Innovation
          <span className="mt-3 block text-[#f97316]">
            Your API platform of choice!
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base font-medium text-gray-600 md:text-xl">
          Download, Test, Document, Mock And Build APIs more Flexible.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-sm font-semibold text-gray-500">
            Ready to bring an API to life?
          </p>
          
          <button 
            onClick={handleCTA}
            className="group flex items-center gap-2 rounded-full border-2 border-[#f97316] px-8 py-3 text-sm font-bold text-[#f97316] transition-all hover:bg-[#f97316] hover:text-white active:scale-95"
          >
            Generate API
            <MoveRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Herocomponent;
import Image from "next/image";
import React from "react";
import IntegrationPage from "./IntegrationPage";
import HeroSection from "./HeroSection";
import InstructorCard from "./InstructorCard";
import InitialDesignProcess from "./InitialDesignProcess";



export default function AboutPage() {
  return (
    <div className="">
      <div>
        <HeroSection />
      </div>
      <div className="min-h-screen w-full">
        <IntegrationPage />
      </div>

      <div className=" flex items-center w-full ">
        <InstructorCard/>
      </div>

      <div>
        <InitialDesignProcess/>
      </div>

      
      <div className="flex justify-center mb-20">
        <div className="w-[76%] h-[300px] flex justify-center ">
            <Image src="/thank.png" width={1000} height={1000} alt="thank you" className="w-full object-cover border border-dashed  rounded-xl" />
        </div>
      </div>
      
    </div>
  );
}

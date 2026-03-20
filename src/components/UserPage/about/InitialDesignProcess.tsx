import Image from "next/image";
import React from "react";

const InitialDesignProcess = () => {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-white px-6 py-12 font-sans selection:bg-purple-100 md:px-12 lg:px-20">
      <div className="mx-auto flex justify-between w-full max-w-7xl">
        <div className="">
          {/* --- Header Section --- */}
          <div className="relative mb-10 md:mb-16 lg:mb-20">
            {/* Title Row 1: "Initial Design" */}
            <h1 className="text-[50px] font-bold leading-[1] tracking-tight text-[#B4AEE8] sm:text-[72px] md:text-[90px] lg:text-[120px]">
              Initial Design
            </h1>

            {/* Title Row 2: "Process" + Image Inline */}
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center md:gap-8">
              <span className="text-[50px] font-bold leading-[1] tracking-tight text-[#B4AEE8] sm:text-[72px] md:text-[90px] lg:text-[120px]">
                Process
              </span>

              {/* Scribble Image - Responsive Width */}
              <div className="w-full max-w-[280px] sm:max-w-[350px]  md:max-w-[400px] mt-3 lg:max-w-[430px]">
                <Image
                  src="/about-01.png"
                  width={1000}
                  height={200}
                  alt="Design Scribble"
                  className="h-auto w-full object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* --- Content Section --- */}
          <div className="flex flex-col-reverse justify-between gap-10  lg:flex-row lg:items-end lg:gap-20">
            {/* Left: Text Description */}
            <div className="w-full space-y-6 text-start lg:max-w-[850px]">
              <p className="text-lg font-semibold text-[#B4AEE8] md:text-xl lg:text-2xl">
                Before starting the initial design,
              </p>

              <p className="text-base leading-relaxed text-gray-500 sm:text-lg md:leading-loose lg:text-xl">
                I broke down the user flow and figured out what to include in
                the Nav Bar. I began with the desktop version because I needed
                to ensure it could seamlessly convert to mobile. Since there are
                limitations on mobile screens, I was careful about what I
                included. The goal was to keep it clean for both desktop and
                mobile, avoiding any overcrowding.
              </p>
            </div>
          </div>
        </div>
        {/* Right: Illustration */}
        <div className="flex w-full items-end justify-center  lg:w-auto lg:justify-end">
          {/* Illustration - Adjust position based on screen size */}
          <div className="relative w-[200px] sm:w-[260px] md:w-[300px]  lg:w-[320px]">
            <img
              src="/about-02.png"
              alt="Design Thinking Illustration"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialDesignProcess;

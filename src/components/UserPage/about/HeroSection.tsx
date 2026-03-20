import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-[#1D1D21] selection:bg-blue-100">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-20 lg:px-12">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          {/* --- ផ្នែកខាងឆ្វេង (Left Content) --- */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <div className="inline-flex w-fit cursor-pointer items-center rounded-full border border-dashed border-gray-300 px-4 py-1 text-sm text-gray-500 transition-colors hover:bg-gray-50">
              AI-driven workspace for law firms <span className="ml-2">→</span>
            </div>

            {/* Main Heading */}
            <div className="flex space-x-4">
              <div>
                <h1 className="text-6xl font-bold leading-[1.1] tracking-tight md:text-7xl">
                  About <br />
                  <span className="text-[#1D1D21]">ticket List</span>
                </h1>
              </div>
              <div className=" flex items-end  ">
                <Image
                  src="/logo.png"
                  width={1000}
                  height={1000}
                  alt="bg"
                  className=" w-[100px] bg-white  rounded-lg"
                />
              </div>
            </div>

            {/* Subtext */}
            <p className="max-w-lg text-lg leading-relaxed text-gray-500 md:text-xl">
              Echo is a perfect partner for businesses in digital compliance,
              governance, and workforce management.Echo is a perfect partner for businesses in digital compliance,
              
            </p>

            {/* CTAs */}
            <div className="mt-2 flex flex-wrap items-center gap-6">
              <button className="rounded-xl bg-[#1D1D21] px-5 py-3 font-semibold text-white  transition-all hover:bg-black">
                Get started
              </button>
              <button className="flex items-center gap-2 font-semibold text-[#1D1D21] transition-opacity hover:opacity-70">
                <span className="text-xl">📅</span> Schedule Consultation
              </button>
            </div>

            {/* Small Solution Card Section */}
            <div className="mt-12">
              <div className="group relative overflow-hidden rounded-3xl bg-purple-50 p-8">
                <div className="relative z-10 max-w-[60%]">
                  <span className="mb-2 block text-sm font-bold text-gray-900">
                    Law Solutions
                  </span>
                  <p className="mb-4 text-sm leading-relaxed text-gray-500">
                    Delivering agile and tech-driven legal solutions for any
                    type of businesses challenges.
                  </p>
                  <a
                    href="#"
                    className="flex items-center gap-1 text-sm font-bold text-blue-600 transition-all hover:gap-2"
                  >
                    Learn more ↗
                  </a>
                </div>
                {/* Illustration Placeholder */}
                <div className="absolute bottom-0 h-full right-0 w-[400px] opacity-80 transition-transform duration-500 group-hover:scale-105">
                  <img
                    src="/ticketbg.png"
                    alt="law-illustration"
                  />
                </div>
              </div>

              {/* Tab Navigation Below Small Card */}
              <div className="mt-4 flex flex-wrap gap-2">
                {["Solutions", "Workplace", "Advisory", "Handbooks"].map(
                  (tab, i) => (
                    <button
                      key={tab}
                      className={`rounded-xl border px-5 py-2 text-sm font-medium transition-all ${i === 0 ? "border-gray-200 bg-white shadow-sm" : "border-transparent text-gray-500 hover:bg-gray-50"}`}
                    >
                      {tab}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* --- ផ្នែកខាងស្តាំ (Right Illustration & Partners) --- */}
          <div className="relative flex h-full flex-col border-l border-dashed border-gray-200 pl-16">
            {/* Main Illustration Area */}
            <div className="relative flex  flex-grow items-start justify-center py-12">
              {/* Illustration Image */}
              <img
                src="/phone.png"
                alt="Main Illustration"
                className="h-auto w-full max-w-[310px]"
              />

              {/* Floating Badge (Icon វិមាន) */}
              <div className="animate-bounce-slow absolute right-10 top-10 flex h-[50px] w-[120px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-4 ">
                <div className="flex h-full w-full items-center justify-center rounded-lg 0">
                  <Image
                  src="/logo.png"
                  width={1000}
                  height={1000}
                  alt="bg"
                  className=" w-[200px] bg-white  rounded-lg"
                />
                </div>
              </div>
            </div>

            {/* Partners / Logos Section */}
            <div className="mt-auto  flex flex-wrap items-center gap-x-6 gap-y-6 border-t border-gray-100 pt-10">
              <div className="max-w-[120px] text-xs font-medium text-gray-400">
                50+ tech companies and professional lawyers
              </div>
              <div>
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeNxhjQM9CH4fOuOfFl0OsYihAXGZ6fJqA1Q&s"
                  width={1000}
                  height={1000}
                  alt="bg"
                  className=" w-[160px] "
                />
              </div>
              <div>
                <Image
                  src="http://asset.aditi.com.kh/images/logo/6350fb1789751.png"
                  width={1000}
                  height={1000}
                  alt="bg"
                  className=" w-[160px] "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

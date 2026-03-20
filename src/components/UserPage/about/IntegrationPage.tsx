import Image from "next/image";
import React from "react";

const IntegrationPage = () => {
  const integrations = [
    { name: "Figma", icon: "https://img.icons8.com/color/1200/nextjs.jpg", color: "text-purple-500" },
    { name: "Zapier", icon: "https://www.opc-router.de/wp-content/uploads/2023/07/Docker_150x150px-01-01-01.png", color: "text-orange-500" },
    { name: "Notion", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNou7-DlVcN5nOVq73_RDi6OAYZAzOknfzQw&s", color: "text-black" },
    { name: "Apple", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5z5fOXb71ix1CT5kcaxM533LFBC5eLtnKwg&s", color: "text-gray-900" },
    { name: "Behance", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/993px-Postgresql_elephant.svg.png", color: "text-blue-600" },
    { name: "Netflix", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/993px-Postgresql_elephant.svg.png", color: "text-red-600" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8F9FA] px-4 py-20 font-sans text-[#1D1D21]">
      {/* Background Decor (The faint grid/lines) */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Top Badge & Header */}
        <div className="mb-12 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-1.5 text-sm font-medium shadow-sm">
            <span className="text-blue-500">✦</span>
            <span className="text-gray-500">Integrations</span>
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
            Integrate with favorite tools
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-500">
            Real stories from teams transforming workflows with Beam.
          </p>
        </div>

        {/* Central Connectivity Section */}
        <div className="relative mx-auto mb-10 mt-10 flex h-[400px] w-full max-w-5xl items-center justify-center">
          {/* --- Background Decorative Lines (Optional but makes it look pro) --- */}
          <svg
            className="absolute inset-0 h-full w-full opacity-20"
            viewBox="0 0 800 400"
            fill="none"
          >
            <path
              d="M150 100 Q 300 150 400 200"
              stroke="#CBD5E1"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
            <path
              d="M650 100 Q 500 150 400 200"
              stroke="#CBD5E1"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
            <path
              d="M100 300 Q 250 250 400 200"
              stroke="#CBD5E1"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
            <path
              d="M700 300 Q 550 250 400 200"
              stroke="#CBD5E1"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
          </svg>

          {/* --- Central Main Logo (Beam) --- */}
          <div className="group relative z-20">
            <div className="flex  transform items-center justify-center rounded-[24px] bg-purple-600 shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all duration-500 group-hover:scale-110">
              <Image
                src="/logo.png"
                width={1000}
                height={1000}
                alt="bg"
                className="h-full w-[200px] rounded-lg  "
              />
            </div>
            {/* Glow effect ក្រោយ logo */}
            <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-purple-600 opacity-20 blur-3xl"></div>
          </div>

          {/* --- Scattered Icons (រាយប៉ាយជុំវិញ) --- */}

          {/* Google - Top Left */}
          <div className="animate-bounce-slow absolute left-[20%] top-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white p-2.5 shadow-md">
              <img
                src="https://img.icons8.com/color/1200/nextjs.jpg"
                alt="Google"
              />
            </div>
          </div>

          <div className="animate-bounce-slow absolute left-[20%] top-[70%]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white p-2.5 shadow-md">
              <img
                src="https://www.opc-router.de/wp-content/uploads/2023/07/Docker_150x150px-01-01-01.png"
                alt="Google"
              />
            </div>
          </div>

          

          {/* Slack - Far Left */}
          <div className="animate-pulse-slow absolute left-[5%] top-1/2 -translate-y-1/2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white p-2 shadow-md">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNou7-DlVcN5nOVq73_RDi6OAYZAzOknfzQw&s"
                alt="Slack"
              />
            </div>
          </div>

          {/* Discord - Middle Right */}
          <div className="animate-bounce-slow-delayed absolute right-[15%] top-1.5/3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white p-2.5 shadow-md">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/1280px-Tailwind_CSS_Logo.svg.png"
                alt="Discord"
              />
            </div>
          </div>

          {/* Dribbble - Far Right */}
          <div className="animate-bounce-slow absolute right-[5%] top-[70%]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white p-2 shadow-md">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5z5fOXb71ix1CT5kcaxM533LFBC5eLtnKwg&s"
                alt="Dribbble"
              />
            </div>
          </div>

          {/* Dribbble - Far Right */}
          <div className="animate-bounce-slow absolute right-[5%] top-[20%]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white p-2 shadow-md">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/993px-Postgresql_elephant.svg.png"
                alt="Dribbble"
              />
            </div>
          </div>
        </div>

        {/* Grid of Integration Cards */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-3 md:grid-cols-3">
          {integrations.map((item, idx) => (
            <div
              key={idx}
              className="group flex flex-col items-start rounded-[10px] border border-gray-100 bg-white/80 p-4  backdrop-blur-sm transition-all duration-500 ease-out "
            >
              {/* Icon & Title Row */}
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 transition-transform duration-300 group-hover:scale-110">
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#1D1D21]">
                  {item.name}
                </h3>
              </div>

              {/* Description */}
              <p className="text-[15px] font-medium leading-relaxed text-[#9BA3AF]">
                Lorem ipsum dolor sit amet elit consectetur adipiscing
                vestibulum.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationPage;

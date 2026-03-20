import React from "react";

export const Features = () => {
  const features = [
    {
      title: "Easy Search",
      desc: "Filter by location, price, ratings and find your ideal workspace in seconds",
      tag: "Law Solutions",
      icon: "🔍",
    },
    {
      title: "Book for less",
      desc: "Pay a small deposit now, and the rest when you arrive at your destination",
      tag: "Policy",
      icon: "💰",
    },
    {
      title: "Verified Spaces",
      desc: "Every space is vetted for quality, comfort, and amenities for your trust",
      tag: "Handbooks",
      icon: "✅",
    },
    {
      title: "Flexible Plan",
      desc: "Change your plans easily with simple and transparent cancellation policies",
      tag: "Advisory",
      icon: "❌",
    },
    {
      title: "Real Reviews",
      desc: "Read authentic feedback from other professionals before making your choice",
      tag: "Insurance",
      icon: "⭐",
    },
    {
      title: "Exclusive Deals",
      desc: "Access special discounts and offers available only on CoSpace platform",
      tag: "AI-Workspace",
      icon: "🏷️",
    },
  ];

  return (
    <section className="relative mt-20 overflow-hidden rounded-xl bg-[#F9FAFB] px-6 py-24">
      {/* Background Decor - ខ្សែបន្ទាត់ស្តើងៗបែប Grid */}
      

      <div className="relative  z-10 mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-20 grid grid-cols-1 items-end gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Echo Features
            </div>
            <h2 className="text-5xl font-bold leading-[1.1] tracking-tight text-gray-900 md:text-6xl">
              Every <span className="text-gray-400">draft</span> <br />
              and review matters
            </h2>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-md text-lg leading-relaxed text-gray-500">
              Ticketlist is a perfect partner for businesses in digital compliance,
              governance, and workforce management.
            </p>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative flex flex-col rounded-[10px] border border-dashed border-gray-300 bg-white p-4 transition-all duration-300 hover:border-indigo-400 hover:shadow-sm"
            >
              {/* Icon Section - រាងដូចត្រា (Badge style) */}
              <div className="mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-100 transition-transform duration-500 group-hover:rotate-12">
                  {/* ប្តូរ icon ទៅតាមស្ទីល Badge ក្នុងរូបភាព */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-white/30">
                    <span className="text-xl">{f.icon}</span>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-indigo-600">
                  {f.title}
                </h3>

                <p className="text-[15px] leading-relaxed text-gray-500">
                  Duis aute irure dolor in reprehenderit in voluptate velit es
                  se cillum dolore eu excepteur sint.
                </p>
              </div>

             
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

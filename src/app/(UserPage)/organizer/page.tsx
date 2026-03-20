import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div>
      <div className="relative flex min-h-[860px] w-full items-center justify-center overflow-hidden">
        {/* ១. Background Image Grid (បណ្ដុំរូបភាព Poster នៅខាងក្រោយ) */}
        <div className="absolute inset-0 min-h-screen">
          <div className="transform">
            {/* បញ្ចូលរូបភាព Poster កម្មវិធីផ្សេងៗនៅទីនេះ */}

            <div className="overflow-hidden">
              <img
                src={`https://i.pinimg.com/1200x/62/3b/39/623b39f03d312ce6b8f33d213ac806d5.jpg`}
                className="h-full w-full object-fill"
                alt="event poster"
              />
            </div>
          </div>
        </div>

        {/* ២. Gradient Overlay (ធ្វើឱ្យរូបភាពងងឹត ដើម្បីងាយស្រួលអានអក្សរ) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-black"></div>

        {/* ៣. Content (អក្សរ និងប៊ូតុងនៅចំកណ្ដាល) */}
        <div className="relative z-10 max-w-4xl px-4 text-center">
          {/* Badge ខាងលើ */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-md">
            <span className="text-purple-400">✦</span>
            <span className="text-sm font-medium uppercase tracking-wide text-white">
              Next-Gen Event Platform
            </span>
          </div>

          {/* ចំណងជើងធំ (Main Title) */}
          <h1 className="mb-6 text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl">
            EASY TICKETS, <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              SEAMLESS EVENTS
            </span>
          </h1>

          {/* អក្សរពិពណ៌នា (Description) */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl">
            Automate your ticketing effortlessly with ticketlist, giving you
            more time to create unforgettable experiences.
          </p>

          {/* ប៊ូតុង (Call to Action) */}
          <Link
            href="/create-organizer"
          //target="_blank" // <-- Open in new tab
            rel="noopener noreferrer" // <-- Recommended for security
            className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
          >
            Create first event
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>

          {/* Scroll Indicator */}
          <div className="absolute -bottom-32 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 opacity-50">
            <div className="h-12 w-[1px] bg-gradient-to-b from-white to-transparent"></div>
            <div className="flex h-6 w-4 justify-center rounded-full border border-white py-1">
              <div className="h-1 w-1 animate-bounce rounded-full bg-white"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

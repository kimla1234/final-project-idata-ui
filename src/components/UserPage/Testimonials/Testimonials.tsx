import React from "react";
import { Star, ChevronDown } from "lucide-react";

export const Testimonials = () => {
  const reviews = Array(6).fill({
    name: "Jessica Davis",
    role: "Product Designer",
    initials: "SJ",
    content:
      "CoSpace made finding a workspace so simple. The booking process was seamless, and I found an incredible office that perfectly fits my needs.",
  });

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto mb-12 max-w-6xl space-y-3 text-center">
        <h2 className="text-5xl font-bold leading-[1.1] tracking-tight text-gray-900 md:text-6xl">
          What our Users say to{" "}
          <span className="text-gray-400">Ticketlist</span> <br />
        </h2>
        <div className="lg:pb-2">
          <p className="max-w-full text-lg leading-relaxed text-gray-500">
            Thousands of professionals trust Ticketlist to find their ideal
            workspace.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-gray-50 bg-[#f8fafc] p-6"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dee7ff] text-xs font-bold text-[#4f75ff]">
                  {rev.initials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1e293b]">
                    {rev.name}
                  </h4>
                  <p className="text-[10px] font-medium text-gray-400">
                    {rev.role}
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className="fill-[#3b82f6] text-[#3b82f6]"
                  />
                ))}
              </div>
            </div>
            <p className="text-xs italic leading-relaxed text-gray-500">
              "{rev.content}"
            </p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl justify-end">
        <button className="flex items-center gap-2 text-sm font-bold text-[#4f75ff] transition-colors hover:text-[#3b56c4]">
          View more reviews <ChevronDown size={18} />
        </button>
      </div>
    </section>
  );
};

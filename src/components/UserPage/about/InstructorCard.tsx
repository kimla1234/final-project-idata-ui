import React from "react";
import {
  Instagram,
  Facebook,
  Linkedin,
  CheckCircle2,
  Users,
  Star,
  BookOpen,
} from "lucide-react";
import { MdOutlineVerified } from "react-icons/md";
import Image from "next/image";

const InstructorCard = () => {
  return (
    <div className=" mt-20 w-full flex-col items-center justify-center ">
      {/* Top Badge & Header */}
      <div className="mb-12 text-center ">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-1.5 text-sm font-medium shadow-sm">
          <span className="text-blue-500">✦</span>
          <span className="text-gray-500">Creator Profile</span>
        </div>
        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
          Design your{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            digital legacy
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg  leading-relaxed text-gray-400 md:text-xl">
          Connect with world-class creators and developers to transform your
          workflow with precision and style.
        </p>
      </div>
      <div className="mx-auto flex w-full flex max-w-7xl flex-col items-start gap-10 rounded-[20px] border border-gray-100 bg-white p-10 md:flex-row">
        {/* --- Left Column: Avatar & Socials --- */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-50 w-50 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-sm">
              <Image
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Andrew"
                alt="Andrew Power"
                width={1000}
                height={1000}
                unoptimized
                className="h-full w-full object-cover grayscale"
              />
            </div>
            {/* Verified Badge */}
            <div className="absolute bottom-2 right-2 rounded-full border-4 border-white bg-purple-600 p-1">
              <MdOutlineVerified className="h-6 w-6 fill-current text-white" />
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-3">
            {[Instagram, Facebook, Linkedin].map((Icon, i) => (
              <button
                key={i}
                className="rounded-full border border-gray-200 p-2.5 text-gray-600 transition-colors hover:bg-gray-50"
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        {/* --- Right Column: Content --- */}
        <div className="flex-1">
          <div className="flex flex-col items-start justify-between gap-20 md:flex-row">
            {/* Main Info */}
            <div className="space-y-4">
              <div>
                <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Creator
                </span>
                <h1 className="mt-2 text-4xl font-bold tracking-tight">
                  Chhoeurn Kimla
                </h1>
                <p className="font-medium text-gray-500">
                  Full Stack Developer
                </p>
              </div>

              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Users className="h-5 w-5 text-blue-500" />
                <span>
                  5.9K{" "}
                  <span className="font-normal text-gray-400">students</span>
                </span>
              </div>

              <button className="w-full rounded-2xl border border-gray-200 px-12 py-3 font-semibold transition-all hover:bg-gray-50 md:w-auto">
                Follow
              </button>
            </div>

            {/* Bio & Stats */}
            <div className="space-y-6 md:max-w-md">
              <div className="space-y-2 text-right md:text-left">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Bio
                </span>
                <p className="italic leading-relaxed text-gray-500">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do
                  eiusmod tempor incididunt labore et dolore magna aliqua ut
                  enim ad minim veniam commodo.
                </p>
              </div>

              <div className="flex items-center justify-between border-b border-t border-gray-50 py-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-current text-yellow-400" />
                  <span className="font-bold">
                    5/5{" "}
                    <span className="font-normal text-gray-400">
                      (1.2k ratings)
                    </span>
                  </span>
                </div>
                <div className="mx-4 h-6 w-[1px] bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-500" />
                  <span className="font-bold">
                    12{" "}
                    <span className="font-normal text-gray-400">
                      courses + certificate
                    </span>
                  </span>
                </div>
              </div>

              <button className="w-full bg-slate-50 border-gray-5 rounded-2xl border border-dashed py-4 font-bold text-primary transition-all hover:bg-purple-100">
                My Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorCard;

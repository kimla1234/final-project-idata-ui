import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white ">
      {/* Main Container with the custom "leaf" rounding from your previous request */}
      <div className="mx-auto max-w-[85%] bg-white py-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Column 1: Logo & Tagline */}
          <div className="space-y-6">
            <div className="flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm">
              {/* Simplified Logo Icon */}
              <div className="flex w-[130px] items-center text-2xl font-black tracking-tighter">
                <Image
                  src="/logo_1.png"
                  width={2000}
                  height={2000}
                  alt=""
                  className="h-full w-full"
                ></Image>
              </div>
            </div>
            <p className="leading-relaxed text-gray-500">
              Find the perfect workspace for your needs, anywhere in the world.
            </p>
          </div>

          {/* Column 2: Company */}
          <div>
            <h3 className="mb-6 text-xl font-bold text-gray-900">Company</h3>
            <ul className="space-y-4 text-gray-500">
              <li className="cursor-pointer hover:text-gray-800">About Us</li>
              <li className="cursor-pointer hover:text-gray-800">Careers</li>
              <li className="cursor-pointer hover:text-gray-800">Blog</li>
              <li className="cursor-pointer hover:text-gray-800">Partners</li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="mb-6 text-xl font-bold text-gray-900">Support</h3>
            <ul className="space-y-4 text-gray-500">
              <li className="cursor-pointer hover:text-gray-800">
                Help Center
              </li>
              <li className="cursor-pointer hover:text-gray-800">Contact Us</li>
              <li className="cursor-pointer hover:text-gray-800">FAQ</li>
              <li className="cursor-pointer hover:text-gray-800">
                Safety and Terms
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Newsletter</h3>
            <p className="text-gray-500">
              Stay updated with new spaces and offers
            </p>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-xl border border-gray-100 py-3 pl-10 pr-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <button className="absolute bottom-1 right-1 top-1 rounded-lg bg-[#9db2ef] px-3 text-white transition-colors hover:bg-[#8ca3e0]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Copyright */}
        <div className="my-4 pt-4 border-t border-t-gray-3 text-center text-textprimary">
          <p>
          © 2024 Copyright TicketList by {" "}
            <span className="text-green-700">
              <Link href="https://www.cstad.edu.kh/">Chhoeurn Kimla</Link>
            </span>
            {" "}. All rights reserved.™
          </p>
        </div>
    </footer>
  );
};

export default Footer;

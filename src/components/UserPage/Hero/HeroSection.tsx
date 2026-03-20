"use client";
import React from "react";
import Image from "next/image";
import Herocomponent from "./Herocomponent";
import { Card } from "@/components/ui/card";
import { ArrowRight, FileText, Zap, ShieldCheck, Layers, MousePointer2 } from "lucide-react";

export default function HeroSection() {
  return (
    <main className="bg-white dark:bg-slate-950">
      {/* 🎯 Herocomponent (ចំណងជើង និង ប៊ូតុងមេ) */}
      <Herocomponent />

      {/* 🎯 Banner Section (រូបភាព Dashboard) */}
      <section className="relative w-full bg-purple-50/50  dark:bg-slate-900/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center transition-transform duration-700 hover:scale-[1.01]">
            <Image
              width={1000}
              height={500}
              src="/seamey/banner.png"
              alt="Platform Preview"
              className="rounded-2xl shadow-2xl shadow-purple-200/50 dark:shadow-none"
              priority
            />
          </div>
        </div>
      </section>

      {/* 🎯 Revolution Section (Cards ៣) */}
      <section className="container mx-auto px-6 py-24">
        <div className="mx-auto mb-16 max-w-4xl rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl dark:text-white">
            Revolutionize Your <span className="text-[#f97316]">Website Design</span>
            <br /> Workflow
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Explore our essential tools for seamless website planning and design. 
            Elevate your workflow with intuitive features and powerful capabilities.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Card className="group border-none bg-slate-50 p-8 text-left transition-all hover:-translate-y-2 hover:bg-orange-50 dark:bg-slate-800 dark:hover:bg-slate-800/80">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm group-hover:bg-orange-500 group-hover:text-white dark:bg-slate-700">
                <Zap size={24} />
              </div>
              <h5 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Generate API</h5>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Revolutionize your design workflow with our visual sitemap planner. Customize page templates effortlessly.
              </p>
            </Card>

            <Card className="group border-none bg-slate-50 p-8 text-left transition-all hover:-translate-y-2 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-800/80">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm group-hover:bg-blue-500 group-hover:text-white dark:bg-slate-700">
                <Layers size={24} />
              </div>
              <h5 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Instant RESTFUL API</h5>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Streamline your design process with our wireframing tool. Create clear and precise layouts seamlessly.
              </p>
            </Card>

            <Card className="group border-none bg-slate-50 p-8 text-left transition-all hover:-translate-y-2 hover:bg-green-50 dark:bg-slate-800 dark:hover:bg-slate-800/80">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm group-hover:bg-green-500 group-hover:text-white dark:bg-slate-700">
                <ShieldCheck size={24} />
              </div>
              <h5 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Environment Testing</h5>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Visualize your ideas with our whiteboard tool. Collaborate in real-time and bring concepts to life.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 🎯 Planning Solution Section */}
      <section className="container mx-auto px-6 py-10 text-center">
        <h2 className="text-3xl font-black text-slate-900 md:text-5xl dark:text-white">
          Your Website Planning <span className="text-[#f97316]">Solution</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
          Unleash creativity effortlessly with our dynamic whiteboard. Collaborate seamlessly 
          and visualize ideas in real-time with intuitive tools.
        </p>
      </section>

      {/* 🎯 Feature Sections ( alternating layout ) */}
      <div className="container mx-auto space-y-32 px-6 py-24">
        
        {/* Section 1: Generate from URL */}
        <section className="flex flex-col items-center gap-12 md:flex-row">
          <div className="flex-1 space-y-6">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Generate API from URL</h3>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Craft structured sitemaps effortlessly, simplifying navigation and enhancing user experience for your projects.
            </p>
            <div className="flex gap-4">
              <button className="rounded-full bg-slate-900 px-8 py-3 font-bold text-white transition hover:bg-slate-700 dark:bg-white dark:text-black">Get Started</button>
              <button className="rounded-full border border-slate-200 px-8 py-3 font-bold transition hover:bg-slate-50 dark:border-slate-700">Read Doc</button>
            </div>
          </div>
          <div className="flex-1">
            <Image width={500} height={400} src="/seamey/UI-UX team.png" alt="UI Team" className="mx-auto" />
          </div>
        </section>

        {/* Section 2: Generate from Schema */}
        <section className="flex flex-col-reverse items-center gap-12 md:flex-row">
          <div className="flex-1">
            <Image width={500} height={400} src="/seamey/diagram.png" alt="Diagram" className="mx-auto" />
          </div>
          <div className="flex-1 space-y-6">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Generate API from Schema</h3>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Effortlessly collaborate and brainstorm with our versatile whiteboard tool, fostering creativity and teamwork.
            </p>
            <div className="flex gap-4">
              <button className="rounded-full bg-slate-900 px-8 py-3 font-bold text-white transition hover:bg-slate-700 dark:bg-white dark:text-black">Get Started</button>
              <button className="rounded-full border border-slate-200 px-8 py-3 font-bold transition hover:bg-slate-50 dark:border-slate-700">Read Doc</button>
            </div>
          </div>
        </section>

        {/* Section 3: Import Files */}
        <section className="flex flex-col items-center gap-12 md:flex-row">
          <div className="flex-1 space-y-6">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Generate API by import files</h3>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Craft streamlined layouts and visualize concepts effectively with our wireframing tool, enhancing your design process.
            </p>
            <div className="flex gap-4">
              <button className="rounded-full bg-slate-900 px-8 py-3 font-bold text-white transition hover:bg-slate-700 dark:bg-white dark:text-black">Get Started</button>
              <button className="rounded-full border border-slate-200 px-8 py-3 font-bold transition hover:bg-slate-50 dark:border-slate-700">Read Doc</button>
            </div>
          </div>
          <div className="flex-1">
            <Image width={500} height={400} src="/seamey/Generate files.png" alt="Files" className="mx-auto" />
          </div>
        </section>

        {/* Section 4: Input Form */}
        <section className="flex flex-col-reverse items-center gap-12 md:flex-row">
          <div className="flex-1">
            <Image width={500} height={400} src="/seamey/Forms.png" alt="Forms" className="mx-auto" />
          </div>
          <div className="flex-1 space-y-6">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Generate API by input form</h3>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Craft streamlined layouts and visualize concepts effectively with our wireframing tool, enhancing your design process.
            </p>
            <div className="flex gap-4">
              <button className="rounded-full bg-slate-900 px-8 py-3 font-bold text-white transition hover:bg-slate-700 dark:bg-white dark:text-black">Get Started</button>
              <button className="rounded-full border border-slate-200 px-8 py-3 font-bold transition hover:bg-slate-50 dark:border-slate-700">Read Doc</button>
            </div>
          </div>
        </section>
      </div>

     
    </main>
  );
}
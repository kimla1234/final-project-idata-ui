"use client";

import React, { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Download, HelpCircle, Home, Layers, PlayCircle, ShieldCheck, Zap } from "lucide-react";
import DropdownComponent from "./DropdownComponent";
import { IoCopyOutline } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa6";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

export default function Documentation() {
  const [activeTab, setActiveTab] = useState("introduction");

  return (
    <div className="h-screen w-full overflow-hidden bg-[#F8FAFC]">
      <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
        {/* --- SIDEBAR PANEL --- */}
        <ResizablePanel
          defaultSize={15}
          minSize={250}
          maxSize={300}
          className="border-r border-gray-200 bg-white"
        >
          <div className="space-y-1 p-4">
            {" "}
            {/* mt-16 ដើម្បីកុំឱ្យបាំង Header */}
            <SidebarItem
              icon={<Home size={18} />}
              label="Introduction"
              active={activeTab === "introduction"}
              onClick={() => setActiveTab("introduction")}
            />
            <SidebarItem
              icon={<PlayCircle size={18} />}
              label="Quick Start Guide"
              active={activeTab === "quickstart"}
              onClick={() => setActiveTab("quickstart")}
            />
            <SidebarItem
              icon={<HelpCircle size={18} />}
              label="API Usage"
              active={activeTab === "API Usage"}
              onClick={() => setActiveTab("API Usage")}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="bg-gray-100 transition-colors hover:bg-purple-200"
        />

        {/* --- MAIN CONTENT PANEL --- */}
        <ResizablePanel defaultSize={80}>
          <div className="h-full overflow-y-auto scroll-smooth bg-white p-8 lg:p-16">
            <div className="mx-auto mt-10 max-w-4xl">
              {activeTab === "introduction" && <IntroductionContent />}
              {activeTab === "quickstart" && <QuickStartContent />}
              {activeTab === "API Usage" && (
               <ApiUsageContent />
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

/* --- Content Components --- */

function IntroductionContent() {
  return (
    <div className="duration-500 animate-in fade-in slide-in-from-bottom-2">
      <h1 className="mb-8 flex items-center gap-2 text-3xl font-bold text-[#1E3A8A]">
        Introduction
      </h1>

      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#1E3A8A]">
          <Zap className="text-blue-600" size={20} /> Why choose iDATA?
        </h2>
        <p className="text-lg leading-relaxed text-gray-600">
          Choose iDATA for a more efficient, reliable, and streamlined API
          development experience. Join the growing number of teams who have
          transformed their API workflows with iDATA.
        </p>
      </section>

      <div className="space-y-10">
        <FeaturePoint
          title="Comprehensive Integration of Essential Features"
          desc="iDATA seamlessly integrates the best features from leading tools like Postman, Swagger, Mock, and JMeter offering an all-in-one solution for API development."
        />
        <FeaturePoint
          title="Streamlined Workflow"
          desc="iDATA simplifies the entire API lifecycle by combining documentation, debugging, mocking, and automated testing into a single platform."
        />
      </div>
    </div>
  );
}

function QuickStartContent() {
  return (
    <div className="pb-20 duration-500 animate-in fade-in slide-in-from-bottom-2">
      <h1 className="mb-4 text-3xl font-bold text-[#1E3A8A]">
        Quick Start Guide
      </h1>
      <p className="mb-8 text-gray-500">
        Follow the steps below by clicking on the togglable content to read more
        instructions.
      </p>

      {/* Usage Section */}
      <section className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <MdKeyboardDoubleArrowRight className="text-xl text-blue-600" />
          <h2 className="text-2xl font-bold text-[#1E3A8A]">
            How to use iDATA?
          </h2>
        </div>
        <p className="leading-relaxed text-gray-600">
          Welcome to the iDATA API guide. This document will help you get
          started with setting up your environment, making API requests, and
          handling responses.
        </p>
      </section>

      {/* Step 1 */}
      <StepSection
        step="Step 1: Create new project with iDATA"
        desc="We will first create a new iDATA project on your machine by running a command in the terminal, and then register our first local administrator user."
      >
        <DropdownComponent
          title="Generate API "
          content={
            <div className="space-y-2 rounded-b-lg bg-gray-50 p-4 text-sm text-gray-700">
              <p className="font-bold text-blue-900">
                To access the iDATA API, you need to obtain your API credentials from the dashboard.:
              </p>
              <p>1. Go to page dashboard</p>
              <p>2. Select your workspace </p>
              <p>
                3. Click Generate API With Schema and then click Start Generate, you will get the result
              </p>
            </div>
          }
        />
      </StepSection>

      {/* Step 2 */}
      <StepSection
        step="Step 2: Start generating API with iDATA"
        desc="You can start to generate API with iDATA by selecting one of the methods below:"
      >
        <div className="space-y-4">
          <DropdownComponent
            title="Generate with import files"
            content={
              <div className="border-t border-gray-100 bg-white p-5">
                <p className="mb-4 text-sm font-normal text-gray-600">
                  Our platform helps you create APIs by importing data from
                  Excel, JSON or SQL files.
                </p>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Note: Ensure your files are valid formats.
                </p>
              </div>
            }
          />
          <DropdownComponent
            title="Generate with Ai"
            content={
              <div className="border-t border-gray-100 bg-white p-5">
                <p className="mb-4 text-sm font-normal text-gray-600">
                  Use our AI-powered tool to automatically generate APIs from
                  your existing data sources.
                </p>
              </div>
            }
          />
          <DropdownComponent
            title="Generate with Schema"
            content={
              <div className="border-t border-gray-100 bg-white p-5">
                <p className="mb-4 text-sm font-normal text-gray-600">
                  In our platform helps you create APIs by creating schema
                  within. You just input the schema name, table name, field
                  name, and type of field. Over there, the user can link
                  relationships with other tables. 🛠 If done, click the button
                  Start Generate and you will get the result and can test it
                  immediately!
                </p>
              </div>
            }
          />
        </div>
      </StepSection>

      {/* Congratulations */}
      <div className="mt-16 rounded-2xl bg-orange-50 p-8">
        <h3 className="mb-2 text-2xl font-bold text-orange-600">
          🥳 CONGRATULATIONS!
        </h3>
        <p className="leading-relaxed text-gray-700">
          Now your content is created, published, and you have permissions to
          request it through the API. Keep on creating amazing content!
        </p>
        <p className="mt-4 font-bold italic text-orange-500">
          Good Luck, have a great day!
        </p>
      </div>
    </div>
  );
}

/* --- UI Utilities --- */

function SidebarItem({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        active
          ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
      )}
    >
      <span className={cn(active ? "text-blue-600" : "text-gray-400")}>
        {icon}
      </span>
      {label}
    </button>
  );
}

function FeaturePoint({ title, desc }: { title: string; desc: string }) {
  return (
    <section>
      <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-[#1E3A8A]">
        <span className="text-blue-400">»</span> {title}
      </h3>
      <p className="text-lg font-normal leading-relaxed text-gray-600">
        {desc}
      </p>
    </section>
  );
}

function StepSection({ step, desc, children }: any) {
  return (
    <div className="mb-8 border-t border-gray-50">
      <div className="mb-3 flex items-center gap-3">
        <MdKeyboardDoubleArrowRight className="text-xl text-blue-600" />
        <h3 className="text-xl font-bold text-[#1E3A8A]">{step}</h3>
      </div>
      <p className="mb-6 text-sm leading-relaxed text-gray-500">{desc}</p>
      {children}
    </div>
  );
}


function ApiUsageContent() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Optional: Add toast notification here
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-8 flex items-center gap-2">
        <span className="text-blue-400">»</span> API Usage Guide
      </h1>

      {/* 1. Using Endpoints */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-[#1E3A8A] mb-4 flex items-center gap-2">
          <Layers className="text-blue-600" size={20} /> 1. How to use your Endpoints?
        </h2>
        <p className="text-gray-600 mb-4">
          Once your API is created, you will receive a Base URL. You can use these endpoints in your applications (Mobile, Web, or Desktop).
        </p>
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex justify-between items-center group">
          <code className="text-blue-400 font-mono text-sm">
            https://api.idata.fit/api/v1/engine-your-project-key/resource
          </code>
          <button 
            onClick={() => copyToClipboard('https://api.idata.fit/api/v1/engine-your-project-key/resource')}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <IoCopyOutline size={18} />
          </button>
        </div>
      </section>

      {/* 2. Using with Frontend (Private API) */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-[#1E3A8A] mb-4 flex items-center gap-2">
          <ShieldCheck className="text-green-600" size={20} /> 2. Using Private APIs in Frontend
        </h2>
        <p className="text-gray-600 mb-4">
          If your API is set to **Private**, you must include your **API Key** in the Header every time you fetch data:
        </p>
        <div className="bg-gray-900 p-5 rounded-xl font-mono text-xs text-green-400 overflow-x-auto leading-relaxed whitespace-pre">
{`// Example using Fetch API

const response = await fetch('https://api.idata.fit/v1/resource', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_SECRET_API_KEY' // Insert your API Key here
  }
});

const data = await response.json();
console.log(data);`}
        </div>
      </section>

      {/* 3. Download & Export */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-[#1E3A8A] mb-4 flex items-center gap-2">
          <Download className="text-purple-600" size={20} /> 3. Download & Export
        </h2>
        <p className="text-gray-600 mb-4">
          iDATA allows you to export your API definitions instantly for use in other tools.
        </p>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-all group">
            <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Export as JSON (Postman)</h4>
            <p className="text-xs text-gray-500">Download the configuration file to import directly into Postman for testing.</p>
          </div>
        </div>
      </section>

      {/* 4. Using Swagger UI */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
          <PlayCircle size={20} /> 4. Interactive Swagger UI
        </h2>
        <p className="text-gray-600 mb-4">
          You can test your APIs directly in the browser without any external tools using our built-in Swagger UI:
        </p>
        <div className="p-5 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
            <li>Click the <strong>"Try it out"</strong> button on the endpoint you want to test.</li>
            <li>Fill in the Parameters (if any) and click <strong>"Execute"</strong>.</li>
            <li>You will see the Response (JSON data) and Status Code (200, 404, etc.) immediately.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
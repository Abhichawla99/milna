import React from "react";
import { BentoDemo } from "@/frontend/components/ui/bento-demo";

const BentoDemoPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 mb-4">
            Milna Features
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Discover how Milna transforms your website visitors into booked demos and captured leads with intelligent AI conversations.
          </p>
        </div>
        
        <BentoDemo />
      </div>
    </div>
  );
};

export default BentoDemoPage;

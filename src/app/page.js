"use client";

import { useState } from "react";
import HomeContent from "./home/HomeContent";
import AboutContent from "./about/AboutContent";
import CalculatorContent from './calculator/CalculatorContent';


export default function HomePage() {
  const [activeTab, setActiveTab] = useState("home"); // home, calculator, about

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Lufga, sans-serif' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-[#064e3b] text-white p-4 flex justify-center space-x-20 shadow-md z-50">
        <button
          onClick={() => setActiveTab("home")}
          className={`font-semibold border-b-2 ${activeTab === "home" ? "text-green-100 border-white" : "border-transparent hover:text-green-100 hover:border-white"}`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab("calculator")}
          className={`font-semibold border-b-2 ${activeTab === "calculator" ? "text-green-100 border-white" : "border-transparent hover:text-green-100 hover:border-white"}`}
        >
          Calculator
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`font-semibold border-b-2 ${activeTab === "about" ? "text-green-100 border-white" : "border-transparent hover:text-green-100 hover:border-white"}`}
        >
          About Us
        </button>
      </header>

      <div className="pt-28 max-w-4xl mx-auto p-4 text-green-900">
        {activeTab === "home" && <HomeContent />}
        {activeTab === "calculator" && <CalculatorContent />}
        {activeTab === "about" && <AboutContent />}
      </div>
    </div>
  );
}

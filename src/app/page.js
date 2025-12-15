"use client";

import { useState } from "react";
import HomeContent from "./home/HomeContent";
import AboutContent from "./about/AboutContent";
import CalculatorContent from "./calculator/CalculatorContent";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* --- Fixed Header --- */}
      <header className="fixed top-0 left-0 w-full bg-[#004d40] text-white shadow-lg z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-center space-x-12">
          
          {["home", "calculator", "about"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-bold uppercase tracking-wider px-2 py-1 border-b-2 transition-all duration-300 ${
                activeTab === tab
                  ? "border-white text-white"
                  : "border-transparent text-green-200 hover:text-white hover:border-green-300"
              }`}
            >
              {tab === "about" ? "About Us" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}

        </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="pt-24 pb-12 max-w-6xl mx-auto px-6">
        
        {/* Pass setActiveTab to HomeContent so the button works! */}
        {activeTab === "home" && (
          <HomeContent onNavigate={() => setActiveTab("calculator")} />
        )}

        {activeTab === "calculator" && (
          <div className="max-w-6xl mx-auto">
             <CalculatorContent />
          </div>
        )}
        
        {activeTab === "about" && (
          <AboutContent />
        )}
        
      </main>
    </div>
  );
}
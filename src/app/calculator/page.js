"use client";

import Link from "next/link";
import CalculatorContent from "./CalculatorContent";

export default function CalculatorPage() {
  return (
    // 1. Force the page to be at least full screen height with WHITE background and BLACK text
    <div className="min-h-screen bg-white text-black font-sans">
      
      {/* 2. Top Navigation Bar (Dark Green) */}
      <nav className="bg-[#004d40] text-white py-4 px-6 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-center gap-10 text-sm font-semibold uppercase tracking-wide">
          <Link href="/" className="hover:text-gray-300 transition">
            Home
          </Link>
          <Link href="/calculator" className="border-b-2 border-white pb-1">
            Calculator
          </Link>
          <Link href="/about" className="hover:text-gray-300 transition">
            About Us
          </Link>
        </div>
      </nav>

      {/* 3. Main Content Container */}
      <main className="max-w-4xl mx-auto mt-10 p-6">
        <CalculatorContent />
      </main>
      
    </div>
  );
}
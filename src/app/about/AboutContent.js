"use client";

export default function AboutContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-white p-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
      <p className="text-lg md:text-xl text-green-900">
        This app was built using Next.js, React, and Tailwind CSS. It helps you compute numerical solutions for functions and export results with formulas.
      </p>
    </div>
  );
}

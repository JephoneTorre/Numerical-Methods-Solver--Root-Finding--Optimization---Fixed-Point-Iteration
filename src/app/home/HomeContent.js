"use client";

import React from "react";

export default function HomeContent() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Lufga, sans-serif' }}>
      <div className="pt-28 max-w-4xl mx-auto p-4 text-green-900">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to the Numerical Methods App</h1>
          <p className="text-lg md:text-xl text-green-900 mb-4">
            This web application provides an interactive way to explore numerical methods such as Bisection, Interval Halving, and Fixed-Point Iteration. 
            Input your function, run calculations step by step, and view detailed results or export them to Excel.
          </p>
          <p className="text-lg md:text-xl text-green-900">
            Click on the Calculator tab to start solving!
          </p>
        </div>
      </div>
    </div>
  );
}

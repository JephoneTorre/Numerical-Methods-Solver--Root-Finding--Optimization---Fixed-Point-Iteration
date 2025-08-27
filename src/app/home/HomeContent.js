"use client";

import Link from "next/link";

export default function HomeContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-5xl md:text-6xl font-bold mb-6">
        Welcome to the Numerical Methods App
      </h1>
      <p className="text-lg md:text-xl text-green-900 mb-4">
        Explore numerical methods like Bisection, Interval Halving, and Fixed-Point Iteration.
      </p>
      <p className="text-lg md:text-xl text-green-900 mb-6">
        Click the button below to start solving!
      </p>

      <Link href="/calculator">
        <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
          Calculate
        </button>
      </Link>
    </div>
  );
}

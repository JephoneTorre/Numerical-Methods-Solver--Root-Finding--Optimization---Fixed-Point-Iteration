"use client";

import { useRouter } from "next/navigation";

export default function HomeContent() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-10">
      <h1 className="text-6xl md:text-6xl font-bold mb-12">
        Bisection Method for Optimization Application
      </h1>
      <p className="text-xl md:text-1xl text-green-900 mb-10 max-w-4xl">
        Make your life easier with our Bisection Method Calculator! 
      </p>
      <p className="text-xl md:text-1xl text-green-900 mb-10 max-w-4xl">
        This web application allows you to find roots of continuous functions quickly and accurately using the
        Bisection Method. Whether you're a student, engineer, or enthusiast, our user-friendly
        interface and step-by-step guidance will help you master numerical methods with ease.
      </p>

      {/* Button to calculator */}
      <button
        onClick={() => router.push("/calculator")}
        className="bg-blue-600 text-white text-lg px-8 py-4 rounded-lg hover:bg-blue-700 transition mb-32"
      >
        Go to Calculator
      </button>

      <div className="mt-40 max-w-5xl text-left text-gray-800 space-y-12">
        <div>
          <h2 className="text-4xl font-semibold mb-5">Purpose of this Web App</h2>
          <p className="text-lg md:text-xl">
            This web application was created to provide students, engineers, and enthusiasts
            with an interactive platform to learn and practice numerical methods for solving
            mathematical problems that cannot be solved analytically.
          </p>
        </div>

        <div className="mt-20">
          <h2 className="text-4xl font-semibold mb-5">Why Numerical Methods?</h2>
          <p className="text-lg md:text-xl">
            Numerical methods help approximate solutions to equations, optimize functions, 
            and analyze convergence efficiently. They are crucial in engineering, physics, 
            and applied mathematics for problems that are difficult or impossible to solve 
            by hand.
          </p>
        </div>
      </div>
    </div>
  );
}

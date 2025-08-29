"use client";

export default function HomeContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-5xl md:text-6xl font-bold mb-6">
        Welcome to the Numerical Methods App
      </h1>
      <p className="text-lg md:text-xl text-green-900 mb-4">
        Explore numerical methods like Bisection, Interval Halving, and Fixed-Point Iteration.
      </p>

      <div className="mt-8 max-w-3xl text-left text-gray-800">
        <h2 className="text-2xl font-semibold mb-2">Purpose of this Web App</h2>
        <p className="mb-4">
          This web application was created to provide students, engineers, and enthusiasts
          with an interactive platform to learn and practice numerical methods for solving
          mathematical problems that cannot be solved analytically.
        </p>

        <h2 className="text-2xl font-semibold mb-2">Why Numerical Methods?</h2>
        <p>
          Numerical methods help approximate solutions to equations, optimize functions, 
          and analyze convergence efficiently. They are crucial in engineering, physics, 
          and applied mathematics for problems that are difficult or impossible to solve 
          by hand.
        </p>
      </div>
    </div>
  );
}
